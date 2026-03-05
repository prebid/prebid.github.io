---
layout: page_v2
title: Prebid Sales Agent - Integrations - Mock Adapter Reference
description: Reference for the mock ad server adapter used for testing and development
sidebarType: 10
---

# Mock Adapter Reference
{: .no_toc}

The mock adapter (`MockAdServer`) is a simulated ad server integration for testing, evaluation, and CI/CD pipelines. It implements the full `AdServerAdapter` interface without requiring a real ad server.

- TOC
{:toc}

## Purpose

The mock adapter serves three primary use cases:

1. **Evaluation** -- Run the Sales Agent end-to-end without provisioning ad server credentials. Evaluate MCP tool calls, A2A task flows, and Admin UI features with simulated delivery data.
2. **Development** -- Build and test new features against a predictable, controllable ad server simulation. No network calls, no rate limits, no API quotas.
3. **CI/CD** -- Run automated integration tests in pipelines where real ad server access is unavailable or impractical.

The mock adapter is a drop-in replacement for any production adapter. All Sales Agent features -- media buy creation, creative management, delivery reporting, and campaign lifecycle operations -- work identically with the mock adapter.

## Supported Channels and Capabilities

The `MockAdServer` class implements `AdServerAdapter` and declares support for a broad set of channels and pricing models.

**Supported channels:**

{: .table .table-bordered .table-striped }
| Channel | Description |
|---------|-------------|
| `display` | Standard IAB display advertising |
| `olv` | Online video (pre-roll, mid-roll, out-stream) |
| `streaming_audio` | Streaming audio ad insertion |
| `social` | Social media advertising placements |

**Supported pricing models:**

{: .table .table-bordered .table-striped }
| Model | Description |
|-------|-------------|
| `cpm` | Cost per mille (thousand impressions) |
| `vcpm` | Viewable cost per mille |
| `cpcv` | Cost per completed view |
| `cpp` | Cost per point |
| `cpc` | Cost per click |
| `cpv` | Cost per view |
| `flat_rate` | Flat rate (fixed cost for a period) |

All targeting dimensions are supported, including geographic (country, region, DMA, postal code), custom key-value targeting, and inventory targeting.

## Product-Level Simulation Parameters

Each product configured for the mock adapter accepts simulation parameters that control how delivery data is generated.

{: .table .table-bordered .table-striped }
| Parameter | Default | Description |
|-----------|---------|-------------|
| `daily_impressions` | 10,000 | Simulated daily impression volume |
| `fill_rate` | 85% | Percentage of available inventory filled |
| `ctr` | 2% | Simulated click-through rate |
| `viewability` | 65% | Simulated viewability rate |
| `scenario` | `normal` | Simulation scenario (see below) |

### Simulation Scenarios

The `scenario` parameter controls the overall behavior of the mock adapter for a given product.

{: .table .table-bordered .table-striped }
| Scenario | Behavior |
|----------|----------|
| `normal` | Standard delivery pacing with minor daily variance |
| `high_demand` | Accelerated delivery with higher fill rates and faster budget consumption |
| `degraded` | Reduced delivery with intermittent errors and lower fill rates |
| `outage` | Simulates an ad server outage -- all operations return errors after initial creation |

Set the scenario in the product configuration through the Admin UI or during tenant setup.

## Delivery Simulation

The mock adapter generates time-accelerated campaign delivery data that simulates realistic pacing behavior.

Key behaviors:

- **Time acceleration** -- Delivery data accumulates faster than real time, allowing a 30-day campaign to produce meaningful metrics within minutes.
- **Pacing curves** -- Delivery follows configurable pacing curves (even, front-loaded, or back-loaded) to simulate real campaign behavior.
- **Daily variance** -- Random variance is applied to daily metrics to produce realistic-looking delivery reports.
- **Webhook notifications** -- The mock adapter fires webhook callbacks at configurable delivery milestones (25%, 50%, 75%, 100% pacing).

## Human-in-the-Loop (HITL) Simulation

The mock adapter can simulate human approval workflows, which is useful for testing campaigns that require manual review before going live.

### HITL Modes

{: .table .table-bordered .table-striped }
| Mode | Behavior |
|------|----------|
| **Sync** | Operations return after a configurable delay, simulating a human reviewer responding in real time. The delay is configurable per operation. |
| **Async** | Operations immediately return a `pending` status. A background process completes the approval after a configurable interval, triggering a webhook notification. |
| **Mixed** | Per-operation overrides allow some operations to use sync mode and others to use async mode. |

