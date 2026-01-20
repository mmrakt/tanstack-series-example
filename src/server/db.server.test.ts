// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("drizzle-orm/d1", () => ({
	drizzle: vi.fn(),
}));

vi.mock("drizzle-orm/libsql", () => ({
	drizzle: vi.fn(),
}));

vi.mock("@tanstack/start-storage-context", () => ({
	getStartContext: vi.fn(),
}));

vi.mock("@libsql/client/node", () => ({
	createClient: vi.fn(),
}));

import { createClient } from "@libsql/client/node";
import { getStartContext } from "@tanstack/start-storage-context";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { getDb } from "./db.server";

const mockD1Db = { name: "d1-db" } as unknown as ReturnType<typeof drizzleD1>;
const mockLibsqlDb = {
	name: "libsql-db",
} as unknown as ReturnType<typeof drizzleLibsql>;
const mockClient = {
	name: "libsql-client",
} as unknown as ReturnType<typeof createClient>;

const drizzleD1Mock = vi.mocked(drizzleD1);
const drizzleLibsqlMock = vi.mocked(drizzleLibsql);
const createClientMock = vi.mocked(createClient);
const getStartContextMock = vi.mocked(getStartContext);

beforeEach(() => {
	drizzleD1Mock.mockReset();
	drizzleLibsqlMock.mockReset();
	createClientMock.mockReset();
	getStartContextMock.mockReset();
	drizzleD1Mock.mockReturnValue(mockD1Db);
	drizzleLibsqlMock.mockReturnValue(mockLibsqlDb);
	createClientMock.mockReturnValue(mockClient);
	delete process.env.LIBSQL_URL;
	delete (globalThis as typeof globalThis & { __CF_ENV__?: unknown })
		.__CF_ENV__;
});

describe("getDb", () => {
	it("uses Cloudflare D1 when available", async () => {
		const d1 = { name: "d1-binding" };
		getStartContextMock.mockReturnValue({
			contextAfterGlobalMiddlewares: { cloudflare: { env: { DB: d1 } } },
		} as unknown as ReturnType<typeof getStartContext>);

		const result = await getDb();

		expect(result).toBe(mockD1Db);
		expect(drizzleD1Mock).toHaveBeenCalledWith(
			d1,
			expect.objectContaining({ schema: expect.anything() }),
		);
		expect(createClientMock).not.toHaveBeenCalled();
		expect(drizzleLibsqlMock).not.toHaveBeenCalled();
	});

	it("falls back to Libsql when D1 is unavailable", async () => {
		getStartContextMock.mockReturnValue(
			undefined as unknown as ReturnType<typeof getStartContext>,
		);
		process.env.LIBSQL_URL = "file:./dev.db";

		const result = await getDb();

		expect(result).toBe(mockLibsqlDb);
		expect(createClientMock).toHaveBeenCalledWith({
			url: "file:./dev.db",
		});
		expect(drizzleLibsqlMock).toHaveBeenCalledWith(
			mockClient,
			expect.objectContaining({ schema: expect.anything() }),
		);
	});

	it("uses D1 from global env when start context is missing", async () => {
		const d1 = { name: "d1-global-binding" };
		getStartContextMock.mockReturnValue(
			undefined as unknown as ReturnType<typeof getStartContext>,
		);
		(globalThis as typeof globalThis & { __CF_ENV__?: unknown }).__CF_ENV__ = {
			DB: d1,
		};

		const result = await getDb();

		expect(result).toBe(mockD1Db);
		expect(drizzleD1Mock).toHaveBeenCalledWith(
			d1,
			expect.objectContaining({ schema: expect.anything() }),
		);
		expect(createClientMock).not.toHaveBeenCalled();
		expect(drizzleLibsqlMock).not.toHaveBeenCalled();
	});
});
