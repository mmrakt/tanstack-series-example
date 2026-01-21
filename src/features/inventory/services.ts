import { eq } from "drizzle-orm";
import { resolveContext } from "@/core/db/context";
import type { PaginationInput, ServiceContext } from "@/core/db/types";
import * as schema from "@/db/schema";

type InventoryItem = typeof schema.inventory.$inferSelect;

export async function listInventory(
	pagination?: PaginationInput,
	ctx?: Partial<ServiceContext>,
): Promise<InventoryItem[]> {
	const { db, tenantId } = await resolveContext(ctx);
	return await db.query.inventory.findMany({
		where: eq(schema.inventory.tenantId, tenantId),
		limit: pagination?.limit,
		offset: pagination?.offset,
	});
}
