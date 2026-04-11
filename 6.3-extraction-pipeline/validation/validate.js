// Validation script for Capstone Project B: Extraction Pipeline
// Tests 5 scenarios WITHOUT making real API calls
// Verifies schema structure, validation logic, and routing logic using mock data
process.removeAllListeners("warning");

// Try to load from solution first, fall back to starter
let extractionTool, validateExtraction, shouldRouteToReview, shouldAutoAccept;

try {
  ({ extractionTool } = require("../solution/schema"));
} catch (e) {
  try {
    ({ extractionTool } = require("../starter/schema"));
  } catch (e2) {
    console.error("Could not load schema.js from solution/ or starter/");
    process.exit(1);
  }
}

try {
  ({ validateExtraction } = require("../solution/validator"));
} catch (e) {
  try {
    ({ validateExtraction } = require("../starter/validator"));
  } catch (e2) {
    console.error("Could not load validator.js from solution/ or starter/");
    process.exit(1);
  }
}

try {
  ({ shouldRouteToReview, shouldAutoAccept } = require("../solution/review-router"));
} catch (e) {
  try {
    ({ shouldRouteToReview, shouldAutoAccept } = require("../starter/review-router"));
  } catch (e2) {
    console.error("Could not load review-router.js from solution/ or starter/");
    process.exit(1);
  }
}

// ============================================================
// Test Scenarios
// ============================================================

