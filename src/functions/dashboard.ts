import { createServerFn } from "@tanstack/react-start";
import * as schema from "../db/schema";
import { getDb } from "../server/db.server";

export const getProjects = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			console.log("getProjects: Fetching projects...");
			const db = await getDb();
			return await db.select().from(schema.projects);
		} catch (e) {
			console.error("getProjects: Failed:", e);
			throw e;
		}
	},
);

export const getEmployees = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const db = await getDb();
			return await db.select().from(schema.employees);
		} catch (e) {
			console.error("getEmployees: Failed:", e);
			throw e;
		}
	},
);

export const getInventory = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const db = await getDb();
			return await db.select().from(schema.inventory);
		} catch (e) {
			console.error("getInventory: Failed:", e);
			throw e;
		}
	},
);
