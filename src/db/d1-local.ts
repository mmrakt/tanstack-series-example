import fs from "node:fs";
import path from "node:path";

const DEFAULT_FALLBACK_URL = "file:./dev.db";
const D1_RELATIVE_DIR = path.join(
	".wrangler",
	"state",
	"v3",
	"d1",
	"miniflare-D1DatabaseObject",
);

function findLocalD1SqlitePath(rootDir: string): string | undefined {
	const d1Dir = path.join(rootDir, D1_RELATIVE_DIR);
	if (!fs.existsSync(d1Dir)) {
		return undefined;
	}

	const entries = fs
		.readdirSync(d1Dir)
		.filter((entry) => entry.endsWith(".sqlite"))
		.map((entry) => ({
			path: path.join(d1Dir, entry),
			mtimeMs: fs.statSync(path.join(d1Dir, entry)).mtimeMs,
		}));

	if (entries.length === 0) {
		return undefined;
	}

	entries.sort((a, b) => b.mtimeMs - a.mtimeMs);
	return entries[0].path;
}

export function resolveLocalD1DatabaseUrl(options?: {
	explicitUrl?: string;
	rootDir?: string;
}): string {
	const explicitUrl = options?.explicitUrl?.trim();
	if (explicitUrl && explicitUrl !== "d1-local") {
		return explicitUrl;
	}

	const rootDir = options?.rootDir ?? process.cwd();
	const sqlitePath = findLocalD1SqlitePath(rootDir);
	if (sqlitePath) {
		return `file:${sqlitePath}`;
	}

	if (explicitUrl === "d1-local") {
		console.warn(
			"Local D1 database was not found; falling back to file:./dev.db",
		);
	}

	return DEFAULT_FALLBACK_URL;
}
