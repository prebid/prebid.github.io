---
layout: page_v2
title: Prebid Sales Agent - Creative Tools
description: Reference for uploading, validating, and listing creatives with provenance metadata.
sidebarType: 10
---

# Prebid Sales Agent - Creative Tools
{: .no_toc}

- TOC
{:toc}

## Overview

Creative tools manage the lifecycle of ad creatives -- from upload and format validation through approval and serving. Both tools require authentication.

See the [Tool Reference](tool-reference.html) for general information about authentication and error handling.

## Creative Lifecycle

```
  sync_creatives              Tenant policy               Ad serving
  (upload/update)             (auto or manual)
  ─────────────               ──────────────              ──────────
       │                           │                          │
       ▼                           ▼                          ▼
  ┌──────────┐   validation   ┌──────────────┐  approved  ┌─────────┐
  │processing │──────────────►│pending_review │───────────►│approved │──► live
  └──────────┘                └──────────────┘            └─────────┘
       │                           │
       │  validation failure       │  review failure
       ▼                           ▼
  ┌──────────┐                ┌──────────┐
  │ rejected │                │ rejected │
  └──────────┘                └──────────┘
```

Creatives pass through the following statuses (the `CreativeStatus` enum):

| Status | Description |
| --- | --- |
| `processing` | Upload received, format validation and asset processing in progress. |
| `pending_review` | Validation passed, awaiting review (manual or automated). |
| `approved` | Creative cleared for serving. |
| `rejected` | Creative failed validation or was rejected during review. |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
Tenants can configure automatic approval thresholds. When <code>creative_auto_approve_threshold</code> (default 0.9) is met by the content-standards score, the creative is approved without human review. When the score falls below <code>creative_auto_reject_threshold</code> (default 0.1), it is automatically rejected.
</div>

---

## sync_creatives

Uploads new creatives, updates existing ones, or removes creatives no longer needed. Every creative is validated against the format specification returned by `list_creative_formats`. Supports dry-run mode for pre-flight validation.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `creatives` | `list[dict]` or `None` | No | `None` | Creatives to create or update. See Creative fields below. |
| `assignments` | `dict` or `None` | No | `None` | Map of media buy IDs to lists of creative IDs to assign. |
| `creative_ids` | `list[str]` or `None` | No | `None` | When used with `delete_missing`, the canonical set of creative IDs. Any creative not in this list is deleted. |
| `delete_missing` | `bool` | No | `False` | When `true`, delete creatives owned by the caller that are not in `creative_ids`. |
| `dry_run` | `bool` | No | `False` | When `true`, validate inputs but do not persist changes. |
| `validation_mode` | `str` | No | `"strict"` | Validation strictness: `"strict"` rejects on any format mismatch, `"lenient"` allows minor deviations. |
{: .table .table-bordered .table-striped }

#### Creative Fields

Each entry in the `creatives` list is a dict with these fields:

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `creative_id` | `str` | Yes | -- | Caller-supplied unique identifier for the creative. |
| `format_id` | `FormatId` | Yes | -- | Format specification reference. Object with `agent_url` (str) and `id` (str). |
| `name` | `str` | Yes | -- | Human-readable creative name. |
| `status` | `str` or `None` | No | `None` | Initial status override (typically left as `None` for automatic processing). |
| `assets` | `dict` | Yes | -- | Asset payload. Structure depends on the format (e.g., `{"url": "...", "width": 300, "height": 250}` for display, `{"vast_url": "..."}` for video). |
| `provenance` | `Provenance` or `None` | No | `None` | EU AI Act and content provenance metadata. See Provenance fields below. |
{: .table .table-bordered .table-striped }

#### Provenance Fields

The `Provenance` object tracks the origin and AI involvement in creative production, supporting EU AI Act compliance:

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `digital_source_type` | `str` | Yes | -- | How the creative was produced. One of the `DigitalSourceType` enum values (see below). |
| `ai_tool` | `str` or `None` | No | `None` | Name or identifier of the AI tool used in production (e.g., `"DALL-E 3"`, `"Midjourney v6"`). |
| `human_oversight` | `str` or `None` | No | `None` | Description of human oversight applied during creative production. |
| `declared_by` | `str` or `None` | No | `None` | Entity declaring the provenance information. |
| `created_time` | `str` (ISO 8601) or `None` | No | `None` | When the creative was originally produced. |
| `c2pa` | `dict` or `None` | No | `None` | C2PA (Coalition for Content Provenance and Authenticity) manifest data, if available. |
| `disclosure` | `str` or `None` | No | `None` | Human-readable disclosure statement about AI involvement. |
| `verification` | `dict` or `None` | No | `None` | Third-party verification data. |
{: .table .table-bordered .table-striped }

