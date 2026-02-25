---
layout: page_v2
title: Prebid Sales Agent - Deployment - Single-Tenant Deployment
description: Step-by-step guide for deploying the Prebid Sales Agent as a single-tenant Docker Compose stack
sidebarType: 10
---

# Single-Tenant Deployment
{: .no_toc}

This guide walks you through deploying the Prebid Sales Agent for a single publisher using Docker Compose. The stack bundles PostgreSQL, the Sales Agent application, and an optional Nginx reverse proxy -- everything you need to run in production.

- TOC
{:toc}

## Architecture

The Docker Compose stack includes four services that work together:

```text
┌──────────────────────────────────────────────────────────┐
│                   Nginx (reverse proxy)                   │
│              Port 80/443 → upstream :8000                 │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────┐
│                  adcp-server (Sales Agent)                │
│                      Port 8000                           │
│   ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│   │ Admin UI │  │MCP Server│  │   A2A Server       │    │
│   │ (Flask)  │  │(FastMCP) │  │   (JSON-RPC)       │    │
│   └──────────┘  └──────────┘  └────────────────────┘    │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────┐
│                    PostgreSQL 16                          │
│                      Port 5432                           │
│              Volume: postgres_data                        │
└──────────────────────────────────────────────────────────┘
```

{: .table .table-bordered .table-striped }
| Service | Role | Port | Notes |
|---------|------|------|-------|
| `postgres` | Database | 5432 (internal) | PostgreSQL 16, persistent volume |
| `adcp-server` | Sales Agent application | 8000 | MCP, A2A, Admin UI, health check |
| `nginx` | Reverse proxy | 80, 443 | SSL termination, custom domain routing |

## Prerequisites

