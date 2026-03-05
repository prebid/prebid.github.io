---
layout: page_v2
title: Prebid Sales Agent - Tutorials - Testing with the Mock Adapter
description: Tutorial for using the mock adapter to test campaign workflows without a real ad server
sidebarType: 10
---

# Testing with the Mock Adapter
{: .no_toc}

This tutorial walks through using the mock adapter to test the full campaign lifecycle without connecting to a real ad server. The mock adapter simulates all ad server operations including delivery, creative processing, and approval workflows.

- TOC
{:toc}

## Prerequisites

A running Sales Agent instance with Docker. See the [Quick Start](/agents/salesagent/getting-started/quickstart.html) guide if you have not deployed yet.

## Step 1: Create a Test Tenant with Mock Adapter

```bash
docker-compose exec adcp-server python -m scripts.setup.setup_tenant "Test Publisher" --adapter mock
```

This creates a tenant configured to use the mock adapter instead of a real ad server.

## Step 2: Get Your Test Token

Retrieve the principal token for API access:

```bash
docker-compose exec postgres psql -U adcp_user -d adcp \
  -c "SELECT access_token FROM principals LIMIT 1;"
```

Save this token for use in subsequent commands.

## Step 3: Discover Products

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN get_products '{"brief":"all products"}'
```

The mock adapter returns a set of pre-configured products spanning display, video, audio, and native channels. Note the `product_id` values for the next step.

## Step 4: Create a Media Buy

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN create_media_buy '{
  "campaign_name": "Test Campaign",
  "media_buy_start_date": "2026-03-01",
  "media_buy_end_date": "2026-03-31",
  "packages": [{
    "product_id": "PRODUCT_ID_FROM_STEP_3",
    "budget": 5000,
    "currency": "USD"
  }]
}'
```

The mock adapter processes this immediately (or routes through approval, depending on HITL configuration). Note the `media_buy_id` from the response.

## Step 5: Upload Creatives

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN sync_creatives '{
  "creatives": [{
    "name": "Test Banner",
    "format_id": "FORMAT_ID",
    "asset_url": "https://example.com/banner.jpg",
    "click_through_url": "https://example.com/landing"
  }],
  "assignments": {
    "PACKAGE_ID": ["CREATIVE_ID"]
  }
}'
```

## Step 6: Check Delivery

```bash
uvx adcp http://localhost:8000/mcp/ --auth YOUR_TOKEN get_media_buy_delivery '{
  "media_buy_id": "YOUR_MEDIA_BUY_ID"
}'
```

The mock adapter returns simulated delivery metrics based on the product's simulation parameters (daily impressions, fill rate, CTR, viewability).

## Simulation Scenarios

The mock adapter supports four simulation scenarios that control delivery behavior. Configure these through the product's simulation parameters in the Admin UI.

{: .table .table-bordered .table-striped }
| Scenario | Behavior |
|----------|----------|
| `normal` | Standard delivery at configured rates |
| `high_demand` | Competitive inventory, higher CPMs, slower fill |
| `degraded` | Partial delivery failures, reduced fill rate |
| `outage` | Complete ad server failure, all operations return errors |

### Product Simulation Parameters

{: .table .table-bordered .table-striped }
| Parameter | Default | Description |
|-----------|---------|-------------|
| `daily_impressions` | 10,000 | Simulated daily impression volume |
| `fill_rate` | 85% | Percentage of available inventory filled |
| `ctr` | 2% | Simulated click-through rate |
| `viewability` | 65% | Simulated viewability rate |
| `scenario` | `normal` | Active simulation scenario |

## Testing HITL Approval Workflows

The mock adapter can simulate human-in-the-loop (HITL) approval flows where media buys or creatives require manual approval before activation.

### Sync Mode

In sync mode, the mock adapter delays responses to simulate human review time:

1. Submit a media buy via `create_media_buy`
2. The response returns with status `pending_approval`
3. Use `list_tasks` to see the pending approval task
4. Use `complete_task` to approve or reject

```python
# List pending tasks
tasks = await client.call_tool("list_tasks", {"status": "requires_approval"})

# Approve the task
await client.call_tool("complete_task", {
    "task_id": tasks["tasks"][0]["task_id"],
    "status": "completed"
})
```

### Async Mode

In async mode, tasks enter a pending state and can be completed via webhook or manual intervention:

1. Submit a media buy — returns immediately with a task ID
2. Poll `get_task` or wait for a webhook notification
3. Complete the task when ready

### Mixed Mode

Mixed mode applies per-operation overrides. For example, media buys may require approval while creative uploads process automatically.

Configure HITL mode through the adapter's `platform_mappings.mock.hitl_config` setting in the Admin UI.

## Python Client Example

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "YOUR_TOKEN"}
)

async with Client(transport) as client:
    # Discover products
    products = await client.call_tool("get_products", {"brief": "display banner"})
    product_id = products["products"][0]["product_id"]

    # Create media buy
    result = await client.call_tool("create_media_buy", {
        "campaign_name": "Mock Test",
        "media_buy_start_date": "2026-03-01",
        "media_buy_end_date": "2026-03-31",
        "packages": [{
            "product_id": product_id,
            "budget": 5000,
            "currency": "USD"
        }]
    })
    media_buy_id = result["media_buy_id"]

    # Check delivery
    delivery = await client.call_tool("get_media_buy_delivery", {
        "media_buy_id": media_buy_id
    })
    print(f"Impressions: {delivery['impressions']}")
    print(f"Spend: ${delivery['spend']:.2f}")
```

## Delivery Simulation

The mock adapter supports time-accelerated delivery simulation with webhook notifications. This allows testing of pacing, budget depletion, and campaign completion without waiting for real calendar time.

{: .alert.alert-info :}
For a detailed walkthrough of delivery simulation with working code, see `examples/delivery_simulation_demo.py` in the [salesagent repository](https://github.com/prebid/salesagent).

## Further Reading

- [Mock Adapter Reference](/agents/salesagent/integrations/mock-adapter.html) -- Full mock adapter documentation
- [Campaign Lifecycle Tutorial](/agents/salesagent/tutorials/campaign-lifecycle.html) -- End-to-end campaign walkthrough
- [Testing Guide](/agents/salesagent/developers/testing.html) -- Running the test suite
- [Workflow Tools](/agents/salesagent/tools/workflow-tools.html) -- HITL task management
