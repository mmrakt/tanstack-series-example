import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnFiltersState,
	createColumnHelper,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/db-collections/provider";
import { ProjectEditor } from "@/features/projects/components/ProjectEditor";
import { ProjectsSummary } from "@/features/projects/components/ProjectsSummary";
import { ProjectsTable } from "@/features/projects/components/ProjectsTable";
import { projectsQueryOptions } from "@/features/projects/queries";
import type { ProjectUpdateInput } from "@/features/projects/schema";
import { currencyFormatter, type Project } from "@/features/projects/shared";
import {
	type BudgetRangeFilter,
	budgetRangeFilter,
	projectMatchesGlobalFilter,
	summarizeProjects,
} from "@/features/projects/table-utils";

const columnHelper = createColumnHelper<Project>();

export const Route = createFileRoute("/dashboard/projects")({
	component: ProjectsPage,
	loader: async ({ context }) =>
		await context.queryClient.ensureQueryData(projectsQueryOptions()),
});

function ProjectsPage() {
	const { projects: projectsCollection } = useCollections();
	const { data: projects = [], collection } = useLiveQuery(projectsCollection);
	const [editingId, setEditingId] = React.useState<number | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);
	const [savingId, setSavingId] = React.useState<number | null>(null);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [statusFilter, setStatusFilter] = React.useState<
		"all" | ProjectUpdateInput["status"]
	>("all");
	const [budgetMin, setBudgetMin] = React.useState("");
	const [budgetMax, setBudgetMax] = React.useState("");
	const searchId = React.useId();
	const budgetMinId = React.useId();
	const budgetMaxId = React.useId();

	const budgetFilter = React.useMemo<BudgetRangeFilter>(() => {
		const minValue = Number.parseInt(budgetMin, 10);
		const maxValue = Number.parseInt(budgetMax, 10);
		return {
			min: Number.isNaN(minValue) ? undefined : minValue,
			max: Number.isNaN(maxValue) ? undefined : maxValue,
		};
	}, [budgetMin, budgetMax]);

	const selectedProject = React.useMemo(
		() => projects.find((project) => project.id === editingId) ?? null,
		[editingId, projects],
	);

	const columnFilters = React.useMemo<ColumnFiltersState>(() => {
		const nextFilters: ColumnFiltersState = [];
		if (statusFilter !== "all") {
			nextFilters.push({ id: "status", value: statusFilter });
		}
		if (budgetFilter.min !== undefined || budgetFilter.max !== undefined) {
			nextFilters.push({ id: "budget", value: budgetFilter });
		}
		return nextFilters;
	}, [budgetFilter, statusFilter]);

	const filteredProjects = React.useMemo(
		() =>
			projects.filter((project) => {
				if (!projectMatchesGlobalFilter(project, globalFilter)) return false;
				if (statusFilter !== "all" && project.status !== statusFilter) {
					return false;
				}
				return budgetRangeFilter(project.budget, budgetFilter);
			}),
		[projects, globalFilter, statusFilter, budgetFilter],
	);

	const totalSummary = React.useMemo(
		() => summarizeProjects(projects),
		[projects],
	);
	const filteredSummary = React.useMemo(
		() => summarizeProjects(filteredProjects),
		[filteredProjects],
	);

	const columns = React.useMemo(
		() => [
			columnHelper.accessor("id", { header: "ID" }),
			columnHelper.accessor("name", {
				header: "Project Name",
				enableGlobalFilter: true,
			}),
			columnHelper.accessor("budget", {
				header: "Budget",
				enableGlobalFilter: true,
				filterFn: (row, columnId, value) =>
					budgetRangeFilter(row.getValue(columnId), value as BudgetRangeFilter),
				cell: (info) => currencyFormatter.format(info.getValue()),
			}),
			columnHelper.accessor("status", {
				header: "Status",
				enableGlobalFilter: true,
				filterFn: (row, columnId, value) => row.getValue(columnId) === value,
				cell: (info) => (
					<span
						className={`rounded-full px-2 py-1 text-xs font-bold ${
							info.getValue() === "active"
								? "bg-green-900 text-green-300"
								: info.getValue() === "completed"
									? "bg-blue-900 text-blue-300"
									: "bg-yellow-900 text-yellow-300"
						}`}
					>
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.accessor("createdAt", {
				header: "Created At",
				cell: (info) => {
					const value = info.getValue();
					return value ? new Date(value).toLocaleDateString() : "-";
				},
			}),
			columnHelper.display({
				id: "actions",
				header: "Actions",
				enableSorting: false,
				enableColumnFilter: false,
				enableHiding: false,
				cell: (info) => {
					const isEditing = editingId === info.row.original.id;
					return (
						<Button
							type="button"
							variant={isEditing ? "secondary" : "outline"}
							size="sm"
							onClick={() => setEditingId(info.row.original.id)}
							disabled={savingId === info.row.original.id}
						>
							{isEditing ? "Editing" : "Edit"}
						</Button>
					);
				},
			}),
		],
		[editingId, savingId],
	);

	const hasActiveFilters =
		globalFilter.length > 0 ||
		statusFilter !== "all" ||
		budgetMin.length > 0 ||
		budgetMax.length > 0;

	const handleClearFilters = React.useCallback(() => {
		setGlobalFilter("");
		setStatusFilter("all");
		setBudgetMin("");
		setBudgetMax("");
		setSorting([]);
	}, []);

	const handleSave = React.useCallback(
		async (values: ProjectUpdateInput) => {
			setSaveError(null);
			setSavingId(values.id);
			try {
				const tx = collection.update(values.id, (draft) => {
					draft.name = values.name;
					draft.budget = values.budget;
					draft.status = values.status;
				});
				await tx.isPersisted.promise;
				const updated = collection.get(values.id);
				if (!updated) {
					throw new Error("Project not found");
				}
				return updated;
			} catch (error) {
				setSaveError("Failed to save changes. Please try again.");
				throw error;
			} finally {
				setSavingId(null);
			}
		},
		[collection],
	);

	return (
		<div className="p-8 space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-3xl font-bold text-white">Projects</h1>
				{saveError ? <p className="text-sm text-red-400">{saveError}</p> : null}
			</div>
			<ProjectsSummary
				totalSummary={totalSummary}
				filteredSummary={filteredSummary}
			/>
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
				<ProjectsTable
					projects={projects}
					columns={columns}
					sorting={sorting}
					onSortingChange={setSorting}
					globalFilter={globalFilter}
					onGlobalFilterChange={setGlobalFilter}
					columnVisibility={columnVisibility}
					onColumnVisibilityChange={setColumnVisibility}
					columnFilters={columnFilters}
					statusFilter={statusFilter}
					onStatusFilterChange={setStatusFilter}
					budgetMin={budgetMin}
					budgetMax={budgetMax}
					onBudgetMinChange={setBudgetMin}
					onBudgetMaxChange={setBudgetMax}
					onClearFilters={handleClearFilters}
					disableClear={!hasActiveFilters && sorting.length === 0}
					searchId={searchId}
					budgetMinId={budgetMinId}
					budgetMaxId={budgetMaxId}
				/>
				<ProjectEditor
					project={selectedProject}
					isSaving={savingId !== null}
					onClose={() => setEditingId(null)}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
}
