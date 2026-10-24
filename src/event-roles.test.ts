import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Through the package entry point rather than ./event-roles.js, so a role map
// that exists but was never exported fails here instead of in a consumer.
import {
	ALL_EVENT_TYPES,
	EVENT_ROLES,
	EVENT_TYPE_ROLES,
	type EventRole,
	roleOf,
} from "./index.js";

describe("EVENT_TYPE_ROLES", () => {
	// The Record type already refuses a missing key at compile time. This
	// pins the runtime object too, which is what a JS consumer reads, and
	// catches an extra key the type would allow through a cast.
	it("has exactly one role for every registered event type", () => {
		expect(Object.keys(EVENT_TYPE_ROLES).sort()).toEqual(
			[...ALL_EVENT_TYPES].sort(),
		);
	});

	it("uses only declared roles", () => {
		for (const role of Object.values(EVENT_TYPE_ROLES)) {
			expect(EVENT_ROLES).toContain(role);
		}
	});

	// ALL_EVENT_TYPES and the envelope's JSON enum are two hand-kept lists of
	// the same thing. Nothing compared them before this; a type added to one
	// and not the other would get a role and still fail validation, or
	// validate and have no role.
	it("covers the same types the envelope schema accepts", () => {
		const envelope = JSON.parse(
			readFileSync(
				new URL("../schemas/event.v1.json", import.meta.url),
				"utf8",
			),
		) as { properties: { event_type: { enum: string[] } } };

		expect(Object.keys(EVENT_TYPE_ROLES).sort()).toEqual(
			[...envelope.properties.event_type.enum].sort(),
		);
	});
});

describe("roleOf", () => {
	it("returns the role of a registered type", () => {
		expect(roleOf("session.start")).toBe(EVENT_TYPE_ROLES["session.start"]);
	});

	it("returns undefined for a type the schema does not register", () => {
		expect(roleOf("made.up.type")).toBeUndefined();
	});

	// A consumer holds whatever string an event log or an API body carried.
	// On a plain object literal these read through Object.prototype and come
	// back as functions, which a caller would then render as a role.
	it.each([
		"__proto__",
		"constructor",
		"toString",
		"hasOwnProperty",
	])("returns undefined for the inherited key %s", (key) => {
		expect(roleOf(key)).toBeUndefined();
	});

	it("narrows to EventRole", () => {
		const role: EventRole | undefined = roleOf("session.start");
		expect(role === undefined || EVENT_ROLES.includes(role)).toBe(true);
	});
});
