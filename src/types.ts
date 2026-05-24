import type { EventType } from "./event-types.js";

export type RuntimeId =
	| "claude-code"
	| "cursor"
	| "copilot"
	| "gemini"
	| "custom";

export interface SessionStartPayload {
	working_directory: string;
	git_branch?: string;
	git_commit?: string;
	resume_of_session_id?: string;
}

export interface SessionEndPayload {
	duration_ms: number;
	turn_count: number;
	total_cost_usd?: number;
	total_tokens?: number;
	end_reason?: "user_exit" | "timeout" | "error" | "task_complete" | "unknown";
}

export interface SessionCompactPayload {
	tokens_before: number;
	tokens_after: number;
	compression_ratio?: number;
}

export interface SessionPromptPayload {
	turn_number: number;
	input_summary?: string;
	context_tokens?: number;
}

export interface SkillInvokedPayload {
	skill_name: string;
	invocation_source: "slash_command" | "tool";
	command_args?: string;
	command_source?: string;
	expansion_type?: "slash_command" | "mcp_prompt";
	turn_number?: number;
}

export interface TaskStartPayload {
	task_summary?: string;
}

export interface TaskCompletePayload {
	success: true;
	duration_ms?: number;
	output_summary?: string;
}

export interface TaskFailPayload {
	success: false;
	duration_ms?: number;
	failure_reason?: string;
	attempts?: number;
}

export interface ToolFileReadPayload {
	path: string;
	read_mode: "full" | "partial";
	offset?: number;
	limit?: number;
	lines_read?: number;
	file_size_bytes?: number;
	file_bytes_on_disk?: number;
	file_lines_on_disk?: number;
	large_file_full_read?: boolean;
}

export interface ToolFileWritePayload {
	path: string;
	operation: "create" | "overwrite";
	bytes_written?: number;
	lines_written?: number;
}

export interface ToolFileEditPayload {
	path: string;
	lines_changed?: number;
}

export interface ToolShellExecPayload {
	command: string;
	exit_code?: number;
	duration_ms?: number;
	working_directory?: string;
	blocked?: boolean;
}

export interface ToolWebFetchPayload {
	url: string;
	status_code?: number;
	response_bytes?: number;
	blocked?: boolean;
}

export interface ToolAgentSpawnPayload {
	subagent_id: string;
	agent_name?: string;
	task_summary?: string;
	blocked?: boolean;
}

export interface ToolAgentCompletePayload {
	subagent_id: string;
	success: boolean;
	agent_name?: string;
	duration_ms?: number;
	cost_usd?: number;
	output_summary?: string;
}

export interface SentinelBlockedPayload {
	command: string;
	risk_level: "critical" | "high" | "medium";
	matched_pattern: string;
	reason?: string;
}

export interface SentinelAllowedPayload {
	command: string;
	risk_level: "low" | "none";
	review_required?: boolean;
}

export interface SentinelReviewedPayload {
	command: string;
	decision: "approved" | "rejected";
	review_duration_ms?: number;
}

export type TribunalJudgeType =
	| "standard"
	| "security"
	| "maintainability"
	| "adversarial"
	| "domain"
	| "meta";

export type TribunalGatePolicy =
	| "strict"
	| "majority"
	| "unanimous"
	| "meta_override";

export type TribunalBiasType =
	| "position"
	| "verbosity"
	| "self_enhancement"
	| "sycophancy"
	| "refusal"
	| "length";

export type TribunalAggregationMethod =
	| "mean"
	| "median"
	| "min"
	| "weighted_mean";

export interface TribunalSessionStartPayload {
	task_id: string;
	judge_types?: TribunalJudgeType[];
	gate_policy?: TribunalGatePolicy;
	score_threshold?: number;
	max_iterations?: number;
	actor_model_id?: string;
	judge_model_ids?: string[];
	meta_model_id?: string;
}

export interface TribunalSessionCompletePayload {
	task_id: string;
	outcome: "accepted" | "rejected" | "exhausted_iterations" | "aborted";
	final_score?: number;
	iterations_used?: number;
	total_cost_usd?: number;
	total_duration_ms?: number;
}

