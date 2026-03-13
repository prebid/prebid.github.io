---
layout: page_v2
title: Prebid Sales Agent - Configuration Reference
description: Complete reference for environment variables, Docker Compose, nginx, and per-tenant settings for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Configuration Reference
{: .no_toc}

- TOC
{:toc}

## Environment Variables

The Sales Agent is configured primarily through environment variables. This section documents every variable organized by category.

### Database

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (required) | PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/dbname`) |
| `DATABASE_QUERY_TIMEOUT` | `30` | Maximum seconds for a single database query before timeout |
| `DATABASE_CONNECT_TIMEOUT` | `10` | Maximum seconds to wait for a database connection from the pool |
| `USE_PGBOUNCER` | `false` | Set to `true` if connecting through PgBouncer; adjusts connection pooling behavior |

### Server

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `ADCP_SALES_PORT` | `8080` | Port the FastAPI application listens on (nginx proxies to this port) |
| `ADCP_SALES_HOST` | `0.0.0.0` | Host address the application binds to |
| `ENVIRONMENT` | `development` | Environment name used for logging and configuration (e.g., `development`, `staging`, `production`) |
| `PRODUCTION` | `false` | Set to `true` for production deployments; enables stricter security defaults |

### Multi-Tenant

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `ADCP_MULTI_TENANT` | `false` | Enable multi-tenant mode with subdomain-based routing |
| `SALES_AGENT_DOMAIN` | (none) | Full domain for the Sales Agent (e.g., `salesagent.example.com`) |
| `BASE_DOMAIN` | (none) | Base domain for tenant subdomains (e.g., `example.com`; tenants get `tenant1.example.com`) |

### Authentication

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `ADCP_AUTH_TEST_MODE` | `false` | Enable test authentication mode with pre-configured credentials. **Never enable in production.** |
| `CREATE_DEMO_TENANT` | `false` | Automatically create a demo tenant with sample data on startup |
| `SUPER_ADMIN_EMAILS` | (none) | Comma-separated list of email addresses granted super admin access (e.g., `admin@co.com,ops@co.com`) |
| `SUPER_ADMIN_DOMAINS` | (none) | Comma-separated list of email domains granted super admin access (e.g., `yourcompany.com`) |

### Google Ad Manager

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `GAM_OAUTH_CLIENT_ID` | (none) | Google OAuth 2.0 client ID for Ad Manager API access |
| `GAM_OAUTH_CLIENT_SECRET` | (none) | Google OAuth 2.0 client secret for Ad Manager API access |
| `GCP_PROJECT_ID` | (none) | Google Cloud project ID associated with the Ad Manager API |
| `GOOGLE_APPLICATION_CREDENTIALS` | (none) | Path to the GCP service account JSON key file |

### AI and Observability

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | (none) | Google Gemini API key for AI agents (naming, review, ranking, policy) |
| `LOGFIRE_TOKEN` | (none) | [Logfire](https://logfire.pydantic.dev/) token for structured observability and tracing |

<div class="alert alert-info" role="alert">
  AI provider, model, and API key can also be configured per-tenant through the Admin UI, overriding these environment variables. This allows each publisher to use their own AI provider and control costs independently.
</div>

### Security

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `ENCRYPTION_KEY` | (none) | Fernet encryption key for encrypting sensitive configuration values in the database (e.g., adapter credentials). Generate with `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
| `FLASK_SECRET_KEY` | (none) | Secret key for Flask session signing in the Admin UI. Use a strong random string. |
| `WEBHOOK_SECRET` | (none) | Shared secret for verifying A2A push notification webhook signatures |

### Service Control

{: .table .table-bordered .table-striped }
| Variable | Default | Description |
|----------|---------|-------------|
| `SKIP_MIGRATIONS` | `false` | Skip Alembic database migrations on startup. Useful when running migrations separately. |
| `SKIP_NGINX` | `false` | Skip starting the nginx reverse proxy. Use when nginx is managed externally. |
| `SKIP_CRON` | `false` | Skip starting background cron jobs (e.g., delivery metric syncing) |

## Docker Compose Configuration

The default `docker-compose.yml` provides a complete development environment. Here is an annotated example:

