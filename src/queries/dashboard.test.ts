import { describe, expect, it, vi } from "vitest";

vi.mock("@/functions/dashboard", () => ({
	getProjects: vi.fn(async () => ["projects"]),
	getEmployees: vi.fn(async () => ["employees"]),
	getInventory: vi.fn(async () => ["inventory"]),
}));

import { getEmployees, getInventory, getProjects } from "@/functions/dashboard";
import {
	employeesQueryOptions,
	inventoryQueryOptions,
	projectsQueryOptions,
} from "./dashboard";

describe("dashboard query options", () => {
	it("uses stable query keys", () => {
		expect(projectsQueryOptions().queryKey).toEqual(["projects"]);
		expect(employeesQueryOptions().queryKey).toEqual(["employees"]);
		expect(inventoryQueryOptions().queryKey).toEqual(["inventory"]);
	});

	it("delegates query functions to server handlers", async () => {
		const projectsQuery = projectsQueryOptions();
		const employeesQuery = employeesQueryOptions();
		const inventoryQuery = inventoryQueryOptions();

		expect(projectsQuery.queryFn).toBeDefined();
		expect(employeesQuery.queryFn).toBeDefined();
		expect(inventoryQuery.queryFn).toBeDefined();

		const projectsResult = await projectsQuery.queryFn?.({
			queryKey: projectsQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof projectsQuery.queryFn>>[0]);
		const employeesResult = await employeesQuery.queryFn?.({
			queryKey: employeesQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof employeesQuery.queryFn>>[0]);
		const inventoryResult = await inventoryQuery.queryFn?.({
			queryKey: inventoryQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof inventoryQuery.queryFn>>[0]);

		expect(getProjects).toHaveBeenCalledTimes(1);
		expect(getEmployees).toHaveBeenCalledTimes(1);
		expect(getInventory).toHaveBeenCalledTimes(1);
		expect(projectsResult).toEqual(["projects"]);
		expect(employeesResult).toEqual(["employees"]);
		expect(inventoryResult).toEqual(["inventory"]);
	});
});
