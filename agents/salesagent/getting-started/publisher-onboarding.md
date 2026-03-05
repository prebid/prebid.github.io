---
layout: page_v2
title: Prebid Sales Agent - Getting Started - Publisher Onboarding
description: End-to-end guide for publishers to set up the Prebid Sales Agent with SSO, products, advertisers, and ad server integration
sidebarType: 10
---

# Publisher Onboarding
{: .no_toc}

This guide walks publishers through the complete onboarding process -- from initial deployment to going live with AI-driven ad sales. Each step builds on the previous one, resulting in a fully operational Sales Agent connected to your ad server.

- TOC
{:toc}

## Step 1: Deploy the Sales Agent

Before configuring your publisher environment, you need a running Sales Agent instance.

Follow the [Quick Start](/agents/salesagent/getting-started/quickstart.html) guide to deploy with Docker. For production environments, see the [Deployment Guide](/agents/salesagent/deployment/single-tenant.html).

{: .alert.alert-info :}
For local evaluation, use `CREATE_DEMO_TENANT=true` to pre-populate sample data while you learn the system.

## Step 2: Configure Single Sign-On (SSO)

The Sales Agent supports OAuth 2.0 / OpenID Connect for admin authentication. Configure your preferred identity provider to control who can access the publisher dashboard.

### Supported Providers

{: .table .table-bordered .table-striped }
| Provider | Environment Variables | Notes |
|----------|----------------------|-------|
| Google | `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET` | Google Workspace or consumer accounts |
| Microsoft | `OAUTH_MICROSOFT_CLIENT_ID`, `OAUTH_MICROSOFT_CLIENT_SECRET` | Azure AD / Entra ID |
| Okta | `OAUTH_OKTA_CLIENT_ID`, `OAUTH_OKTA_CLIENT_SECRET`, `OAUTH_OKTA_DOMAIN` | Requires Okta domain |
| Auth0 | `OAUTH_AUTH0_CLIENT_ID`, `OAUTH_AUTH0_CLIENT_SECRET`, `OAUTH_AUTH0_DOMAIN` | Requires Auth0 domain |
| Keycloak | `OAUTH_KEYCLOAK_CLIENT_ID`, `OAUTH_KEYCLOAK_CLIENT_SECRET`, `OAUTH_KEYCLOAK_URL` | Self-hosted identity provider |

### Google SSO Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://your-domain.com/auth/google/callback`
4. Set the environment variables:

```bash
OAUTH_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret
```

### Microsoft SSO Setup

1. Register an application in [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps)
2. Add a Web redirect URI: `https://your-domain.com/auth/microsoft/callback`
3. Create a client secret under Certificates & Secrets
4. Set the environment variables:

```bash
OAUTH_MICROSOFT_CLIENT_ID=your-application-id
OAUTH_MICROSOFT_CLIENT_SECRET=your-client-secret
```

### Okta SSO Setup

1. Create a new Web application in your Okta admin console
2. Set the sign-in redirect URI: `https://your-domain.com/auth/okta/callback`
3. Set the environment variables:

```bash
OAUTH_OKTA_CLIENT_ID=your-client-id
OAUTH_OKTA_CLIENT_SECRET=your-client-secret
OAUTH_OKTA_DOMAIN=your-org.okta.com
```

### Auth0 SSO Setup

1. Create a Regular Web Application in your Auth0 dashboard
2. Add the callback URL: `https://your-domain.com/auth/auth0/callback`
3. Set the environment variables:

```bash
OAUTH_AUTH0_CLIENT_ID=your-client-id
OAUTH_AUTH0_CLIENT_SECRET=your-client-secret
OAUTH_AUTH0_DOMAIN=your-tenant.auth0.com
```

### Keycloak SSO Setup

1. Create a client in your Keycloak realm
2. Set the Valid Redirect URI: `https://your-domain.com/auth/keycloak/callback`
3. Set the environment variables:

```bash
OAUTH_KEYCLOAK_CLIENT_ID=your-client-id
OAUTH_KEYCLOAK_CLIENT_SECRET=your-client-secret
OAUTH_KEYCLOAK_URL=https://keycloak.your-domain.com/realms/your-realm
```

### Super Admin Access

Control which users have super admin privileges using email addresses or domain patterns:

```bash
SUPER_ADMIN_EMAILS=admin@yourpub.com,ops@yourpub.com
SUPER_ADMIN_DOMAINS=yourpub.com
```

{: .alert.alert-warning :}
Super admins have full access to all tenants and system settings. Restrict this to a small set of trusted users.

## Step 3: Set Up Product Catalog

Products define the advertising inventory you offer to AI buying agents. Each product specifies format, targeting, pricing, and availability.

### Creating Products

Navigate to **Admin UI > Products** and create products with the following attributes:

{: .table .table-bordered .table-striped }
| Field | Description | Example |
|-------|-------------|---------|
| Name | Human-readable product name | "Homepage Leaderboard - Desktop" |
| Description | Detailed description for AI agents | "728x90 display banner on homepage above the fold, desktop only" |
| Ad Unit | Ad server placement identifier | `/12345/homepage/leaderboard` |
| Format | Creative format (display, video, native, audio) | `display` |
| Dimensions | Width x Height for display | `728x90` |
| Base Rate | CPM floor price | `$15.00` |

### Pricing Options

Products support multiple pricing models:

{: .table .table-bordered .table-striped }
| Pricing Model | Description | Use Case |
|---------------|-------------|----------|
| CPM | Cost per thousand impressions | Standard display and video |
| CPC | Cost per click | Performance campaigns |
| Flat Rate | Fixed cost per day/week/month | Sponsorships and takeovers |
| Tiered | Volume-based pricing with breakpoints | High-volume buyers |

