---
layout: page_v2
title: Prebid Sales Agent - Getting Started - Configuration
description: Complete configuration reference for the Prebid Sales Agent including environment variables, Docker Compose, and Nginx setup
sidebarType: 10
---

# Configuration Reference
{: .no_toc}

This page documents all configuration options for the Prebid Sales Agent, including environment variables, Docker Compose settings, Nginx reverse proxy configuration, and runtime feature flags.

- TOC
{:toc}

## Environment Variables

The Sales Agent is configured primarily through environment variables. These can be set in a `.env` file, passed directly to Docker, or configured in your orchestration platform.

### Core Settings

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | -- | PostgreSQL connection string. Format: `postgresql://user:pass@host:5432/dbname` |
| `ENCRYPTION_KEY` | Yes | -- | Secret key for encrypting sensitive data at rest. Must be 32+ characters. Generate with `openssl rand -hex 32` |
| `SALES_AGENT_DOMAIN` | Yes (prod) | `localhost:8000` | Public domain of the Sales Agent. Used for OAuth callbacks and agent card URLs |
| `ENVIRONMENT` | No | `development` | Runtime environment. Set to `production` for production logging, security headers, and error handling |

{: .alert.alert-danger :}
The `ENCRYPTION_KEY` is used to encrypt ad server credentials and API tokens in the database. Losing this key means losing access to all encrypted data. Back it up securely.

### Multi-Tenant Configuration

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADCP_MULTI_TENANT` | No | `true` | Enable multi-tenant mode. When `false`, the system operates as a single publisher |

### Authentication and Access Control

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPER_ADMIN_EMAILS` | No | -- | Comma-separated list of email addresses granted super admin access. Example: `admin@pub.com,ops@pub.com` |
| `SUPER_ADMIN_DOMAINS` | No | -- | Comma-separated list of email domains. All users with matching email domains get super admin access. Example: `publisher.com` |
| `ADCP_AUTH_TEST_MODE` | No | `false` | Enable test authentication mode. Accepts `test-token` for all endpoints. **Never enable in production** |

{: .alert.alert-warning :}
`ADCP_AUTH_TEST_MODE=true` bypasses all authentication. This is intended only for local development and testing.

### OAuth / SSO Providers

Configure one or more OAuth providers for admin UI authentication.

#### Google

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OAUTH_GOOGLE_CLIENT_ID` | No | -- | Google OAuth 2.0 client ID |
| `OAUTH_GOOGLE_CLIENT_SECRET` | No | -- | Google OAuth 2.0 client secret |

#### Microsoft

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OAUTH_MICROSOFT_CLIENT_ID` | No | -- | Microsoft / Azure AD application ID |
| `OAUTH_MICROSOFT_CLIENT_SECRET` | No | -- | Microsoft / Azure AD client secret |

#### Okta

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OAUTH_OKTA_CLIENT_ID` | No | -- | Okta OAuth client ID |
| `OAUTH_OKTA_CLIENT_SECRET` | No | -- | Okta OAuth client secret |
| `OAUTH_OKTA_DOMAIN` | No | -- | Okta organization domain. Example: `your-org.okta.com` |

#### Auth0

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OAUTH_AUTH0_CLIENT_ID` | No | -- | Auth0 application client ID |
| `OAUTH_AUTH0_CLIENT_SECRET` | No | -- | Auth0 application client secret |
| `OAUTH_AUTH0_DOMAIN` | No | -- | Auth0 tenant domain. Example: `your-tenant.auth0.com` |

#### Keycloak

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OAUTH_KEYCLOAK_CLIENT_ID` | No | -- | Keycloak client ID |
| `OAUTH_KEYCLOAK_CLIENT_SECRET` | No | -- | Keycloak client secret |
| `OAUTH_KEYCLOAK_URL` | No | -- | Keycloak realm URL. Example: `https://keycloak.example.com/realms/myrealm` |

### Google Ad Manager (GAM) Integration

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GAM_OAUTH_CLIENT_ID` | No | -- | GAM API OAuth client ID |
| `GAM_OAUTH_CLIENT_SECRET` | No | -- | GAM API OAuth client secret |
| `GAM_OAUTH_REFRESH_TOKEN` | No | -- | GAM API OAuth refresh token for offline access |
| `GAM_NETWORK_CODE` | No | -- | GAM network code (numeric ID) |

{: .alert.alert-info :}
When GAM credentials are not configured, the Sales Agent falls back to the mock adapter, which simulates ad server responses for development and testing.

### AI and Search

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | No | -- | Google Gemini API key for AI-powered product search and RAG capabilities |

### Development and Testing

{: .table .table-bordered .table-striped }
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CREATE_DEMO_TENANT` | No | `false` | Automatically create a demo publisher tenant with sample products and advertisers on startup |
| `ADCP_AUTH_TEST_MODE` | No | `false` | Accept `test-token` for authentication on all endpoints |

