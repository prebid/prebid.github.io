---
layout: page_v2
title: Prebid Sales Agent - Workflow Tools
description: Reference for human-in-the-loop workflow tools including task listing, inspection, and completion.
sidebarType: 10
---

# Prebid Sales Agent - Workflow Tools
{: .no_toc}

- TOC
{:toc}

## Overview

Workflow tools provide a human-in-the-loop system for operations that require manual oversight. When the Sales Agent encounters an operation that needs approval -- such as activating a media buy or approving a creative -- it creates a **workflow task** that can be inspected and completed by a human operator or an authorised agent.

All three workflow tools require authentication.

See the [Tool Reference](tool-reference.html) for general information about authentication and error handling.

## Workflow Architecture

Tasks are persisted as `WorkflowStep` records in the database, each linked to a parent workflow context. The system tracks:

- **Who** created the task (the requesting principal).
- **What** the task concerns (an object type and ID, such as a media buy or creative).
- **When** the task was created and completed.
- **Request data** -- the original payload that triggered the workflow.
- **Response data** -- the result after the task is completed.

## Task Statuses

| Status | Description |
| --- | --- |
| `pending` | Task has been created but not yet picked up. |
| `in_progress` | Task is being worked on (e.g., a reviewer is examining the creative). |
| `completed` | Task finished successfully. |
| `failed` | Task was completed with a failure status. |
| `requires_approval` | Task is blocked waiting for explicit human approval. |
{: .table .table-bordered .table-striped }

## Workflow Patterns

### Manual Approval Flow

When a tenant's `approval_mode` requires manual approval for media buys, the following flow occurs:

```
create_media_buy (status: pending_activation)
       │
       ▼
  WorkflowStep created (status: requires_approval)
       │
       ▼
  list_tasks  ──►  get_task  ──►  complete_task (status: "completed")
                                        │
                                        ▼
                                  media buy ──► active
```

### Creative Review Flow

When `human_review_required` is set on the tenant or the automated content-standards score falls between the auto-approve and auto-reject thresholds:

```
sync_creatives (creative status: processing)
       │
       ▼
  validation passes → creative status: pending_review
       │
       ▼
  WorkflowStep created (status: requires_approval)
       │
       ▼
  complete_task (status: "completed")  ──►  creative status: approved
  complete_task (status: "failed")     ──►  creative status: rejected
```

### Auto-Approve Configuration

Tenants control automatic approval via two threshold fields on the `Tenant` model:

| Field | Default | Description |
| --- | --- | --- |
| `creative_auto_approve_threshold` | `0.9` | Content-standards score at or above this value triggers automatic approval. |
| `creative_auto_reject_threshold` | `0.1` | Content-standards score at or below this value triggers automatic rejection. |
{: .table .table-bordered .table-striped }

Scores falling between the two thresholds require manual review via the workflow system.

---

## list_tasks

Lists workflow tasks visible to the authenticated principal, with optional filters.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `status` | `str` or `None` | No | `None` | Filter by task status: `pending`, `in_progress`, `completed`, `failed`, `requires_approval`. |
| `object_type` | `str` or `None` | No | `None` | Filter by the type of object the task relates to: `media_buy`, `creative`, `product`. |
| `object_id` | `str` or `None` | No | `None` | Filter by the specific object ID. |
| `limit` | `int` | No | `20` | Maximum number of tasks to return. |
| `offset` | `int` | No | `0` | Number of tasks to skip (for pagination). |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `tasks` | `list[Task]` | Matching task objects (see fields below). |
| `total` | `int` | Total number of tasks matching the filters (ignoring `limit`/`offset`). |
| `pagination` | `object` | Pagination metadata with `limit`, `offset`, and `total` fields. |
{: .table .table-bordered .table-striped }

Each task in the list includes summary fields; use `get_task` for full details.

### Example

**Request:**

```json
{
  "status": "requires_approval",
  "object_type": "media_buy",
  "limit": 10,
  "offset": 0
}
```

**Response:**

```json
{
  "tasks": [
    {
      "task_id": "wf_step_001",
      "status": "requires_approval",
      "step_type": "media_buy_approval",
      "tool_name": "create_media_buy",
      "owner": "principal_abc",
      "object_type": "media_buy",
      "object_id": "mb_a1b2c3d4",
      "created_at": "2025-04-01T10:00:00Z"
    }
  ],
  "total": 1,
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1
  }
}
```

---

## get_task

