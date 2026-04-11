# Project B Self-Assessment Checklist

Check each item when complete. Each maps to an exam task statement.

## CLAUDE.md (Task 3.1)
- [ ] File exists at project root
- [ ] Includes project description and tech stack
- [ ] Defines coding conventions (const preference, async/await, JSDoc)
- [ ] Specifies behavioral rules (run tests, no secrets, PR descriptions)
- [ ] Documents the structured error response format

## Path-Scoped Rules (Task 3.2)
- [ ] `.claude/rules/api.md` exists with glob `src/api/**`
- [ ] API rules cover: REST conventions, error format, auth middleware
- [ ] `.claude/rules/tests.md` exists with glob `tests/**`
- [ ] Test rules cover: describe/it structure, mocking, error case testing
- [ ] `.claude/rules/infra.md` exists with glob `infrastructure/**`
- [ ] Infra rules cover: no hardcoded values, meaningful names, plan before apply

## Custom Command (Task 3.3)
- [ ] `.claude/commands/review.md` exists
- [ ] Has a `description` in frontmatter
- [ ] Prompt references both CLAUDE.md conventions and path-specific rules
- [ ] Running `/review` on a file produces meaningful feedback

## Skill (Task 3.3)
- [ ] `.claude/skills/security-scan.md` exists
- [ ] Uses `context: fork` for isolation
- [ ] Uses `allowed-tools` to restrict to read-only tools (Grep, Read, Glob)
- [ ] Prompt covers: hardcoded secrets, SQL injection, missing validation

## MCP Configuration (Task 2.2)
- [ ] `.mcp.json` exists at project root
- [ ] Configures at least one MCP server
- [ ] Uses environment variable expansion (e.g., `$PROJECT_DIR`)
- [ ] Server scope is appropriately limited (not full filesystem access)

## Integration Test
- [ ] Claude Code loads the CLAUDE.md when opened in the project directory
- [ ] Path-scoped rules apply when modifying files in matching directories
- [ ] `/review` command runs and checks against project standards
