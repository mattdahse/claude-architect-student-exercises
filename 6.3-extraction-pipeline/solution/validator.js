// Validation rules for extracted insurance claim data
// Checks extraction results for completeness and consistency

const VALID_CATEGORIES = ["Fire", "Water", "Wind", "Theft", "Liability", "Other"];

function validateExtraction(extraction) {
  const errors = [];
  const warnings = [];

  if (!extraction) {
    return {
      valid: false,
      errors: ["Extraction is null or undefined"],
      warnings: [],
    };
  }

  // Rule 1: claimant_name is required and must not be empty
  if (!extraction.claimant_name || extraction.claimant_name.trim() === "") {
    errors.push("claimant_name is required and must not be empty");
  }

  // Rule 2: Validate claim_date format if present
  if (extraction.claim_date !== null && extraction.claim_date !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(extraction.claim_date)) {
      errors.push(
        `claim_date must be in YYYY-MM-DD format, got: "${extraction.claim_date}"`
      );
    }
  }

  // Rule 3: Validate claim_amount is positive if present
  if (extraction.claim_amount !== null && extraction.claim_amount !== undefined) {
    if (typeof extraction.claim_amount !== "number") {
      errors.push(
        `claim_amount must be a number, got: ${typeof extraction.claim_amount}`
      );
    } else if (extraction.claim_amount <= 0) {
      errors.push(
        `claim_amount must be a positive number, got: ${extraction.claim_amount}`
      );
    } else if (extraction.claim_amount > 10_000_000) {
      warnings.push(
        `claim_amount is unusually large: $${extraction.claim_amount.toLocaleString()}`
      );
    }
  }

  // Rule 4: If damage_category is "Other", damage_category_detail must be non-empty
  if (extraction.damage_category === "Other") {
    if (
      !extraction.damage_category_detail ||
      extraction.damage_category_detail.trim() === ""
    ) {
      errors.push(
        'damage_category is "Other" but damage_category_detail is missing or empty. ' +
          "Please provide a description of the damage type."
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = { validateExtraction };
