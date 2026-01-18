// @vitest-environment node

import type { UserConfig } from "vite";
import { afterEach, describe, expect, it } from "vitest";

const originalEnv = process.env.CF_WORKER_DEV;

afterEach(() => {
	if (originalEnv === undefined) {
		delete process.env.CF_WORKER_DEV;
	} else {
		process.env.CF_WORKER_DEV = originalEnv;
	}
});

async function getConfig(command: "serve" | "build"): Promise<UserConfig> {
	const configFactory = (await import("../../vite.config")).default as (args: {
		command: "serve" | "build";
	}) => UserConfig;
	return configFactory({ command });
}

function hasCloudflarePlugin(config: UserConfig): boolean {
	const plugins = config.plugins ?? [];
	return plugins.some((plugin) => plugin?.name?.includes("cloudflare"));
}

describe("vite.config cloudflare plugin", () => {
	it("disables cloudflare plugin during dev by default", async () => {
		delete process.env.CF_WORKER_DEV;
		const config = await getConfig("serve");
		expect(hasCloudflarePlugin(config)).toBe(false);
	});

	it("enables cloudflare plugin during dev when CF_WORKER_DEV=1", async () => {
		process.env.CF_WORKER_DEV = "1";
		const config = await getConfig("serve");
		expect(hasCloudflarePlugin(config)).toBe(true);
	});

	it("enables cloudflare plugin during build", async () => {
		delete process.env.CF_WORKER_DEV;
		const config = await getConfig("build");
		expect(hasCloudflarePlugin(config)).toBe(true);
	});
});
