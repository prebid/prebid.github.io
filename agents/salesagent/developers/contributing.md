---
layout: page_v2
title: Prebid Sales Agent - Developers - Contributing
description: How to contribute to the Prebid Sales Agent project
sidebarType: 10
---

# Contributing
{: .no_toc}

This guide covers the contribution workflow, commit conventions, CI pipeline, and release process for the Prebid Sales Agent.

- TOC
{:toc}

## Getting Started

1. Fork the [salesagent repository](https://github.com/prebid/salesagent) on GitHub.
2. Set up your [development environment](/agents/salesagent/developers/dev-setup.html).
3. Create a feature branch from `main`.
4. Make your changes and add tests.
5. Run the [test suite](/agents/salesagent/developers/testing.html).
6. Open a pull request against `main`.

{: .alert.alert-warning :}
All contributions are subject to the [IPR Policy](https://github.com/prebid/salesagent/blob/main/IPR_POLICY.md). Read it before submitting your first pull request. The `ipr-agreement.yml` GitHub Action checks that contributors have accepted the policy.

## Branching Strategy

Create feature branches from `main` using a descriptive name:

```bash
git checkout main
git pull origin main
git checkout -b feat/add-frequency-capping
```

Branch name conventions:

{: .table .table-bordered .table-striped }
| Prefix | Use Case |
|--------|----------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `chore/` | Maintenance and tooling |

## Conventional Commits

Pull request titles must follow the [Conventional Commits](https://www.conventionalcommits.org/) format. This is enforced by the `pr-title-check.yml` GitHub Action -- pull requests with non-conforming titles will fail CI.

### Format

```
type(scope): description
```

### Types

{: .table .table-bordered .table-striped }
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(catalog): add frequency capping to products` |
| `fix` | Bug fix | `fix(media-buy): correct total spend calculation` |
| `docs` | Documentation | `docs(api): update tool parameter descriptions` |
| `refactor` | Code refactoring | `refactor(adapters): extract common validation logic` |
| `perf` | Performance improvement | `perf(search): add index for product name lookups` |
| `chore` | Maintenance | `chore(deps): update sqlalchemy to 2.0.30` |
| `test` | Test additions or changes | `test(unit): add coverage for pricing edge cases` |
| `ci` | CI/CD changes | `ci: add PostgreSQL 17 to test matrix` |

### Scope

The scope is optional but recommended. Use the module or area being changed (e.g., `catalog`, `media-buy`, `adapters`, `auth`, `admin`).

### Breaking Changes

Append `!` after the type/scope for breaking changes:

```
feat(api)!: rename get_products to search_products
```

## Code Style

### Python Version

The project requires Python 3.12 or later. Use features available in that version, including type parameter syntax and `match` statements where appropriate.

### Dependency Management

Use `uv` for all dependency management:

```bash
# Add a runtime dependency
uv add package-name

# Add a development dependency
uv add --dev package-name

# Sync dependencies from pyproject.toml
uv sync
```

### Pre-commit Hooks

Install pre-commit hooks before your first commit:

```bash
./scripts/setup_hooks.sh
```

The hooks run automatically on each commit and check for:

- Code formatting (ruff)
- Import sorting (ruff)
- Type errors (mypy)
- Route conflicts between MCP tools
- AdCP contract compliance

See [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) for the full list of hooks and how to run them manually.

### Type Hints

Type hints are required for all public API functions, MCP tool parameters, and return values:

```python
async def create_product(
    name: str,
    delivery_type: DeliveryType,
    cpm: Decimal | None = None,
) -> Product:
    ...
```

## Pull Request Guidelines

### Before Submitting

1. Run the full unit test suite: `pytest tests/unit/ -v`
2. Run pre-commit hooks on all files: `uv run pre-commit run --all-files`
3. Verify your changes work with integration tests if they touch database logic: `pytest tests/integration/ -v`
4. Update documentation if your change affects tool behavior, configuration, or APIs.

### PR Description

Include in your pull request description:

- **What** the change does
- **Why** the change is needed
- **How** to test it
- Any **migration** steps required

### Review Process

- At least one approving review is required before merging.
- CI must pass (tests, linting, type checking, IPR check).
- PRs are squash-merged to keep the commit history clean.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and release automation.

{: .table .table-bordered .table-striped }
| Workflow | Trigger | Steps |
|----------|---------|-------|
| `test.yml` | Push to `main`, PR to `main` | Security audit (`uv-secure`), smoke tests, full test suite with PostgreSQL |
| `release-please.yml` | Push to `main` | Automated versioning, CHANGELOG generation, release creation |
| `pr-title-check.yml` | PR opened/edited | Validates conventional commit format in PR title |
| `ipr-agreement.yml` | PR opened | Checks that the contributor has accepted the IPR policy |

### Test Workflow Details

The `test.yml` workflow runs in this order:

1. **Security audit** -- `uv-secure` scans dependencies for known vulnerabilities.
2. **Smoke tests** -- Runs tests marked with `@pytest.mark.smoke` to catch critical regressions early.
3. **Full test suite** -- Runs unit and integration tests against a PostgreSQL service container.

{: .alert.alert-info :}
If the security audit step fails, check `uv-secure` output for the affected package and version. Update the dependency or add an exception in the security configuration if the vulnerability does not apply.

## Release Process

Releases are automated through [release-please](https://github.com/googleapis/release-please). The tool reads conventional commit messages to determine version bumps and generate changelogs.

### How It Works

1. Conventional commits are merged into `main`.
2. `release-please` opens (or updates) a release PR that bumps the version and updates `CHANGELOG.md`.
3. When the release PR is merged, a GitHub Release is created with the generated notes.

### Version Bump Rules

{: .table .table-bordered .table-striped }
| Commit Type | Version Bump | CHANGELOG Section |
|-------------|-------------|-------------------|
| `feat` | Minor | Features |
| `fix` | Patch | Bug Fixes |
| `perf` | Patch | Performance Improvements |
| `refactor` | -- | Code Refactoring |
| `docs` | -- | Documentation |
| `chore` | -- | Hidden |

Breaking changes (indicated by `!` in the commit type) trigger a major version bump regardless of the commit type.

### Configuration

Release-please is configured through `release-please-config.json` in the repository root. This file controls:

- Package name and release type
- Changelog sections and ordering
- Version file locations

## Further Reading

- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Prerequisites, setup, and common commands
- [Testing Guide](/agents/salesagent/developers/testing.html) -- Test organization, fixtures, and coverage
- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Codebase organization and module documentation
