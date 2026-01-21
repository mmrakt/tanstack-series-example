import { z } from "zod";

export const projectStatuses = ["active", "completed", "on-hold"] as const;
export const projectSortFields = [
	"id",
	"name",
	"budget",
	"status",
	"createdAt",
] as const;
export type ProjectSortField = (typeof projectSortFields)[number];

const projectsQueryInputSchema = z
	.object({
		search: z.string().trim().min(1).optional(),
		status: z.enum(projectStatuses).optional(),
		budgetMin: z.number().int().min(0).optional(),
		budgetMax: z.number().int().min(0).optional(),
		sort: z
			.array(
				z.object({
					id: z.enum(projectSortFields),
					desc: z.boolean().optional(),
				}),
			)
			.optional(),
	})
	.partial();

export type ProjectsQueryInput = z.infer<typeof projectsQueryInputSchema>;

export const paginationSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const projectsQuerySchema = projectsQueryInputSchema
	.merge(paginationSchema)
	.optional();

export const projectUpdateSchema = z.object({
	id: z.number().int().positive("Project id is required"),
	name: z.string().trim().min(1, "Project name is required"),
	budget: z
		.number()
		.int("Budget must be a whole number")
		.min(0, "Budget must be 0 or more"),
	status: z.enum(projectStatuses, {
		message: "Status is required",
	}),
});

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export function validateProjectUpdate({
	value,
}: {
	value: ProjectUpdateInput;
}): { fields: Record<string, string> } | undefined {
	const result = projectUpdateSchema.safeParse(value);
	if (result.success) return undefined;

	const fields: Record<string, string> = {};
	for (const issue of result.error.issues) {
		const path = issue.path.join(".");
		if (!fields[path]) {
			fields[path] = issue.message;
		}
	}

	return { fields };
}
