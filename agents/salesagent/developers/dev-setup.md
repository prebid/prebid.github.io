---
layout: page_v2
title: Prebid Sales Agent - Development Environment Setup
description: Set up a local development environment for the Prebid Sales Agent with Python, uv, PostgreSQL, and Docker
sidebarType: 10
---

# Prebid Sales Agent - Development Environment Setup
{: .no_toc}

- TOC
{:toc}

## Prerequisites

Before setting up your development environment, ensure you have the following installed:

{: .table .table-bordered .table-striped }
| Requirement | Minimum Version | Check Command | Notes |
|-------------|----------------|---------------|-------|
| Python | 3.12+ | `python3 --version` | Required for running the application natively |
| uv | Latest | `uv --version` | Python package manager (replaces pip) |
| PostgreSQL | 12+ | `psql --version` | Required for integration tests and local development |
| Docker | 20.10+ | `docker --version` | Required for containerized development and E2E tests |
| Docker Compose | 2.0+ | `docker compose version` | Multi-container orchestration |
| git | Any recent | `git --version` | Source control |

<div class="alert alert-info" role="alert">
  The Sales Agent uses <a href="https://docs.astral.sh/uv/">uv</a> as its package manager, not pip. All dependency management and script execution should go through <code>uv</code>. Install it with <code>curl -LsSf https://astral.sh/uv/install.sh | sh</code> or <code>brew install uv</code> on macOS.
</div>

## Clone the Repository

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
```

## Install Dependencies

Use `uv` to install all project dependencies, including development tools:

```bash
uv sync
```

This reads `pyproject.toml` and installs all runtime and development dependencies into a virtual environment managed by `uv`. Key dependencies include:

- **Runtime**: FastMCP, FastAPI, Flask, SQLAlchemy 2.0, psycopg2-binary, Pydantic AI, Authlib, a2a-sdk, Pillow, cryptography
- **Development**: pytest, pytest-asyncio, pytest-mock, pytest-cov, factory-boy, playwright, freezegun, mypy, ruff

<div class="alert alert-info" role="alert">
  If you add or update dependencies in <code>pyproject.toml</code>, run <code>uv sync</code> again to update the virtual environment. Never use <code>pip install</code> directly.
</div>

## Database Setup

### Local PostgreSQL

If you prefer running PostgreSQL directly on your host (instead of Docker), create the development database:

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql@16

# Create the database
createdb salesagent_dev

# Optionally create a test database for integration tests
createdb salesagent_test
```

### Run Migrations

Apply all database schema migrations using Alembic:

```bash
uv run alembic upgrade head
```

This runs 156 migration files that build the complete schema, including tables for tenants, principals, products, media buys, creatives, workflow steps, audit logs, and more.

<div class="alert alert-info" role="alert">
  Migrations run automatically on startup when using Docker (via the <code>db-init</code> service). You only need to run them manually when developing without Docker or after pulling new migration files.
</div>

## Environment Configuration

Create a `.env` file in the project root for local development. The application reads environment variables from this file on startup:

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/salesagent_dev

# Auth (test mode for local development)
ADCP_AUTH_TEST_MODE=true

# Super admin access for the Admin UI
SUPER_ADMIN_EMAILS=dev@example.com

# Optional: AI features (provide your own API key)
# AI_PROVIDER=google
# AI_MODEL=gemini-2.0-flash
# AI_API_KEY=your-api-key-here

# Optional: Skip migrations on startup (useful when running outside Docker)
# SKIP_MIGRATIONS=true

# Optional: Multi-tenant mode
# ADCP_MULTI_TENANT=false
```

<div class="alert alert-info" role="alert">
  The <code>.env</code> file is listed in <code>.gitignore</code> and should never be committed. Each developer maintains their own local configuration.
</div>

## Running Locally

### Without Docker (Native Python)

Run all services directly using the deployment script:

```bash
uv run python scripts/deploy/run_all_services.py
```

This starts the unified FastAPI application on port 8080 with all sub-applications mounted:

- `/mcp/` -- FastMCP Server (StreamableHTTP transport)
- `/a2a` -- A2A Server (JSON-RPC 2.0)
- `/admin` -- Flask Admin UI
- `/api/v1` -- REST API
- `/` -- Tenant Landing Pages

### With Docker

For a fully containerized environment that includes nginx and PostgreSQL:

```bash
docker compose up -d
```

This starts all services behind an nginx reverse proxy on port 8000. Hot-reload is supported via volume mounts -- code changes in `src/` are reflected without rebuilding the container.

{: .table .table-bordered .table-striped }
| Mode | Command | URL | Use Case |
|------|---------|-----|----------|
| Native | `uv run python scripts/deploy/run_all_services.py` | `http://localhost:8080` | Fast iteration, debugger support |
| Docker | `docker compose up -d` | `http://localhost:8000` | Full stack with nginx, PostgreSQL |

