/**
 * subagents.js — Mock subagent functions for the parallel/sequential exercise.
 *
 * This file is provided complete. You don't need to modify it.
 *
 * Each function simulates a subagent that takes time to complete (using setTimeout).
 * The delays make it easy to measure the difference between sequential and parallel execution.
 *
 * In production, these would be real Claude API calls (like the runSubagent function
 * from Lesson 1.6). Here they return hardcoded data so you can focus on the
 * orchestration pattern without API costs.
 */

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Market Researcher — analyzes competitors in a given market.
 * Simulates 2 seconds of work (like a Claude API call + web search tool).
 * INDEPENDENT: does not need results from any other subagent.
 */
async function researchMarket(topic) {
  const start = Date.now();
  console.log(`  [Market Researcher] Starting analysis of "${topic}"...`);

  await delay(2000);

  const result = {
    topic: topic,
    competitors: [
      { name: 'AlphaDB', type: 'relational', pricing: '$29/mo', marketShare: '35%' },
      { name: 'BetaStore', type: 'document', pricing: '$19/mo', marketShare: '25%' },
      { name: 'GammaCloud', type: 'multi-model', pricing: '$49/mo', marketShare: '20%' },
      { name: 'DeltaBase', type: 'key-value', pricing: '$9/mo', marketShare: '15%' },
    ],
    summary: `Found 4 major competitors in the ${topic} market with pricing ranging from $9 to $49/mo.`,
  };

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [Market Researcher] Done (${elapsed}s)`);
  return result;
}

/**
 * Trend Analyst — identifies market trends and adoption patterns.
 * Simulates 2 seconds of work.
 * INDEPENDENT: does not need results from any other subagent.
 */
async function analyzeTrends(topic) {
  const start = Date.now();
  console.log(`  [Trend Analyst] Starting trend analysis for "${topic}"...`);

  await delay(2000);

  const result = {
    topic: topic,
    trends: [
      { trend: 'Serverless databases', direction: 'growing', confidence: 'high' },
      { trend: 'AI-native data layers', direction: 'emerging', confidence: 'medium' },
      { trend: 'Multi-cloud portability', direction: 'growing', confidence: 'high' },
      { trend: 'Traditional on-premise', direction: 'declining', confidence: 'high' },
    ],
    summary: `Identified 4 key trends in ${topic}: serverless and multi-cloud are growing, AI-native is emerging, on-premise is declining.`,
  };

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [Trend Analyst] Done (${elapsed}s)`);
  return result;
}

/**
 * Report Writer — synthesizes market data and trends into a report.
 * Simulates 1 second of work.
 * DEPENDENT: requires results from both researchMarket AND analyzeTrends.
 */
async function writeReport(marketData, trendData) {
  const start = Date.now();
  console.log(`  [Report Writer] Starting report synthesis...`);

  if (!marketData || !trendData) {
    throw new Error('Report Writer requires both market data and trend data as input.');
  }

  await delay(1000);

  const result = {
    title: `Market Analysis: ${marketData.topic}`,
    sections: {
      overview: marketData.summary,
      trends: trendData.summary,
      competitors: marketData.competitors.length + ' competitors analyzed',
      recommendation: `Focus on ${trendData.trends[0].trend} — highest confidence growth area. Primary competitor to watch: ${marketData.competitors[0].name} (${marketData.competitors[0].marketShare} market share).`,
    },
    metadata: {
      competitorCount: marketData.competitors.length,
      trendCount: trendData.trends.length,
    },
  };

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [Report Writer] Done (${elapsed}s)`);
  return result;
}

module.exports = { researchMarket, analyzeTrends, writeReport };
