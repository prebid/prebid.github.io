---
layout: page_v2
title: Prebid Sales Agent - Contributing Guide
description: How to contribute to the Prebid Sales Agent, including branching, commit conventions, code style, and the release process
sidebarType: 10
---

# Prebid Sales Agent - Contributing Guide
{: .no_toc}

- TOC
{:toc}

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/salesagent.git
   cd salesagent
   ```

3. **Set up your development environment** following the [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) guide.
4. **Install pre-commit hooks**:

   ```bash
   uv run pre-commit install
   ```

5. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feat/my-new-feature
   ```

## Branching Strategy

All development work happens on feature branches created from `main`. Branch names must use one of the following prefixes:

{: .table .table-bordered .table-striped }
| Prefix | Use Case | Example |
|--------|----------|---------|
| `feat/` | New features or capabilities | `feat/audio-creative-support` |
| `fix/` | Bug fixes | `fix/budget-validation-negative` |
| `docs/` | Documentation-only changes | `docs/update-migration-guide` |
| `refactor/` | Code restructuring (no behavior change) | `refactor/extract-pricing-service` |
| `chore/` | Tooling, CI, dependencies, maintenance | `chore/upgrade-sqlalchemy-2.1` |
| `test/` | Adding or improving tests | `test/add-delivery-edge-cases` |

### Branch Lifecycle

1. Create your branch from `main`.
2. Make small, focused commits (see Conventional Commits below).
3. Push your branch to your fork.
4. Open a pull request against `main`.
5. Address review feedback with additional commits (do not force-push during review).
6. After approval, the PR is squash-merged into `main`.

## Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This enables automated changelog generation and version bumping through release-please.

### Format

```text
<type>: <short description>

<optional body>

<optional footer>
```

### Types

{: .table .table-bordered .table-striped }
| Type | Description | Version Bump |
|------|-------------|-------------|
| `feat` | A new feature | Minor (0.x.0) |
| `fix` | A bug fix | Patch (0.0.x) |
| `docs` | Documentation only | None |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None |
| `chore` | Maintenance tasks (CI, deps, config) | None |
| `test` | Adding or correcting tests | None |
| `perf` | Performance improvement | Patch (0.0.x) |

### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the footer:

```text
feat!: rename format_ids to format_identifiers across all schemas

BREAKING CHANGE: The `format_ids` field in Product and Creative schemas
has been renamed to `format_identifiers`. Clients must update their
request payloads.
```

Breaking changes trigger a major version bump (x.0.0).

### Examples

```text
feat: add audio creative format support to sync_creatives

Adds validation and processing for audio creative formats (MP3, WAV, FLAC)
in the sync_creatives tool. Includes format-specific duration and bitrate
validation.
```

```text
fix: prevent negative budget values in create_media_buy

The create_media_buy _impl function now raises AdCPValidationError when
the budget is zero or negative, instead of passing the invalid value
through to the adapter.

Closes #142
```

```text
chore: upgrade ruff to 0.8.0 and fix new lint rules
```

```text
test: add structural guard for adapter capabilities declaration
```

## Code Style

### Python Version

All code must target Python 3.12+. Use modern Python features including:

- Type hints on all function signatures (parameters and return types).
- `str | None` union syntax (not `Optional[str]`).
- `list[str]` lowercase generics (not `List[str]`).
- `match` statements where appropriate.

### Ruff (Linting and Formatting)

