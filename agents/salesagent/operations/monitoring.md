---
layout: page_v2
title: Prebid Sales Agent - Operations - Monitoring and Audit Logging
description: Audit logging, activity monitoring, and operational observability for the Prebid Sales Agent
sidebarType: 10
---

# Monitoring and Audit Logging
{: .no_toc}

The Sales Agent records all significant operations to an audit trail and provides operational monitoring through health endpoints, container logs, and a real-time activity stream. This page covers the `AuditLogger` implementation, storage locations, Slack notifications, security violation detection, and health monitoring.

- TOC
{:toc}

## AuditLogger

The `AuditLogger` class is the central logging component for the Sales Agent. It records operations to the database, log files, and optional Slack channels.

### Initialization

```python
from src.core.audit_logger import AuditLogger, get_audit_logger

# Direct instantiation
logger = AuditLogger(adapter_name="google_ad_manager", tenant_id="tenant_001")

# Helper function (recommended)
logger = get_audit_logger(adapter_name="google_ad_manager", tenant_id="tenant_001")
```

The `get_audit_logger()` helper is the recommended way to obtain a logger instance. It handles initialization and is called automatically within the adapter `__init__()` method, so adapter implementations do not need to create a logger manually.

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `adapter_name` | `str` | The name of the adapter that owns this logger (e.g., `"google_ad_manager"`, `"mock"`) |
| `tenant_id` | `str` or `None` | Tenant identifier for multi-tenant deployments. When set, all log entries are tagged with this tenant. |

## Core Methods

### log_operation

Records a standard operation to the audit trail.

```python
logger.log_operation(
    operation="media_buy.created",
    principal_name="Acme Corp",
    principal_id="principal_abc123",
    adapter_id="adapter_gam_001",
    success=True,
    details={"media_buy_id": "mb_789", "budget_cents": 500000},
    error=None,
    tenant_id="tenant_001",
)
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `operation` | `str` | Operation identifier (e.g., `media_buy.created`, `creative.approved`) |
| `principal_name` | `str` | Display name of the principal performing the action |
| `principal_id` | `str` | Unique identifier of the principal |
| `adapter_id` | `str` | Identifier of the adapter handling the operation |
| `success` | `bool` | Whether the operation completed successfully |
| `details` | `dict` or `None` | Operation-specific data stored as JSONB |
| `error` | `str` or `None` | Error message if the operation failed |
| `tenant_id` | `str` or `None` | Tenant context (overrides the logger's default if provided) |

This method writes to all three storage locations (database, file, console) and triggers Slack notifications for qualifying operations.

### log_security_violation

Records an unauthorized access attempt or security-relevant event.

```python
logger.log_security_violation(
    operation="cross_tenant_access",
    principal_id="principal_abc123",
    resource_id="tenant_other_002",
    reason="Principal attempted to access a resource outside their tenant",
    tenant_id="tenant_001",
)
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `operation` | `str` | The operation that triggered the violation |
| `principal_id` | `str` | Identifier of the principal involved |
| `resource_id` | `str` | The resource that was improperly accessed or targeted |
| `reason` | `str` | Human-readable description of the violation |
| `tenant_id` | `str` or `None` | Tenant context |

Security violations are written to the database, the dedicated `security.jsonl` log file, and the console. They always trigger a Slack notification if Slack is configured.

## Audit Trail Storage

The audit trail is stored in three locations simultaneously for redundancy and flexibility.

### 1. Database

All audit entries are written to the `AuditLog` table in PostgreSQL.

{: .table .table-bordered .table-striped }
| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key |
| `tenant_id` | `str` | Tenant that owns this entry |
| `timestamp` | `datetime` | UTC timestamp of the event |
| `operation` | `str` | Operation identifier |
| `principal_name` | `str` | Display name of the acting principal |
| `principal_id` | `str` | Unique identifier of the acting principal |
| `adapter_id` | `str` | Adapter that handled the operation |
| `success` | `bool` | Whether the operation succeeded |
| `error_message` | `str` or `null` | Error message on failure |
| `details` | `JSONB` | Operation-specific structured data |

The database is the primary audit store and backs the Admin UI audit log viewer and the activity stream API.

### 2. File Backup

Audit entries are also written to log files on disk for backup and external log aggregation.

{: .table .table-bordered .table-striped }
| File | Contents | Format |
|------|----------|--------|
| `logs/audit.log` | All operations (success and failure) | Human-readable text |
| `logs/error.log` | Failed operations only | Human-readable text |
| `logs/security.jsonl` | Security violations only | JSON Lines (one JSON object per line) |
| `logs/structured.jsonl` | All operations | JSON Lines (one JSON object per line) |

{: .alert.alert-info :}
The `structured.jsonl` file is designed for ingestion by log aggregation systems (e.g., Elasticsearch, Datadog, Splunk). Each line is a self-contained JSON object with all audit fields.

