---
layout: page_v2
title: Prebid Sales Agent - Integrations - Google Ad Manager Integration
description: Complete guide to integrating the Prebid Sales Agent with Google Ad Manager including authentication, product mapping, and troubleshooting
sidebarType: 10
---

# Google Ad Manager Integration
{: .no_toc}

The Google Ad Manager (GAM) adapter connects the Prebid Sales Agent to your GAM network, translating AdCP operations into GAM API calls. This guide covers authentication setup, GCP provisioning, product-to-line-item mapping, and testing.

- TOC
{:toc}

## Overview

The GAM adapter (`GAMAdapter`) is the production ad server integration for the Sales Agent. It implements the `AdServerAdapter` abstract interface and maps each AdCP operation to the corresponding Google Ad Manager API call.

{: .table .table-bordered .table-striped }
| AdCP Operation | GAM API Mapping | Description |
|----------------|-----------------|-------------|
| `create_media_buy` | Create Order + Line Items | Creates a GAM Order with one or more Line Items based on the media buy specification |
| `update_media_buy` | Update Order / Line Item | Modifies flight dates, budget, targeting, or status on existing GAM entities |
| `get_media_buy_delivery` | Run ReportQuery | Fetches delivery metrics (impressions, clicks, spend) from the GAM Reporting API |
| `sync_creatives` | Create / Update Creative | Uploads creative assets to GAM and associates them with Line Items |
| `list_creatives` | Get Creatives by Statement | Queries GAM for creatives matching filter criteria |

The adapter handles all GAM-specific concerns -- API authentication, rate limiting, pagination, error mapping, and retry logic -- so that the rest of the Sales Agent operates entirely in terms of AdCP abstractions.

{: .alert.alert-info :}
The GAM adapter is one of several available adapters. For development and testing, the Mock adapter provides simulated responses without requiring GAM credentials. See the [Architecture & Protocols](/agents/salesagent/architecture.html) page for details on the adapter pattern.

## Authentication Methods

The GAM adapter supports two authentication methods. Choose based on your deployment context.

{: .table .table-bordered .table-striped }
| Method | Use Case | Configuration | Security Level |
|--------|----------|---------------|----------------|
| **Service Account** (recommended) | Production deployments | JSON key uploaded via Admin UI | High -- no user interaction required, key stored encrypted |
| **OAuth 2.0 Client** | Development and testing | Environment variables | Medium -- requires initial user consent flow |

### Service Account (Recommended for Production)

Service accounts are the recommended authentication method for production. They provide non-interactive, server-to-server authentication with no manual consent flow.

Service account credentials are uploaded and managed through the Admin UI at **Settings > Ad Server Configuration**. The JSON key file is encrypted at rest using the `ENCRYPTION_KEY` configured in your environment.

### OAuth 2.0 Client (Development)

For development environments, you can authenticate using OAuth 2.0 client credentials. This method requires an initial user consent flow to obtain a refresh token.

Set the following environment variables:

```bash
GAM_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GAM_OAUTH_CLIENT_SECRET=your-client-secret
GAM_OAUTH_REFRESH_TOKEN=your-refresh-token
GAM_NETWORK_CODE=12345678
```

{: .alert.alert-warning :}
OAuth credentials in environment variables are suitable for development only. In production, use the service account method with credentials managed through the Admin UI.

## Service Account Setup

Follow these steps to provision a GCP service account and connect it to your GAM network.

### Step 1: Create a GCP Project

If you do not already have a GCP project for the Sales Agent:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** > **New Project**
3. Enter a project name (e.g., `salesagent-production`)
4. Select your billing account and organization
5. Click **Create**

### Step 2: Enable the Google Ad Manager API

1. In the GCP Console, navigate to **APIs & Services > Library**
2. Search for "Google Ad Manager API" (also known as the "Ad Manager API")
3. Click **Enable**

{: .alert.alert-info :}
The API may take a few minutes to fully activate after enabling.

### Step 3: Create a Service Account

1. Navigate to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Enter a name (e.g., `salesagent-gam`) and description
4. Click **Create and Continue**
5. Skip the optional role grants (the service account needs GAM-level permissions, not GCP-level)
6. Click **Done**

### Step 4: Generate a JSON Key

1. Click on your newly created service account
2. Go to the **Keys** tab
3. Click **Add Key > Create new key**
4. Select **JSON** format
5. Click **Create** -- the key file downloads automatically

{: .alert.alert-warning :}
Store the JSON key file securely. It provides full API access to your GAM network. Never commit it to version control.

### Step 5: Link the Service Account to GAM

