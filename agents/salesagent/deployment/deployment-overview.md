---
layout: page_v2
title: Prebid Sales Agent - Deployment - Deployment Overview
description: Comparison of deployment options for the Prebid Sales Agent including Docker, Fly.io, and Google Cloud Run
sidebarType: 10
---

# Deployment Overview
{: .no_toc}

This page helps you choose the right deployment model and platform for the Prebid Sales Agent. Whether you are a single publisher evaluating the system or a platform operator serving multiple publishers, there is a deployment path designed for your use case.

- TOC
{:toc}

## Deployment Options

The Sales Agent supports multiple deployment platforms. Choose based on your infrastructure requirements, operational expertise, and time constraints.

{: .table .table-bordered .table-striped }
| Platform | Setup Time | Difficulty | Database | Best For |
|----------|-----------|------------|----------|----------|
| **Docker** (local/on-prem) | ~2 min | Easy | Bundled PostgreSQL via Compose | Evaluation, small publishers, on-premises requirements |
| **Fly.io** (cloud) | 10-15 min | Medium | Separate DB setup needed (Fly Postgres or external) | Cloud hosting with edge deployment support |
| **Google Cloud Run** | 15-20 min | Medium | Cloud SQL or external PostgreSQL | GCP-native environments, auto-scaling, production workloads |

{: .alert.alert-info :}
**Recommendation:** Start with the Docker Compose deployment for evaluation and testing. It bundles PostgreSQL and requires no cloud accounts or external database configuration.

## Single-Tenant vs Multi-Tenant

The Sales Agent supports two deployment models depending on how many publishers share a single instance.

### Single-Tenant

A single-tenant deployment runs one publisher per Sales Agent instance. This is the recommended model for most publishers.

- Simpler configuration -- only one tenant to manage
- Isolated resources -- no shared database or compute with other publishers
- Straightforward admin UI -- no tenant switching or subdomain routing
- Easier to reason about security boundaries

### Multi-Tenant

A multi-tenant deployment hosts multiple publishers on a single Sales Agent instance. This model is designed for platform operators and managed service providers.

- Multiple publishers share one deployment with isolated data per tenant
- Subdomain routing maps requests to the correct tenant (e.g., `publisher-a.yourdomain.com`)
- Super admin controls cross-tenant administration via environment variable whitelist
- Self-signup enables new tenants to provision themselves at `/signup`
- Composite identity model ensures strict data isolation between tenants

{: .table .table-bordered .table-striped }
| Aspect | Single-Tenant | Multi-Tenant |
|--------|--------------|--------------|
| Publishers per instance | 1 | Many |
| Configuration complexity | Low | Medium |
| Subdomain routing | Not required | Required |
| Super admin role | Not required | Required |
| Self-signup | Not applicable | Optional |
| Recommended for | Individual publishers | Platform operators, managed services |

## Infrastructure Requirements

All deployment options share the following infrastructure requirements:

{: .table .table-bordered .table-striped }
| Component | Requirement | Notes |
|-----------|------------|-------|
| **PostgreSQL** | 16+ | Primary data store; bundled in Docker Compose or provisioned externally |
| **Docker** | 20.10+ | Container runtime for all deployment methods |
| **Nginx** (optional) | Latest stable | Reverse proxy for custom domains, SSL termination, rate limiting |
| **ENCRYPTION_KEY** | Fernet key | Required for encrypting API keys and sensitive adapter configuration |

{: .alert.alert-warning :}
PostgreSQL 16 or later is required. Earlier versions are not tested and may not support all features used by the Sales Agent.

## Deployment Guides

Detailed step-by-step instructions are available for each deployment model:

- [Single-Tenant Deployment](/agents/salesagent/deployment/single-tenant.html) -- Docker Compose setup with bundled PostgreSQL, recommended for most publishers

{: .alert.alert-info :}
Fly.io and Google Cloud Run deployment guides are coming in Phase 2. For now, both platforms follow standard container deployment patterns using the `ghcr.io/prebid/salesagent:latest` image with an externally provisioned PostgreSQL database.

## Post-Deployment Steps

After your Sales Agent is running, complete the following steps to make it operational:

1. **Configure your ad server** -- Set up the adapter for your ad server (Google Ad Manager or Mock for testing) via the Admin UI at `/admin` under Settings
2. **Set up products** -- Define the advertising products you want to sell, including pricing, targeting, and format configuration
3. **Add advertisers** -- Create principals (advertiser accounts) and generate API tokens so buying agents can authenticate
4. **Configure SSO** -- Replace the test password with OAuth authentication (Google, Microsoft, Okta, Auth0, or Keycloak) for the Admin UI
5. **Set up a custom domain** -- Configure your public-facing domain and SSL/TLS certificates

{: .alert.alert-info :}
For a guided walkthrough of these post-deployment steps, see the [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) and [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html).

## Further Reading

- [Single-Tenant Deployment](/agents/salesagent/deployment/single-tenant.html) -- Step-by-step Docker Compose deployment
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Get running in 2 minutes
- [Security Model](/agents/salesagent/operations/security.html) -- Authentication, encryption, and access control
- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Managing products, advertisers, and settings
- [AdCP Deployment Best Practices](https://docs.adcontextprotocol.org/docs/deployment) -- Protocol-level deployment guidance
