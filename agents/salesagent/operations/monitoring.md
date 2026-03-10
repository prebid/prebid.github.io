---
layout: page_v2
title: Prebid Sales Agent - Monitoring & Audit Logging
description: Health checks, structured logging, audit trail, activity stream, Slack notifications, and alerting for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Monitoring & Audit Logging
{: .no_toc}

- TOC
{:toc}

## Health Checks

### Endpoint

The Sales Agent exposes a health check endpoint at:

```
GET /health
```

This endpoint verifies:

1. The FastAPI application is running and accepting requests
2. The PostgreSQL database connection is active and responsive

### Response

A healthy response returns HTTP 200:

```json
{
  "status": "healthy",
  "database": "connected"
}
```

An unhealthy response returns HTTP 503 with details about the failure:

```json
{
  "status": "unhealthy",
  "database": "connection failed",
  "error": "connection to server at \"postgres\" (172.18.0.2), port 5432 failed"
}
```

### Usage in Deployments

| Platform | Health Check Configuration |
| --- | --- |
| Docker | `healthcheck` directive in docker-compose.yml: `curl -f http://localhost:8080/health` |
| Fly.io | `[[http_service.checks]]` in fly.toml with `path = "/health"` |
| Cloud Run | Startup probe on port 8080, path `/health` |
| External monitoring | Point Pingdom, UptimeRobot, or similar at `https://yourdomain.com/health` |
{: .table .table-bordered .table-striped }

### Docker Health Check Example

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 30s
```

## Structured Logging

### Logfire Integration

The Sales Agent uses [Logfire](https://logfire.pydantic.dev/) for structured, searchable logging. Logfire provides:

- Structured log events with rich metadata
- Distributed tracing across requests
- Performance profiling
- Error tracking and aggregation

### Configuration

Set the `LOGFIRE_TOKEN` environment variable to enable Logfire:

```bash
LOGFIRE_TOKEN=your-logfire-token
```

When `LOGFIRE_TOKEN` is set, the application emits structured log events to the Logfire service. Without this token, logs are written to stdout in a structured format.

### Log Levels

| Level | Usage |
| --- | --- |
| DEBUG | Detailed request tracing, SQL queries, adapter calls |
| INFO | Standard operations: request handled, media buy created, token validated |
| WARNING | Non-critical issues: deprecated API usage, approaching rate limits |
| ERROR | Operation failures: database errors, adapter failures, authentication rejections |
| CRITICAL | System-level failures: database unavailable, encryption key missing |
{: .table .table-bordered .table-striped }

### Viewing Logs

| Platform | Command |
| --- | --- |
| Docker | `docker compose logs adcp-server` |
| Docker (follow) | `docker compose logs -f adcp-server` |
| Fly.io | `fly logs --app adcp-sales` |
| Cloud Run | `gcloud run services logs read adcp-sales --region=us-central1` |
| Logfire | Logfire web dashboard at `https://logfire.pydantic.dev/` |
{: .table .table-bordered .table-striped }

## Audit Trail

### Overview

Every operation performed through the Sales Agent is recorded in the `audit_logs` database table. This includes operations from all protocols (MCP, A2A, REST API) and the Admin UI. The audit trail is immutable -- records are inserted but never updated or deleted.

### Audit Log Schema

| Column | Type | Description |
| --- | --- | --- |
| `log_id` | String | Unique log entry identifier |
| `tenant_id` | UUID | Tenant where the operation occurred |
| `operation` | String | Operation name (e.g., `create_media_buy`, `update_product`, `sync_creatives`) |
| `principal_id` | UUID | The principal who performed the action (null for admin operations) |
| `principal_name` | String | Display name of the principal |
| `adapter_id` | String | The ad server adapter involved in the operation |
| `success` | Boolean | Whether the operation completed successfully |
| `details` | JSON | Structured data about the operation (parameters, results) |
| `error` | String | Error message if the operation failed |
| `ip_address` | String | Source IP address of the request |
| `created_at` | Timestamp | When the operation was logged |
{: .table .table-bordered .table-striped }

### What Events Are Logged

| Category | Operations |
| --- | --- |
| Media Buys | `create_media_buy`, `update_media_buy`, `get_media_buys`, `get_media_buy_delivery` |
| Creatives | `sync_creatives`, `list_creatives` |
| Discovery | `get_adcp_capabilities`, `get_products`, `list_creative_formats`, `list_authorized_properties` |
| Workflows | `list_tasks`, `get_task`, `complete_task` |
| Performance | `update_performance_index` |
| Admin | `create_tenant`, `update_tenant`, `create_principal`, `update_product`, `update_settings` |
| Authentication | `token_validated`, `token_rejected`, `token_expired`, `sso_login`, `sso_login_failed` |
{: .table .table-bordered .table-striped }

### Querying Audit Logs

Through the Admin UI, navigate to **Activity** to view the audit log with filters for:

- Date range
- Operation type
- Principal (advertiser)
- Success / failure status

For direct database queries:

