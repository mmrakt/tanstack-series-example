import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type * as schema from "@/db/schema";

/**
 * Union type for both D1 (production) and LibSQL (local) database instances
 */
export type AppDb =
	| LibSQLDatabase<typeof schema>
	| DrizzleD1Database<typeof schema>;

/**
 * Service context for dependency injection
 * Allows passing db and tenantId for testing
 */
export type ServiceContext = {
	db: AppDb;
	tenantId: string;
};

/**
 * Pagination parameters
 */
export type PaginationInput = {
	limit?: number;
	offset?: number;
};

/**
 * Paginated response
 */
export type PaginatedResult<T> = {
	data: T[];
	total: number;
	limit: number;
	offset: number;
};
