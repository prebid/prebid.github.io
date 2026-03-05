---
layout: page_v2
title: Prebid Sales Agent - Tools - Workflow Tools
description: Manage human-in-the-loop approval tasks for media buys and creatives
sidebarType: 10
---

# Workflow Tools
{: .no_toc}

Workflow tools manage the human-in-the-loop approval process for media buys and creatives. When a buying agent submits a media buy or creative, it may enter a pending approval state. These tools allow agents to monitor and interact with the approval workflow.

- TOC
{:toc}

## Overview

The workflow system tracks tasks that require human approval or asynchronous processing. A media buy submission, for example, may create a task with status `requires_approval` that must be completed before the buy becomes active. These three tools — `list_tasks`, `get_task`, and `complete_task` — provide full visibility and control over the task lifecycle.

All three tools require authentication. Without a valid tenant context, each returns a `no_tenant_context` error.

Source: `src/core/main.py:690,799,866`

## list_tasks

List workflow tasks with optional filtering by status, object type, or object ID. Results are paginated.

### Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `status` | `str` | No | Filter by task status: `pending`, `in_progress`, `completed`, `failed`, `requires_approval`. | `None` |
| `object_type` | `str` | No | Filter by associated object type: `media_buy`, `creative`, `product`. | `None` |
| `object_id` | `str` | No | Filter by associated object ID. | `None` |
| `limit` | `int` | No | Maximum number of tasks to return. | `20` |
| `offset` | `int` | No | Number of tasks to skip for pagination. | `0` |

### Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `tasks` | `list[Task]` | List of workflow tasks matching the filters |
| `total` | `int` | Total number of matching tasks |
| `offset` | `int` | Current pagination offset |
| `limit` | `int` | Current page size |
| `has_more` | `bool` | Whether additional pages of results exist |

### Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `no_tenant_context` | No tenant context available. Authentication is required. |

### Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # List all tasks pending approval
    result = await session.call_tool(
        "list_tasks",
        arguments={
            "status": "requires_approval",
        },
    )
    for task in result.content["tasks"]:
        print(f"{task['task_id']}: {task['type']} — {task['status']}")
    print(f"Total: {result.content['total']}")

    # List tasks for a specific media buy
    result = await session.call_tool(
        "list_tasks",
        arguments={
            "object_type": "media_buy",
            "object_id": "mb_abc123",
            "limit": 10,
        },
    )
```

Example response:

```json
{
  "tasks": [
    {
      "task_id": "task_001",
      "type": "media_buy_approval",
      "status": "requires_approval",
      "tool_name": "create_media_buy",
      "owner": "buyer_agent_001",
      "created_at": "2026-02-20T14:30:00Z",
      "associated_objects": [
        {"type": "media_buy", "id": "mb_abc123"}
      ]
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 20,
  "has_more": false
}
```

---

## get_task

Get detailed information about a specific workflow task, including its request and response data.

### Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `task_id` | `str` | Yes | ID of the task to retrieve. | -- |

### Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `task_id` | `str` | Unique task identifier |
| `context_id` | `str` | ID of the conversation or session context |
| `status` | `str` | Current task status |
| `type` | `str` | Task type (e.g., `media_buy_approval`, `creative_review`) |
| `tool_name` | `str` | Name of the tool that created this task |
| `owner` | `str` | Identifier of the agent or user that owns the task |
| `created_at` | `str` | ISO 8601 timestamp of task creation |
| `request_data` | `object` | Original request parameters that triggered the task |
| `response_data` | `object` | Response data (populated after completion) |
| `error_message` | `str` | Error message (populated if the task failed) |
| `associated_objects` | `list[object]` | Objects related to this task (media buys, creatives, products) |

### Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `no_tenant_context` | No tenant context available. Authentication is required. |
| `task_not_found` | No task exists with the specified `task_id`. |

### Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Get details for a specific task
    result = await session.call_tool(
        "get_task",
        arguments={"task_id": "task_001"},
    )
    task = result.content
    print(f"Task: {task['task_id']}")
    print(f"Status: {task['status']}")
    print(f"Type: {task['type']}")
    print(f"Created: {task['created_at']}")
    if task.get("request_data"):
        print(f"Request: {task['request_data']}")
```

Example response:

```json
{
  "task_id": "task_001",
  "context_id": "ctx_session_abc",
  "status": "requires_approval",
  "type": "media_buy_approval",
  "tool_name": "create_media_buy",
  "owner": "buyer_agent_001",
  "created_at": "2026-02-20T14:30:00Z",
  "request_data": {
    "media_buy_id": "mb_abc123",
    "packages": [
      {"product_id": "prod_001", "budget": 5000}
    ]
  },
  "response_data": null,
  "error_message": null,
  "associated_objects": [
    {"type": "media_buy", "id": "mb_abc123"}
  ]
}
```

---

## complete_task

Complete a pending workflow task. This simulates human approval or records an async completion. Only tasks in a pending or approval-required state can be completed.

### Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `task_id` | `str` | Yes | ID of the task to complete. | -- |
| `status` | `str` | No | Completion status. Must be `completed` or `failed`. | `"completed"` |
| `response_data` | `dict` | No | Arbitrary response data to attach to the completed task. | `None` |
| `error_message` | `str` | No | Error message when completing with `failed` status. | `None` |

### Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `task_id` | `str` | ID of the completed task |
| `status` | `str` | Final task status (`completed` or `failed`) |
| `message` | `str` | Human-readable completion message |
| `completed_at` | `str` | ISO 8601 timestamp of completion |
| `completed_by` | `str` | Identifier of the principal that completed the task |

### Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `no_tenant_context` | No tenant context available. Authentication is required. |
| `task_not_found` | No task exists with the specified `task_id`. |
| `task_already_completed` | The task has already been completed and cannot be modified. |
| `invalid_status` | The `status` parameter must be `completed` or `failed`. |

### Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Approve a pending task
    result = await session.call_tool(
        "complete_task",
        arguments={
            "task_id": "task_001",
            "status": "completed",
            "response_data": {
                "approved_by": "publisher_ops",
                "notes": "Creative assets verified.",
            },
        },
    )
    print(f"Task {result.content['task_id']}: {result.content['status']}")
    print(f"Completed at: {result.content['completed_at']}")

    # Reject a task
    result = await session.call_tool(
        "complete_task",
        arguments={
            "task_id": "task_002",
            "status": "failed",
            "error_message": "Creative does not meet brand safety requirements.",
        },
    )
```

Example response (approval):

```json
{
  "task_id": "task_001",
  "status": "completed",
  "message": "Task completed successfully.",
  "completed_at": "2026-02-20T15:45:00Z",
  "completed_by": "publisher_ops"
}
```

Example response (rejection):

```json
{
  "task_id": "task_002",
  "status": "failed",
  "message": "Task marked as failed.",
  "completed_at": "2026-02-20T15:50:00Z",
  "completed_by": "publisher_ops"
}
```

## Related Tools

- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Creates media buys that may produce approval tasks
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Syncs creatives that may produce review tasks
- [get_media_buys](/agents/salesagent/tools/get-media-buys.html) -- Check media buy status after task completion
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `list_tasks`, `get_task`, and `complete_task` tools implement the AdCP workflow management layer. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including task state machine, approval semantics, and webhook notification format.
