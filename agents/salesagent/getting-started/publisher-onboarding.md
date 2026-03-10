---
layout: page_v2
title: Prebid Sales Agent - Publisher Onboarding
description: End-to-end guide for publishers to configure the Prebid Sales Agent with products, pricing, ad server, and policies
sidebarType: 10
---

# Prebid Sales Agent - Publisher Onboarding
{: .no_toc}

- TOC
{:toc}

## Overview

This guide walks publishers through the complete process of setting up the Prebid Sales Agent, from initial deployment through go-live. By the end, you will have a fully configured Sales Agent that AI buying agents can use to discover your inventory and purchase advertising.

The onboarding process follows ten steps:

1. Deploy the Sales Agent
2. Access the Admin UI
3. Configure your ad server
4. Build your product catalog
5. Configure pricing options
6. Create advertiser accounts
7. Configure SSO authentication
8. Set advertising policies
9. Configure approval workflows
10. Test with the mock adapter

## Step 1: Deploy the Sales Agent

Start by deploying the Sales Agent using Docker. For local development and testing:

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
docker compose up -d
```

For production deployments, see the [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) for Docker, Fly.io, and Google Cloud Run options.

<div class="alert alert-info" role="alert">
  The default Docker Compose configuration runs in test mode with pre-configured demo data. For production, you will need to set <code>ADCP_AUTH_TEST_MODE=false</code> and configure real authentication. See the <a href="/agents/salesagent/getting-started/configuration.html">Configuration Reference</a> for all environment variables.
</div>

## Step 2: Access the Admin UI

Navigate to `http://localhost:8000/admin` (or your production URL) to access the Admin UI.

### First Login

In test mode, log in with:

- **Email**: `test_super_admin@example.com`
- **Password**: `test123`

### Super Admin Setup

Super admins have unrestricted access to all tenants and system settings. Configure super admin access using environment variables:

```bash
# Grant super admin to specific email addresses
SUPER_ADMIN_EMAILS=admin@yourcompany.com,ops@yourcompany.com

# Or grant super admin to all users from a domain
SUPER_ADMIN_DOMAINS=yourcompany.com
```

Once logged in, the Admin UI dashboard provides:

- **Activity Stream**: Live SSE-powered feed of all agent interactions
- **Product Catalog**: Manage your advertising products
- **Media Buys**: View and approve campaign proposals
- **Creatives**: Review uploaded creative assets
- **Settings**: Configure ad server, SSO, AI, and policies

## Step 3: Configure Your Ad Server

Navigate to **Settings > Ad Server** in the Admin UI to select and configure your ad server adapter.

### Available Adapters

{: .table .table-bordered .table-striped }
| Adapter | Channels | Requirements |
|---------|----------|-------------|
| **Google Ad Manager** | Display, Video | GAM API access, OAuth credentials, GCP project |
| **Kevel** | Display | Kevel API key |
| **Triton Digital** | Audio | Triton Digital account credentials |
| **Broadstreet** | Display | Broadstreet API credentials |
| **Mock Ad Server** | All | None (in-memory, for testing only) |

### Google Ad Manager Setup

To connect Google Ad Manager:

1. Create a GCP project and enable the Ad Manager API.
2. Set up OAuth 2.0 credentials (client ID and secret).
3. Create a service account with Ad Manager access.
4. In the Admin UI, select **Google Ad Manager** as the adapter.
5. Enter your GAM network code, OAuth client ID, client secret, and GCP project ID.

Required environment variables for GAM:

```bash
GAM_OAUTH_CLIENT_ID=your-client-id
GAM_OAUTH_CLIENT_SECRET=your-client-secret
GCP_PROJECT_ID=your-gcp-project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### Kevel, Triton Digital, Broadstreet

For other adapters, select the adapter in the Admin UI and provide the required API credentials in the connection configuration form. Each adapter has a typed configuration class that validates the required fields.

## Step 4: Build Your Product Catalog

Products are the advertising offerings that AI agents discover and purchase. Navigate to **Products** in the Admin UI to create your catalog.

Each product includes:

{: .table .table-bordered .table-striped }
| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name shown to buying agents (e.g., "Premium Homepage Leaderboard") |
| `description` | Yes | Detailed description including audience, placement, and value proposition |
| `format_ids` | Yes | Creative formats accepted (e.g., display 728x90, video pre-roll) |
| `pricing_options` | Yes | One or more pricing models with rates (see Step 5) |
| `targeting` | No | Available targeting parameters (geo, audience, contextual) |
| `delivery_type` | Yes | How impressions are delivered (e.g., standard, guaranteed, sponsorship) |
| `delivery_measurement` | Yes | How delivery is measured (e.g., impressions, clicks, completions) |
| `properties` | No | Specific sites or apps where the product runs |

### Writing Effective Product Descriptions

AI agents use product descriptions to match buyer briefs to your inventory. Write descriptions that clearly communicate:

- **What**: The ad format and placement (e.g., "Full-page interstitial video ad")
- **Where**: The property and context (e.g., "displayed between articles on SportsFan.com")
- **Who**: The audience (e.g., "reaching 2M monthly unique visitors aged 18-34")
- **Why**: The value proposition (e.g., "92% viewability rate, 3.2% average CTR")

## Step 5: Configure Pricing Options

Each product needs at least one pricing option. Pricing options define how advertisers pay for the product.

### Pricing Models

{: .table .table-bordered .table-striped }
| Model | Code | Description |
|-------|------|-------------|
| Cost Per Mille | `cpm` | Price per 1,000 impressions |
| Cost Per Click | `cpc` | Price per click |
| Cost Per Completed View | `cpcv` | Price per completed video view |
| Cost Per Point | `cpp` | Price per rating point |
| Cost Per View | `cpv` | Price per video view (any duration) |
| Flat Rate | `flat_rate` | Fixed price for a sponsorship or time period |
| Viewable CPM | `vcpm` | Price per 1,000 viewable impressions |

### Pricing Option Fields

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `pricing_model` | enum | One of: `cpm`, `cpc`, `cpcv`, `cpp`, `cpv`, `flat_rate`, `vcpm` |
| `is_fixed` | boolean | `true` for fixed pricing, `false` for negotiable/floor pricing |
| `rate` | decimal | The price per unit (e.g., $12.50 CPM) |
| `currency` | string | ISO 4217 currency code (e.g., `USD`, `EUR`, `GBP`) |
| `min_budget` | decimal | Minimum total spend required for this product |
| `max_budget` | decimal | Maximum total spend allowed (optional cap) |

### Example Pricing Configuration

A product might have multiple pricing options:

- **Standard CPM**: $12.50 CPM, minimum budget $5,000, fixed rate
- **Performance CPC**: $2.00 CPC, minimum budget $1,000, negotiable
- **Sponsorship**: $50,000 flat rate for a one-month homepage takeover

## Step 6: Create Advertiser Accounts

Advertisers (called "principals" in the system) are the entities that buy media through AI agents. Navigate to **Principals** in the Admin UI to create accounts.

Each principal receives an authentication token that their AI agent uses to identify itself when calling the Sales Agent.

### Creating a Principal

1. Click **New Principal** in the Admin UI.
2. Enter the advertiser's name and contact information.
3. The system generates an authentication token automatically.
4. Share the token with the advertiser for use in their AI agent's configuration.

### Token Usage

The advertiser's AI agent includes the token in every request:

```bash
# As a custom header
x-adcp-auth: principal-token-here

# Or as a standard Bearer token
Authorization: Bearer principal-token-here
```

The token identifies both the tenant (your publisher account) and the specific principal (the advertiser), ensuring proper access control and audit logging.

## Step 7: Configure SSO

For the Admin UI, you can configure Single Sign-On (SSO) so your team members authenticate with your existing identity provider. Navigate to **Settings > Authentication** in the Admin UI.

### Supported Providers

{: .table .table-bordered .table-striped }
| Provider | Protocol | Configuration Required |
|----------|----------|----------------------|
| **Google** | OIDC | Client ID, Client Secret |
| **Microsoft** | OIDC | Client ID, Client Secret, Tenant ID |
| **Okta** | OIDC | Client ID, Client Secret, Okta Domain |
| **Auth0** | OIDC | Client ID, Client Secret, Auth0 Domain |
| **Keycloak** | OIDC | Client ID, Client Secret, Realm URL |

### Setup Steps

1. Register the Sales Agent as an application in your identity provider.
2. Set the redirect URI to `https://your-salesagent-domain.com/admin/auth/callback`.
3. Copy the Client ID and Client Secret from your identity provider.
4. In the Admin UI, navigate to **Settings > Authentication**.
5. Select your provider and enter the credentials.
6. Test the SSO flow by logging out and logging back in.