const scenarios = [
  {
    name: "Schema Completeness",
    description: "Tool schema includes confidence fields and conflicts array",
    lesson_ref: "Module 4, Lesson 4.5 — Schema Design for Extraction",
    run() {
      const props = extractionTool.input_schema.properties;
      const errors = [];

      // Check core fields exist
      const expectedFields = [
        "claimant_name",
        "claim_date",
        "claim_amount",
        "damage_category",
        "description",
        "confidence",
        "conflicts",
      ];
      for (const field of expectedFields) {
        if (!props[field]) {
          errors.push(`Missing field: ${field}`);
        }
      }

      // Check confidence is an object with sub-fields
      if (props.confidence) {
        if (props.confidence.type !== "object") {
          errors.push("confidence field should be type 'object'");
        }
        const confProps = props.confidence.properties || {};
        const expectedConfFields = [
          "claimant_name",
          "claim_date",
          "claim_amount",
          "damage_category",
        ];
        for (const cf of expectedConfFields) {
          if (!confProps[cf]) {
            errors.push(`Missing confidence sub-field: ${cf}`);
          }
        }
      }

      // Check conflicts is an array
      if (props.conflicts) {
        if (props.conflicts.type !== "array") {
          errors.push("conflicts field should be type 'array'");
        }
        if (!props.conflicts.items || !props.conflicts.items.properties) {
          errors.push("conflicts items should have properties defined");
        }
      }

      return {
        passed: errors.length === 0,
        details: errors.length === 0
          ? "Schema has all required fields, confidence object, and conflicts array"
          : errors.join("; "),
      };
    },
  },
  {
    name: "Validation Rules — Required Fields",
    description: "Empty claimant_name fails; valid extraction passes",
    lesson_ref: "Module 2, Lesson 2.9 — Structured Error Handling",
    run() {
      const errors = [];

      // Test: empty claimant_name should fail
      const badResult = validateExtraction({
        claimant_name: "",
        claim_date: "2025-03-15",
        claim_amount: 5000,
        damage_category: "Fire",
        description: "Kitchen fire damage",
        confidence: {
          claimant_name: 0.9,
          claim_date: 0.9,
          claim_amount: 0.9,
          damage_category: 0.95,
        },
        conflicts: [],
      });

      if (badResult.valid !== false) {
        errors.push("Extraction with empty claimant_name should fail validation");
      }
      if (!badResult.errors.some((e) => e.toLowerCase().includes("claimant_name"))) {
        errors.push("Error message should mention claimant_name");
      }

      // Test: valid extraction should pass
      const goodResult = validateExtraction({
        claimant_name: "Sarah Johnson",
        claim_date: "2025-03-15",
        claim_amount: 12450,
        damage_category: "Fire",
        description: "Kitchen fire damage",
        confidence: {
          claimant_name: 0.98,
          claim_date: 0.95,
          claim_amount: 0.95,
          damage_category: 0.99,
        },
        conflicts: [],
      });

      if (goodResult.valid !== true) {
        errors.push(
          "Valid extraction should pass, but got errors: " +
            goodResult.errors.join("; ")
        );
      }

      return {
        passed: errors.length === 0,
        details: errors.length === 0
          ? "Empty claimant_name correctly rejected; valid extraction correctly accepted"
          : errors.join("; "),
      };
    },
  },
  {
    name: "Validation Retry Detection",
    description: "Negative claim_amount produces specific error about positive number",
    lesson_ref: "Module 6, Lesson 6.3 — Extraction Pipeline Retry Logic",
    run() {
      const errors = [];

      const result = validateExtraction({
        claimant_name: "Test User",
        claim_date: "2025-01-01",
        claim_amount: -500,
        damage_category: "Water",
        description: "Water damage to basement",
        confidence: {
          claimant_name: 0.9,
          claim_date: 0.9,
          claim_amount: 0.9,
          damage_category: 0.95,
        },
        conflicts: [],
      });

      if (result.valid !== false) {
        errors.push("Negative claim_amount should fail validation");
      }

      if (!result.errors.some((e) => e.toLowerCase().includes("positive"))) {
        errors.push(
          'Error message should mention "positive" to guide retry feedback. ' +
            "Got: " +
            result.errors.join("; ")
        );
      }

      // Also test bad date format
      const dateResult = validateExtraction({
        claimant_name: "Test User",
        claim_date: "March 15, 2025",
        claim_amount: 1000,
        damage_category: "Fire",
        description: "Fire damage",
        confidence: {
          claimant_name: 0.9,
          claim_date: 0.9,
          claim_amount: 0.9,
          damage_category: 0.95,
        },
        conflicts: [],
      });

      if (dateResult.valid !== false) {
        errors.push("Non-YYYY-MM-DD date format should fail validation");
      }

      return {
        passed: errors.length === 0,
        details: errors.length === 0
          ? "Negative amount and bad date format produce specific, actionable error messages"
          : errors.join("; "),
      };
    },
  },
  {
    name: "Review Routing — Conflicts",
    description: "Extraction with conflicts is routed to human review",
    lesson_ref: "Module 6, Lesson 6.3 — Review Routing and Confidence Thresholds",
    run() {
      const errors = [];

      if (typeof shouldRouteToReview !== "function") {
        return {
          passed: false,
          details: "shouldRouteToReview is not exported as a function",
        };
      }

      // Mock result with conflicts
      const resultWithConflicts = {
        extraction: {
          claimant_name: "Robert Kim",
          claim_date: "2025-01-20",
          claim_amount: 7800,
          damage_category: "Wind",
          description: "Wind damage to property",
          confidence: {
            claimant_name: 0.98,
            claim_date: 0.95,
            claim_amount: 0.85,
            damage_category: 0.95,
          },
          conflicts: [
            {
              field: "claim_amount",
              value_a: "$7,800",
              value_b: "$8,200",
              source_a: "Claim Amount header field",
              source_b: "Contractor estimate in description",
            },
          ],
        },
        validation: { valid: true, errors: [], warnings: [] },
        attempts: 1,
        exhausted_retries: false,
      };

      const routed = shouldRouteToReview(resultWithConflicts);
      if (routed !== true) {
        errors.push("Extraction with conflicts should be routed to review");
      }

      // Mock result with exhausted retries
      const resultExhausted = {
        extraction: {
          claimant_name: "Test User",
          claim_date: null,
          claim_amount: null,
          damage_category: "Other",
          description: "Some damage",
          confidence: {
            claimant_name: 0.9,
            claim_date: 0.5,
            claim_amount: 0.5,
            damage_category: 0.7,
          },
          conflicts: [],
        },
        validation: { valid: false, errors: ["Some error"], warnings: [] },
        attempts: 3,
        exhausted_retries: true,
      };

      const routedExhausted = shouldRouteToReview(resultExhausted);
      if (routedExhausted !== true) {
        errors.push("Extraction with exhausted retries should be routed to review");
      }

      return {
        passed: errors.length === 0,
        details: errors.length === 0
          ? "Conflicts and exhausted retries both correctly trigger review routing"
          : errors.join("; "),
      };
    },
  },
  {
    name: "Auto-Accept vs. Review",
    description: "High-confidence clean extraction auto-accepts; low confidence routes to review",
    lesson_ref: "Module 6, Lesson 6.3 — Confidence-Based Routing Thresholds",
    run() {
      const errors = [];

      // High confidence, no issues -> should NOT route to review
      const highConfResult = {
        extraction: {
          claimant_name: "Sarah Johnson",
          claim_date: "2025-03-15",
          claim_amount: 12450,
          damage_category: "Fire",
          description: "Kitchen fire damage",
          confidence: {
            claimant_name: 0.99,
            claim_date: 0.98,
            claim_amount: 0.97,
            damage_category: 0.99,
          },
          conflicts: [],
        },
        validation: { valid: true, errors: [], warnings: [] },
        attempts: 1,
        exhausted_retries: false,
      };

      const highConfRouted = shouldRouteToReview(highConfResult);
      if (highConfRouted !== false) {
        errors.push(
          "High-confidence extraction with no issues should NOT be routed to review"
        );
      }

      // If shouldAutoAccept is available, test it
      if (typeof shouldAutoAccept === "function") {
        const autoAccepted = shouldAutoAccept(highConfResult);
        if (autoAccepted !== true) {
          errors.push(
            "High-confidence extraction with no issues should be auto-accepted"
          );
        }
      }

      // Low confidence -> should route to review
      const lowConfResult = {
        extraction: {
          claimant_name: "T. Williams",
          claim_date: null,
          claim_amount: 5000,
          damage_category: "Water",
          description: "Pipe broke, flooded kitchen",
          confidence: {
            claimant_name: 0.60,
            claim_date: 0.30,
            claim_amount: 0.50,
            damage_category: 0.75,
          },
          conflicts: [],
        },
        validation: { valid: true, errors: [], warnings: [] },
        attempts: 1,
        exhausted_retries: false,
      };

      const lowConfRouted = shouldRouteToReview(lowConfResult);
      if (lowConfRouted !== true) {
        errors.push(
          "Low-confidence extraction should be routed to review"
        );
      }

      // If shouldAutoAccept is available, low confidence should not auto-accept
      if (typeof shouldAutoAccept === "function") {
        const lowAutoAccepted = shouldAutoAccept(lowConfResult);
        if (lowAutoAccepted !== false) {
          errors.push(
            "Low-confidence extraction should NOT be auto-accepted"
          );
        }
      }

      return {
        passed: errors.length === 0,
        details: errors.length === 0
          ? "High confidence auto-accepts; low confidence correctly routes to review"
          : errors.join("; "),
      };
    },
  },
];

