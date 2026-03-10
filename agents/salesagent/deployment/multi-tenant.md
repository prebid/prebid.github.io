---
layout: page_v2
title: Prebid Sales Agent - Multi-Tenant Deployment
description: Deploy the Prebid Sales Agent in multi-tenant mode with subdomain routing and per-tenant configuration
sidebarType: 10
---

# Prebid Sales Agent - Multi-Tenant Deployment
{: .no_toc}

- TOC
{:toc}

## Overview

Multi-tenant mode allows a single Sales Agent deployment to serve multiple publishers, each isolated on their own subdomain. When `ADCP_MULTI_TENANT=true`, the application resolves the tenant from the request's `Host` header and scopes all data access to that tenant.

This mode is designed for ad-tech platforms, managed service providers, or organizations that operate multiple publisher properties from a centralized infrastructure.

## How It Works

In multi-tenant mode, each tenant is assigned a unique subdomain under the configured `BASE_DOMAIN`. When a request arrives, the application extracts the subdomain from the `Host` header and resolves it to a tenant record in the database.

```text
Request: https://acme-news.adcp.yourplatform.com/mcp
                 ↓
         Host header: acme-news.adcp.yourplatform.com
                 ↓
         Subdomain extracted: acme-news
                 ↓
         Tenant resolved: Acme News (tenant_id: abc-123)
                 ↓
         All queries scoped to tenant_id: abc-123
```

Tenants can also set a `virtual_host` field for fully custom domains (e.g., `ads.acmenews.com`), which the application resolves in addition to the subdomain.

## Configuration

### Required Environment Variables

| Variable | Value | Description |
| --- | --- | --- |
| `ADCP_MULTI_TENANT` | `true` | Enables subdomain-based tenant routing |
| `BASE_DOMAIN` | `adcp.yourplatform.com` | Base domain for tenant subdomains |
| `SALES_AGENT_DOMAIN` | `adcp.yourplatform.com` | Domain used in generated URLs and links |
| `SUPER_ADMIN_EMAILS` | `admin@yourplatform.com` | Comma-separated list of super admin email addresses |
| `SUPER_ADMIN_DOMAINS` | `yourplatform.com` | Comma-separated list of email domains granted super admin access |
{: .table .table-bordered .table-striped }

### Example Docker Compose Override

Add these environment variables to your `salesagent` service:

```yaml
salesagent:
  environment:
    ADCP_MULTI_TENANT: "true"
    BASE_DOMAIN: "adcp.yourplatform.com"
    SALES_AGENT_DOMAIN: "adcp.yourplatform.com"
    SUPER_ADMIN_EMAILS: "admin@yourplatform.com"
    SUPER_ADMIN_DOMAINS: "yourplatform.com"
```

## DNS Configuration

Multi-tenant mode requires wildcard DNS so that any subdomain resolves to your server.

### Wildcard DNS Record

Create an A or CNAME record for `*.adcp.yourplatform.com`:

```text
Type: A
Name: *.adcp.yourplatform.com
Value: <your-server-ip>
TTL: 300
```

Or with CNAME (if behind a load balancer):

```text
Type: CNAME
Name: *.adcp.yourplatform.com
Value: lb.yourplatform.com
TTL: 300
```

### Custom Domain DNS

For tenants that use a `virtual_host` (custom domain), they must create a CNAME pointing to your base domain:

```text
Type: CNAME
Name: ads.acmenews.com
Value: adcp.yourplatform.com
TTL: 300
```

## Nginx Configuration

The nginx reverse proxy must accept traffic for all subdomains and forward the `Host` header so the application can resolve tenants.

### Subdomain Routing