1. Log in to your [Google Ad Manager](https://admanager.google.com/) account
2. Navigate to **Admin > Global settings > Network settings**
3. Under **API access**, ensure API access is enabled
4. Go to **Admin > Global settings > Service account users**
5. Add the service account email (e.g., `salesagent-gam@your-project.iam.gserviceaccount.com`)
6. Assign the appropriate role (typically **Administrator** or a custom role with order/line item/creative/report permissions)

### Step 6: Upload to the Admin UI

1. Open the Sales Agent Admin UI at `https://your-domain.com/admin`
2. Navigate to **Settings > Ad Server Configuration**
3. Select **Google Ad Manager** as the adapter type
4. Enter your GAM Network Code
5. Upload the JSON key file
6. Click **Save and Test Connection**

The Admin UI encrypts the key file using your `ENCRYPTION_KEY` before storing it in the database.

### Step 7: Verify the Connection

After saving, the Admin UI runs a connectivity test against the GAM API. A successful test confirms:

- The service account credentials are valid
- The GAM API is enabled on your GCP project
- The service account has been added as a user in your GAM network
- The network code matches an accessible network

```bash
# You can also verify via CLI
uvx adcp http://localhost:8000/mcp/ --auth your-token get_adcp_capabilities
```

The response should show `ad_server_type: "google_ad_manager"` with a connected status.

## Product Configuration

Products in the Sales Agent map to GAM line items when a media buy is created. This section explains how products translate into GAM entities and how to configure targeting templates.

### Product-to-GAM Mapping

When an AI agent creates a media buy for a product, the GAM adapter creates the following entities:

{: .table .table-bordered .table-striped }
| AdCP Entity | GAM Entity | Relationship |
|-------------|------------|--------------|
| Media Buy | Order | One media buy creates one GAM Order |
| Product (within media buy) | Line Item | Each product in the buy becomes a Line Item under the Order |
| Creative | Creative | Creatives are uploaded and associated with Line Items |
| Targeting | Line Item Targeting | Targeting from the product and media buy is merged into Line Item targeting criteria |

### Configuring Targeting Templates

Each product can define a targeting template that specifies which GAM targeting criteria to apply when the product is purchased. Configure these in the Admin UI under **Products > Targeting**.

{: .table .table-bordered .table-striped }
| Targeting Type | GAM Equivalent | Example Value |
|----------------|---------------|---------------|
| `geo_countries` | Geographic targeting (countries) | `["US", "GB", "CA"]` |
| `geo_regions` | Geographic targeting (regions/states) | `["US-CA", "US-NY"]` |
| `geo_metros` | DMA targeting | `["501", "803"]` (Nielsen DMA codes) |
| `custom_targeting` | Key-value targeting | `{"section": ["sports", "news"]}` |
| `ad_unit_ids` | Inventory targeting (ad units) | `["/12345/homepage/leaderboard"]` |
| `placement_ids` | Inventory targeting (placements) | `["456789"]` |

### Format Mapping

The adapter maps AdCP creative format categories to GAM creative types:

{: .table .table-bordered .table-striped }
| AdCP Format Category | GAM Creative Type | Notes |
|---------------------|-------------------|-------|
| `display` | `ImageCreative` / `ThirdPartyCreative` | Standard IAB display sizes |
| `video` | `VideoCreative` / `VastRedirectCreative` | VAST-compliant video |
| `native` | `NativeCreative` | Native style templates |
| `audio` | `AudioCreative` | DAAST-compliant audio |

### Pricing Model Mapping

{: .table .table-bordered .table-striped }
| AdCP Pricing Model | GAM Cost Type | GAM Rate Type |
|-------------------|---------------|---------------|
| `cpm` | `CPM` | Standard |
| `vcpm` | `VCPM` | Viewable |
| `cpc` | `CPC` | Click-based |
| `flat_rate` | `CPD` | Per-day flat rate |
| `cpcv` | `CPM` (with viewability target) | Custom |

## Testing

Before going live with a GAM integration, validate your setup thoroughly.

### Testing with the Mock Adapter

Start by testing your product configuration and media buy workflow using the mock adapter:

```bash
# Start with mock adapter (no GAM credentials needed)
docker compose up -d

# Create a test media buy
uvx adcp http://localhost:8000/mcp/ --auth test-token create_media_buy '{
  "product_id": "your-product-id",
  "advertiser_id": "your-advertiser-id",
  "budget_cents": 50000,
  "start_date": "2025-04-01",
  "end_date": "2025-04-30",
  "name": "Test Campaign"
}'
```

### Testing with GAM Test Network

Google provides test networks for development. To test against a real GAM API without affecting production:

1. Request a [GAM test network](https://developers.google.com/ad-manager/api/start#test_network) from Google
2. Configure the Sales Agent with your test network credentials
3. Run the full media buy lifecycle:

```bash
# Discover products
uvx adcp http://localhost:8000/mcp/ --auth your-token get_products '{"brief":"all"}'

# Create a media buy
uvx adcp http://localhost:8000/mcp/ --auth your-token create_media_buy '{
  "product_id": "prod_123",
  "advertiser_id": "adv_456",
  "budget_cents": 100000,
  "start_date": "2025-05-01",
  "end_date": "2025-05-31",
  "name": "GAM Integration Test"
}'

# Check delivery (may take time to populate in test network)
uvx adcp http://localhost:8000/mcp/ --auth your-token get_media_buy_delivery '{
  "media_buy_id": "mb_789"
}'
```

### Integration Test Checklist

{: .table .table-bordered .table-striped }
| Test | Expected Result | Notes |
|------|----------------|-------|
| Connection test | Success in Admin UI | Validates credentials and API access |
| `get_adcp_capabilities` | Shows `google_ad_manager` adapter | Confirms adapter is loaded |
| `create_media_buy` | Returns `media_buy_id` + GAM order ID | Check GAM console for created Order |
| `sync_creatives` | Returns creative IDs | Check GAM console for uploaded Creatives |
| `get_media_buy_delivery` | Returns delivery metrics | May take 24h in test networks for data |
| `update_media_buy` (pause) | Status changes to `paused` | Verify Line Item is paused in GAM |

## Troubleshooting

### GAM API Errors

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `AuthenticationError` | Invalid or expired credentials | Re-upload service account key or refresh OAuth token |
| `PermissionDenied` | Service account lacks GAM permissions | Add the service account as a user in GAM with appropriate role |
| `ApiVersionError` | Unsupported API version | Update the Sales Agent to the latest version |
| `NOT_FOUND` (Network) | Incorrect network code | Verify `GAM_NETWORK_CODE` matches your GAM network |
| `ServerError` | Transient GAM API issue | The adapter retries automatically; check again after a few minutes |

### Rate Limiting

The GAM API enforces rate limits per network. The adapter includes automatic retry with exponential backoff for rate-limited requests.

{: .table .table-bordered .table-striped }
| Limit Type | Default Limit | Adapter Behavior |
|------------|--------------|------------------|
| Requests per second | Varies by network | Automatic throttling with backoff |
| Daily quota | Varies by account tier | Logged as warning when approaching 80% |
| Reporting queries | Varies | Queued and batched to stay within limits |

If you consistently hit rate limits, consider:

- Reducing the frequency of `get_media_buy_delivery` calls
- Batching creative sync operations
- Contacting Google to increase your API quota

### Permission Issues

If the adapter authenticates successfully but operations fail:

1. Verify the service account has the correct role in GAM (**Admin > Service account users**)
2. Ensure the role includes permissions for: Orders, Line Items, Creatives, Reports
3. Check that the network code in your configuration matches the network where the service account is added

### OAuth Token Errors

For OAuth-based authentication (development):

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `invalid_grant` | Refresh token expired or revoked | Re-run the OAuth consent flow to obtain a new refresh token |
| `invalid_client` | Wrong client ID or secret | Verify `GAM_OAUTH_CLIENT_ID` and `GAM_OAUTH_CLIENT_SECRET` |
| `access_denied` | User did not grant required scopes | Re-authorize with the `https://www.googleapis.com/auth/dfp` scope |

### Common Issues

**Order creation fails with targeting error**: Ensure the ad unit IDs in your product targeting templates exist in your GAM network. Ad unit paths are case-sensitive and must match exactly.

**Creatives rejected by GAM**: Check that the creative dimensions match the Line Item's expected sizes. GAM enforces strict size validation for display creatives.

**Delivery data returns empty**: GAM reporting data can take up to 24 hours to appear. For real-time approximate data, the adapter falls back to Line Item delivery indicators when available.

**Connection test passes but operations fail**: This usually indicates the service account has API access but lacks the specific GAM role permissions needed for order/line item management. Check the service account's role in GAM Admin.

## Custom Adapters for Other Ad Servers

If you use an ad server other than Google Ad Manager, you can create a custom adapter by implementing the `AdServerAdapter` abstract base class. The adapter pattern ensures that all business logic remains ad-server-agnostic.

For details on the adapter interface and implementation guidelines, see [Source Architecture](/agents/salesagent/developers/source-architecture.html).

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) -- Adapter pattern and system design
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- End-to-end publisher setup
- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Adapter source code organization
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete MCP tool catalog
- [Google Ad Manager API Reference](https://developers.google.com/ad-manager/api/reference) -- Official GAM API documentation
