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

export interface ArchivistCompactStartedPayload {
	project_key: string;
	session_id: string;
}

export interface ArchivistCompactCompletePayload {
	project_key: string;
	session_id: string;
	decisions_extracted: number;
	dead_ends_extracted: number;
	open_questions_extracted: number;
	duration_ms: number;
}

export interface ArchivistInjectStartedPayload {
	project_key: string;
	session_id: string;
}

export interface ArchivistInjectCompletePayload {
	project_key: string;
	session_id: string;
	items_injected: number;
	chars_injected: number;
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

export type GovernorEstimationMethod = "tiktoken" | "char_ratio" | "tier_table";

export interface GovernorGateCheckedPayload {
	session_id: string;
	agent_id: string;
	agent_type: string;
	decision: "allow" | "block";
	estimated_tokens: number;
	tokens_available: number;
	estimation_method: GovernorEstimationMethod;
	safety_margin: number;
	reason?: "budget_exceeded" | "ceiling_exceeded" | "lock_timeout";
}

type GovernorCallActuals = {
	actual_tokens: number;
	tokens_returned_to_pool: number;
	estimation_error_pct?: number;
	cost_usd_actual?: number;
};

export type GovernorCallRecordedPayload = {
	session_id: string;
	agent_id: string;
	agent_type: string;
	estimated_tokens: number;
	cost_usd_estimated: number;
	duration_ms: number;
} & (
	| GovernorCallActuals
	| {
			actual_tokens?: never;
			tokens_returned_to_pool?: never;
			estimation_error_pct?: never;
			cost_usd_actual?: never;
	  }
);

export interface GovernorLedgerWriteFailedPayload {
	session_id: string;
	agent_id: string;
	error: string;
	retry_count: number;
	ledger_poisoned: boolean;
	unrecorded_tokens: number;
}

export interface GovernorChildAllocatedPayload {
	session_id: string;
	parent_agent_id: string;
	child_agent_id: string;
	child_agent_type: string;
	tokens_allocated: number;
	cost_usd_allocated: number;
	tokens_remaining_after_allocation: number;
	conservation_check_passed: boolean;
}

export interface GovernorChildReturnedPayload {
	session_id: string;
	parent_agent_id: string;
	child_agent_id: string;
	tokens_allocated: number;
	tokens_consumed: number;
	tokens_returned: number;
}

export interface GovernorLockStaleClearedPayload {
	lock_path: string;
	lock_age_seconds: number;
	pid_verified_dead: boolean;
}

export type GovernorDimension =
	| "cost_usd"
	| "tokens"
	| "api_calls"
	| "wall_clock_seconds";

export interface GovernorBudgetWarningPayload {
	budget_usd: number;
	spent_usd: number;
	threshold_pct: number;
	session_id: string;
	dimension: GovernorDimension;
	remaining_usd?: number;
	tokens_budget?: number;
	tokens_spent?: number;
	api_calls_budget?: number;
	api_calls_spent?: number;
}

export interface GovernorBudgetExceededPayload {
	budget_usd: number;
	spent_usd: number;
	blocked_operation: string;
	session_id: string;
	agent_id: string;
	dimension: GovernorDimension;
	estimated_call_cost: number;
	ceiling_type: "session" | "global" | "per_call";
}

export interface GovernorSessionCompletePayload {
	total_cost_usd: number;
	budget_usd: number;
	under_budget: boolean;
	session_id: string;
	total_tokens: number;
	total_api_calls: number;
	duration_ms: number;
	calls_blocked: number;
	calls_warned: number;
	ledger_poisoned: boolean;
	cost_by_plugin?: Record<string, number>;
	estimation_accuracy_pct?: number;
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

export interface MemoryRecalledPayload {
	project_key: string;
	memory_file: string;
	memory_type: "user" | "feedback" | "project" | "reference";
	recall_position?: number;
}

export type LibrarianMemoryType = "user" | "feedback" | "project" | "reference";

export type LibrarianConflictState =
	| "none"
	| "duplicate"
	| "merge_candidate"
	| "conflict_candidate";

export interface LibrarianScanStartedPayload {
	trigger: "session_end" | "manual" | "bootstrap";
	last_scan_at?: string;
	artifact_count_in_window?: number;
}

export interface LibrarianScanCompletePayload {
	outcome: "ok" | "empty" | "skipped";
	skip_reason?: "archivist_not_present" | "memory_path_unresolved" | "disabled";
	candidates_proposed?: number;
	candidates_dropped?: number;
	duration_ms: number;
	artifact_count_in_window?: number;
}

export interface LibrarianCandidateProposedPayload {
	proposal_id: string;
	memory_type: LibrarianMemoryType;
	classifier_confidence: number;
	conflict_state: LibrarianConflictState;
	source_artifact_ids?: string[];
}

export interface LibrarianCandidateDroppedPayload {
	reason:
		| "duplicate"
		| "low_confidence"
		| "classified_null"
		| "filter_marker_missing"
		| "filter_repetition_missing"
		| "detail_too_short";
	source_artifact_id?: string;
}

export interface LibrarianProposalAcceptedPayload {
	proposal_id: string;
	final_filename: string;
	accepted_via: "manual" | "auto";
}

export interface LibrarianProposalRejectedPayload {
	proposal_id: string;
	reason?: string;
}

export interface LibrarianProposalMergedPayload {
	proposal_id: string;
	merged_into_filename: string;
}

export interface LibrarianProposalSupersededPayload {
	proposal_id: string;
	superseded_filename: string;
}

export interface LibrarianTombstoneCreatedPayload {
	body_hash: string;
	original_filename?: string;
}

export type CuratorScanMode = "cheap" | "llm" | "manual";

export interface CuratorScanStartedPayload {
	mode: CuratorScanMode;
}

export interface CuratorScanCompletePayload {
	mode: CuratorScanMode;
	outcome: "ok" | "skipped";
	skip_reason?:
		| "over_budget"
		| "llm_interval_not_elapsed"
		| "disabled"
		| "recent_session_skip";
	findings_new: number;
	findings_resolved: number;
	duration_ms: number;
	pairs_evaluated?: number;
}

export interface CuratorFindingDateDecayedPayload {
	finding_id: string;
	memory_file: string;
	matched_phrase: string;
	days_past: number;
}

export interface CuratorFindingPathBrokenPayload {
	finding_id: string;
	memory_file: string;
	broken_path: string;
}

export interface CuratorFindingSymbolMissingPayload {
	finding_id: string;
	memory_file: string;
	symbol: string;
}

export interface CuratorFindingUrlUncheckedPayload {
	finding_id: string;
	memory_file: string;
	url_host: string;
}

export interface CuratorFindingUnusedLowSignalPayload {
	finding_id: string;
	memory_file: string;
	window_days: number;
}

export interface CuratorFindingContradictionPayload {
	finding_id: string;
	memory_a: string;
	memory_b: string;
	rationale: string;
}

export interface CuratorFindingRedundantPairPayload {
	finding_id: string;
	memory_a: string;
	memory_b: string;
	rationale: string;
}

export interface CuratorFindingBrokenIndexPayload {
	finding_id: string;
	referenced_file: string;
}

export interface CuratorFindingOrphanedMemoryPayload {
	finding_id: string;
	memory_file: string;
}

export interface CuratorFindingAcknowledgedPayload {
	finding_id: string;
}

export interface CuratorFindingResolvedPayload {
	finding_id: string;
	action: "prune" | "edit" | "reclassify" | "defer";
}

export type HistorianEmbedderBackend = "ollama" | "fastembed" | "remote";

export interface HistorianIndexingStartedPayload {
	session_id: string;
	transcript_chars: number;
}

export interface HistorianIndexingCompletePayload {
	outcome: "ok" | "skipped";
	skip_reason?:
		| "too_short"
		| "embedder_unavailable"
		| "disabled"
		| "transcript_unavailable";
	chunks_indexed?: number;
	chunks_dropped?: number;
	duration_ms: number;
}

export interface HistorianChunkSanitizedPayload {
	chunk_id: string;
	redaction_count: number;
}

export interface HistorianChunkDroppedPayload {
	reason: "skip_marker" | "never_index_path";
}

export interface HistorianEmbedderUnavailablePayload {
	backend: HistorianEmbedderBackend;
	error_summary?: string;
}

export interface HistorianRetrievalStartedPayload {
	prompt_chars: number;
}

export interface HistorianRetrievalCompletePayload {
	outcome: "surfaced" | "empty" | "skipped";
	skip_reason?:
		| "cooldown"
		| "budget"
		| "short_prompt"
		| "disabled"
		| "embedder_unavailable";
	top_similarity?: number;
	candidates_above_floor?: number;
	duration_ms?: number;
}

export interface HistorianRetrievalSurfacedPayload {
	chunk_id: string;
	similarity: number;
	age_days: number;
	source_session_id?: string;
}

export interface HistorianPruneCompletePayload {
	chunks_pruned: number;
	chunks_remaining: number;
}

export interface HistorianPurgeCompletePayload {
	scope: "session" | "date_range" | "all";
	chunks_purged: number;
}

export interface HistorianConfigWarningPayload {
	warning:
		| "remote_egress_not_allowed"
		| "model_mismatch"
		| "embedder_path_changed";
	detail?: string;
}

export interface PayloadMap {
	"session.start": SessionStartPayload;
	"session.end": SessionEndPayload;
	"session.compact": SessionCompactPayload;
	"session.prompt": SessionPromptPayload;
	"skill.invoked": SkillInvokedPayload;
	"task.start": TaskStartPayload;
	"task.complete": TaskCompletePayload;
	"task.fail": TaskFailPayload;
	"tool.file.read": ToolFileReadPayload;
	"tool.file.write": ToolFileWritePayload;
	"tool.file.edit": ToolFileEditPayload;
	"tool.shell.exec": ToolShellExecPayload;
	"tool.web.fetch": ToolWebFetchPayload;
	"tool.agent.spawn": ToolAgentSpawnPayload;
	"tool.agent.complete": ToolAgentCompletePayload;
	"sentinel.blocked": SentinelBlockedPayload;
	"sentinel.allowed": SentinelAllowedPayload;
	"sentinel.reviewed": SentinelReviewedPayload;
	"tribunal.session.start": TribunalSessionStartPayload;
	"tribunal.session.complete": TribunalSessionCompletePayload;
	"tribunal.iteration.start": TribunalIterationStartPayload;
	"tribunal.actor.start": TribunalActorStartPayload;
	"tribunal.actor.complete": TribunalActorCompletePayload;
	"tribunal.judge.start": TribunalJudgeStartPayload;
	"tribunal.verdict": TribunalVerdictPayload;
	"tribunal.meta.start": TribunalMetaStartPayload;
	"tribunal.meta.complete": TribunalMetaCompletePayload;
	"tribunal.jury.empaneled": TribunalJuryEmpaneledPayload;
	"tribunal.consensus.reached": TribunalConsensusReachedPayload;
	"tribunal.dissent.recorded": TribunalDissentRecordedPayload;
	"tribunal.gate.passed": TribunalGatePassedPayload;
	"tribunal.gate.blocked": TribunalGateBlockedPayload;
	"warden.threat.detected": WardenThreatDetectedPayload;
	"warden.threat.cleared": WardenThreatClearedPayload;
	"warden.gate.blocked": WardenGateBlockedPayload;
	"oracle.calibration.requested": OracleCalibrationRequestedPayload;
	"oracle.calibration.complete": OracleCalibrationCompletePayload;
	"archivist.extract.complete": ArchivistExtractCompletePayload;
	"archivist.compact.started": ArchivistCompactStartedPayload;
	"archivist.compact.complete": ArchivistCompactCompletePayload;
	"archivist.inject.started": ArchivistInjectStartedPayload;
	"archivist.inject.complete": ArchivistInjectCompletePayload;
	"relay.handoff.captured": RelayHandoffCapturedPayload;
	"relay.handoff.injected": RelayHandoffInjectedPayload;
	"scribe.capture.complete": ScribeCaptureCompletePayload;
	"scribe.distill.complete": ScribeDistillCompletePayload;
	"prompt_rule.matched": PromptRuleMatchedPayload;
	"prompt_rule.applied": PromptRuleAppliedPayload;
	"governor.gate.checked": GovernorGateCheckedPayload;
	"governor.call.recorded": GovernorCallRecordedPayload;
	"governor.ledger.write_failed": GovernorLedgerWriteFailedPayload;
	"governor.child.allocated": GovernorChildAllocatedPayload;
	"governor.child.returned": GovernorChildReturnedPayload;
	"governor.budget.warning": GovernorBudgetWarningPayload;
	"governor.budget.exceeded": GovernorBudgetExceededPayload;
	"governor.lock.stale_cleared": GovernorLockStaleClearedPayload;
	"governor.session.complete": GovernorSessionCompletePayload;
	"echo.suite.started": EchoSuiteStartedPayload;
	"echo.suite.complete": EchoSuiteCompletePayload;
	"echo.regression.detected": EchoRegressionDetectedPayload;
	"echo.improvement.detected": EchoImprovementDetectedPayload;
	"cartographer.audit.complete": CartographerAuditCompletePayload;
	"cartographer.issue.found": CartographerIssueFoundPayload;
	"counsel.brief.generated": CounselBriefGeneratedPayload;
	"onlooker.session.summary": OnlookerSessionSummaryPayload;
	"meridian.hint.generated": MeridianHintGeneratedPayload;
	"meridian.hint.delivered": MeridianHintDeliveredPayload;
	"meridian.outcome.recorded": MeridianOutcomeRecordedPayload;
	"meridian.reliance.measured": MeridianRelianceMeasuredPayload;
	"meridian.lesson.curated": MeridianLessonCuratedPayload;
	"meridian.playbook.updated": MeridianPlaybookUpdatedPayload;
	"memory.recalled": MemoryRecalledPayload;
	"librarian.scan.started": LibrarianScanStartedPayload;
	"librarian.scan.complete": LibrarianScanCompletePayload;
	"librarian.candidate.proposed": LibrarianCandidateProposedPayload;
	"librarian.candidate.dropped": LibrarianCandidateDroppedPayload;
	"librarian.proposal.accepted": LibrarianProposalAcceptedPayload;
	"librarian.proposal.rejected": LibrarianProposalRejectedPayload;
	"librarian.proposal.merged": LibrarianProposalMergedPayload;
	"librarian.proposal.superseded": LibrarianProposalSupersededPayload;
	"librarian.tombstone.created": LibrarianTombstoneCreatedPayload;
	"curator.scan.started": CuratorScanStartedPayload;
	"curator.scan.complete": CuratorScanCompletePayload;
	"curator.finding.date_decayed": CuratorFindingDateDecayedPayload;
	"curator.finding.path_broken": CuratorFindingPathBrokenPayload;
	"curator.finding.symbol_missing": CuratorFindingSymbolMissingPayload;
	"curator.finding.url_unchecked": CuratorFindingUrlUncheckedPayload;
	"curator.finding.unused_low_signal": CuratorFindingUnusedLowSignalPayload;
	"curator.finding.contradiction": CuratorFindingContradictionPayload;
	"curator.finding.redundant_pair": CuratorFindingRedundantPairPayload;
	"curator.finding.broken_index": CuratorFindingBrokenIndexPayload;
	"curator.finding.orphaned_memory": CuratorFindingOrphanedMemoryPayload;
	"curator.finding.acknowledged": CuratorFindingAcknowledgedPayload;
	"curator.finding.resolved": CuratorFindingResolvedPayload;
	"historian.indexing.started": HistorianIndexingStartedPayload;
	"historian.indexing.complete": HistorianIndexingCompletePayload;
	"historian.chunk.sanitized": HistorianChunkSanitizedPayload;
	"historian.chunk.dropped": HistorianChunkDroppedPayload;
	"historian.embedder.unavailable": HistorianEmbedderUnavailablePayload;
	"historian.retrieval.started": HistorianRetrievalStartedPayload;
	"historian.retrieval.complete": HistorianRetrievalCompletePayload;
	"historian.retrieval.surfaced": HistorianRetrievalSurfacedPayload;
	"historian.prune.complete": HistorianPruneCompletePayload;
	"historian.purge.complete": HistorianPurgeCompletePayload;
	"historian.config.warning": HistorianConfigWarningPayload;
}

export type PayloadFor<T extends EventType> = T extends keyof PayloadMap
	? PayloadMap[T]
	: Record<string, unknown>;

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
