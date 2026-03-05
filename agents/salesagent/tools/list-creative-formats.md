---
layout: page_v2
title: Prebid Sales Agent - Tools - list_creative_formats
description: Query available creative format specifications with flexible filtering
sidebarType: 10
---

# list_creative_formats
{: .no_toc}

Returns creative format specifications supported by the publisher, with filtering by type, dimensions, asset types, and more.

- TOC
{:toc}

## Description

The `list_creative_formats` tool provides detailed specifications for every creative format the publisher supports. Buying agents use this tool to understand size requirements, accepted asset types, and responsive behavior before uploading creatives or creating media buys.

All filter parameters are optional and combinable. When multiple filters are provided, results must match all criteria (AND logic). This is a synchronous tool with response times typically under 1 second.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `type` | `FormatCategory` | No | Filter by format category. One of: `audio`, `video`, `display`, `native`. | `None` |
| `format_ids` | `list[FormatId]` | No | Filter to specific format identifiers. | `None` |
| `is_responsive` | `bool` | No | Filter by responsive behavior. `true` returns only responsive formats; `false` returns only fixed-size formats. | `None` |
| `name_search` | `str` | No | Case-insensitive substring search on format names. | `None` |
| `asset_types` | `list[AssetContentType]` | No | Filter by accepted asset content types (e.g., `["image/png", "video/mp4"]`). | `None` |
| `min_width` | `int` | No | Minimum width in pixels. | `None` |
| `max_width` | `int` | No | Maximum width in pixels. | `None` |
| `min_height` | `int` | No | Minimum height in pixels. | `None` |
| `max_height` | `int` | No | Maximum height in pixels. | `None` |

### FormatCategory Values

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `audio` | Audio ad formats (e.g., podcast, streaming audio) |
| `video` | Video ad formats (e.g., pre-roll, mid-roll, outstream) |
| `display` | Display ad formats (e.g., banner, interstitial, billboard) |
| `native` | Native ad formats (e.g., in-feed, content recommendation) |

## Response

Returns a `ListCreativeFormatsResponse` object:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `formats` | `list[CreativeFormat]` | List of matching creative format specifications |
| `total` | `int` | Total number of matching formats |

Each `CreativeFormat` contains:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `format_id` | `str` | Unique format identifier |
| `name` | `str` | Human-readable format name |
| `type` | `FormatCategory` | Format category (audio, video, display, native) |
| `width` | `int` | Width in pixels (0 for responsive or audio) |
| `height` | `int` | Height in pixels (0 for responsive or audio) |
| `is_responsive` | `bool` | Whether the format adapts to container size |
| `accepted_asset_types` | `list[str]` | MIME types accepted for this format |
| `max_file_size_bytes` | `int` | Maximum file size in bytes |
| `max_duration_seconds` | `float` | Maximum duration for video/audio formats |
| `specs` | `dict` | Additional format-specific requirements |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `validation_error` | Invalid filter parameters (e.g., negative dimensions) |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # List all video formats
    result = await session.call_tool(
        "list_creative_formats",
        arguments={"type": "video"},
    )
    for fmt in result.content["formats"]:
        print(f"{fmt['name']}: {fmt['width']}x{fmt['height']}")

    # Find display formats in a specific size range
    result = await session.call_tool(
        "list_creative_formats",
        arguments={
            "type": "display",
            "min_width": 300,
            "max_width": 728,
            "min_height": 250,
            "max_height": 250,
        },
    )

    # Search by name
    result = await session.call_tool(
        "list_creative_formats",
        arguments={"name_search": "leaderboard"},
    )

    # Filter by accepted asset types
    result = await session.call_tool(
        "list_creative_formats",
        arguments={"asset_types": ["video/mp4", "video/webm"]},
    )
```

Example response:

```json
{
  "formats": [
    {
      "format_id": "video_16x9_preroll",
      "name": "Pre-Roll Video 16:9",
      "type": "video",
      "width": 1920,
      "height": 1080,
      "is_responsive": false,
      "accepted_asset_types": ["video/mp4", "video/webm"],
      "max_file_size_bytes": 52428800,
      "max_duration_seconds": 30.0,
      "specs": {
        "aspect_ratio": "16:9",
        "min_bitrate_kbps": 2000
      }
    },
    {
      "format_id": "display_300x250",
      "name": "Medium Rectangle",
      "type": "display",
      "width": 300,
      "height": 250,
      "is_responsive": false,
      "accepted_asset_types": ["image/png", "image/jpeg", "image/gif"],
      "max_file_size_bytes": 153600,
      "max_duration_seconds": null,
      "specs": {}
    }
  ],
  "total": 2
}
```

## Related Tools

- [get_products](/agents/salesagent/tools/get-products.html) -- Products reference format_ids from this tool
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Upload creatives that conform to these formats
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create campaigns using products tied to these formats
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `list_creative_formats` tool implements the AdCP creative format discovery flow. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the standard creative format schema and taxonomy.
