# Capstone Project B: Claude Code Team Configuration

Configure Claude Code for a multi-developer Node.js repository with layered rules, custom commands, a skill, and MCP server integration.

## Setup

```bash
cd sample-project
```

No `npm install` needed — this project is about Claude Code configuration, not running code.

## What You'll Create

| File | Purpose | Exam Task |
|------|---------|-----------|
| `CLAUDE.md` | Project-level conventions | 3.1 |
| `.claude/rules/api.md` | API-specific coding rules | 3.2 |
| `.claude/rules/tests.md` | Test-specific rules | 3.2 |
| `.claude/rules/infra.md` | Infrastructure rules | 3.2 |
| `.claude/commands/review.md` | Custom /review command | 3.3 |
| `.claude/skills/security-scan.md` | Security scan with context: fork | 3.3 |
| `.mcp.json` | MCP server configuration | 2.2 |

## Testing Your Configuration

Open Claude Code in the `sample-project/` directory and try:

```bash
# Should follow CLAUDE.md conventions
"Add a PATCH endpoint to the users API"

# Should apply test-specific rules
"Create a test for the orders API"

# Should use the custom command
"/review src/api/users.js"
```

## Self-Assessment

Use `checklist.md` to verify all deliverables are complete.
