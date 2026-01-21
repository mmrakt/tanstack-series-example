import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/tanstack-react-start/server", () => ({
	auth: vi.fn(),
}));

import { auth } from "@clerk/tanstack-react-start/server";
import { requireTenantId, TenantAccessError } from "./tenant";

const mockedAuth = vi.mocked(auth);

describe("requireTenantId", () => {
	it("returns the org id when present", async () => {
		mockedAuth.mockResolvedValueOnce({ orgId: "org-123" } as Awaited<
			ReturnType<typeof auth>
		>);

		await expect(requireTenantId()).resolves.toBe("org-123");
	});

	it("throws when org id is missing", async () => {
		mockedAuth.mockResolvedValueOnce({ orgId: null } as Awaited<
			ReturnType<typeof auth>
		>);

		await expect(requireTenantId()).rejects.toBeInstanceOf(TenantAccessError);
	});
});
