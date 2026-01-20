// @vitest-environment node

import { getTableConfig } from "drizzle-orm/sqlite-core";
import { describe, expect, it } from "vitest";
import { employees, inventory, projects } from "./schema";

function getIndexNames(table: Parameters<typeof getTableConfig>[0]) {
	return getTableConfig(table).indexes.map((idx) => idx.config?.name ?? "");
}

describe("schema indexes", () => {
	it("adds project tenant index", () => {
		expect(getIndexNames(projects)).toContain("projects_tenant_idx");
	});

	it("adds employee tenant and clerk user indexes", () => {
		const names = getIndexNames(employees);
		expect(names).toContain("employees_tenant_idx");
		expect(names).toContain("employees_clerk_user_idx");
	});

	it("adds inventory tenant index", () => {
		expect(getIndexNames(inventory)).toContain("inventory_tenant_idx");
	});
});
