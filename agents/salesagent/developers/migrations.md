---
layout: page_v2
title: Prebid Sales Agent - Database Migrations
description: Working with Alembic database migrations in the Prebid Sales Agent, including creating, running, and troubleshooting migrations
sidebarType: 10
---

# Prebid Sales Agent - Database Migrations
{: .no_toc}

- TOC
{:toc}

## Overview

The Prebid Sales Agent uses [Alembic](https://alembic.sqlalchemy.org/) for database schema migrations, backed by [SQLAlchemy 2.0](https://www.sqlalchemy.org/) as the ORM. The project contains 156 migration files that track the complete evolution of the database schema from initial creation through every feature addition, rename, and optimization.

Migrations are stored in the `alembic/versions/` directory. Each migration file contains an `upgrade()` function (to apply the change) and a `downgrade()` function (to reverse it), enabling both forward and backward movement through the schema history.

### Key Schema Tables

The migration history covers these core tables:

{: .table .table-bordered .table-striped }
| Table | Purpose |
|-------|---------|
| `tenants` | Publisher accounts and configuration |
| `principals` | Advertiser/buyer accounts with auth tokens |
| `products` | Advertising product catalog |
| `pricing_options` | Pricing models attached to products |
| `media_buys` | Campaign proposals and active orders |
| `creatives` | Creative assets with approval status |
| `workflow_steps` | Human-in-the-loop approval tasks |
| `audit_logs` | Complete operational history |
| `adapter_config` | Per-tenant ad server configuration |
| `inventory_profiles` | Inventory categorization and metadata |
| `creative_agents` | AI creative review agent configuration |
| `signals_agents` | AI signals agent configuration |
| `auth_config` | Per-tenant SSO/OIDC configuration |
| `users` | Admin UI user accounts |
| `currency_limits` | Per-tenant budget and currency constraints |
| `contexts` | Session and conversation tracking |
| `strategies` | Campaign optimization strategies |

### Notable Migrations

Key migrations in the project history include:

- **format_ids rename**: Renamed format identifier columns for consistency across tables.
- **pricing_options table**: Split pricing data out of products into a dedicated table.
- **workflow_steps**: Added the human-in-the-loop approval workflow system.
- **creative_agents**: Added per-tenant AI creative review agent configuration.
- **multi-tenant user access**: Added user-to-tenant mapping for the Admin UI.
- **encryption**: Added encrypted storage for sensitive configuration values.

## Running Migrations

### Apply All Pending Migrations

```bash
uv run alembic upgrade head
```

This applies all migrations that have not yet been run against the current database, bringing the schema up to the latest version.

### Apply a Specific Number of Migrations

```bash
# Apply the next 3 pending migrations
uv run alembic upgrade +3
```

### Rollback One Migration

```bash
uv run alembic downgrade -1
```

### Rollback to a Specific Revision

```bash
# Downgrade to a specific migration by its revision ID
uv run alembic downgrade abc123def456
```

### Check Current Migration State

```bash
# Show the current revision applied to the database
uv run alembic current

# Show all pending migrations (not yet applied)
uv run alembic history --indicate-current
```

### Show Migration History

```bash
# Full history
uv run alembic history

# Last 10 migrations
uv run alembic history -r -10:
```

## Creating a New Migration

### Auto-Generated Migration

Alembic can detect changes between your SQLAlchemy models and the current database schema, and auto-generate the migration:

```bash
uv run alembic revision --autogenerate -m "add targeting_rules column to products"
```

This creates a new file in `alembic/versions/` with an auto-generated `upgrade()` and `downgrade()` function. Always review the generated migration before applying it.

<div class="alert alert-info" role="alert">
  Auto-generation detects column additions, removals, type changes, index creation, and foreign key changes. It does <strong>not</strong> detect column renames, table renames, or data migrations. Those must be written manually.
</div>

### Manual Migration

For changes that auto-generation cannot detect (renames, data transformations, custom SQL):

```bash
uv run alembic revision -m "rename format_id to format_identifier"
```

This creates an empty migration file. Fill in the `upgrade()` and `downgrade()` functions manually:

```python
"""rename format_id to format_identifier

Revision ID: abc123def456
Revises: previous_revision_id
Create Date: 2026-03-09 10:00:00.000000
"""
from alembic import op

# revision identifiers
revision = "abc123def456"
down_revision = "previous_revision_id"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("products", "format_id", new_column_name="format_identifier")


def downgrade() -> None:
    op.alter_column("products", "format_identifier", new_column_name="format_id")
```

## Migration Best Practices

### Atomic Changes

Each migration should make one logical change. If you need to add a column and create an index, those can go in one migration. If you need to rename a table and add a new unrelated table, use two separate migrations.

### Always Write Downgrades

Every `upgrade()` must have a corresponding `downgrade()`. This enables rollback in production if a deployment fails. Auto-generated migrations include downgrades by default, but verify they are correct.

### Test Rollbacks

Before submitting a migration, verify that the upgrade/downgrade cycle works:

```bash
# Apply the new migration
uv run alembic upgrade head

# Roll it back
uv run alembic downgrade -1

# Apply it again
uv run alembic upgrade head
```

### Data Migrations

When you need to transform existing data (not just schema changes), use a data migration:

```python
from alembic import op
from sqlalchemy import text

def upgrade() -> None:
    # Add the new column
    op.add_column("products", sa.Column("status", sa.String(20), server_default="active"))

    # Backfill existing rows
    op.execute(text("UPDATE products SET status = 'active' WHERE status IS NULL"))

    # Now make it non-nullable
    op.alter_column("products", "status", nullable=False)


def downgrade() -> None:
    op.drop_column("products", "status")
```

<div class="alert alert-info" role="alert">
  For large tables, batch data migrations to avoid locking the table for extended periods. Use <code>op.execute()</code> with <code>LIMIT</code> and a loop, or run the data migration as a separate step outside of Alembic.
</div>

### Avoid Destructive Operations in Production

In production migrations, prefer these non-destructive patterns:

{: .table .table-bordered .table-striped }
| Instead of | Do this |
|-----------|---------|
| `DROP COLUMN` | Add a deprecation comment, remove in a later release |
| `ALTER COLUMN type` (incompatible) | Add a new column, migrate data, drop old column in separate steps |
| `DROP TABLE` | Rename to `_deprecated_<table>`, drop in a later release |
| `NOT NULL` on existing column | Add with a default value, backfill, then add the constraint |

## Common Migration Patterns

### Add a Column

```python
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.add_column("media_buys", sa.Column(
        "priority",
        sa.Integer(),
        nullable=True,
        server_default="0",
        comment="Campaign priority for delivery ordering"
    ))

def downgrade() -> None:
    op.drop_column("media_buys", "priority")
```

### Create a Table

```python
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.create_table(
        "campaign_notes",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("tenant_id", sa.String(36), nullable=False),
        sa.Column("media_buy_id", sa.String(36), nullable=False),
        sa.Column("author", sa.String(255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(
            ["tenant_id", "media_buy_id"],
            ["media_buys.tenant_id", "media_buys.id"],
        ),
    )

def downgrade() -> None:
    op.drop_table("campaign_notes")
```

### Add an Index

```python
from alembic import op

def upgrade() -> None:
    op.create_index(
        "ix_media_buys_status_start_date",
        "media_buys",
        ["status", "start_date"],
    )

def downgrade() -> None:
    op.drop_index("ix_media_buys_status_start_date", table_name="media_buys")
```

### Rename a Column

```python
from alembic import op

def upgrade() -> None:
    op.alter_column("products", "format_ids", new_column_name="format_identifiers")

def downgrade() -> None:
    op.alter_column("products", "format_identifiers", new_column_name="format_ids")
```

### Add an Enum Value

```python
from alembic import op

def upgrade() -> None:
    # PostgreSQL requires explicit ALTER TYPE for enums
    op.execute("ALTER TYPE media_buy_status ADD VALUE IF NOT EXISTS 'paused'")

def downgrade() -> None:
    # PostgreSQL does not support removing enum values
    # Document this as a one-way migration
    pass
```

## Auto-Run Behavior

### Docker Deployment

In the Docker deployment, migrations run automatically on startup via the `db-init` service defined in `docker-compose.yml`. The `db-init` container:

1. Waits for PostgreSQL to be ready.
2. Runs `alembic upgrade head`.
3. Exits successfully, allowing the main application container to start.

This ensures the database schema is always up to date before the application begins accepting requests.

### Skipping Auto-Run

To prevent migrations from running on startup (e.g., in a pre-production environment where you want manual control):

```bash
SKIP_MIGRATIONS=true docker compose up -d
```

Or set the environment variable in your `docker-compose.yml` override:

```yaml
services:
  db-init:
    environment:
      SKIP_MIGRATIONS: "true"
```

### CI Environment

In CI, migrations run against a fresh PostgreSQL service container. The `test.yml` workflow creates a temporary database and applies all migrations before running integration tests.

## Database Session Pattern

The Sales Agent provides a standardized context manager for database sessions, used throughout the codebase:

```python
from src.core.database.database_session import get_db_session

async def get_products_impl(identity: ResolvedIdentity, brief: str = None):
    async with get_db_session() as session:
        query = select(Product).where(Product.tenant_id == identity.tenant_id)
        result = await session.execute(query)
        products = result.scalars().all()
        return products
```

The `get_db_session()` context manager:

- Creates a new SQLAlchemy `AsyncSession`.
- Commits the transaction on successful exit.
- Rolls back the transaction on exception.
- Returns the connection to the pool on cleanup.

<div class="alert alert-info" role="alert">
  Always use <code>get_db_session()</code> for database access. Do not create sessions manually or use the engine directly. This ensures consistent transaction management and connection pooling across the application.
</div>

## Troubleshooting

### Migration Conflicts

When two developers create migrations from the same parent revision, Alembic detects a branch:

```text
FAILED: Multiple head revisions are present
```

To resolve:

```bash
# See the conflicting heads
uv run alembic heads

# Merge the branches
uv run alembic merge -m "merge migration branches" head1_id head2_id

# Apply the merge
uv run alembic upgrade head
```

### Pending Migrations on Startup

If the application fails to start with a message about pending migrations:

```bash
# Check what is pending
uv run alembic current
uv run alembic history --indicate-current

# Apply pending migrations
uv run alembic upgrade head
```

### Failed Migration (Partial Apply)

If a migration fails partway through, the database may be in an inconsistent state:

```bash
# Check current state
uv run alembic current

# If the failed migration left the alembic_version table pointing
# to a revision that was only partially applied, you may need to
# manually fix the database and stamp the correct version:
uv run alembic stamp <last_successful_revision>

# Then re-apply
uv run alembic upgrade head
```

### "Can't Locate Revision" Error

This occurs when the `alembic_version` table references a revision that no longer exists in the code (e.g., after a rebase or squash):

```bash
# Stamp the database to the current head, bypassing history checks
uv run alembic stamp head

# Or reset completely (development only)
dropdb salesagent_dev && createdb salesagent_dev && uv run alembic upgrade head
```

### Auto-Generate Produces Empty Migration

If `--autogenerate` creates a migration with empty `upgrade()` and `downgrade()` functions:

1. Verify that your model changes are imported in `alembic/env.py` via the `target_metadata` setting.
2. Check that you saved your model changes in `src/core/database/models.py`.
3. Ensure the database is up to date before generating: `uv run alembic upgrade head` first, then generate.

## Next Steps

- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Set up your local environment
- [Testing Guide](/agents/salesagent/developers/testing.html) -- Learn about the test suite
- [Contributing Guide](/agents/salesagent/developers/contributing.html) -- Branching, commits, and PR workflow
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- Database architecture details
