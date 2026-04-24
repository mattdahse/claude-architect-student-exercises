/**
 * agent.js — Reference solution for Exercise 1.2: Implementing Your First Agentic Loop.
 *
 * This is one correct implementation. See README.md in this directory for notes
 * on design decisions and reasonable alternatives.
 */

process.removeAllListeners('warning');

require('../../../shared/load-env');
const Anthropic = require('@anthropic-ai/sdk').default;
const { toolDefinitions, executeTool } = require('../starter/tools');

const client = new Anthropic();

async function runAgent(userMessage) {
  console.log(`\nUser: ${userMessage}`);
  console.log('---');

  const messages = [{ role: 'user', content: userMessage }];

  // Step 3: Send the first request to Claude with our tools.
  let response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    tools: toolDefinitions,
    messages: messages,
  });

  console.log(`[Loop] stop_reason: ${response.stop_reason}`);

  // Step 5: The agentic loop.
  // We use `=== 'tool_use'` rather than `!== 'end_turn'` because it's safer:
  // it only continues when Claude explicitly requests a tool call, and exits
  // for all other stop_reason values (end_turn, max_tokens, errors, etc.).
  while (response.stop_reason === 'tool_use') {
    // Step 4: Extract tool_use blocks and execute each tool.
    const toolResults = [];

    for (const block of response.content) {
      if (block.type === 'tool_use') {
        console.log(`[Tool Call] ${block.name}(${JSON.stringify(block.input)})`);

        const result = executeTool(block.name, block.input);
        console.log(`[Tool Result] ${JSON.stringify(result)}`);

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }
    }

    // Append Claude's response and the tool results to the message history.
    // Note: Claude's response is an assistant message, tool results are a user message.
    // This maintains the required role alternation: user → assistant → user → assistant.
    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });

    // Send the updated conversation back to Claude.
    response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      tools: toolDefinitions,
      messages: messages,
    });

    console.log(`[Loop] stop_reason: ${response.stop_reason}`);
  }

  // The loop has exited — Claude returned end_turn (or another non-tool stop_reason).
  // Extract and print the final text response.
  const finalText = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  console.log(`\nAssistant: ${finalText}`);
  return finalText;
}

// Accept a prompt from the command line, or use a default.
const prompt = process.argv[2] || "What's the weather like in Chicago?";
runAgent(prompt).catch(console.error);