// ============================================================
// Run Validation
// ============================================================

function runValidation() {
  console.log("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557");
  console.log("\u2551   Capstone Project B: Extraction Pipeline Validation    \u2551");
  console.log("\u2551   5 scenarios testing schema, validation, and routing   \u2551");
  console.log("\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\n");

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`\n\u2500\u2500\u2500 Scenario ${i + 1}: ${scenario.name} \u2500\u2500\u2500`);
    console.log(`    ${scenario.description}\n`);

    try {
      const result = scenario.run();

      if (result.passed) {
        console.log("    \u2705 PASSED");
        console.log(`    ${result.details}`);
        passed++;
      } else {
        console.log("    \u274c FAILED");
        console.log(`    ${result.details}`);
        console.log(`    Review: ${scenario.lesson_ref}`);
        failed++;
      }
    } catch (error) {
      console.log("    \u274c ERROR");
      console.log(`    ${error.message}`);
      console.log(`    Review: ${scenario.lesson_ref}`);
      failed++;
    }
  }

  console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  console.log(`  Results: ${passed} passed, ${failed} failed (of ${scenarios.length})`);

  if (passed === scenarios.length) {
    console.log("  All scenarios passed! Project B extraction pipeline is complete.");
  } else {
    console.log(`  ${failed} scenario(s) need attention. See lesson references above.`);
  }
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");

  process.exit(failed > 0 ? 1 : 0);
}

runValidation();
