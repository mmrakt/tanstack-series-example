import { describe, expect, it } from "vitest";
import {
	AppError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "./errors";

describe("AppError", () => {
	it("creates error with message and code", () => {
		const error = new AppError("Test error", "TEST_CODE");

		expect(error.message).toBe("Test error");
		expect(error.code).toBe("TEST_CODE");
		expect(error.name).toBe("AppError");
		expect(error).toBeInstanceOf(Error);
	});
});

describe("NotFoundError", () => {
	it("creates error with resource and numeric id", () => {
		const error = new NotFoundError("Project", 123);

		expect(error.message).toBe("Project with id 123 not found");
		expect(error.code).toBe("NOT_FOUND");
		expect(error.name).toBe("NotFoundError");
		expect(error).toBeInstanceOf(AppError);
	});

	it("creates error with resource and string id", () => {
		const error = new NotFoundError("User", "abc-123");

		expect(error.message).toBe("User with id abc-123 not found");
	});
});

describe("ValidationError", () => {
	it("creates error with message", () => {
		const error = new ValidationError("Invalid input");

		expect(error.message).toBe("Invalid input");
		expect(error.code).toBe("VALIDATION_ERROR");
		expect(error.name).toBe("ValidationError");
		expect(error.fields).toBeUndefined();
	});

	it("creates error with fields", () => {
		const fields = { name: "Name is required", email: "Invalid email" };
		const error = new ValidationError("Validation failed", fields);

		expect(error.fields).toEqual(fields);
	});
});

describe("UnauthorizedError", () => {
	it("creates error with default message", () => {
		const error = new UnauthorizedError();

		expect(error.message).toBe("Unauthorized access");
		expect(error.code).toBe("UNAUTHORIZED");
		expect(error.name).toBe("UnauthorizedError");
	});

	it("creates error with custom message", () => {
		const error = new UnauthorizedError("Custom unauthorized message");

		expect(error.message).toBe("Custom unauthorized message");
	});
});