```sql
-- Recent failures
SELECT operation, principal_name, error, created_at
FROM audit_logs
WHERE tenant_id = 'your-tenant-id'
  AND success = false
ORDER BY created_at DESC
LIMIT 50;

-- Operations by a specific principal
SELECT operation, success, details, created_at
FROM audit_logs
WHERE tenant_id = 'your-tenant-id'
  AND principal_id = 'principal-uuid'
ORDER BY created_at DESC;

-- Authentication failures in the last 24 hours
SELECT operation, principal_name, ip_address, error, created_at
FROM audit_logs
WHERE operation IN ('token_rejected', 'token_expired', 'sso_login_failed')
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

## Activity Stream

### Overview

The Admin UI includes a real-time activity stream powered by Server-Sent Events (SSE). The stream shows business operations as they happen, without requiring page refreshes.

### How It Works

1. The `business_activity_service` captures events from all protocols (MCP, A2A, REST API)
2. Events are pushed to connected SSE clients via the `/admin/activity/stream` endpoint
3. The Admin UI dashboard renders events in a live feed

### Event Types

The activity stream displays:

- Media buy creation and updates
- Creative uploads and sync operations
- Workflow task creation and completion
- Advertiser registration and token generation
- Product catalog changes
- Configuration updates

### nginx Configuration for SSE

If using nginx as a reverse proxy, SSE requires specific configuration to prevent buffering:

```nginx
location /admin/activity/stream {
    proxy_pass http://adcp_backend;
    proxy_set_header Host $host;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 86400s;
}
```

## Slack Notifications

The Sales Agent can send notifications to Slack via webhooks. Three webhook URLs can be configured per tenant:

| Webhook | Setting | Purpose |
| --- | --- | --- |
| General | `slack_webhook_url` | General operational notifications (media buy created, campaign launched) |
| Audit | `slack_audit_webhook_url` | Security and audit events (authentication failures, configuration changes) |
| Human-in-the-Loop | `hitl_webhook_url` | Approval requests requiring human action (budget threshold exceeded, policy violation) |
{: .table .table-bordered .table-striped }

### Configuration

Configure webhooks in the Admin UI under **Settings** > **Notifications**, or set them via the API:

```bash
curl -X PATCH https://yourdomain.com/api/v1/tenant/settings \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "slack_webhook_url": "https://hooks.slack.com/services/T.../B.../xxx",
    "slack_audit_webhook_url": "https://hooks.slack.com/services/T.../B.../yyy",
    "hitl_webhook_url": "https://hooks.slack.com/services/T.../B.../zzz"
  }'
```

### Notification Content

General notifications include:

- Media buy status changes (created, approved, paused, completed)
- Campaign delivery milestones
- New advertiser registrations

Audit notifications include:

- Authentication failures and token expirations
- Configuration changes (adapter, SSO, policies)
- Super admin actions

Human-in-the-loop notifications include:

- Media buy approval requests with budget details
- Policy violation alerts with recommended actions
- Workflow tasks waiting for human decision

## Background Schedulers

The Sales Agent runs two background schedulers that automate campaign lifecycle operations. Both schedulers are started during the application lifespan (in `src/core/main.py`) and stopped on shutdown. They can be disabled with `SKIP_CRON=true`.

### Media Buy Status Scheduler

**Module**: `src/services/media_buy_status_scheduler.py`

The Media Buy Status Scheduler automatically transitions media buy statuses based on flight dates. It runs on a configurable interval (default: 60 seconds) and works cross-tenant, querying all active tenants on each cycle.

**Automatic status transitions:**

{: .table .table-bordered .table-striped }
| From Status | To Status | Condition |
|-------------|-----------|-----------|
| `pending_activation` | `active` | `flight_start_date` has been reached and all creatives are approved |
| `active` | `completed` | `flight_end_date` has passed |

| Setting | Value |
| --- | --- |
| Default interval | 60 seconds |
| Scope | Cross-tenant (all active tenants) |
| Manual pause | Respected -- paused media buys are not auto-transitioned |
| On status change | Updates database, triggers Slack notification, creates audit log entry |
{: .table .table-bordered .table-striped }

### Delivery Webhook Scheduler

**Module**: `src/services/delivery_webhook_scheduler.py`

The Delivery Webhook Scheduler sends periodic delivery reports to configured webhook URLs. It integrates with the protocol webhook service for authentication and implements duplicate prevention.

| Setting | Value |
| --- | --- |
| Default interval | 3600 seconds (1 hour) |
| Payload | Media buy ID, delivery metrics, status |
| Authentication | Integrates with the protocol webhook service (see below) |
| Duplicate prevention | 24-hour window to avoid re-sending the same report |
| Scope | Respects per-tenant webhook configuration |
{: .table .table-bordered .table-striped }

### Protocol Webhooks

**Module**: `src/services/protocol_webhook_service.py`

The Protocol Webhook Service sends push notifications for campaign events such as status changes and delivery updates. It handles both A2A `TaskStatusUpdateEvent` payloads and MCP webhook payloads.

**Supported authentication schemes:**

{: .table .table-bordered .table-striped }
| Scheme | Header | Description |
|--------|--------|-------------|
| **Bearer Token** | `Authorization: Bearer <token>` | Token-based authentication |
| **HMAC-SHA256** | `X-Signature` | Signed request body with a shared secret key |
| **None** | -- | Unauthenticated (development only) |

**Configuration** is managed via `PushNotificationConfig`:

{: .table .table-bordered .table-striped }
| Field | Description |
|-------|-------------|
| `url` | Webhook endpoint URL |
| `authentication_type` | One of `bearer`, `hmac-sha256`, or `none` |
| `authentication_token` | Bearer token or HMAC secret key |

<div class="alert alert-info" role="alert">
The webhook service performs Docker localhost normalization for local testing, automatically rewriting <code>localhost</code> URLs to the Docker host address when running inside a container.
</div>

Additional behavior:

- Automatic retry with logging on delivery failure.
- All webhook dispatches are recorded in the audit log.

## Database Monitoring

### Connection Pool

Monitor database connection health through:

- **Health endpoint**: `GET /health` verifies active database connectivity
- **Query timeout**: `DATABASE_QUERY_TIMEOUT` (default: 30 seconds) prevents long-running queries from blocking the pool
- **Connect timeout**: `DATABASE_CONNECT_TIMEOUT` (default: 10 seconds) limits time spent establishing new connections

### PgBouncer Support

For high-traffic deployments, enable PgBouncer connection pooling:

```bash
USE_PGBOUNCER=true
```

When enabled, the application adjusts its connection handling to be compatible with PgBouncer's transaction pooling mode.

### Key Metrics to Monitor

| Metric | Source | Alert Threshold |
| --- | --- | --- |
| Database connectivity | `/health` endpoint | Any non-200 response |
| Query latency | Logfire / application logs | p95 > 5 seconds |
| Connection pool utilization | Database server metrics | > 80% of max connections |
| Active connections | `pg_stat_activity` | Approaching `max_connections` |
| Table bloat | `pg_stat_user_tables` | `n_dead_tup` > 10,000 |
| Disk usage | Database server | > 80% of allocated storage |
{: .table .table-bordered .table-striped }

### Database Health Queries

```sql
-- Active connections by state
SELECT state, count(*)
FROM pg_stat_activity
WHERE datname = 'adcp_sales'
GROUP BY state;

