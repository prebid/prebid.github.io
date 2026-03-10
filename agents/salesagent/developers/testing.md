---
layout: page_v2
title: Prebid Sales Agent - Testing Guide
description: Comprehensive guide to unit, integration, E2E, and structural guard tests for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Testing Guide
{: .no_toc}

- TOC
{:toc}

## Test Organization

The Sales Agent test suite is organized into three tiers, each with different requirements and purposes:

```text
tests/
├── unit/                # Tier 1: No database, fast, mocked dependencies
├── integration/         # Tier 2: PostgreSQL required, real DB operations
├── e2e/                 # Tier 3: Docker required, full lifecycle validation
├── conftest.py          # Shared fixtures across all test tiers
├── conftest_db.py       # Database-specific fixtures (integration/E2E)
├── factories/           # Factory Boy model factories
├── fixtures/            # Static test data (JSON, images, etc.)
└── harness/             # Test harness utilities
```

{: .table .table-bordered .table-striped }
| Tier | Directory | Requirements | Speed | Scope |
|------|-----------|-------------|-------|-------|
| Unit | `tests/unit/` | None (no DB) | Fast (seconds) | Individual functions, mocked dependencies |
| Integration | `tests/integration/` | PostgreSQL | Medium (minutes) | Database operations, transactions, schema validation |
| E2E | `tests/e2e/` | Docker | Slow (minutes) | Full lifecycle, contract validation against AdCP spec |

## Running Tests

### All Unit Tests

```bash
uv run pytest tests/unit
```

### All Integration Tests

```bash
uv run pytest tests/integration
```

### All E2E Tests

```bash
uv run pytest tests/e2e
```

### Specific Test File

```bash
uv run pytest tests/unit/test_products.py
```

### Specific Test Function

```bash
uv run pytest tests/unit/test_products.py::test_get_products_with_brief
```

### With Verbose Output

```bash
uv run pytest tests/unit -v
```

### With Coverage

```bash
uv run pytest tests/unit --cov=src --cov-report=html
```

This generates an HTML coverage report in the `htmlcov/` directory. Open `htmlcov/index.html` in a browser to view line-by-line coverage.

## Unit Tests

Unit tests are the foundation of the test suite. They run without any external dependencies, making them fast and reliable for local development and CI.

### Principles

- **No database**: Unit tests never connect to PostgreSQL. All database interactions are mocked.
- **No network**: Unit tests never make HTTP requests. External API calls are mocked.
- **Isolation**: Each test is independent. No shared state between tests.
- **Speed**: The entire unit test suite should run in under 30 seconds.

### Mocking Patterns

Unit tests rely on `pytest-mock` for patching dependencies. Common patterns include:

```python
import pytest
from unittest.mock import AsyncMock

@pytest.fixture
def mock_db_session(mocker):
    """Mock the database session context manager."""
    session = AsyncMock()
    mocker.patch(
        "src.core.database.database_session.get_db_session",
        return_value=session
    )
    return session

@pytest.fixture
def mock_adapter(mocker):
    """Mock the ad server adapter."""
    adapter = AsyncMock()
    adapter.adapter_name = "mock"
    mocker.patch(
        "src.adapters.get_adapter_for_tenant",
        return_value=adapter
    )
    return adapter

async def test_create_media_buy_validates_budget(mock_db_session, mock_adapter):
    """Verify that create_media_buy rejects negative budgets."""
    identity = ResolvedIdentity(tenant_id="t1", principal_id="p1")
    with pytest.raises(AdCPValidationError, match="budget"):
        await create_media_buy_impl(identity, budget=-100)
```

### What to Unit Test

- **`_impl` functions**: Business logic in `src/core/tools/` should have thorough unit test coverage.
- **Schema validation**: Test that Pydantic models accept valid data and reject invalid data.
- **Error paths**: Verify that appropriate `AdCPError` subclasses are raised for each failure mode.
- **Edge cases**: Empty lists, boundary values, missing optional fields.

