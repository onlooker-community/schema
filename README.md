# @onlooker-community/schema

Canonical event schema for the Onlooker ecosystem. Every plugin, adapter, and the daemon itself depends on this package to agree on the shape of telemetry.

## Install

```bash
npm install @onlooker-community/schema
```

## Quick start

```ts
import {
  createEvent,
  validate,
  isEventOfType,
  TRIBUNAL_VERDICT,
} from "@onlooker-community/schema";

const event = createEvent({
  runtime: "claude-code",
  plugin: "tribunal",
  machine_id: "11111111-2222-3333-4444-555555555555",
  session_id: "session-abc",
  event_type: TRIBUNAL_VERDICT,
  payload: {
    task_id: "task-1",
    score: 0.92,
    passed: true,
    judge_type: "standard",
  },
});

const result = validate(event);
if (!result.valid) {
  for (const err of result.errors) console.error(`${err.path}: ${err.message}`);
  process.exit(1);
}

if (isEventOfType(result.event, TRIBUNAL_VERDICT)) {
  // result.event.payload is narrowed to TribunalVerdictPayload
  console.log(result.event.payload.judge_type);
}
```

## Event envelope

```ts
interface OnlookerEvent<T extends EventType = EventType> {
  id: string;                  // UUID
  schema_version: "1.0";
  runtime: RuntimeId;          // "claude-code" | "cursor" | "copilot" | "gemini" | "custom"
  adapter_id?: string;
  plugin: string;
  machine_id: string;          // UUID
  timestamp: string;           // ISO 8601 UTC
  session_id: string;
  sequence: number;            // monotonic, ≥ 0
  event_type: T;
  payload: PayloadFor<T>;
  cost_usd?: number;
  token_count?: number;
  redacted?: boolean;
}
```

## Namespaces

| Namespace      | Events                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `session`      | `start`, `end`, `compact`, `prompt`                                                                                     |
| `task`         | `start`, `complete`, `fail`                                                                                             |
| `tool`         | `file.read`, `file.write`, `file.edit`, `shell.exec`, `web.fetch`, `agent.spawn`, `agent.complete`                      |
| `sentinel`     | `blocked`, `allowed`, `reviewed`                                                                                        |
| `tribunal`     | `verdict`, `actor.complete`, `meta.complete`                                                                            |
| `warden`       | `threat.detected`, `threat.cleared`, `gate.blocked`                                                                     |
| `oracle`       | `calibration.requested`, `calibration.complete`                                                                         |
| `archivist`    | `extract.complete`, `inject.complete`                                                                                   |
| `relay`        | `handoff.captured`, `handoff.injected`                                                                                  |
| `scribe`       | `capture.complete`, `distill.complete`                                                                                  |
| `cues`         | `matched`, `applied`                                                                                                    |
| `cartographer` | `audit.complete`, `issue.found`                                                                                         |
| `ledger`       | `budget.warning`, `budget.exceeded`, `session.complete`                                                                 |
| `echo`         | `suite.started`, `suite.complete`, `regression.detected`                                                                |
| `counsel`      | `brief.generated`                                                                                                       |
| `onlooker`     | `session.summary`                                                                                                       |
| `meridian`     | `hint.generated`, `hint.delivered`, `outcome.recorded`, `reliance.measured`, `lesson.curated`, `playbook.updated`       |

## API surface

### Values

- `createEvent(params)` — factory that fills in `id`, `timestamp`, `sequence`, `schema_version`, and `redacted: false`.
- `validate(raw)` — returns `{ valid: true, event } | { valid: false, errors }`.
- `validateOrThrow(raw)` — returns the typed event or throws with field paths in the message.
- `isEventOfType(event, type)` — type guard that narrows `payload` to the matching interface.
- `isEventType(value)` — runtime check that a string is a known event type.
- `ALL_EVENT_TYPES` — `readonly EventType[]` of every known type.
- One typed string constant per event (e.g. `SENTINEL_BLOCKED`, `MERIDIAN_HINT_GENERATED`).
- `_resetSequence()` — resets the module-level sequence counter. Tests only.

### Types

- `OnlookerEvent<T>`, `PayloadFor<T>`, `EventType`, `RuntimeId`.
- One payload interface per event type (`SentinelBlockedPayload`, `TribunalVerdictPayload`, …).
- `ValidationResult`, `ValidationErrorDetail`, `CreateEventParams<T>`.

## JSON Schema files

The raw JSON Schema (draft 2020-12) files are shipped alongside the JS for non-TypeScript consumers (Go, Python, Rust, …):

```ts
import envelope from "@onlooker-community/schema/schemas/event.v1.json" with { type: "json" };
import sessionPayloads from "@onlooker-community/schema/schemas/payload/session.json" with { type: "json" };
```

Or resolve paths with `node`'s package resolution:

```bash
node -p "require.resolve('@onlooker-community/schema/schemas/event.v1.json')"
```

## Versioning policy

- The `schema_version` field is locked at `"1.0"` for the entire `1.x` line of this package.
- Adding a new event type, adding an optional payload field, or relaxing an enum is a **minor** release.
- Removing an event type, making an optional field required, tightening an enum, or changing `additionalProperties` is a **major** release and bumps `schema_version`.
- Payload schemas for `task.start`, `task.complete`, and `task.fail` are intentionally minimal in `1.0.0` and will be filled in during the `1.x` line.

## Development

```bash
npm install
npm run typecheck
npm test
npm run validate-schemas
npm run build
```

`npm run prepublishOnly` runs `build`, `validate-schemas`, and `test` and is enforced before publishing.