## Running with Docker

### Starting Services

```bash
# Start all containers in the background
docker compose up -d

# Watch logs in real time
docker compose logs -f
```

### Hot-Reload Support

The Docker Compose configuration mounts the `src/` directory as a volume, so code changes are picked up automatically by the uvicorn server running inside the container. You do not need to rebuild the container for Python code changes.

To rebuild after changes to `Dockerfile`, `pyproject.toml`, or system dependencies:

```bash
docker compose up -d --build
```

### Useful Docker Commands

{: .table .table-bordered .table-striped }
| Action | Command |
|--------|---------|
| Start all services | `docker compose up -d` |
| Stop all services | `docker compose down` |
| Stop and remove volumes (clean database) | `docker compose down -v` |
| Rebuild containers | `docker compose up -d --build` |
| View all logs | `docker compose logs -f` |
| View app logs only | `docker compose logs -f salesagent` |
| Open a shell in the container | `docker compose exec salesagent bash` |
| Run migrations manually | `docker compose exec salesagent alembic upgrade head` |
| Check container status | `docker compose ps` |

## IDE Configuration

### VS Code

Create or update `.vscode/settings.json` in the project root:

```json
{
    "python.defaultInterpreterPath": ".venv/bin/python",
    "python.analysis.typeCheckingMode": "basic",
    "python.analysis.autoImportCompletions": true,
    "[python]": {
        "editor.defaultFormatter": "charliermarsh.ruff",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
            "source.fixAll.ruff": "explicit",
            "source.organizeImports.ruff": "explicit"
        }
    },
    "python.testing.pytestEnabled": true,
    "python.testing.pytestArgs": [
        "tests/unit"
    ]
}
```

### Recommended VS Code Extensions

{: .table .table-bordered .table-striped }
| Extension | Purpose |
|-----------|---------|
| [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) | Linting and formatting (replaces Black, Flake8, isort) |
| [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) | Type checking and IntelliSense |
| [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) | Python language support |
| [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) | Docker and Compose file support |
| [SQLAlchemy Stubs](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml) | SQLAlchemy type hints |

### PyCharm

1. Open the project directory as a PyCharm project.
2. Set the Python interpreter to the `uv`-managed virtual environment at `.venv/bin/python`.
3. Configure Ruff as the external tool for linting under **Settings > Tools > External Tools**.
4. Enable pytest as the test runner under **Settings > Tools > Python Integrated Tools**.

## Common Development Commands

{: .table .table-bordered .table-striped }
| Task | Command |
|------|---------|
| Run the server (native) | `uv run python scripts/deploy/run_all_services.py` |
| Run the server (Docker) | `docker compose up -d` |
| Run all unit tests | `uv run pytest tests/unit` |
| Run integration tests | `uv run pytest tests/integration` |
| Run E2E tests | `uv run pytest tests/e2e` |
| Run a specific test file | `uv run pytest tests/unit/test_products.py` |
| Run tests with coverage | `uv run pytest tests/unit --cov=src --cov-report=html` |
| Create a new migration | `uv run alembic revision --autogenerate -m "description"` |
| Apply all migrations | `uv run alembic upgrade head` |
| Rollback one migration | `uv run alembic downgrade -1` |
| Lint code | `uv run ruff check src/ tests/` |
| Auto-fix lint issues | `uv run ruff check --fix src/ tests/` |
| Format code | `uv run ruff format src/ tests/` |
| Type check | `uv run mypy src/` |
| Run pre-commit hooks | `uv run pre-commit run --all-files` |
| Install pre-commit hooks | `uv run pre-commit install` |

## Source Code Architecture Patterns

Understanding these core patterns will help you navigate and contribute to the codebase effectively.

### Transport Parity (`_impl` Functions)

All business logic lives in `_impl` functions that are transport-agnostic. Each tool has three layers:

```python
# Layer 1: MCP wrapper (src/core/tools/)
@mcp.tool()
def get_products(brief: str = "", ctx: Context = None) -> ToolResult:
    identity = resolve_identity_from_context(ctx)
    return get_products_raw(brief=brief, identity=identity)

# Layer 2: Raw function (callable from any transport)
def get_products_raw(brief: str = "", identity: ResolvedIdentity = None) -> GetProductsResponse:
    return _get_products_impl(req=GetProductsRequest(brief=brief), identity=identity)

# Layer 3: Implementation (pure business logic)
def _get_products_impl(req: GetProductsRequest, identity: ResolvedIdentity) -> GetProductsResponse:
    # Database queries, adapter calls, AI ranking — no transport awareness
    ...
```

