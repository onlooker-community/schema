import type { EventType } from "./event-types.js";

/**
 * What an event says happened, in the one word a consumer that only has the
 * type - not the payload - can act on.
 *
 * Exists for the hosted session feed (ONL-191, for ONL-190). A session
 * summary keeps event types and their counts and never the payload, so a
 * feed that wants to say "curator ran twice and found nothing" has to know
 * from the type alone that `curator.scan.complete` is bookkeeping and
 * `curator.finding.*` is the work.
 *
 * - `output`: the plugin did the thing it exists to do - a record written, a
 *   finding stored, a verdict or gate decision made, something surfaced to
 *   the agent or the user. A gate that BLOCKS is output: deciding is the job.
 * - `skipped`: it ran and deliberately did nothing - disabled, below a
 *   threshold, nothing new to act on.
 * - `failed`: the plugin itself tried and could not - an unreachable
 *   dependency, a failed write, a configuration it cannot act on.
 * - `lifecycle`: start, complete and housekeeping events that fire whether or
 *   not anything was produced. A `*.complete` that fires on every run, zero
 *   results included, is lifecycle; the results are their own types.
 * - `observed`: a record of what the agent or the harness did, not of plugin
 *   work - sessions, prompts, tool calls, memory loaded at session start.
 */
export const EVENT_ROLES = [
	"output",
	"skipped",
	"failed",
	"lifecycle",
	"observed",
] as const;

export type EventRole = (typeof EVENT_ROLES)[number];

/**
 * The role of every registered event type.
 *
 * Typed as a `Record` over `EventType` so that registering a type in
 * event-types.ts without deciding its role here is a compile error, rather
 * than a type every consumer meets as unknown.
 *
 * Each role was read from the code at the type's emit site on
 * onlooker-community/ecosystem origin/main (2026-10-24), not from the name.
 * Where nothing on origin/main emits a type it is marked below, and the role
 * comes from its payload schema and the plugin's design notes instead.
 *
 * One role per type is a simplification some emitters do not honor: a few
 * types carry a payload `reason` or `outcome` that spans two roles. Those are
 * given the role they carry in practice and annotated, because a consumer of
 * session summaries never sees the payload that would tell them apart.
 *
 * This answers a broader question than the CLI doctor's `writeEvents`
 * (onlooker apps/cli/src/streams.ts), which names only the events whose
 * ABSENCE is evidence of a stall. The two may disagree, and that is not drift.
 */
