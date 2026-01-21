import { describe, expect, it, vi } from "vitest";
import type { ServiceContext } from "@/core/db/types";
import { listEmployees } from "./services";

describe("listEmployees", () => {
	it("returns employees scoped to the tenant", async () => {
		const rows = [
			{
				id: 1,
				tenantId: "tenant-1",
				clerkUserId: null,
				name: "Ada Lovelace",
				role: "employee",
				joinedAt: new Date("2024-01-01T00:00:00Z"),
			},
		];
		const findMany = vi.fn(async () => rows);

		const ctx = {
			db: { query: { employees: { findMany } } },
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await expect(listEmployees(undefined, ctx)).resolves.toEqual(rows);
		expect(findMany).toHaveBeenCalled();
	});

	it("passes pagination parameters", async () => {
		const rows: unknown[] = [];
		const findMany = vi.fn(async () => rows);

		const ctx = {
			db: { query: { employees: { findMany } } },
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await listEmployees({ limit: 10, offset: 5 }, ctx);

		expect(findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				limit: 10,
				offset: 5,
			}),
		);
	});
});
