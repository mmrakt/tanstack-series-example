import { describe, expect, it, vi } from "vitest";

vi.mock("../server/db.server", () => ({
	getDb: vi.fn(),
}));

import { getDb } from "../server/db.server";
import { updateProjectHandler } from "./dashboard";

const mockedGetDb = vi.mocked(getDb);
type Db = Awaited<ReturnType<typeof getDb>>;

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
		const updateWhere = vi.fn();
		const updateSet = vi.fn(() => ({ where: updateWhere }));
		const update = vi.fn(() => ({ set: updateSet }));
		const selectWhere = vi.fn(() => ({ all: vi.fn(async () => [updatedRow]) }));
		const selectFrom = vi.fn(() => ({ where: selectWhere }));
		const select = vi.fn(() => ({ from: selectFrom }));

		const db = { update, select } as unknown as Db;
		mockedGetDb.mockResolvedValueOnce(db);

		const result = await updateProjectHandler({
			data: {
				id: 1,
				name: "Updated Project",
				budget: 1234,
				status: "active",
			},
		});

		expect(result).toEqual(updatedRow);
		expect(update).toHaveBeenCalled();
		expect(select).toHaveBeenCalled();
	});

	it("throws when the project is not found", async () => {
		const updateWhere = vi.fn();
		const updateSet = vi.fn(() => ({ where: updateWhere }));
		const update = vi.fn(() => ({ set: updateSet }));
		const selectWhere = vi.fn(() => ({ all: vi.fn(async () => []) }));
		const selectFrom = vi.fn(() => ({ where: selectWhere }));
		const select = vi.fn(() => ({ from: selectFrom }));

		const db = { update, select } as unknown as Db;
		mockedGetDb.mockResolvedValueOnce(db);

		await expect(
			updateProjectHandler({
				data: {
					id: 99,
					name: "Missing",
					budget: 500,
					status: "completed",
				},
			}),
		).rejects.toThrow("Project not found");
	});

	it("throws when the database update fails", async () => {
		const update = vi.fn(() => {
			throw new Error("db failure");
		});

		const db = { update } as unknown as Db;
		mockedGetDb.mockResolvedValueOnce(db);

		await expect(
			updateProjectHandler({
				data: {
					id: 2,
					name: "Broken",
					budget: 800,
					status: "on-hold",
				},
			}),
		).rejects.toThrow("db failure");
	});
});
