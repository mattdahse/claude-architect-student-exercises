# Extraction Pipeline: Design Decisions

## Schema Design

### Nullable Field Pattern

Fields like `claim_date` and `claim_amount` use `type: ["string", "null"]` and `type: ["number", "null"]` rather than making them optional. This is a deliberate choice: nullable types force Claude to explicitly acknowledge when data is missing by returning `null`, rather than silently omitting the field. Downstream code can reliably check `field === null` instead of guessing whether a missing key means "not found" or "not applicable."

Only `claimant_name` and `description` are non-nullable and required -- every claim must identify who filed it and what happened. Category and confidence are also required because routing decisions depend on them, but amount and date are nullable because real-world claims often lack them.

### Confidence as a Separate Object

Confidence is structured as a nested object with numeric scores (0.0-1.0) rather than per-field string annotations (high/medium/low). Numeric scores enable threshold-based routing (e.g., route to review if any score < 0.80) without string parsing. The object is co-located with the extraction rather than returned separately, so a single tool call produces both the data and the quality signal.

The trade-off: asking Claude to self-assess confidence adds token overhead and may not perfectly calibrate. In practice, scores above 0.90 reliably indicate clearly stated values, while scores below 0.70 flag genuinely ambiguous cases.

### Conflicts Array

The conflicts array captures contradictory information within a single document (e.g., header says $7,800 but narrative says $8,200). Each conflict includes both values and their sources so a human reviewer can quickly locate the discrepancy. This is separate from confidence -- a field can have high confidence in one value while still noting a conflict exists.

## Validation Design

### Error Specificity

Validation errors are written as complete sentences that describe both what is wrong and what is expected. For example: `claim_amount must be a positive number, got: -500` rather than just `invalid amount`. This specificity serves two purposes:

1. **Human debugging**: developers can immediately understand the failure.
2. **LLM feedback**: when errors are fed back to Claude for retry, specific messages help it correct only the problematic field without disturbing correct extractions.

### Four Core Rules

The validator enforces four rules chosen to catch the most common extraction failures:

1. **claimant_name required** -- the one field that must always be present.
2. **claim_amount positive** -- catches sign errors and zero-value extractions.
3. **claim_date format** -- ensures downstream date parsing will succeed.
4. **Other category requires detail** -- prevents information loss when the standard enum does not fit.

These rules are intentionally minimal. Real production systems would add cross-field consistency checks, but for the exercise these four demonstrate the validation-retry loop without over-constraining Claude.

## Retry with Targeted Feedback

The feedback loop sends validation errors back to Claude as a `tool_result` with `is_error: true`. This design choice leverages Claude's built-in understanding of tool error correction: it naturally tries to fix the specific issues while preserving correct fields.

The retry limit (default 2) balances cost against quality. Most validation failures resolve in one retry. A second retry catches edge cases where the first correction introduced a new error. Beyond two retries, the extraction is unlikely to improve and should go to human review.

## Routing Threshold Choices

### Review Threshold: 0.80

Any confidence score below 0.80 triggers human review. This threshold was chosen to catch uncertain extractions while avoiding excessive routing. In practice, clearly stated fields score 0.95+ and ambiguous fields score 0.50-0.70, so 0.80 falls in the natural gap between confident and uncertain extractions.

### Auto-Accept Threshold: 0.95

Auto-acceptance requires ALL confidence scores at 0.95 or above, zero conflicts, and passing validation. This conservative threshold means only clearly straightforward claims bypass human review entirely. The gap between 0.80 (review) and 0.95 (auto-accept) creates a middle zone where extractions pass without review but are not flagged as fully automatic -- useful for audit trails.

### Three Routing Conditions

Review is triggered by any of: low confidence, detected conflicts, or exhausted retries. These conditions are OR'd because each independently indicates the extraction may need human judgment. The routing reason string captures which conditions fired, giving reviewers context for where to focus their attention.