export interface TribunalIterationStartPayload {
	task_id: string;
	iteration_id: string;
	iteration_number: number;
	trigger?: "initial" | "gate_blocked" | "appeal";
}

export interface TribunalActorStartPayload {
	task_id: string;
	iteration_id: string;
	iteration_number?: number;
	actor_model_id?: string;
}

export interface TribunalActorCompletePayload {
	task_id: string;
	success: boolean;
	duration_ms?: number;
	skepticism_rounds?: number;
	iteration_id?: string;
	iteration_number?: number;
	artifact_kind?: "file" | "patch" | "message" | "command";
	actor_model_id?: string;
}

export interface TribunalJudgeStartPayload {
	task_id: string;
	iteration_id: string;
	judge_id: string;
	judge_type: TribunalJudgeType;
	judge_model_id?: string;
}

export interface TribunalVerdictPayload {
	task_id: string;
	score: number;
	passed: boolean;
	judge_type: TribunalJudgeType;
	feedback_summary?: string;
	file_path?: string;
	iteration_id?: string;
	judge_id?: string;
	judge_model_id?: string;
	criteria_evaluated?: string[];
	strengths_count?: number;
	weaknesses_count?: number;
	confidence?: number;
}

export interface TribunalMetaStartPayload {
	task_id: string;
	iteration_id: string;
	meta_model_id?: string;
	verdicts_reviewed?: number;
}

export interface TribunalMetaCompletePayload {
	task_id: string;
	verdict_quality: "sound" | "questionable" | "biased";
	bias_detected: boolean;
	override_recommendation?: "accept" | "reject" | "re-evaluate";
	iteration_id?: string;
	bias_types?: TribunalBiasType[];
	confidence?: number;
	meta_model_id?: string;
}

export interface TribunalJurorRef {
	judge_id: string;
	judge_type: TribunalJudgeType;
	model_id?: string;
}

export interface TribunalJuryEmpaneledPayload {
	task_id: string;
	iteration_id: string;
	judges: TribunalJurorRef[];
	panel_size?: number;
}

export interface TribunalJudgeScore {
	judge_id: string;
	score: number;
}

export interface TribunalConsensusReachedPayload {
	task_id: string;
	iteration_id: string;
	aggregated_score: number;
	passed: boolean;
	aggregation_method: TribunalAggregationMethod;
	judges: TribunalJudgeScore[];
}

export interface TribunalDissentingJudge {
	judge_id: string;
	score: number;
	passed: boolean;
}

export interface TribunalDissentRecordedPayload {
	task_id: string;
	iteration_id: string;
	disagreement_score: number;
	judges: TribunalDissentingJudge[];
	resolution?: "meta_override" | "majority" | "re-evaluate" | "escalate";
}

export interface TribunalGatePassedPayload {
	task_id: string;
	iteration_id: string;
	final_score: number;
	iteration_number?: number;
	judges_consulted?: number;
}

export interface TribunalGateBlockedPayload {
	task_id: string;
	iteration_id: string;
	reason:
		| "low_score"
		| "meta_override"
		| "bias_detected"
		| "dissent_unresolved";
	final_score?: number;
	iteration_number?: number;
	will_retry?: boolean;
	retry_iteration_number?: number;
}

export interface WardenThreatDetectedPayload {
	source_type: "web_fetch" | "file_read";
	threat_type:
		| "prompt_injection"
		| "instruction_override"
		| "credential_exfiltration"
		| "command_injection"
		| "social_engineering";
	confidence: number;
	source_url?: string;
	source_path?: string;
	snippet?: string;
}

export interface WardenThreatClearedPayload {
	source_type: "web_fetch" | "file_read";
	cleared_by?: "timeout" | "user_override" | "subsequent_scan_clean";
}

export interface WardenGateBlockedPayload {
	blocked_operation: "tool.file.write" | "tool.file.edit" | "tool.shell.exec";
	threat_source_type: "web_fetch" | "file_read";
}

export interface OracleCalibrationRequestedPayload {
	trigger: "user_prompt" | "pre_write" | "pre_bash";
	task_summary?: string;
}

