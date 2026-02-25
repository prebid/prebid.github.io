---
layout: page_v2
title: Prebid Sales Agent - Tutorials - Publisher Catalog Setup
description: Step-by-step tutorial for creating advertising products with pricing, targeting, and creative formats
sidebarType: 10
---

# Publisher Catalog Setup Tutorial
{: .no_toc}

This tutorial walks through creating a product catalog that the Sales Agent uses to match advertiser briefs to your inventory.

- TOC
{:toc}

## Prerequisites

Before starting this tutorial, you need:

- A running Sales Agent instance (see [Quick Start](/agents/salesagent/getting-started/quickstart.html))
- Admin access to the publisher tenant
- At least one configured ad server adapter (or the [mock adapter](/agents/salesagent/tutorials/mock-testing.html) for testing)

## Step 1: Plan Your Products

Map your ad inventory to products that advertisers can purchase. Each product represents a distinct advertising opportunity with its own pricing, targeting, and creative requirements.

Common product types:

{: .table .table-bordered .table-striped }
| Product Type | Channel | Typical Pricing | Example |
|-------------|---------|-----------------|---------|
| Display Banner | Web | CPM | 300x250 banner on sports section |
| Video Pre-roll | Web, CTV | CPCV | 15-second pre-roll on video content |
| Audio Spot | Audio | CPM | 30-second mid-roll on podcast feed |
| Native | Web, App | CPC | In-feed sponsored content card |
| Interstitial | App | CPM | Full-screen ad between app screens |
| Homepage Takeover | Web | Flat rate | 24-hour homepage sponsorship |

{: .alert.alert-info :}
Product descriptions are used by the AI search engine when matching advertiser briefs to inventory. Write descriptions that include the content vertical, audience characteristics, and placement context. For example: "Premium video pre-roll on live sports streaming content reaching 18-34 male demographics" is more discoverable than "Video ad."

## Step 2: Access the Admin UI

Navigate to the Admin UI:

```
http://localhost:8000/admin
```

Log in with your admin credentials. Select **Products** from the navigation menu.

## Step 3: Create a Product

Click **New Product** and fill in the required fields:

{: .table .table-bordered .table-striped }
| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Display name for the product (e.g., "Display Banner - Sports Section") |
| Description | Yes | Detailed description used for AI search matching |
| Delivery Type | Yes | `guaranteed` (reserved inventory) or `non_guaranteed` (auction-based) |
| Channels | Yes | One or more: `web`, `app`, `ctv`, `audio` |
| Countries | Yes | ISO 3166-1 alpha-2 country codes where the product is available |

### Delivery Types

{: .table .table-bordered .table-striped }
| Type | Behavior | Use Case |
|------|----------|----------|
| `guaranteed` | Inventory is reserved for the buyer at a fixed price | Direct-sold campaigns, sponsorships |
| `non_guaranteed` | Inventory is available on a best-effort basis, may compete in auction | Programmatic campaigns, remnant inventory |

## Step 4: Configure Pricing Options

Each product can have multiple pricing options to support different buying models. Navigate to the **Pricing** tab for your product.

### Supported Pricing Models

{: .table .table-bordered .table-striped }
| Model | Unit | Description |
|-------|------|-------------|
| CPM | Cost per 1,000 impressions | Standard display and video pricing |
| vCPM | Cost per 1,000 viewable impressions | Viewability-guaranteed pricing |
| CPC | Cost per click | Performance-oriented pricing |
| CPCV | Cost per completed view | Video completion pricing |
| Flat rate | Cost per time period | Sponsorships and takeovers |

For each pricing option, configure:

- **Rate** -- The unit price (e.g., `$12.50` CPM)
- **Currency** -- ISO 4217 currency code (e.g., `USD`, `EUR`, `GBP`)
- **Minimum spend** -- The minimum total spend required to book this product at this rate

```
Example:
  Model: CPM
  Rate: $12.50
  Currency: USD
  Minimum Spend: $5,000
```

