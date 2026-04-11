process.removeAllListeners("warning");

require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");
const { extractionTool } = require("./schema");
const { documents } = require("./documents");
const { validateExtraction } = require("./validator");
const { routeExtraction } = require("./review-router");

const client = new Anthropic();

// ============================================================
// STEP 1: Basic Extraction
// Send a document to Claude with the extraction tool
// ============================================================

async function extractClaim(document) {
  // TODO: Implement basic extraction
  // 1. Call client.messages.create() with:
  //    - model: "claude-sonnet-4-20250514"
  //    - max_tokens: 1024
  //    - tools: [extractionTool]
  //    - tool_choice: { type: "tool", name: "extract_claim" }
  //    - messages: a user message containing the document text
  //       (include a system-like instruction in the user message
  //        telling Claude to extract structured data from the claim)
  //
  // 2. Find the tool_use block in the response content
  // 3. Return the tool input (the extracted data)

  console.log(`[extractClaim] TODO: Implement extraction for document ${document.id}`);
  return null;
}

// ============================================================
// STEP 2: Extraction with Feedback Loop
// Re-extract with validation errors fed back to Claude
// ============================================================

async function extractClaimWithFeedback(document, previousExtraction, errorFeedback) {
  // TODO: Implement feedback-based re-extraction
  // 1. Build a conversation with multiple messages:
  //    - User message: original extraction request with document text
  //    - Assistant message: the previous tool_use response
  //    - User message: tool_result marked as error, containing the validation feedback
  //       { type: "tool_result", tool_use_id: ..., is_error: true, content: errorFeedback }
  //    - Then a follow-up user message asking Claude to re-extract with corrections
  //
  // 2. Call client.messages.create() with this conversation
  // 3. Return the corrected extraction

  console.log(`[extractClaimWithFeedback] TODO: Implement feedback loop for document ${document.id}`);
  return previousExtraction;
}

// ============================================================
// STEP 3: Retry Logic
// Validate, then re-extract if validation fails
// ============================================================

async function extractWithRetry(document, maxRetries = 2) {
  // TODO: Implement retry logic
  // 1. Call extractClaim(document) to get initial extraction
  // 2. Loop up to maxRetries times:
  //    a. Call validateExtraction(extraction)
  //    b. If validation passes (no errors), return { extraction, validation, attempts }
  //    c. If validation fails, format the errors as feedback
  //    d. Call extractClaimWithFeedback(document, extraction, feedback)
  //    e. Update extraction with the new result
  // 3. After all retries, return whatever we have with the final validation

  console.log(`[extractWithRetry] TODO: Implement retry logic for document ${document.id}`);
  return {
    extraction: null,
    validation: { valid: false, errors: ["Not implemented"] },
    attempts: 0,
  };
}

// ============================================================
// STEP 4: Full Pipeline
// Extract -> Validate -> Route for review if needed
// ============================================================

async function runPipeline(documentIds) {
  const results = [];

  for (const id of documentIds) {
    const document = documents.find((d) => d.id === id);
    if (!document) {
      console.log(`Document ${id} not found, skipping.`);
      continue;
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`Processing: Document ${document.id} - ${document.name}`);
    console.log(`Challenge: ${document.challenge}`);
    console.log("=".repeat(60));

    // TODO: Implement full pipeline
    // 1. Call extractWithRetry(document) to get extraction + validation
    // 2. Call routeExtraction(document, result) to check if human review is needed
    // 3. Print a summary of the extraction result
    // 4. Collect results

    console.log("[runPipeline] TODO: Implement full pipeline step");

    results.push({
      documentId: id,
      documentName: document.name,
      extraction: null,
      validation: { valid: false, errors: ["Not implemented"] },
      routed: false,
    });
  }

  return results;
}

// ============================================================
// CLI Handling
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  node extractor.js <id>              Extract a single document");
    console.log("  node extractor.js --all              Extract all documents");
    console.log("  node extractor.js <id> --with-retry  Extract with retry logic");
    console.log("  node extractor.js <id> --full-pipeline  Run full pipeline");
    console.log("  node extractor.js --all --full-pipeline  Full pipeline, all docs");
    process.exit(0);
  }

  const useRetry = args.includes("--with-retry");
  const useFullPipeline = args.includes("--full-pipeline");
  const useAll = args.includes("--all");

  // Determine which document IDs to process
  let documentIds;
  if (useAll) {
    documentIds = documents.map((d) => d.id);
  } else {
    const id = parseInt(args.find((a) => !a.startsWith("--")), 10);
    if (isNaN(id)) {
      console.error("Please provide a valid document ID (1-8) or --all");
      process.exit(1);
    }
    documentIds = [id];
  }

  // Run the appropriate mode
  if (useFullPipeline) {
    const results = await runPipeline(documentIds);
    console.log("\n\nPipeline Summary:");
    console.log(JSON.stringify(results, null, 2));
  } else if (useRetry) {
    for (const id of documentIds) {
      const doc = documents.find((d) => d.id === id);
      if (!doc) {
        console.log(`Document ${id} not found.`);
        continue;
      }
      const result = await extractWithRetry(doc);
      console.log(`\nResult for document ${id}:`);
      console.log(JSON.stringify(result, null, 2));
    }
  } else {
    for (const id of documentIds) {
      const doc = documents.find((d) => d.id === id);
      if (!doc) {
        console.log(`Document ${id} not found.`);
        continue;
      }
      const result = await extractClaim(doc);
      console.log(`\nExtraction for document ${id}:`);
      console.log(JSON.stringify(result, null, 2));
    }
  }
}

main().catch(console.error);
