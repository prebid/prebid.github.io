---
layout: page_v2
title: Prebid Sales Agent - Operations - Admin UI Guide
description: Complete guide to the Prebid Sales Agent admin interface for managing products, advertisers, creatives, and settings
sidebarType: 10
---

# Admin UI Guide
{: .no_toc}

The Prebid Sales Agent includes a web-based administration interface built with Flask, accessible at `/admin`. This guide covers every section of the Admin UI, from initial login through product configuration, advertiser management, and system settings.

- TOC
{:toc}

## Login and Authentication

### Setup Mode

On first launch with no tenants configured, the Sales Agent enters **Setup Mode**. This provides a guided wizard to create your first publisher tenant, configure the ad server adapter, and set initial authentication.

Navigate to `http://localhost:8000/admin` to start the wizard.

### Test Credentials (Development Only)

When `ADCP_AUTH_TEST_MODE=true` is set, you can log in with the password `test123`. This mode is intended for local evaluation only.

{: .alert.alert-danger :}
Never use `ADCP_AUTH_TEST_MODE=true` in production. It enables well-known test credentials that provide full access to the Admin UI and API endpoints.

### SSO Configuration

For production deployments, the Admin UI supports OAuth-based Single Sign-On with the following identity providers:

{: .table .table-bordered .table-striped }
| Provider | Configuration Required | Notes |
|----------|----------------------|-------|
| **Google** | Client ID, Client Secret | Google Cloud Console OAuth 2.0 credentials |
| **Microsoft** | Client ID, Client Secret, Tenant ID | Azure AD / Entra ID app registration |
| **Okta** | Client ID, Client Secret, Domain | Okta developer application |
| **Auth0** | Client ID, Client Secret, Domain | Auth0 regular web application |
| **Keycloak** | Client ID, Client Secret, Realm, Server URL | Self-hosted identity provider |

To configure SSO:

1. Create an OAuth application in your identity provider
2. Set the callback URL to `https://yourdomain.com/admin/auth/callback`
3. In the Admin UI, go to **Settings > SSO Configuration**
4. Select your provider and enter the credentials
5. Save and test the login flow

{: .alert.alert-info :}
After SSO is configured, restrict admin access to specific email addresses or domains using the `SUPER_ADMIN_EMAILS` or `SUPER_ADMIN_DOMAINS` environment variables. See [Security Model](/agents/salesagent/operations/security.html) for details.

## Dashboard

The Admin UI dashboard provides a tenant-level overview of your Sales Agent instance:

- **Tenant summary** -- Active products, registered advertisers, pending approvals
- **Activity feed** -- Real-time stream of system events powered by Server-Sent Events (SSE), including media buy requests, creative submissions, and authentication events
- **Quick actions** -- Links to common tasks like creating products or generating advertiser tokens

The activity feed updates in real time without page refreshes. Events include:

- New media buy requests
- Creative approval/rejection actions
- Advertiser authentication attempts
- Configuration changes

## Product Management

Products represent the advertising inventory that AI buying agents can discover and purchase through the MCP and A2A interfaces.

### Creating a Product

Navigate to **Products > Create Product** and configure the following:

{: .table .table-bordered .table-striped }
| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Human-readable product name (e.g., "Homepage Leaderboard") |
| Description | Yes | Detailed description used by AI agents for discovery |
| Format IDs | Yes | IAB format identifiers for the ad unit (e.g., banner, video) |
| Base Price | Yes | Starting price for the product |
| Currency | Yes | ISO 4217 currency code (e.g., USD, EUR, GBP) |

### Pricing Options

The Sales Agent supports multiple pricing models. Configure one or more pricing options per product:

{: .table .table-bordered .table-striped }
| Pricing Model | Code | Description |
|---------------|------|-------------|
| Cost Per Mille | `cpm` | Price per 1,000 impressions |
| Viewable CPM | `vcpm` | Price per 1,000 viewable impressions |
| Cost Per Click | `cpc` | Price per click |
| Cost Per Completed View | `cpcv` | Price per completed video view |
| Cost Per View | `cpv` | Price per video view (any duration) |
| Cost Per Period | `cpp` | Fixed price for a calendar period |
| Flat Rate | `flat_rate` | Single fixed price for the placement |

### Targeting Configuration

Each product can include targeting parameters that constrain where and how ads are served:

- **Geographic targeting** -- Country, region, metro, or city-level targeting
- **Device targeting** -- Desktop, mobile, tablet, or connected TV
- **Content targeting** -- Contextual categories, keywords, or URL patterns
- **Audience targeting** -- First-party audience segments (where supported by the ad server)

Targeting options are defined in the product and communicated to buying agents during discovery. The ad server adapter translates these into platform-specific targeting criteria.

### Format IDs

Format IDs follow IAB standards and identify the creative format required for the product. Common formats include:

{: .table .table-bordered .table-striped }
| Format | Description | Typical Size |
|--------|-------------|-------------|
| `banner` | Display banner | 300x250, 728x90, 160x600 |
| `video` | In-stream or out-stream video | Various aspect ratios |
| `native` | Native advertising unit | Varies by placement |
| `audio` | Audio ad unit | N/A |

## Advertiser Management

Advertisers (called **principals** in AdCP terminology) are the entities that buy advertising through AI agents. Each principal has credentials that authenticate their agent's requests.

### Creating a Principal

Navigate to **Advertisers > Create Advertiser** and provide:

{: .table .table-bordered .table-striped }
| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Organization or advertiser name |
| Contact Email | Yes | Primary contact email address |
| Description | No | Notes about the advertiser |

### Generating API Tokens

After creating a principal, generate an authentication token:

1. Go to **Advertisers** and select the advertiser
2. Click **Generate Token**
3. Copy the token immediately -- it is shown only once
4. Share the token securely with the advertiser or their AI agent operator

The token authenticates both MCP and A2A requests:

```bash
# MCP authentication
curl -H "x-adcp-auth: <token>" https://yourdomain.com/mcp/

# A2A authentication
curl -H "Authorization: Bearer <token>" https://yourdomain.com/a2a
```

### Managing Access

From the advertiser detail page, you can:

- **View activity** -- See all media buy requests and creative submissions from this principal
- **Rotate tokens** -- Generate a new token and invalidate the previous one
- **Revoke access** -- Disable the principal's token, immediately blocking API access
- **Delete advertiser** -- Remove the principal and all associated data

{: .alert.alert-warning :}
Token rotation generates a new token and invalidates the old one immediately. Coordinate with the advertiser's agent operator before rotating to avoid service interruption.

## Creative Management

Creatives are the ad assets (images, video, HTML) submitted by buying agents for use in campaigns. The Admin UI provides an approval workflow to review creatives before they go live.

### Approval Workflow

Creatives follow a three-state lifecycle:

```text
┌─────────────────┐     ┌──────────┐     ┌──────────┐
│  pending_review  │────▶│ approved │     │ rejected │
│   (submitted)    │     └──────────┘     └──────────┘
└────────┬────────┘           ▲                ▲
         │                    │                │
         └────────────────────┴────────────────┘
                    (admin review)
```

{: .table .table-bordered .table-striped }
| State | Description | API Visibility |
|-------|-------------|---------------|
| `pending_review` | Newly submitted, awaiting publisher review | Not served |
| `approved` | Reviewed and accepted by the publisher | Available for campaigns |
| `rejected` | Reviewed and declined by the publisher | Not served; reason provided |

### Reviewing Creatives

Navigate to **Creatives > Pending Review** to see all creatives awaiting approval:

1. Preview the creative asset (image, video thumbnail, or HTML render)
2. Verify the creative meets your editorial and technical standards
3. Check format validation results (size, file type, IAB compliance)
4. Click **Approve** or **Reject** with an optional comment

### Format Validation

