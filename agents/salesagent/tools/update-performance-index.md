---
layout: page_v2
title: update_performance_index
description: Submit AI performance feedback for media buy optimization
sidebarType: 10
---

# update_performance_index
{: .no_toc}

- TOC
{:toc}

## Overview

Submits AI performance feedback for a media buy. The performance data is stored and made available to the ad server adapter and any signals agents configured for the tenant. Signals inform optimization decisions like pacing adjustments, creative rotation, and budget reallocation.

**Category:** Performance
**Authentication:** Required

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `media_buy_id` | `str` | Yes | -- | The media buy to associate performance data with. |
| `performance_data` | `list[dict]` or `None` | No | `None` | List of performance signal objects. |

### Performance Data Structure

The schema is flexible to support different signals agents. Common fields:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `signal_type` | `str` | Type of signal (e.g., `brand_lift`, `attention`, `sentiment`, `conversion_propensity`). |
| `value` | `float` | Numeric signal value. |
| `confidence` | `float` | Confidence score (0.0 - 1.0). |
| `timestamp` | `str` (ISO 8601) | When the signal was measured. |
| `dimensions` | `dict` or `None` | Breakdown dimensions (e.g., `{"creative_id": "cr_001", "geo": "US-NY"}`). |
| `metadata` | `dict` or `None` | Additional context. |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_id` | `str` | Echo of the media buy ID. |
| `signals_accepted` | `int` | Signals successfully ingested. |
| `signals_rejected` | `int` | Signals rejected. |
| `errors` | `list[str]` | Details for rejected signals. |

## Errors

{: .table .table-bordered .table-striped }
| Error | Cause |
|-------|-------|
| `AdCPNotFoundError` (404) | Media buy does not exist or is not owned by the caller. |
| `AdCPAuthorizationError` (403) | Principal not authorized for this media buy. |
| `AdCPValidationError` (400) | Invalid performance_data entries. |

## Example

**Request:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "performance_data": [
    {
      "signal_type": "brand_lift",
      "value": 0.12,
      "confidence": 0.85,
      "timestamp": "2025-04-10T00:00:00Z",
      "dimensions": {"creative_id": "cr_video_001"},
      "metadata": {"survey_sample_size": 500, "metric": "ad_recall"}
    },
    {
      "signal_type": "attention",
      "value": 7.3,
      "confidence": 0.92,
      "timestamp": "2025-04-10T14:00:00Z",
      "dimensions": {"creative_id": "cr_video_001"},
      "metadata": {"unit": "attention_seconds"}
    }
  ]
}
```

**Response:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "signals_accepted": 2,
  "signals_rejected": 0,
  "errors": []
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Delivery metrics
- [get_media_buys](/agents/salesagent/tools/get-media-buys.html) -- Query campaigns
