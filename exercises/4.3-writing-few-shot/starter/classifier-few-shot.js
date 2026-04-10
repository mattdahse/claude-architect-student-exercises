/**
 * classifier-few-shot.js — Classification WITH few-shot examples.
 *
 * YOUR job: add 3-5 few-shot examples to the prompt to improve
 * classification consistency on ambiguous messages.
 *
 * Follow the instructions in LESSON.md to complete this file.
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

// TODO Step 4: Add your few-shot examples here.
//
// Write 3-5 examples that demonstrate how to classify messages.
// Include:
//   - 1-2 normal cases (clear, unambiguous classification)
//   - 1 edge case (unusual input like empty message or very short text)
//   - 1-2 boundary cases (ambiguous messages with YOUR preferred classification)
//
// Format each example as:
//   Input: "<customer message>"
//   Output: { "category": "<category>", "confidence": "<level>" }
//
// Place them in the FEW_SHOT_EXAMPLES string below.

const FEW_SHOT_EXAMPLES = `TODO: Add your few-shot examples here.`;

async function classifyMessage(messageText) {
  const prompt = FEW_SHOT_EXAMPLES.includes('TODO')
    ? messageText
    : `${FEW_SHOT_EXAMPLES}\n\nNow classify this message:\n${messageText}`;

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
