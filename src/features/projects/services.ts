import { and, asc, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { resolveContext } from "@/core/db/context";
import type { ServiceContext } from "@/core/db/types";
import { NotFoundError } from "@/core/errors";
import * as schema from "@/db/schema";
import type {
	PaginationInput,
	ProjectSortField,
	ProjectsQueryInput,
	ProjectUpdateInput,
} from "./schema";

type Project = typeof schema.projects.$inferSelect;

const projectSortColumns: Record<
	ProjectSortField,
	| typeof schema.projects.id
	| typeof schema.projects.name
	| typeof schema.projects.budget
	| typeof schema.projects.status
	| typeof schema.projects.createdAt
> = {
	id: schema.projects.id,
	name: schema.projects.name,
	budget: schema.projects.budget,
	status: schema.projects.status,
	createdAt: schema.projects.createdAt,
};

export async function listProjects(
	filters: (ProjectsQueryInput & PaginationInput) | undefined,
	ctx?: Partial<ServiceContext>,
): Promise<Project[]> {
	const { db, tenantId } = await resolveContext(ctx);
	const conditions = [eq(schema.projects.tenantId, tenantId)];

	if (filters?.status) {
		conditions.push(eq(schema.projects.status, filters.status));
	}
	if (filters?.budgetMin !== undefined) {
		conditions.push(gte(schema.projects.budget, filters.budgetMin));
	}
	if (filters?.budgetMax !== undefined) {
		conditions.push(lte(schema.projects.budget, filters.budgetMax));
	}

	const normalizedSearch = filters?.search?.trim().toLowerCase();
	if (normalizedSearch) {
		const likeValue = `%${normalizedSearch}%`;
		const searchCondition = or(
			like(sql`lower(${schema.projects.name})`, likeValue),
			like(sql`lower(${schema.projects.status})`, likeValue),
			like(sql`CAST(${schema.projects.budget} AS TEXT)`, likeValue),
		);
		if (searchCondition) {
			conditions.push(searchCondition);
		}
	}

	const orderBy = (filters?.sort ?? []).map((sort) => {
		const column = projectSortColumns[sort.id];
		return sort.desc ? desc(column) : asc(column);
	});

	return await db.query.projects.findMany({
		where: and(...conditions),
		orderBy: orderBy.length > 0 ? orderBy : undefined,
		limit: filters?.limit,
		offset: filters?.offset,
	});
}

export async function updateProjectRecord(
	data: ProjectUpdateInput,
	ctx?: Partial<ServiceContext>,
): Promise<Project> {
	const { db, tenantId } = await resolveContext(ctx);

	const [updated] = await db
		.update(schema.projects)
		.set({
			name: data.name,
			budget: data.budget,
			status: data.status,
		})
		.where(
			and(
				eq(schema.projects.id, data.id),
				eq(schema.projects.tenantId, tenantId),
			),
		)
		.returning();

	if (!updated) {
		throw new NotFoundError("Project", data.id);
	}

	return updated;
}
