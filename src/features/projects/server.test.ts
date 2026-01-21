import { describe, expect, it, vi } from "vitest";
import type { ServiceContext } from "@/core/db/types";
import { NotFoundError } from "@/core/errors";
import { updateProjectHandler } from "./server";

describe("updateProject", () => {
	it("returns the updated project on success", async () => {
		const updatedRow = {
			id: 1,
			tenantId: "tenant-1",
			name: "Updated Project",
			budget: 1234,
			status: "active",
			createdAt: new Date("2024-01-01T00:00:00Z"),
		};
		const returning = vi.fn(async () => [updatedRow]);
		const where = vi.fn(() => ({ returning }));
		const set = vi.fn(() => ({ where }));
		const update = vi.fn(() => ({ set }));

		const ctx = {
			db: {
				update,
				query: { projects: { findFirst: vi.fn(), findMany: vi.fn() } },
			},
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		const result = await updateProjectHandler(
			{
				data: {
					id: 1,
					name: "Updated Project",
					budget: 1234,
					status: "active",
				},
			},
			ctx,
		);

		expect(result).toEqual(updatedRow);
		expect(update).toHaveBeenCalled();
		expect(returning).toHaveBeenCalled();
	});

	it("throws NotFoundError when the project is not found", async () => {
		const returning = vi.fn(async () => []);
		const where = vi.fn(() => ({ returning }));
		const set = vi.fn(() => ({ where }));
		const update = vi.fn(() => ({ set }));

		const ctx = {
			db: {
				update,
				query: { projects: { findFirst: vi.fn(), findMany: vi.fn() } },
			},
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await expect(
			updateProjectHandler(
				{
					data: {
						id: 99,
						name: "Missing",
						budget: 500,
						status: "completed",
					},
				},
				ctx,
			),
		).rejects.toThrow(NotFoundError);
	});

	it("throws when the database update fails", async () => {
		const update = vi.fn(() => {
			throw new Error("db failure");
		});

		const ctx = {
			db: {
				update,
				query: {
					projects: { findFirst: vi.fn(), findMany: vi.fn() },
				},
			},
			tenantId: "tenant-1",
		} as unknown as ServiceContext;

		await expect(
			updateProjectHandler(
				{
					data: {
						id: 2,
						name: "Broken",
						budget: 800,
						status: "on-hold",
					},
				},
				ctx,
			),
		).rejects.toThrow("db failure");
	});
});
