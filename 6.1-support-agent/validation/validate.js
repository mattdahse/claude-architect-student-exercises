// Validation script for Capstone Project A
// Tests 5 key scenarios to verify the student's implementation
process.removeAllListeners("warning");

require("../../shared/load-env");

const path = require("path");

// Try to load from solution first, fall back to starter
let runAgent;
try {
  ({ runAgent } = require("../solution/agent"));
} catch (e) {
  try {
    ({ runAgent } = require("../starter/agent"));
  } catch (e2) {
    console.error("Could not load agent.js from solution/ or starter/");
    process.exit(1);
  }
}

const scenarios = [
  {
    name: "Basic Tool Use",
    description: "Agent calls lookup_order and returns status",
    input: "What's the status of order ORD-001?",
    validate: (response) => {
      const lower = response.toLowerCase();
      // Should mention the order and its status
      return (lower.includes("ord-001") || lower.includes("order")) &&
             (lower.includes("delivered") || lower.includes("status"));
    },
    lesson_ref: "Module 1, Lesson 1.2 — Agentic Loop Implementation"
  },
  {
    name: "Error Handling",
    description: "Agent handles non-existent order gracefully",
    input: "What's the status of order ORD-999?",
    validate: (response) => {
      const lower = response.toLowerCase();
      // Should indicate the order wasn't found, not crash
      return (lower.includes("not found") || lower.includes("couldn't find") ||
              lower.includes("unable to find") || lower.includes("no order") ||
              lower.includes("don't see") || lower.includes("doesn't exist"));
    },
    lesson_ref: "Module 2, Lesson 2.3 — Structured Error Responses"
  },
  {
    name: "Hook Enforcement",
    description: "Refund above $100 is blocked by PreToolUse hook",
    input: "Process a refund of 150 dollars for order ORD-003. The reason is overcharge.",
    validate: (response) => {
      const lower = response.toLowerCase();
      // Should mention the threshold or manager approval
      return (lower.includes("threshold") || lower.includes("manager") ||
              lower.includes("approval") || lower.includes("limit") ||
              lower.includes("cannot process") || lower.includes("exceeds"));
    },
    lesson_ref: "Module 1, Lesson 1.9 — Programmatic Hooks"
  },
  {
    name: "Explicit Escalation",
    description: "Customer request for human triggers immediate escalation",
    input: "I want to talk to a manager right now.",
    validate: (response) => {
      const lower = response.toLowerCase();
      // Should indicate transfer/escalation is happening
      return (lower.includes("transfer") || lower.includes("escalat") ||
              lower.includes("connect") || lower.includes("human") ||
              lower.includes("manager") || lower.includes("team member"));
    },
    lesson_ref: "Module 5, Lesson 5.4 — Escalation Patterns"
  },
  {
    name: "Multi-Turn Context",
    description: "Agent preserves exact values across conversation turns",
    input: "Look up customer C-001 and then check order ORD-001. What's the exact total?",
    validate: (response) => {
      // Should include the exact dollar amount from mock data ($85.00)
      return response.includes("85") || response.includes("$85");
    },
    lesson_ref: "Module 5, Lessons 5.1-5.3 — Context Management"
  }
];

async function runValidation() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║   Capstone Project A: Validation Suite                   ║");
  console.log("║   5 scenarios testing core capabilities                  ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`\n─── Scenario ${i + 1}: ${scenario.name} ───`);
    console.log(`    ${scenario.description}`);
    console.log(`    Input: "${scenario.input}"\n`);

    try {
      const response = await runAgent(scenario.input);

      if (scenario.validate(response)) {
        console.log(`    ✅ PASSED`);
        console.log(`    Response includes expected content.`);
        passed++;
      } else {
        console.log(`    ❌ FAILED`);
        console.log(`    Response did not match expected pattern.`);
        console.log(`    Got: "${response.substring(0, 150)}..."`);
        console.log(`    Review: ${scenario.lesson_ref}`);
        failed++;
      }
    } catch (error) {
      console.log(`    ❌ ERROR`);
      console.log(`    ${error.message}`);
      console.log(`    Review: ${scenario.lesson_ref}`);
      failed++;
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  Results: ${passed} passed, ${failed} failed (of ${scenarios.length})`);

  if (passed === scenarios.length) {
    console.log("  🎉 All scenarios passed! Project A is complete.");
  } else {
    console.log(`  ⚠️  ${failed} scenario(s) need attention. See lesson references above.`);
  }
  console.log("═══════════════════════════════════════════════════════════\n");

  process.exit(failed > 0 ? 1 : 0);
}

runValidation();
