/**
 * Base error class for application errors
 */
export class AppError extends Error {
	constructor(
		message: string,
		public readonly code: string,
	) {
		super(message);
		this.name = "AppError";
	}
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends AppError {
	constructor(resource: string, id: string | number) {
		super(`${resource} with id ${id} not found`, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends AppError {
	constructor(
		message: string,
		public readonly fields?: Record<string, string>,
	) {
		super(message, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

/**
 * Error thrown when authorization fails
 */
export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized access") {
		super(message, "UNAUTHORIZED");
		this.name = "UnauthorizedError";
	}
}
