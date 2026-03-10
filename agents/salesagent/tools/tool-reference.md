---
layout: page_v2
title: Prebid Sales Agent - Tool Reference
description: Complete reference for all Prebid Sales Agent tools, authentication, and error handling.
sidebarType: 10
---

# Prebid Sales Agent - Tool Reference
{: .no_toc}

- TOC
{:toc}

## Overview

The Prebid Sales Agent exposes its functionality through a set of tools registered via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). Each tool is registered using the FastMCP `@mcp.tool()` decorator in the core application entry point, and follows a three-layer invocation pattern:

1. **MCP wrapper** -- Extracts the caller's identity from the FastMCP `Context` object and delegates downward.
2. **`_raw` function** -- A protocol-independent entry point that can be called from A2A (Agent-to-Agent) or REST interfaces as well as MCP.
3. **`_impl` function** -- Contains the actual business logic and receives a fully resolved `ResolvedIdentity` (tenant + principal).

This layered design allows every tool to be invoked identically regardless of the transport protocol used by the calling agent.

## Tool Summary

The table below lists every tool exposed by the Sales Agent, grouped by category.

| Tool | Category | Auth Required | Description |
| --- | --- | --- | --- |
| [get_adcp_capabilities](discovery-tools.html#get_adcp_capabilities) | Discovery | No | Returns the publisher's AdCP capabilities, supported protocols, portfolio description, and targeting options. |
| [get_products](discovery-tools.html#get_products) | Discovery | No | Searches the product catalog with optional natural-language ranking. |
| [list_creative_formats](discovery-tools.html#list_creative_formats) | Discovery | No | Returns creative format specifications from registered creative agents. |
| [list_authorized_properties](discovery-tools.html#list_authorized_properties) | Discovery | No | Returns publisher domains, advertising policies, and portfolio description visible to the caller. |
| [create_media_buy](media-buy-tools.html#create_media_buy) | Media Buy | Yes | Creates a new media buy with one or more packages. |
| [update_media_buy](media-buy-tools.html#update_media_buy) | Media Buy | Yes | Modifies an existing media buy (pause, budget, flights, packages). |
| [get_media_buys](media-buy-tools.html#get_media_buys) | Media Buy | Yes | Retrieves media buys by ID, buyer reference, status, or date range. |
| [get_media_buy_delivery](media-buy-tools.html#get_media_buy_delivery) | Media Buy | Yes | Returns delivery and performance metrics for one or more media buys. |
| [sync_creatives](creative-tools.html#sync_creatives) | Creative | Yes | Uploads, updates, or deletes creatives with format validation and provenance metadata. |
| [list_creatives](creative-tools.html#list_creatives) | Creative | Yes | Lists creatives filtered by media buy, status, or format. |
| [list_tasks](workflow-tools.html#list_tasks) | Workflow | Yes | Lists pending and completed workflow tasks (approvals, reviews). |
| [get_task](workflow-tools.html#get_task) | Workflow | Yes | Returns full details for a single workflow task. |
| [complete_task](workflow-tools.html#complete_task) | Workflow | Yes | Completes a workflow task with a status of "completed" or "failed". |
| [update_performance_index](performance-tools.html#update_performance_index) | Performance | Yes | Submits AI performance feedback for a media buy. |
| [get_signals](signals-tools.html#get_signals) | Signal | Optional | Discover available audience signals and segments from configured signals agents. |
| [activate_signal](signals-tools.html#activate_signal) | Signal | Yes | Activate a signal segment for use in campaign targeting. |
{: .table .table-bordered .table-striped }

## Authentication

### Header Format

All requests carry identity through one of two headers:

| Header | Format | Notes |
| --- | --- | --- |
| `x-adcp-auth` | Raw token string | Primary header used by AdCP protocol clients. |
| `Authorization` | `Bearer <token>` | Standard OAuth-style bearer token. |
{: .table .table-bordered .table-striped }

The token is hashed and matched against the `auth_token` column of the `Principal` table. Tokens have an optional expiry tracked by `auth_token_expires_at`.

### Auth-Optional vs Auth-Required

Discovery tools (`get_adcp_capabilities`, `get_products`, `list_creative_formats`, `list_authorized_properties`) and the signal discovery tool (`get_signals`) are **auth-optional**. When called without a valid token the tools still return data, but the response may be limited to publicly visible information. All other tools require a valid token and will raise `AdCPAuthenticationError` if one is missing or invalid.

## Error Handling

Every error returned by the Sales Agent extends the base `AdCPError` class and carries three standard fields:

| Field | Type | Description |
| --- | --- | --- |
| `message` | `str` | Human-readable description of the error. |
| `recovery` | `str` | One of `terminal`, `user`, or `transient`. Indicates whether the caller should retry, prompt the user, or give up. |
| `details` | `dict` or `None` | Optional structured metadata about the error. |
{: .table .table-bordered .table-striped }

### Error Types

| Error Class | Recovery | Typical Cause |
| --- | --- | --- |
| `AdCPAuthenticationError` | terminal | Missing or invalid `x-adcp-auth` / `Authorization` header. |
| `AdCPAuthorizationError` | terminal | The authenticated principal does not have permission for the requested operation. |
| `AdCPValidationError` | user | The request body fails Pydantic validation or contains invalid field values. |
| `AdCPNotFoundError` | terminal | The requested resource (media buy, creative, task, etc.) does not exist or is not visible to the caller. |
| `AdCPConflictError` | user | A business-logic conflict prevents the operation (e.g., duplicate buyer_ref, overlapping flights). |
| `AdCPAdapterError` | transient | The downstream ad server adapter returned an error. Safe to retry with back-off. |
| `AdCPBudgetExhaustedError` | terminal | The media buy or package budget limit has been reached. |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
Agents should inspect the <code>recovery</code> field to decide their next action. A <code>transient</code> recovery means an automatic retry is appropriate. A <code>user</code> recovery means the agent should ask the human buyer to correct the input. A <code>terminal</code> recovery means the operation cannot succeed as-is.
</div>

## AdCP Media Buy Protocol Lifecycle

The tools work together to implement the full AdCP media buy lifecycle:

```
Discovery                    Execution                    Reporting
─────────                    ─────────                    ─────────
get_adcp_capabilities   ──►  create_media_buy        ──►  get_media_buys
get_products            ──►  sync_creatives          ──►  get_media_buy_delivery
list_creative_formats   ──►  update_media_buy        ──►  list_creatives
list_authorized_properties   list_tasks / get_task        update_performance_index
get_signals             ──►  complete_task
                             activate_signal
```

A typical agent conversation follows this sequence:

1. **Discover** -- Call `get_adcp_capabilities` to learn what the publisher supports, then `get_products` to browse available inventory, `list_creative_formats` to understand creative specs, and `list_authorized_properties` to see the property list.
2. **Plan** -- The agent selects products and builds packages with budgets and targeting overlays.
3. **Create** -- Call `sync_creatives` to upload creative assets, then `create_media_buy` to book the campaign.
4. **Approve** -- If the tenant requires manual approval, call `list_tasks` and `complete_task` to move the buy through the approval workflow.
5. **Monitor** -- Call `get_media_buys` and `get_media_buy_delivery` for status and performance data.
6. **Optimise** -- Call `update_media_buy` to adjust budgets or flights, `update_performance_index` to feed back AI-derived performance signals, and `sync_creatives` to swap creative assets.

## Related Pages

- [Discovery Tools](discovery-tools.html) -- `get_adcp_capabilities`, `get_products`, `list_creative_formats`, `list_authorized_properties`
- [Media Buy Tools](media-buy-tools.html) -- `create_media_buy`, `update_media_buy`, `get_media_buys`, `get_media_buy_delivery`
- [Creative Tools](creative-tools.html) -- `sync_creatives`, `list_creatives`
- [Workflow Tools](workflow-tools.html) -- `list_tasks`, `get_task`, `complete_task`
- [Performance Tools](performance-tools.html) -- `update_performance_index`
- [Signal Tools](signals-tools.html) -- `get_signals`, `activate_signal`
- [API Schema Reference](../schemas/api-schemas.html) -- Pydantic request/response models
- [Database Models](../schemas/database-models.html) -- SQLAlchemy persistence layer