The project uses [Ruff](https://docs.astral.sh/ruff/) for both linting and formatting, replacing Black, Flake8, and isort. Configuration is in `pyproject.toml`.

```bash
# Check for lint errors
uv run ruff check src/ tests/

# Auto-fix fixable issues
uv run ruff check --fix src/ tests/

# Format code
uv run ruff format src/ tests/

# Check formatting without modifying files
uv run ruff format --check src/ tests/
```

### mypy (Type Checking)

Static type analysis is enforced using [mypy](https://mypy-lang.org/). Configuration is in `pyproject.toml`.

```bash
uv run mypy src/
```

All new code must pass mypy without errors. Common patterns:

```python
# Good: explicit types
async def get_products_impl(
    identity: ResolvedIdentity,
    brief: str | None = None,
    channels: list[str] | None = None,
) -> list[Product]:
    ...

# Good: TypedDict for complex dictionaries
class DeliveryMetrics(TypedDict):
    impressions: int
    spend: float
    ctr: float
    pacing: float
```

## Pre-commit Hooks

The project uses [pre-commit](https://pre-commit.com/) to run checks automatically before each commit. The configuration is in `.pre-commit-config.yaml`.

### Installation

```bash
uv run pre-commit install
```

### What Pre-commit Checks

{: .table .table-bordered .table-striped }
| Hook | What It Does |
|------|-------------|
| ruff (lint) | Checks for code quality issues and auto-fixes where possible |
| ruff (format) | Ensures consistent code formatting |
| mypy | Runs static type checking |
| trailing-whitespace | Removes trailing whitespace |
| end-of-file-fixer | Ensures files end with a newline |
| check-yaml | Validates YAML file syntax |
| check-json | Validates JSON file syntax |
| check-merge-conflict | Prevents committing merge conflict markers |

### Running Manually

```bash
# Run all hooks on all files
uv run pre-commit run --all-files

# Run a specific hook
uv run pre-commit run ruff --all-files
```

### Bypassing Hooks (Emergency Only)

If you must bypass pre-commit in an emergency:

```bash
git commit --no-verify -m "fix: emergency hotfix for production outage"
```

<div class="alert alert-info" role="alert">
  Bypassing pre-commit hooks should be rare and documented. CI will still enforce all checks on the pull request.
</div>

## Architecture Principles

When contributing code, adhere to these architectural rules. Structural guard tests enforce these automatically.

### Transport Parity

All three protocols (MCP, A2A, REST) must call the same `_impl` business logic functions. Never put business logic in a transport-specific handler.

```python
# CORRECT: business logic in _impl, transport just resolves identity
# src/core/tools/products.py (MCP wrapper)
@mcp.tool()
async def get_products(ctx: Context, brief: str = None):
    identity = await resolve_identity(ctx)
    return await get_products_impl(identity, brief=brief)

# WRONG: business logic in the MCP handler
@mcp.tool()
async def get_products(ctx: Context, brief: str = None):
    identity = await resolve_identity(ctx)
    # DON'T DO THIS -- this logic should be in _impl
    async with get_db_session() as session:
        products = await session.execute(select(Product))
        ...
```

### _impl Functions Take ResolvedIdentity

All `_impl` functions must accept `ResolvedIdentity` as their identity parameter, never transport-specific types like FastMCP `Context`, Flask `g`, or FastAPI `Request`.

```python
# CORRECT
async def create_media_buy_impl(identity: ResolvedIdentity, **kwargs):
    ...

# WRONG
async def create_media_buy_impl(ctx: Context, **kwargs):
    ...
```

### _impl Functions Raise AdCPError

The `_impl` layer must raise `AdCPError` subclasses (e.g., `AdCPValidationError`, `AdCPNotFoundError`). Never raise transport-specific errors like `ToolError` from `_impl` code.

```python
# CORRECT
from src.core.errors import AdCPValidationError

async def create_media_buy_impl(identity, budget):
    if budget <= 0:
        raise AdCPValidationError("Budget must be positive", recovery="correctable")

# WRONG
from fastmcp.exceptions import ToolError

async def create_media_buy_impl(identity, budget):
    if budget <= 0:
        raise ToolError("Budget must be positive")  # transport-specific!
```

### Wrapper Completeness

When adding a new parameter to an `_impl` function, update all three transport wrappers (MCP tool, A2A handler, REST endpoint) to accept and forward the new parameter. The `test_architecture_boundary_completeness.py` guard test catches missing parameters.

## Pull Request Guidelines

### Before Submitting

Complete this checklist before opening a pull request:

- [ ] Code passes `uv run ruff check src/ tests/` with no errors.
- [ ] Code passes `uv run ruff format --check src/ tests/` with no changes needed.
- [ ] Code passes `uv run mypy src/` with no errors.
- [ ] All existing tests pass: `uv run pytest tests/unit`.
- [ ] New code has tests (unit tests at minimum, integration tests for DB changes).
- [ ] All public functions have type hints on parameters and return values.
- [ ] Commit messages follow Conventional Commits format.
- [ ] Branch name follows the naming convention (`feat/`, `fix/`, etc.).

### PR Description

Every pull request must include:

1. **Summary**: What the change does and why.
2. **Testing**: How the change was tested (which test commands, manual testing steps).
3. **Migration**: If database changes are included, describe the migration and any data implications.
4. **Breaking changes**: If any, describe the impact on existing clients.

### Review Process

1. At least one maintainer must approve the PR.
2. All CI checks must pass.
3. The PR title must follow Conventional Commits format (enforced by `pr-title-check.yml`).
4. The IPR agreement must be signed (enforced by `ipr-agreement.yml`).
5. Once approved, the PR is squash-merged into `main`.

## CI/CD Pipeline

The following GitHub Actions workflows run automatically:

{: .table .table-bordered .table-striped }
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `test.yml` | Every PR and push to `main` | Runs linting, type checking, unit tests, and integration tests |
| `pr-title-check.yml` | Every PR | Validates PR title follows Conventional Commits format |
| `ipr-agreement.yml` | Every PR | Verifies the contributor has signed the IPR agreement |
| `release-please.yml` | Push to `main` | Manages automated releases and changelog generation |

### test.yml Details

The test workflow runs these steps in order:

1. **Checkout** the code and set up Python 3.12.
2. **Install dependencies** with `uv sync`.
3. **Lint** with `ruff check`.
4. **Type check** with `mypy`.
5. **Unit tests** with `pytest tests/unit`.
6. **Integration tests** with `pytest tests/integration` (using a PostgreSQL service container).
7. **Coverage report** uploaded as an artifact.

## Release Process

The project uses [release-please](https://github.com/googleapis/release-please) for automated releases. When commits are merged to `main`, release-please:

1. Analyzes commit messages since the last release.
2. Determines the version bump based on commit types.
3. Creates or updates a release PR with the changelog.
4. When the release PR is merged, creates a GitHub release with the new version tag.

### Version Bump Rules

{: .table .table-bordered .table-striped }
| Commit Type | Version Bump | Example |
|-------------|-------------|---------|
| `feat` | Minor (0.**1**.0) | New tool, new adapter, new feature |
| `fix` | Patch (0.0.**1**) | Bug fix, error correction |
| `feat!` or `BREAKING CHANGE` | Major (**1**.0.0) | Schema change, API change, removed feature |
| `docs`, `chore`, `refactor`, `test` | None | No release triggered |

### Manual Release

In exceptional cases, maintainers can trigger a manual release by updating the version in `pyproject.toml` and creating a git tag:

```bash
git tag v1.2.3
git push origin v1.2.3
```

## Where to Contribute

Looking for areas to contribute? Here are the main areas of the codebase:

{: .table .table-bordered .table-striped }
| Area | Path | Description |
|------|------|-------------|
| MCP Tools | `src/core/tools/` | Add new tools or improve existing tool implementations |
| Ad Server Adapters | `src/adapters/` | Add support for new ad servers or improve existing adapters |
| Admin UI | `src/admin/blueprints/` | Improve the publisher administration interface |
| AI Agents | `src/services/ai/` | Improve AI ranking, review, naming, or policy agents |
| Schemas | `src/core/schemas/` | Extend or refine Pydantic request/response models |
| Documentation | This site | Improve developer docs, tutorials, and tool references |
| Tests | `tests/` | Increase coverage, add edge case tests, improve test utilities |
| Database | `src/core/database/` | Optimize queries, add indexes, improve session management |

<div class="alert alert-info" role="alert">
  If you are unsure where to start, look for issues labeled <code>good first issue</code> or <code>help wanted</code> on the GitHub repository. These issues are curated for new contributors.
</div>

## Next Steps

- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Set up your local environment
- [Testing Guide](/agents/salesagent/developers/testing.html) -- Learn about the test suite
- [Database Migrations](/agents/salesagent/developers/migrations.html) -- Working with Alembic migrations
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- Understand the system design
- [Campaign Lifecycle Tutorial](/agents/salesagent/tutorials/campaign-lifecycle.html) -- Walk through a complete campaign
