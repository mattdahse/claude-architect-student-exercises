// Tool schema for insurance claim extraction
// Complete schema with confidence scores and conflict detection

const { documents } = require("../starter/documents");

const extractionTool = {
  name: "extract_claim",
  description:
    "Extract structured data from an insurance claim document. " +
    "Use this tool to return the extracted fields in a consistent format. " +
    "If a field cannot be determined from the document, use null for nullable fields. " +
    "Always provide confidence scores for each extracted field and note any " +
    "conflicting information found in the document.",
  input_schema: {
    type: "object",
    properties: {
      claimant_name: {
        type: "string",
        description: "Full name of the person filing the claim",
      },
      claim_date: {
        type: ["string", "null"],
        description:
          "Date of the loss/incident in YYYY-MM-DD format, or null if not determinable from the document",
      },
      claim_amount: {
        type: ["number", "null"],
        description:
          "Total claim amount in dollars as a numeric value, or null if not determinable. " +
          "Extract the numeric value even if the amount is written in words (e.g., 'twelve thousand' = 12000)",
      },
      damage_category: {
        type: "string",
        enum: ["Fire", "Water", "Wind", "Theft", "Liability", "Other"],
        description:
          "Primary category of damage. Use 'Other' when the damage type does not clearly match " +
          "Fire, Water, Wind, Theft, or Liability. For multi-incident claims, use the primary category.",
      },
      damage_category_detail: {
        type: ["string", "null"],
        description:
          "Additional detail about the damage category, especially when category is 'Other'. " +
          "Capture the original wording from the document that describes the damage type.",
      },
      description: {
        type: "string",
        description: "Brief summary of the damage or loss described in the claim",
      },
      confidence: {
        type: "object",
        description:
          "Confidence score (0.0 to 1.0) for each extracted field. " +
          "Use 1.0 when the value is explicitly and clearly stated, " +
          "0.7-0.9 when inferred with reasonable certainty, " +
          "and below 0.7 when the value is uncertain or ambiguous.",
        properties: {
          claimant_name: {
            type: "number",
            description: "Confidence in the extracted claimant name (0.0 to 1.0)",
          },
          claim_date: {
            type: "number",
            description: "Confidence in the extracted claim date (0.0 to 1.0)",
          },
          claim_amount: {
            type: "number",
            description: "Confidence in the extracted claim amount (0.0 to 1.0)",
          },
          damage_category: {
            type: "number",
            description: "Confidence in the assigned damage category (0.0 to 1.0)",
          },
        },
        required: ["claimant_name", "claim_date", "claim_amount", "damage_category"],
      },
      conflicts: {
        type: "array",
        description:
          "Array of conflicting information found in the document. " +
          "Include an entry whenever two parts of the document provide different values for the same field.",
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              description: "The field name where the conflict exists",
            },
            value_a: {
              type: "string",
              description: "First value found in the document",
            },
            value_b: {
              type: "string",
              description: "Second (conflicting) value found in the document",
            },
            source_a: {
              type: "string",
              description: "Where in the document value_a was found",
            },
            source_b: {
              type: "string",
              description: "Where in the document value_b was found",
            },
          },
          required: ["field", "value_a", "value_b", "source_a", "source_b"],
        },
      },
    },
    required: [
      "claimant_name",
      "description",
      "damage_category",
      "confidence",
      "conflicts",
    ],
  },
};

module.exports = { extractionTool, documents };