export const EVENT_TYPE_ROLES: Readonly<Record<EventType, EventRole>> = {
	// The core substrate hooks, recording the harness rather than a plugin.
	"session.start": "observed",
	"session.end": "observed",
	"session.compact": "observed",
	"session.prompt": "observed",
	"skill.invoked": "observed",
	"task.start": "observed",
	"task.complete": "observed",
	// Not emitted: TaskCompleted always reports success, so no task fails.
	"task.fail": "observed",
	"tool.file.read": "observed",
	"tool.file.write": "observed",
	"tool.file.edit": "observed",
	"tool.shell.exec": "observed",
	"tool.web.fetch": "observed",
	"tool.agent.spawn": "observed",
	"tool.agent.complete": "observed",

	// Not emitted: sentinel lives outside the ecosystem repo.
	"sentinel.blocked": "output",
	"sentinel.allowed": "output",
	"sentinel.reviewed": "output",

	// The stop gate emits session/iteration/judge/verdict/gate.*; the rest are
	// emitted only by the model following the /tribunal skill's prompt.
	"tribunal.session.start": "lifecycle",
	"tribunal.session.complete": "lifecycle",
	"tribunal.iteration.start": "lifecycle",
	"tribunal.actor.start": "lifecycle",
	// The Actor's work is input to the jury, not tribunal's own verdict.
	"tribunal.actor.complete": "lifecycle",
	"tribunal.judge.start": "lifecycle",
	"tribunal.verdict": "output",
	"tribunal.meta.start": "lifecycle",
	"tribunal.meta.complete": "output",
	"tribunal.jury.empaneled": "lifecycle",
	"tribunal.consensus.reached": "output",
	"tribunal.dissent.recorded": "output",
	"tribunal.gate.passed": "output",
	"tribunal.gate.blocked": "output",
	// Also carries judge failures (judge_timeout, judge_error,
	// claude_unavailable). Measured on one machine: 667 of 667 were
	// `disabled`, so skipped is what it means in practice.
	"tribunal.gate.skipped": "skipped",

	"warden.threat.detected": "output",
	// The plugin carrying out a user's /warden clear.
	"warden.threat.cleared": "output",
	"warden.gate.blocked": "output",

	// The gate doing its job: it found a secret headed somewhere it should
	// not go. decision "none" (a record-only kind) is still output - the
	// plugin noticed something.
	"customs.egress.flagged": "output",
	// It ran, found a secret, and the destination was its issuer.
	"customs.egress.allowed": "skipped",
	"customs.check.failed": "failed",

	// Not emitted: oracle lives outside the ecosystem repo.
	"oracle.calibration.requested": "lifecycle",
	"oracle.calibration.complete": "output",

	// Not emitted: archivist's real output goes out as onlooker.artifact.ready.
	"archivist.extract.complete": "output",
	"archivist.compact.started": "lifecycle",
	"archivist.compact.complete": "lifecycle",
	"archivist.inject.started": "lifecycle",
	"archivist.inject.complete": "output",

	// Not emitted: relay lives outside the ecosystem repo.
	"relay.handoff.captured": "output",
	"relay.handoff.injected": "output",

	// Not emitted: capture writes state without an event.
	"scribe.capture.complete": "lifecycle",
	"scribe.distill.complete": "output",
	"scribe.distill.skipped": "skipped",

	// Fires on every match, including one fire-once then suppresses; `applied`
	// is the guidance actually injected.
	"prompt_rule.matched": "lifecycle",
	"prompt_rule.applied": "output",

	"governor.gate.checked": "output",
	// Emitted even when the ledger append before it failed.
	"governor.call.recorded": "output",
	"governor.ledger.write_failed": "failed",
	// Not emitted outside governor's own bats tests.
	"governor.child.allocated": "output",
	"governor.child.returned": "output",
	"governor.budget.warning": "output",
	"governor.budget.exceeded": "output",
	"governor.session.complete": "lifecycle",
	"governor.lock.stale_cleared": "lifecycle",

	"bursar.session.recorded": "output",
	"bursar.rollup.surfaced": "output",
	"bursar.rollup.skipped": "skipped",

	"lineage.change.recorded": "output",
	// Answering is the job, including an answer of no matches.
	"lineage.query.answered": "output",

	// Not emitted: echo's stop gate was retired (ONL-103). Kept so older
	// measurement artifacts still read.
	"echo.suite.started": "lifecycle",
	"echo.suite.complete": "lifecycle",
	"echo.suite.skipped": "skipped",
	"echo.regression.detected": "output",
	"echo.improvement.detected": "output",

	// Fires at the end of every audit, zero issues included.
	"cartographer.audit.complete": "lifecycle",
	"cartographer.issue.found": "output",
	"cartographer.issue.resolved": "output",

	"counsel.brief.generated": "output",

	// Not emitted by the ecosystem; the agent side's own summary.
	"onlooker.session.summary": "observed",
	"onlooker.artifact.ready": "output",
	// Configured watch patterns match nothing, so the plugin can never act.
	"onlooker.watch.unmatched": "failed",
	"onlooker.currency.checked": "lifecycle",
	"onlooker.currency.stale": "output",
	"onlooker.currency.skipped": "skipped",

	// Not emitted: meridian lives outside the ecosystem repo.
	"meridian.hint.generated": "output",
	"meridian.hint.delivered": "output",
	"meridian.outcome.recorded": "observed",
	"meridian.reliance.measured": "output",
	"meridian.lesson.curated": "output",
	"meridian.playbook.updated": "output",

	// The substrate recording which memory files Claude Code loaded at
	// session start - not a plugin's work, though it is often the largest
	// count in a session.
	"memory.recalled": "observed",

	"librarian.scan.started": "lifecycle",
	"librarian.scan.complete": "lifecycle",
	"librarian.candidate.proposed": "output",
	// Also fires when the classifier call failed (reason classified_null).
	// Measured: 4,032 of 4,106 were filter declines.
	"librarian.candidate.dropped": "skipped",
	"librarian.proposal.accepted": "output",
	"librarian.proposal.rejected": "output",
	// Not emitted: described in librarian's design notes only.
	"librarian.proposal.merged": "output",
	"librarian.proposal.superseded": "output",
	// Both carry an outcome that can mean the panel was unavailable.
	"librarian.lesson.asserted": "output",
	"librarian.lesson.judged": "output",
	"librarian.lesson.promoted": "output",
	"librarian.lesson.shipped": "output",
	"librarian.lesson.vetoed": "output",
	"librarian.autojury.complete": "lifecycle",
	"librarian.tombstone.created": "output",

	"curator.scan.started": "lifecycle",
	// Fires on every scan, zero findings included - the findings are the
	// curator.finding.* types below.
	"curator.scan.complete": "lifecycle",
	"curator.finding.date_decayed": "output",
	"curator.finding.path_broken": "output",
	// Not emitted: these detectors are not built yet.
	"curator.finding.symbol_missing": "output",
	"curator.finding.url_unchecked": "output",
	"curator.finding.unused_low_signal": "output",
	"curator.finding.contradiction": "output",
	"curator.finding.redundant_pair": "output",
	"curator.finding.broken_index": "output",
	"curator.finding.orphaned_memory": "output",
	// Not emitted: described in curator's design notes only.
	"curator.finding.acknowledged": "output",
	"curator.finding.resolved": "output",

	"historian.indexing.started": "lifecycle",
	"historian.indexing.complete": "lifecycle",
	// A chunk stored with redactions applied - indexing is the job.
	"historian.chunk.sanitized": "output",
	"historian.chunk.dropped": "skipped",
	"historian.embedder.unavailable": "failed",
	"historian.embedder.failed": "failed",
	"historian.retrieval.started": "lifecycle",
	"historian.retrieval.complete": "lifecycle",
	"historian.retrieval.surfaced": "output",
	// Not emitted: deferred. Maintenance rather than the plugin's purpose.
	"historian.prune.complete": "lifecycle",
	"historian.purge.complete": "lifecycle",
	"historian.config.warning": "failed",

	"assayer.audit.started": "lifecycle",
	"assayer.claim.contradicted": "output",
	"assayer.claim.unverified": "output",
	// Fires at the end of every audit, as cartographer's does; the findings
	// are the claim.* types above. Doctor treats it as assayer's write
	// signal, which is a different question - see the note on this map.
	"assayer.audit.complete": "lifecycle",

	// A failed check found a problem: output, not the `failed` role.
	"inspector.check.passed": "output",
	"inspector.check.failed": "output",
	// Also carries tool_missing and timeout, which are failures.
	"inspector.check.skipped": "skipped",
	"inspector.run.completed": "lifecycle",

	"compass.check.passed": "output",
	// Also carries an evaluator error that fails closed (sampler_error).
	"compass.check.failed": "output",
	"compass.check.skipped": "skipped",
	// The user typed "compass: proceed", so nothing was evaluated.
	"compass.check.overridden": "skipped",
	// Not emitted: described in compass's design only.
	"compass.check.canceled": "output",
};

/**
 * The role of an event type, or undefined for a type the schema does not
 * register.
 *
 * Takes a plain string because that is what a consumer holds - a type read
 * out of an event log or an API body, not yet known to be registered. The own
 * property check is what keeps `"__proto__"` or `"constructor"` from reading
 * through Object.prototype and coming back as a function.
 */
export function roleOf(type: string): EventRole | undefined {
	return Object.hasOwn(EVENT_TYPE_ROLES, type)
		? EVENT_TYPE_ROLES[type as EventType]
		: undefined;
}
