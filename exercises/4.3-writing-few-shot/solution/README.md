# Solution: Exercise 4.3 — Writing Few-Shot Examples

## Example Selection Rationale

**Normal cases (2):**
- Billing example (subscription charge) — clear billing category
- Technical example (export timing out) — clear technical category

**Edge case (1):**
- Single word "ok" — demonstrates handling of minimal/non-actionable input → general with low confidence

**Boundary cases (2):**
- "Checkout page loads slowly" — at the boundary between billing (checkout/payment) and technical (performance). Classified as technical because the root issue is page performance, not a billing error.
- "Expected more given the price" — at the boundary between billing (price complaint) and feedback (product dissatisfaction). Classified as feedback because the core message is dissatisfaction with the product, not a billing dispute.

## Why These Examples Work

The two boundary examples establish the specific decision rules:
1. Performance issues on payment-related pages → technical (fix the performance, don't route to billing)
2. Price-related dissatisfaction → feedback (it's a product opinion, not a charge dispute)

These rules resolve the most common source of inconsistency in the test set.
