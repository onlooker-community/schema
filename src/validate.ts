import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AnySchema, ErrorObject, ValidateFunction } from "ajv";
import { Ajv2020 } from "ajv/dist/2020.js";
import _addFormats, { type FormatsPlugin } from "ajv-formats";

import { type EventType, isEventType } from "./event-types.js";
import type { OnlookerEvent, PayloadFor, RuntimeId } from "./types.js";

const addFormats: FormatsPlugin =
	(_addFormats as unknown as { default?: FormatsPlugin }).default ??
	(_addFormats as unknown as FormatsPlugin);

const HERE = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = resolve(HERE, "..", "schemas", "event.v1.json");
const PAYLOAD_DIR = resolve(HERE, "..", "schemas", "payload");

const envelopeSchema: AnySchema = JSON.parse(
	readFileSync(SCHEMA_PATH, "utf8"),
) as AnySchema;

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const validateEnvelope: ValidateFunction = ajv.compile(envelopeSchema);

const payloadValidators = new Map<string, ValidateFunction>();
for (const filename of readdirSync(PAYLOAD_DIR)) {
	if (!filename.endsWith(".json")) continue;
	const file = JSON.parse(
		readFileSync(join(PAYLOAD_DIR, filename), "utf8"),
	) as {
		$defs?: Record<string, AnySchema>;
	};
	for (const [eventType, schema] of Object.entries(file.$defs ?? {})) {
		payloadValidators.set(eventType, ajv.compile(schema));
	}
}

export interface ValidationErrorDetail {
	path: string;
	message: string;
}

export type ValidationResult =
	| { valid: true; event: OnlookerEvent }
	| { valid: false; errors: ValidationErrorDetail[] };

function formatErrors(
	errors: ErrorObject[] | null | undefined,
): ValidationErrorDetail[] {
	if (!errors || errors.length === 0) return [];
	return errors.map((err) => {
		const base = err.instancePath || "";
		const missing =
			err.keyword === "required" &&
			typeof err.params === "object" &&
			err.params !== null &&
			"missingProperty" in err.params
				? `/${(err.params as { missingProperty: string }).missingProperty}`
				: "";
		const path = `${base}${missing}` || "/";
		return { path, message: err.message ?? "validation error" };
	});
}

export function validate(raw: unknown): ValidationResult {
	const ok = validateEnvelope(raw);
	if (!ok) {
		return { valid: false, errors: formatErrors(validateEnvelope.errors) };
	}
	const event = raw as OnlookerEvent;
	const validatePayload = payloadValidators.get(event.event_type);
	if (validatePayload) {
		const payloadOk = validatePayload(event.payload);
		if (!payloadOk) {
			return { valid: false, errors: formatErrors(validatePayload.errors) };
		}
	}
	return { valid: true, event };
}

export function validateOrThrow(raw: unknown): OnlookerEvent {
	const result = validate(raw);
	if (result.valid) return result.event;
	const summary = result.errors
		.map((e) => `${e.path}: ${e.message}`)
		.join("; ");
	throw new Error(`Invalid OnlookerEvent: ${summary}`);
}

export function isEventOfType<T extends EventType>(
	event: OnlookerEvent,
	type: T,
): event is OnlookerEvent<T> {
	return event.event_type === type;
}

let sequenceCounter = 0;

export function _resetSequence(): void {
	sequenceCounter = 0;
}

export interface CreateEventParams<T extends EventType> {
	runtime: RuntimeId;
	adapter_id?: string;
	plugin: string;
	machine_id: string;
	session_id: string;
	event_type: T;
	payload: PayloadFor<T>;
	cost_usd?: number;
	token_count?: number;
}

export function createEvent<T extends EventType>(
	params: CreateEventParams<T>,
): OnlookerEvent<T> {
	if (!isEventType(params.event_type)) {
		throw new Error(`Unknown event_type: ${params.event_type}`);
	}
	const event: OnlookerEvent<T> = {
		id: randomUUID(),
		schema_version: "1.0",
		runtime: params.runtime,
		plugin: params.plugin,
		machine_id: params.machine_id,
		timestamp: new Date().toISOString(),
		session_id: params.session_id,
		sequence: sequenceCounter++,
		event_type: params.event_type,
		payload: params.payload,
		redacted: false,
	};
	if (params.adapter_id !== undefined) event.adapter_id = params.adapter_id;
	if (params.cost_usd !== undefined) event.cost_usd = params.cost_usd;
	if (params.token_count !== undefined) event.token_count = params.token_count;
	return event;
}
