---
layout: page_v2
title: list_creative_formats
description: Returns creative format specifications from registered creative agents
sidebarType: 10
---

# list_creative_formats
{: .no_toc}

- TOC
{:toc}

## Overview

Returns creative format specifications from all registered creative agents for the tenant. Each format describes the dimensions, type, and requirements for creative assets that can be submitted via [sync_creatives](/agents/salesagent/tools/sync-creatives.html).

**Category:** Discovery
**Authentication:** Optional
**REST equivalent:** `GET /api/v1/creative-formats`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `req` | `ListCreativeFormatsRequest` or `None` | No | `None` | Optional filtering. When `None`, all formats are returned. |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `creative_formats` | `list[CreativeFormat]` | Available creative format specifications. |

### CreativeFormat Fields

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Format identifier (referenced by `FormatId.id` in products). |
| `name` | `str` | Human-readable format name. |
| `type` | `str` | Format category (e.g., `display`, `video`, `native`). |
| `dimensions` | `dict` or `None` | Size specs (e.g., `{"width": 300, "height": 250}`). |
| `requirements` | `dict` or `None` | Asset requirements: file types, max file size, duration, aspect ratio. |

## Example

**Response:**

```json
{
  "creative_formats": [
    {
      "id": "display_300x250",
      "name": "Medium Rectangle",
      "type": "display",
      "dimensions": {"width": 300, "height": 250},
      "requirements": {"file_types": ["jpg", "png", "gif", "html5"], "max_file_size_kb": 150}
    },
    {
      "id": "video_30s",
      "name": "Standard Video 30s",
      "type": "video",
      "dimensions": {"width": 1920, "height": 1080},
      "requirements": {"file_types": ["mp4", "webm"], "max_duration_seconds": 30, "min_bitrate_kbps": 2000}
    }
  ]
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Upload creatives matching these formats
- [get_products](/agents/salesagent/tools/get-products.html) -- Products reference format IDs
