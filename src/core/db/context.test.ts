import { describe, expect, it, vi } from "vitest";
import { resolveContext } from "./context";

vi.mock("@/core/auth/tenant", () => ({
	requireTenantId: vi.fn(async () => "default-tenant"),
}));

vi.mock("@/core/db", () => ({
	getDb: vi.fn(async () => ({ mocked: true })),
}));

describe("resolveContext", () => {
	it("uses provided db and tenantId when given", async () => {
		const mockDb = { custom: true };
		const ctx = await resolveContext({
			db: mockDb as never,
			tenantId: "custom-tenant",
		});

		expect(ctx.db).toBe(mockDb);
		expect(ctx.tenantId).toBe("custom-tenant");
	});

	it("falls back to defaults when not provided", async () => {
		const ctx = await resolveContext();

		expect(ctx.db).toEqual({ mocked: true });
		expect(ctx.tenantId).toBe("default-tenant");
	});

	it("mixes provided and default values", async () => {
		const mockDb = { partial: true };
		const ctx = await resolveContext({ db: mockDb as never });

		expect(ctx.db).toBe(mockDb);
		expect(ctx.tenantId).toBe("default-tenant");
	});
});
