export const SESSION_START = "session.start" as const;
export const SESSION_END = "session.end" as const;
export const SESSION_COMPACT = "session.compact" as const;
export const SESSION_PROMPT = "session.prompt" as const;

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

export const TRIBUNAL_VERDICT = "tribunal.verdict" as const;
export const TRIBUNAL_ACTOR_COMPLETE = "tribunal.actor.complete" as const;
export const TRIBUNAL_META_COMPLETE = "tribunal.meta.complete" as const;

export const WARDEN_THREAT_DETECTED = "warden.threat.detected" as const;
export const WARDEN_THREAT_CLEARED = "warden.threat.cleared" as const;
export const WARDEN_GATE_BLOCKED = "warden.gate.blocked" as const;

export const ORACLE_CALIBRATION_REQUESTED = "oracle.calibration.requested" as const;
export const ORACLE_CALIBRATION_COMPLETE = "oracle.calibration.complete" as const;

export const ARCHIVIST_EXTRACT_COMPLETE = "archivist.extract.complete" as const;
export const ARCHIVIST_INJECT_COMPLETE = "archivist.inject.complete" as const;

export const RELAY_HANDOFF_CAPTURED = "relay.handoff.captured" as const;
export const RELAY_HANDOFF_INJECTED = "relay.handoff.injected" as const;

export const SCRIBE_CAPTURE_COMPLETE = "scribe.capture.complete" as const;
export const SCRIBE_DISTILL_COMPLETE = "scribe.distill.complete" as const;

export const CUES_MATCHED = "cues.matched" as const;
export const CUES_APPLIED = "cues.applied" as const;

export const LEDGER_BUDGET_WARNING = "ledger.budget.warning" as const;
export const LEDGER_BUDGET_EXCEEDED = "ledger.budget.exceeded" as const;
export const LEDGER_SESSION_COMPLETE = "ledger.session.complete" as const;

export const ECHO_SUITE_STARTED = "echo.suite.started" as const;
export const ECHO_SUITE_COMPLETE = "echo.suite.complete" as const;
export const ECHO_REGRESSION_DETECTED = "echo.regression.detected" as const;

export const CARTOGRAPHER_AUDIT_COMPLETE = "cartographer.audit.complete" as const;
export const CARTOGRAPHER_ISSUE_FOUND = "cartographer.issue.found" as const;

export const COUNSEL_BRIEF_GENERATED = "counsel.brief.generated" as const;

export const ONLOOKER_SESSION_SUMMARY = "onlooker.session.summary" as const;

export const MERIDIAN_HINT_GENERATED = "meridian.hint.generated" as const;
export const MERIDIAN_HINT_DELIVERED = "meridian.hint.delivered" as const;
export const MERIDIAN_OUTCOME_RECORDED = "meridian.outcome.recorded" as const;
export const MERIDIAN_RELIANCE_MEASURED = "meridian.reliance.measured" as const;
export const MERIDIAN_LESSON_CURATED = "meridian.lesson.curated" as const;
export const MERIDIAN_PLAYBOOK_UPDATED = "meridian.playbook.updated" as const;

export const ALL_EVENT_TYPES = [
  SESSION_START,
  SESSION_END,
  SESSION_COMPACT,
  SESSION_PROMPT,
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
  TRIBUNAL_VERDICT,
  TRIBUNAL_ACTOR_COMPLETE,
  TRIBUNAL_META_COMPLETE,
  WARDEN_THREAT_DETECTED,
  WARDEN_THREAT_CLEARED,
  WARDEN_GATE_BLOCKED,
  ORACLE_CALIBRATION_REQUESTED,
  ORACLE_CALIBRATION_COMPLETE,
  ARCHIVIST_EXTRACT_COMPLETE,
  ARCHIVIST_INJECT_COMPLETE,
  RELAY_HANDOFF_CAPTURED,
  RELAY_HANDOFF_INJECTED,
  SCRIBE_CAPTURE_COMPLETE,
  SCRIBE_DISTILL_COMPLETE,
  CUES_MATCHED,
  CUES_APPLIED,
  LEDGER_BUDGET_WARNING,
  LEDGER_BUDGET_EXCEEDED,
  LEDGER_SESSION_COMPLETE,
  ECHO_SUITE_STARTED,
  ECHO_SUITE_COMPLETE,
  ECHO_REGRESSION_DETECTED,
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
] as const;

export type EventType = (typeof ALL_EVENT_TYPES)[number];

const EVENT_TYPE_SET: ReadonlySet<string> = new Set(ALL_EVENT_TYPES);

export function isEventType(value: string): value is EventType {
  return EVENT_TYPE_SET.has(value);
}
