#!/usr/bin/env node
/**
 * Generate TypeScript declarations from the payload JSON Schemas.
 *
 * Cross-checks the hand-written types in src/types.ts: if the JSON Schema
 * and TypeScript types diverge, this output (or a future diff against
 * src/types.ts) will surface it in CI.
 *
 * TODO(ONL-6 hard fail): once types stable, compare generated output to
 * src/types.ts and exit 1 on diff. For now this only emits the generated
 * .d.ts so divergence is a warning, not a hard block.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PAYLOAD_DIR = join(ROOT, "schemas", "payload");
const OUT_DIR = join(ROOT, "dist");
const OUT_FILE = join(OUT_DIR, "generated-types.d.ts");

const BANNER = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT.
 *
 * Produced by scripts/generate-types.js from schemas/payload/*.json.
 * Used as a drift detector against the hand-written types in src/types.ts.
 */
/* eslint-disable */`;

const COMPILE_OPTIONS = {
	bannerComment: "",
	additionalProperties: false,
	format: false,
	unknownAny: true,
	declareExternallyReferenced: false,
};

function toPascalCase(eventType) {
	return eventType
		.split(/[.\-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

async function main() {
	const files = readdirSync(PAYLOAD_DIR)
		.filter((f) => f.endsWith(".json"))
		.sort();

	const sections = [];
	let payloadCount = 0;

	for (const filename of files) {
		const filePath = join(PAYLOAD_DIR, filename);
		const schemaDoc = JSON.parse(readFileSync(filePath, "utf8"));
		const defs = schemaDoc.$defs ?? {};

		const eventTypes = Object.keys(defs).sort();
		if (eventTypes.length === 0) continue;

		sections.push(`// ----- ${filename} -----`);

		for (const eventType of eventTypes) {
			const def = defs[eventType];
			const typeName = `${toPascalCase(eventType)}Payload`;
			const compiled = await compile(def, typeName, COMPILE_OPTIONS);
			sections.push(compiled.trim());
			payloadCount += 1;
		}
	}

	mkdirSync(OUT_DIR, { recursive: true });
	const output = `${BANNER}\n\n${sections.join("\n\n")}\n`;
	writeFileSync(OUT_FILE, output, "utf8");

	console.log(
		`generated: ${OUT_FILE} (${payloadCount} payload types from ${files.length} schema files)`,
	);
}

main().catch((err) => {
	console.error(`generate-types failed: ${err.message}`);
	process.exit(1);
});