{: .alert.alert-warning :}
Pricing options are visible to the Sales Agent during media buy creation. Set rates that reflect your actual rate card. The agent uses these rates when generating proposals and calculating campaign totals.

## Step 5: Set Up Targeting

Navigate to the **Targeting** tab. Targeting options define what inventory segments the product covers and what additional targeting the buyer can apply.

### Geographic Targeting

{: .table .table-bordered .table-striped }
| Level | Examples | Notes |
|-------|----------|-------|
| Countries | `US`, `GB`, `DE` | ISO 3166-1 alpha-2 |
| Regions | `US-CA`, `US-NY` | ISO 3166-2 |
| Metros / DMAs | `501` (New York), `803` (Los Angeles) | Nielsen DMA codes |
| Postal codes | `10001`, `SW1A 1AA` | Country-specific format |

### Device Targeting

Select one or more device types:

- Desktop
- Mobile
- Tablet
- Connected TV
- Set-top box

### Content Targeting

Assign IAB content categories to associate the product with specific content verticals (e.g., `IAB17` for Sports, `IAB1` for Arts & Entertainment).

### Custom Key-Value Targeting

Define custom key-value pairs for targeting dimensions specific to your inventory:

```
Key: section
Values: sports, news, entertainment, lifestyle

Key: position
Values: above_fold, below_fold, sidebar
```

## Step 6: Configure Creative Formats

Navigate to the **Creatives** tab. Link the product to supported creative formats by referencing format IDs from the `list_creative_formats` tool.

To see available formats:

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN list_creative_formats '{}'
```

For each linked format, specify:

{: .table .table-bordered .table-striped }
| Field | Description | Example |
|-------|-------------|---------|
| Format ID | Reference to a creative format definition | `banner_300x250` |
| Accepted media types | MIME types the ad server accepts | `image/jpeg`, `image/png`, `text/html` |
| Max file size | Maximum creative file size in bytes | `150000` (150 KB) |
| Dimensions | Width x height in pixels (for display) | `300x250` |

## Step 7: Test with AI Search

After creating your products, verify that the AI search engine can discover them. The `get_products` tool accepts a natural-language brief and returns matching products:

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN \
  get_products '{"brief":"video ads for sports content"}'
```

Expected output includes your video products with sports-related descriptions, ranked by relevance.

If your products are not returned:

1. Check that the product description includes relevant keywords.
2. Verify the product is not disabled or archived.
3. Confirm the product's channels and countries match the implicit or explicit brief criteria.

## Step 8: Verify with a Test Media Buy

Create a test campaign to validate the full flow from product selection through order creation:

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN \
  create_media_buy '{
    "product_id": "YOUR_PRODUCT_ID",
    "advertiser_name": "Test Advertiser",
    "campaign_name": "Catalog Validation Test",
    "start_date": "2026-03-01",
    "end_date": "2026-03-31",
    "impressions": 100000
  }'
```

{: .alert.alert-info :}
Using the [mock adapter](/agents/salesagent/tutorials/mock-testing.html) for this step avoids creating real orders in your ad server. The mock adapter simulates the full campaign lifecycle without external dependencies.

Verify the media buy was created:

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN \
  get_media_buy '{"media_buy_id": "RETURNED_ID"}'
```

Confirm that:

- The product ID and pricing match your catalog configuration
- Targeting defaults are applied correctly
- The campaign dates and impression goals are set as specified

## Further Reading

- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- Full onboarding guide for new publishers
- [Admin UI Guide](/agents/salesagent/overview/admin-ui.html) -- Admin interface reference
- [get_products](/agents/salesagent/tools/tool-reference.html) -- Tool reference for product search
- [list_creative_formats](/agents/salesagent/tools/tool-reference.html) -- Tool reference for creative format listing
- [Campaign Lifecycle Tutorial](/agents/salesagent/tutorials/campaign-lifecycle.html) -- End-to-end campaign workflow
