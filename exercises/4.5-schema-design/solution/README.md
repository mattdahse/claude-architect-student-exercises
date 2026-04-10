# Solution: Exercise 4.5 — Schema Design Patterns

## Design Decisions

**Nullable fields:** `date_of_loss` and `claim_amount` are nullable — they should be in the output but set to `null` when the document doesn't specify them. This is preferred over making them optional (absent) because downstream systems can always access the field and check for null.

**"other" + detail:** `damage_category` includes "other" in the enum. `damage_category_detail` captures the specific type (e.g., "earthquake") when "other" is used. This preserves both structured categories and original specificity.

**Conflict annotation:** `claim_amount_original` captures corrected amounts. The `conflicts` array provides a general-purpose mechanism for any field with contradictory values, including the resolution rationale.

**Confidence field:** An enum (high/medium/low) that the extraction system uses to route uncertain cases. Document 5 (minimal) should produce "low" confidence, flagging it for human review.

**Required fields:** Only `claimant_name`, `damage_category`, `description`, and `confidence` are required. Everything else is nullable — present but potentially null. This guarantees a consistent output shape while accommodating documents with varying completeness.
