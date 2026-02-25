---
layout: page_v2
title: Prebid Sales Agent - Tutorials - End-to-End Campaign Lifecycle Tutorial
description: Complete step-by-step tutorial walking through an entire campaign lifecycle using the mock adapter and Python FastMCP client
sidebarType: 10
---

# End-to-End Campaign Lifecycle Tutorial
{: .no_toc}

This tutorial walks through the complete lifecycle of an advertising campaign using the Prebid Sales Agent's MCP interface and the mock adapter. You will discover capabilities, search for products, create a media buy, upload creatives, and track delivery -- all from Python code using the FastMCP client.

- TOC
{:toc}

## Prerequisites

Before starting this tutorial, ensure you have the following:

{: .table .table-bordered .table-striped }
| Requirement | Details |
|-------------|---------|
| Running Sales Agent | Docker Compose with `CREATE_DEMO_TENANT=true` and `ADCP_AUTH_TEST_MODE=true`. See [Quick Start](/agents/salesagent/getting-started/quickstart.html). |
| Python 3.11+ | Required for async/await and type hints |
| fastmcp package | `pip install fastmcp` |
| httpx package | `pip install httpx` (dependency of fastmcp) |

{: .alert.alert-info :}
This tutorial uses the **mock adapter**, so all ad server responses are simulated. No real ad server connection is required. The mock adapter returns realistic but synthetic data, making it safe to experiment freely.

## Step 1: Connect to the Server

Establish a connection to the Sales Agent's MCP endpoint using `StreamableHttpTransport`. The transport handles HTTP/SSE communication and passes your authentication token with every request.

```python
import asyncio
import json
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

async def main():
    # Create transport with auth token
    transport = StreamableHttpTransport(
        "http://localhost:8000/mcp/",
        headers={"x-adcp-auth": "test-token"}
    )

    async with Client(transport) as client:
        print("Connected to Sales Agent MCP server")

        # All subsequent steps happen inside this context manager
        # ...

asyncio.run(main())
```

The `x-adcp-auth` header carries your authentication token. In test mode, `test-token` is accepted. In production, this would be a token generated through the Admin UI for your advertiser account.

## Step 2: Discover Capabilities

The first tool a buying agent should call is [`get_adcp_capabilities`](/agents/salesagent/tools/get-adcp-capabilities.html). This returns the agent's identity, supported protocol versions, available tools, and targeting systems.

```python
async with Client(transport) as client:
    # Discover what the Sales Agent can do
    result = await client.call_tool("get_adcp_capabilities")
    capabilities = result

    print(f"Agent: {capabilities['agent_name']}")
    print(f"Version: {capabilities['agent_version']}")
    print(f"AdCP versions: {capabilities['adcp_versions']}")
    print(f"Skills: {capabilities['supported_skills']}")
    print(f"Tools: {[t['name'] for t in capabilities['supported_tools']]}")
    print(f"Geo systems: {capabilities['geo_targeting_systems']}")
```

Expected response:

```json
{
  "agent_name": "Prebid Sales Agent",
  "agent_version": "1.0.0",
  "adcp_versions": ["1.0.0"],
  "supported_skills": [
    "product_discovery",
    "media_buying",
    "creative_management",
    "delivery_reporting"
  ],
  "supported_tools": [
    {"name": "get_adcp_capabilities", "description": "Protocol capability discovery"},
    {"name": "get_products", "description": "AI-powered product search"},
    {"name": "create_media_buy", "description": "Campaign creation"},
    {"name": "sync_creatives", "description": "Upload and manage creatives"},
    {"name": "get_media_buy_delivery", "description": "Delivery metrics"},
    {"name": "get_media_buys", "description": "Query media buys"}
  ],
  "geo_targeting_systems": ["geonames", "iso3166"],
  "authorized_domains": ["demo-publisher.example.com"],
  "creative_formats": ["display", "video", "audio", "native"]
}
```

Use this response to confirm which tools are available and what targeting systems are supported before proceeding.

## Step 3: Search Products

Use [`get_products`](/agents/salesagent/tools/get-products.html) to search the publisher's advertising catalog with a natural language brief. The AI-powered search engine interprets your request and returns matching products with pricing, formats, and availability.

