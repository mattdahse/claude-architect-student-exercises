// Routes extractions to human review when confidence is low
// or data quality issues are detected

const CONFIDENCE_REVIEW_THRESHOLD = 0.80;
const CONFIDENCE_AUTO_ACCEPT_THRESHOLD = 0.95;

const reviewQueue = [];

function shouldRouteToReview(result) {
  // Condition 1: Any confidence score below the review threshold
  if (result.extraction && result.extraction.confidence) {
    const conf = result.extraction.confidence;
    const scores = [
      conf.claimant_name,
      conf.claim_date,
      conf.claim_amount,
      conf.damage_category,
    ];
    if (scores.some((s) => s !== undefined && s !== null && s < CONFIDENCE_REVIEW_THRESHOLD)) {
      return true;
    }
  }

  // Condition 2: Conflicts were detected
  if (
    result.extraction &&
    result.extraction.conflicts &&
    result.extraction.conflicts.length > 0
  ) {
    return true;
  }

  // Condition 3: Validation exhausted retries (still has errors after all attempts)
  if (result.exhausted_retries) {
    return true;
  }

  return false;
}

function shouldAutoAccept(result) {
  // Auto-accept requires ALL of:
  // 1. Validation passed
  if (!result.validation || !result.validation.valid) {
    return false;
  }

  // 2. No conflicts
  if (
    result.extraction &&
    result.extraction.conflicts &&
    result.extraction.conflicts.length > 0
  ) {
    return false;
  }

  // 3. All confidence scores >= auto-accept threshold
  if (result.extraction && result.extraction.confidence) {
    const conf = result.extraction.confidence;
    const scores = [
      conf.claimant_name,
      conf.claim_date,
      conf.claim_amount,
      conf.damage_category,
    ];
    if (
      scores.some(
        (s) => s !== undefined && s !== null && s < CONFIDENCE_AUTO_ACCEPT_THRESHOLD
      )
    ) {
      return false;
    }
  }

  return true;
}

function routeExtraction(document, result) {
  const needsReview = shouldRouteToReview(result);

  if (needsReview) {
    const reviewItem = {
      documentId: document.id,
      documentName: document.name,
      extraction: result.extraction,
      validation: result.validation,
      reason: buildReviewReason(result),
      timestamp: new Date().toISOString(),
    };
    reviewQueue.push(reviewItem);
    console.log(`  -> Routed to human review: ${reviewItem.reason}`);
    return { routed: true, reason: reviewItem.reason };
  }

  if (shouldAutoAccept(result)) {
    console.log("  -> Auto-accepted (high confidence, no conflicts, validation passed)");
  } else {
    console.log("  -> Auto-approved (no review needed)");
  }

  return { routed: false, reason: null };
}

function buildReviewReason(result) {
  const reasons = [];

  if (!result.validation.valid) {
    reasons.push(`Validation errors: ${result.validation.errors.join("; ")}`);
  }

  if (result.exhausted_retries) {
    reasons.push("Exhausted retry attempts with unresolved validation errors");
  }

  // Check for low confidence scores
  if (result.extraction && result.extraction.confidence) {
    const conf = result.extraction.confidence;
    const lowFields = [];
    for (const [field, score] of Object.entries(conf)) {
      if (score !== undefined && score !== null && score < CONFIDENCE_REVIEW_THRESHOLD) {
        lowFields.push(`${field} (${score})`);
      }
    }
    if (lowFields.length > 0) {
      reasons.push(`Low confidence: ${lowFields.join(", ")}`);
    }
  }

  // Check for conflicts
  if (
    result.extraction &&
    result.extraction.conflicts &&
    result.extraction.conflicts.length > 0
  ) {
    const conflictFields = result.extraction.conflicts.map((c) => c.field);
    reasons.push(`Conflicts detected in: ${conflictFields.join(", ")}`);
  }

  return reasons.join(" | ") || "Unknown";
}

function getReviewQueue() {
  return [...reviewQueue];
}

module.exports = {
  shouldRouteToReview,
  shouldAutoAccept,
  routeExtraction,
  getReviewQueue,
  CONFIDENCE_REVIEW_THRESHOLD,
  CONFIDENCE_AUTO_ACCEPT_THRESHOLD,
};
