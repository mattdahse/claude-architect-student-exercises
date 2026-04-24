/**
 * validate.js — Validation script for Exercise 1.2.
 *
 * Runs the student's agent with three test prompts and checks that:
 *   1. A no-tool prompt returns a text response without calling tools
 *   2. A weather prompt calls get_weather and returns a response
 *   3. A time prompt calls get_time and returns a response
 *
 * Usage:
 *   cd starter/   (or wherever the student's agent.js is)
 *   node ../validation/validate.js
 *
 * The script requires the student's agent.js to export a runAgent function.
 * If the student followed the exercise steps, the function is already there
 * but may not be exported — they'll need to add: module.exports = { runAgent };
 *
 * Alternatively, this script can test the solution directly:
 *   node validate.js --solution
 */

require('../../../shared/load-env');
const path = require('path');

const useSolution = process.argv.includes('--solution');
const agentPath = useSolution
  ? path.resolve(__dirname, '../solution/agent.js')
  : path.resolve(__dirname, '../starter/agent.js');

// We need to capture console.log output to check for tool calls
const originalLog = console.log;
let capturedOutput = [];

function captureStart() {
  capturedOutput = [];
  console.log = (...args) => {
    capturedOutput.push(args.join(' '));
    originalLog(...args);
  };
}

function captureStop() {
  console.log = originalLog;
  return capturedOutput.join('\n');
}

async function runTest(name, prompt, expectations) {
  originalLog(`\n${'='.repeat(60)}`);
  originalLog(`TEST: ${name}`);
  originalLog(`Prompt: "${prompt}"`);
  originalLog('='.repeat(60));

  captureStart();

  try {
    // Dynamic import to get the runAgent function
    // Clear require cache to get fresh state
    delete require.cache[require.resolve(agentPath)];
    const agentModule = require(agentPath);

    if (typeof agentModule.runAgent !== 'function') {
      captureStop();
      originalLog(
        '\n  SKIP: agent.js does not export a runAgent function.'
      );
      originalLog(
        '  Add this line to the bottom of agent.js: module.exports = { runAgent };'
      );
      return 'skip';
    }

    // Override process.argv so the agent doesn't use the default prompt
    const originalArgv = process.argv;
    process.argv = ['node', 'agent.js', prompt];

    const result = await agentModule.runAgent(prompt);

    process.argv = originalArgv;
    const output = captureStop();

    let passed = true;

    // Check for expected tool calls in output
    if (expectations.toolCalls) {
      for (const toolName of expectations.toolCalls) {
        if (!output.includes(`[Tool Call] ${toolName}`)) {
          originalLog(`  FAIL: Expected tool call to ${toolName} but didn't find it in output.`);
          passed = false;
        } else {
          originalLog(`  PASS: Tool ${toolName} was called.`);
        }
      }
    }

    // Check that no tools were called when none expected
    if (expectations.noToolCalls) {
      if (output.includes('[Tool Call]')) {
        originalLog('  FAIL: Expected no tool calls but found tool call in output.');
        passed = false;
      } else {
        originalLog('  PASS: No tool calls made (as expected).');
      }
    }

    // Check that we got a non-empty final response
    if (result && result.trim().length > 0) {
      originalLog(`  PASS: Got a non-empty response (${result.trim().length} chars).`);
    } else {
      originalLog('  FAIL: Response was empty or undefined.');
      passed = false;
    }

    return passed ? 'pass' : 'fail';
  } catch (err) {
    captureStop();
    originalLog(`  ERROR: ${err.message}`);
    return 'error';
  }
}

async function main() {
  originalLog('Validating Exercise 1.2: Implementing Your First Agentic Loop');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'} agent`);

  const results = [];

  results.push(
    await runTest(
      'No-tool prompt',
      'What is 2 plus 2?',
      { noToolCalls: true }
    )
  );

  results.push(
    await runTest(
      'Weather tool prompt',
      "What's the weather in Chicago?",
      { toolCalls: ['get_weather'] }
    )
  );

  results.push(
    await runTest(
      'Time tool prompt',
      'What time is it in Tokyo?',
      { toolCalls: ['get_time'] }
    )
  );

  // Summary
  originalLog(`\n${'='.repeat(60)}`);
  originalLog('SUMMARY');
  originalLog('='.repeat(60));

  const passed = results.filter((r) => r === 'pass').length;
  const failed = results.filter((r) => r === 'fail').length;
  const errors = results.filter((r) => r === 'error').length;
  const skipped = results.filter((r) => r === 'skip').length;

  originalLog(`  Passed: ${passed}`);
  originalLog(`  Failed: ${failed}`);
  originalLog(`  Errors: ${errors}`);
  originalLog(`  Skipped: ${skipped}`);

  if (passed === results.length) {
    originalLog('\nAll tests passed! Your agentic loop is working correctly.');
  } else if (skipped > 0) {
    originalLog('\nSome tests were skipped. Make sure agent.js exports runAgent.');
  } else {
    originalLog('\nSome tests failed. Review the output above and check your implementation.');
  }
}

main().catch(console.error);
