import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { getDb } from "../server/db.server";
import type { ProjectUpdateInput } from "../utils/project-form";
import { projectUpdateSchema } from "../utils/project-form";

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

export async function updateProjectHandler({
	data,
}: {
	data: ProjectUpdateInput;
}) {
	try {
		const db = await getDb();
		await db
			.update(schema.projects)
			.set({
				name: data.name,
				budget: data.budget,
				status: data.status,
			})
			.where(eq(schema.projects.id, data.id));

		const [updated] = await db
			.select()
			.from(schema.projects)
			.where(eq(schema.projects.id, data.id))
			.all();
		if (!updated) {
			throw new Error("Project not found");
		}
		return updated;
	} catch (e) {
		console.error("updateProject: Failed:", e);
		throw e;
	}
}

export const updateProject = createServerFn({ method: "POST" })
	.inputValidator((input: unknown) => projectUpdateSchema.parse(input))
	.handler(updateProjectHandler);
