import {
	type ColumnDef,
	type ColumnFiltersState,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	type Table,
	type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { DataGrid } from "@/components/DataGrid";
import type { ProjectUpdateInput } from "@/utils/project-form";
import type { BudgetRangeFilter } from "@/utils/project-table";
import {
	budgetRangeFilter,
	projectMatchesGlobalFilter,
} from "@/utils/project-table";
import { ProjectsToolbar } from "./ProjectsToolbar";
import type { Project } from "./projects-shared";

type ProjectsTableProps = {
	projects: Project[];
	// biome-ignore lint/suspicious/noExplicitAny: ColumnDef is invariant in TValue; allow mixed column value types.
	columns: ColumnDef<Project, any>[];
	sorting: SortingState;
	onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
	globalFilter: string;
	onGlobalFilterChange: React.Dispatch<React.SetStateAction<string>>;
	columnVisibility: VisibilityState;
	onColumnVisibilityChange: React.Dispatch<
		React.SetStateAction<VisibilityState>
	>;
	columnFilters: ColumnFiltersState;
	statusFilter: "all" | ProjectUpdateInput["status"];
	onStatusFilterChange: React.Dispatch<
		React.SetStateAction<"all" | ProjectUpdateInput["status"]>
	>;
	budgetMin: string;
	budgetMax: string;
	onBudgetMinChange: React.Dispatch<React.SetStateAction<string>>;
	onBudgetMaxChange: React.Dispatch<React.SetStateAction<string>>;
	onClearFilters: () => void;
	disableClear: boolean;
	searchId: string;
	budgetMinId: string;
	budgetMaxId: string;
};

export function ProjectsTable({
	projects,
	columns,
	sorting,
	onSortingChange,
	globalFilter,
	onGlobalFilterChange,
	columnVisibility,
	onColumnVisibilityChange,
	columnFilters,
	statusFilter,
	onStatusFilterChange,
	budgetMin,
	budgetMax,
	onBudgetMinChange,
	onBudgetMaxChange,
	onClearFilters,
	disableClear,
	searchId,
	budgetMinId,
	budgetMaxId,
}: ProjectsTableProps) {
	const ToolbarComponent = React.useCallback(
		({ table }: { table: Table<Project> }) => (
			<ProjectsToolbar
				table={table}
				searchId={searchId}
				budgetMinId={budgetMinId}
				budgetMaxId={budgetMaxId}
				globalFilter={globalFilter}
				onGlobalFilterChange={onGlobalFilterChange}
				statusFilter={statusFilter}
				onStatusFilterChange={onStatusFilterChange}
				budgetMin={budgetMin}
				budgetMax={budgetMax}
				onBudgetMinChange={onBudgetMinChange}
				onBudgetMaxChange={onBudgetMaxChange}
				onClearFilters={onClearFilters}
				disableClear={disableClear}
			/>
		),
		[
			budgetMax,
			budgetMaxId,
			budgetMin,
			budgetMinId,
			disableClear,
			globalFilter,
			onBudgetMaxChange,
			onBudgetMinChange,
			onClearFilters,
			onGlobalFilterChange,
			onStatusFilterChange,
			searchId,
			statusFilter,
		],
	);

	return (
		<DataGrid
			data={projects}
			columns={columns}
			emptyState="No projects match your filters."
			tableOptions={{
				state: {
					sorting,
					globalFilter,
					columnVisibility,
					columnFilters,
				},
				onSortingChange,
				onGlobalFilterChange,
				onColumnVisibilityChange,
				globalFilterFn: (row, _columnId, filterValue) =>
					projectMatchesGlobalFilter(
						row.original as Project,
						String(filterValue ?? ""),
					),
				filterFns: {
					budgetRange: (row, columnId, value) =>
						budgetRangeFilter(
							row.getValue(columnId),
							value as BudgetRangeFilter,
						),
				},
				getFilteredRowModel: getFilteredRowModel(),
				getSortedRowModel: getSortedRowModel(),
			}}
			ToolbarComponent={ToolbarComponent}
		/>
	);
}
