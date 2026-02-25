---
layout: page_v2
title: Prebid Sales Agent - Developers - Testing Guide
description: Test organization, running tests, fixtures, and coverage for the Prebid Sales Agent
sidebarType: 10
---

# Testing Guide
{: .no_toc}

The Prebid Sales Agent test suite is organized into four tiers with distinct speed, dependency, and coverage characteristics.

- TOC
{:toc}

## Test Organization

The test suite is split into directories by scope. Each tier has different external dependency requirements and execution time expectations.

{: .table .table-bordered .table-striped }
| Level | Directory | Speed | Dependencies | Command |
|-------|-----------|-------|-------------|---------|
| Unit | `tests/unit/` | <1s per test | None | `pytest tests/unit/ -v` |
| Integration | `tests/integration/` | <5s per test | PostgreSQL | `pytest tests/integration/ -v` |
| E2E | `tests/e2e/` | <30s per test | Full stack | `pytest tests/e2e/ -v` |
| UI | `tests/ui/` | <10s per test | Flask app | `pytest tests/ui/ -v` |

- **Unit tests** run without any external services and validate individual functions, schema validation, and business logic in isolation.
- **Integration tests** require a running PostgreSQL database and test service-layer logic, adapter behavior, and database operations against real infrastructure.
- **E2E tests** exercise the full Sales Agent stack inside Docker, testing MCP and A2A protocols from the outside.
- **UI tests** validate the Flask-based admin interface, including form submissions, page rendering, and authentication flows.

## Test Markers

Pytest markers control which tests run in a given context. Apply them as decorators on test functions or classes.

{: .table .table-bordered .table-striped }
| Marker | Description |
|--------|-------------|
| `@pytest.mark.unit` | Unit-level test with no external dependencies |
| `@pytest.mark.integration` | Requires PostgreSQL and service infrastructure |
| `@pytest.mark.e2e` | End-to-end test against the full running stack |
| `@pytest.mark.requires_db` | Needs a database with tables provisioned |
| `@pytest.mark.requires_server` | Needs a running MCP server |
| `@pytest.mark.slow` | Execution time exceeds 5 seconds |
| `@pytest.mark.ai` | Tests AI/LLM features (Gemini) |
| `@pytest.mark.smoke` | Critical-path tests that must always pass |
| `@pytest.mark.gam` | Requires Google Ad Manager credentials |
| `@pytest.mark.skip_ci` | Skipped in CI environments |

Use markers to filter test runs:

```bash
# Run only unit tests
pytest -m unit

# Run smoke tests across all tiers
pytest -m smoke

# Exclude slow and AI tests
pytest -m "not slow and not ai"
```

## Pytest Configuration

The project configures pytest through `pytest.ini` in the repository root.

{: .table .table-bordered .table-striped }
| Setting | Value | Purpose |
|---------|-------|---------|
| `asyncio_mode` | `auto` | Automatically handles async test functions without requiring explicit `@pytest.mark.asyncio` |
| `testpaths` | `tests` | Default directory for test discovery |

## Common Fixtures

Shared fixtures are defined in `conftest.py` files at each tier of the test directory. These fixtures handle setup and teardown of test infrastructure.

{: .table .table-bordered .table-striped }
| Fixture | Scope | Description |
|---------|-------|-------------|
| `test_db` | session | Provides an async database session backed by SQLite (unit) or PostgreSQL (integration) |
| `test_tenant` | function | Creates an isolated tenant with default configuration for the test |
| `test_principal` | function | Creates a principal (user) associated with the test tenant |
| `mock_gam_client` | function | Returns a mock Google Ad Manager client that records calls without making real API requests |

### Using Fixtures

Fixtures are injected by name as function parameters:

```python
@pytest.mark.unit
async def test_product_creation(test_db, test_tenant):
    """Verify that a product can be created with valid data."""
    product = Product(
        tenant_id=test_tenant.id,
        name="Display Banner 300x250",
        delivery_type="non_guaranteed",
    )
    test_db.add(product)
    await test_db.flush()

    assert product.id is not None
    assert product.tenant_id == test_tenant.id
```

## Running Tests

### Quick Run (SQLite, No External Dependencies)

```bash
./run_all_tests.sh quick
```

This runs unit tests against an in-memory SQLite database. No Docker or PostgreSQL required.

### Full CI Suite (PostgreSQL)

```bash
./run_all_tests.sh ci
```

This runs the complete test suite against PostgreSQL, matching the CI environment.

### Specific Tests

```bash
# All unit tests
pytest tests/unit/ -v

# Integration tests matching a keyword
pytest tests/integration/ -k "test_media_buy" -v

# A single test file
pytest tests/unit/test_schemas.py -v

# A single test function
pytest tests/unit/test_schemas.py::test_product_validation -v
```

### With Docker

```bash
# Unit tests inside the container
docker-compose exec adcp-server pytest tests/unit/

# Full suite with coverage report
docker-compose exec adcp-server pytest --cov=. --cov-report=html
```

The HTML coverage report is written to `htmlcov/` inside the container. Mount a volume or copy the output to view it locally.

## Test Structure

All tests follow the Arrange-Act-Assert pattern:

```python
@pytest.mark.unit
async def test_media_buy_total_calculation(test_db, test_tenant):
    """Total spend should equal unit price multiplied by quantity."""
    # Arrange
    product = await create_test_product(test_db, test_tenant, cpm=12.50)
    line_item = LineItem(product_id=product.id, impressions=100_000)

    # Act
    total = line_item.calculate_total()

    # Assert
    assert total == Decimal("1250.00")
```

Each test should validate a single behavior. Use descriptive test names that state the expected outcome.

## Coverage Targets

The project enforces minimum coverage thresholds per test tier.

{: .table .table-bordered .table-striped }
| Tier | Target | Rationale |
|------|--------|-----------|
| Unit | 85% | Core business logic and schema validation |
| Integration | 80% | Database operations and service-layer interactions |
| E2E | 50% | Critical user paths through the full stack |
| UI | 60% | Admin interface pages and form handling |

Run coverage reports locally:

```bash
# Terminal summary with missing lines
pytest tests/unit/ --cov=src --cov-report=term-missing

# HTML report for detailed analysis
pytest tests/unit/ --cov=src --cov-report=html
```

{: .alert.alert-info :}
Coverage targets are enforced in CI. A pull request that drops coverage below the threshold will fail the `test.yml` workflow.

## Further Reading

- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Prerequisites and local setup
- [Testing with the Mock Adapter](/agents/salesagent/tutorials/mock-testing.html) -- Tutorial for testing campaign workflows without a real ad server
- [Contributing](/agents/salesagent/developers/contributing.html) -- Code style, commit conventions, and CI pipeline
