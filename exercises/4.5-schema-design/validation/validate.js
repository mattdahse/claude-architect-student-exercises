/**
 * validate.js — Validation for Exercise 4.5.
 */

const path = require('path');
const useSolution = process.argv.includes('--solution');
const schemaPath = useSolution
  ? path.resolve(__dirname, '../solution/schema-improved.js')
  : path.resolve(__dirname, '../starter/schema-improved.js');

const originalLog = console.log;

async function main() {
  originalLog('Validating Exercise 4.5: Schema Design Patterns');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'}\n`);

  delete require.cache[require.resolve(schemaPath)];
  const { tool } = require(schemaPath);
  const schema = tool.input_schema;

  if (schema.properties.placeholder) {
    originalLog('SKIP: schema-improved.js still has placeholder field.');
    return;
  }

  const checks = [];

  // Check nullable fields
  const hasNullable = Object.values(schema.properties).some(p => Array.isArray(p.type) && p.type.includes('null'));
  checks.push({ name: 'Has nullable fields', pass: hasNullable });

  // Check "other" in enum
  const hasCategoryEnum = schema.properties.damage_category?.enum;
  const hasOther = hasCategoryEnum && hasCategoryEnum.includes('other');
  checks.push({ name: 'damage_category enum includes "other"', pass: hasOther });

  // Check detail string
  const hasDetail = !!schema.properties.damage_category_detail;
  checks.push({ name: 'Has damage_category_detail field', pass: hasDetail });

  // Check confidence field
  const hasConfidence = !!schema.properties.confidence;
  checks.push({ name: 'Has confidence field', pass: hasConfidence });

  // Check conflict handling
  const hasConflicts = !!schema.properties.conflicts || !!schema.properties.claim_amount_original;
  checks.push({ name: 'Has conflict annotation field(s)', pass: hasConflicts });

  originalLog('Schema Quality Checks:');
  checks.forEach(c => originalLog(`  ${c.pass ? '✓' : '✗'} ${c.name}`));

  const passed = checks.filter(c => c.pass).length;
  originalLog(`\n${passed}/${checks.length} checks passed.`);
  if (passed === checks.length) {
    originalLog('Schema design looks good! Run "node extractor.js improved" to test against documents.');
  }
}

main().catch(console.error);
