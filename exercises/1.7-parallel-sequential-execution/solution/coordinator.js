/**
 * coordinator.js — Reference solution for Exercise 1.7.
 *
 * Demonstrates both sequential and parallel subagent execution patterns.
 * Supports both mock subagents (default) and real API calls (--real flag).
 *
 * Usage:
 *   node coordinator.js sequential          # Mock subagents, sequential
 *   node coordinator.js parallel            # Mock subagents, parallel
 *   node coordinator.js both                # Mock subagents, both (default)
 *   node coordinator.js sequential --real   # Real API calls, sequential
 *   node coordinator.js parallel --real     # Real API calls, parallel
 *   node coordinator.js both --real         # Real API calls, both
 *
 * See README.md for design decisions and alternatives.
 */

process.removeAllListeners('warning');

// Select subagent implementation based on --real flag.
// Mock subagents use simulated delays (no API key needed).
// Real subagents make actual Claude API calls (requires .env with API key).
const useReal = process.argv.includes('--real');

const subagents = useReal
  ? require('./subagents')           // Real API calls (Step 6)
  : require('../starter/subagents'); // Mock delays (Steps 3-5)

const { researchMarket, analyzeTrends, writeReport } = subagents;

if (useReal) {
  console.log('[Mode] Using REAL API calls — this will use API credits.\n');
} else {
  console.log('[Mode] Using mock subagents with simulated delays.\n');
}

/**
 * Sequential execution: all three subagents run one after another.
 * Total time ≈ sum of all individual times.
 *   Mock: ~5 seconds (2s + 2s + 1s)
 *   Real: depends on API latency (typically 3-8s per call)
 */
async function runSequential(topic) {
  console.log(`\n--- Sequential Execution ---`);
  console.log(`Topic: ${topic}\n`);

  const start = Date.now();

  const marketResult = await researchMarket(topic);
  const trendResult = await analyzeTrends(topic);
  const report = await writeReport(marketResult, trendResult);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n--- Sequential Total: ${elapsed}s ---`);
  return report;
}

/**
 * Parallel execution: independent subagents run concurrently.
 * Total time ≈ max(independent tasks) + sequential dependency.
 *   Mock: ~3 seconds (max(2s, 2s) + 1s)
 *   Real: depends on API latency (but always faster than sequential)
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

  // Market research and trend analysis are independent —
  // neither needs the other's output. Run them concurrently.
  const [marketResult, trendResult] = await Promise.all([
    researchMarket(topic),
    analyzeTrends(topic),
  ]);

  // Report writing depends on both results, so it must wait.
  const report = await writeReport(marketResult, trendResult);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n--- Parallel Total: ${elapsed}s ---`);
  return report;
}

async function main() {
  // Parse mode from args (ignore --real flag)
  const args = process.argv.slice(2).filter(a => a !== '--real');
  const mode = args[0] || 'both';
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
