---
globs: infrastructure/**
---

# Infrastructure Rules

- Never hardcode values in resource definitions. Use `variable` blocks for anything that varies by environment (region, instance size, credentials).
- Give resources meaningful names that include the project and environment, e.g., `widgetco-api-prod-db`.
- Add tags to all resources that support them. At minimum include: `project`, `environment`, and `managed_by = "terraform"`.
- Always run `terraform plan` and review the output before running `terraform apply`. Call out any destructive changes (destroy/replace).
- Store sensitive values (database passwords, API keys) in `.tfvars` files that are excluded from version control. Never put secrets directly in `.tf` files.
- Use `locals` blocks to reduce duplication of computed values.
- Pin provider versions to prevent unexpected upgrades.
