---
layout: page_v2
title: Prebid Sales Agent - Tools - update_media_buy
description: Modify, pause, resume, or cancel an existing media buy
sidebarType: 10
---

# update_media_buy
{: .no_toc}

Modifies an existing media buy by changing its status (pause, resume, cancel) or updating package-level details.

- TOC
{:toc}

## Description

The `update_media_buy` tool allows buying agents to manage the lifecycle of an active media buy. It supports status transitions (pause, resume, cancel) as well as package-level modifications such as budget adjustments and flight date changes.

This is an **asynchronous** tool. Depending on the nature of the update and the publisher's configuration, changes may require human-in-the-loop approval before taking effect.

Authentication is **required**. The buyer must own or have access to the media buy being modified.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `media_buy_id` | `str` | Yes | Unique identifier of the media buy to update. | -- |
| `action` | `str` | Yes | The action to perform on the media buy. One of: `pause`, `resume`, `cancel`, `update`. | -- |
| `buyer_ref` | `str` | No | Buyer-side reference ID for reconciliation. | `None` |
| `packages` | `list[UpdatePackage]` | No | Package-level modifications. Required when `action` is `update`. | `None` |

### Action Values

{: .table .table-bordered .table-striped }
| Action | Description | Valid From States |
|--------|-------------|-------------------|
| `pause` | Temporarily halt delivery on all packages | `active` |
| `resume` | Resume delivery on a paused media buy | `paused` |
| `cancel` | Permanently cancel the media buy | `active`, `paused`, `pending_approval` |
| `update` | Modify package details (budget, dates, targeting) | `active`, `paused`, `draft` |

### UpdatePackage

When `action` is `update`, the `packages` list specifies which packages to modify:

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `package_id` | `str` | Yes | Identifier of the package to update |
| `budget` | `float` | No | Updated budget amount |
| `quantity` | `int` | No | Updated target impression count |
| `start_date` | `date` | No | Updated start date |
| `end_date` | `date` | No | Updated end date |
| `targeting` | `TargetingSpec` | No | Updated targeting overrides |
| `status` | `str` | No | Package-level status change |

## Response

Returns one of two result types:

### UpdateMediaBuyRequest (Success)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_id` | `str` | The updated media buy identifier |
| `status` | `str` | New status after the update |
| `action` | `str` | The action that was performed |
| `packages` | `list[PackageResult]` | Updated package states |
| `updated_at` | `datetime` | Timestamp of the update |

### UpdateMediaBuyError

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `error_code` | `str` | Machine-readable error code |
| `message` | `str` | Human-readable error description |
| `details` | `dict` | Additional error context |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `unauthorized` | Missing or invalid authentication token |
| `forbidden` | Token lacks permission to modify this media buy |
| `not_found` | Media buy with the given ID does not exist |
| `invalid_state_transition` | The requested action is not valid for the current media buy status |
| `validation_error` | Invalid parameters (e.g., missing packages for `update` action) |
| `conflict` | Concurrent modification conflict |
| `internal_error` | Unexpected server error |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Pause a running campaign
    result = await session.call_tool(
        "update_media_buy",
        arguments={
            "media_buy_id": "mb_xyz789",
            "action": "pause",
        },
    )
    print(f"Status: {result.content['status']}")

    # Resume a paused campaign
    result = await session.call_tool(
        "update_media_buy",
        arguments={
            "media_buy_id": "mb_xyz789",
            "action": "resume",
        },
    )

    # Update package budgets
    result = await session.call_tool(
        "update_media_buy",
        arguments={
            "media_buy_id": "mb_xyz789",
            "action": "update",
            "buyer_ref": "luxe-q1-2026-001",
            "packages": [
                {
                    "package_id": "pkg_001",
                    "budget": 75000.00,
                    "end_date": "2026-04-15",
                }
            ],
        },
    )

    # Cancel a campaign
    result = await session.call_tool(
        "update_media_buy",
        arguments={
            "media_buy_id": "mb_xyz789",
            "action": "cancel",
        },
    )
```

Example success response:

```json
{
  "media_buy_id": "mb_xyz789",
  "status": "paused",
  "action": "pause",
  "packages": [
    {
      "package_id": "pkg_001",
      "status": "paused",
      "budget": 50000.00
    }
  ],
  "updated_at": "2026-02-25T14:00:00Z"
}
```

## Related Tools

- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create a media buy before updating it
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Check delivery before making changes
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `update_media_buy` tool implements the AdCP `update_media_buy` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including valid state transitions and the update approval flow.
