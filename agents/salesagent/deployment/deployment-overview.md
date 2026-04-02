---
layout: page_v2
title: Prebid Sales Agent - Deployment Overview
description: Deployment options, infrastructure requirements, and platform comparison for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Deployment Overview
{: .no_toc}

- TOC
{:toc}

## Introduction

The Prebid Sales Agent can be deployed on any platform that supports Docker containers and PostgreSQL. This guide compares the available deployment options and outlines the prerequisites common to all platforms.

<div class="alert alert-info" role="alert">
If you are evaluating the Sales Agent for the first time, start with the Docker single-tenant deployment. It requires no cloud accounts and can be running in under two minutes.
</div>

## Deployment Options

| Criteria | Docker (Local / On-Prem) | Fly.io | Google Cloud Run |
| --- | --- | --- | --- |
| Setup Time | ~2 minutes | ~10 minutes | ~20 minutes |
| Difficulty | Low | Medium | Medium–High |
| Database | Docker PostgreSQL 17 | Fly Postgres (managed) | Cloud SQL for PostgreSQL |
| Scaling | Manual (docker compose scale) | `fly scale` CLI | Auto-scaling (min/max instances) |
| Custom Domains | nginx + Let's Encrypt | `fly certs add` | Cloud Run domain mappings |
| Multi-Tenant | Supported | Supported (wildcard certs) | Supported (load balancer) |
| Estimated Cost | Infrastructure only | ~$5–15/mo (shared CPU) | Pay-per-request + Cloud SQL |
| Best For | Development, small publishers, on-prem | Small–medium production | Enterprise, Google ecosystem |
{: .table .table-bordered .table-striped }

For platform-specific instructions see:

- [Docker Single-Tenant Deployment](single-tenant.html)
- [Multi-Tenant Deployment](multi-tenant.html)
- [Deploy to Fly.io](fly-io.html)
- [Deploy to Google Cloud Run](gcp.html)

## Single-Tenant vs Multi-Tenant

The Sales Agent supports two deployment modes that determine how tenants are routed.

### Single-Tenant (Default)

In single-tenant mode the application serves a single publisher. All requests are routed by path, and no subdomain resolution is needed. This is the default when `ADCP_MULTI_TENANT` is unset or `false`.

- One publisher per deployment
- Path-based routing (`/mcp`, `/a2a`, `/admin`, `/api/v1`)
- Simplest to configure -- no DNS wildcard required
- Ideal for individual publishers or development

### Multi-Tenant

When `ADCP_MULTI_TENANT=true`, the application resolves tenants from the request subdomain. Each tenant receives its own subdomain under `BASE_DOMAIN` (e.g., `acme.yourdomain.com`). Tenants can also configure a `virtual_host` for fully custom domains.

- Many publishers on a single deployment
- Subdomain routing (`tenant.BASE_DOMAIN`)
- Requires wildcard DNS and wildcard TLS certificates
- Ideal for ad-tech platforms hosting multiple publishers

See [Multi-Tenant Deployment](multi-tenant.html) for full configuration details.

## Infrastructure Requirements

| Component | Minimum | Recommended | Notes |
| --- | --- | --- | --- |
| PostgreSQL | 12+ | 17 (latest) | Used for all persistent state; 17-alpine ships in docker-compose |
| Docker | 20.10+ | Latest stable | Required for containerized deployment |
| RAM | 1 GB | 2 GB | Includes FastAPI, Flask Admin UI, nginx, and cron |
| CPU | 1 vCPU | 2 vCPU | More cores help under concurrent MCP/A2A traffic |
| Disk | 1 GB | 5 GB | Database storage grows with audit logs and media buys |
| Network | HTTP/HTTPS | HTTPS with TLS 1.2+ | nginx handles TLS termination in Docker deployments |
{: .table .table-bordered .table-striped }

## Common Prerequisites

Regardless of which platform you choose, you will need the following before you begin.

### 1. Docker Image

The Sales Agent ships as a multi-stage Docker image. The build process uses `uv` as the Python package manager in a builder stage, then copies the virtual environment into a slim runtime image that includes Python, nginx, and supercronic for cron jobs.

```bash
docker build -t adcp-sales-agent .
```

### 2. PostgreSQL Database

All deployment methods require a PostgreSQL 12+ database. The Sales Agent runs Alembic migrations automatically on startup via the `db-init` service (or directly when `SKIP_MIGRATIONS=false`).

### 3. Required Environment Variables

At a minimum every deployment needs these variables set:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql+asyncpg://user:pass@host/db`) |
| `ENVIRONMENT` | `development` or `production` |
| `ENCRYPTION_KEY` | Fernet key for encrypting sensitive fields (auto-generated if absent) |
{: .table .table-bordered .table-striped }

See the [Security Model](../operations/security.html) page for the full list of security-related variables.

### 4. Health Check Verification

After any deployment, verify the application is running:

```bash
curl http://localhost:8080/health
```

A successful response confirms the FastAPI application is up and the database connection is healthy.

## Application Ports

The Sales Agent exposes several internal ports. Your deployment platform must route external traffic to the appropriate port.

| Port | Service | Description |
| --- | --- | --- |
| 8000 | nginx reverse proxy | External entry point; proxies to internal services |
| 8080 | FastAPI unified app | All protocols: MCP, A2A, REST API, Admin UI |
{: .table .table-bordered .table-striped }

{: .alert.alert-info :}
As of v1.5.0, the application uses a single unified process on port 8080. Ports 8001 (Admin UI) and 8091 (A2A) from the legacy multi-process architecture are no longer used.

In most deployments nginx on port 8000 is the only port exposed externally.

## Application Entrypoint

The container entrypoint runs a Python orchestrator that starts all services:

```bash
/app/.venv/bin/python scripts/deploy/run_all_services.py
```

This script starts:

1. **Alembic migrations** (unless `SKIP_MIGRATIONS=true`)
2. **nginx** reverse proxy (unless `SKIP_NGINX=true`)
3. **supercronic** for scheduled tasks (unless `SKIP_CRON=true`)
4. **FastAPI** unified application on port 8080

## Next Steps

- [Single-Tenant Deployment](single-tenant.html) -- get a single-publisher instance running with Docker Compose
- [Multi-Tenant Deployment](multi-tenant.html) -- host multiple publishers on one deployment
- [Deploy to Fly.io](fly-io.html) -- cloud deployment with managed Postgres
- [Deploy to Google Cloud Run](gcp.html) -- serverless deployment on GCP
- [Security Model](../operations/security.html) -- authentication, encryption, and hardening
- [Monitoring & Audit Logging](../operations/monitoring.html) -- health checks, logging, and alerting
