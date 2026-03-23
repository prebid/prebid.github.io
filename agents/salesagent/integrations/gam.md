---
layout: page_v2
title: Prebid Sales Agent - Google Ad Manager Integration
description: Configure and use the Google Ad Manager adapter with the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Google Ad Manager Integration
{: .no_toc}

- TOC
{:toc}

## Overview

The Google Ad Manager (GAM) integration is the most full-featured production adapter for the Prebid Sales Agent. It connects the Sales Agent to the GAM API (using the `googleads` 49.0.0 SDK), enabling AI buying agents to create orders, manage line items, upload creatives, set targeting, and pull performance reports — all through the standard Sales Agent tool interface.

The adapter is identified by `adapter_name: "google_ad_manager"` and is implemented as a multi-module package under `src/adapters/gam/`.

## Prerequisites

Before configuring the GAM integration, ensure you have:

- A Google Ad Manager account with API access enabled
- A GAM network with an active Ad Manager 360 or Small Business subscription
- One of the following authentication credentials:
  - A GCP service account JSON key file with GAM API permissions, **or**
  - OAuth 2.0 client credentials (client ID and client secret)
- The GAM network code for your account

<div class="alert alert-info" role="alert">
  API access must be explicitly enabled in your GAM network settings under <strong>Admin > Global settings > Network settings > API access</strong>. Contact your Google account representative if this option is not available.
</div>

## Authentication Setup

The GAM adapter supports two authentication methods. Choose the one that best fits your deployment model.

### Option 1: Service Account (Recommended for Production)

Service account authentication is the recommended approach for server-to-server deployments. It does not require user interaction and credentials do not expire.