## Integration Tests

Integration tests verify that the application works correctly with a real PostgreSQL database, testing SQL queries, transactions, and schema constraints.

### Prerequisites

A running PostgreSQL instance is required. Set the `DATABASE_URL` environment variable or use the default from `conftest_db.py`:

```bash
# Start PostgreSQL locally
brew services start postgresql@16

# Or use Docker
docker run -d --name salesagent-test-db \
  -e POSTGRES_DB=salesagent_test \
  -e POSTGRES_PASSWORD=test \
  -p 5433:5432 \
  postgres:17
```

### Database Fixtures

The `conftest_db.py` file provides fixtures that manage database lifecycle:

```python
# conftest_db.py provides these key fixtures:

@pytest.fixture
def db_session():
    """Provides a transactional database session.

    Each test runs inside a transaction that is rolled back after the test
    completes, ensuring test isolation without needing to recreate the
    database between tests.
    """

@pytest.fixture
def seeded_db(db_session):
    """Database session with pre-populated test data.

    Inserts a demo tenant, principal, products, and pricing options
    for integration tests that need existing data.
    """
```

### What to Integration Test

- **Database operations**: CRUD operations, complex queries with joins and filters.
- **Transaction behavior**: Verify that operations are atomic and rollback correctly on failure.
- **Schema constraints**: Unique constraints, foreign keys, not-null constraints, check constraints.
- **Migration compatibility**: Ensure that current code works with the latest schema.

## E2E Tests

End-to-end tests validate the complete system by running all services in Docker and executing full campaign lifecycles against the running application.

### Prerequisites

Docker and Docker Compose must be running. The E2E test suite starts and manages containers automatically:

```bash
# Ensure Docker is running
docker info

# Run E2E tests
uv run pytest tests/e2e
```

### What E2E Tests Validate

- **Full campaign lifecycle**: Discovery, creation, creative upload, approval, delivery, and completion.
- **Protocol parity**: The same operations produce identical results via MCP, A2A, and REST.
- **Contract validation**: Responses conform to the AdCP specification schema.
- **Multi-step workflows**: Approval chains, status transitions, and error recovery.

## Structural Guard Tests

The Sales Agent includes a set of architectural enforcement tests that ensure code structure adheres to design principles. These tests do not test functionality -- they test the codebase itself.

### test_transport_agnostic_impl.py

**Purpose**: Ensures that `_impl` modules contain no transport-specific imports.

The `_impl` functions are the transport-agnostic business logic layer. They must not import from `fastmcp`, `a2a_sdk`, or `fastapi` router modules. This test scans all `_impl` files and fails if any transport-layer imports are found.

```python
# This test PASSES:
# src/core/tools/products_impl.py
from src.core.database.database_session import get_db_session
from src.core.schemas.product import Product

# This test FAILS:
# src/core/tools/products_impl.py
from fastmcp import Context  # VIOLATION: transport import in _impl
```

### test_impl_resolved_identity.py

**Purpose**: Ensures all `_impl` functions accept `ResolvedIdentity` as their identity parameter.

The `_impl` layer must not use transport-specific identity types (e.g., FastMCP `Context`, Flask `g`). Every `_impl` function signature is inspected to verify it takes `ResolvedIdentity`.

### test_no_toolerror_in_impl.py

**Purpose**: Ensures `_impl` functions raise `AdCPError` subclasses, never transport-specific error types like `ToolError`.

The MCP SDK defines `ToolError` for MCP-specific error handling, but `_impl` code must use the application's own `AdCPError` hierarchy. This preserves transport parity -- the same error handling works identically across MCP, A2A, and REST.

### test_architecture_boundary_completeness.py

**Purpose**: Ensures that MCP/A2A/REST wrapper functions forward all parameters to their `_impl` counterparts.

When a new parameter is added to an `_impl` function, the corresponding MCP tool, A2A handler, and REST endpoint must all be updated to forward it. This test catches cases where a parameter was added to `_impl` but forgotten in one or more transport wrappers.