export interface OracleCalibrationCompletePayload {
	trigger: "user_prompt" | "pre_write" | "pre_bash";
	confidence_score: number;
	intervened: boolean;
	misalignment_detected?: boolean;
}

export interface ArchivistExtractCompletePayload {
	session_id: string;
	item_count: number;
	decision_count?: number;
	dead_end_count?: number;
	open_question_count?: number;
	file_count?: number;
	trigger?: "pre_compact" | "session_end" | "manual";
}

export interface ArchivistInjectCompletePayload {
	source_session_id: string;
	items_injected: number;
	items_available?: number;
}

export interface RelayHandoffCapturedPayload {
	session_id: string;
	tasks_in_progress?: number;
	blocking_questions?: number;
	files_in_flight?: number;
}

export interface RelayHandoffInjectedPayload {
	source_session_id: string;
	age_ms?: number;
}

export interface ScribeCaptureCompletePayload {
	file_path: string;
	operation: "write" | "edit";
	intent_summary?: string;
}

export interface ScribeDistillCompletePayload {
	session_id: string;
	captures_processed: number;
	artifacts_produced: number;
}

export interface PromptRuleMatchedPayload {
	rule_id: string;
	match_type: "regex" | "vocabulary" | "semantic";
	trigger_source: "prompt" | "command" | "file_path";
	rule_name?: string;
}

export interface PromptRuleAppliedPayload {
	rule_id: string;
	rule_name?: string;
	guidance_chars?: number;
}

export interface CartographerIssueCategories {
	contradictions?: number;
	stale_references?: number;
	orphaned_plugins?: number;
	dead_tools?: number;
	duplicates?: number;
	hierarchy_conflicts?: number;
}

export interface CartographerAuditCompletePayload {
	files_audited: number;
	issues_found: number;
	trigger?: "instructions_loaded" | "config_change" | "manual";
	issue_categories?: CartographerIssueCategories;
}

export interface CartographerIssueFoundPayload {
	issue_type:
		| "contradiction"
		| "stale_reference"
		| "orphaned_plugin"
		| "dead_tool"
		| "duplicate"
		| "hierarchy_conflict";
	file_path: string;
	severity: "error" | "warning" | "info";
	description?: string;
}

export interface LedgerBudgetWarningPayload {
	budget_usd: number;
	spent_usd: number;
	threshold_pct: number;
	remaining_usd?: number;
}

export interface LedgerBudgetExceededPayload {
	budget_usd: number;
	spent_usd: number;
	blocked_operation: string;
}

export interface LedgerSessionCompletePayload {
	total_cost_usd: number;
	budget_usd: number;
	under_budget: boolean;
	cost_by_plugin?: Record<string, number>;
}

export interface EchoSuiteStartedPayload {
	suite_id: string;
	test_count: number;
	suite_name?: string;
	trigger?: "config_change" | "manual" | "file_change";
	changed_file?: string;
}

type EchoSuiteDrift = {
	baseline_score: number;
	score_after: number;
	drift: number;
	drift_threshold: number;
};

export type EchoSuiteCompletePayload = {
	suite_id: string;
	test_count: number;
	improved: number;
	degraded: number;
	neutral: number;
	merge_recommended?: boolean;
	duration_ms?: number;
} & (
	| EchoSuiteDrift
	| {
			baseline_score?: never;
			score_after?: never;
			drift?: never;
			drift_threshold?: never;
	  }
);

export interface EchoRegressionDetectedPayload {
	suite_id: string;
	test_id: string;
	score_before: number;
	score_after: number;
	test_name?: string;
	delta?: number;
	confidence?: number;
}

export interface EchoImprovementDetectedPayload {
	suite_id: string;
	test_id: string;
	score_before: number;
	score_after: number;
	test_name?: string;
	delta?: number;
	confidence?: number;
}

export type CounselSource =
	| "onlooker_events"
	| "tribunal_verdicts"
	| "echo_regressions"
	| "sentinel_audit"
	| "warden_audit"
	| "oracle_calibrations"
	| "meridian_reliance";

