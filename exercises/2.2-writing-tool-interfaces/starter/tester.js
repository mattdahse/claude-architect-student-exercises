/**
 * tester.js — Tool selection accuracy tester.
 *
 * Sends test prompts to Claude with a set of tool definitions and checks
 * which tool Claude selects. Reports accuracy by category and overall.
 *
 * Usage:
 *   node tester.js tools-poor.js       # Test with poor descriptions
 *   node tester.js tools-improved.js   # Test with your improved descriptions
 *
 * Requires a .env file with your ANTHROPIC_API_KEY.
 */

process.removeAllListeners('warning');
require('../../../shared/load-env');
const Anthropic = require('@anthropic-ai/sdk').default;
const { testPrompts } = require('./test-prompts');

const client = new Anthropic();

async function testToolSelection(toolsFile) {
  const { toolDefinitions } = require(`./${toolsFile}`);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Tool Selection Accuracy Test`);
  console.log(`Tools file: ${toolsFile}`);
  console.log(`Test prompts: ${testPrompts.length}`);
  console.log('='.repeat(60));

  // Check for TODO descriptions
  const hasTodos = toolDefinitions.some(t => t.description.includes('TODO'));
  if (hasTodos) {
    console.log('\n  WARNING: Some tool descriptions still contain TODO placeholders.');
    console.log('  Complete the descriptions in tools-improved.js before testing.\n');
    return;
  }

  const results = [];
  let correct = 0;
  let wrong = 0;
  let noTool = 0;

  for (let i = 0; i < testPrompts.length; i++) {
    const test = testPrompts[i];
    process.stdout.write(`  [${i + 1}/${testPrompts.length}] "${test.prompt.substring(0, 50)}..." `);

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        system: 'You are a customer support agent. Use the available tools to help answer questions about customers. The customer ID is cust_12345.',
        tools: toolDefinitions,
        messages: [{ role: 'user', content: test.prompt }],
      });

      // Check which tool was selected
      const toolUseBlock = response.content.find(b => b.type === 'tool_use');
      const selectedTool = toolUseBlock ? toolUseBlock.name : null;

      const isCorrect = selectedTool === test.expectedTool;

      if (isCorrect) {
        correct++;
        console.log(`✓ ${selectedTool}`);
      } else if (selectedTool) {
        wrong++;
        console.log(`✗ got ${selectedTool}, expected ${test.expectedTool}`);
      } else {
        noTool++;
        console.log(`✗ no tool called, expected ${test.expectedTool}`);
      }

      results.push({
        prompt: test.prompt,
        expected: test.expectedTool,
        actual: selectedTool,
        correct: isCorrect,
        category: test.category,
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      results.push({
        prompt: test.prompt,
        expected: test.expectedTool,
        actual: 'ERROR',
        correct: false,
        category: test.category,
      });
    }
  }

  // Summary
  const total = testPrompts.length;
  const accuracy = Math.round((correct / total) * 100);

  console.log(`\n${'='.repeat(60)}`);
  console.log('RESULTS');
  console.log('='.repeat(60));
  console.log(`  Correct:  ${correct}/${total} (${accuracy}%)`);
  console.log(`  Wrong:    ${wrong}/${total}`);
  console.log(`  No tool:  ${noTool}/${total}`);

  // Accuracy by category
  const categories = [...new Set(testPrompts.map(t => t.category))];
  console.log('\n  By category:');
  for (const cat of categories) {
    const catResults = results.filter(r => r.category === cat);
    const catCorrect = catResults.filter(r => r.correct).length;
    const catTotal = catResults.length;
    const catPct = Math.round((catCorrect / catTotal) * 100);
    const bar = catPct >= 80 ? '✓' : '✗';
    console.log(`    ${bar} ${cat}: ${catCorrect}/${catTotal} (${catPct}%)`);
  }

  // Misrouted prompts detail
  const misrouted = results.filter(r => !r.correct);
  if (misrouted.length > 0) {
    console.log(`\n  Misrouted prompts (${misrouted.length}):`);
    for (const m of misrouted) {
      console.log(`    "${m.prompt.substring(0, 60)}..."`);
      console.log(`      Expected: ${m.expected}, Got: ${m.actual || 'no tool'}`);
    }
  }

  console.log(`\n  Overall accuracy: ${accuracy}%`);
  if (accuracy >= 90) {
    console.log('  Excellent! Your descriptions are highly effective.');
  } else if (accuracy >= 75) {
    console.log('  Good, but there\'s room for improvement. Check the misrouted prompts above.');
  } else if (accuracy >= 60) {
    console.log('  Moderate accuracy. Review your descriptions against the Lesson 2.1 framework.');
  } else {
    console.log('  Low accuracy. Your descriptions likely have overlapping boundaries.');
  }

  return { accuracy, correct, wrong, noTool, total, results };
}

// Run
const toolsFile = process.argv[2] || 'tools-poor.js';
testToolSelection(toolsFile).catch(console.error);

module.exports = { testToolSelection };
