process.removeAllListeners("warning");

require("dotenv").config({ path: "../starter/.env" });
const Anthropic = require("@anthropic-ai/sdk");
const { extractionTool } = require("./schema");
const { documents } = require("../starter/documents");
const { validateExtraction } = require("./validator");
const { routeExtraction } = require("./review-router");

const client = new Anthropic();

// ============================================================
// STEP 1: Basic Extraction
// Send a document to Claude with the extraction tool
// ============================================================

async function extractClaim(document) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [extractionTool],
    tool_choice: { type: "tool", name: "extract_claim" },
    messages: [
      {
        role: "user",
        content:
          "Extract structured data from the following insurance claim document. " +
          "Be precise with dates (use YYYY-MM-DD format), amounts (numeric values), " +
          "and categories. If information is missing or unclear, use null for nullable fields " +
          "and provide appropriate confidence scores.\n\n" +
          "DOCUMENT:\n" +
          document.text,
      },
    ],
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolUseBlock) {
    throw new Error("No tool_use block found in response");
  }

  return toolUseBlock.input;
}

// ============================================================
// STEP 2: Extraction with Feedback Loop
// Re-extract with validation errors fed back to Claude
// ============================================================

async function extractClaimWithFeedback(document, previousExtraction, errorFeedback) {
  const toolUseId = "extract_" + document.id;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [extractionTool],
    tool_choice: { type: "tool", name: "extract_claim" },
    messages: [
      {
        role: "user",
        content:
          "Extract structured data from the following insurance claim document. " +
          "Be precise with dates (use YYYY-MM-DD format), amounts (numeric values), " +
          "and categories. If information is missing or unclear, use null for nullable fields " +
          "and provide appropriate confidence scores.\n\n" +
          "DOCUMENT:\n" +
          document.text,
      },
      {
        role: "assistant",
        content: [
          {
            type: "tool_use",
            id: toolUseId,
            name: "extract_claim",
            input: previousExtraction,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUseId,
            is_error: true,
            content: errorFeedback,
          },
        ],
      },
      {
        role: "user",
        content:
          "The previous extraction had validation errors. Please re-extract the data " +
          "from the same document, correcting ONLY the specific errors noted above. " +
          "Keep all other fields the same if they were correct.",
      },
    ],
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolUseBlock) {
    throw new Error("No tool_use block found in feedback response");
  }

  return toolUseBlock.input;
}

// ============================================================
// STEP 3: Retry Logic
// Validate, then re-extract if validation fails
// ============================================================

async function extractWithRetry(document, maxRetries = 2) {
  let extraction = await extractClaim(document);
  let validation = validateExtraction(extraction);
  let attempts = 1;

  while (!validation.valid && attempts <= maxRetries) {
    console.log(`  Attempt ${attempts} had ${validation.errors.length} error(s). Retrying...`);

    const feedback =
      "Validation errors found:\n" +
      validation.errors.map((e, i) => `${i + 1}. ${e}`).join("\n");

    extraction = await extractClaimWithFeedback(document, extraction, feedback);
    validation = validateExtraction(extraction);
    attempts++;
  }

  const exhaustedRetries = !validation.valid && attempts > maxRetries;

  if (exhaustedRetries) {
    console.log(`  Exhausted ${maxRetries} retries. Proceeding with best extraction.`);
  } else if (validation.valid) {
    console.log(`  Extraction validated after ${attempts} attempt(s).`);
  }

  return {
    extraction,
    validation,
    attempts,
    exhausted_retries: exhaustedRetries,
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

    const result = await extractWithRetry(document);
    const routing = routeExtraction(document, result);

    // Print summary
    console.log(`\n  Extraction Summary:`);
    console.log(`    Claimant:  ${result.extraction.claimant_name}`);
    console.log(`    Date:      ${result.extraction.claim_date || "N/A"}`);
    console.log(`    Amount:    ${result.extraction.claim_amount != null ? "$" + result.extraction.claim_amount : "N/A"}`);
    console.log(`    Category:  ${result.extraction.damage_category}`);
    console.log(`    Valid:     ${result.validation.valid}`);
    console.log(`    Attempts:  ${result.attempts}`);
    console.log(`    Routed:    ${routing.routed}`);

    if (result.extraction.conflicts && result.extraction.conflicts.length > 0) {
      console.log(`    Conflicts: ${result.extraction.conflicts.length}`);
    }

    results.push({
      documentId: id,
      documentName: document.name,
      extraction: result.extraction,
      validation: result.validation,
      attempts: result.attempts,
      routed: routing.routed,
      routeReason: routing.reason,
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
