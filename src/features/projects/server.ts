import { createServerFn } from "@tanstack/react-start";
import {
	type ProjectUpdateInput,
	projectsQuerySchema,
	projectUpdateSchema,
} from "./schema";
import { listProjects, updateProjectRecord } from "./services";

export const getProjects = createServerFn({ method: "GET" })
	.inputValidator((input: unknown) => projectsQuerySchema.parse(input))
	.handler(async ({ data }) => listProjects(data));

export async function updateProjectHandler(
	{
		data,
	}: {
		data: ProjectUpdateInput;
	},
	ctx?: Parameters<typeof updateProjectRecord>[1],
) {
	return updateProjectRecord(data, ctx);
}

export const updateProject = createServerFn({ method: "POST" })
	.inputValidator((input: unknown) => projectUpdateSchema.parse(input))
	.handler(updateProjectHandler);
