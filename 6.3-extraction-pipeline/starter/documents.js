// Insurance claim documents for extraction pipeline
// Each document presents a different extraction challenge

const documents = [
  {
    id: 1,
    name: "Standard Claim Form",
    challenge: "Normal - all fields present and clearly formatted",
    text: `INSURANCE CLAIM FORM
=====================================
Claimant: Sarah Johnson
Policy Number: HO-2024-78432
Date of Loss: March 15, 2025
Claim Amount: $12,450.00
Damage Category: Fire

Description of Loss:
On the evening of March 15, 2025, a kitchen fire broke out due to a faulty
electrical outlet behind the refrigerator. The fire caused significant damage
to the kitchen cabinets, countertops, and appliances before being extinguished
by the local fire department. No injuries were reported. The claimant is
requesting coverage for kitchen repairs and appliance replacement.

Claimant Signature: Sarah Johnson
Date Filed: March 18, 2025`
  },
  {
    id: 2,
    name: "Missing Data Claim",
    challenge: "Missing fields - no date of loss and no claim amount provided",
    text: `INSURANCE CLAIM FORM
=====================================
Claimant: Michael Chen
Policy Number: HO-2023-55190
Date of Loss: [NOT PROVIDED]
Claim Amount: [PENDING ASSESSMENT]
Damage Category: Water

Description of Loss:
A severe rainstorm caused water to seep through the basement walls of the
insured property. The water damage affected the finished basement including
carpet, drywall, and stored personal belongings. The claimant discovered the
damage upon returning from a business trip. An adjuster has been requested
to assess the full extent of damages.

Claimant Signature: Michael Chen
Date Filed: April 2, 2025`
  },
  {
    id: 3,
    name: "Non-Standard Category",
    challenge: "Damage category does not match standard enum values",
    text: `INSURANCE CLAIM FORM
=====================================
Claimant: Lisa Park
Policy Number: HO-2024-33210
Date of Loss: June 3, 2025
Claim Amount: $3,200.00
Damage Category: Mold / Biological Growth

Description of Loss:
The claimant discovered extensive mold damage in the upstairs bathroom and
adjacent bedroom. The mold appears to have resulted from a slow, undetected
leak in the bathroom plumbing over several months. Remediation of the mold
and repair of the underlying plumbing issue is required. An environmental
assessment has confirmed the presence of toxic black mold requiring
professional remediation.

Claimant Signature: Lisa Park
Date Filed: June 10, 2025`
  },
  {
    id: 4,
    name: "Conflicting Values",
    challenge: "Description and summary line show different claim amounts",
    text: `INSURANCE CLAIM FORM
=====================================
Claimant: Robert Kim
Policy Number: HO-2025-12098
Date of Loss: January 20, 2025
Claim Amount: $7,800.00
Damage Category: Wind

Description of Loss:
During the severe windstorm on January 20, 2025, multiple trees on the
property were uprooted. One large oak tree fell onto the garage roof,
causing structural damage to the roof and one exterior wall. The falling
debris also damaged the claimant's vehicle parked in the driveway. Initial
contractor estimates place the total damage at approximately $8,200
including both structural repairs and vehicle damage. The claimant is
requesting full coverage under the homeowner's policy.

Adjuster Notes: Preliminary estimate reviewed. Vehicle damage to be filed
under separate auto policy.

Claimant Signature: Robert Kim
Date Filed: January 25, 2025`
  },
  {
    id: 5,
    name: "Handwritten / Informal Style",
    challenge: "Abbreviated, informal text with vague values",
    text: `name: T. Williams
date: sometime in feb
amt: maybe 5k?
cat: water i think

desc: pipe broke under the sink, flooded the whole kitchen real bad.
water got into the living room too. had to rip up all the floors.
landlord said i need to file this myself. not sure what else to put here.
my number is 555-0147 if you need more info.`
  },
  {
    id: 6,
    name: "Multi-Issue Claim",
    challenge: "Two separate incidents with individual costs in one claim",
    text: `INSURANCE CLAIM FORM
=====================================
Claimant: Angela Torres
Policy Number: HO-2024-90215
Date of Loss: April 8, 2025
Total Claim Amount: $7,300.00
Damage Category: Multiple

Description of Loss:
The claimant is reporting two separate incidents that occurred on the same date.

INCIDENT 1 - Garage Fire:
A small electrical fire started in the detached garage, damaging tools,
storage items, and part of the garage structure. Estimated damage: $4,500.00.

INCIDENT 2 - Basement Flooding:
Heavy rain on the same date caused the sump pump to fail, resulting in
approximately 3 inches of standing water in the basement. Damage to flooring,
drywall, and stored items. Estimated damage: $2,800.00.

The claimant requests that both incidents be covered under a single claim
as they occurred on the same date.

Claimant Signature: Angela Torres
Date Filed: April 15, 2025`
  },
  {
    id: 7,
    name: "Ambiguous Amount",
    challenge: "Claim amount written in words instead of digits",
    text: `INSURANCE CLAIM FORM
=====================================
Claimant: David O'Brien
Policy Number: HO-2025-44781
Date of Loss: May 22, 2025
Claim Amount: twelve thousand dollars
Damage Category: Theft

Description of Loss:
On the evening of May 22, 2025, the insured property was burglarized while
the claimant was away on vacation. The intruders gained entry through a
rear window and stole multiple items including electronics, jewelry, and
collectibles. A police report (Case #2025-BPD-08834) has been filed.
The claimant has provided receipts and appraisals for the stolen items
totaling twelve thousand dollars.

Claimant Signature: David O'Brien
Date Filed: May 28, 2025`
  },
  {
    id: 8,
    name: "Alternative Form Layout",
    challenge: "Different field labels than standard form",
    text: `PROPERTY DAMAGE REPORT
*************************************
Filed By: Maria Santos
Reference #: PD-2025-007
Incident Date: July 1, 2025
Estimated Damages: $6,750.00
Type of Incident: Fire

Narrative:
A grease fire ignited on the kitchen stove on the evening of July 1, 2025.
The fire spread to the overhead cabinets and exhaust hood before being
contained. Damage includes the stovetop, upper cabinetry, exhaust system,
and smoke damage to the ceiling and adjacent dining area. The kitchen is
currently unusable and temporary meal accommodations are being requested.

Submitted By: Maria Santos
Submission Date: July 5, 2025`
  }
];

module.exports = { documents };
