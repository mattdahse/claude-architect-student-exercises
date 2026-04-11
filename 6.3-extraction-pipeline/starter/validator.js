// Validation rules for extracted insurance claim data
// Checks extraction results for completeness and consistency

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

  // TODO: Rule 2 - Validate claim_date format
  // If claim_date is provided (not null), it should match YYYY-MM-DD format
  // Use a regex like /^\d{4}-\d{2}-\d{2}$/
  // Push to errors if the format is invalid

  // TODO: Rule 3 - Validate claim_amount range
  // If claim_amount is provided (not null), it should be a positive number
  // Also check for unreasonably large values (e.g., > 10,000,000)
  // Push to errors for negative values, warnings for very large values

  // TODO: Rule 4 - Validate damage_category is a known enum value
  // Valid categories: ["Fire", "Water", "Wind", "Theft", "Liability", "Other"]
  // Push to errors if category is not in the list

  // TODO (optional): Rule 5 - Check for conflicts
  // If the extraction has a conflicts array with entries, add a warning
  // for each conflict found

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = { validateExtraction };
