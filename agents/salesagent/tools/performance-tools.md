---
layout: page_v2
title: Prebid Sales Agent - Performance Tools
description: Reference for the update_performance_index tool used for AI performance feedback.
sidebarType: 10
---

# Prebid Sales Agent - Performance Tools
{: .no_toc}

- TOC
{:toc}

## Overview

Performance tools allow agents to submit AI-derived performance signals back to the Sales Agent. These signals inform optimisation decisions such as pacing adjustments, creative rotation, and budget reallocation. Currently the category contains a single tool: `update_performance_index`.

This tool requires authentication.

See the [Tool Reference](tool-reference.html) for general information about authentication and error handling.

---

## update_performance_index

Submits AI performance feedback for a media buy. The performance data is stored and made available to the ad server adapter and any signals agents configured for the tenant.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `media_buy_id` | `str` | Yes | -- | The media buy to associate performance data with. |
| `performance_data` | `list[dict]` or `None` | No | `None` | List of performance signal objects. Structure is flexible and depends on the signals agent configuration. |
{: .table .table-bordered .table-striped }

### Performance Data Structure

Each entry in the `performance_data` list is a dict. While the schema is flexible to support different signals agents, common fields include:

| Field | Type | Description |
| --- | --- | --- |
| `signal_type` | `str` | Type of performance signal (e.g., `brand_lift`, `attention`, `sentiment`, `conversion_propensity`). |
| `value` | `float` | Numeric signal value. |
| `confidence` | `float` | Confidence score for the signal (0.0 - 1.0). |
| `timestamp` | `str` (ISO 8601) | When the signal was measured. |
| `dimensions` | `dict` or `None` | Breakdown dimensions (e.g., `{"creative_id": "cr_001", "geo": "US-NY"}`). |
| `metadata` | `dict` or `None` | Additional context about the signal. |
{: .table .table-bordered .table-striped }

### Response: UpdatePerformanceIndexResponse

| Field | Type | Description |
| --- | --- | --- |
| `media_buy_id` | `str` | Echo of the media buy ID. |
| `signals_accepted` | `int` | Number of performance signals successfully ingested. |
| `signals_rejected` | `int` | Number of signals rejected (e.g., invalid format, unknown signal type). |
| `errors` | `list[str]` | Details for any rejected signals. |
{: .table .table-bordered .table-striped }

### Error Responses

| Error | Cause |
| --- | --- |
| `AdCPNotFoundError` | Media buy ID does not exist or is not owned by the caller. |
| `AdCPAuthorizationError` | Principal is not authorised to submit performance data for this media buy. |
| `AdCPValidationError` | `performance_data` contains entries that fail validation. |
{: .table .table-bordered .table-striped }

### Use Cases

#### Brand Lift Feedback

An agent running brand-lift surveys can feed results back to the platform, allowing the ad server to optimise towards higher-performing creative and audience segments:

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
    }
  ]
}
```

#### Attention Metrics

An attention-measurement agent submits real-time attention scores:

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "performance_data": [
    {
      "signal_type": "attention",
      "value": 7.3,
      "confidence": 0.92,
      "timestamp": "2025-04-10T14:00:00Z",
      "dimensions": {"creative_id": "cr_video_001", "device_platform": "ctv"},
      "metadata": {"unit": "attention_seconds", "provider": "attention_vendor"}
    }
  ]
}
```

#### Conversion Propensity

A machine-learning agent predicts conversion likelihood for audience segments:

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "performance_data": [
    {
      "signal_type": "conversion_propensity",
      "value": 0.034,
      "confidence": 0.78,
      "timestamp": "2025-04-10T08:00:00Z",
      "dimensions": {"geo": "US-CA", "device_platform": "mobile"},
      "metadata": {"model_version": "v2.1", "training_date": "2025-03-01"}
    }
  ]
}
```

### Example

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
      "dimensions": {"creative_id": "cr_video_001"}
    },
    {
      "signal_type": "attention",
      "value": 7.3,
      "confidence": 0.92,
      "timestamp": "2025-04-10T14:00:00Z",
      "dimensions": {"creative_id": "cr_video_001"}
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

## Related Pages

- [Tool Reference](tool-reference.html) -- Overview of all tools, authentication, and error handling
- [Media Buy Tools](media-buy-tools.html) -- The media buys that performance data relates to
- [API Schema Reference](../schemas/api-schemas.html) -- Pydantic model definitions
- [Database Models](../schemas/database-models.html) -- SignalsAgent configuration
