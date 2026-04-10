# Project A Solution — Design Decisions

## Architecture

The solution implements a standard agentic loop with three additions:
1. **PreToolUse hook** intercepts tool calls before execution
2. **Tool output trimming** reduces context consumption
3. **Case facts block** preserves exact values across turns

## Key Design Choices

### Hook placement (before tool execution, not after)
The hook runs before `executeTool()` — if it blocks, the tool never fires. This prevents side effects from unauthorized actions. On the exam, this maps to the "gated sequence" pattern where a validation gate must pass before the action proceeds.

### Trimming at execution time (not retroactively)
Tool results are trimmed immediately after execution, before entering the messages array. This is more effective than retroactive summarization because the verbose data never enters context in the first place.

### Case facts in the system prompt (not in messages)
The case facts block is placed in the system prompt, which occupies the highest-attention position in the context window. This ensures exact values receive strong attention regardless of conversation length.

### Escalation reason as enum (not free text)
The escalate_to_human tool uses an enum for reason (`customer_request`, `policy_gap`, `unable_to_resolve`). This forces the model to categorize the escalation, making handoffs structured and routable.

## Running the Solution

```bash
cd solution
node agent.js "What's the status of order ORD-001?"
node agent.js "I want to talk to a manager"
node agent.js "Process a refund of 150 dollars for order ORD-003"
```

## Validation

```bash
cd ../validation
node validate.js
```

All 5 scenarios should pass.