## Example .env File

A minimal `.env` file for local development:

```bash
# Database
DATABASE_URL=postgresql://salesagent:salesagent@localhost:5432/salesagent

# Security
ENCRYPTION_KEY=your-random-32-character-encryption-key-here

# Domain
SALES_AGENT_DOMAIN=localhost:8000

# Development
CREATE_DEMO_TENANT=true
ADCP_AUTH_TEST_MODE=true
ENVIRONMENT=development
```

A production `.env` file:

```bash
# Database
DATABASE_URL=postgresql://user:securepassword@db.internal:5432/salesagent

# Security
ENCRYPTION_KEY=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Domain
SALES_AGENT_DOMAIN=sales.publisher.com
ENVIRONMENT=production

# Multi-tenant
ADCP_MULTI_TENANT=true

# Access control
SUPER_ADMIN_EMAILS=admin@publisher.com
SUPER_ADMIN_DOMAINS=publisher.com

# OAuth (Google)
OAUTH_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret

# Google Ad Manager
GAM_OAUTH_CLIENT_ID=your-gam-client-id
GAM_OAUTH_CLIENT_SECRET=your-gam-secret
GAM_OAUTH_REFRESH_TOKEN=your-refresh-token
GAM_NETWORK_CODE=12345678

# AI
GEMINI_API_KEY=your-gemini-api-key
```

{: .alert.alert-danger :}
Never commit `.env` files to version control. Add `.env` to your `.gitignore` file.

## Docker Compose Configuration

The default `docker-compose.yml` starts both the Sales Agent and a PostgreSQL database:

```yaml
services:
  salesagent:
    image: ghcr.io/prebid/salesagent:latest
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: salesagent
      POSTGRES_PASSWORD: salesagent
      POSTGRES_DB: salesagent
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U salesagent"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
```

### Key Docker Compose Options

{: .table .table-bordered .table-striped }
| Setting | Description |
|---------|-------------|
| `env_file` | Path to your `.env` file with environment variables |
| `ports` | Map container port 8000 to a host port |
| `depends_on` with `service_healthy` | Ensures the database is ready before starting the Sales Agent |
| `volumes: pgdata` | Persistent storage for PostgreSQL data |
| `restart: unless-stopped` | Automatically restart on failure or host reboot |

### Custom Port Mapping

To run the Sales Agent on a different port:

```yaml
ports:
  - "9000:8000"  # Access at http://localhost:9000
```

### External Database

To use an external PostgreSQL database, remove the `db` service and set `DATABASE_URL` directly:

```yaml
services:
  salesagent:
    image: ghcr.io/prebid/salesagent:latest
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:pass@external-db:5432/salesagent
      ENCRYPTION_KEY: your-encryption-key
    restart: unless-stopped
```

## Nginx Reverse Proxy

For production deployments, place the Sales Agent behind an Nginx reverse proxy to handle SSL termination and request routing.

### Basic Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name sales.publisher.com;

    ssl_certificate /etc/letsencrypt/live/sales.publisher.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sales.publisher.com/privkey.pem;

    # MCP and A2A endpoints
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSE support for real-time dashboard
    location /events {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
    }

    # MCP streaming support
    location /mcp/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_cache off;
    }
}

server {
    listen 80;
    server_name sales.publisher.com;
    return 301 https://$server_name$request_uri;
}
```

{: .alert.alert-info :}
The SSE and MCP locations require `proxy_buffering off` to support streaming responses. Without this, real-time events and MCP transport will not work correctly.

## Feature Flags and Runtime Config

Some configuration options can be changed at runtime through the Admin UI without restarting the Sales Agent.

### Admin UI Settings

Navigate to **Admin UI > Settings** to configure:

{: .table .table-bordered .table-striped }
| Setting | Description |
|---------|-------------|
| Approval Workflows | Enable/disable human-in-the-loop approval for media buys and creatives |
| Notification Preferences | Configure email or webhook notifications for new campaigns |
| Rate Limits | Set per-advertiser request rate limits |
| Product Visibility | Toggle products as active/inactive without deleting them |

### Tenant-Level Configuration

In multi-tenant mode, each publisher tenant can independently configure:

- Active ad server adapter
- Product catalog and pricing
- Advertiser accounts and tokens
- Approval workflow rules
- Notification settings

{: .alert.alert-info :}
Runtime configuration changes take effect immediately without a restart. Environment variable changes require a container restart.

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Get running with Docker
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- Step-by-step publisher setup
- [Deployment Guide](/agents/salesagent/deployment/single-tenant.html) -- Production deployment best practices
- [AdCP Configuration](https://docs.adcontextprotocol.org/docs/reference/configuration) -- Protocol-level configuration options
