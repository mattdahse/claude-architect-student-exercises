/**
 * schema-improved.js — YOUR improved extraction schema.
 *
 * Apply the patterns from Lesson 4.4 to handle edge cases:
 *
 * TODO Step 4: Design a schema that handles:
 *   1. Missing fields — use nullable types (["string", "null"]) for fields that
 *      may not appear in the document
 *   2. Non-standard categories — add "other" to the damage_category enum and
 *      add a damage_category_detail field for specifics
 *   3. Conflicting values — add fields to capture both original and corrected values
 *   4. Low confidence — add a confidence field (enum: high/medium/low) so the
 *      system can route uncertain extractions to human review
 */

const improvedTool = {
  name: 'extract_claim',
  description: 'Extract structured claim data from an insurance claim form.',
  input_schema: {
    type: 'object',
    properties: {
      // TODO: Define your improved schema here.
      // Use the patterns from Lesson 4.4:
      //   - Nullable fields for missing data
      //   - "other" + detail string for non-standard categories
      //   - Conflict annotation fields
      //   - Confidence field

      placeholder: {
        type: 'string',
        description: 'Replace this with your real schema',
      },
    },
    required: ['placeholder'],
  },
};

module.exports = { tool: improvedTool };