Rules enforced by structural test guards:

- `_impl` functions must never import transport-specific types
- `_impl` functions must take `ResolvedIdentity`, not `Context` or `ToolContext`
- `_impl` functions must raise `AdCPError`, never `ToolError`
- MCP/A2A/REST wrappers must forward all parameters to `_impl`

### Database Session Pattern

Database access uses a context manager that ensures proper transaction handling:

```python
from src.core.database.database_session import get_db_session

with get_db_session() as session:
    product = session.query(Product).filter_by(
        tenant_id=identity.tenant_id,
        product_id=product_id
    ).first()
    session.commit()  # Explicit commit required
```

All queries are tenant-scoped via composite primary keys `(tenant_id, entity_id)` to enforce multi-tenant isolation.

### Error Handling

The codebase uses a hierarchical error system with recovery classification:

```python
from src.core.exceptions import AdCPValidationError, AdCPNotFoundError

# Raise with recovery hint for the calling agent
raise AdCPValidationError(
    message="Budget exceeds tenant maximum",
    recovery="correctable",  # "terminal", "correctable", or "transient"
    details={"max_budget": 50000, "requested": 75000}
)
```

Recovery classifications:

- `terminal` — Cannot be retried (e.g., authentication failure, authorization denied)
- `correctable` — Agent should modify the request and retry (e.g., validation error, policy violation)
- `transient` — Temporary failure, safe to retry with backoff (e.g., ad server timeout, rate limit)

### Adapter Delegation

Tools delegate ad server operations through the adapter interface:

```python
adapter = get_adapter_for_tenant(identity.tenant_id)  # Returns GAM, Kevel, Mock, etc.
response = adapter.create_media_buy(request, packages, start_time, end_time)
```

The adapter is resolved per-tenant from the `adapter_config` table. See [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) for the full interface.

### AI Agent Integration

AI features use Pydantic AI agents with per-tenant model configuration:

```python
from src.services.ai.factory import AIServiceFactory

# Factory creates model instance from tenant's ai_config
model = AIServiceFactory.create_model(tenant.ai_config)
agent = Agent(model=model, system_prompt="...")
result = await agent.run(prompt)
```

Supported providers: Google Gemini (default), OpenAI, Anthropic Claude, Groq, and AWS Bedrock.

## Troubleshooting

### `uv sync` Fails with Compilation Errors

Some dependencies (e.g., `psycopg2-binary`, `pillow`) include C extensions. Ensure you have the necessary system libraries:

**macOS**:

```bash
brew install postgresql libpq openssl
```

**Ubuntu/Debian**:

```bash
sudo apt-get install libpq-dev python3-dev build-essential
```

### Database Connection Refused

If you see `connection refused` errors when starting the application:

1. Verify PostgreSQL is running: `pg_isready` (native) or `docker compose ps` (Docker).
2. Check that `DATABASE_URL` in your `.env` matches your PostgreSQL setup.
3. Ensure the database exists: `psql -l | grep salesagent_dev`.

### Alembic "Target Database is Not Up to Date"

This occurs when the database schema is ahead of or behind the migration history:

```bash
# Check current migration state
uv run alembic current

# Apply all pending migrations
uv run alembic upgrade head
```

If migrations are irrecoverably broken during development, reset the database:

```bash
dropdb salesagent_dev && createdb salesagent_dev && uv run alembic upgrade head
```

### Pre-commit Hook Failures

If pre-commit hooks fail:

```bash
# See what failed
uv run pre-commit run --all-files

# Auto-fix formatting issues
uv run ruff format src/ tests/
uv run ruff check --fix src/ tests/
```

### Port Conflicts

If port 8080 (native) or 8000 (Docker) is already in use:

- **Native**: Set the `PORT` environment variable: `PORT=9090 uv run python scripts/deploy/run_all_services.py`
- **Docker**: Edit the port mapping in `docker-compose.yml`: `"9000:8000"`

## Next Steps

- [Testing Guide](/agents/salesagent/developers/testing.html) -- Learn about the test suite and how to write tests
- [Database Migrations](/agents/salesagent/developers/migrations.html) -- Working with Alembic migrations
- [Contributing Guide](/agents/salesagent/developers/contributing.html) -- Branching, commits, and PR workflow
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- Understand the system design
- [Campaign Lifecycle Tutorial](/agents/salesagent/tutorials/campaign-lifecycle.html) -- Walk through a complete campaign
