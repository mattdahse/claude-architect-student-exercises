/**
 * tester.js — Classification consistency tester.
 *
 * Runs each test message through the classifier 3 times and measures
 * how consistently it classifies. Reports consistency by difficulty level.
 *
 * Usage:
 *   node tester.js baseline    # Test without examples
 *   node tester.js few-shot    # Test with your examples
 */

process.removeAllListeners('warning');

const { testMessages } = require('./test-messages');

async function runConsistencyTest(classifierName) {
  let classifyMessage;
  if (classifierName === 'baseline') {
    classifyMessage = require('./classifier-baseline').classifyMessage;
  } else if (classifierName === 'few-shot') {
    classifyMessage = require('./classifier-few-shot').classifyMessage;
  } else {
    console.log('Usage: node tester.js <baseline|few-shot>');
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Classification Consistency Test: ${classifierName}`);
  console.log(`Messages: ${testMessages.length} | Runs per message: 3`);
  console.log('='.repeat(60));

  const RUNS = 3;
  const results = [];

  for (const msg of testMessages) {
    process.stdout.write(`\n  [${msg.id}/${testMessages.length}] "${msg.text.substring(0, 50)}..." `);

    const classifications = [];
    for (let run = 0; run < RUNS; run++) {
      try {
        const result = await classifyMessage(msg.text);
        classifications.push(result.category);
        await new Promise(r => setTimeout(r, 200)); // Rate limit pause
      } catch (err) {
        classifications.push('error');
      }
    }

    // Check consistency: do all runs agree?
    const allSame = classifications.every(c => c === classifications[0]);
    const matchesExpected = classifications[0] === msg.expectedCategory;

    const status = allSame
      ? (matchesExpected ? '✓ consistent + correct' : '~ consistent but wrong')
      : '✗ inconsistent';

    console.log(`${status}`);
    console.log(`    Runs: [${classifications.join(', ')}] Expected: ${msg.expectedCategory}`);

    results.push({
      id: msg.id,
      text: msg.text,
      difficulty: msg.difficulty,
      expected: msg.expectedCategory,
      classifications,
      consistent: allSame,
      correct: allSame && matchesExpected,
    });
  }

  // Summary by difficulty
  console.log(`\n${'='.repeat(60)}`);
  console.log('CONSISTENCY SUMMARY');
  console.log('='.repeat(60));

  for (const difficulty of ['clear', 'ambiguous', 'boundary']) {
    const group = results.filter(r => r.difficulty === difficulty);
    const consistent = group.filter(r => r.consistent).length;
    const correct = group.filter(r => r.correct).length;
    const total = group.length;
    const consistencyPct = Math.round((consistent / total) * 100);
    const correctPct = Math.round((correct / total) * 100);
    const icon = consistencyPct >= 80 ? '✓' : '✗';
    console.log(`  ${icon} ${difficulty}: ${consistent}/${total} consistent (${consistencyPct}%), ${correct}/${total} correct (${correctPct}%)`);
  }

  const totalConsistent = results.filter(r => r.consistent).length;
  const totalCorrect = results.filter(r => r.correct).length;
  const totalPct = Math.round((totalConsistent / results.length) * 100);
  console.log(`\n  Overall: ${totalConsistent}/${results.length} consistent (${totalPct}%)`);
  console.log(`  Correct: ${totalCorrect}/${results.length}`);

  if (totalPct >= 85) {
    console.log('\n  Excellent consistency! Your few-shot examples are working.');
  } else if (totalPct >= 70) {
    console.log('\n  Good but room for improvement. Check the inconsistent messages and add targeted boundary examples.');
  } else {
    console.log('\n  Low consistency. Review your examples — are they diverse enough? Do they cover the boundary cases?');
  }

  return { results, totalConsistent, totalCorrect, totalPct };
}

const mode = process.argv[2] || 'baseline';
runConsistencyTest(mode).catch(console.error);

module.exports = { runConsistencyTest };
