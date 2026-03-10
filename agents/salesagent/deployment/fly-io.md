---
layout: page_v2
title: Prebid Sales Agent - Deploy to Fly.io
description: Step-by-step guide to deploying the Prebid Sales Agent on Fly.io with managed Postgres
sidebarType: 10
---

# Prebid Sales Agent - Deploy to Fly.io
{: .no_toc}

- TOC
{:toc}

## Overview

Fly.io provides a fast path to a production deployment with managed Postgres, global edge networking, and simple CLI-based management. This guide walks through deploying the Prebid Sales Agent as a Fly.io application.

## Prerequisites

- [Fly CLI](https://fly.io/docs/flyctl/install/) installed and authenticated (`fly auth login`)
- A Fly.io account with a payment method on file (required for Postgres)
- The Sales Agent Docker image built locally or available in a registry

## Step 1: Create the Fly App

Initialize a new Fly application:

```bash
fly launch --name adcp-sales --no-deploy
```

This creates a `fly.toml` configuration file. Edit it to set the correct internal port and health check:

```toml
app = "adcp-sales"
primary_region = "iad"

[build]
  image = "your-registry/adcp-sales-agent:latest"

[env]
  ENVIRONMENT = "production"
  PRODUCTION = "true"
  ADCP_SALES_PORT = "8080"
  ADCP_SALES_HOST = "0.0.0.0"
  ADCP_MULTI_TENANT = "false"
  ADCP_AUTH_TEST_MODE = "false"
  SKIP_NGINX = "true"
  CREATE_DEMO_TENANT = "true"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[http_service.checks]]
  interval = "10s"
  timeout = "5s"
  grace_period = "30s"
  method = "GET"
  path = "/health"
```

<div class="alert alert-info" role="alert">
Set <code>SKIP_NGINX=true</code> on Fly.io because Fly's built-in proxy handles TLS termination and routing. The internal nginx is not needed.
</div>

## Step 2: Create the Postgres Database

Create a Fly Postgres cluster and attach it to your app:

```bash
# Create a Postgres cluster
fly postgres create --name adcp-sales-db --region iad --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 10

# Attach it to your app (sets DATABASE_URL automatically)
fly postgres attach adcp-sales-db --app adcp-sales
```

The `fly postgres attach` command automatically sets the `DATABASE_URL` secret on your app. Verify it:

```bash
fly secrets list --app adcp-sales
```

<div class="alert alert-info" role="alert">
The <code>DATABASE_URL</code> set by Fly uses the <code>postgres://</code> scheme. The Sales Agent expects <code>postgresql+asyncpg://</code>. You may need to override it -- see Step 3.
</div>

## Step 3: Set Environment Variables

Set the required secrets and environment variables:

```bash
# Override DATABASE_URL with the asyncpg scheme
fly secrets set DATABASE_URL="postgresql+asyncpg://user:password@adcp-sales-db.flycast:5432/adcp_sales" --app adcp-sales

# Generate and set the encryption key
fly secrets set ENCRYPTION_KEY="$(python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())')" --app adcp-sales

# Optional: Google OAuth for Admin UI
fly secrets set GAM_OAUTH_CLIENT_ID="your-client-id" --app adcp-sales
fly secrets set GAM_OAUTH_CLIENT_SECRET="your-client-secret" --app adcp-sales

# Optional: Gemini API key (can also be set per-tenant in Admin UI)
fly secrets set GEMINI_API_KEY="your-gemini-key" --app adcp-sales
```

## Step 4: Deploy

Deploy the application:

```bash
fly deploy --app adcp-sales
```

Fly.io builds (or pulls) the Docker image, runs the container, and waits for the health check to pass before routing traffic.

## Step 5: Verify

Confirm the deployment is healthy:

```bash
# Check app status
fly status --app adcp-sales

# View recent logs
fly logs --app adcp-sales

# Test the health endpoint
curl https://adcp-sales.fly.dev/health
```

Access the Admin UI at `https://adcp-sales.fly.dev/admin`.

## Custom Domain

Add a custom domain to your Fly app:

```bash
# Add a TLS certificate for your domain
fly certs add adcp.yourcompany.com --app adcp-sales
```

Then create a DNS CNAME record:

```text
Type: CNAME
Name: adcp.yourcompany.com
Value: adcp-sales.fly.dev
TTL: 300
```

Verify the certificate:

```bash
fly certs show adcp.yourcompany.com --app adcp-sales
```

## Scaling

### Vertical Scaling

Increase the machine size:

```bash
fly scale vm shared-cpu-2x --app adcp-sales
fly scale memory 1024 --app adcp-sales
```

### Horizontal Scaling

Run multiple instances:

```bash
fly scale count 2 --app adcp-sales
```

The application is stateless, so multiple instances can serve traffic concurrently with the shared Postgres database.

### Postgres Scaling

Scale the Postgres cluster:

```bash
fly postgres config update --app adcp-sales-db --max-connections 100
```

## Multi-Tenant on Fly.io

To run in multi-tenant mode on Fly.io:

### 1. Set Multi-Tenant Variables

```bash
fly secrets set ADCP_MULTI_TENANT="true" --app adcp-sales
fly secrets set BASE_DOMAIN="adcp.yourplatform.com" --app adcp-sales
fly secrets set SALES_AGENT_DOMAIN="adcp.yourplatform.com" --app adcp-sales
fly secrets set SUPER_ADMIN_EMAILS="admin@yourplatform.com" --app adcp-sales
```

### 2. Configure Wildcard Certificate

```bash
fly certs add "*.adcp.yourplatform.com" --app adcp-sales
```

### 3. Set Up Wildcard DNS

Create a wildcard CNAME record:

```text
Type: CNAME
Name: *.adcp.yourplatform.com
Value: adcp-sales.fly.dev
TTL: 300
```

### 4. Custom Tenant Domains

For tenants with custom domains, add individual certificates:

```bash
fly certs add ads.acmenews.com --app adcp-sales
```

The tenant must create a CNAME from `ads.acmenews.com` to `adcp-sales.fly.dev`.

## Monitoring

### Logs

View real-time logs:

```bash
fly logs --app adcp-sales
```

### Status and Metrics

```bash
fly status --app adcp-sales
fly dashboard --app adcp-sales
```

### Health Checks

Fly.io automatically monitors the `/health` endpoint defined in `fly.toml`. If health checks fail, Fly restarts the machine and alerts you through the dashboard.

### Logfire Integration

To enable structured logging with Logfire, set the token:

```bash
fly secrets set LOGFIRE_TOKEN="your-logfire-token" --app adcp-sales
```

## Cost Estimate

| Component | Specification | Estimated Monthly Cost |
| --- | --- | --- |
| Fly Machine | shared-cpu-1x, 512 MB | ~$5 |
| Fly Machine | shared-cpu-2x, 1 GB | ~$12 |
| Fly Postgres | shared-cpu-1x, 10 GB disk | ~$7 |
| Custom domain + TLS | Included | $0 |
| Bandwidth | 100 GB included | $0 (typical usage) |
| **Total (minimal)** | | **~$12/mo** |
| **Total (recommended)** | | **~$19/mo** |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
Fly.io pricing varies by region and resource allocation. Check the <a href="https://fly.io/pricing">Fly.io pricing page</a> for current rates. The estimates above are for the <code>iad</code> (Virginia) region.
</div>

## Troubleshooting

### Deploy fails with health check timeout

- Increase the grace period in `fly.toml` (`grace_period = "60s"`)
- Check logs: `fly logs --app adcp-sales`
- Verify `DATABASE_URL` points to the correct Fly Postgres instance

### Cannot connect to Postgres

- Verify the database is running: `fly postgres connect --app adcp-sales-db`
- Check that `DATABASE_URL` uses the `.flycast` internal address
- Ensure the asyncpg scheme is used: `postgresql+asyncpg://`

### SSL certificate pending

- DNS propagation can take up to 48 hours
- Verify the CNAME record: `dig adcp.yourcompany.com CNAME`
- Check certificate status: `fly certs show adcp.yourcompany.com --app adcp-sales`

## Next Steps

- [Deployment Overview](deployment-overview.html) -- compare all deployment options
- [Multi-Tenant Deployment](multi-tenant.html) -- detailed multi-tenant configuration
- [Security Model](../operations/security.html) -- production hardening
- [Monitoring & Audit Logging](../operations/monitoring.html) -- observability setup