### Product Best Practices

- Write detailed, natural-language descriptions -- AI agents use these to match buyer intent
- Include targeting capabilities (geo, device, audience segments) in the description
- Set competitive base rates as CPM floors; actual pricing can negotiate upward
- Group related placements into product bundles where appropriate

{: .alert.alert-info :}
Products are discoverable by AI agents via the `get_products` MCP tool. The better your descriptions, the more accurately agents can match buyer requests to your inventory.

## Step 4: Create Advertiser Accounts

Advertisers represent the buying entities that interact with your Sales Agent. Each advertiser gets isolated API credentials.

### Creating an Advertiser

Navigate to **Admin UI > Advertisers** to create advertiser accounts:

{: .table .table-bordered .table-striped }
| Field | Description | Example |
|-------|-------------|---------|
| Name | Advertiser or agency name | "Acme Corp" |
| Contact Email | Primary contact for notifications | `media@acme.com` |
| Status | Active or paused | `active` |

### Generating API Tokens

Each advertiser needs an authentication token to access the MCP and A2A endpoints:

1. Select the advertiser in the Admin UI
2. Navigate to the **API Tokens** section
3. Click **Generate Token**
4. Copy the token and share it securely with the advertiser

{: .alert.alert-danger :}
API tokens provide full buying access to your inventory. Treat them as secrets -- transmit securely and rotate regularly.

### Token Authentication

Advertisers use their token to authenticate with the Sales Agent:

- **MCP**: Pass the token in the `x-adcp-auth` header
- **A2A**: Pass the token as a `Bearer` token in the `Authorization` header

## Step 5: Connect Ad Server

The Sales Agent uses an adapter pattern to integrate with ad servers. The adapter translates AdCP operations into platform-specific API calls.

### Google Ad Manager (GAM) Adapter

To connect to GAM, configure the following environment variables:

```bash
GAM_OAUTH_CLIENT_ID=your-gam-client-id
GAM_OAUTH_CLIENT_SECRET=your-gam-client-secret
GAM_OAUTH_REFRESH_TOKEN=your-refresh-token
GAM_NETWORK_CODE=12345678
```

Setup steps:

1. Create a service account or OAuth credentials in the [Google API Console](https://console.cloud.google.com/)
2. Enable the Google Ad Manager API
3. Link the credentials to your GAM network
4. Set the environment variables above
5. Restart the Sales Agent

{: .alert.alert-info :}
The GAM adapter maps AdCP media buys to GAM Orders, Line Items, and Creatives. See the [AdCP GAM Mapping](https://docs.adcontextprotocol.org/docs/reference/gam-mapping) documentation for details.

### Adapter Configuration

Select the active adapter via the Admin UI or environment configuration. The adapter determines how media buys, creatives, and delivery data are handled.

{: .table .table-bordered .table-striped }
| Adapter | Status | Description |
|---------|--------|-------------|
| Google Ad Manager | Production | Full campaign lifecycle management |
| Mock | Testing | Simulates ad server responses for development |

## Step 6: Test with Mock Adapter

Before connecting a live ad server, validate your setup using the mock adapter:

1. Ensure the Sales Agent is running with `ADCP_AUTH_TEST_MODE=true`
2. The mock adapter is active by default when no GAM credentials are configured
3. Test the full workflow:

```bash
# List available products
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products '{"brief":"all"}'

# Create a media buy
uvx adcp http://localhost:8000/mcp/ --auth test-token create_media_buy '{
  "product_id": "your-product-id",
  "advertiser_id": "your-advertiser-id",
  "budget_cents": 50000,
  "start_date": "2025-04-01",
  "end_date": "2025-04-30",
  "name": "Test Campaign"
}'

# Check delivery
uvx adcp http://localhost:8000/mcp/ --auth test-token get_media_buy_delivery '{
  "media_buy_id": "your-media-buy-id"
}'
```

The mock adapter returns realistic simulated responses, allowing you to verify the full campaign lifecycle without affecting live inventory.

## Step 7: Go-Live Checklist

Before enabling production traffic, verify the following:

{: .table .table-bordered .table-striped }
| Item | Status | Details |
|------|--------|---------|
| SSL/TLS configured | Required | HTTPS on your `SALES_AGENT_DOMAIN` |
| SSO configured | Required | At least one OAuth provider enabled |
| `ADCP_AUTH_TEST_MODE` disabled | Required | Must be `false` in production |
| `ENCRYPTION_KEY` set | Required | Unique, random 32+ character key |
| Ad server adapter connected | Required | GAM or other production adapter |
| Products created | Required | At least one product with pricing |
| Advertiser accounts created | Required | With production API tokens |
| `ENVIRONMENT` set to `production` | Recommended | Enables production logging and security |
| Nginx reverse proxy configured | Recommended | See [Configuration](/agents/salesagent/getting-started/configuration.html) |
| Backup strategy in place | Recommended | PostgreSQL backup schedule |
| Monitoring configured | Recommended | Health check endpoint polling |

{: .alert.alert-danger :}
Never run with `ADCP_AUTH_TEST_MODE=true` in production. This disables authentication and allows unrestricted access.

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Docker deployment guide
- [Configuration Reference](/agents/salesagent/getting-started/configuration.html) -- All environment variables
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) -- Connect AI buying agents
- [AdCP Quick Start](https://docs.adcontextprotocol.org/docs/quickstart) -- Protocol-level getting started guide
