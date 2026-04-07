/**
 * coordinator.js — Reference solution for Exercise 1.7.
 *
 * Demonstrates both sequential and parallel subagent execution patterns.
 * See README.md for design decisions and alternatives.
 */

process.removeAllListeners('warning');

const { researchMarket, analyzeTrends, writeReport } = require('../starter/subagents');

/**
 * Sequential execution: all three subagents run one after another.
 * Total time ≈ sum of all individual times (~5 seconds with mock delays).
 */
async function runSequential(topic) {
  console.log(`\n--- Sequential Execution ---`);
  console.log(`Topic: ${topic}\n`);

  const start = Date.now();

  // Step 3: Each await blocks until the previous completes.
  // Total time = 2s (market) + 2s (trends) + 1s (report) = ~5s
  const marketResult = await researchMarket(topic);
  const trendResult = await analyzeTrends(topic);
  const report = await writeReport(marketResult, trendResult);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n--- Sequential Total: ${elapsed}s ---`);
  return report;
}

/**
 * Parallel execution: independent subagents run concurrently.
 * Total time ≈ max(independent tasks) + sequential dependency (~3 seconds).
 *
 * We use Promise.all() here because BOTH results are required for the report.
 * If either fails, Promise.all() rejects immediately — which is correct,
 * because we can't write a report without both inputs.
 *
 * If partial results were acceptable, Promise.allSettled() would be the
 * better choice (see Stretch Goal 1 in the lesson).
 */
async function runParallel(topic) {
  console.log(`\n--- Parallel Execution ---`);
  console.log(`Topic: ${topic}\n`);

  const start = Date.now();

  // Step 5: Market research and trend analysis are independent —
  // neither needs the other's output. Run them concurrently.
  // Total time for this step = max(2s, 2s) = ~2s (not 2s + 2s = 4s)
  const [marketResult, trendResult] = await Promise.all([
    researchMarket(topic),
    analyzeTrends(topic),
  ]);

  // Report writing depends on both results, so it must wait.
  // This runs after both parallel tasks complete.
  const report = await writeReport(marketResult, trendResult);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n--- Parallel Total: ${elapsed}s ---`);
  return report;
}

async function main() {
  const mode = process.argv[2] || 'both';
  const topic = 'cloud database services';

  if (mode === 'sequential' || mode === 'both') {
    const seqReport = await runSequential(topic);
    console.log('\n--- Sequential Report ---');
    console.log(JSON.stringify(seqReport, null, 2));
  }

  if (mode === 'parallel' || mode === 'both') {
    const parReport = await runParallel(topic);
    console.log('\n--- Parallel Report ---');
    console.log(JSON.stringify(parReport, null, 2));
  }
}

main().catch(console.error);

module.exports = { runSequential, runParallel };
