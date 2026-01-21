import { eq } from "drizzle-orm";
import { resolveContext } from "@/core/db/context";
import type { PaginationInput, ServiceContext } from "@/core/db/types";
import * as schema from "@/db/schema";

type Employee = typeof schema.employees.$inferSelect;

export async function listEmployees(
	pagination?: PaginationInput,
	ctx?: Partial<ServiceContext>,
): Promise<Employee[]> {
	const { db, tenantId } = await resolveContext(ctx);
	return await db.query.employees.findMany({
		where: eq(schema.employees.tenantId, tenantId),
		limit: pagination?.limit,
		offset: pagination?.offset,
	});
}
