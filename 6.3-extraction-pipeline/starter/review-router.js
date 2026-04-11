// Routes extractions to human review when confidence is low
// or data quality issues are detected

const reviewQueue = [];

function shouldRouteToReview(result) {
  // TODO: Implement review routing logic
  // Return true if ANY of the following conditions are met:
  //
  // 1. Validation failed (result.validation.valid === false)
  //
  // 2. Any confidence score is "low"
  //    - Check result.extraction.confidence object
  //    - If any field has confidence "low", route for review
  //
  // 3. Conflicts were detected
  //    - Check result.extraction.conflicts array
  //    - If it has any entries, route for review

  console.log("[shouldRouteToReview] TODO: Implement routing conditions");
  return false;
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

  console.log("  -> Auto-approved (no review needed)");
  return { routed: false, reason: null };
}

function buildReviewReason(result) {
  const reasons = [];

  if (!result.validation.valid) {
    reasons.push(`Validation errors: ${result.validation.errors.join("; ")}`);
  }

  // TODO: Add reason for low confidence scores
  // TODO: Add reason for detected conflicts

  return reasons.join(" | ") || "Unknown";
}

function getReviewQueue() {
  return [...reviewQueue];
}

module.exports = {
  shouldRouteToReview,
  routeExtraction,
  getReviewQueue,
};
