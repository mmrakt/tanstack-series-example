import type { projects } from "@/db/schema";

export type Project = typeof projects.$inferSelect;

export const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export const budgetRange = {
	min: 0,
	max: 1_000_000,
	step: 1_000,
};
