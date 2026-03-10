---
layout: page_v2
title: Prebid Sales Agent - Single-Tenant Deployment
description: Deploy a single-publisher Prebid Sales Agent instance using Docker Compose
sidebarType: 10
---

# Prebid Sales Agent - Single-Tenant Deployment
{: .no_toc}

- TOC
{:toc}

## Overview

Single-tenant mode is the default deployment configuration. It serves one publisher with path-based routing -- no subdomain resolution or wildcard DNS is required. This is the fastest way to get a production-ready Sales Agent running.

In this mode:

- `ADCP_MULTI_TENANT` is `false` (or unset)
- All endpoints are accessed on a single domain (e.g., `https://adcp.yourcompany.com`)
- The MCP, A2A, REST API, and Admin UI are distinguished by URL path (`/mcp`, `/a2a`, `/api/v1`, `/admin`)

## Prerequisites

- Docker 20.10+ and Docker Compose v2
- A domain name (optional but recommended for production)
- 2 GB RAM available for containers

## Docker Compose Setup

Create a `docker-compose.yml` file with the following services:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: adcp_sales
      POSTGRES_USER: adcp
      POSTGRES_PASSWORD: changeme
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U adcp -d adcp_sales"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-init:
    image: adcp-sales-agent:latest
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql+asyncpg://adcp:changeme@postgres:5432/adcp_sales
    command: ["python", "-m", "alembic", "upgrade", "head"]
    restart: "no"

  adcp-server:
    image: adcp-sales-agent:latest
    depends_on:
      db-init:
        condition: service_completed_successfully
    ports:
      - "8080:8080"
      - "8001:8001"
    environment:
      DATABASE_URL: postgresql+asyncpg://adcp:changeme@postgres:5432/adcp_sales
      DATABASE_QUERY_TIMEOUT: "30"
      DATABASE_CONNECT_TIMEOUT: "10"
      ADCP_SALES_PORT: "8080"
      ADCP_SALES_HOST: "0.0.0.0"
      ENVIRONMENT: production
      PRODUCTION: "true"
      ADCP_MULTI_TENANT: "false"
      ADCP_AUTH_TEST_MODE: "false"
      CREATE_DEMO_TENANT: "true"
      SKIP_MIGRATIONS: "true"
      ENCRYPTION_KEY: ""  # Auto-generated on first run; set explicitly for persistence
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  proxy:
    image: nginx:alpine
    depends_on:
      adcp-server:
        condition: service_healthy
    ports:
      - "8000:8000"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

volumes:
  pgdata:
```

<div class="alert alert-info" role="alert">
Set <code>CREATE_DEMO_TENANT=true</code> on first run to automatically create a demo tenant with sample products. Set it to <code>false</code> after initial setup.
</div>

Create a corresponding `.env` file for sensitive values:

```bash
DATABASE_URL=postgresql+asyncpg://adcp:changeme@postgres:5432/adcp_sales
ENCRYPTION_KEY=your-fernet-key-here
ENVIRONMENT=production
```

### Starting the Services

```bash
docker compose up -d
```

Verify all services are healthy:

```bash
docker compose ps
curl http://localhost:8080/health
```

## First-Time Configuration

After the services are running, complete the following steps to configure your publisher instance.

### 1. Access the Admin UI

Open `http://localhost:8000/admin` in your browser. If `ADCP_AUTH_TEST_MODE=true`, you can log in without OAuth credentials. For production, configure Google OAuth (see below).

### 2. Create a Tenant

If `CREATE_DEMO_TENANT=true`, a demo tenant is created automatically. Otherwise, create one through the Admin UI:

1. Navigate to **Tenants** in the sidebar
2. Click **Create Tenant**
3. Enter a name, subdomain (used as identifier even in single-tenant mode), and contact details
4. Save the tenant

### 3. Configure the Ad Server Adapter

1. Navigate to **Settings** > **Ad Server**
2. Select your adapter (GAM, Kevel, Triton, Broadstreet, or Mock)
3. Enter the adapter credentials (e.g., GAM network code, OAuth client ID/secret)
4. Test the connection

### 4. Set Up Admin Authentication

For production deployments, configure Google OAuth:

```yaml
environment:
  GAM_OAUTH_CLIENT_ID: "your-client-id.apps.googleusercontent.com"
  GAM_OAUTH_CLIENT_SECRET: "your-client-secret"
```

Then configure SSO in the Admin UI under **Settings** > **SSO**.

### 5. Create a Principal (Advertiser)

