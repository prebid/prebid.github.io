---
layout: page_v2
title: list_creatives
description: List creatives by status, format, or media buy assignment
sidebarType: 10
---

# list_creatives
{: .no_toc}

- TOC
{:toc}

## Overview

Lists creatives visible to the authenticated principal, with optional filters by media buy, status, and format.

**Category:** Creative
**Authentication:** Required
**REST equivalent:** `GET /api/v1/media-buys/{id}/creatives`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `media_buy_id` | `str` or `None` | No | `None` | Return only creatives assigned to this media buy. |
| `media_buy_ids` | `list[str]` or `None` | No | `None` | Return creatives assigned to any of these media buys. |
| `buyer_ref` | `str` or `None` | No | `None` | Filter by buyer reference. |
| `status` | `str` or `None` | No | `None` | Filter by status: `processing`, `pending_review`, `approved`, `rejected`. |
| `format` | `str` or `None` | No | `None` | Filter by format ID. |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `creatives` | `list[Creative]` | Matching creative objects. |

### Creative Fields

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `creative_id` | `str` | The creative identifier. |
| `format_id` | `FormatId` | Format reference (`agent_url`, `id`). |
| `name` | `str` | Creative name. |
| `status` | `str` | `processing`, `pending_review`, `approved`, or `rejected`. |
| `assets` | `dict` | Asset payload. |
| `created_date` | `str` (ISO 8601) | When the creative was created. |
| `updated_date` | `str` (ISO 8601) | When the creative was last modified. |
| `provenance` | `Provenance` or `None` | Content provenance metadata. |

## Example

**Request:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "status": "approved"
}
```

**Response:**

```json
{
  "creatives": [
    {
      "creative_id": "cr_video_001",
      "format_id": {"agent_url": "https://creative.example.com", "id": "video_30s"},
      "name": "Acme Sports CTV 30s",
      "status": "approved",
      "assets": {
        "vast_url": "https://cdn.example.com/vast/acme_sports_30s.xml",
        "duration_seconds": 30,
        "resolution": "1920x1080"
      },
      "created_date": "2025-03-15T10:00:00Z",
      "updated_date": "2025-03-15T14:30:00Z",
      "provenance": {
        "digital_source_type": "human_edits",
        "ai_tool": "RunwayML Gen-3",
        "human_oversight": "Creative director reviewed and approved final cut",
        "disclosure": "This advertisement contains AI-generated visual effects."
      }
    }
  ]
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Upload and manage creatives
- [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) -- Format specifications
