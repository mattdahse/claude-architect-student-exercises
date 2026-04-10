/**
 * test-messages.js — 15 customer messages for classification consistency testing.
 *
 * Categories: billing, technical, account, feedback, general
 *
 * Each message has a difficulty level:
 * - clear: unambiguous, any classifier should get this right
 * - ambiguous: could reasonably be classified multiple ways
 * - boundary: at the exact boundary between two categories
 *
 * The expectedCategory represents YOUR preferred classification for ambiguous cases.
 * Provided complete — don't modify this file.
 */

const testMessages = [
  // --- CLEAR messages (should be consistent without examples) ---
  {
    id: 1,
    text: "I was charged twice for my subscription this month.",
    expectedCategory: "billing",
    difficulty: "clear",
  },
  {
    id: 2,
    text: "The app crashes every time I try to upload a photo.",
    expectedCategory: "technical",
    difficulty: "clear",
  },
  {
    id: 3,
    text: "How do I change the email address on my account?",
    expectedCategory: "account",
    difficulty: "clear",
  },
  {
    id: 4,
    text: "Your new search feature is amazing! Great work!",
    expectedCategory: "feedback",
    difficulty: "clear",
  },
  {
    id: 5,
    text: "What are your business hours?",
    expectedCategory: "general",
    difficulty: "clear",
  },

  // --- AMBIGUOUS messages (may vary without examples) ---
  {
    id: 6,
    text: "The payment page is loading really slowly.",
    expectedCategory: "technical",
    difficulty: "ambiguous",
    note: "Could be billing (payment-related) or technical (performance issue). We classify performance issues as technical.",
  },
  {
    id: 7,
    text: "I've been waiting two weeks for a response to my last message.",
    expectedCategory: "general",
    difficulty: "ambiguous",
    note: "Could be feedback (complaint) or general (follow-up inquiry). We classify follow-up status requests as general.",
  },
  {
    id: 8,
    text: "Can someone explain the pricing for the enterprise tier?",
    expectedCategory: "billing",
    difficulty: "ambiguous",
    note: "Could be general (information request) or billing (pricing inquiry). We classify pricing questions as billing.",
  },
  {
    id: 9,
    text: "My colleague can't access the shared dashboard I set up.",
    expectedCategory: "account",
    difficulty: "ambiguous",
    note: "Could be technical (feature not working) or account (permissions/access). We classify access issues as account.",
  },
  {
    id: 10,
    text: "The product is okay but it's missing some features our team needs.",
    expectedCategory: "feedback",
    difficulty: "ambiguous",
    note: "Could be feedback (feature request) or general (vague comment). We classify feature-related comments as feedback.",
  },

  // --- BOUNDARY messages (at the exact line between categories) ---
  {
    id: 11,
    text: "Thanks for getting back to me finally.",
    expectedCategory: "feedback",
    difficulty: "boundary",
    note: "Polite phrasing masks frustration with response time. Could be general (acknowledgment) or feedback (implicit complaint). We classify implicit complaints as feedback.",
  },
  {
    id: 12,
    text: "I need to update our billing contact but the settings page won't load.",
    expectedCategory: "technical",
    difficulty: "boundary",
    note: "Two issues: billing contact update (account) + page not loading (technical). When a technical issue blocks an account action, we classify as technical — fix the blocker first.",
  },
  {
    id: 13,
    text: "Is there a discount if we switch to annual billing?",
    expectedCategory: "billing",
    difficulty: "boundary",
    note: "Could be general (information request) or billing (pricing/plan change). We classify all pricing and plan inquiries as billing.",
  },
  {
    id: 14,
    text: "Fine.",
    expectedCategory: "general",
    difficulty: "boundary",
    note: "Minimal response with no actionable content. Could be feedback (passive-aggressive) or general (acknowledgment). We classify non-actionable single-word responses as general.",
  },
  {
    id: 15,
    text: "We're considering switching to a competitor unless things improve.",
    expectedCategory: "feedback",
    difficulty: "boundary",
    note: "Could be feedback (churn risk signal) or general (vague threat). We classify churn risk signals as feedback for escalation.",
  },
];

module.exports = { testMessages };