1. Navigate to **Advertisers** in the sidebar
2. Click **Create Advertiser**
3. Enter advertiser details and generate an auth token
4. Save the token -- it is only displayed once

## Custom Domain Configuration

For production, configure a custom domain with TLS using the nginx reverse proxy.

### nginx Server Block

Create an `nginx.conf` that routes traffic to the Sales Agent:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream adcp_backend {
        server adcp-server:8080;
    }

    server {
        listen 8000;
        server_name adcp.yourcompany.com;

        location / {
            proxy_pass http://adcp_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # SSE support for activity stream
        location /admin/activity/stream {
            proxy_pass http://adcp_backend;
            proxy_set_header Host $host;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_buffering off;
            proxy_cache off;
        }
    }
}
```

### SSL with Let's Encrypt

For HTTPS, add a TLS server block:

```nginx
server {
    listen 443 ssl;
    server_name adcp.yourcompany.com;

    ssl_certificate /etc/letsencrypt/live/adcp.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/adcp.yourcompany.com/privkey.pem;

    location / {
        proxy_pass http://adcp_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 80;
    server_name adcp.yourcompany.com;
    return 301 https://$server_name$request_uri;
}
```

## Backup Strategy

### Database Backups

Use `pg_dump` to back up the PostgreSQL database:

```bash
# One-time backup
docker compose exec postgres pg_dump -U adcp adcp_sales > backup_$(date +%Y%m%d).sql

# Restore from backup
docker compose exec -T postgres psql -U adcp adcp_sales < backup_20250101.sql
```

### Automated Backups

Add a cron job on the host to run daily backups:

```bash
# /etc/cron.d/adcp-backup
0 2 * * * root docker compose -f /path/to/docker-compose.yml exec -T postgres pg_dump -U adcp adcp_sales | gzip > /backups/adcp_$(date +\%Y\%m\%d).sql.gz
```

### What to Back Up

| Item | Method | Frequency |
| --- | --- | --- |
| PostgreSQL database | `pg_dump` | Daily |
| `.env` file | File copy | On change |
| `ENCRYPTION_KEY` | Secure vault | On change (critical -- data is unrecoverable without it) |
| nginx configuration | File copy / version control | On change |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
The <code>ENCRYPTION_KEY</code> is essential for decrypting sensitive fields in the database. If you lose this key, encrypted data (API keys, OAuth credentials, webhook secrets) cannot be recovered. Store it in a secure vault or secrets manager.
</div>

## Upgrading

To upgrade to a new version of the Sales Agent:

```bash
# Pull the latest image
docker compose pull

# Restart services (migrations run automatically via db-init)
docker compose up -d
```

The `db-init` service runs Alembic migrations automatically before the main application starts. There are 150+ migration files that bring the database schema up to date.

To verify the upgrade:

```bash
docker compose ps
curl http://localhost:8080/health
```

## Troubleshooting

### Container fails to start

Check the logs for the failing service:

```bash
docker compose logs adcp-server
docker compose logs db-init
```

Common causes:

- **Database not ready**: Ensure the `postgres` service is healthy before `db-init` runs. The `depends_on` condition handles this, but check `docker compose logs postgres` if issues persist.
- **Migration failure**: Check `docker compose logs db-init` for Alembic errors. A failed migration may require manual intervention.
- **Port conflict**: Ensure ports 5432, 8000, 8080, 8001, and 8091 are not in use by other services.

### Health check fails

```bash
curl -v http://localhost:8080/health
```

If the health endpoint returns an error, the most likely cause is a database connectivity issue. Verify:

```bash
docker compose exec adcp-server python -c "import asyncio; print('Python OK')"
docker compose exec postgres pg_isready -U adcp
```

### Cannot access Admin UI

- Verify nginx is running: `docker compose logs proxy`
- Check that port 8000 is exposed: `docker compose port proxy 8000`
- If using OAuth, verify `GAM_OAUTH_CLIENT_ID` and `GAM_OAUTH_CLIENT_SECRET` are set
- For initial testing, set `ADCP_AUTH_TEST_MODE=true` to bypass OAuth

### Database connection errors

- Verify `DATABASE_URL` uses the correct hostname (`postgres` inside Docker network, `localhost` if accessing from host)
- Check `DATABASE_CONNECT_TIMEOUT` (default: 10 seconds)
- Check `DATABASE_QUERY_TIMEOUT` (default: 30 seconds)
- If using PgBouncer, set `USE_PGBOUNCER=true`
