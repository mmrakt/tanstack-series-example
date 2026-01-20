import { describe, expect, it } from "vitest";
import {
	budgetRangeFilter,
	projectMatchesGlobalFilter,
	summarizeProjects,
} from "./project-table";

type Project = Parameters<typeof summarizeProjects>[0][number];

const sampleProjects: Project[] = [
	{
		id: 1,
		tenantId: "tenant-1",
		name: "Alpha Initiative",
		budget: 120000,
		status: "active",
		createdAt: new Date("2024-01-01T00:00:00Z"),
	},
	{
		id: 2,
		tenantId: "tenant-1",
		name: "Beta Rollout",
		budget: 45000,
		status: "completed",
		createdAt: new Date("2024-02-01T00:00:00Z"),
	},
];

describe("projectMatchesGlobalFilter", () => {
	it("matches on name, status, and budget", () => {
		expect(projectMatchesGlobalFilter(sampleProjects[0], "alpha")).toBe(true);
		expect(projectMatchesGlobalFilter(sampleProjects[0], "ACTIVE")).toBe(true);
		expect(projectMatchesGlobalFilter(sampleProjects[1], "45000")).toBe(true);
		expect(projectMatchesGlobalFilter(sampleProjects[1], "gamma")).toBe(false);
	});
});

describe("budgetRangeFilter", () => {
	it("filters values by min and max", () => {
		expect(budgetRangeFilter(100, { min: 50 })).toBe(true);
		expect(budgetRangeFilter(40, { min: 50 })).toBe(false);
		expect(budgetRangeFilter(100, { max: 80 })).toBe(false);
		expect(budgetRangeFilter(70, { min: 50, max: 80 })).toBe(true);
	});
});

describe("summarizeProjects", () => {
	it("returns counts and total budget", () => {
		const summary = summarizeProjects(sampleProjects);
		expect(summary.count).toBe(2);
		expect(summary.totalBudget).toBe(165000);
		expect(summary.statusCounts.active).toBe(1);
		expect(summary.statusCounts.completed).toBe(1);
	});
});
