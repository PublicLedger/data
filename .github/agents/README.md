# Custom AI Agents

This directory contains specialized AI agents for the Public Ledger data API project.

## What Are Custom Agents?

Custom agents are domain-specific AI assistants that provide focused expertise for particular areas of the codebase. They have specialized knowledge, constraints, and workflows tailored to their domain.

## Available Agents

### Public Ledger Data Pipeline

**Invoke with:** `@publicledger`

**Domain:** Election data ingestion, processing, warehousing, and API development

**Use for:**
- Scraping Pennsylvania election data
- Processing Lancaster County results
- Building SvelteKit API endpoints for election data
- Data quality validation and testing
- Jupyter notebook organization and cleanup
- pandas data manipulation

**See:** [data-journalism.agent.md](data-journalism.agent.md)

## How to Use

### In VS Code Copilot Chat

```
@publicledger Scrape the 2024 primary results for Lancaster County
```

### General Invocation Pattern

1. Mention the agent by name in your request
2. Describe the specific data task (scrape, clean, analyze, or serve)
3. The agent will apply domain-specific knowledge and constraints

## Development Principles

Before working with any agent, review the **Development Principles** section in the root [AGENTS.md](../../AGENTS.md#development-principles-ai-agent-guidance) to avoid common pitfalls:

- Test isolation
- Validation consistency
- Configuration completeness
- Documentation-first actions
- Environment auditing
- And more...

These principles apply across all agents and help prevent wasted time on repeated mistakes.

## Creating New Agents

Custom agents use the `.agent.md` format with YAML frontmatter:

```markdown
---
description: "Brief description for agent selection"
tools: [read, edit, search, execute, todo]
name: "Agent Display Name"
argument-hint: "What to include in request"
---

Agent instructions and constraints...
```

See existing agents for examples.

## Related Resources

- [AGENTS.md](../../AGENTS.md) — Project conventions and development principles
- [Skills directory](../skills/) — Reusable AI workflows
- [Copilot documentation](https://docs.github.com/en/copilot) — General Copilot usage
