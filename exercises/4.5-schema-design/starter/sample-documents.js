/**
 * sample-documents.js — 5 insurance claim documents for schema testing.
 *
 * Each document tests a different schema design challenge:
 * 1. Normal — all fields present, standard category
 * 2. Missing data — some fields absent from the document
 * 3. Non-standard category — damage type not in the standard enum
 * 4. Conflicting values — total crossed out and rewritten
 * 5. Minimal — very short document with sparse information
 *
 * Provided complete — don't modify this file.
 */

const documents = [
  {
    id: 1,
    name: 'Normal claim — all data present',
    challenge: 'Straightforward extraction. All fields are clearly stated.',
    text: `INSURANCE CLAIM FORM
Claimant: Sarah Johnson
Date of Loss: March 15, 2025
Claim Amount: $12,450.00
Damage Category: Fire
Description: Kitchen fire caused by electrical fault in dishwasher.
Smoke damage to adjacent living room. Fire department responded
within 10 minutes. No injuries reported.`,
  },
  {
    id: 2,
    name: 'Missing data — no date or amount',
    challenge: 'Date and amount are not specified. Schema must handle missing fields gracefully.',
    text: `INSURANCE CLAIM FORM
Claimant: Michael Chen
Damage Category: Water
Description: Pipe burst in basement during cold snap. Approximately
3 inches of standing water. Damage to stored furniture and drywall.
Plumber called but could not arrive for 6 hours.`,
  },
  {
    id: 3,
    name: 'Non-standard category — earthquake',
    challenge: 'Damage type "earthquake" is not in the standard enum (fire, water, wind, theft). Schema must handle unlisted categories.',
    text: `INSURANCE CLAIM FORM
Claimant: Maria Rodriguez
Date of Loss: January 8, 2025
Claim Amount: $45,000.00
Damage Category: Earthquake
Description: Foundation cracked in multiple locations following 5.2
magnitude earthquake. Chimney separated from main structure. Interior
walls show significant cracking. Structural engineer assessment pending.`,
  },
  {
    id: 4,
    name: 'Conflicting values — corrected amount',
    challenge: 'The claim amount has been corrected: original value crossed out and new value written. Schema should capture both values.',
    text: `INSURANCE CLAIM FORM
Claimant: David Park
Date of Loss: February 22, 2025
Claim Amount: $8,200.00 [CORRECTED - originally stated $12,800.00]
Damage Category: Theft
Description: Break-in occurred while family was on vacation. Electronics
and jewelry stolen from master bedroom. Deadbolt lock was forced. Police
report filed (Case #2025-0847). Updated amount reflects items recovered
by police.`,
  },
  {
    id: 5,
    name: 'Minimal document — sparse information',
    challenge: 'Very little information provided. Many fields will be missing or uncertain.',
    text: `CLAIM
Name: J. Williams
Water damage in garage.`,
  },
];

module.exports = { documents };
