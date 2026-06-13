export const SESSION_START = "session.start" as const;
export const SESSION_END = "session.end" as const;
export const SESSION_COMPACT = "session.compact" as const;
export const SESSION_PROMPT = "session.prompt" as const;

export const SKILL_INVOKED = "skill.invoked" as const;

export const TASK_START = "task.start" as const;
export const TASK_COMPLETE = "task.complete" as const;
export const TASK_FAIL = "task.fail" as const;

export const TOOL_FILE_READ = "tool.file.read" as const;
export const TOOL_FILE_WRITE = "tool.file.write" as const;
export const TOOL_FILE_EDIT = "tool.file.edit" as const;
export const TOOL_SHELL_EXEC = "tool.shell.exec" as const;
export const TOOL_WEB_FETCH = "tool.web.fetch" as const;
export const TOOL_AGENT_SPAWN = "tool.agent.spawn" as const;
export const TOOL_AGENT_COMPLETE = "tool.agent.complete" as const;

export const SENTINEL_BLOCKED = "sentinel.blocked" as const;
export const SENTINEL_ALLOWED = "sentinel.allowed" as const;
export const SENTINEL_REVIEWED = "sentinel.reviewed" as const;

export const TRIBUNAL_SESSION_START = "tribunal.session.start" as const;
export const TRIBUNAL_SESSION_COMPLETE = "tribunal.session.complete" as const;
export const TRIBUNAL_ITERATION_START = "tribunal.iteration.start" as const;
export const TRIBUNAL_ACTOR_START = "tribunal.actor.start" as const;
export const TRIBUNAL_ACTOR_COMPLETE = "tribunal.actor.complete" as const;
export const TRIBUNAL_JUDGE_START = "tribunal.judge.start" as const;
export const TRIBUNAL_VERDICT = "tribunal.verdict" as const;
export const TRIBUNAL_META_START = "tribunal.meta.start" as const;
export const TRIBUNAL_META_COMPLETE = "tribunal.meta.complete" as const;
export const TRIBUNAL_JURY_EMPANELED = "tribunal.jury.empaneled" as const;
export const TRIBUNAL_CONSENSUS_REACHED = "tribunal.consensus.reached" as const;
export const TRIBUNAL_DISSENT_RECORDED = "tribunal.dissent.recorded" as const;
export const TRIBUNAL_GATE_PASSED = "tribunal.gate.passed" as const;
export const TRIBUNAL_GATE_BLOCKED = "tribunal.gate.blocked" as const;

export const WARDEN_THREAT_DETECTED = "warden.threat.detected" as const;
export const WARDEN_THREAT_CLEARED = "warden.threat.cleared" as const;
export const WARDEN_GATE_BLOCKED = "warden.gate.blocked" as const;

export const ORACLE_CALIBRATION_REQUESTED =
	"oracle.calibration.requested" as const;
export const ORACLE_CALIBRATION_COMPLETE =
	"oracle.calibration.complete" as const;

export const ARCHIVIST_EXTRACT_COMPLETE = "archivist.extract.complete" as const;
export const ARCHIVIST_COMPACT_STARTED = "archivist.compact.started" as const;
export const ARCHIVIST_COMPACT_COMPLETE = "archivist.compact.complete" as const;
export const ARCHIVIST_INJECT_STARTED = "archivist.inject.started" as const;
export const ARCHIVIST_INJECT_COMPLETE = "archivist.inject.complete" as const;

export const RELAY_HANDOFF_CAPTURED = "relay.handoff.captured" as const;
export const RELAY_HANDOFF_INJECTED = "relay.handoff.injected" as const;

export const SCRIBE_CAPTURE_COMPLETE = "scribe.capture.complete" as const;
export const SCRIBE_DISTILL_COMPLETE = "scribe.distill.complete" as const;

export const PROMPT_RULE_MATCHED = "prompt_rule.matched" as const;
export const PROMPT_RULE_APPLIED = "prompt_rule.applied" as const;

export const GOVERNOR_GATE_CHECKED = "governor.gate.checked" as const;
export const GOVERNOR_CALL_RECORDED = "governor.call.recorded" as const;
export const GOVERNOR_LEDGER_WRITE_FAILED =
	"governor.ledger.write_failed" as const;