### Approval Simulation

The mock adapter simulates approval decisions with a configurable success rate. For example, setting the approval rate to 90% means roughly 1 in 10 submissions will be rejected.

{: .table .table-bordered .table-striped }
| Configuration Key | Default | Description |
|-------------------|---------|-------------|
| `approval_rate` | 100% | Percentage of submissions that are approved |
| `sync_delay_seconds` | 2 | Delay before sync mode operations return |
| `async_completion_seconds` | 10 | Delay before async mode operations complete |

### Configuration

HITL simulation is configured via the `platform_mappings.mock.hitl_config` section in the tenant configuration:

```json
{
  "platform_mappings": {
    "mock": {
      "hitl_config": {
        "mode": "async",
        "approval_rate": 90,
        "sync_delay_seconds": 3,
        "async_completion_seconds": 15,
        "per_operation_overrides": {
          "create_media_buy": {"mode": "sync"},
          "add_creative_assets": {"mode": "async", "approval_rate": 80}
        }
      }
    }
  }
}
```

## Interface Methods

The mock adapter implements the full `AdServerAdapter` interface.

### Required Methods

{: .table .table-bordered .table-striped }
| Method | Mock Behavior |
|--------|---------------|
| `create_media_buy` | Creates a simulated order with generated IDs. Respects HITL mode if configured. |
| `add_creative_assets` | Accepts assets and returns success statuses. Simulates format validation. |
| `associate_creatives` | Records associations in memory. Returns success for all pairs. |
| `check_media_buy_status` | Returns status based on campaign dates and the configured scenario. |
| `get_media_buy_delivery` | Generates simulated delivery data using the product simulation parameters. |
| `update_media_buy` | Processes pause, resume, cancel, and budget adjustment actions. |
| `update_media_buy_performance_index` | Accepts performance index values and adjusts simulated pacing. |

### Optional Methods

{: .table .table-bordered .table-striped }
| Method | Mock Behavior |
|--------|---------------|
| `get_supported_pricing_models` | Returns all seven pricing models. |
| `get_targeting_capabilities` | Returns all targeting dimensions as supported. |
| `validate_product_config` | Validates simulation parameters (e.g., `fill_rate` between 0 and 100). |

## Setup

Set up a tenant with the mock adapter using the setup script:

```bash
docker-compose exec adcp-server python -m scripts.setup.setup_tenant "Test Publisher" --adapter mock
```

This creates a tenant with:

- The mock adapter configured as the ad server integration
- A default set of products across all supported channels
- A test principal with an API token printed to the console

{: .alert.alert-info :}
The mock adapter requires no external credentials or API keys. It works immediately after tenant setup.

## Testing Examples

### MCP Client

Use the `uvx` CLI to interact with the mock adapter through MCP:

```bash
# Discover available products
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products '{"brief":"all"}'

# Create a media buy
uvx adcp http://localhost:8000/mcp/ --auth test-token create_media_buy '{
  "product_id": "prod_display_001",
  "advertiser_id": "adv_test",
  "budget_cents": 50000,
  "start_date": "2025-04-01",
  "end_date": "2025-04-30",
  "name": "Mock Test Campaign"
}'

# Check delivery
uvx adcp http://localhost:8000/mcp/ --auth test-token get_media_buy_delivery '{
  "media_buy_id": "mb_mock_001"
}'
```

### A2A Protocol

Send tasks via the Agent-to-Agent protocol:

```bash
curl -X POST http://localhost:8000/a2a \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tasks/send",
    "id": "1",
    "params": {
      "id": "task-001",
      "message": {
        "role": "user",
        "parts": [{"type": "text", "text": "Create a $500 display campaign for April 2025"}]
      }
    }
  }'
```

### Delivery Simulation Demo

The repository includes an end-to-end delivery simulation script:

```bash
docker-compose exec adcp-server python -m examples.delivery_simulation_demo
```

This script creates a media buy, advances simulated time, and prints delivery reports at each stage of the campaign lifecycle.

## Further Reading

- [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) -- Implement your own ad server adapter
- [Testing Guide](/agents/salesagent/developers/testing.html) -- Automated testing strategies using the mock adapter
- [Campaign Lifecycle Tutorial](/agents/salesagent/getting-started/campaign-lifecycle.html) -- Step-by-step walkthrough of a campaign from creation to reporting
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) -- Production GAM adapter for comparison