```nginx
events {
    worker_connections 1024;
}

http {
    upstream adcp_backend {
        server salesagent:8080;
    }

    # Wildcard server block for all tenant subdomains
    server {
        listen 80;
        server_name *.adcp.yourplatform.com;

        location / {
            proxy_pass http://adcp_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # SSE support for admin activity stream
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

### Wildcard SSL Certificates

For HTTPS, obtain a wildcard certificate for `*.adcp.yourplatform.com`:

```nginx
server {
    listen 443 ssl;
    server_name *.adcp.yourplatform.com;

    ssl_certificate /etc/ssl/certs/wildcard.adcp.yourplatform.com.pem;
    ssl_certificate_key /etc/ssl/private/wildcard.adcp.yourplatform.com.key;

    location / {
        proxy_pass http://adcp_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

<div class="alert alert-info" role="alert">
Wildcard certificates from Let's Encrypt require DNS-01 challenge validation. Use a DNS provider that supports API-based validation (e.g., Cloudflare, Route 53, Google Cloud DNS) with certbot or acme.sh.
</div>

## Tenant Management

### Creating Tenants via Admin UI

1. Log in as a super admin at `https://adcp.yourplatform.com/admin`
2. Navigate to **Tenants** in the sidebar
3. Click **Create Tenant**
4. Fill in the required fields:
   - **Name**: Display name (e.g., "Acme News")
   - **Subdomain**: URL-safe identifier (e.g., `acme-news`), becomes `acme-news.adcp.yourplatform.com`
   - **Virtual Host** (optional): Custom domain (e.g., `ads.acmenews.com`)
5. Save the tenant

### Creating Tenants via API

```bash
curl -X POST https://adcp.yourplatform.com/api/v1/tenants \
  -H "Authorization: Bearer <super-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme News",
    "subdomain": "acme-news",
    "virtual_host": "ads.acmenews.com"
  }'
```

## Super Admin Access

Super admins have full platform access across all tenants. They can create and manage tenants, view all data, and configure platform-wide settings.

Super admin access is granted through environment variables:

| Variable | Description | Example |
| --- | --- | --- |
| `SUPER_ADMIN_EMAILS` | Specific email addresses | `alice@corp.com,bob@corp.com` |
| `SUPER_ADMIN_DOMAINS` | Email domains (all users at domain) | `corp.com,platform.io` |
{: .table .table-bordered .table-striped }

Any user whose email matches `SUPER_ADMIN_EMAILS` or whose email domain matches `SUPER_ADMIN_DOMAINS` is automatically granted super admin privileges when they authenticate.

<div class="alert alert-info" role="alert">
Super admin access is checked at authentication time. Changes to <code>SUPER_ADMIN_EMAILS</code> or <code>SUPER_ADMIN_DOMAINS</code> require a service restart to take effect.
</div>

## Per-Tenant Customization

Each tenant can be independently configured through the Admin UI or API. The following settings are scoped per tenant:

### Ad Server Adapter

Each tenant can connect to a different ad server (GAM, Kevel, Triton, Broadstreet, or Mock) with tenant-specific credentials.

### SSO / OIDC Provider

Each tenant can configure its own OIDC provider for admin authentication. Supported providers:

| Provider | OIDC Discovery | Notes |
| --- | --- | --- |
| Google | `https://accounts.google.com/.well-known/openid-configuration` | Default option |
| Microsoft / Entra ID | `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration` | Azure AD |
| Okta | `https://{domain}.okta.com/.well-known/openid-configuration` | Enterprise SSO |
| Auth0 | `https://{domain}.auth0.com/.well-known/openid-configuration` | Universal login |
| Keycloak | `https://{host}/realms/{realm}/.well-known/openid-configuration` | Self-hosted |
{: .table .table-bordered .table-striped }

### AI Configuration

Each tenant provides its own `GEMINI_API_KEY` through the Admin UI under **Settings** > **AI**. This key is encrypted at rest using the platform's `ENCRYPTION_KEY`.

### Advertising Policies

Per-tenant policies control:

- Blocked advertiser categories
- Blocked tactics or ad formats
- Blocked brands or domains
- Approval workflows and thresholds

### Naming Templates

Tenants can configure naming templates that control how entities (orders, line items, creatives) are named in the ad server. Templates support variable interpolation.

## Scaling Considerations

### Database

All tenants share a single PostgreSQL database. Tenant isolation is enforced at the application layer through composite primary keys and tenant-scoped queries -- every query includes a `WHERE tenant_id = :tenant_id` clause.

For high-traffic deployments:

- Enable connection pooling with PgBouncer (`USE_PGBOUNCER=true`)
- Use a managed PostgreSQL service with read replicas
- Monitor query performance with `DATABASE_QUERY_TIMEOUT` (default: 30s)

### Application

The FastAPI application is stateless and can be scaled horizontally:

- Run multiple `salesagent` instances behind a load balancer
- Ensure all instances share the same `ENCRYPTION_KEY` and `DATABASE_URL`
- nginx or an external load balancer handles request routing

### Tenant Limits

There is no hard limit on the number of tenants. Performance depends on:

- Database size and query patterns
- Number of concurrent AI agent connections per tenant
- Media buy volume and audit log retention

Monitor the [health endpoint](../operations/monitoring.html) and database metrics to determine when to scale.

## Next Steps

- [Deployment Overview](deployment-overview.html) -- compare all deployment options
- [Security Model](../operations/security.html) -- multi-tenant isolation and authentication details
- [Admin UI Guide](../operations/admin-ui.html) -- per-tenant configuration walkthrough
- [Monitoring & Audit Logging](../operations/monitoring.html) -- per-tenant audit trails