export const GOVERNOR_CHILD_ALLOCATED = "governor.child.allocated" as const;
export const GOVERNOR_CHILD_RETURNED = "governor.child.returned" as const;
export const GOVERNOR_BUDGET_WARNING = "governor.budget.warning" as const;
export const GOVERNOR_BUDGET_EXCEEDED = "governor.budget.exceeded" as const;
export const GOVERNOR_SESSION_COMPLETE = "governor.session.complete" as const;
export const GOVERNOR_LOCK_STALE_CLEARED =
	"governor.lock.stale_cleared" as const;

export const BURSAR_SESSION_RECORDED = "bursar.session.recorded" as const;
export const BURSAR_ROLLUP_SURFACED = "bursar.rollup.surfaced" as const;
export const BURSAR_ROLLUP_SKIPPED = "bursar.rollup.skipped" as const;

export const LINEAGE_CHANGE_RECORDED = "lineage.change.recorded" as const;
export const LINEAGE_QUERY_ANSWERED = "lineage.query.answered" as const;

export const ECHO_SUITE_STARTED = "echo.suite.started" as const;
export const ECHO_SUITE_COMPLETE = "echo.suite.complete" as const;
export const ECHO_REGRESSION_DETECTED = "echo.regression.detected" as const;
export const ECHO_IMPROVEMENT_DETECTED = "echo.improvement.detected" as const;

export const CARTOGRAPHER_AUDIT_COMPLETE =
	"cartographer.audit.complete" as const;
export const CARTOGRAPHER_ISSUE_FOUND = "cartographer.issue.found" as const;

export const COUNSEL_BRIEF_GENERATED = "counsel.brief.generated" as const;

export const ONLOOKER_SESSION_SUMMARY = "onlooker.session.summary" as const;

export const MERIDIAN_HINT_GENERATED = "meridian.hint.generated" as const;
export const MERIDIAN_HINT_DELIVERED = "meridian.hint.delivered" as const;
export const MERIDIAN_OUTCOME_RECORDED = "meridian.outcome.recorded" as const;
export const MERIDIAN_RELIANCE_MEASURED = "meridian.reliance.measured" as const;
export const MERIDIAN_LESSON_CURATED = "meridian.lesson.curated" as const;
export const MERIDIAN_PLAYBOOK_UPDATED = "meridian.playbook.updated" as const;

export const MEMORY_RECALLED = "memory.recalled" as const;

export const LIBRARIAN_SCAN_STARTED = "librarian.scan.started" as const;
export const LIBRARIAN_SCAN_COMPLETE = "librarian.scan.complete" as const;
export const LIBRARIAN_CANDIDATE_PROPOSED =
	"librarian.candidate.proposed" as const;
export const LIBRARIAN_CANDIDATE_DROPPED =
	"librarian.candidate.dropped" as const;
export const LIBRARIAN_PROPOSAL_ACCEPTED =
	"librarian.proposal.accepted" as const;
export const LIBRARIAN_PROPOSAL_REJECTED =
	"librarian.proposal.rejected" as const;
export const LIBRARIAN_PROPOSAL_MERGED = "librarian.proposal.merged" as const;
export const LIBRARIAN_PROPOSAL_SUPERSEDED =
	"librarian.proposal.superseded" as const;
export const LIBRARIAN_TOMBSTONE_CREATED =
	"librarian.tombstone.created" as const;

export const CURATOR_SCAN_STARTED = "curator.scan.started" as const;
export const CURATOR_SCAN_COMPLETE = "curator.scan.complete" as const;
export const CURATOR_FINDING_DATE_DECAYED =
	"curator.finding.date_decayed" as const;
export const CURATOR_FINDING_PATH_BROKEN =
	"curator.finding.path_broken" as const;
export const CURATOR_FINDING_SYMBOL_MISSING =
	"curator.finding.symbol_missing" as const;
export const CURATOR_FINDING_URL_UNCHECKED =
	"curator.finding.url_unchecked" as const;
export const CURATOR_FINDING_UNUSED_LOW_SIGNAL =
	"curator.finding.unused_low_signal" as const;
export const CURATOR_FINDING_CONTRADICTION =
	"curator.finding.contradiction" as const;
export const CURATOR_FINDING_REDUNDANT_PAIR =
	"curator.finding.redundant_pair" as const;
export const CURATOR_FINDING_BROKEN_INDEX =
	"curator.finding.broken_index" as const;
export const CURATOR_FINDING_ORPHANED_MEMORY =
	"curator.finding.orphaned_memory" as const;
export const CURATOR_FINDING_ACKNOWLEDGED =
	"curator.finding.acknowledged" as const;
export const CURATOR_FINDING_RESOLVED = "curator.finding.resolved" as const;