### 3. Console Output

All audit entries are printed to the console (stdout/stderr) with structured formatting. In Docker deployments, console output is captured by the container runtime and accessible via `docker compose logs`.

## Slack Notifications

When a Slack webhook URL is configured, the audit logger sends notifications for high-impact operations.

### Operations That Trigger Notifications

{: .table .table-bordered .table-striped }
| Category | Operations |
|----------|------------|
| **Media buy** | Create, update, delete |
| **Creative** | Approve, reject, manual approval |
| **User management** | Add user, toggle active status, update role |
| **Tenant management** | Create, deactivate, reactivate, update settings |
| **Adapter configuration** | Setup, update connection or product config |
| **Principal management** | Create, update platform mappings |
| **High-value transactions** | Any operation where budget exceeds $10,000 |
| **Security violations** | All violations (always notified) |

{: .alert.alert-warning :}
High-value transaction notifications use a $10,000 threshold. Any media buy creation or budget adjustment above this amount triggers a Slack alert regardless of the operation category.

## Security Violation Detection

The audit logger flags the following patterns as security violations:

{: .table .table-bordered .table-striped }
| Violation Type | Description | Severity |
|---------------|-------------|----------|
| Repeated failed authentication | Multiple failed auth attempts from the same source within a time window | High |
| Invalid or expired tokens | Requests using tokens that do not exist or have been revoked | Medium |
| Cross-tenant access attempts | A principal attempting to access resources belonging to a different tenant | Critical |
| Unusual request patterns | Abnormal request volume, timing, or endpoint access that deviates from the principal's baseline | Medium |

Security violations are:

- Stored in the `AuditLog` database table with a `security_violation` flag
- Written to `logs/security.jsonl` for dedicated security log analysis
- Sent to Slack immediately (if configured)
- Surfaced in the Admin UI activity stream with a warning indicator

## Activity Stream

The Sales Agent provides a real-time activity stream via Server-Sent Events (SSE). The activity stream is implemented as a Flask blueprint and backed by the database audit log.

### Endpoint

```text
GET /api/activity-stream
```

The SSE endpoint pushes new audit log entries to connected clients in real time. The Admin UI uses this endpoint to display a live activity feed.

### Event Format

Each SSE event contains a JSON-serialized audit log entry:

```json
{
  "id": "evt_abc123",
  "timestamp": "2025-04-15T14:30:00Z",
  "operation": "media_buy.created",
  "principal_name": "Acme Corp",
  "success": true,
  "details": {
    "media_buy_id": "mb_789",
    "budget_cents": 500000
  }
}
```

{: .alert.alert-info :}
The activity stream requires an authenticated Admin UI session. It does not accept MCP or A2A tokens.

## Docker Container Logs

In Docker deployments, all console output from the Sales Agent is captured by the Docker logging driver.

### Viewing Logs

```bash
# Follow logs in real time
docker compose logs -f salesagent

# Filter for errors
docker compose logs salesagent | grep ERROR

# View logs for a specific time range (Docker timestamp filtering)
docker compose logs --since 1h salesagent

# View logs from all services
docker compose logs -f
```

### Log Levels

{: .table .table-bordered .table-striped }
| Level | Contents |
|-------|----------|
| `INFO` | Standard operations, startup messages, health checks |
| `WARNING` | Non-critical issues, approaching rate limits, deprecated feature usage |
| `ERROR` | Failed operations, adapter errors, unhandled exceptions |
| `CRITICAL` | Security violations, database connectivity loss, encryption failures |

## Health Monitoring

The Sales Agent exposes a health check endpoint for infrastructure monitoring.

### Health Endpoint

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "ok"
}
```

The health endpoint performs the following checks:

{: .table .table-bordered .table-striped }
| Check | Description | Failure Behavior |
|-------|-------------|------------------|
| Database connectivity | Executes a lightweight query against PostgreSQL | Returns `{"status": "error", "detail": "database unavailable"}` |
| Adapter availability | Verifies the configured adapter can be instantiated | Returns `{"status": "degraded", "detail": "adapter unavailable"}` |

{: .alert.alert-warning :}
The health endpoint does not require authentication. It is intended for use by load balancers and container orchestrators (e.g., Docker health checks, Kubernetes liveness probes). Do not expose it on a public network without IP restrictions.

### Docker Health Check

Configure a Docker health check in your `docker-compose.yml`:

```bash
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 15s
```

## Further Reading

- [Security Model](/agents/salesagent/operations/security.html) -- Authentication, encryption, and access control
- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Activity stream and audit log viewer in the Admin UI
- [Single-Tenant Deployment](/agents/salesagent/deployment/single-tenant.html) -- Docker Compose configuration and log management
