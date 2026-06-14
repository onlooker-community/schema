# Changelog

All notable changes to `@onlooker-community/schema` will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.0](https://github.com/onlooker-community/schema/compare/v2.8.0...v2.9.0) (2026-06-14)


### Features

* **inspector:** add inspector.* event types for per-edit verification ([#37](https://github.com/onlooker-community/schema/issues/37)) ([1e5a33d](https://github.com/onlooker-community/schema/commit/1e5a33d7dd7922d0ff51b36cf31d745ea41be131))

## [2.8.0](https://github.com/onlooker-community/schema/compare/v2.7.0...v2.8.0) (2026-06-12)


### Features

* **lineage:** add lineage.* event types for change provenance ([#35](https://github.com/onlooker-community/schema/issues/35)) ([dbdaf4b](https://github.com/onlooker-community/schema/commit/dbdaf4b9b0ff9c23a0ab5bb66341d2b6e71b143e))

## [2.7.0](https://github.com/onlooker-community/schema/compare/v2.6.0...v2.7.0) (2026-06-12)


### Features

* **bursar:** add bursar.* event types for budget rollup ([#33](https://github.com/onlooker-community/schema/issues/33)) ([6a079c2](https://github.com/onlooker-community/schema/commit/6a079c26750e150bfd0aecbc494e037d0c88dff3))

## [2.6.0](https://github.com/onlooker-community/schema/compare/v2.5.0...v2.6.0) (2026-06-04)


### Features

* **assayer:** add assayer.* event schema for claim verification :detective: ([#31](https://github.com/onlooker-community/schema/issues/31)) ([85fab2a](https://github.com/onlooker-community/schema/commit/85fab2a27e8ef0d23c578d0c2cafec12a164d80b))

## [2.5.0](https://github.com/onlooker-community/schema/compare/v2.4.0...v2.5.0) (2026-06-04)


### Features

* **events:** register memory plugin layer events :books: ([#29](https://github.com/onlooker-community/schema/issues/29)) ([837fe4d](https://github.com/onlooker-community/schema/commit/837fe4d6a2a8fd877e352a52ed1ebbc748839efe))

## [2.4.0](https://github.com/onlooker-community/schema/compare/v2.3.0...v2.4.0) (2026-05-26)


### Features

* **governor:** full event schema for resource governance and budget enforcement :rocket: ([#27](https://github.com/onlooker-community/schema/issues/27)) ([d8f2ade](https://github.com/onlooker-community/schema/commit/d8f2ade194509647e3c03cde77fad407452acc52))

## [2.3.0](https://github.com/onlooker-community/schema/compare/v2.2.0...v2.3.0) (2026-05-25)


### Features

* **events:** add archivist.compact.* and archivist.inject.started schemas :building_construction: ([#23](https://github.com/onlooker-community/schema/issues/23)) ([cb1c238](https://github.com/onlooker-community/schema/commit/cb1c238423197070be5d20ca204b17dc3e9724e1))

## [2.2.0](https://github.com/onlooker-community/schema/compare/v2.1.0...v2.2.0) (2026-05-24)


### Features

* **events:** flesh out echo.* schema for file-change reactive evaluation :fire: ([#20](https://github.com/onlooker-community/schema/issues/20)) ([babd055](https://github.com/onlooker-community/schema/commit/babd055fb8dbb646e46eada4c65c54f7d362ca3b))

## [2.1.0](https://github.com/onlooker-community/schema/compare/v2.0.0...v2.1.0) (2026-05-24)


### Features

* **events:** expand tribunal namespace for multi-agent quality gates :thinking: ([#18](https://github.com/onlooker-community/schema/issues/18)) ([c588829](https://github.com/onlooker-community/schema/commit/c58882906ad22bac4db781f5cfe081efb85a4019))

## [2.0.0](https://github.com/onlooker-community/schema/compare/v1.4.1...v2.0.0) (2026-05-23)


### ⚠ BREAKING CHANGES

* **events:** cues.matched and cues.applied event types are renamed to prompt_rule.matched and prompt_rule.applied. Payload field names also change (cue_id -> rule_id, cue_name -> rule_name, guidance_length -> guidance_chars). Consumers emitting cues.* must update to the new names; the experimental marketplace cues plugin is already being replaced.

### Features

* **events:** rename cues.* to prompt_rule.* :nail_care: ([#16](https://github.com/onlooker-community/schema/issues/16)) ([d234f32](https://github.com/onlooker-community/schema/commit/d234f32a5778c0766bbe3afdb322a12673d7347b))

## [1.4.1](https://github.com/onlooker-community/schema/compare/v1.4.0...v1.4.1) (2026-05-22)


### Bug Fixes

* add repo url to package.json ([bb5327d](https://github.com/onlooker-community/schema/commit/bb5327dbf560597c3714c9893d6e29cf996d7989))

## [1.4.0](https://github.com/onlooker-community/schema/compare/v1.3.0...v1.4.0) (2026-05-21)


### Features

* **schema:** add skill.invoked event type and payload ([ee2c879](https://github.com/onlooker-community/schema/commit/ee2c879dd19a971d85f40ee1c595c268e71c00ba))
* **schema:** add skill.invoked event type and payload :sparkles: ([a2b6c42](https://github.com/onlooker-community/schema/commit/a2b6c422b7970197cf9ebb4db75464ce406f48b6))


### Bug Fixes

* **types:** sort SKILL_INVOKED export after SESSION_START :relieved: ([d4068f8](https://github.com/onlooker-community/schema/commit/d4068f8fcef043e1b359f514bc7cc8f1408444e9))

## [1.3.0](https://github.com/onlooker-community/schema/compare/v1.2.0...v1.3.0) (2026-05-21)


### Features

* **schema:** add Cloudflare Worker deployment and static asset preparation ([9a8b652](https://github.com/onlooker-community/schema/commit/9a8b6528e2a77fd256688470f9ed62458145357b))


### Bug Fixes

* **ci:** update deployment trigger to release events in GitHub Actions ([5c998e8](https://github.com/onlooker-community/schema/commit/5c998e8e39ebe5eaf748596aa9c74764815ebdd7))

## [1.2.0](https://github.com/onlooker-community/schema/compare/v1.1.0...v1.2.0) (2026-05-16)


### Features

* **schema:** add generate-types.js for payload schema drift detection (ONL-6) ([6edf5a7](https://github.com/onlooker-community/schema/commit/6edf5a7b2ff21128a337ed2bc30c8cf2502ae82c))

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
- `governor.*` — `budget.warning`, `budget.exceeded`, `session.complete`
- `echo.*` — `suite.started`, `suite.complete`, `regression.detected`
- `counsel.*` — `brief.generated`
- `onlooker.*` — `session.summary`
- `meridian.*` — `hint.generated`, `hint.delivered`, `outcome.recorded`, `reliance.measured`, `lesson.curated`, `playbook.updated`

### Notes

- Payload schemas for `task.start`, `task.complete`, and `task.fail` are intentionally minimal in `1.0.0`. They are reserved in the envelope `event_type` enum but their payloads accept any object shape until they are formalized in a future `1.x` minor release.
- The `sequence` counter is process-local. Cross-process ordering must be reconstructed by the consumer using `(machine_id, session_id, timestamp)`.
