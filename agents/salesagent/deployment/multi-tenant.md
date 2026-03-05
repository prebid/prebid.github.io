---
layout: page_v2
title: Prebid Sales Agent - Deployment - Multi-Tenant Deployment
description: Deploying the Prebid Sales Agent for multiple publishers on a single instance
sidebarType: 10
---

# Multi-Tenant Deployment
{: .no_toc}

This guide covers deploying a single Prebid Sales Agent instance that serves multiple publishers, each isolated in their own tenant with separate data, credentials, and configuration.

- TOC
{:toc}

## When to Use Multi-Tenant

Multi-tenant mode is designed for organizations that manage ad operations on behalf of multiple publishers. Typical use cases include:

- **Platform operators** running a shared Sales Agent for all publishers on their platform
- **Managed service providers** offering Sales Agent as a hosted service
- **Publisher networks** centralizing ad operations tooling across properties

In multi-tenant mode, each publisher gets an isolated tenant with its own subdomain, data, ad server credentials, and user access. A single deployment handles all tenants, reducing infrastructure overhead.

If you are deploying for a single publisher, see the [Single-Tenant Deployment](/agents/salesagent/deployment/single-tenant.html) guide instead.

## Architecture

Multi-tenant mode adds a tenant resolution layer on top of the standard Sales Agent architecture. Incoming requests are routed to the correct tenant based on the subdomain in the request:

```text
┌──────────────────────────────────────────────────────────────┐
│                    DNS / Load Balancer                        │
│          *.sales-agent.yourdomain.com → Sales Agent          │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                  Tenant Resolution Middleware                  │
│    Host header → subdomain → tenant context                  │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Tenant A   │  │  Tenant B   │  │  Tenant C   │          │
│  │ pub-a.sales │  │ pub-b.sales │  │ pub-c.sales │          │
│  │ -agent.co   │  │ -agent.co   │  │ -agent.co   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                    PostgreSQL (shared)                         │
│          All tenants share one database instance              │
│          Data isolation enforced at application layer          │
└──────────────────────────────────────────────────────────────┘
```

## Enable Multi-Tenant Mode

Set the following environment variable to enable multi-tenant mode:

```bash
ADCP_MULTI_TENANT=true
```

When this flag is set, the Sales Agent expects every incoming request to resolve to a specific tenant. Requests that cannot be mapped to a tenant are rejected.

## Domain Configuration

Multi-tenant mode requires several domain-related environment variables:

{: .table .table-bordered .table-striped }
| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `BASE_DOMAIN` | Yes | `yourdomain.com` | The root domain of your deployment |
| `SALES_AGENT_DOMAIN` | Yes | `sales-agent.yourdomain.com` | Base domain for tenant subdomains |
| `ADMIN_DOMAIN` | No | `admin.yourdomain.com` | Dedicated domain for the platform admin UI |
| `SUPER_ADMIN_DOMAIN` | No | `super.yourdomain.com` | Dedicated domain for super-admin operations |

With the configuration above, individual tenants are accessible at:

```text
https://publisher-a.sales-agent.yourdomain.com
https://publisher-b.sales-agent.yourdomain.com
```

## Wildcard DNS Setup

Multi-tenant mode requires a wildcard DNS record so that all tenant subdomains resolve to your Sales Agent instance.

Create a wildcard A or CNAME record:

```text
*.sales-agent.yourdomain.com.  IN  A      203.0.113.10
```

Or, if using a CNAME:

```text
*.sales-agent.yourdomain.com.  IN  CNAME  your-lb.example.com.
```

{: .alert.alert-info :}
If you are using a cloud provider's load balancer, the CNAME approach is typically preferred since the underlying IP address may change.

### Wildcard SSL Certificate

You also need a wildcard TLS certificate for `*.sales-agent.yourdomain.com`. Options include:

- **Let's Encrypt** with DNS-01 challenge (required for wildcards)
- **Cloud-managed certificates** (AWS ACM, GCP-managed SSL, Cloudflare)
- **Purchased wildcard certificate** from a certificate authority

## Subdomain Routing

The Sales Agent resolves the tenant for each incoming request using the following priority order:

{: .table .table-bordered .table-striped }
| Priority | Method | Header / Source | Example |
|----------|--------|-----------------|---------|
| 1 | Explicit override | `x-adcp-tenant` request header | `x-adcp-tenant: publisher-a` |
| 2 | Platform proxy header | `Apx-Incoming-Host` header | `Apx-Incoming-Host: publisher-a.sales-agent.yourdomain.com` |
| 3 | Host header (default) | `Host` header | `Host: publisher-a.sales-agent.yourdomain.com` |

In most deployments, the Host header is sufficient. The `Apx-Incoming-Host` header is useful when a CDN or reverse proxy rewrites the Host header. The `x-adcp-tenant` header allows programmatic tenant selection from API clients.

### Session Cookie Scoping

Session cookies are scoped to the `SALES_AGENT_DOMAIN` value. This means:

- Cookies are set with `Domain=.sales-agent.yourdomain.com`
- A user session on `publisher-a.sales-agent.yourdomain.com` does not carry over to `publisher-b.sales-agent.yourdomain.com`
- Each tenant has fully isolated sessions

## Creating Tenants

### Via the Admin UI

1. Navigate to the admin or super-admin domain
2. Go to **Tenants > Create Tenant**
3. Fill in the publisher name, slug (used as the subdomain), and initial configuration
4. Save the tenant

The tenant is immediately accessible at `https://<slug>.sales-agent.yourdomain.com`.

### Via the CLI

Use the tenant setup script for scripted or bulk tenant creation:

```bash
python -m scripts.setup.setup_tenant \
  --name "Publisher A" \
  --slug "publisher-a" \
  --domain "publisher-a.sales-agent.yourdomain.com"
```

{: .alert.alert-info :}
The `--slug` value becomes the subdomain prefix. It must be unique, lowercase, and contain only alphanumeric characters and hyphens.

## Per-Tenant GAM Service Account Setup

Each tenant that integrates with Google Ad Manager (GAM) needs its own service account credentials. This keeps credentials isolated and allows different publishers to connect to different GAM networks.

To configure a tenant's GAM credentials:

1. In the Google Cloud Console, create a service account for the publisher
2. Download the JSON key file
3. In the Admin UI, navigate to the tenant's **Settings > Ad Server > GAM**
4. Upload the service account JSON key
5. Enter the GAM network code

The credentials are encrypted at rest using the deployment's `ENCRYPTION_KEY`.

{: .alert.alert-warning :}
Each service account must be granted access to its respective GAM network by the publisher. Share the service account email address with the publisher and have them add it in the GAM Admin console under **Global Settings > Network > API Access**.

## MCP Client Configuration

MCP clients connecting to a multi-tenant deployment must route requests to the correct tenant subdomain. The MCP server URL includes the tenant subdomain:

```json
{
  "mcpServers": {
    "salesagent": {
      "url": "https://publisher-a.sales-agent.yourdomain.com/mcp/",
      "headers": {
        "x-adcp-auth": "YOUR_MCP_TOKEN"
      }
    }
  }
}
```

Each tenant has its own MCP authentication token, configured in the Admin UI under **Settings > API Access**.

To connect to a different tenant, change the subdomain in the URL:

```json
{
  "mcpServers": {
    "salesagent": {
      "url": "https://publisher-b.sales-agent.yourdomain.com/mcp/",
      "headers": {
        "x-adcp-auth": "PUBLISHER_B_MCP_TOKEN"
      }
    }
  }
}
```

## Self-Signup

When self-signup is enabled, new publishers can register their own tenant at the `/signup` endpoint:

```text
https://sales-agent.yourdomain.com/signup
```

Self-signup creates a new tenant with a subdomain based on the publisher's chosen slug. The registering user becomes the tenant admin.

{: .alert.alert-warning :}
Self-signup is disabled by default. Enable it only if your deployment model supports open registration. Review the [Security Model](/agents/salesagent/operations/security.html) documentation before enabling.

## Troubleshooting

### Tenant Context Errors

**Symptom:** Requests return `400 Bad Request` with a message about missing tenant context.

**Cause:** The Sales Agent could not determine which tenant the request belongs to.

Check the following:

1. Verify `ADCP_MULTI_TENANT=true` is set
2. Confirm the subdomain in the URL matches an existing tenant slug
3. If behind a reverse proxy, ensure the Host header is being forwarded:

```bash
curl -v https://publisher-a.sales-agent.yourdomain.com/health
```

Look for the `Host` header in the request. If the proxy is stripping it, configure the proxy to pass `Apx-Incoming-Host` or `x-adcp-tenant` instead.

### Custom Domain Issues

**Symptom:** A tenant's custom domain does not resolve or returns a different tenant.

Check:

1. DNS for the custom domain points to the Sales Agent instance
2. The custom domain is registered in the tenant's settings in the Admin UI
3. The TLS certificate covers the custom domain (wildcard certificates only cover one level of subdomains)

### Cookie and Session Problems

**Symptom:** Users are logged out when navigating between pages, or sessions are shared across tenants.

Verify:

1. `SALES_AGENT_DOMAIN` is set correctly
2. The domain value matches the actual domain tenants are served from
3. Cookies are being set with the correct `Domain` attribute (check browser developer tools)

### Tenant Not Found After Creation

**Symptom:** A newly created tenant returns 404.

The tenant slug must match the subdomain exactly. Verify:

```bash
# Check if the tenant exists
curl https://admin.yourdomain.com/api/tenants
```

Ensure the slug in the database matches the subdomain being requested.

## Next Steps

- [Single-Tenant Deployment](/agents/salesagent/deployment/single-tenant.html) -- Simpler deployment for a single publisher
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Compare all deployment options
- [Security Model](/agents/salesagent/operations/security.html) -- Authentication, encryption, and access control
- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Configure tenants, products, and settings
