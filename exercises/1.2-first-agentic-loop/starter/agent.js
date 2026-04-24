/**
 * agent.js — Your first agentic loop.
 *
 * Follow the steps in LESSON.md to complete this file.
 * Each TODO comment corresponds to one step in the exercise.
 */

// Suppress deprecation warning from a transient SDK dependency (punycode).
// This is a known issue and does not affect functionality.
process.removeAllListeners('warning');

require('../../../shared/load-env');
const Anthropic = require('@anthropic-ai/sdk').default;
const { toolDefinitions, executeTool } = require('./tools');

const client = new Anthropic();

async function runAgent(userMessage) {
  console.log(`\nUser: ${userMessage}`);
  console.log('---');

  // The messages array holds the full conversation history.
  // It starts with the user's initial message.
  const messages = [{ role: 'user', content: userMessage }];

  // TODO Step 3: Send the first request to Claude and print the response.
  //
  // 1. Call client.messages.create() with model, max_tokens, tools, messages.
  //    Store the result in a variable: let response = await client.messages.create(...)
  //
  // 2. Log the stop_reason: console.log(`[Loop] stop_reason: ${response.stop_reason}`)
  //
  // 3. Loop through response.content and print each block:
  //    - If block.type === 'text', print: [Text] followed by the text
  //    - If block.type === 'tool_use', print: [Tool Request] followed by the name and input

  console.log('TODO: Complete Step 3 — send the first request to Claude.');
  return;

  // TODO Step 4: Execute the tool calls.
  //
  // After printing the response, add code to actually execute the tools:
  //   1. Create an empty array: const toolResults = []
  //   2. Loop through response.content again
  //   3. For each tool_use block, call executeTool(block.name, block.input)
  //   4. Log the result: [Tool Result] followed by the JSON
  //   5. Push a tool_result object to the array:
  //      { type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) }

  // TODO Step 5: Close the loop.
  //
  // Wrap the request + response printing + tool execution in a while loop:
  //   while (response.stop_reason === 'tool_use') {
  //     1. Append Claude's response to messages: { role: 'assistant', content: response.content }
  //     2. Append tool results to messages: { role: 'user', content: toolResults }
  //     3. Send a new request with the updated messages
  //     4. Print the new response (same logging as Step 3)
  //   }
  //
  // After the loop exits, extract and print the final text response:
  //   const finalText = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
  //   console.log(`\nAssistant: ${finalText}`);
}

// Run the agent with a test prompt.
// Change this prompt to test different behaviors (see Step 6 in LESSON.md).
const prompt = process.argv[2] || "What's the weather like in Chicago?";
runAgent(prompt).catch(console.error);