```yaml
version: "3.8"

services:
  salesagent:
    build: .
    ports:
      - "8000:8000"            # nginx reverse proxy
    environment:
      # Database
      DATABASE_URL: postgresql://salesagent:salesagent@postgres:5432/salesagent

      # Server
      ENVIRONMENT: development
      ADCP_SALES_PORT: "8080"
      ADCP_SALES_HOST: "0.0.0.0"

      # Auth (test mode for development)
      ADCP_AUTH_TEST_MODE: "true"
      CREATE_DEMO_TENANT: "true"
      SUPER_ADMIN_EMAILS: "test_super_admin@example.com"

      # Security (development values — replace in production)
      ENCRYPTION_KEY: "dev-encryption-key-replace-in-prod"
      FLASK_SECRET_KEY: "dev-flask-secret-replace-in-prod"

      # AI (optional)
      # GEMINI_API_KEY: "your-gemini-key"

      # Observability (optional)
      # LOGFIRE_TOKEN: "your-logfire-token"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: salesagent
      POSTGRES_PASSWORD: salesagent
      POSTGRES_DB: salesagent
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U salesagent"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Production Overrides

For production, create a `docker-compose.prod.yml` override:

```yaml
version: "3.8"

services:
  salesagent:
    environment:
      ENVIRONMENT: production
      PRODUCTION: "true"
      ADCP_AUTH_TEST_MODE: "false"
      CREATE_DEMO_TENANT: "false"

      # Real credentials
      SUPER_ADMIN_EMAILS: "admin@yourpublisher.com"
      ENCRYPTION_KEY: "${ENCRYPTION_KEY}"
      FLASK_SECRET_KEY: "${FLASK_SECRET_KEY}"
      DATABASE_URL: "${DATABASE_URL}"

      # Ad server (example: GAM)
      GAM_OAUTH_CLIENT_ID: "${GAM_OAUTH_CLIENT_ID}"
      GAM_OAUTH_CLIENT_SECRET: "${GAM_OAUTH_CLIENT_SECRET}"
      GCP_PROJECT_ID: "${GCP_PROJECT_ID}"
      GOOGLE_APPLICATION_CREDENTIALS: /secrets/gcp-sa.json

      # AI
      GEMINI_API_KEY: "${GEMINI_API_KEY}"
    volumes:
      - ./secrets/gcp-sa.json:/secrets/gcp-sa.json:ro
```

Run with:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Nginx Configuration

The Sales Agent includes an nginx reverse proxy that handles TLS termination, streaming support, and path-based routing to the FastAPI application.

### Default Configuration

nginx listens on port 8000 and proxies to the FastAPI app on port 8080:

```nginx
upstream app {
    server 127.0.0.1:8080;
}

server {
    listen 8000;

    # Streaming support — disable buffering for streaming responses
    proxy_buffering off;
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;

    # MCP endpoint (StreamableHTTP transport)
    location /mcp/ {
        proxy_pass http://app/mcp/;
        proxy_read_timeout 86400s;    # 24h for long-lived streaming connections
        proxy_send_timeout 86400s;
    }

    # A2A endpoint
    location /a2a {
        proxy_pass http://app/a2a;
    }

    # Admin UI
    location /admin {
        proxy_pass http://app/admin;
    }

    # REST API
    location /api/ {
        proxy_pass http://app/api/;
    }

    # Health check
    location /health {
        proxy_pass http://app/health;
    }

    # Agent Card (A2A discovery)
    location /.well-known/ {
        proxy_pass http://app/.well-known/;
    }

    # Landing pages
    location / {
        proxy_pass http://app/;
    }
}
```

### SSL/TLS Configuration

For production deployments with SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name salesagent.yourpublisher.com;

    ssl_certificate /etc/ssl/certs/salesagent.crt;
    ssl_certificate_key /etc/ssl/private/salesagent.key;

    # ... same proxy configuration as above ...
}

server {
    listen 80;
    server_name salesagent.yourpublisher.com;
    return 301 https://$host$request_uri;
}
```

### Streaming Considerations

The MCP protocol uses StreamableHTTP for streaming. Key nginx settings for streaming responses:

- `proxy_buffering off` — Disables response buffering so streaming events are forwarded immediately.
- `proxy_cache off` — Prevents caching of streaming responses.
- `proxy_read_timeout 86400s` — Allows long-lived streaming connections (24 hours).
- `proxy_http_version 1.1` — Required for chunked transfer encoding.
- `Connection ''` — Prevents nginx from closing the connection prematurely.

<div class="alert alert-info" role="alert">
  If you skip the built-in nginx (<code>SKIP_NGINX=true</code>) and use an external reverse proxy (e.g., Cloudflare, AWS ALB), ensure it supports streaming responses with the settings above. Many CDNs buffer responses by default, which breaks streaming.
</div>

## Per-Tenant Configuration via Admin UI

Many settings are configurable per-tenant through the Admin UI, allowing each publisher to customize their Sales Agent independently.

