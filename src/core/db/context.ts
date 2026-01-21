import { requireTenantId } from "@/core/auth/tenant";
import { getDb } from "@/core/db";
import type { ServiceContext } from "./types";

/**
 * Resolves service context from optional input or defaults
 * Used for dependency injection in services
 */
export async function resolveContext(
	ctx?: Partial<ServiceContext>,
): Promise<ServiceContext> {
	return {
		db: ctx?.db ?? (await getDb()),
		tenantId: ctx?.tenantId ?? (await requireTenantId()),
	};
}
