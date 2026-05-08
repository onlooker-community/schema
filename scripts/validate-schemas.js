#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ENVELOPE_PATH = join(ROOT, "schemas", "event.v1.json");
const PAYLOAD_DIR = join(ROOT, "schemas", "payload");

let hasErrors = false;

function error(msg) {
	console.error(`error: ${msg}`);
	hasErrors = true;
}

function warn(msg) {
	console.warn(`warning: ${msg}`);
}

const envelope = JSON.parse(readFileSync(ENVELOPE_PATH, "utf8"));
const eventTypeProperty = envelope.properties?.event_type;
const enumValues = eventTypeProperty?.enum;

if (!Array.isArray(enumValues) || enumValues.length === 0) {
	error("event.v1.json does not declare a non-empty event_type enum");
	process.exit(1);
}

const enumSet = new Set(enumValues);
const enumDuplicates = enumValues.filter((v, i) => enumValues.indexOf(v) !== i);
if (enumDuplicates.length > 0) {
	error(
		`event_type enum has duplicates: ${[...new Set(enumDuplicates)].join(", ")}`,
	);
}

const definedTypes = new Set();

for (const filename of readdirSync(PAYLOAD_DIR)) {
	if (!filename.endsWith(".json")) continue;
	const filePath = join(PAYLOAD_DIR, filename);
	let payloadFile;
	try {
		payloadFile = JSON.parse(readFileSync(filePath, "utf8"));
	} catch (err) {
		error(`failed to parse ${filename}: ${err.message}`);
		continue;
	}
	const defs = payloadFile.$defs ?? {};
	for (const key of Object.keys(defs)) {
		if (!enumSet.has(key)) {
			error(
				`${filename} declares payload for "${key}" but it is not in the envelope event_type enum`,
			);
		}
		if (definedTypes.has(key)) {
			error(
				`payload "${key}" is defined in multiple payload files (latest: ${filename})`,
			);
		}
		definedTypes.add(key);
		const def = defs[key];
		if (def.additionalProperties !== false) {
			error(
				`${filename} $defs["${key}"] is missing "additionalProperties": false`,
			);
		}
	}
}

for (const t of enumValues) {
	if (!definedTypes.has(t)) {
		warn(`event_type "${t}" has no payload schema yet`);
	}
}

console.log(
	`validated: ${enumValues.length} event types, ${definedTypes.size} payload schemas`,
);

if (hasErrors) {
	process.exit(1);
}
