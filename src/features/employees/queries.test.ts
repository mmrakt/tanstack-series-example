import { describe, expect, it, vi } from "vitest";

vi.mock("./server", () => ({
	getEmployees: vi.fn(async () => ["employees"]),
}));

import { employeesQueryOptions } from "./queries";
import { getEmployees } from "./server";

describe("employees query options", () => {
	it("uses stable query keys", () => {
		expect(employeesQueryOptions().queryKey).toEqual(["employees"]);
	});

	it("delegates query functions to server handlers", async () => {
		const employeesQuery = employeesQueryOptions();
		const result = await employeesQuery.queryFn?.({
			queryKey: employeesQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof employeesQuery.queryFn>>[0]);

		expect(getEmployees).toHaveBeenCalledTimes(1);
		expect(result).toEqual(["employees"]);
	});
});
