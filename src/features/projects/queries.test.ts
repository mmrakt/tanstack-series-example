import { describe, expect, it, vi } from "vitest";

vi.mock("./server", () => ({
	getProjects: vi.fn(async () => ["projects"]),
}));

import { projectsQueryOptions } from "./queries";
import { getProjects } from "./server";

describe("projects query options", () => {
	it("uses stable query keys", () => {
		expect(projectsQueryOptions().queryKey).toEqual(["projects"]);
		expect(projectsQueryOptions({ status: "active" }).queryKey).toEqual([
			"projects",
			{ status: "active" },
		]);
	});

	it("delegates query functions to server handlers", async () => {
		const projectsQuery = projectsQueryOptions();
		const projectsResult = await projectsQuery.queryFn?.({
			queryKey: projectsQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof projectsQuery.queryFn>>[0]);

		expect(getProjects).toHaveBeenCalledTimes(1);
		expect(projectsResult).toEqual(["projects"]);
	});

	it("passes filters to the server handler when provided", async () => {
		const projectsQuery = projectsQueryOptions({ status: "completed" });
		await projectsQuery.queryFn?.({
			queryKey: projectsQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof projectsQuery.queryFn>>[0]);

		expect(getProjects).toHaveBeenCalledWith({ data: { status: "completed" } });
	});
});
