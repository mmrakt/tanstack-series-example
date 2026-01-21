import type { projects } from "@/db/schema";
import { projectStatuses } from "./schema";

type Project = typeof projects.$inferSelect;
type ProjectStatus = (typeof projectStatuses)[number];

export type BudgetRangeFilter = {
	min?: number;
	max?: number;
};

export function projectMatchesGlobalFilter(
	project: Project,
	query: string,
): boolean {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return true;

	const budgetText = project.budget.toString();
	return (
		project.name.toLowerCase().includes(normalized) ||
		project.status.toLowerCase().includes(normalized) ||
		budgetText.includes(normalized)
	);
}

export function budgetRangeFilter(value: number, range: BudgetRangeFilter) {
	if (range.min !== undefined && value < range.min) return false;
	if (range.max !== undefined && value > range.max) return false;
	return true;
}

export function summarizeProjects(projectsList: Project[]) {
	const statusCounts = projectStatuses.reduce(
		(acc, status) => {
			acc[status] = 0;
			return acc;
		},
		{} as Record<ProjectStatus, number>,
	);

	let totalBudget = 0;
	for (const project of projectsList) {
		totalBudget += project.budget;
		const status = project.status as ProjectStatus;
		if (status in statusCounts) {
			statusCounts[status] += 1;
		}
	}

	return {
		count: projectsList.length,
		totalBudget,
		statusCounts,
	};
}
