import { describe, expect, it, vi } from "vitest";
import type { ServiceContext } from "@/core/db/types";
import { listInventory } from "./services";

describe("listInventory", () => {
	it("returns inventory scoped to the tenant", async () => {
		const rows = [
			{
				id: 1,
				tenantId: "tenant-1",
				itemName: "Widget",
				quantity: 10,
				price: 2500,
				updatedAt: new Date("2024-01-02T00:00:00Z"),
			},
		];
		const findMany = vi.fn(async () => rows);

		const ctx = {
			db: { query: { inventory: { findMany } } },
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await expect(listInventory(undefined, ctx)).resolves.toEqual(rows);
		expect(findMany).toHaveBeenCalled();
	});

	it("passes pagination parameters", async () => {
		const rows: unknown[] = [];
		const findMany = vi.fn(async () => rows);

		const ctx = {
			db: { query: { inventory: { findMany } } },
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await listInventory({ limit: 20, offset: 10 }, ctx);

		expect(findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				limit: 20,
				offset: 10,
			}),
		);
	});
});
