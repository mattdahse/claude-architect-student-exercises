# Solution: Team Configuration Capstone

This directory contains the reference implementation for the team configuration exercise. Below are the design decisions behind each configuration file.

## CLAUDE.md

The project-level CLAUDE.md is structured in sections that move from context to rules to specifics:

- **Project description and tech stack** come first so Claude understands what it is working with before receiving instructions. Listing exact versions (Node.js 20, Express 4.x, Terraform 1.5+) prevents Claude from suggesting incompatible patterns.
- **Coding conventions** are stated as direct rules rather than preferences. "Prefer const over let" is actionable; "try to write clean code" is not. JSDoc requirements ensure Claude generates documentation that the team expects.
- **Behavioral rules** define when to run tests, when to use plan mode, and what never to do (commit secrets). These shape how Claude works, not just what it produces.
- **Response format** with explicit JSON examples gives Claude a concrete template to follow. Showing both success and error cases eliminates ambiguity about the envelope structure.

## Path-Scoped Rules

The rules are split into three files rather than one large document:

- **api.md** (`src/api/**`) -- API routes have specific patterns (Router, middleware, validation) that do not apply to tests or infrastructure. Scoping these rules means they activate only when Claude edits API files, reducing noise when working elsewhere.
- **tests.md** (`tests/**`) -- Test conventions (describe/it structure, mocking, mirrored paths) are distinct from production code rules. Separating them avoids contradictions like "mock external services" appearing when editing actual service code.
- **infra.md** (`infrastructure/**`) -- Terraform has its own language and concerns (variables, tags, plan-before-apply). Isolating these rules prevents them from cluttering the context when Claude is working on JavaScript files.

This separation follows the principle: rules should activate only when they are relevant. It keeps Claude's context focused and reduces the chance of conflicting instructions.

## Custom Command: review.md

The review command gives team members a consistent way to check their code against standards before submitting a PR. It references CLAUDE.md and the path-scoped rules explicitly so the review is grounded in documented standards rather than general opinions. The structured output format (file, line, standard, fix) makes issues easy to act on.

## Skill: security-scan.md

- **context: fork** runs the scan in a separate context. This prevents the potentially large scan output from polluting the main conversation and consuming tokens that the developer needs for their ongoing work.
- **allowed-tools** is restricted to Grep, Read, and Glob. The scan only needs to search and read files. Excluding Bash and Write prevents the skill from accidentally modifying code or running commands. This follows the principle of least privilege.

## MCP Configuration: .mcp.json

The filesystem MCP server is scoped to `src/` and `tests/` only. This prevents Claude from accessing or modifying files outside the application code, such as CI/CD configs, environment files, or the infrastructure directory (which has its own change workflow via Terraform). The `$PROJECT_DIR` variable makes the configuration portable across developer machines and CI environments.
