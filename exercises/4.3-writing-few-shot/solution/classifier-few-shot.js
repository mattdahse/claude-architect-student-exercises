/**
 * classifier-few-shot.js — Reference solution with well-chosen examples.
 *
 * 5 examples covering: 2 normal, 1 edge, 2 boundary cases.
 */

process.removeAllListeners('warning');
require('../../../shared/load-env');
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

// 5 examples: 2 normal + 1 edge + 2 boundary
const FEW_SHOT_EXAMPLES = `Here are examples of how to classify customer messages:

<examples>
<example>
<input>My subscription renewal charge is higher than expected.</input>
<output>{ "category": "billing", "confidence": "high" }</output>
</example>

<example>
<input>The export feature keeps timing out when I try to download reports.</input>
<output>{ "category": "technical", "confidence": "high" }</output>
</example>

<example>
<input>ok</input>
<output>{ "category": "general", "confidence": "low" }</output>
</example>

<example>
<input>The checkout page loads incredibly slowly — I almost gave up trying to pay.</input>
<output>{ "category": "technical", "confidence": "high" }</output>
</example>

<example>
<input>Honestly I expected more from this product given the price.</input>
<output>{ "category": "feedback", "confidence": "high" }</output>
</example>
</examples>`;

async function classifyMessage(messageText) {
  const prompt = `${FEW_SHOT_EXAMPLES}\n\nNow classify this message:\n${messageText}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  try {
    return JSON.parse(text);
  } catch {
    return { category: 'parse_error', confidence: 'low', raw: text };
  }
}

module.exports = { classifyMessage };
