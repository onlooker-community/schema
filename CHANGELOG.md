# Changelog

All notable changes to `@onlooker-community/schema` will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0](https://github.com/onlooker-community/schema/compare/v1.0.0...v1.1.0) (2026-05-15)


### Features

* add payload schemas for task.* event types ([e9e6ad2](https://github.com/onlooker-community/schema/commit/e9e6ad21bd13b089fa3a91f9fc5af6585305389c))
* **schema:** add payload schemas for task.* events (ONL-15) ([2560fcb](https://github.com/onlooker-community/schema/commit/2560fcbfbfb04de550bcca1c42eb31ae1e849a89))


### Bug Fixes

* **schema:** pin task.complete success to const true ([eaaf946](https://github.com/onlooker-community/schema/commit/eaaf946c2491b217fafc2ebfd14bc692854ac1b4))

## 1.0.0 (2026-05-08)


### Features

* add tool payload schemas and validation scripts ([f0a4f97](https://github.com/onlooker-community/schema/commit/f0a4f97d41405006e03e62aca63b8b9cc04cb02d))
* add tool payload schemas and validation scripts ([390a5ea](https://github.com/onlooker-community/schema/commit/390a5ea078fa6a808c65f363b870e3fe2ba3ce78))


### Bug Fixes

* revert version number to 0.1.0 in package-lock.json ([12c4fbe](https://github.com/onlooker-community/schema/commit/12c4fbedc7b864449979b68d85c36e145459de5b))

## [1.0.0] — 2026-05-07

Initial public release. Establishes the canonical event envelope and the first wave of per-namespace payload schemas for the Onlooker ecosystem.

### Added

- Event envelope JSON Schema (`schemas/event.v1.json`, draft 2020-12) with `schema_version: "1.0"`.
- TypeScript types (`OnlookerEvent`, `PayloadFor`, `EventType`, `RuntimeId`) plus one interface per event payload.
- Ajv-backed `validate`, `validateOrThrow`, `isEventOfType`, and `isEventType` helpers.
- `createEvent()` factory that auto-fills `id`, `timestamp`, monotonic `sequence`, `schema_version`, and `redacted: false`.
- Typed string constants for every event type (e.g. `SENTINEL_BLOCKED`, `MERIDIAN_HINT_GENERATED`).
- `scripts/validate-schemas.js` cross-check, wired into `prepublishOnly`.
- vitest suite covering envelope validation, type narrowing, and `createEvent` invariants.
- The `schemas/` directory is shipped in the npm tarball so non-TS consumers can import the raw JSON Schema.

### Event types

Grouped by namespace:

- `session.*` — `start`, `end`, `compact`, `prompt`
- `task.*` — `start`, `complete`, `fail`
- `tool.*` — `file.read`, `file.write`, `file.edit`, `shell.exec`, `web.fetch`, `agent.spawn`, `agent.complete`
- `sentinel.*` — `blocked`, `allowed`, `reviewed`
- `tribunal.*` — `verdict`, `actor.complete`, `meta.complete`
- `warden.*` — `threat.detected`, `threat.cleared`, `gate.blocked`
- `oracle.*` — `calibration.requested`, `calibration.complete`
- `archivist.*` — `extract.complete`, `inject.complete`
- `relay.*` — `handoff.captured`, `handoff.injected`
- `scribe.*` — `capture.complete`, `distill.complete`
- `cues.*` — `matched`, `applied`
- `cartographer.*` — `audit.complete`, `issue.found`
- `ledger.*` — `budget.warning`, `budget.exceeded`, `session.complete`
- `echo.*` — `suite.started`, `suite.complete`, `regression.detected`
- `counsel.*` — `brief.generated`
- `onlooker.*` — `session.summary`
- `meridian.*` — `hint.generated`, `hint.delivered`, `outcome.recorded`, `reliance.measured`, `lesson.curated`, `playbook.updated`

### Notes

- Payload schemas for `task.start`, `task.complete`, and `task.fail` are intentionally minimal in `1.0.0`. They are reserved in the envelope `event_type` enum but their payloads accept any object shape until they are formalized in a future `1.x` minor release.
- The `sequence` counter is process-local. Cross-process ordering must be reconstructed by the consumer using `(machine_id, session_id, timestamp)`.
