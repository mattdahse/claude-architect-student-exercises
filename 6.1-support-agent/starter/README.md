# Capstone Project A: Multi-Tool Customer Support Agent

Build a complete customer support agent with an agentic loop, structured error handling, a business rule hook, escalation logic, and context management.

## Setup

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Project Structure

| File | Status | Purpose |
|------|--------|---------|
| `agent.js` | **You build this** | Main agentic loop |
| `tools.js` | Complete | Tool definitions and handlers |
| `mock-data.js` | Complete | Test data (customers, orders, shipping) |
| `hooks.js` | **You build this** | PreToolUse refund threshold hook |
| `escalation.js` | **You build this** | Escalation context handoff |

## Running

```bash
# Basic query
node agent.js "What's the status of order ORD-001?"

# Test error handling
node agent.js "Look up order ORD-999"

# Test hook enforcement
node agent.js "Process a refund of 150 dollars for order ORD-003"

# Test escalation
node agent.js "I want to talk to a manager"
```

## Validation

```bash
node ../validation/validate.js
```

All 5 scenarios should pass when your implementation is complete.

## Domains Covered

- **Domain 1:** Agentic loop, stop_reason handling, programmatic hooks
- **Domain 2:** Tool interfaces, structured error responses
- **Domain 5:** Context management, escalation patterns, error propagation
