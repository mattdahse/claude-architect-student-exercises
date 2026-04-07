/**
 * coordinator.js — Multi-agent coordinator for market research.
 *
 * Follow the steps in LESSON.md to complete this file.
 *
 * Usage:
 *   node coordinator.js sequential    # Run all subagents one after another
 *   node coordinator.js parallel      # Run independent subagents concurrently
 *   node coordinator.js               # Defaults to sequential
 */

process.removeAllListeners('warning');

const { researchMarket, analyzeTrends, writeReport } = require('./subagents');

/**
 * Run all three subagents sequentially — one after another.
 * This is the baseline. Measure how long it takes.
 */
async function runSequential(topic) {
  console.log(`\n--- Sequential Execution ---`);
  console.log(`Topic: ${topic}\n`);

  const start = Date.now();

  // TODO Step 3: Run all three subagents sequentially.
  //
  // 1. await researchMarket(topic) and store the result
  // 2. await analyzeTrends(topic) and store the result
  // 3. await writeReport(marketResult, trendResult) and store the result
  //
  // Each subagent runs only after the previous one completes.

  console.log('TODO: Complete Step 3 — implement sequential execution.');
  return null;
}

/**
 * Run independent subagents in parallel, then run the dependent one.
 * This should be faster because market research and trend analysis
 * don't depend on each other.
 */
async function runParallel(topic) {
  console.log(`\n--- Parallel Execution ---`);
  console.log(`Topic: ${topic}\n`);

  const start = Date.now();

  // TODO Step 5: Refactor to parallel execution.
  //
  // 1. Use Promise.all() to run researchMarket(topic) and analyzeTrends(topic)
  //    concurrently. Destructure the results: const [marketResult, trendResult] = await Promise.all([...])
  //
  // 2. After both complete, run writeReport(marketResult, trendResult) sequentially
  //    (it depends on both results).

  console.log('TODO: Complete Step 5 — implement parallel execution.');
  return null;
}

// Main entry point
async function main() {
  const mode = process.argv[2] || 'sequential';
  const topic = 'cloud database services';

  let report;
  if (mode === 'parallel') {
    report = await runParallel(topic);
  } else {
    report = await runSequential(topic);
  }

  if (report) {
    console.log('\n--- Final Report ---');
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch(console.error);

module.exports = { runSequential, runParallel };
