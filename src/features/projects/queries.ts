import { queryOptions } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME_MS } from "@/core/query/constants";
import type { ProjectsQueryInput } from "./schema";
import { getProjects } from "./server";

export const projectsQueryKey = (filters?: ProjectsQueryInput) =>
	filters ? (["projects", filters] as const) : (["projects"] as const);

export const projectsQueryOptions = (filters?: ProjectsQueryInput) =>
	queryOptions({
		queryKey: projectsQueryKey(filters),
		queryFn: () => (filters ? getProjects({ data: filters }) : getProjects()),
		staleTime: DEFAULT_STALE_TIME_MS,
	});