Returns the full details of a single workflow task, including the original request data and any response data or error messages.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `task_id` | `str` | Yes | -- | The unique task identifier (from `list_tasks`). |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `task_id` | `str` | Unique task identifier. |
| `context_id` | `str` | Parent workflow context ID. |
| `status` | `str` | Current task status. |
| `step_type` | `str` | Type of workflow step (e.g., `media_buy_approval`, `creative_review`). |
| `tool_name` | `str` | The tool that triggered this task. |
| `owner` | `str` | The principal who created the task. |
| `request_data` | `dict` | The original request payload that triggered the workflow. |
| `response_data` | `dict` or `None` | Response payload (populated after completion). |
| `error_message` | `str` or `None` | Error message (populated if the task failed). |
| `created_at` | `str` (ISO 8601) | When the task was created. |
| `completed_at` | `str` (ISO 8601) or `None` | When the task was completed (null if still pending). |
{: .table .table-bordered .table-striped }

### Error Responses

| Error | Cause |
| --- | --- |
| `AdCPNotFoundError` | Task ID does not exist or is not visible to the caller. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{
  "task_id": "wf_step_001"
}
```

**Response:**

```json
{
  "task_id": "wf_step_001",
  "context_id": "ctx_abc123",
  "status": "requires_approval",
  "step_type": "media_buy_approval",
  "tool_name": "create_media_buy",
  "owner": "principal_abc",
  "request_data": {
    "media_buy_id": "mb_a1b2c3d4",
    "buyer_ref": "acme-sports-q1-2025",
    "total_budget": 50000,
    "currency": "USD",
    "packages": [
      {
        "product_id": "prod_ctv_sports_30s",
        "budget": 50000
      }
    ]
  },
  "response_data": null,
  "error_message": null,
  "created_at": "2025-04-01T10:00:00Z",
  "completed_at": null
}
```

---

## complete_task

Completes a workflow task with a status of `"completed"` (approved) or `"failed"` (rejected). Optionally includes response data or an error message.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `task_id` | `str` | Yes | -- | The unique task identifier. |
| `status` | `str` | No | `"completed"` | Completion status: `"completed"` or `"failed"`. |
| `response_data` | `dict` or `None` | No | `None` | Structured response data to attach to the completed task. |
| `error_message` | `str` or `None` | No | `None` | Error message explaining why the task failed (used when `status` is `"failed"`). |
{: .table .table-bordered .table-striped }

### Response

Returns a confirmation object indicating success:

| Field | Type | Description |
| --- | --- | --- |
| `task_id` | `str` | The completed task ID. |
| `status` | `str` | The new task status (`completed` or `failed`). |
| `completed_at` | `str` (ISO 8601) | Timestamp of completion. |
{: .table .table-bordered .table-striped }

### Side Effects

Completing a task triggers downstream state changes:

- **Media buy approval** (`status: "completed"`) -- The media buy transitions from `pending_activation` to `active` (assuming creatives are approved and flight dates are current).
- **Media buy rejection** (`status: "failed"`) -- The media buy remains in `pending_activation`. The buyer agent is notified of the rejection reason.
- **Creative approval** (`status: "completed"`) -- The creative status changes from `pending_review` to `approved`.
- **Creative rejection** (`status: "failed"`) -- The creative status changes from `pending_review` to `rejected`.

### Error Responses

| Error | Cause |
| --- | --- |
| `AdCPNotFoundError` | Task ID does not exist. |
| `AdCPConflictError` | Task has already been completed. |
| `AdCPValidationError` | Invalid status value (must be `"completed"` or `"failed"`). |
{: .table .table-bordered .table-striped }

### Example -- Approving a media buy

**Request:**

```json
{
  "task_id": "wf_step_001",
  "status": "completed",
  "response_data": {
    "approved_by": "ops_manager@publisher.com",
    "notes": "Budget and brand approved. Proceed with activation."
  }
}
```

**Response:**

```json
{
  "task_id": "wf_step_001",
  "status": "completed",
  "completed_at": "2025-04-01T12:30:00Z"
}
```

### Example -- Rejecting a creative

**Request:**

```json
{
  "task_id": "wf_step_002",
  "status": "failed",
  "error_message": "Creative contains prohibited content (alcohol). Please revise and resubmit."
}
```

**Response:**

```json
{
  "task_id": "wf_step_002",
  "status": "failed",
  "completed_at": "2025-04-01T14:00:00Z"
}
```

## Related Pages

- [Tool Reference](tool-reference.html) -- Overview of all tools, authentication, and error handling
- [Media Buy Tools](media-buy-tools.html) -- Media buys that may require workflow approval
- [Creative Tools](creative-tools.html) -- Creatives that may require workflow review
- [Database Models](../schemas/database-models.html) -- WorkflowStep model details
