import { queryOptions } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME_MS } from "@/core/query/constants";
import { getInventory } from "./server";

export const inventoryQueryKey = ["inventory"] as const;

export const inventoryQueryOptions = () =>
	queryOptions({
		queryKey: inventoryQueryKey,
		queryFn: () => getInventory(),
		staleTime: DEFAULT_STALE_TIME_MS,
	});
