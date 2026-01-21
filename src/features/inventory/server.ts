import { createServerFn } from "@tanstack/react-start";
import { listInventory } from "./services";

export const getInventory = createServerFn({ method: "GET" }).handler(
	async () => listInventory(),
);
