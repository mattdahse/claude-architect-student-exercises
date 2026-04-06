# Solution: Exercise 1.2 — Implementing Your First Agentic Loop

## Design Decisions

**Loop condition: `=== 'tool_use'` vs `!== 'end_turn'`**

This solution uses `while (response.stop_reason === 'tool_use')` because it's the safer pattern. It only continues the loop when Claude explicitly requests a tool call, and exits for *any* other stop_reason — including `max_tokens` (truncated response), `stop_sequence`, or error conditions. The alternative (`!== 'end_turn'`) would cause an infinite loop if Claude hit the token limit, because `max_tokens` is neither `end_turn` nor `tool_use`.

**Tool results as a single user message**

All tool results from a single response are collected into one array and sent as a single user message. This is required by the API's role alternation rule — you can't insert multiple consecutive user messages.

**`let` for response**

The `response` variable uses `let` instead of `const` because it's reassigned on each loop iteration. This is one of the few cases where `let` is appropriate in this course's code style.

## Reasonable Alternatives

- You could extract the API call parameters into a config object and reuse it across iterations. This reduces duplication but adds a layer of indirection that may obscure the mechanics for a first exercise.
- You could wrap the entire loop in a class with methods like `sendRequest()`, `executeTools()`, and `appendToHistory()`. This is a better pattern for production code and is explored in later lessons (Module 1, Lesson 5+).
- You could handle `max_tokens` explicitly by checking for it after the loop exits and logging a warning. The solution keeps things simple since `max_tokens` handling is covered in Lesson 1.3.