export const HISTORIAN_INDEXING_STARTED = "historian.indexing.started" as const;
export const HISTORIAN_INDEXING_COMPLETE =
	"historian.indexing.complete" as const;
export const HISTORIAN_CHUNK_SANITIZED = "historian.chunk.sanitized" as const;
export const HISTORIAN_CHUNK_DROPPED = "historian.chunk.dropped" as const;
export const HISTORIAN_EMBEDDER_UNAVAILABLE =
	"historian.embedder.unavailable" as const;
export const HISTORIAN_RETRIEVAL_STARTED =
	"historian.retrieval.started" as const;
export const HISTORIAN_RETRIEVAL_COMPLETE =
	"historian.retrieval.complete" as const;
export const HISTORIAN_RETRIEVAL_SURFACED =
	"historian.retrieval.surfaced" as const;
export const HISTORIAN_PRUNE_COMPLETE = "historian.prune.complete" as const;
export const HISTORIAN_PURGE_COMPLETE = "historian.purge.complete" as const;
export const HISTORIAN_CONFIG_WARNING = "historian.config.warning" as const;

export const ASSAYER_AUDIT_STARTED = "assayer.audit.started" as const;
export const ASSAYER_CLAIM_CONTRADICTED = "assayer.claim.contradicted" as const;
export const ASSAYER_CLAIM_UNVERIFIED = "assayer.claim.unverified" as const;
export const ASSAYER_AUDIT_COMPLETE = "assayer.audit.complete" as const;

export const INSPECTOR_CHECK_PASSED = "inspector.check.passed" as const;
export const INSPECTOR_CHECK_FAILED = "inspector.check.failed" as const;
export const INSPECTOR_CHECK_SKIPPED = "inspector.check.skipped" as const;
export const INSPECTOR_RUN_COMPLETED = "inspector.run.completed" as const;

export const COMPASS_CHECK_PASSED = "compass.check.passed" as const;
export const COMPASS_CHECK_FAILED = "compass.check.failed" as const;
export const COMPASS_CHECK_SKIPPED = "compass.check.skipped" as const;
export const COMPASS_CHECK_OVERRIDDEN = "compass.check.overridden" as const;
export const COMPASS_CHECK_CANCELED = "compass.check.canceled" as const;

