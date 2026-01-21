import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import type { employees, inventory } from "@/db/schema";
import type { Project } from "@/features/projects/shared";
import { COLLECTION_QUERY_KEYS, createAppCollections } from "./index";

type Employee = typeof employees.$inferSelect;
type InventoryItem = typeof inventory.$inferSelect;

describe("COLLECTION_QUERY_KEYS", () => {
	it("defines query keys for all collections", () => {
		expect(COLLECTION_QUERY_KEYS.projects).toEqual(["projects"]);
		expect(COLLECTION_QUERY_KEYS.employees).toEqual(["employees"]);
		expect(COLLECTION_QUERY_KEYS.inventory).toEqual(["inventory"]);
	});
});

describe("createAppCollections", () => {
	it("configures on-demand sync for query-backed collections", () => {
		const queryClient = new QueryClient();
		const collections = createAppCollections(queryClient);

		expect(collections.projects.config.syncMode).toBe("on-demand");
		expect(collections.employees.config.syncMode).toBe("on-demand");
		expect(collections.inventory.config.syncMode).toBe("on-demand");
	});

	it("uses id keys for collections", () => {
		const queryClient = new QueryClient();
		const collections = createAppCollections(queryClient);

		const project = {
			id: 1,
			tenantId: "tenant-1",
			name: "Project",
			budget: 0,
			status: "active",
			createdAt: new Date(),
		} satisfies Project;

		const employee = {
			id: 2,
			tenantId: "tenant-1",
			clerkUserId: null,
			name: "Employee",
			role: "employee",
			joinedAt: new Date(),
		} satisfies Employee;

		const inventoryItem = {
			id: 3,
			tenantId: "tenant-1",
			itemName: "Item",
			quantity: 1,
			price: 100,
			updatedAt: new Date(),
		} satisfies InventoryItem;

		expect(collections.projects.config.getKey?.(project)).toBe(1);
		expect(collections.employees.config.getKey?.(employee)).toBe(2);
		expect(collections.inventory.config.getKey?.(inventoryItem)).toBe(3);
	});

	it("creates separate collection instances per call", () => {
		const queryClient = new QueryClient();
		const collections1 = createAppCollections(queryClient);
		const collections2 = createAppCollections(queryClient);

		expect(collections1.projects).not.toBe(collections2.projects);
		expect(collections1.employees).not.toBe(collections2.employees);
		expect(collections1.inventory).not.toBe(collections2.inventory);
	});
});
