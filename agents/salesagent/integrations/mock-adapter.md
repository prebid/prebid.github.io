---
layout: page_v2
title: Prebid Sales Agent - Mock Adapter
description: Use the mock adapter for testing, development, and demos without a real ad server
sidebarType: 10
---

# Prebid Sales Agent - Mock Adapter
{: .no_toc}

- TOC
{:toc}

## Overview

The Mock Adapter is a fully functional in-memory ad server adapter included with the Prebid Sales Agent for testing, development, and demonstration purposes. It implements the complete `AdServerAdapter` interface without requiring any external ad server, making it the fastest way to explore and validate Sales Agent functionality.

The adapter is identified by `adapter_name: "mock"` and is implemented at `src/adapters/mock_ad_server.py`.

## When to Use

The Mock Adapter is appropriate for:

- **Development** — Build and test AI buying agent integrations without a live ad server
- **Testing** — Run unit tests, integration tests, and end-to-end tests in CI/CD pipelines
- **Demos** — Demonstrate Sales Agent capabilities to stakeholders without configuring a real ad server
- **Evaluation** — Evaluate the Sales Agent before committing to a production ad server integration
- **Training** — Familiarize teams with the Sales Agent's tool interface and media buy workflow

<div class="alert alert-info" role="alert">
  The Mock Adapter is the default adapter when you first start the Sales Agent with <code>docker compose up</code>. No additional configuration is needed to get started.
</div>

## Configuration

### Connection Configuration

The `MockConnectionConfig` accepts a single setting:

{: .table .table-bordered .table-striped }
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `dry_run` | boolean | `false` | When `true`, all operations are validated but no state is persisted |

### Product Configuration

The `MockProductConfig` controls how the mock adapter simulates delivery for products:

{: .table .table-bordered .table-striped }
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `daily_impressions` | integer | Varies | Simulated daily impression volume |
| `fill_rate` | float | Varies | Simulated fill rate (0.0 to 1.0) |
| `ctr` | float | Varies | Simulated click-through rate |
| `viewability` | float | Varies | Simulated viewability percentage |
| `scenario` | string | `null` | Named simulation scenario (e.g., `"high_performance"`, `"slow_start"`) |

### Admin UI Setup

1. Navigate to **Settings > Ad Server** in the Admin UI.
2. Select **Mock** from the adapter type dropdown.
3. Optionally configure `dry_run` in the JSONB config field:

```json
{
  "dry_run": false
}
```

## Supported Channels

The Mock Adapter supports all major channels for comprehensive testing:

{: .table .table-bordered .table-striped }
| Channel | Description |
|---------|-------------|
| `display` | Standard banner and display ads |
| `olv` | Online video advertising |
| `streaming_audio` | Audio and streaming audio ads |
| `social` | Social media advertising |

## Test Headers

The Mock Adapter responds to special HTTP headers that control simulation behavior. Pass these headers in your API, MCP, or A2A requests to exercise specific scenarios.

{: .table .table-bordered .table-striped }
| Header | Value | Description |
|--------|-------|-------------|
| `X-Dry-Run` | `true` / `false` | Test operations without persisting side effects. The adapter validates inputs and returns realistic responses but does not create or modify any state. |
| `X-Mock-Time` | ISO 8601 datetime (e.g., `2025-01-15T14:30:00Z`) | Set the simulated current time. Useful for testing delivery progression, flight dates, and time-dependent logic without waiting for real time to pass. |
| `X-Jump-To-Event` | Event name (e.g., `"mid_flight"`, `"end_of_campaign"`) | Skip the simulation forward to a specific campaign event. The adapter advances delivery metrics to match the requested event state. |
| `X-Test-Session-ID` | Unique string | Isolate test execution by scoping all mock state to the given session ID. Different session IDs see independent state, enabling parallel test execution. |
| `X-Auto-Advance` | `true` / `false` | Automatically progress campaign events over successive requests. Each call to `get_media_buy_delivery` advances the simulation by one time step. |
| `X-Force-Error` | Error type (e.g., `"timeout"`, `"auth_failure"`, `"rate_limit"`) | Force the adapter to simulate a specific error condition. Useful for testing error handling and recovery logic in AI buying agents. |

### Example: Simulating a Campaign Lifecycle

```bash
# Create a media buy
uvx adcp http://localhost:8000/mcp/ --auth test-token create_media_buy \
  --product-id prod-001 --budget 10000

# Jump to mid-flight and check delivery
uvx adcp http://localhost:8000/mcp/ --auth test-token get_media_buy_delivery \
  --media-buy-id mb-001 \
  --header "X-Jump-To-Event: mid_flight"

# Force a timeout error to test error handling
uvx adcp http://localhost:8000/mcp/ --auth test-token get_media_buy_delivery \
  --media-buy-id mb-001 \
  --header "X-Force-Error: timeout"
```

## Delivery Simulation

The Mock Adapter includes a delivery simulator that produces realistic mock delivery data over time. Rather than returning static values, delivery metrics progress naturally based on the product configuration and campaign parameters.

