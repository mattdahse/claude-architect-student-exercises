/**
 * verify.js — Exercise 0.2: Verify Your Setup.
 *
 * Sends a single message to Claude to confirm your Node.js install,
 * Anthropic SDK, and API key are all wired up correctly.
 *
 * Expected output:
 *   API Key enabled and environment verified
 */

process.removeAllListeners('warning');

require('../../../shared/load-env');
const Anthropic = require('@anthropic-ai/sdk').default;

const client = new Anthropic();

async function main() {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: 'Respond with exactly this: API Key enabled and environment verified',
      },
    ],
  });

  console.log(response.content[0].text);
}

main().catch((err) => {
  console.error('Verification failed:', err.message);
  process.exit(1);
});

module.exports = { main };
