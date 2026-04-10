/**
 * schema-basic.js — Basic extraction schema (no edge case handling).
 *
 * This schema works for normal documents but fails on:
 * - Missing fields (no nullable types — Claude must guess or error)
 * - Non-standard categories (no "other" option — Claude must force-fit)
 * - Conflicting values (no way to represent both values)
 * - Low confidence (no confidence signal)
 *
 * Provided complete — don't modify this file.
 */

const basicTool = {
  name: 'extract_claim',
  description: 'Extract structured claim data from an insurance claim form.',
  input_schema: {
    type: 'object',
    properties: {
      claimant_name: {
        type: 'string',
        description: 'Full name of the claimant',
      },
      date_of_loss: {
        type: 'string',
        description: 'Date the loss occurred in YYYY-MM-DD format',
      },
      claim_amount: {
        type: 'number',
        description: 'Claimed amount in dollars',
      },
      damage_category: {
        type: 'string',
        enum: ['fire', 'water', 'wind', 'theft'],
        description: 'Category of damage',
      },
      description: {
        type: 'string',
        description: 'Brief description of the claim',
      },
    },
    required: ['claimant_name', 'date_of_loss', 'claim_amount', 'damage_category', 'description'],
  },
};

module.exports = { tool: basicTool };
