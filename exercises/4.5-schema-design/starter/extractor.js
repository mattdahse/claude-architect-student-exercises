/**
 * extractor.js — Runs extraction with a specified schema against all sample documents.
 *
 * Usage:
 *   node extractor.js basic       # Extract with the basic schema
 *   node extractor.js improved    # Extract with your improved schema
 */

process.removeAllListeners('warning');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk').default;
const { documents } = require('./sample-documents');

const client = new Anthropic();

async function extractDocument(tool, documentText) {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      tools: [tool],
      tool_choice: { type: 'tool', name: tool.name },
      messages: [{
        role: 'user',
        content: `Extract the claim data from this document. If any information is missing, indicate that clearly.\n\n${documentText}`,
      }],
    });

    const toolUseBlock = response.content.find(b => b.type === 'tool_use');
    return { success: true, data: toolUseBlock ? toolUseBlock.input : null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  const schemaName = process.argv[2];
  if (!schemaName || !['basic', 'improved'].includes(schemaName)) {
    console.log('Usage: node extractor.js <basic|improved>');
    return;
  }

  const schemaFile = schemaName === 'basic' ? './schema-basic' : './schema-improved';
  const { tool } = require(schemaFile);

  // Check for placeholder
  if (tool.input_schema.properties.placeholder) {
    console.log('The improved schema still has the placeholder field.');
    console.log('Complete Step 4 in the lesson before testing.');
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Schema Extraction Test: ${schemaName}`);
  console.log(`Documents: ${documents.length}`);
  console.log('='.repeat(60));

  for (const doc of documents) {
    console.log(`\n--- Document ${doc.id}: ${doc.name} ---`);
    console.log(`Challenge: ${doc.challenge}`);

    const result = await extractDocument(tool, doc.text);

    if (result.success) {
      console.log('\nExtracted data:');
      console.log(JSON.stringify(result.data, null, 2));

      // Quality checks
      const data = result.data;
      const checks = [];

      if (doc.id === 2) { // Missing data document
        if (data.date_of_loss === null || data.date_of_loss === undefined) {
          checks.push('✓ Missing date handled (null/absent)');
        } else {
          checks.push('⚠ Date was fabricated — should be null for missing data');
        }
      }

      if (doc.id === 3) { // Non-standard category
        if (data.damage_category === 'other' && data.damage_category_detail) {
          checks.push('✓ Non-standard category handled with "other" + detail');
        } else if (data.damage_category === 'other') {
          checks.push('~ "other" used but no detail string');
        } else {
          checks.push('⚠ Non-standard category force-fit into existing enum');
        }
      }

      if (doc.id === 4) { // Conflicting values
        if (data.claim_amount_original || data.conflicts) {
          checks.push('✓ Conflicting values captured');
        } else {
          checks.push('⚠ Conflicting values — only one amount captured, original lost');
        }
      }

      if (doc.id === 5) { // Minimal document
        if (data.confidence === 'low') {
          checks.push('✓ Low confidence flagged for minimal document');
        } else if (data.confidence) {
          checks.push(`~ Confidence: ${data.confidence} (expected "low" for sparse document)`);
        } else {
          checks.push('⚠ No confidence field — can\'t route to human review');
        }
      }

      if (checks.length > 0) {
        console.log('\nQuality checks:');
        checks.forEach(c => console.log(`  ${c}`));
      }
    } else {
      console.log(`\n✗ Extraction failed: ${result.error}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('Done. Review the quality checks above.');
  if (schemaName === 'basic') {
    console.log('The basic schema likely struggled with documents 2-5.');
    console.log('Design your improved schema to handle these edge cases.');
  }
}

main().catch(console.error);