### Running Structural Tests

Structural guard tests are included in the unit test suite:

```bash
uv run pytest tests/unit/test_transport_agnostic_impl.py
uv run pytest tests/unit/test_impl_resolved_identity.py
uv run pytest tests/unit/test_no_toolerror_in_impl.py
uv run pytest tests/unit/test_architecture_boundary_completeness.py
```

## Test Fixtures

The test suite provides several layers of fixtures to reduce boilerplate and ensure consistency.

### conftest.py

Shared fixtures available to all test tiers:

{: .table .table-bordered .table-striped }
| Fixture | Scope | Description |
|---------|-------|-------------|
| `resolved_identity` | function | A `ResolvedIdentity` with test tenant and principal IDs |
| `mock_adapter` | function | A mocked `AdServerAdapter` instance |
| `sample_product` | function | A complete `Product` object with pricing options |
| `sample_media_buy` | function | A complete `MediaBuy` object with packages |
| `sample_creative` | function | A `Creative` object with asset metadata |

### conftest_db.py

Database-specific fixtures for integration and E2E tests:

{: .table .table-bordered .table-striped }
| Fixture | Scope | Description |
|---------|-------|-------------|
| `db_engine` | session | SQLAlchemy engine connected to the test database |
| `db_session` | function | Transactional session (rolled back after each test) |
| `seeded_db` | function | Session with pre-populated demo data |
| `clean_db` | function | Session with schema but no data |

### factories/ (Factory Boy)

Factory Boy factories generate realistic test data with sensible defaults:

```python
from tests.factories import TenantFactory, PrincipalFactory, ProductFactory

def test_product_search(db_session):
    tenant = TenantFactory.create()
    principal = PrincipalFactory.create(tenant=tenant)
    product = ProductFactory.create(
        tenant=tenant,
        name="Premium Display",
        channels=["display"],
    )
    # ... test logic using realistic test data
```

Key factories include `TenantFactory`, `PrincipalFactory`, `ProductFactory`, `MediaBuyFactory`, `CreativeFactory`, `WorkflowStepFactory`, and `PricingOptionFactory`.

### fixtures/

Static test data files used by tests:

- JSON request/response payloads for contract testing
- Sample image files for creative upload tests
- Configuration files for adapter testing

### harness/

Test harness utilities that provide higher-level test helpers:

- HTTP client wrappers for MCP, A2A, and REST protocols
- Campaign lifecycle helpers that execute multi-step flows
- Assertion helpers for comparing complex response structures

## Test Headers for Mock Adapter

When running tests against the mock adapter, special HTTP headers control the adapter's behavior. These are invaluable for testing specific scenarios without needing a real ad server.

{: .table .table-bordered .table-striped }
| Header | Type | Description | Example |
|--------|------|-------------|---------|
| `X-Dry-Run` | boolean | Validates the request without persisting changes | `X-Dry-Run: true` |
| `X-Mock-Time` | ISO 8601 | Overrides the current time for the mock adapter | `X-Mock-Time: 2026-06-15T10:00:00Z` |
| `X-Jump-To-Event` | string | Fast-forwards the campaign to a specific lifecycle event | `X-Jump-To-Event: delivery_complete` |
| `X-Test-Session-ID` | string | Isolates mock state to a specific test session | `X-Test-Session-ID: test-123` |
| `X-Auto-Advance` | boolean | Automatically advances workflow steps without manual approval | `X-Auto-Advance: true` |
| `X-Force-Error` | string | Forces the mock adapter to return a specific error | `X-Force-Error: adapter_timeout` |

### Using Test Headers in Practice

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={
        "x-adcp-auth": "test-token",
        "X-Auto-Advance": "true",       # Skip manual approvals
        "X-Test-Session-ID": "my-test", # Isolate mock state
    }
)

async with Client(transport=transport) as client:
    # This campaign will auto-advance through approval workflows
    result = await client.call_tool("create_media_buy", {...})
