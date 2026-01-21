import { queryOptions } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME_MS } from "@/core/query/constants";
import { getEmployees } from "./server";

export const employeesQueryKey = ["employees"] as const;

export const employeesQueryOptions = () =>
	queryOptions({
		queryKey: employeesQueryKey,
		queryFn: () => getEmployees(),
		staleTime: DEFAULT_STALE_TIME_MS,
	});
