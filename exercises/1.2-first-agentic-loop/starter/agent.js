/**
 * agent.js — Your first agentic loop.
 *
 * Follow the steps in LESSON.md to complete this file.
 * Each TODO comment corresponds to one step in the exercise.
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;
const { toolDefinitions, executeTool } = require('./tools');

const client = new Anthropic();

async function runAgent(userMessage) {
  console.log(`\nUser: ${userMessage}`);
  console.log('---');

  // The messages array holds the full conversation history.
  // It starts with the user's initial message.
  const messages = [{ role: 'user', content: userMessage }];

  // TODO Step 3: Send the first request to Claude.
  // Use client.messages.create() with:
  //   - model: 'claude-sonnet-4-20250514'
  //   - max_tokens: 1024
  //   - tools: toolDefinitions
  //   - messages: messages
  // Store the result in a variable called `response`.

  console.log('TODO: Complete Step 3 — send the first request to Claude.');
  return;

  // TODO Step 4: Handle tool_use.
  // Check if response.stop_reason is 'tool_use'.
  // If it is:
  //   1. Loop through response.content to find blocks where type === 'tool_use'
  //   2. For each tool_use block, call executeTool(block.name, block.input)
  //   3. Build a tool_result object for each: { type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) }
  //   4. Print the tool name and result so you can see what happened

  // TODO Step 5: Close the loop.
  // Wrap the request + tool handling in a while loop:
  //   while (response.stop_reason === 'tool_use') {
  //     1. Append Claude's response to messages: { role: 'assistant', content: response.content }
  //     2. Append tool results to messages: { role: 'user', content: toolResults }
  //     3. Send a new request with the updated messages
  //   }

  // Once the loop exits (stop_reason is 'end_turn'), extract and print the final text response.
  // The final text is in the last text block of response.content:
  //   const finalText = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
  //   console.log(`\nAssistant: ${finalText}`);
}

// Run the agent with a test prompt.
// Change this prompt to test different behaviors (see Step 6 in LESSON.md).
const prompt = process.argv[2] || "What's the weather like in Chicago?";
runAgent(prompt).catch(console.error);
