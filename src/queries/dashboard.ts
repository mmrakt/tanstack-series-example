import { queryOptions } from "@tanstack/react-query";
import { getEmployees, getInventory, getProjects } from "@/functions/dashboard";

const defaultStaleTimeMs = 30_000;

export const projectsQueryKey = ["projects"] as const;
export const employeesQueryKey = ["employees"] as const;
export const inventoryQueryKey = ["inventory"] as const;

export const projectsQueryOptions = () =>
	queryOptions({
		queryKey: projectsQueryKey,
		queryFn: () => getProjects(),
		staleTime: defaultStaleTimeMs,
	});

export const employeesQueryOptions = () =>
	queryOptions({
		queryKey: employeesQueryKey,
		queryFn: () => getEmployees(),
		staleTime: defaultStaleTimeMs,
	});

export const inventoryQueryOptions = () =>
	queryOptions({
		queryKey: inventoryQueryKey,
		queryFn: () => getInventory(),
		staleTime: defaultStaleTimeMs,
	});
