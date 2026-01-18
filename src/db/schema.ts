import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable(
	"projects",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		tenantId: text("tenant_id").notNull(),
		name: text("name").notNull(),
		budget: integer("budget").notNull().default(0),
		status: text("status").notNull().default("active"),
		createdAt: integer("created_at", { mode: "timestamp" }).default(
			sql`(unixepoch())`,
		),
	},
	(table) => [index("projects_tenant_idx").on(table.tenantId)],
);

export const employees = sqliteTable(
	"employees",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		tenantId: text("tenant_id").notNull(),
		clerkUserId: text("clerk_user_id"),
		name: text("name").notNull(),
		role: text("role").notNull().default("employee"),
		joinedAt: integer("joined_at", { mode: "timestamp" }).default(
			sql`(unixepoch())`,
		),
	},
	(table) => [
		index("employees_tenant_idx").on(table.tenantId),
		index("employees_clerk_user_idx").on(table.clerkUserId),
	],
);

export const inventory = sqliteTable(
	"inventory",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		tenantId: text("tenant_id").notNull(),
		itemName: text("item_name").notNull(),
		quantity: integer("quantity").notNull().default(0),
		price: integer("price").notNull().default(0),
		updatedAt: integer("updated_at", { mode: "timestamp" }).default(
			sql`(unixepoch())`,
		),
	},
	(table) => [index("inventory_tenant_idx").on(table.tenantId)],
);