export const ALL_EVENT_TYPES = [
	SESSION_START,
	SESSION_END,
	SESSION_COMPACT,
	SESSION_PROMPT,
	SKILL_INVOKED,
	TASK_START,
	TASK_COMPLETE,
	TASK_FAIL,
	TOOL_FILE_READ,
	TOOL_FILE_WRITE,
	TOOL_FILE_EDIT,
	TOOL_SHELL_EXEC,
	TOOL_WEB_FETCH,
	TOOL_AGENT_SPAWN,
	TOOL_AGENT_COMPLETE,
	SENTINEL_BLOCKED,
	SENTINEL_ALLOWED,
	SENTINEL_REVIEWED,
	TRIBUNAL_SESSION_START,
	TRIBUNAL_SESSION_COMPLETE,
	TRIBUNAL_ITERATION_START,
	TRIBUNAL_ACTOR_START,
	TRIBUNAL_ACTOR_COMPLETE,
	TRIBUNAL_JUDGE_START,
	TRIBUNAL_VERDICT,
	TRIBUNAL_META_START,
	TRIBUNAL_META_COMPLETE,
	TRIBUNAL_JURY_EMPANELED,
	TRIBUNAL_CONSENSUS_REACHED,
	TRIBUNAL_DISSENT_RECORDED,
	TRIBUNAL_GATE_PASSED,
	TRIBUNAL_GATE_BLOCKED,
	WARDEN_THREAT_DETECTED,
	WARDEN_THREAT_CLEARED,
	WARDEN_GATE_BLOCKED,
	ORACLE_CALIBRATION_REQUESTED,
	ORACLE_CALIBRATION_COMPLETE,
	ARCHIVIST_EXTRACT_COMPLETE,
	ARCHIVIST_COMPACT_STARTED,
	ARCHIVIST_COMPACT_COMPLETE,
	ARCHIVIST_INJECT_STARTED,
	ARCHIVIST_INJECT_COMPLETE,
	RELAY_HANDOFF_CAPTURED,
	RELAY_HANDOFF_INJECTED,
	SCRIBE_CAPTURE_COMPLETE,
	SCRIBE_DISTILL_COMPLETE,
	PROMPT_RULE_MATCHED,
	PROMPT_RULE_APPLIED,
	GOVERNOR_GATE_CHECKED,
	GOVERNOR_CALL_RECORDED,
	GOVERNOR_LEDGER_WRITE_FAILED,
	GOVERNOR_CHILD_ALLOCATED,
	GOVERNOR_CHILD_RETURNED,
	GOVERNOR_BUDGET_WARNING,
	GOVERNOR_BUDGET_EXCEEDED,
	GOVERNOR_SESSION_COMPLETE,
	GOVERNOR_LOCK_STALE_CLEARED,
	BURSAR_SESSION_RECORDED,
	BURSAR_ROLLUP_SURFACED,
	BURSAR_ROLLUP_SKIPPED,
	LINEAGE_CHANGE_RECORDED,
	LINEAGE_QUERY_ANSWERED,
	ECHO_SUITE_STARTED,
	ECHO_SUITE_COMPLETE,
	ECHO_REGRESSION_DETECTED,
	ECHO_IMPROVEMENT_DETECTED,
	CARTOGRAPHER_AUDIT_COMPLETE,
	CARTOGRAPHER_ISSUE_FOUND,
	COUNSEL_BRIEF_GENERATED,
	ONLOOKER_SESSION_SUMMARY,
	MERIDIAN_HINT_GENERATED,
	MERIDIAN_HINT_DELIVERED,
	MERIDIAN_OUTCOME_RECORDED,
	MERIDIAN_RELIANCE_MEASURED,
	MERIDIAN_LESSON_CURATED,
	MERIDIAN_PLAYBOOK_UPDATED,
	MEMORY_RECALLED,
	LIBRARIAN_SCAN_STARTED,
	LIBRARIAN_SCAN_COMPLETE,
	LIBRARIAN_CANDIDATE_PROPOSED,
	LIBRARIAN_CANDIDATE_DROPPED,
	LIBRARIAN_PROPOSAL_ACCEPTED,
	LIBRARIAN_PROPOSAL_REJECTED,
	LIBRARIAN_PROPOSAL_MERGED,
	LIBRARIAN_PROPOSAL_SUPERSEDED,
	LIBRARIAN_TOMBSTONE_CREATED,
	CURATOR_SCAN_STARTED,
	CURATOR_SCAN_COMPLETE,
	CURATOR_FINDING_DATE_DECAYED,
	CURATOR_FINDING_PATH_BROKEN,
	CURATOR_FINDING_SYMBOL_MISSING,
	CURATOR_FINDING_URL_UNCHECKED,
	CURATOR_FINDING_UNUSED_LOW_SIGNAL,
	CURATOR_FINDING_CONTRADICTION,
	CURATOR_FINDING_REDUNDANT_PAIR,
	CURATOR_FINDING_BROKEN_INDEX,
	CURATOR_FINDING_ORPHANED_MEMORY,
	CURATOR_FINDING_ACKNOWLEDGED,
	CURATOR_FINDING_RESOLVED,
	HISTORIAN_INDEXING_STARTED,
	HISTORIAN_INDEXING_COMPLETE,
	HISTORIAN_CHUNK_SANITIZED,
	HISTORIAN_CHUNK_DROPPED,
	HISTORIAN_EMBEDDER_UNAVAILABLE,
	HISTORIAN_RETRIEVAL_STARTED,
	HISTORIAN_RETRIEVAL_COMPLETE,
	HISTORIAN_RETRIEVAL_SURFACED,
	HISTORIAN_PRUNE_COMPLETE,
	HISTORIAN_PURGE_COMPLETE,
	HISTORIAN_CONFIG_WARNING,
	ASSAYER_AUDIT_STARTED,
	ASSAYER_CLAIM_CONTRADICTED,
	ASSAYER_CLAIM_UNVERIFIED,
	ASSAYER_AUDIT_COMPLETE,
	COMPASS_CHECK_PASSED,
	COMPASS_CHECK_FAILED,
	COMPASS_CHECK_SKIPPED,
	COMPASS_CHECK_OVERRIDDEN,
	COMPASS_CHECK_CANCELED,
	INSPECTOR_CHECK_PASSED,
	INSPECTOR_CHECK_FAILED,
	INSPECTOR_CHECK_SKIPPED,
	INSPECTOR_RUN_COMPLETED,
] as const;

export type EventType = (typeof ALL_EVENT_TYPES)[number];

const EVENT_TYPE_SET: ReadonlySet<string> = new Set(ALL_EVENT_TYPES);

export function isEventType(value: string): value is EventType {
	return EVENT_TYPE_SET.has(value);
}
