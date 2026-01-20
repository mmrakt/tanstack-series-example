import { describe, expect, it } from "vitest";
import {
	type ProjectUpdateInput,
	projectUpdateSchema,
	validateProjectUpdate,
} from "./project-form";

describe("projectUpdateSchema", () => {
	it("accepts valid input", () => {
		const input = {
			id: 1,
			name: "Alpha Project",
			budget: 250000,
			status: "active",
		} satisfies ProjectUpdateInput;

		expect(projectUpdateSchema.parse(input)).toEqual(input);
		expect(validateProjectUpdate({ value: input })).toBeUndefined();
	});

	it("returns field errors for invalid input", () => {
		const input = {
			id: 1,
			name: "",
			budget: -10,
			status: "invalid",
		};

		const result = validateProjectUpdate({
			value: input as unknown as Parameters<
				typeof validateProjectUpdate
			>[0]["value"],
		});

		expect(result?.fields.name).toBeTruthy();
		expect(result?.fields.budget).toBeTruthy();
		expect(result?.fields.status).toBeTruthy();
	});
});