export interface CounselBriefGeneratedPayload {
	period_start: string;
	period_end: string;
	recommendation_count: number;
	sources_consulted?: CounselSource[];
}

export interface OnlookerToolCounts {
	file_reads?: number;
	file_writes?: number;
	file_edits?: number;
	shell_execs?: number;
	web_fetches?: number;
	agent_spawns?: number;
}

export interface OnlookerSessionSummaryPayload {
	session_id: string;
	duration_ms: number;
	event_count: number;
	tool_counts?: OnlookerToolCounts;
}

export type MeridianTaskType = "code" | "reasoning" | "writing" | "general";

export interface MeridianHintGeneratedPayload {
	hint_id: string;
	case_id: string;
	task_type: MeridianTaskType;
	failure_type:
		| "wrong_approach"
		| "missing_concept"
		| "implementation_error"
		| "misunderstood_task"
		| "out_of_scope";
	hint_direction:
		| "reframe"
		| "missing_tool"
		| "intermediate_goal"
		| "alternative_representation"
		| "constraint_reminder";
	target_concept?: string;
	signal_creation?: number;
	signal_transfer?: number;
	playbook_bullets_injected?: number;
}

export interface MeridianHintDeliveredPayload {
	hint_id: string;
	case_id: string;
	delivery_mode: "append" | "comment" | "inline" | "aside";
}

export interface MeridianOutcomeRecordedPayload {
	hint_id: string;
	case_id: string;
	succeeded: boolean;
	attempts_after_hint: number;
	hint_referenced?: boolean;
	time_to_success_ms?: number;
}

export interface MeridianRelianceMeasuredPayload {
	hint_id: string;
	case_id: string;
	score: number;
	assessment: "low" | "medium" | "high";
	method: "logprob" | "judge";
}

export interface MeridianLessonCuratedPayload {
	bullet_id: string;
	case_id: string;
	category:
		| "failure_pattern"
		| "successful_hint"
		| "task_strategy"
		| "tool_usage";
	task_type: MeridianTaskType;
	target_concept: string;
	origin?: "agent_failure" | "human_session" | "manual";
}

export interface MeridianPlaybookUpdatedPayload {
	scope_id: string;
	operation: "append" | "update" | "deduplicate" | "promote" | "retire";
	bullet_count_after: number;
	bullets_removed?: number;
}

