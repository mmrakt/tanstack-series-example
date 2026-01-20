// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveLocalD1DatabaseUrl } from "./d1-local";

const tempDirs: string[] = [];

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		fs.rmSync(dir, { recursive: true, force: true });
	}
});

function makeTempRoot(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "d1-local-test-"));
	tempDirs.push(dir);
	return dir;
}

describe("resolveLocalD1DatabaseUrl", () => {
	it("returns explicit URL when provided", () => {
		const url = resolveLocalD1DatabaseUrl({
			explicitUrl: "file:./custom.db",
			rootDir: makeTempRoot(),
		});
		expect(url).toBe("file:./custom.db");
	});

	it("resolves local D1 sqlite file when present", () => {
		const root = makeTempRoot();
		const d1Dir = path.join(
			root,
			".wrangler",
			"state",
			"v3",
			"d1",
			"miniflare-D1DatabaseObject",
		);
		fs.mkdirSync(d1Dir, { recursive: true });
		const sqlitePath = path.join(d1Dir, "local.sqlite");
		fs.writeFileSync(sqlitePath, "");

		const url = resolveLocalD1DatabaseUrl({
			explicitUrl: "d1-local",
			rootDir: root,
		});

		expect(url).toBe(`file:${sqlitePath}`);
	});

	it("falls back to dev.db when local D1 is missing", () => {
		const root = makeTempRoot();
		const url = resolveLocalD1DatabaseUrl({
			explicitUrl: "d1-local",
			rootDir: root,
		});
		expect(url).toBe("file:./dev.db");
	});
});
