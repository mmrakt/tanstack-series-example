import { createServerFn } from "@tanstack/react-start";
import { listEmployees } from "./services";

export const getEmployees = createServerFn({ method: "GET" }).handler(
	async () => listEmployees(),
);