### Ad Server Adapter

Configured under **Settings > Ad Server**:

- **Adapter selection**: Choose from GAM, Kevel, Triton Digital, Broadstreet, or Mock.
- **Connection credentials**: Adapter-specific fields validated by the adapter's `connection_config_class`.
- **Default channels**: Override the adapter's default media channels.

### SSO / Authentication

Configured under **Settings > Authentication**:

- **OIDC Provider**: Google, Microsoft, Okta, Auth0, or Keycloak.
- **Client ID and Secret**: OAuth application credentials.
- **Provider-specific settings**: Tenant ID (Microsoft), domain (Okta/Auth0), realm URL (Keycloak).

### AI Agents

Configured under **Settings > AI**:

- **Provider**: AI model provider (e.g., Google Gemini, OpenAI).
- **Model**: Specific model version (e.g., `gemini-2.0-flash`, `gpt-4o`).
- **API Key**: Tenant's own API key for cost isolation.
- **Creative review thresholds**: Auto-approve and auto-reject confidence scores.

### Advertising Policies

Configured under **Settings > Policies**:

- **Blocked categories**: IAB content categories to reject.
- **Blocked brands**: Specific advertiser names or domains.
- **Blocked tactics**: Prohibited ad tactics.

### Naming Templates

Configured under **Settings > Naming**:

- **Campaign naming template**: Pattern for AI-generated campaign names (e.g., `{advertiser}_{product}_{date}`).
- **Creative naming template**: Pattern for creative asset names.

### Measurement Providers

Configured under **Settings > Measurement**:

- **Viewability provider**: Third-party viewability measurement integration.
- **Verification provider**: Ad verification service configuration.

## Example .env Files

### Development

```bash
# Database
DATABASE_URL=postgresql://salesagent:salesagent@localhost:5432/salesagent

# Server
ENVIRONMENT=development
ADCP_SALES_PORT=8080
ADCP_SALES_HOST=0.0.0.0

# Auth (test mode)
ADCP_AUTH_TEST_MODE=true
CREATE_DEMO_TENANT=true
SUPER_ADMIN_EMAILS=test_super_admin@example.com

# Security (development values)
ENCRYPTION_KEY=dev-only-encryption-key-32-chars!!
FLASK_SECRET_KEY=dev-only-flask-secret-key

# AI (optional for development)
# GEMINI_API_KEY=your-dev-gemini-key

# Observability (optional)
# LOGFIRE_TOKEN=your-dev-logfire-token
```

### Production

```bash
# Database
DATABASE_URL=postgresql://salesagent:STRONG_PASSWORD@db.internal:5432/salesagent
DATABASE_QUERY_TIMEOUT=30
DATABASE_CONNECT_TIMEOUT=10
USE_PGBOUNCER=true

# Server
ENVIRONMENT=production
PRODUCTION=true
ADCP_SALES_PORT=8080
ADCP_SALES_HOST=0.0.0.0

# Multi-Tenant (optional)
# ADCP_MULTI_TENANT=true
# SALES_AGENT_DOMAIN=salesagent.yourpublisher.com
# BASE_DOMAIN=yourpublisher.com

# Auth
ADCP_AUTH_TEST_MODE=false
CREATE_DEMO_TENANT=false
SUPER_ADMIN_EMAILS=admin@yourpublisher.com,ops@yourpublisher.com

# Google Ad Manager (if using GAM adapter)
GAM_OAUTH_CLIENT_ID=your-production-client-id
GAM_OAUTH_CLIENT_SECRET=your-production-client-secret
GCP_PROJECT_ID=your-gcp-project
GOOGLE_APPLICATION_CREDENTIALS=/secrets/gcp-service-account.json

# AI
GEMINI_API_KEY=your-production-gemini-key

# Security (use strong random values)
ENCRYPTION_KEY=generate-with-fernet-generate-key
FLASK_SECRET_KEY=generate-with-python-secrets-module
WEBHOOK_SECRET=generate-with-python-secrets-module

# Observability
LOGFIRE_TOKEN=your-production-logfire-token

# Service Control
SKIP_MIGRATIONS=false
SKIP_NGINX=false
SKIP_CRON=false
```

<div class="alert alert-info" role="alert">
  Never commit <code>.env</code> files containing real credentials to version control. Use a secrets manager (e.g., Docker secrets, HashiCorp Vault, AWS Secrets Manager) for production deployments.
</div>

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Get running with default configuration
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) — Step-by-step publisher setup
- [Architecture & Protocols](/agents/salesagent/architecture.html) — System design and protocol details
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) — Production deployment guides