-- Slowest recent queries
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = 'adcp_sales')
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

## Alerting Patterns

### Health Check Monitoring

Set up external monitoring to poll the `/health` endpoint and alert on failures:

| Tool | Configuration |
| --- | --- |
| UptimeRobot | HTTP monitor on `https://yourdomain.com/health`, check every 1 minute, alert on 2 consecutive failures |
| Pingdom | HTTPS check on `/health`, 1-minute interval |
| AWS CloudWatch | Synthetic canary hitting `/health` endpoint |
| GCP Cloud Monitoring | Uptime check on Cloud Run service URL |
{: .table .table-bordered .table-striped }

### Error Rate Tracking

Monitor the audit log for elevated error rates:

```sql
-- Error rate in the last hour
SELECT
  COUNT(*) FILTER (WHERE success = false) AS errors,
  COUNT(*) AS total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE success = false) / COUNT(*), 2) AS error_pct
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '1 hour';
```

Set alerts when:

- Error rate exceeds 5% over a 15-minute window
- Any critical operation fails (e.g., `create_media_buy` with `success = false`)
- Authentication failure count exceeds threshold (possible brute force)

### Budget Alerts

Monitor media buy budget utilization:

- Configure budget thresholds in advertising policies
- Workflow tasks are created automatically when thresholds are exceeded
- Slack notifications via `hitl_webhook_url` alert operators to pending approvals

### Recommended Alert Configuration

| Alert | Condition | Severity | Channel |
| --- | --- | --- | --- |
| Health check failure | `/health` returns non-200 for 2+ checks | Critical | PagerDuty / SMS |
| High error rate | > 5% failures in 15 minutes | High | Slack (`slack_webhook_url`) |
| Authentication spike | > 10 auth failures in 5 minutes | High | Slack (`slack_audit_webhook_url`) |
| Database connection failure | Health check reports database unhealthy | Critical | PagerDuty / SMS |
| Disk usage high | Database disk > 80% | Medium | Email / Slack |
| Pending approvals | Workflow tasks pending > 24 hours | Medium | Slack (`hitl_webhook_url`) |
| Certificate expiry | TLS certificate expires in < 14 days | Medium | Email |
{: .table .table-bordered .table-striped }

## Next Steps

- [Security Model](security.html) -- audit trail details and production hardening
- [Admin UI Guide](admin-ui.html) -- activity stream and audit log viewer
- [Deployment Overview](../deployment/deployment-overview.html) -- platform-specific monitoring setup
- [Single-Tenant Deployment](../deployment/single-tenant.html) -- Docker health check configuration
