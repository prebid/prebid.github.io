---
layout: page_v2
title: Prebid Sales Agent - Tools - sync_creatives
description: Upload, validate, and manage creative assets with format compliance checking
sidebarType: 10
---

# sync_creatives
{: .no_toc}

Uploads, validates, and synchronizes creative assets with the publisher's ad server, supporting bulk operations, format validation, and dry-run previews.

- TOC
{:toc}

## Description

The `sync_creatives` tool manages the lifecycle of creative assets. It accepts a list of creative definitions, validates them against the publisher's format specifications, and synchronizes them with the ad server. The tool supports several operational modes:

- **Upload new creatives** -- Provide creative definitions to upload and register
- **Update existing creatives** -- Sync changes to previously uploaded creatives
- **Delete missing creatives** -- Optionally remove creatives from the server that are not in the current sync payload
- **Dry run** -- Validate creatives without making changes to the ad server
- **Assignment mapping** -- Associate creatives with specific packages in existing media buys

This is an **asynchronous** tool. Large creative uploads may take several seconds depending on asset sizes and ad server latency.

Authentication is **required**.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `creatives` | `list[CreativeAsset]` | Yes | List of creative assets to sync. See CreativeAsset below. | -- |
| `assignments` | `dict[str, list[str]]` | No | Map of package IDs or media buy IDs to creative ID lists. Defines which creatives serve on which packages. | `None` |
| `creative_ids` | `list[str]` | No | IDs of existing creatives to include in the sync scope. Useful for managing assignments without re-uploading. | `None` |
| `delete_missing` | `bool` | No | When `true`, creatives on the server that are not in the current `creatives` list will be removed. Use with caution. | `false` |
| `dry_run` | `bool` | No | When `true`, validates all creatives and returns what would change without making actual modifications. | `false` |
| `validation_mode` | `ValidationMode` | No | Controls validation strictness. See ValidationMode below. | `None` |

### CreativeAsset

Each creative in the `creatives` list:

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `format_id` | `str` | Yes | Creative format identifier from `list_creative_formats` |
| `name` | `str` | Yes | Human-readable creative name |
| `asset_url` | `str` | Yes | URL to the creative asset file |
| `click_through_url` | `str` | No | Landing page URL |
| `creative_id` | `str` | No | Existing creative ID (for updates). Omit for new uploads. |
| `metadata` | `dict` | No | Additional creative metadata (alt text, tracking pixels, etc.) |

### ValidationMode

Controls how strictly creative assets are validated:

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `strict` | All format requirements must be met. Rejects non-conforming creatives. |
| `lenient` | Warns about format mismatches but allows the sync to proceed. |
| `none` | Skips validation entirely (not recommended for production). |

## Response

Returns a `SyncCreativesResponse` object:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `results` | `list[CreativeSyncResult]` | Per-creative sync results |
| `summary` | `SyncSummary` | Aggregate counts of created, updated, deleted, and failed operations |

Each `CreativeSyncResult` contains:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `creative_id` | `str` | The creative's unique identifier (assigned on creation) |
| `name` | `str` | Creative name |
| `status` | `str` | Sync result: `created`, `updated`, `deleted`, `unchanged`, `failed` |
| `validation_errors` | `list[str]` | Any validation issues encountered |
| `warnings` | `list[str]` | Non-blocking warnings |

The `SyncSummary` contains:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `created` | `int` | Number of new creatives uploaded |
| `updated` | `int` | Number of existing creatives modified |
| `deleted` | `int` | Number of creatives removed |
| `unchanged` | `int` | Number of creatives with no changes |
| `failed` | `int` | Number of creatives that failed to sync |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `unauthorized` | Missing or invalid authentication token |
| `forbidden` | Token lacks creative management scope |
| `validation_error` | One or more creatives failed format validation (in strict mode) |
| `format_not_found` | Referenced format_id does not exist |
| `asset_unreachable` | Creative asset URL could not be fetched |
| `file_too_large` | Asset exceeds the format's maximum file size |
| `internal_error` | Unexpected server error |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Upload new creatives
    result = await session.call_tool(
        "sync_creatives",
        arguments={
            "creatives": [
                {
                    "format_id": "display_300x250",
                    "name": "Spring Banner 300x250",
                    "asset_url": "https://cdn.example.com/spring-300x250.png",
                    "click_through_url": "https://brand.example.com/spring",
                },
                {
                    "format_id": "video_16x9_preroll",
                    "name": "Spring Video 30s",
                    "asset_url": "https://cdn.example.com/spring-30s.mp4",
                    "click_through_url": "https://brand.example.com/spring",
                },
            ],
        },
    )
    summary = result.content["summary"]
    print(f"Created: {summary['created']}, Failed: {summary['failed']}")

    # Dry run to validate before uploading
    result = await session.call_tool(
        "sync_creatives",
        arguments={
            "creatives": [
                {
                    "format_id": "display_728x90",
                    "name": "Leaderboard Ad",
                    "asset_url": "https://cdn.example.com/leaderboard.png",
                }
            ],
            "dry_run": True,
            "validation_mode": "strict",
        },
    )

    # Sync with assignments and cleanup
    result = await session.call_tool(
        "sync_creatives",
        arguments={
            "creatives": [
                {
                    "format_id": "display_300x250",
                    "name": "Updated Spring Banner",
                    "asset_url": "https://cdn.example.com/spring-v2-300x250.png",
                    "creative_id": "cr_existing_001",
                }
            ],
            "assignments": {
                "pkg_001": ["cr_existing_001"],
            },
            "delete_missing": True,
        },
    )
```

Example response:

```json
{
  "results": [
    {
      "creative_id": "cr_new_001",
      "name": "Spring Banner 300x250",
      "status": "created",
      "validation_errors": [],
      "warnings": []
    },
    {
      "creative_id": "cr_new_002",
      "name": "Spring Video 30s",
      "status": "created",
      "validation_errors": [],
      "warnings": ["Asset bitrate (1500kbps) is below recommended minimum (2000kbps)"]
    }
  ],
  "summary": {
    "created": 2,
    "updated": 0,
    "deleted": 0,
    "unchanged": 0,
    "failed": 0
  }
}
```

## Related Tools

- [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) -- Check format requirements before syncing
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create campaigns with inline creatives
- [get_products](/agents/salesagent/tools/get-products.html) -- Discover products and their required formats
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `sync_creatives` tool implements the AdCP `sync_creatives` operation. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including creative manifest schemas and validation requirements.
