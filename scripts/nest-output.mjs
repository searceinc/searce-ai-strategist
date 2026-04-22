#!/usr/bin/env node
// Nests the Next.js static-export output under NEXT_PUBLIC_BASE_PATH so the
// resulting folder layout mirrors how the app is served on S3.
//
//   Before: out/index.html, out/_next/...
//   After:  out/searce-ai-strategist/index.html, out/searce-ai-strategist/_next/...
//
// Why: Next.js always writes the export to out/ (flat). basePath only affects
// URLs baked into the HTML, not the on-disk folder structure. Nesting the
// output here makes `npx serve out` work at
// http://localhost:3000/searce-ai-strategist/ and makes
// `aws s3 sync out/ s3://bucket/ --delete` upload to the right S3 prefix.

import { existsSync, mkdirSync, readFileSync, renameSync } from "node:fs";
import { join } from "node:path";

function readBasePath() {
	if (process.env.NEXT_PUBLIC_BASE_PATH) {
		return process.env.NEXT_PUBLIC_BASE_PATH;
	}
	if (!existsSync(".env.local")) return "";
	for (const rawLine of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;
		if (line.startsWith("NEXT_PUBLIC_BASE_PATH=")) {
			return line.slice("NEXT_PUBLIC_BASE_PATH=".length).replace(/^["']|["']$/g, "");
		}
	}
	return "";
}

const basePath = readBasePath();
if (!basePath) {
	console.log("[nest-output] No NEXT_PUBLIC_BASE_PATH set; leaving out/ unchanged.");
	process.exit(0);
}

const dirName = basePath.replace(/^\//, "");
if (!existsSync("out")) {
	console.log("[nest-output] out/ not found; nothing to nest.");
	process.exit(0);
}

if (existsSync(join("out", dirName, "index.html"))) {
	console.log(`[nest-output] out/${dirName}/ already exists; skipping.`);
	process.exit(0);
}

const tmp = "out-nested-tmp";
renameSync("out", tmp);
mkdirSync("out");
renameSync(tmp, join("out", dirName));
console.log(`[nest-output] Nested build output to out/${dirName}/`);
