/**
 * classifier-baseline.js — Classification WITHOUT few-shot examples.
 *
 * Uses explicit criteria only (no examples). This is the baseline for comparison.
 * Provided complete — don't modify this file.
 */

process.removeAllListeners('warning');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a customer support classifier. Classify each message into exactly one category.

Categories:
- billing: payment issues, charges, invoices, pricing, plan changes
- technical: bugs, errors, performance issues, features not working
- account: login, access, permissions, profile settings, account changes
- feedback: compliments, complaints, feature requests, product opinions
- general: information requests, follow-ups, greetings, other

Return ONLY a JSON object: { "category": "<category>", "confidence": "<high|medium|low>" }
No other text.`;

async function classifyMessage(messageText) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: messageText }],
  });

  const text = response.content[0].text.trim();
  try {
    return JSON.parse(text);
  } catch {
    return { category: 'parse_error', confidence: 'low', raw: text };
  }
}

module.exports = { classifyMessage };