The system automatically validates creatives against the product's format requirements:

- Image dimensions and file size
- Video duration and codec compatibility
- HTML5 creative structure and compliance
- VAST/VPAID tag validation for video creatives

Validation results appear on the creative review page. Creatives that fail validation are flagged but can still be manually approved if the publisher chooses.

## Workflow Management

The workflow queue provides human-in-the-loop oversight for automated operations. When a buying agent submits a media buy request, it enters the approval queue for publisher review.

### Media Buy Approval Queue

Navigate to **Workflows > Pending Approvals** to review incoming media buy requests:

{: .table .table-bordered .table-striped }
| Field | Description |
|-------|-------------|
| Advertiser | The principal requesting the buy |
| Product | The product being purchased |
| Budget | Total spend requested |
| Flight dates | Campaign start and end dates |
| Targeting | Any additional targeting parameters |
| Creatives | Associated creative assets |

For each request, you can:

- **Approve** -- The campaign is created in the ad server
- **Reject** -- The buying agent receives a rejection with the reason
- **Request changes** -- Send feedback back to the buying agent

{: .alert.alert-info :}
Workflow approvals can be configured to auto-approve for trusted principals or below certain budget thresholds. See the adapter configuration documentation for details.

## Settings

### Adapter Configuration

The adapter connects the Sales Agent to your ad server. Navigate to **Settings > Adapter** to configure:

{: .table .table-bordered .table-striped }
| Adapter | Description | Configuration Required |
|---------|-------------|----------------------|
| **Google Ad Manager (GAM)** | Production adapter for GAM | Network code, service account JSON key |
| **Mock** | Testing adapter that simulates an ad server | None (default for evaluation) |

Select your adapter and provide the required credentials. The Mock adapter is selected by default and requires no configuration.

{: .alert.alert-warning :}
Adapter credentials (such as GAM service account keys) are encrypted at rest using the `ENCRYPTION_KEY`. See [Security Model](/agents/salesagent/operations/security.html) for details on the encryption mechanism.

### Custom Domain

Under **Settings > Custom Domain**, configure the public-facing domain for your Sales Agent instance:

1. Enter your custom domain (e.g., `ads.yourpublisher.com`)
2. Ensure DNS is pointed to your server
3. The domain is used in agent cards and protocol responses

### General Settings

General configuration options include:

- **Publisher name** -- Displayed in the agent card and Admin UI
- **Default currency** -- ISO 4217 code for product pricing
- **Contact information** -- Publisher support email for buying agents

### Tenant Deactivation

{: .alert.alert-danger :}
Tenant deactivation is a soft delete. It immediately blocks all API access (MCP and A2A) for the tenant, but preserves all data in the database.

To deactivate a tenant:

1. Go to **Settings > Tenant**
2. Click **Deactivate Tenant**
3. Confirm the action

Deactivated tenants:

- Cannot authenticate via MCP or A2A
- Are hidden from public discovery
- Retain all historical data (campaigns, creatives, audit logs)
- Can be reactivated by a super admin

## Self-Signup

In multi-tenant deployments, the Sales Agent supports self-service tenant provisioning at `/signup`. New publishers can:

1. Navigate to `https://yourdomain.com/signup`
2. Provide their organization name, domain, and admin email
3. Complete OAuth authentication
4. Receive a fully provisioned tenant with default settings

Self-signup creates an isolated tenant with its own data, products, and advertiser space. The super admin can review and manage all tenants from the Admin UI.

{: .alert.alert-info :}
Self-signup is only relevant for multi-tenant deployments. Single-tenant deployments use Setup Mode for initial configuration.

## Further Reading

- [Security Model](/agents/salesagent/operations/security.html) -- Authentication, encryption, and access control
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Compare deployment options
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- End-to-end setup walkthrough
- [AdCP Advanced Topics: Principals & Security](https://docs.adcontextprotocol.org/docs/advanced/principals-security) -- Protocol-level identity model