### How Simulation Works

1. When a media buy is created, the simulator initializes delivery state based on the `MockProductConfig` (daily impressions, fill rate, CTR, viewability).
2. As time progresses (real or simulated via `X-Mock-Time`), the simulator calculates accumulated impressions, clicks, and spend.
3. Delivery metrics reflect realistic pacing — campaigns ramp up, hit steady state, and wind down.
4. The `_simulate_time_progression()` method advances the internal clock and updates metrics accordingly.

### Simulation Modes

The adapter provides two methods for controlling simulation state:

- **`_is_simulation()`** — Returns `true` when the adapter is running in simulation mode (the default). In simulation mode, delivery data is generated algorithmically.
- **`set_simulation_time()`** — Programmatically set the simulation clock, equivalent to passing the `X-Mock-Time` header.

## Strategy System

The Mock Adapter supports a strategy system that applies multipliers to simulated delivery metrics, enabling testing of different performance scenarios.

### Simulation Scenarios

Set the `scenario` field in `MockProductConfig` or use the `_get_simulation_scenario()` method to activate predefined scenarios:

- **High performance** — Above-average CTR, viewability, and fill rate
- **Slow start** — Campaign ramps up gradually before reaching target delivery
- **Underdelivery** — Campaign falls behind pacing goals
- **Overdelivery** — Campaign exceeds expected delivery

### Strategy Multipliers

The `_apply_strategy_multipliers()` method adjusts base delivery metrics according to the active strategy context. This allows testing how AI buying agents respond to different campaign performance patterns.

## Using with the uvx adcp CLI

The `uvx adcp` CLI tool is the fastest way to interact with the Mock Adapter during development:

```bash
# Discover available tools
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools

# Browse products
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products

# Create a media buy
uvx adcp http://localhost:8000/mcp/ --auth test-token create_media_buy \
  --product-id prod-001 --budget 5000 --start-date 2025-02-01 --end-date 2025-02-28

# Check delivery with auto-advance
uvx adcp http://localhost:8000/mcp/ --auth test-token get_media_buy_delivery \
  --media-buy-id mb-001 \
  --header "X-Auto-Advance: true"
```

## Using in Automated Tests

The Mock Adapter is designed for use in automated test suites. The Sales Agent's test infrastructure uses it extensively.

### Test Isolation with Session IDs

Use the `X-Test-Session-ID` header to isolate test state between parallel test executions:

```python
import httpx

async def test_media_buy_creation():
    headers = {
        "x-adcp-auth": "test-token",
        "X-Test-Session-ID": "test-run-abc123"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/media-buys",
            json={"product_id": "prod-001", "budget": 5000},
            headers=headers
        )
        assert response.status_code == 201
```

### Forcing Errors in Tests

Use `X-Force-Error` to test error handling paths:

```python
async def test_timeout_recovery():
    headers = {
        "x-adcp-auth": "test-token",
        "X-Force-Error": "timeout"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/api/v1/media-buys/mb-001/delivery",
            headers=headers
        )
        assert response.status_code == 504
```

### Dry Run Mode

Enable dry run mode to validate request payloads without creating any state:

```python
async def test_media_buy_validation():
    headers = {
        "x-adcp-auth": "test-token",
        "X-Dry-Run": "true"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/media-buys",
            json={"product_id": "prod-001", "budget": -100},
            headers=headers
        )
        # Validation error returned without creating anything
        assert response.status_code == 422
```

## Transitioning to Production

When you are ready to move from the Mock Adapter to a production ad server, the transition is straightforward:

1. **Choose a production adapter** — Select from [Google Ad Manager](/agents/salesagent/integrations/gam.html), [Kevel](/agents/salesagent/integrations/kevel.html), [Triton Digital](/agents/salesagent/integrations/triton-digital.html), [Broadstreet](/agents/salesagent/integrations/broadstreet.html), or a [custom adapter](/agents/salesagent/integrations/custom-adapter.html).
2. **Configure credentials** — Set up the required environment variables and authentication for your chosen adapter.
3. **Update the Admin UI** — Navigate to **Settings > Ad Server** and change the adapter type from **Mock** to your production adapter. Enter the adapter-specific configuration.
4. **Reconfigure products** — Review and update product configurations to reference real inventory in your ad server.
5. **Test with dry run** — Many production adapters support a dry run or sandbox mode. Use this to validate the integration before going live.
6. **Switch over** — Once validated, disable dry run mode. New media buys will be created in your production ad server.

<div class="alert alert-info" role="alert">
  Changing the adapter type does not affect existing media buys. Media buys created with the Mock Adapter remain in the database but will not be synced to the new production ad server. Create new media buys after switching adapters.
</div>

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Get running with Docker and the Mock Adapter
- [Architecture & Protocols](/agents/salesagent/architecture.html) — Adapter pattern overview
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) — Production GAM integration
- [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) — Create your own adapter
