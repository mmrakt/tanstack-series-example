import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type ProjectUpdateInput, projectStatuses } from "@/utils/project-form";
import type { Project } from "./projects-shared";
import { budgetRange } from "./projects-shared";

type ProjectsToolbarProps = {
	table: Table<Project>;
	searchId: string;
	budgetMinId: string;
	budgetMaxId: string;
	globalFilter: string;
	onGlobalFilterChange: (value: string) => void;
	statusFilter: "all" | ProjectUpdateInput["status"];
	onStatusFilterChange: (value: "all" | ProjectUpdateInput["status"]) => void;
	budgetMin: string;
	budgetMax: string;
	onBudgetMinChange: (value: string) => void;
	onBudgetMaxChange: (value: string) => void;
	onClearFilters: () => void;
	disableClear: boolean;
};

export function ProjectsToolbar({
	table,
	searchId,
	budgetMinId,
	budgetMaxId,
	globalFilter,
	onGlobalFilterChange,
	statusFilter,
	onStatusFilterChange,
	budgetMin,
	budgetMax,
	onBudgetMinChange,
	onBudgetMaxChange,
	onClearFilters,
	disableClear,
}: ProjectsToolbarProps) {
	return (
		<div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-4">
			<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_140px_140px_auto]">
				<div className="space-y-2">
					<Label htmlFor={searchId} className="text-slate-200">
						Search
					</Label>
					<Input
						id={searchId}
						placeholder="Search by name, status, or budget"
						value={globalFilter}
						onChange={(event) => onGlobalFilterChange(event.target.value)}
						className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-slate-200">Status</Label>
					<Select
						value={statusFilter}
						onValueChange={(value) =>
							onStatusFilterChange(
								value as "all" | ProjectUpdateInput["status"],
							)
						}
					>
						<SelectTrigger className="w-full border-slate-700 bg-slate-950 text-slate-100">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							{projectStatuses.map((status) => (
								<SelectItem key={status} value={status}>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor={budgetMinId} className="text-slate-200">
						Budget min
					</Label>
					<Input
						id={budgetMinId}
						type="number"
						min={budgetRange.min}
						max={budgetRange.max}
						step={budgetRange.step}
						value={budgetMin}
						onChange={(event) => onBudgetMinChange(event.target.value)}
						className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor={budgetMaxId} className="text-slate-200">
						Budget max
					</Label>
					<Input
						id={budgetMaxId}
						type="number"
						min={budgetRange.min}
						max={budgetRange.max}
						step={budgetRange.step}
						value={budgetMax}
						onChange={(event) => onBudgetMaxChange(event.target.value)}
						className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
					/>
				</div>
				<div className="flex items-end justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={onClearFilters}
						disabled={disableClear}
					>
						Clear filters
					</Button>
				</div>
			</div>

			<details className="rounded-md border border-slate-800 bg-slate-900/40 p-3">
				<summary className="cursor-pointer text-sm text-slate-200">
					Columns
				</summary>
				<div className="mt-3 grid gap-2 sm:grid-cols-2">
					{table
						.getAllLeafColumns()
						.filter((column) => column.getCanHide())
						.map((column) => (
							<label
								key={column.id}
								className="flex items-center gap-2 text-xs text-slate-300"
							>
								<input
									type="checkbox"
									checked={column.getIsVisible()}
									onChange={() => column.toggleVisibility()}
									className="h-4 w-4 rounded border border-slate-600 accent-emerald-500"
								/>
								{column.columnDef.header?.toString() ?? column.id}
							</label>
						))}
				</div>
			</details>
		</div>
	);
}