export type PayloadFor<T extends EventType> = T extends "session.start"
	? SessionStartPayload
	: T extends "session.end"
		? SessionEndPayload
		: T extends "session.compact"
			? SessionCompactPayload
			: T extends "session.prompt"
				? SessionPromptPayload
				: T extends "skill.invoked"
					? SkillInvokedPayload
					: T extends "task.start"
						? TaskStartPayload
						: T extends "task.complete"
							? TaskCompletePayload
							: T extends "task.fail"
								? TaskFailPayload
								: T extends "tool.file.read"
									? ToolFileReadPayload
									: T extends "tool.file.write"
										? ToolFileWritePayload
										: T extends "tool.file.edit"
											? ToolFileEditPayload
											: T extends "tool.shell.exec"
												? ToolShellExecPayload
												: T extends "tool.web.fetch"
													? ToolWebFetchPayload
													: T extends "tool.agent.spawn"
														? ToolAgentSpawnPayload
														: T extends "tool.agent.complete"
															? ToolAgentCompletePayload
															: T extends "sentinel.blocked"
																? SentinelBlockedPayload
																: T extends "sentinel.allowed"
																	? SentinelAllowedPayload
																	: T extends "sentinel.reviewed"
																		? SentinelReviewedPayload
																		: T extends "tribunal.session.start"
																			? TribunalSessionStartPayload
																			: T extends "tribunal.session.complete"
																				? TribunalSessionCompletePayload
																				: T extends "tribunal.iteration.start"
																					? TribunalIterationStartPayload
																					: T extends "tribunal.actor.start"
																						? TribunalActorStartPayload
																						: T extends "tribunal.actor.complete"
																							? TribunalActorCompletePayload
																							: T extends "tribunal.judge.start"
																								? TribunalJudgeStartPayload
																								: T extends "tribunal.verdict"
																									? TribunalVerdictPayload
																									: T extends "tribunal.meta.start"
																										? TribunalMetaStartPayload
																										: T extends "tribunal.meta.complete"
																											? TribunalMetaCompletePayload
																											: T extends "tribunal.jury.empaneled"
																												? TribunalJuryEmpaneledPayload
																												: T extends "tribunal.consensus.reached"
																													? TribunalConsensusReachedPayload
																													: T extends "tribunal.dissent.recorded"
																														? TribunalDissentRecordedPayload
																														: T extends "tribunal.gate.passed"
																															? TribunalGatePassedPayload
																															: T extends "tribunal.gate.blocked"
																																? TribunalGateBlockedPayload
																																: T extends "warden.threat.detected"
																																	? WardenThreatDetectedPayload
																																	: T extends "warden.threat.cleared"
																																		? WardenThreatClearedPayload
																																		: T extends "warden.gate.blocked"
																																			? WardenGateBlockedPayload
																																			: T extends "oracle.calibration.requested"
																																				? OracleCalibrationRequestedPayload
																																				: T extends "oracle.calibration.complete"
																																					? OracleCalibrationCompletePayload
																																					: T extends "archivist.extract.complete"
																																						? ArchivistExtractCompletePayload
																																						: T extends "archivist.inject.complete"
																																							? ArchivistInjectCompletePayload
																																							: T extends "relay.handoff.captured"
																																								? RelayHandoffCapturedPayload
																																								: T extends "relay.handoff.injected"
																																									? RelayHandoffInjectedPayload
																																									: T extends "scribe.capture.complete"
																																										? ScribeCaptureCompletePayload
																																										: T extends "scribe.distill.complete"
																																											? ScribeDistillCompletePayload
																																											: T extends "prompt_rule.matched"
																																												? PromptRuleMatchedPayload
																																												: T extends "prompt_rule.applied"
																																													? PromptRuleAppliedPayload
																																													: T extends "ledger.budget.warning"
																																														? LedgerBudgetWarningPayload
																																														: T extends "ledger.budget.exceeded"
																																															? LedgerBudgetExceededPayload
																																															: T extends "ledger.session.complete"
																																																? LedgerSessionCompletePayload
																																																: T extends "echo.suite.started"
																																																	? EchoSuiteStartedPayload
																																																	: T extends "echo.suite.complete"
																																																		? EchoSuiteCompletePayload
																																																		: T extends "echo.regression.detected"
																																																			? EchoRegressionDetectedPayload
																																																			: T extends "echo.improvement.detected"
																																																				? EchoImprovementDetectedPayload
																																																				: T extends "cartographer.audit.complete"
																																																					? CartographerAuditCompletePayload
																																																					: T extends "cartographer.issue.found"
																																																						? CartographerIssueFoundPayload
																																																						: T extends "counsel.brief.generated"
																																																							? CounselBriefGeneratedPayload
																																																							: T extends "onlooker.session.summary"
																																																								? OnlookerSessionSummaryPayload
																																																								: T extends "meridian.hint.generated"
																																																									? MeridianHintGeneratedPayload
																																																									: T extends "meridian.hint.delivered"
																																																										? MeridianHintDeliveredPayload
																																																										: T extends "meridian.outcome.recorded"
																																																											? MeridianOutcomeRecordedPayload
																																																											: T extends "meridian.reliance.measured"
																																																												? MeridianRelianceMeasuredPayload
																																																												: T extends "meridian.lesson.curated"
																																																													? MeridianLessonCuratedPayload
																																																													: T extends "meridian.playbook.updated"
																																																														? MeridianPlaybookUpdatedPayload
																																																														: Record<
																																																																string,
																																																																unknown
																																																															>;

export interface OnlookerEvent<T extends EventType = EventType> {
	id: string;
	schema_version: "1.0";
	runtime: RuntimeId;
	adapter_id?: string;
	plugin: string;
	machine_id: string;
	timestamp: string;
	session_id: string;
	sequence: number;
	event_type: T;
	payload: PayloadFor<T>;
	cost_usd?: number;
	token_count?: number;
	redacted?: boolean;
}
