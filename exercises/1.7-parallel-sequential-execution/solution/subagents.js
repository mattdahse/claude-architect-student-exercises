/**
 * subagents.js — Real API subagent implementations for Exercise 1.7, Step 6.
 *
 * These replace the mock functions from starter/subagents.js with actual
 * Claude API calls using the runSubagent pattern from Lesson 1.6.
 *
 * Usage:
 *   node coordinator.js sequential --real
 *   node coordinator.js parallel --real
 *
 * Requires a .env file with your ANTHROPIC_API_KEY in the starter/ directory.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../starter/.env') });
const Anthropic = require('@anthropic-ai/sdk').default;

const client = new Anthropic();

/**
 * Runs a single subagent as an agentic loop (pattern from Lesson 1.6).
 * Each call creates a fresh message history — context isolation in action.
 */
async function runSubagent(systemPrompt, taskPrompt) {
  const messages = [{ role: 'user', content: taskPrompt }];

  let response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages,
  });

  // This simplified loop has no tools — each subagent just produces text.
  // In production you'd add tools and the full tool_use loop from Lesson 1.2.
  return response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');
}

/**
 * Market Researcher — analyzes competitors using a real Claude API call.
 */
async function researchMarket(topic) {
  const start = Date.now();
  console.log(`  [Market Researcher] Starting analysis of "${topic}"...`);

  const result = await runSubagent(
    'You are a market research specialist. Return your findings as a concise JSON array.',
    `Research the top competitors in the ${topic} market. For each competitor, provide: name, product type, approximate pricing, and estimated market share. Return exactly 4 competitors as a JSON array with fields: name, type, pricing, marketShare. Return ONLY the JSON, no other text.`
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [Market Researcher] Done (${elapsed}s)`);

  // Attempt to parse as JSON; fall back to wrapping in a summary object
  try {
    return { topic, competitors: JSON.parse(result), summary: `Analyzed competitors in ${topic}.` };
  } catch {
    return { topic, competitors: [], summary: result };
  }
}

/**
 * Trend Analyst — identifies market trends using a real Claude API call.
 */
async function analyzeTrends(topic) {
  const start = Date.now();
  console.log(`  [Trend Analyst] Starting trend analysis for "${topic}"...`);

  const result = await runSubagent(
    'You are a market trend analyst. Return your findings as a concise JSON array.',
    `Identify the top 4 trends in the ${topic} market. For each trend, provide: the trend name, whether it is growing/emerging/declining, and your confidence level (high/medium/low). Return as a JSON array with fields: trend, direction, confidence. Return ONLY the JSON, no other text.`
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [Trend Analyst] Done (${elapsed}s)`);

  try {
    return { topic, trends: JSON.parse(result), summary: `Analyzed trends in ${topic}.` };
  } catch {
    return { topic, trends: [], summary: result };
  }
}

/**
 * Report Writer — synthesizes market data and trends using a real Claude API call.
 */
async function writeReport(marketData, trendData) {
  const start = Date.now();
  console.log(`  [Report Writer] Starting report synthesis...`);

  if (!marketData || !trendData) {
    throw new Error('Report Writer requires both market data and trend data as input.');
  }

  const result = await runSubagent(
    'You are a technical report writer. Write clear, concise executive summaries.',
    `Write a brief executive summary (3-4 paragraphs) of the ${marketData.topic} market based on this data:

COMPETITOR DATA:
${JSON.stringify(marketData.competitors, null, 2)}

TREND DATA:
${JSON.stringify(trendData.trends, null, 2)}

Structure your summary as: Market Overview, Key Trends, Recommendation.`
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [Report Writer] Done (${elapsed}s)`);

  return {
    title: `Market Analysis: ${marketData.topic}`,
    sections: {
      overview: marketData.summary,
      trends: trendData.summary,
      competitors: (marketData.competitors?.length || 0) + ' competitors analyzed',
      recommendation: result,
    },
    metadata: {
      competitorCount: marketData.competitors?.length || 0,
      trendCount: trendData.trends?.length || 0,
    },
  };
}

module.exports = { researchMarket, analyzeTrends, writeReport };
