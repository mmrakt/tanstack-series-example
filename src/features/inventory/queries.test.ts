import { describe, expect, it, vi } from "vitest";

vi.mock("./server", () => ({
	getInventory: vi.fn(async () => ["inventory"]),
}));

import { inventoryQueryOptions } from "./queries";
import { getInventory } from "./server";

describe("inventory query options", () => {
	it("uses stable query keys", () => {
		expect(inventoryQueryOptions().queryKey).toEqual(["inventory"]);
	});

	it("delegates query functions to server handlers", async () => {
		const inventoryQuery = inventoryQueryOptions();
		const result = await inventoryQuery.queryFn?.({
			queryKey: inventoryQuery.queryKey,
		} as unknown as Parameters<NonNullable<typeof inventoryQuery.queryFn>>[0]);

		expect(getInventory).toHaveBeenCalledTimes(1);
		expect(result).toEqual(["inventory"]);
	});
});