<div class="alert alert-info" role="alert">
  SSO configuration is per-tenant. In a multi-tenant deployment, each publisher can configure their own identity provider independently.
</div>

## Step 8: Set Advertising Policies

Advertising policies control what types of campaigns and creatives are allowed on your properties. Navigate to **Settings > Policies** in the Admin UI.

### Policy Types

- **Blocked Categories**: Prevent ads in specific IAB content categories (e.g., alcohol, gambling, political).
- **Blocked Brands**: Block specific advertisers or brands by name or domain.
- **Blocked Tactics**: Prohibit specific ad tactics (e.g., auto-play audio, pop-ups, crypto advertising).

### Policy Enforcement

Policies are enforced at two points:

1. **Campaign Creation**: When an AI agent calls `create_media_buy`, the policy agent checks the proposed campaign against your policies. Non-compliant proposals are rejected with clear error messages.
2. **Creative Review**: When creatives are uploaded via `sync_creatives`, the review agent checks them against your policies and returns compliance results.

## Step 9: Configure Workflows

Workflows control whether campaigns and creatives require human approval before going live. Navigate to **Settings > Workflows** in the Admin UI.

### Approval Modes

{: .table .table-bordered .table-striped }
| Mode | Behavior |
|------|----------|
| `require-human` | All media buys and creatives require manual approval by a publisher admin |
| `auto-approve` | Media buys and creatives are automatically approved if they meet configured thresholds |

### Creative Auto-Approve Thresholds

When using `auto-approve` mode, the AI review agent evaluates each creative and assigns a confidence score. You can set thresholds to control auto-approval:

- **Auto-approve threshold**: Creatives scoring above this threshold (e.g., 0.95) are approved automatically.
- **Auto-reject threshold**: Creatives scoring below this threshold (e.g., 0.30) are rejected automatically.
- **Manual review range**: Creatives scoring between the two thresholds are queued for human review.

### Workflow Tasks

When human approval is required, the system creates workflow tasks that appear in:

- The Admin UI under **Workflow Tasks**
- The MCP/A2A/REST APIs via `list_tasks`, `get_task`, and `complete_task`

AI agents can poll for task status and notify their operators when approval is needed.

## Step 10: Test with Mock Adapter

Before connecting your production ad server, validate your entire configuration using the Mock Ad Server adapter.

1. In **Settings > Ad Server**, select **Mock Ad Server**.
2. Have a test AI agent call `get_products` to verify your product catalog appears correctly.
3. Create a test media buy with `create_media_buy` and verify it flows through your approval workflow.
4. Upload test creatives with `sync_creatives` and confirm they pass policy checks.
5. Call `get_media_buy_delivery` to verify mock delivery metrics are returned.
6. Review the audit logs in the Admin UI to confirm all operations are tracked.

Once everything works with the mock adapter, switch to your production ad server adapter.

## Go-Live Checklist

{: .table .table-bordered .table-striped }
| Item | Status | Notes |
|------|--------|-------|
| Sales Agent deployed to production infrastructure | | See [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) |
| `ADCP_AUTH_TEST_MODE=false` set | | Disables test credentials |
| Production ad server adapter configured | | GAM, Kevel, Triton, or Broadstreet |
| Ad server API credentials validated | | Test connection from Settings page |
| Product catalog populated | | At least one product with pricing |
| Pricing options configured per product | | Include `min_budget` for spend guardrails |
| At least one principal (advertiser) account created | | Token shared with buyer |
| SSO configured for admin team | | Test login/logout flow |
| Advertising policies set | | Blocked categories, brands, tactics |
| Workflow approval mode selected | | `require-human` recommended for launch |
| SSL/TLS configured on production domain | | Required for secure token transmission |
| `ENCRYPTION_KEY` set to a strong random value | | Used for encrypting sensitive config |
| `FLASK_SECRET_KEY` set to a strong random value | | Used for session security |
| Monitoring and alerting configured | | Health check at `/health` |
| Backup strategy for PostgreSQL database | | Point-in-time recovery recommended |
| End-to-end test completed with real AI agent | | Full workflow: discover → buy → deliver |

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Docker setup and first MCP call
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) — Guide for AI agent developers
- [Configuration Reference](/agents/salesagent/getting-started/configuration.html) — All environment variables
- [Architecture & Protocols](/agents/salesagent/architecture.html) — System design deep dive