{: .table .table-bordered .table-striped }
| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| Docker | 20.10+ | [Install Docker](https://docs.docker.com/get-docker/) |
| Docker Compose | 2.0+ | Included with Docker Desktop |
| Git | 2.0+ | To clone the repository |

{: .alert.alert-info :}
No Python, Node.js, or other runtime is needed. Everything runs inside Docker containers.

## Step 1: Clone and Configure

Clone the repository and create your environment configuration:

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
cp .env.template .env
```

### Essential Environment Variables

Edit the `.env` file with your configuration. The following variables are the most important:

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Auto-configured | `postgresql://salesagent:salesagent@postgres:5432/salesagent` | Set automatically by Docker Compose; override only if using an external database |
| `ENCRYPTION_KEY` | Yes | None | Fernet symmetric key for encrypting API keys and adapter credentials |
| `ADCP_AUTH_TEST_MODE` | No | `false` | Set to `true` for evaluation only; enables test credentials |
| `CREATE_DEMO_TENANT` | No | `false` | Creates a demo tenant with sample data on first boot |

Generate an encryption key:

```bash
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Or if you do not have Python installed locally:

```bash
docker run --rm python:3.12-slim python -c "
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
"
```

{: .alert.alert-danger :}
Store your `ENCRYPTION_KEY` securely. If lost, all encrypted data (API keys, adapter credentials) becomes unrecoverable. Back it up outside of the deployment directory.

## Step 2: Start the Stack

Launch all services in the background:

```bash
docker compose up -d
```

Docker Compose will:
1. Pull the latest `ghcr.io/prebid/salesagent` image
2. Start PostgreSQL and wait for it to become healthy
3. Run database migrations automatically
4. Start the Sales Agent application

First startup may take 30-60 seconds while the database initializes and migrations run.

## Step 3: Verify Services

Confirm that all services are running and healthy:

```bash
# Check container status
docker compose ps

# Verify health endpoint
curl http://localhost:8000/health
```

Expected health response:

```json
{"status": "ok"}
```

Verify all endpoints are accessible:

{: .table .table-bordered .table-striped }
| Service | URL | Expected Result |
|---------|-----|-----------------|
| Admin UI | `http://localhost:8000/admin` | Login page or setup wizard |
| MCP Server | `http://localhost:8000/mcp/` | MCP endpoint (requires auth) |
| A2A Server | `http://localhost:8000/a2a` | A2A endpoint (requires auth) |
| Health Check | `http://localhost:8000/health` | `{"status": "ok"}` |
| Agent Card | `http://localhost:8000/.well-known/agent.json` | JSON agent descriptor |

## Step 4: First-Time Setup

### Setup Mode

On first launch with no tenants configured, the Sales Agent enters **Setup Mode**. This provides a guided workflow to create your first publisher tenant.

1. Navigate to `http://localhost:8000/admin`
2. If `ADCP_AUTH_TEST_MODE=true`, log in with password `test123`
3. The setup wizard walks you through creating your first tenant
4. Configure your publisher name, domain, and ad server adapter

### Test Credentials

When `ADCP_AUTH_TEST_MODE=true`, the following credentials are available for evaluation:

{: .table .table-bordered .table-striped }
| Credential | Value | Purpose |
|------------|-------|---------|
| Admin UI password | `test123` | Access the admin dashboard |
| MCP auth token | `test-token` | Authenticate MCP tool calls |
| A2A bearer token | `test-token` | Authenticate A2A requests |

{: .alert.alert-warning :}
Test credentials must be disabled before going to production. Remove `ADCP_AUTH_TEST_MODE` from your `.env` file and configure SSO authentication instead.

### Configure SSO

For production use, replace test credentials with OAuth:

1. Go to `/admin` and navigate to **Settings > SSO Configuration**
2. Choose your identity provider (Google, Microsoft, Okta, Auth0, or Keycloak)
3. Enter the Client ID and Client Secret from your IdP
4. Set the callback URL to `https://yourdomain.com/admin/auth/callback`
5. Save and test the login flow

See the [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) for detailed SSO configuration instructions.

## Step 5: Custom Domain Configuration

To serve the Sales Agent on your own domain (e.g., `ads.yourpublisher.com`):

1. Point your domain's DNS to the server running the Sales Agent (A record or CNAME)
2. Update the Nginx configuration in `nginx.conf` with your domain:

```nginx
server {
    listen 80;
    server_name ads.yourpublisher.com;

    location / {
        proxy_pass http://adcp-server:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Update the tenant's custom domain in the Admin UI under **Settings > Custom Domain**

## Step 6: SSL/TLS Setup

{: .alert.alert-danger :}
HTTPS is mandatory for production deployments. The Sales Agent enforces HTTPS for all non-localhost connections.

### Using Let's Encrypt with Certbot

The recommended approach for SSL is Let's Encrypt with automatic certificate renewal:

```bash
# Install certbot (example for Ubuntu)
sudo apt install certbot python3-certbot-nginx

# Obtain and configure certificate
sudo certbot --nginx -d ads.yourpublisher.com
```

Certbot will automatically update your Nginx configuration to handle SSL termination and redirect HTTP to HTTPS.

### Using a Custom Certificate

If you have an existing certificate, configure Nginx manually:

```nginx
server {
    listen 443 ssl;
    server_name ads.yourpublisher.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://adcp-server:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

## Common Operations

### Viewing Logs

```bash
# Follow all service logs
docker compose logs -f

# View only the Sales Agent logs
docker compose logs -f adcp-server

# View only PostgreSQL logs
docker compose logs -f postgres

# View last 100 lines
docker compose logs --tail=100 adcp-server
```

### Stopping and Starting

```bash
# Stop all services (data preserved)
docker compose down

# Start all services
docker compose up -d

# Restart only the Sales Agent (e.g., after config change)
docker compose restart adcp-server
```

### Rebuilding

When updating to a new version:

```bash
# Pull latest images
docker compose pull

# Restart with new images
docker compose up -d
```

Migrations run automatically on startup, so database schema updates are applied when the new image boots.

### Resetting the Database

{: .alert.alert-danger :}
This destroys all data including tenants, products, advertisers, campaigns, and audit logs. Use only for fresh starts during evaluation.

```bash
# Stop services and remove data volumes
docker compose down -v

# Start fresh
docker compose up -d
```

## Troubleshooting

### Container Fails to Start

```bash
docker compose logs adcp-server
```

Common issues:

{: .table .table-bordered .table-striped }
| Symptom | Cause | Fix |
|---------|-------|-----|
| `connection refused` on database | PostgreSQL not ready | Wait 30 seconds and retry; check `docker compose ps` |
| `ENCRYPTION_KEY not set` | Missing environment variable | Add `ENCRYPTION_KEY` to `.env` file |
| Port 8000 already in use | Another service on that port | Stop the conflicting service or change the port in `docker-compose.yml` |
| Migration errors | Database schema conflict | Reset with `docker compose down -v && docker compose up -d` |

### MCP Returns 401 Unauthorized

Ensure you are passing the auth token in the correct header format:

```bash
# MCP uses x-adcp-auth header
curl -H "x-adcp-auth: test-token" http://localhost:8000/mcp/

# A2A uses Authorization: Bearer header
curl -H "Authorization: Bearer test-token" http://localhost:8000/a2a
```

### Health Check Returns Unhealthy

The `/health` endpoint checks database connectivity. Verify PostgreSQL is running:

```bash
docker compose ps postgres
docker compose logs postgres
```

## Next Steps

- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Configure products, advertisers, and settings
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- End-to-end publisher setup
- [Security Model](/agents/salesagent/operations/security.html) -- Authentication, encryption, and access control
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Compare all deployment options
