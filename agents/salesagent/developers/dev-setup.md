---
layout: page_v2
title: Prebid Sales Agent - Developers - Development Environment Setup
description: How to set up the Prebid Sales Agent for local development including prerequisites, testing, hooks, and IDE configuration
sidebarType: 10
---

# Development Environment Setup
{: .no_toc}

This guide walks you through setting up a local development environment for the Prebid Sales Agent. It covers prerequisites, project setup, testing, pre-commit hooks, IDE configuration, and common development commands.

- TOC
{:toc}

## Prerequisites

Before you begin, install the following tools:

{: .table .table-bordered .table-striped }
| Requirement | Minimum Version | Installation | Notes |
|-------------|----------------|--------------|-------|
| **Python** | 3.12+ | [python.org](https://www.python.org/downloads/) or `brew install python@3.12` | Required for running the application |
| **uv** | Latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | Fast Python package manager (replaces pip/venv) |
| **Docker** | 20.10+ | [Install Docker](https://docs.docker.com/get-docker/) | Required for PostgreSQL and E2E tests |
| **Docker Compose** | 2.0+ | Included with Docker Desktop | Orchestrates multi-container environments |
| **PostgreSQL** | 16+ | Via Docker (recommended) | Primary data store; no local install needed |

{: .alert.alert-info :}
PostgreSQL runs inside Docker, so you do not need to install it locally. The `docker compose` configuration handles database provisioning, migration, and port mapping automatically.

## Clone and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
```

### Step 2: Configure Environment Variables

```bash
cp .env.template .env
```

Edit `.env` to set any required values. The template includes sensible defaults for local development. Key variables:

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://salesagent:salesagent@localhost:5432/salesagent` | PostgreSQL connection string |
| `ENCRYPTION_KEY` | (generated) | Fernet key for encrypting sensitive data |
| `ADCP_AUTH_TEST_MODE` | `true` | Enables test credentials for development |
| `CREATE_DEMO_TENANT` | `true` | Creates demo tenant with sample data on startup |
| `ENVIRONMENT` | `development` | Controls logging level and debug features |

### Step 3: Install Python Dependencies

```bash
uv sync
```

This creates a virtual environment and installs all dependencies from `pyproject.toml`, including dev dependencies.

### Step 4: Start Infrastructure

```bash
docker compose build
docker compose up -d
```

This starts PostgreSQL and the Sales Agent. Database migrations run automatically on first startup.

### Step 5: Verify Setup

```bash
# Check services are running
docker compose ps

# Test MCP connectivity
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools
```

## Hot Reload

In development mode, the Sales Agent builds from source and supports hot reload. Changes to Python files are detected and the server restarts automatically.

To run in development mode with hot reload:

```bash
# Start only the database container
docker compose up -d db

# Run the application locally with auto-reload
uv run uvicorn src.core.main:app --reload --host 0.0.0.0 --port 8080
```

{: .alert.alert-info :}
When running locally (outside Docker), ensure your `.env` file has `DATABASE_URL` pointing to `localhost:5432` instead of the Docker internal hostname.

## Running Tests

The test suite is organized into three tiers: unit, integration, and end-to-end.

### Unit Tests

Unit tests run without external dependencies and are the fastest to execute:

```bash
uv run pytest tests/unit/ -x
```

The `-x` flag stops on the first failure, which is useful during development.

### Integration Tests

Integration tests require a running PostgreSQL database:

```bash
# Ensure PostgreSQL is running
docker compose up -d db

# Run integration tests
uv run pytest tests/integration/
```

Integration tests validate database operations, adapter behavior, and service-layer logic against real infrastructure.

### End-to-End (E2E) Tests

E2E tests run the full Sales Agent stack inside Docker and test the MCP and A2A protocols from the outside:

```bash
uv run pytest tests/e2e/
```

{: .alert.alert-warning :}
E2E tests build and start Docker containers, so they take longer to run. They are typically run before opening a pull request or as part of CI.

### Running Specific Tests

```bash
# Run a specific test file
uv run pytest tests/unit/test_schemas.py -x

# Run a specific test function
uv run pytest tests/unit/test_schemas.py::test_product_validation -x

# Run tests matching a keyword
uv run pytest tests/ -k "media_buy" -x

# Run with verbose output
uv run pytest tests/unit/ -x -v
```

### Test Coverage

```bash
uv run pytest tests/unit/ --cov=src --cov-report=term-missing
```

## Pre-commit Hooks

The project uses pre-commit hooks to catch issues before they reach CI.

### Setup

```bash
# Install hooks
./setup_hooks.sh
```

This configures Git hooks from `.pre-commit-config.yaml` to run automatically on each commit.

### What the Hooks Check

{: .table .table-bordered .table-striped }
| Hook | Description | Auto-fix |
|------|-------------|----------|
| **Route conflict detection** | Ensures no two MCP tools register the same route name | No -- must be resolved manually |
| **AdCP contract compliance** | Validates that tool signatures match the AdCP protocol specification | No -- must be resolved manually |
| **Code formatting** (ruff) | Enforces consistent Python code style | Yes -- auto-formats on commit |
| **Import sorting** (ruff) | Sorts and organizes import statements | Yes -- auto-formats on commit |
| **Type checking** (mypy) | Static type analysis for Python | No -- must be resolved manually |
| **YAML/JSON validation** | Checks configuration files for syntax errors | No -- must be resolved manually |

### Running Hooks Manually

```bash
# Run all hooks on staged files
uv run pre-commit run

# Run all hooks on all files
uv run pre-commit run --all-files

# Run a specific hook
uv run pre-commit run ruff --all-files
```

## IDE Setup

The project includes configuration for several development environments.

### Claude Code

The repository includes a `.claude/` directory with project-level context files that help Claude Code understand the codebase structure, conventions, and architecture patterns. No additional configuration is needed -- open the project in Claude Code and the context is loaded automatically.

### Cursor / GitHub Copilot

An `AGENTS.md` file at the project root provides architecture context and coding conventions for Cursor and GitHub Copilot. These tools read the file automatically to improve code suggestions.

### MCP Configuration

The project includes `.mcp.json` for MCP-aware tools and editors. This file describes the server configuration and enables direct tool invocation from supported editors.

### Recommended VS Code Extensions

{: .table .table-bordered .table-striped }
| Extension | Purpose |
|-----------|---------|
| **Python** (ms-python) | Language support, IntelliSense, debugging |
| **Ruff** (charliermarsh.ruff) | Linting and formatting integration |
| **Mypy** | Type checking integration |
| **Docker** (ms-azuretools.vscode-docker) | Container management |
| **SQLAlchemy** | Model highlighting and autocomplete |

## Database Access Patterns

The Sales Agent enforces a consistent pattern for database access. All database operations must use the `get_db_session()` context manager.

### Required Pattern

```python
from src.core.database.database_session import get_db_session

async def my_function():
    async with get_db_session() as session:
        # All database operations within this context
        result = await session.execute(query)
        await session.commit()
```

{: .alert.alert-warning :}
Never create database connections manually or use raw connection strings. Always use `get_db_session()` to ensure proper connection pooling, transaction management, and cleanup.

### Why This Matters

- **Connection pooling** -- Sessions are drawn from and returned to the SQLAlchemy connection pool automatically
- **Transaction safety** -- Each context manager scope is a transaction boundary with automatic rollback on exceptions
- **Tenant isolation** -- The `ToolContext` passes the session with tenant scoping already applied
- **Testing** -- Tests can inject mock sessions without changing business logic

### In MCP Tools

MCP tool functions receive database access through the `ToolContext` dependency:

```python
@mcp.tool()
async def my_tool(
    param: str,
    ctx: ToolContext = Depends(get_tool_context),
) -> MyResponse:
    # ctx.db is already a scoped session
    products = await ctx.db.execute(
        select(Product).where(Product.tenant_id == ctx.tenant_id)
    )
    ...
```

## Common Development Commands

{: .table .table-bordered .table-striped }
| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start all services (database + Sales Agent) |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | Follow live logs for all services |
| `docker compose logs -f salesagent` | Follow Sales Agent logs only |
| `docker compose restart salesagent` | Restart the Sales Agent container |
| `docker compose down -v` | Stop and destroy all data volumes (full reset) |
| `docker compose build --no-cache` | Rebuild containers from scratch |
| `uv sync` | Install/update Python dependencies |
| `uv run pytest tests/unit/ -x` | Run unit tests, stop on first failure |
| `uv run pytest tests/integration/` | Run integration tests |
| `uv run pytest tests/e2e/` | Run E2E tests (requires Docker) |
| `uv run ruff check src/` | Run linter |
| `uv run ruff format src/` | Auto-format code |
| `uv run mypy src/` | Run type checker |
| `uv run pre-commit run --all-files` | Run all pre-commit hooks |

### Database Management

```bash
# Access the PostgreSQL shell
docker compose exec db psql -U salesagent -d salesagent

# Generate a new Alembic migration
uv run alembic revision --autogenerate -m "description of change"

# Apply pending migrations
uv run alembic upgrade head

# Roll back the last migration
uv run alembic downgrade -1

# Reset the database (destroy and recreate)
docker compose down -v && docker compose up -d
```

### Viewing Logs

```bash
# All service logs
docker compose logs -f

# Sales Agent only, last 100 lines
docker compose logs -f --tail 100 salesagent

# Database logs
docker compose logs -f db
```

## Further Reading

- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Codebase organization and module documentation
- [API Schema Reference](/agents/salesagent/schemas/api-schemas.html) -- Pydantic model definitions and validation
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Docker-based quickstart guide
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- System design and data flow
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of MCP tools
