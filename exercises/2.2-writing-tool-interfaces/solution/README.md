# Solution: Exercise 2.2 — Writing Effective Tool Interfaces

## Design Decisions

**Description structure:** Each description follows a consistent three-sentence pattern:
1. First sentence: what the tool retrieves (specific fields)
2. Second sentence: when to use it (what questions trigger it)
3. Third sentence: boundaries (what it does NOT return, with pointers to the correct tool)

**Cross-references in boundaries:** Each tool's "does not include" section names the other three tools explicitly. This gives Claude a clear routing guide: "if the user asks about billing, I should NOT use get_customer — I should use get_account."

**Parameter descriptions:** The input_schema descriptions also include format hints (e.g., "format: cust_XXXXX") which helps Claude construct correct inputs, though this doesn't directly affect tool selection.

## Expected Accuracy

With these descriptions, accuracy should be 90%+ on the standard test prompts. Some edge cases may still cause misrouting — for example, a question like "Can you look up this person's contact information?" is slightly ambiguous (does "contact information" mean profile data or account data?). The description's explicit listing of "email address, phone number" under get_customer helps resolve this.

## Reasonable Alternatives

- You could consolidate get_customer and get_account into a single tool with a `scope` parameter (profile vs billing). This reduces the tool count from 4 to 3 and eliminates one source of confusion.
- You could add more specific "when to use" examples, like: "Use when the user asks: 'What's their email?', 'What language do they prefer?', 'Do they have notifications on?'"
- The descriptions could be even longer — Anthropic recommends 3-4 sentences minimum, and these are at exactly 3 sentences. Adding a fourth sentence with example questions might help for edge cases.
