import { auth } from "@clerk/tanstack-react-start/server";

export class TenantAccessError extends Error {
	constructor(message = "Tenant access is required") {
		super(message);
		this.name = "TenantAccessError";
	}
}

export async function requireTenantId(): Promise<string> {
	const authObject = await auth();
	if (!authObject.orgId) {
		throw new TenantAccessError("Organization access is required");
	}
	return authObject.orgId;
}
