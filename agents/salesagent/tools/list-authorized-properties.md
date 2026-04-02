---
layout: page_v2
title: list_authorized_properties
description: Returns publisher domains, policies, and portfolio description
sidebarType: 10
---

# list_authorized_properties
{: .no_toc}

- TOC
{:toc}

## Overview

Returns the list of publisher domains, advertising policies, and portfolio description visible to the caller. Agents use this to understand which properties (sites/apps) they can target before building a media buy.

**Category:** Discovery
**Authentication:** Optional
**REST equivalent:** `GET /api/v1/properties`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `req` | `ListAuthorizedPropertiesRequest` or `None` | No | `None` | Optional filtering. When `None`, all authorized properties are returned. |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `publisher_domains` | `list[str]` | Domains where the caller can serve ads. |
| `advertising_policies` | `str` or `None` | Publisher's advertising policies. |
| `portfolio_description` | `str` or `None` | Natural-language portfolio description. |
| `context` | `dict` or `None` | Additional metadata. |

## Example

**Response:**

```json
{
  "publisher_domains": ["example.com", "sports.example.com", "news.example.com"],
  "advertising_policies": "No tobacco, gambling, or political advertising. All creatives must comply with IAB content taxonomy v3.",
  "portfolio_description": "Premium sports and entertainment content across web, mobile, and CTV.",
  "context": null
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) -- Publisher capabilities and targeting
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create campaigns on these properties