1. Create a service account in the [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Download the JSON key file.
3. In GAM, go to **Admin > Global settings > Network settings > API access** and add the service account email address.
4. Set the environment variable pointing to the key file:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### Option 2: OAuth 2.0 Client Credentials

OAuth 2.0 is useful for development environments or when a service account is not available.

1. Create OAuth 2.0 credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Set the following environment variables:

```bash
GAM_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GAM_OAUTH_CLIENT_SECRET=your-client-secret
```

## Configuration

### Environment Variables

{: .table .table-bordered .table-striped }
| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes (Option 1) | Path to the GCP service account JSON key file |
| `GAM_OAUTH_CLIENT_ID` | Yes (Option 2) | OAuth 2.0 client ID from Google Cloud Console |
| `GAM_OAUTH_CLIENT_SECRET` | Yes (Option 2) | OAuth 2.0 client secret |
| `GCP_PROJECT_ID` | No | GCP project ID (required for some reporting features) |

### Admin UI Configuration

1. Log in to the Admin UI at `http://your-host:8000/admin`.
2. Navigate to **Settings > Ad Server**.
3. Select **Google Ad Manager** from the adapter type dropdown.
4. Enter your GAM network code and any additional configuration in the JSONB config field.
5. Save the configuration.

The adapter configuration is stored in the `adapter_config` table with `adapter_type` set to `"google_ad_manager"`.

## Supported Channels

The GAM adapter supports the following default media channels:

{: .table .table-bordered .table-striped }
| Channel | Description |
|---------|-------------|
| `display` | Standard banner and rich media display ads |
| `olv` | Online video (pre-roll, mid-roll, post-roll) |
| `social` | Social media inventory |

## Capabilities

The GAM adapter declares the following capabilities via its `AdapterCapabilities` configuration:

{: .table .table-bordered .table-striped }
| Capability | Supported | Notes |
|------------|-----------|-------|
| Inventory Sync | Yes | Automatic background synchronization of ad units and placements |
| Inventory Profiles | Yes | Reusable inventory configurations that products reference |
| Custom Targeting | Yes | Key-value targeting via GAM custom targeting keys |
| Geo Targeting | Yes | Full geographic targeting including countries, regions, metros, and postal codes |
| Dynamic Products | Yes | Products that dynamically reference GAM inventory |
| All Pricing Models | Yes | CPM, CPC, CPD, and other GAM-supported pricing models |
| Webhooks | No | Use polling-based delivery reporting instead |
| Real-Time Reporting | No | Reporting pulled on demand via the GAM Reporting API |

## How It Works

### Inventory Management

The GAM adapter keeps the Sales Agent's inventory data synchronized with your GAM network through background sync operations.

- The `BackgroundSync` operation periodically pulls ad units, placements, and targeting keys from GAM.
- Synced inventory data is stored locally in the Sales Agent database, enabling fast product matching without live GAM API calls.
- Sync frequency is configurable through the Admin UI.

### Order Creation

When an AI buying agent calls `create_media_buy`, the GAM adapter:

1. Maps the media buy to a GAM **Order** with one or more **Line Items**.
2. Applies the naming template configured on the tenant (see [Naming Templates](#naming-templates) below).
3. Sets pricing, flight dates, and delivery goals on each line item.
4. Returns the GAM order ID and line item IDs in the media buy response.

### Creative Upload

The `upload_creatives` operation handles creative asset management:

1. Accepts creative assets (images, video, HTML5) from the `sync_creatives` tool.
2. Uploads assets to GAM via the Creatives API.
3. Associates creatives with the appropriate line items using `AssignCreatives`.
4. Tracks creative approval status from GAM.

### Targeting

The GAM adapter supports multiple targeting dimensions:

- **Geographic targeting** — Countries, regions, metro areas (Nielsen DMA, EUROSTAT NUTS2, UK ITL1/ITL2), and postal codes (US ZIP, ZIP+4, Canadian, UK, German, French, Australian)
- **Custom targeting** — Key-value pairs from GAM custom targeting keys
- **Audience targeting** — First-party and third-party audience segments
- **Contextual targeting** — Content categories and page-level targeting
- **Inventory targeting** — Specific ad units, placements, or inventory profiles

The adapter exposes these through the `get_targeting_capabilities()` method, which returns a `TargetingCapabilities` instance describing all supported targeting dimensions.

### Reporting

The GAM adapter pulls delivery and performance metrics through the GAM Reporting API:

- The `GetPerformanceReport` operation fetches impressions, clicks, revenue, and other metrics.
- Reports can be filtered by date range, line item, and creative.
- The `get_media_buy_delivery` tool surfaces these metrics to AI buying agents.

### Workflow

The adapter manages order and line item lifecycle transitions:

- Draft to pending approval
- Pending approval to approved (after human-in-the-loop review)
- Approved to delivering
- Paused, resumed, and completed states

## GAM Manager Modules

The GAM adapter is organized into specialized manager modules, each handling a distinct area of GAM API interaction:

{: .table .table-bordered .table-striped }
| Module | File | Responsibility |
|--------|------|----------------|
| Inventory Manager | `inventory.py` | Ad unit and placement sync, inventory queries |
| Orders Manager | `orders.py` | Order and line item CRUD, status transitions |
| Creatives Manager | `creatives.py` | Creative upload, assignment, approval tracking |
| Targeting Manager | `targeting.py` | Geographic, custom, and audience targeting |
| Reporting Manager | `reporting.py` | Performance report generation and parsing |
| Sync Manager | `sync.py` | Background synchronization orchestration |
| Workflow Manager | `workflow.py` | Order approval and lifecycle management |

## Error Handling

The GAM adapter implements robust error handling for API interactions:

- **Timeout with exponential backoff** — Retries transient GAM API errors with increasing delays.
- **Error recovery classification** — Errors are classified as retryable (rate limits, timeouts) or permanent (invalid credentials, missing permissions) using the `AdCPAdapterError` hierarchy.
- **API quota management** — The adapter respects GAM API rate limits and queues requests when approaching quota thresholds.

## Naming Templates

Publishers can configure naming templates that control how GAM orders and line items are named. These are set on the tenant configuration:

- `order_name_template` — Template for GAM order names (e.g., `"{advertiser} - {product} - {date}"`)
- `line_item_name_template` — Template for GAM line item names

Templates support variable substitution with fields from the media buy, product, and principal. The Naming Agent (AI) can also generate names from briefs when templates are not sufficient.

## Inventory Profiles

Inventory profiles are reusable GAM inventory configurations that products can reference. They allow publishers to define named collections of ad units, placements, and targeting criteria that can be shared across multiple products.

- Created and managed through the Admin UI under **Inventory Profiles**.
- Products reference inventory profiles by ID rather than specifying raw GAM ad unit IDs.
- When GAM inventory changes (ad units added or removed), updating the inventory profile automatically updates all referencing products.

## Troubleshooting

### Common Errors

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `AuthenticationError` | Invalid or expired credentials | Verify `GOOGLE_APPLICATION_CREDENTIALS` path or refresh OAuth tokens |
| `PermissionDenied` | Service account lacks GAM API access | Add the service account email in GAM Admin > API access |
| `QuotaExceeded` | GAM API rate limit hit | The adapter retries automatically; reduce sync frequency if persistent |
| `NetworkNotFound` | Incorrect GAM network code | Verify the network code in Admin UI adapter config |
| `InvalidCreativeSize` | Creative dimensions do not match line item | Ensure creative assets match the sizes defined in the product |

### API Quota Issues

GAM enforces API request quotas per network. If you encounter persistent quota errors:

1. Check your current quota usage in the Google Cloud Console.
2. Reduce the background sync frequency in the Admin UI.
3. Avoid calling `get_media_buy_delivery` in tight loops — use reasonable polling intervals.
4. Contact Google support to request a quota increase if needed.

### Authentication Failures

If authentication fails after initial setup:

1. For service accounts: verify the JSON key file exists at the path specified in `GOOGLE_APPLICATION_CREDENTIALS` and has not been revoked.
2. For OAuth: check that the client ID and secret are correct and that the OAuth consent screen is properly configured.
3. Verify that the authenticated identity has been granted access in GAM under **Admin > Global settings > Network settings > API access**.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — Adapter pattern overview
- [Mock Adapter](/agents/salesagent/integrations/mock-adapter.html) — Test without a live GAM account
- [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) — Extend the adapter pattern