```python
async with Client(transport) as client:
    # Search for video advertising products
    result = await client.call_tool(
        "get_products",
        {
            "brief": "video ads for sports content",
            "brand_manifest": {
                "brand_name": "SportsBrand Co",
                "category": "sporting_goods"
            }
        }
    )
    products = result

    print(f"Found {products['total_results']} products:")
    for product in products["products"]:
        print(f"  - {product['name']} (ID: {product['product_id']})")
        print(f"    Channels: {product['channels']}")
        print(f"    Pricing: {product['pricing_options']}")
        print(f"    Formats: {product['format_ids']}")
```

Expected response:

```json
{
  "products": [
    {
      "product_id": "prod_sports_video_001",
      "name": "Premium Sports Video - Pre-Roll",
      "description": "15s and 30s pre-roll video across sports editorial content",
      "pricing_options": [
        {"model": "CPM", "amount": 28.00, "currency": "USD", "id": "price_cpm_28"}
      ],
      "format_ids": ["video_16x9_preroll_15s", "video_16x9_preroll_30s"],
      "estimated_exposures": {
        "min_impressions": 200000,
        "max_impressions": 800000,
        "period": "monthly"
      },
      "channels": ["video"],
      "countries": ["US", "GB", "CA"]
    }
  ],
  "total_results": 1
}
```

Note the `product_id` and `pricing_options[].id` values -- you will need these when creating a media buy.

## Step 4: Check Creative Formats

Before creating a campaign, verify what creative specifications the chosen product requires by calling [`list_creative_formats`](/agents/salesagent/tools/list-creative-formats.html).

```python
async with Client(transport) as client:
    # Get creative format specs for the product's format IDs
    result = await client.call_tool(
        "list_creative_formats",
        {
            "format_ids": ["video_16x9_preroll_15s", "video_16x9_preroll_30s"]
        }
    )
    formats = result

    for fmt in formats["formats"]:
        print(f"Format: {fmt['format_id']}")
        print(f"  Type: {fmt['media_type']}")
        print(f"  Dimensions: {fmt['width']}x{fmt['height']}")
        print(f"  Max file size: {fmt['max_file_size_bytes']} bytes")
        print(f"  Accepted MIME types: {fmt['mime_types']}")
        print(f"  Duration: {fmt.get('duration_seconds', 'N/A')}s")
```

Expected response:

```json
{
  "formats": [
    {
      "format_id": "video_16x9_preroll_15s",
      "media_type": "video",
      "width": 1920,
      "height": 1080,
      "max_file_size_bytes": 15728640,
      "mime_types": ["video/mp4", "video/webm"],
      "duration_seconds": 15,
      "aspect_ratio": "16:9"
    },
    {
      "format_id": "video_16x9_preroll_30s",
      "media_type": "video",
      "width": 1920,
      "height": 1080,
      "max_file_size_bytes": 31457280,
      "mime_types": ["video/mp4", "video/webm"],
      "duration_seconds": 30,
      "aspect_ratio": "16:9"
    }
  ]
}
```

Ensure your creative assets match these specifications before uploading. Mismatched formats will result in a `FORMAT_INCOMPATIBLE` error.

## Step 5: Create a Media Buy

With a product selected and format specs confirmed, create a media buy using [`create_media_buy`](/agents/salesagent/tools/create-media-buy.html). This is the core execution step that creates a campaign.

```python
async with Client(transport) as client:
    # Create a media buy (campaign)
    result = await client.call_tool(
        "create_media_buy",
        {
            "brand_manifest": {
                "brand_name": "SportsBrand Co",
                "category": "sporting_goods",
                "website": "https://sportsbrand.example.com"
            },
            "campaign_name": "SportsBrand Q2 Video Campaign",
            "start_date": "2025-07-01",
            "end_date": "2025-07-31",
            "packages": [
                {
                    "product_id": "prod_sports_video_001",
                    "budget_cents": 500000,
                    "pricing_option_id": "price_cpm_28",
                    "targeting": {
                        "countries": ["US"],
                        "devices": ["desktop", "mobile"]
                    }
                }
            ]
        }
    )
    media_buy = result

    print(f"Media Buy ID: {media_buy['media_buy_id']}")
    print(f"Status: {media_buy['status']}")
    print(f"Total Budget: ${media_buy['total_budget_cents'] / 100:.2f}")
```

Expected response:

```json
{
  "media_buy_id": "mb_abc123xyz",
  "status": "pending_approval",
  "campaign_name": "SportsBrand Q2 Video Campaign",
  "total_budget_cents": 500000,
  "start_date": "2025-07-01",
  "end_date": "2025-07-31",
  "packages": [
    {
      "package_id": "pkg_001",
      "product_id": "prod_sports_video_001",
      "budget_cents": 500000,
      "pricing_option_id": "price_cpm_28",
      "status": "pending"
    }
  ],
  "created_at": "2025-06-15T14:30:00Z"
}
```

{: .alert.alert-info :}
The `create_media_buy` tool is **asynchronous**. The response confirms that the media buy has been accepted, but actual provisioning in the ad server happens in the background. The initial status is typically `pending_approval`, meaning a human publisher must approve the buy before it goes live. Poll with `get_media_buys` to track status changes.

### Understanding the Packages Array

Each package in the `packages` array represents a line item within the media buy:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `product_id` | `str` | The product to purchase (from `get_products` results) |
| `budget_cents` | `int` | Budget for this package in cents (e.g., 500000 = $5,000.00) |
| `pricing_option_id` | `str` | Which pricing model to use (from the product's `pricing_options`) |
| `targeting` | `object` | Optional targeting overrides (countries, devices, audience segments) |

A single media buy can contain multiple packages targeting different products, enabling multi-placement campaigns in a single request.

## Step 6: Upload Creatives

Once the media buy exists, upload creative assets using [`sync_creatives`](/agents/salesagent/tools/sync-creatives.html). The creative format must match the specifications from Step 4.

```python
async with Client(transport) as client:
    # Upload creatives for the media buy
    result = await client.call_tool(
        "sync_creatives",
        {
            "media_buy_id": "mb_abc123xyz",
            "creatives": [
                {
                    "name": "SportsBrand 15s Pre-Roll",
                    "format_id": "video_16x9_preroll_15s",
                    "asset_url": "https://cdn.sportsbrand.example.com/ads/q2_preroll_15s.mp4",
                    "click_through_url": "https://sportsbrand.example.com/summer-sale",
                    "metadata": {
                        "duration_seconds": 15,
                        "mime_type": "video/mp4"
                    }
                },
                {
                    "name": "SportsBrand 30s Pre-Roll",
                    "format_id": "video_16x9_preroll_30s",
                    "asset_url": "https://cdn.sportsbrand.example.com/ads/q2_preroll_30s.mp4",
                    "click_through_url": "https://sportsbrand.example.com/summer-sale",
                    "metadata": {
                        "duration_seconds": 30,
                        "mime_type": "video/mp4"
                    }
                }
            ]
        }
    )
    creative_result = result

    for creative in creative_result["creatives"]:
        print(f"Creative: {creative['name']}")
        print(f"  ID: {creative['creative_id']}")
        print(f"  Status: {creative['status']}")
```

Expected response:

```json
{
  "media_buy_id": "mb_abc123xyz",
  "creatives": [
    {
      "creative_id": "cr_001",
      "name": "SportsBrand 15s Pre-Roll",
      "format_id": "video_16x9_preroll_15s",
      "status": "pending_review",
      "asset_url": "https://cdn.sportsbrand.example.com/ads/q2_preroll_15s.mp4"
    },
    {
      "creative_id": "cr_002",
      "name": "SportsBrand 30s Pre-Roll",
      "format_id": "video_16x9_preroll_30s",
      "status": "pending_review",
      "asset_url": "https://cdn.sportsbrand.example.com/ads/q2_preroll_30s.mp4"
    }
  ],
  "synced_at": "2025-06-15T14:35:00Z"
}
```

{: .alert.alert-warning :}
Creative uploads are also asynchronous. The `pending_review` status means the publisher must approve the creative assets before they are associated with live ad serving. Ensure your `format_id` matches a format supported by the product, or you will receive a `FORMAT_INCOMPATIBLE` error.

## Step 7: Track Delivery

Once the campaign is approved and running, monitor delivery metrics using [`get_media_buy_delivery`](/agents/salesagent/tools/get-media-buy-delivery.html).

```python
async with Client(transport) as client:
    # Get delivery metrics
    result = await client.call_tool(
        "get_media_buy_delivery",
        {
            "media_buy_id": "mb_abc123xyz"
        }
    )
    delivery = result

    print(f"Media Buy: {delivery['media_buy_id']}")
    print(f"Status: {delivery['status']}")
    print(f"Impressions: {delivery['impressions']:,}")
    print(f"Clicks: {delivery['clicks']:,}")
    print(f"CTR: {delivery['ctr']:.2%}")
    print(f"Spend: ${delivery['spend_cents'] / 100:.2f}")
    print(f"Budget remaining: ${delivery['budget_remaining_cents'] / 100:.2f}")
```

Expected response:

```json
{
  "media_buy_id": "mb_abc123xyz",
  "status": "delivering",
  "impressions": 142857,
  "clicks": 1286,
  "ctr": 0.009,
  "spend_cents": 400000,
  "budget_remaining_cents": 100000,
  "start_date": "2025-07-01",
  "end_date": "2025-07-31",
  "packages": [
    {
      "package_id": "pkg_001",
      "product_id": "prod_sports_video_001",
      "impressions": 142857,
      "clicks": 1286,
      "spend_cents": 400000
    }
  ],
  "last_updated": "2025-07-18T12:00:00Z"
}
```

{: .alert.alert-info :}
With the mock adapter, delivery data is simulated. In production with a real ad server adapter (e.g., Google Ad Manager), these numbers reflect actual delivery metrics from the ad server.

## Step 8: Check Campaign Status

Use `get_media_buys` to list all your media buys and check their current status. This is useful for monitoring multiple campaigns at once.

```python
async with Client(transport) as client:
    # List all media buys
    result = await client.call_tool("get_media_buys", {})
    media_buys = result

    print(f"Total media buys: {len(media_buys['media_buys'])}")
    for mb in media_buys["media_buys"]:
        print(f"  [{mb['status']}] {mb['campaign_name']} "
              f"(ID: {mb['media_buy_id']}, "
              f"Budget: ${mb['total_budget_cents'] / 100:.2f})")
```

Expected response:

```json
{
  "media_buys": [
    {
      "media_buy_id": "mb_abc123xyz",
      "campaign_name": "SportsBrand Q2 Video Campaign",
      "status": "delivering",
      "total_budget_cents": 500000,
      "start_date": "2025-07-01",
      "end_date": "2025-07-31",
      "created_at": "2025-06-15T14:30:00Z"
    }
  ]
}
```

### Media Buy Status Values

{: .table .table-bordered .table-striped }
| Status | Description |
|--------|-------------|
| `pending_approval` | Awaiting publisher approval |
| `approved` | Approved but not yet delivering (before start date) |
| `delivering` | Actively serving ads |
| `paused` | Temporarily paused by publisher or buyer |
| `completed` | Flight dates ended; delivery finished |
| `rejected` | Publisher rejected the media buy |
| `cancelled` | Cancelled by the buyer |

## Complete Working Example

Here is the complete tutorial code in a single runnable script:

```python
import asyncio
import json
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport


async def run_campaign_lifecycle():
    """Complete campaign lifecycle using the mock adapter."""

    transport = StreamableHttpTransport(
        "http://localhost:8000/mcp/",
        headers={"x-adcp-auth": "test-token"}
    )

    async with Client(transport) as client:
        # Step 1: Discover capabilities
        print("=== Step 1: Discover Capabilities ===")
        capabilities = await client.call_tool("get_adcp_capabilities")
        print(f"Agent: {capabilities['agent_name']}")
        print(f"Tools: {[t['name'] for t in capabilities['supported_tools']]}")
        print()

        # Step 2: Search for products
        print("=== Step 2: Search Products ===")
        products_result = await client.call_tool(
            "get_products",
            {
                "brief": "video ads for sports content",
                "brand_manifest": {
                    "brand_name": "SportsBrand Co",
                    "category": "sporting_goods"
                }
            }
        )
        product = products_result["products"][0]
        print(f"Selected: {product['name']} ({product['product_id']})")
        print(f"Pricing: {product['pricing_options']}")
        print()

        # Step 3: Check creative formats
        print("=== Step 3: Check Creative Formats ===")
        formats_result = await client.call_tool(
            "list_creative_formats",
            {"format_ids": product["format_ids"]}
        )
        for fmt in formats_result["formats"]:
            print(f"  {fmt['format_id']}: {fmt['width']}x{fmt['height']} "
                  f"({fmt['media_type']}, {fmt.get('duration_seconds', 'N/A')}s)")
        print()

        # Step 4: Create a media buy
        print("=== Step 4: Create Media Buy ===")
        pricing_id = product["pricing_options"][0]["id"]
        media_buy = await client.call_tool(
            "create_media_buy",
            {
                "brand_manifest": {
                    "brand_name": "SportsBrand Co",
                    "category": "sporting_goods",
                    "website": "https://sportsbrand.example.com"
                },
                "campaign_name": "SportsBrand Q2 Video Campaign",
                "start_date": "2025-07-01",
                "end_date": "2025-07-31",
                "packages": [
                    {
                        "product_id": product["product_id"],
                        "budget_cents": 500000,
                        "pricing_option_id": pricing_id,
                        "targeting": {
                            "countries": ["US"],
                            "devices": ["desktop", "mobile"]
                        }
                    }
                ]
            }
        )
        media_buy_id = media_buy["media_buy_id"]
        print(f"Created: {media_buy_id} (Status: {media_buy['status']})")
        print()

        # Step 5: Upload creatives
        print("=== Step 5: Upload Creatives ===")
        format_id = product["format_ids"][0]
        creative_result = await client.call_tool(
            "sync_creatives",
            {
                "media_buy_id": media_buy_id,
                "creatives": [
                    {
                        "name": "SportsBrand Pre-Roll",
                        "format_id": format_id,
                        "asset_url": "https://cdn.sportsbrand.example.com/ads/preroll.mp4",
                        "click_through_url": "https://sportsbrand.example.com/sale",
                        "metadata": {
                            "duration_seconds": 15,
                            "mime_type": "video/mp4"
                        }
                    }
                ]
            }
        )
        for cr in creative_result["creatives"]:
            print(f"  Creative: {cr['name']} ({cr['creative_id']}) - {cr['status']}")
        print()

        # Step 6: Track delivery
        print("=== Step 6: Track Delivery ===")
        delivery = await client.call_tool(
            "get_media_buy_delivery",
            {"media_buy_id": media_buy_id}
        )
        print(f"Impressions: {delivery.get('impressions', 0):,}")
        print(f"Clicks: {delivery.get('clicks', 0):,}")
        print(f"Spend: ${delivery.get('spend_cents', 0) / 100:.2f}")
        print()

        # Step 7: Check status
        print("=== Step 7: Check Campaign Status ===")
        all_buys = await client.call_tool("get_media_buys", {})
        for mb in all_buys["media_buys"]:
            print(f"  [{mb['status']}] {mb['campaign_name']}")


if __name__ == "__main__":
    asyncio.run(run_campaign_lifecycle())
```

## Testing Tips

The mock adapter supports several special HTTP headers for advanced testing scenarios. Pass these headers in the `StreamableHttpTransport` constructor or add them per-request.

### X-Dry-Run Header

Set `X-Dry-Run: true` to validate a request without persisting any changes. Useful for testing `create_media_buy` calls without creating actual campaigns:

```python
transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={
        "x-adcp-auth": "test-token",
        "X-Dry-Run": "true"
    }
)
```

### X-Mock-Time Header

Override the server's current time to test time-dependent behavior such as flight date validation and delivery pacing:

```python
transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={
        "x-adcp-auth": "test-token",
        "X-Mock-Time": "2025-07-15T12:00:00Z"
    }
)
```

### X-Test-Session-ID Header

Isolate test data by providing a session ID. All data created within a test session is automatically cleaned up when the session ends:

```python
transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={
        "x-adcp-auth": "test-token",
        "X-Test-Session-ID": "my-test-session-001"
    }
)
```

{: .alert.alert-warning :}
These testing headers are only available when the server is running with the mock adapter. They have no effect in production deployments with real ad server adapters.

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of all 14 MCP tools
- [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) -- Capability discovery details
- [get_products](/agents/salesagent/tools/get-products.html) -- Product search parameters and filtering
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Media buy creation reference
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Creative upload and management
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Delivery metrics reference
- [Error Code Reference](/agents/salesagent/reference/error-codes.html) -- Troubleshooting error responses
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Server setup and Docker deployment
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- How MCP and A2A protocols work
