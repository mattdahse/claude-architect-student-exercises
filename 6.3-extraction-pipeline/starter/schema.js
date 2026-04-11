// Tool schema for insurance claim extraction
// This defines the structured output format Claude will use

const extractionTool = {
  name: "extract_claim",
  description:
    "Extract structured data from an insurance claim document. " +
    "Use this tool to return the extracted fields in a consistent format. " +
    "If a field cannot be determined from the document, use null for nullable fields.",
  input_schema: {
    type: "object",
    properties: {
      claimant_name: {
        type: "string",
        description: "Full name of the person filing the claim",
      },

      // TODO: Add claim_date field
      // - Should be a string in YYYY-MM-DD format, or null if not found
      // - Use nullable type: { type: ["string", "null"] }
      // - Description should mention the expected format

      // TODO: Add claim_amount field
      // - Should be a number (dollars), or null if not determinable
      // - Use nullable type: { type: ["number", "null"] }
      // - Description should note: extract numeric value even if written in words

      // TODO: Add damage_category field
      // - Should be an enum: ["Fire", "Water", "Wind", "Theft", "Liability", "Other"]
      // - Use "Other" when the category doesn't match standard options

      // TODO: Add damage_category_detail field
      // - A string for additional detail when category is "Other"
      // - Or to capture the original wording from the document

      description: {
        type: "string",
        description: "Brief summary of the damage or loss described in the claim",
      },

      // TODO: Add confidence object field
      // - An object with properties for each extracted field's confidence
      // - Each confidence value should be: "high", "medium", or "low"
      // - Properties: claimant_name, claim_date, claim_amount, damage_category, description
      // - This helps downstream systems decide if human review is needed

      // TODO: Add conflicts array field
      // - An array of objects describing any conflicting information found
      // - Each conflict object should have: field (string), value1 (string), value2 (string), explanation (string)
      // - Example: amount says $7,800 in one place and $8,200 in another
    },
    required: ["claimant_name", "description"],
    // TODO: Update required array to include your new fields
    // Think about which fields should be required vs optional
  },
};

module.exports = { extractionTool };