```

## Writing New Tests

### Where to Put Tests

{: .table .table-bordered .table-striped }
| Test Type | Directory | When to Use |
|-----------|-----------|-------------|
| Pure logic, no DB | `tests/unit/` | Testing `_impl` functions, schema validation, utility functions |
| Database queries | `tests/integration/` | Testing SQL operations, constraints, transactions |
| Full lifecycle | `tests/e2e/` | Testing multi-step flows, protocol compliance |
| Architecture rules | `tests/unit/` | Adding new structural guard tests |

### Naming Conventions

- Test files: `test_<module_name>.py`
- Test functions: `test_<what_is_being_tested>` (descriptive, not abbreviated)
- Fixtures: descriptive names matching what they provide (e.g., `resolved_identity`, `seeded_db`)

### Async Test Pattern

The Sales Agent uses `pytest-asyncio` for testing async functions. Mark async tests explicitly:

```python
import pytest

@pytest.mark.asyncio
async def test_get_products_returns_catalog(mock_db_session, resolved_identity):
    """Verify that get_products returns all products for the tenant."""
    mock_db_session.execute.return_value.scalars.return_value.all.return_value = [
        Product(id="p1", name="Display Ads"),
        Product(id="p2", name="Video Ads"),
    ]

    result = await get_products_impl(resolved_identity)

    assert len(result) == 2
    assert result[0].name == "Display Ads"
```

### Using freezegun for Time-Dependent Tests

For tests that depend on the current time (e.g., campaign start/end dates, token expiry):

```python
from freezegun import freeze_time

@freeze_time("2026-04-15")
async def test_campaign_is_active_during_flight(resolved_identity):
    """Verify a campaign with dates spanning the current time is active."""
    media_buy = MediaBuy(
        start_date=date(2026, 4, 1),
        end_date=date(2026, 4, 30),
    )
    assert media_buy.is_within_flight() is True
```

## Coverage

### Running Coverage Reports

```bash
# Terminal summary
uv run pytest tests/unit --cov=src --cov-report=term-missing

# HTML report
uv run pytest tests/unit --cov=src --cov-report=html

# XML report (for CI integration)
uv run pytest tests/unit --cov=src --cov-report=xml
```

### Coverage Targets

While there is no enforced minimum coverage threshold, the following guidelines apply:

{: .table .table-bordered .table-striped }
| Component | Target | Rationale |
|-----------|--------|-----------|
| `_impl` functions | 90%+ | Core business logic must be thoroughly tested |
| Adapters | 80%+ | Adapter logic is critical but depends on external APIs |
| Schemas | 95%+ | Validation logic should cover all edge cases |
| Admin blueprints | 70%+ | UI logic has more integration dependencies |

## CI Integration

The project uses GitHub Actions for continuous integration. The `test.yml` workflow runs on every pull request.

### What CI Runs

{: .table .table-bordered .table-striped }
| Step | Command | Purpose |
|------|---------|---------|
| Lint | `ruff check src/ tests/` | Code quality and style |
| Type check | `mypy src/` | Static type analysis |
| Unit tests | `pytest tests/unit` | Fast functional tests |
| Integration tests | `pytest tests/integration` | Database tests (uses CI PostgreSQL service) |
| Coverage | `pytest --cov=src --cov-report=xml` | Coverage reporting |

### PR Requirements

All checks must pass before a pull request can be merged:

1. All tests pass (unit and integration).
2. Ruff reports no lint errors.
3. mypy reports no type errors.
4. No decrease in test coverage for changed files.

## Next Steps

- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Set up your local environment
- [Database Migrations](/agents/salesagent/developers/migrations.html) -- Working with Alembic migrations
- [Contributing Guide](/agents/salesagent/developers/contributing.html) -- Branching, commits, and PR workflow
- [Campaign Lifecycle Tutorial](/agents/salesagent/tutorials/campaign-lifecycle.html) -- Walk through a complete campaign
