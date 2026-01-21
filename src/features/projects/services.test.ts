import { describe, expect, it, vi } from "vitest";
import type { ServiceContext } from "@/core/db/types";
import { NotFoundError } from "@/core/errors";
import { listProjects, updateProjectRecord } from "./services";

describe("listProjects", () => {
	it("returns projects scoped to the tenant", async () => {
		const rows = [
			{
				id: 1,
				tenantId: "tenant-1",
				name: "Project Alpha",
				budget: 5000,
				status: "active",
				createdAt: new Date("2024-01-03T00:00:00Z"),
			},
		];
		const findMany = vi.fn(async () => rows);

		const ctx = {
			db: { query: { projects: { findMany, findFirst: vi.fn() } } },
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await expect(listProjects(undefined, ctx)).resolves.toEqual(rows);
		expect(findMany).toHaveBeenCalled();
	});

	it("passes pagination parameters", async () => {
		const rows: unknown[] = [];
		const findMany = vi.fn(async () => rows);

		const ctx = {
			db: { query: { projects: { findMany, findFirst: vi.fn() } } },
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await listProjects({ limit: 10, offset: 5 }, ctx);

		expect(findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				limit: 10,
				offset: 5,
			}),
		);
	});
});

describe("updateProjectRecord", () => {
	it("updates and returns the project using RETURNING", async () => {
		const updated = {
			id: 1,
			tenantId: "tenant-1",
			name: "Updated Project",
			budget: 10000,
			status: "completed",
			createdAt: new Date("2024-01-03T00:00:00Z"),
		};

		const returning = vi.fn(async () => [updated]);
		const where = vi.fn(() => ({ returning }));
		const set = vi.fn(() => ({ where }));
		const update = vi.fn(() => ({ set }));

		const ctx = {
			db: {
				update,
				query: { projects: { findMany: vi.fn(), findFirst: vi.fn() } },
			},
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		const result = await updateProjectRecord(
			{
				id: 1,
				name: "Updated Project",
				budget: 10000,
				status: "completed",
			},
			ctx,
		);

		expect(result).toEqual(updated);
		expect(update).toHaveBeenCalled();
		expect(set).toHaveBeenCalled();
		expect(returning).toHaveBeenCalled();
	});

	it("throws NotFoundError when project does not exist", async () => {
		const returning = vi.fn(async () => []);
		const where = vi.fn(() => ({ returning }));
		const set = vi.fn(() => ({ where }));
		const update = vi.fn(() => ({ set }));

		const ctx = {
			db: {
				update,
				query: { projects: { findMany: vi.fn(), findFirst: vi.fn() } },
			},
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await expect(
			updateProjectRecord(
				{
					id: 999,
					name: "Nonexistent",
					budget: 0,
					status: "active",
				},
				ctx,
			),
		).rejects.toThrow(NotFoundError);
	});
});
