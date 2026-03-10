---
layout: page_v2
title: Prebid Sales Agent - Signal Tools
description: Tools for discovering and activating audience signals for campaign targeting.
sidebarType: 10
---

# Prebid Sales Agent - Signal Tools
{: .no_toc}

- TOC
{:toc}

## Overview

Signal tools allow agents to discover and activate audience signals from configured signals agents. Signals represent audience segments and targeting data that can be applied to campaigns to improve targeting precision. These tools interact with external signals agents registered per-tenant.

There are two signal tools:

- **get_signals** -- Discovers available audience signals and segments.
- **activate_signal** -- Activates a signal for use in a specific campaign or media buy.

## get_signals

### Description

Discovers available audience signals and segments from configured signals agents. Agents can use these signals to identify high-value audiences and improve campaign targeting. The tool queries all enabled signals agents for the tenant and returns matching signals based on the provided filters.

**Function signature:**

```python
get_signals(req: GetSignalsRequest, context: Context | ToolContext | None = None) -> ToolResult
```

**Implementation:**

```python
_get_signals_impl(req: GetSignalsRequest, identity: ResolvedIdentity | None = None) -> GetSignalsResponse
```

**Authentication:** Optional (discovery tool)

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `signal_spec` | dict | No | Signal specification filter for narrowing results. |
| `filters` | dict | No | Filter criteria object (see sub-fields below). |
| `filters.catalog_types` | list[str] | No | Filter by catalog type. |
| `filters.data_providers` | list[str] | No | Filter by data provider name. |
| `filters.max_cpm` | float | No | Maximum CPM for signal pricing. |
| `filters.min_coverage_percentage` | float | No | Minimum audience coverage percentage (0-100). |
| `max_results` | int | No | Maximum number of signals to return. |
{: .table .table-bordered .table-striped }

### Response

The response is a `GetSignalsResponse` containing:

| Field | Type | Description |
| --- | --- | --- |
| `signals` | list[Signal] | Available signals matching the query. See [Signal Object Reference](#signal-object-reference). |
| `errors` | list[Error] | Any errors encountered during signal discovery (optional). |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{
  "filters": {
    "catalog_types": ["audience"],
    "data_providers": ["LiveRamp"],
    "max_cpm": 5.00,
    "min_coverage_percentage": 10.0
  },
  "max_results": 25
}
```

**Response:**

```json
{
  "signals": [
    {
      "signal_agent_segment_id": "lr-auto-intenders-2024",
      "name": "Auto Intenders - Luxury",
      "description": "Users actively researching luxury vehicle purchases in the past 30 days.",
      "signal_type": "marketplace",
      "data_provider": "LiveRamp",
      "coverage_percentage": 14.2,
      "deployments": [
        {
          "platform": "GAM",
          "is_live": true,
          "type": "audience_segment"
        }
      ],
      "pricing": {
        "cpm": 3.50,
        "currency": "USD"
      }
    }
  ],
  "errors": []
}
```

## activate_signal

### Description

Activates a signal segment for use in a campaign. This links audience data from a signals agent to a media buy, enabling the signal's targeting data to be applied to ad delivery. At least one of `campaign_id` or `media_buy_id` should be provided to specify where the signal is activated.

**Function signature:**

```python
activate_signal(signal_agent_segment_id: str, campaign_id: str = None, media_buy_id: str = None, context: dict | None = None, ctx: Context | ToolContext | None = None) -> ActivateSignalResponse
```

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `signal_agent_segment_id` | str | Yes | The signal segment ID returned by `get_signals`. |
| `campaign_id` | str | No | Campaign to activate the signal for. |
| `media_buy_id` | str | No | Media buy to activate the signal for. |
| `context` | dict | No | Additional context for activation (e.g., targeting preferences). |
{: .table .table-bordered .table-striped }

### Response

The `ActivateSignalResponse` confirms signal activation with deployment details, including the platform where the signal was deployed and its active status.

### Example

**Request:**

```json
{
  "signal_agent_segment_id": "lr-auto-intenders-2024",
  "media_buy_id": "mb-00f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b",
  "context": {
    "priority": "high"
  }
}
```

**Response:**

```json
{
  "signal_agent_segment_id": "lr-auto-intenders-2024",
  "status": "activated",
  "media_buy_id": "mb-00f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b",
  "deployment": {
    "platform": "GAM",
    "is_live": true,
    "type": "audience_segment"
  }
}
```

## Signal Object Reference

Each signal returned by `get_signals` contains the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `signal_agent_segment_id` | str | Unique identifier for the signal segment. |
| `name` | str | Human-readable signal name. |
| `description` | str | Description of what the signal targets. |
| `signal_type` | str | Type of signal: `"marketplace"` (third-party) or `"owned"` (first-party). |
| `data_provider` | str | Name of the data provider. |
| `coverage_percentage` | float | Estimated audience coverage as a percentage (0-100). |
| `deployments` | list[SignalDeployment] | Where the signal is deployed (see below). |
| `pricing` | SignalPricing | Cost to use the signal (see below). |
{: .table .table-bordered .table-striped }

### SignalDeployment

| Field | Type | Description |
| --- | --- | --- |
| `platform` | str | Platform name (e.g., "GAM", "Kevel"). |
| `is_live` | bool | Whether the signal is currently active on this platform. |
| `type` | str | Deployment type (e.g., "audience_segment"). |
{: .table .table-bordered .table-striped }

### SignalPricing

| Field | Type | Description |
| --- | --- | --- |
| `cpm` | float | Cost per thousand impressions. |
| `currency` | str | ISO 4217 currency code (e.g., "USD"). |
{: .table .table-bordered .table-striped }

## Integration with Dynamic Products

Signals integrate with the dynamic products feature. Products with `is_dynamic: true` and configured `signals_agent_ids` automatically query signals agents to generate targeted product variants. When a buyer submits a brief via `get_products`, the system queries the relevant signals agents and returns dynamically generated product variants tailored to the brief's targeting needs.

See [API Schemas](/agents/salesagent/schemas/api-schemas.html) for dynamic product fields including `is_dynamic`, `signals_agent_ids`, and the variant response structure.

## Signals Agent Configuration

Signals agents are external services registered per-tenant via the Admin UI. Each signals agent provides:

| Field | Description |
| --- | --- |
| `agent_name` | Identifier for the agent. |
| `endpoint` | URL for the signals agent API. |
| `enabled` | Whether the agent is active for the tenant. |
{: .table .table-bordered .table-striped }

Configure signals agents in the Admin UI under the **Signals Agents** section. Only enabled agents are queried when `get_signals` is called.

<div class="alert alert-info" role="alert">
Signals agents must implement the standard signals agent protocol. Contact the agent provider for integration documentation and endpoint details.
</div>

## Related Tools

- [Discovery Tools](discovery-tools.html) -- `get_adcp_capabilities`, `get_products`, `list_creative_formats`, `list_authorized_properties`
- [Media Buy Tools](media-buy-tools.html) -- `create_media_buy`, `update_media_buy`, `get_media_buys`, `get_media_buy_delivery`
- [Tool Reference](tool-reference.html) -- Complete tool summary and authentication guide
