import { getStartContext } from "@tanstack/start-storage-context";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { resolveLocalD1DatabaseUrl } from "../db/d1-local";
import * as schema from "../db/schema";

type CloudflareEnv = {
	DB?: unknown;
};

type RequestContext = {
	cloudflare?: {
		env?: CloudflareEnv;
	};
	env?: CloudflareEnv;
};

export async function getDb() {
	// 1. Production/Staging: Cloudflare D1
	const startContext = getStartContext({ throwIfNotFound: false }) as
		| { contextAfterGlobalMiddlewares?: RequestContext }
		| undefined;
	const requestContext = startContext?.contextAfterGlobalMiddlewares;
	const globalEnv = (
		globalThis as typeof globalThis & { __CF_ENV__?: CloudflareEnv }
	).__CF_ENV__;
	const d1 =
		requestContext?.cloudflare?.env?.DB ??
		requestContext?.env?.DB ??
		globalEnv?.DB;
	if (d1) {
		console.log("Using Cloudflare D1");
		return drizzleD1(d1, { schema });
	}

	// 2. Local: Libsql (SQLite)
	console.log("Using local Libsql fallback");
	const { createClient } = await import("@libsql/client/node");
	const client = createClient({
		url: resolveLocalD1DatabaseUrl({
			explicitUrl: process.env.LIBSQL_URL ?? process.env.DATABASE_URL,
		}),
	});
	return drizzleLibsql(client, { schema });
}
