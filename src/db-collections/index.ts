import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import type { QueryClient } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME_MS } from "@/core/query/constants";
import type { employees, inventory } from "@/db/schema";
import { getEmployees } from "@/features/employees/server";
import { getInventory } from "@/features/inventory/server";
import { getProjects, updateProject } from "@/features/projects/server";
import type { Project } from "@/features/projects/shared";

// Query keys for consistent reference across the app
export const COLLECTION_QUERY_KEYS = {
	projects: ["projects"] as const,
	employees: ["employees"] as const,
	inventory: ["inventory"] as const,
} as const;

type Employee = typeof employees.$inferSelect;
type InventoryItem = typeof inventory.$inferSelect;

export type AppCollections = {
	projects: ReturnType<typeof createProjectCollection>;
	employees: ReturnType<typeof createEmployeeCollection>;
	inventory: ReturnType<typeof createInventoryCollection>;
};

const createProjectCollection = (queryClient: QueryClient) =>
	createCollection<Project, number>(
		queryCollectionOptions({
			queryKey: COLLECTION_QUERY_KEYS.projects,
			queryFn: async () => await getProjects(),
			queryClient,
			getKey: (project) => project.id,
			staleTime: DEFAULT_STALE_TIME_MS,
			syncMode: "on-demand",
			onUpdate: async ({ transaction, collection }) => {
				try {
					await Promise.all(
						transaction.mutations.map((mutation) =>
							updateProject({
								data: {
									id: mutation.modified.id,
									name: mutation.modified.name,
									budget: mutation.modified.budget,
									status: mutation.modified.status,
								},
							}),
						),
					);
					await collection.utils.refetch();
				} catch (error) {
					console.error("Failed to update projects:", error);
					throw error;
				}
			},
		}),
	);

const createEmployeeCollection = (queryClient: QueryClient) =>
	createCollection<Employee, number>(
		queryCollectionOptions({
			queryKey: COLLECTION_QUERY_KEYS.employees,
			queryFn: async () => await getEmployees(),
			queryClient,
			getKey: (employee) => employee.id,
			staleTime: DEFAULT_STALE_TIME_MS,
			syncMode: "on-demand",
		}),
	);

const createInventoryCollection = (queryClient: QueryClient) =>
	createCollection<InventoryItem, number>(
		queryCollectionOptions({
			queryKey: COLLECTION_QUERY_KEYS.inventory,
			queryFn: async () => await getInventory(),
			queryClient,
			getKey: (item) => item.id,
			staleTime: DEFAULT_STALE_TIME_MS,
			syncMode: "on-demand",
		}),
	);

export const createAppCollections = (
	queryClient: QueryClient,
): AppCollections => ({
	projects: createProjectCollection(queryClient),
	employees: createEmployeeCollection(queryClient),
	inventory: createInventoryCollection(queryClient),
});