#### DigitalSourceType Enum

| Value | Description |
| --- | --- |
| `digital_capture` | Captured directly by a digital device (camera, screen recording). |
| `digital_creation` | Created entirely by a human using digital tools (Photoshop, Illustrator). |
| `composite_capture` | Composite of multiple captured sources. |
| `composite_synthetic` | Composite that includes fully synthetic elements. |
| `composite_with_trained_model` | Composite incorporating output from a trained AI model. |
| `trained_algorithmic_model` | Generated entirely by a trained AI model. |
| `algorithmic_media` | Generated by a non-ML algorithm (procedural, mathematical). |
| `human_edits` | AI-generated content with significant human modifications. |
| `minor_human_edits` | AI-generated content with only minor human modifications (cropping, colour correction). |
{: .table .table-bordered .table-striped }

### Response: SyncCreativesResponse

| Field | Type | Description |
| --- | --- | --- |
| `created` | `int` | Number of creatives created. |
| `updated` | `int` | Number of creatives updated. |
| `deleted` | `int` | Number of creatives deleted (when `delete_missing` is `true`). |
| `results` | `list[object]` | Per-creative result objects with `creative_id`, `status`, and `errors` (if any). |
{: .table .table-bordered .table-striped }

### Error Responses

| Error | Cause |
| --- | --- |
| `AdCPValidationError` | Format mismatch, missing required asset fields, or invalid `format_id`. |
| `AdCPNotFoundError` | Referenced `format_id` does not exist at the specified `agent_url`. |
| `AdCPAuthorizationError` | Attempting to modify creatives owned by another principal. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{
  "creatives": [
    {
      "creative_id": "cr_video_001",
      "format_id": {"agent_url": "https://creative.example.com", "id": "video_30s"},
      "name": "Acme Sports CTV 30s",
      "assets": {
        "vast_url": "https://cdn.example.com/vast/acme_sports_30s.xml",
        "duration_seconds": 30,
        "resolution": "1920x1080"
      },
      "provenance": {
        "digital_source_type": "human_edits",
        "ai_tool": "RunwayML Gen-3",
        "human_oversight": "Creative director reviewed and approved final cut",
        "disclosure": "This advertisement contains AI-generated visual effects."
      }
    }
  ],
  "assignments": {
    "mb_a1b2c3d4": ["cr_video_001"]
  },
  "dry_run": false,
  "validation_mode": "strict"
}
```

**Response:**

```json
{
  "created": 1,
  "updated": 0,
  "deleted": 0,
  "results": [
    {
      "creative_id": "cr_video_001",
      "status": "processing",
      "errors": []
    }
  ]
}
```

---

## list_creatives

Lists creatives visible to the authenticated principal, with optional filters.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `media_buy_id` | `str` or `None` | No | `None` | Return only creatives assigned to this media buy. |
| `media_buy_ids` | `list[str]` or `None` | No | `None` | Return creatives assigned to any of these media buys. |
| `buyer_ref` | `str` or `None` | No | `None` | Filter by buyer reference. |
| `status` | `str` or `None` | No | `None` | Filter by creative status: `processing`, `approved`, `rejected`, `pending_review`. |
| `format` | `str` or `None` | No | `None` | Filter by format ID. |
{: .table .table-bordered .table-striped }

### Response: ListCreativesResponse

| Field | Type | Description |
| --- | --- | --- |
| `creatives` | `list[Creative]` | Matching creative objects. |
{: .table .table-bordered .table-striped }

Each `Creative` includes:

| Field | Type | Description |
| --- | --- | --- |
| `creative_id` | `str` | The creative identifier. |
| `format_id` | `FormatId` | Format reference (`agent_url`, `id`). |
| `name` | `str` | Creative name. |
| `status` | `str` | Current status (`processing`, `pending_review`, `approved`, `rejected`). |
| `assets` | `dict` | Asset payload. |
| `created_date` | `str` (ISO 8601) | When the creative was created. |
| `updated_date` | `str` (ISO 8601) | When the creative was last modified. |
| `provenance` | `Provenance` or `None` | Content provenance metadata. |
{: .table .table-bordered .table-striped }

### Example

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

## Related Pages

- [Tool Reference](tool-reference.html) -- Overview of all tools, authentication, and error handling
- [Discovery Tools](discovery-tools.html) -- Use `list_creative_formats` to discover accepted formats
- [Media Buy Tools](media-buy-tools.html) -- Assign creatives to packages within a media buy
- [API Schema Reference](../schemas/api-schemas.html) -- Full Pydantic model definitions including Creative and Provenance
