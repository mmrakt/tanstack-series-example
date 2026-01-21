import { projectStatuses } from "@/features/projects/schema";
import { currencyFormatter } from "@/features/projects/shared";
import type { summarizeProjects } from "@/features/projects/table-utils";

type ProjectSummary = ReturnType<typeof summarizeProjects>;

type ProjectsSummaryProps = {
	totalSummary: ProjectSummary;
	filteredSummary: ProjectSummary;
};

export function ProjectsSummary({
	totalSummary,
	filteredSummary,
}: ProjectsSummaryProps) {
	return (
		<div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
			<div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
				<span className="rounded-full bg-slate-900 px-3 py-1">
					Total: {totalSummary.count}
				</span>
				<span className="rounded-full bg-slate-900 px-3 py-1">
					Visible: {filteredSummary.count}
				</span>
				<span className="rounded-full bg-slate-900 px-3 py-1">
					Budget: {currencyFormatter.format(filteredSummary.totalBudget)}
				</span>
			</div>
			<div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
				{projectStatuses.map((status) => (
					<span key={status} className="rounded-full bg-slate-900 px-2 py-1">
						{status}: {filteredSummary.statusCounts[status]}
					</span>
				))}
			</div>
		</div>
	);
}
