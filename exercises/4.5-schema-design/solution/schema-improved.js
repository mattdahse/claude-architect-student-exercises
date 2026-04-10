/**
 * schema-improved.js — Reference solution with all design patterns applied.
 */

const improvedTool = {
  name: 'extract_claim',
  description: 'Extract structured claim data from an insurance claim form. Handle missing data with null values, non-standard categories with "other" + detail, and conflicting values by capturing both.',
  input_schema: {
    type: 'object',
    properties: {
      claimant_name: {
        type: 'string',
        description: 'Full name of the claimant',
      },
      date_of_loss: {
        type: ['string', 'null'],
        description: 'Date the loss occurred in YYYY-MM-DD format. Null if not specified in the document.',
      },
      claim_amount: {
        type: ['number', 'null'],
        description: 'Current/final claimed amount in dollars. Null if not specified.',
      },
      claim_amount_original: {
        type: ['number', 'null'],
        description: 'If the claim amount was corrected/changed, this is the ORIGINAL amount before correction. Null if no correction was made.',
      },
      damage_category: {
        type: 'string',
        enum: ['fire', 'water', 'wind', 'theft', 'other'],
        description: 'Category of damage. Use "other" if the damage type does not match fire, water, wind, or theft.',
      },
      damage_category_detail: {
        type: ['string', 'null'],
        description: 'When damage_category is "other", specify the actual damage type here (e.g., "earthquake", "vandalism"). Null when a standard category applies.',
      },
      description: {
        type: 'string',
        description: 'Brief description of the claim in 1-3 sentences',
      },
      confidence: {
        type: 'string',
        enum: ['high', 'medium', 'low'],
        description: 'Extraction confidence. "high" when all data is clearly stated. "medium" when some interpretation was needed. "low" when the document is sparse, ambiguous, or partially illegible.',
      },
      conflicts: {
        type: ['array', 'null'],
        items: {
          type: 'object',
          properties: {
            field: { type: 'string', description: 'Which field has conflicting values' },
            values: { type: 'array', items: { type: 'string' }, description: 'The conflicting values found' },
            resolution: { type: 'string', description: 'Which value was chosen and why' },
          },
          required: ['field', 'values', 'resolution'],
        },
        description: 'Array of conflicts found in the document (e.g., crossed-out and rewritten values). Null if no conflicts.',
      },
    },
    required: ['claimant_name', 'damage_category', 'description', 'confidence'],
  },
};

module.exports = { tool: improvedTool };
