---
layout: page_v2
title: Prebid Sales Agent - Security Model
description: Authentication layers, encryption, multi-tenant isolation, and production hardening for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Security Model
{: .no_toc}

- TOC
{:toc}

## Authentication Layers

The Prebid Sales Agent uses a layered authentication model with four distinct levels. Each level serves a different actor and grants different capabilities.

| Layer | Actor | Mechanism | Scope |
| --- | --- | --- | --- |
| Super Admin | Platform operator | `SUPER_ADMIN_EMAILS` / `SUPER_ADMIN_DOMAINS` env vars | Full platform access across all tenants |
| OAuth / SSO | Admin UI users | Per-tenant OIDC (Google, Microsoft, Okta, Auth0, Keycloak) | Tenant-scoped Admin UI access |
| Tenant Admin | API integrators | `admin_token` field on tenant record | Tenant-scoped API and management access |
| Principal Token | AI buying agents | `auth_token` on principal record, sent via `x-adcp-auth` or `Bearer` header | Principal-scoped data access within a tenant |
{: .table .table-bordered .table-striped }

### Super Admin

Super admin privileges are granted based on environment variables:

- **`SUPER_ADMIN_EMAILS`**: Comma-separated list of specific email addresses (e.g., `alice@corp.com,bob@corp.com`)
- **`SUPER_ADMIN_DOMAINS`**: Comma-separated list of email domains (e.g., `corp.com`). All users with an email at any listed domain receive super admin access.

Super admins can:

- Create, read, update, and delete tenants
- Access any tenant's data and configuration
- Manage platform-wide settings

<div class="alert alert-info" role="alert">
Changes to <code>SUPER_ADMIN_EMAILS</code> and <code>SUPER_ADMIN_DOMAINS</code> require a service restart to take effect.
</div>

### OAuth / SSO

Each tenant can configure its own OIDC provider for Admin UI authentication. Supported providers:

| Provider | Discovery URL Pattern |
| --- | --- |
| Google | `https://accounts.google.com/.well-known/openid-configuration` |
| Microsoft / Entra ID | `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration` |
| Okta | `https://{domain}.okta.com/.well-known/openid-configuration` |
| Auth0 | `https://{domain}.auth0.com/.well-known/openid-configuration` |
| Keycloak | `https://{host}/realms/{realm}/.well-known/openid-configuration` |
{: .table .table-bordered .table-striped }

SSO credentials (client ID, client secret) are encrypted at rest. Configure SSO in the Admin UI under **Settings** > **SSO**, or see the [Admin UI Guide](admin-ui.html) for details.

### Tenant Admin Token

Each tenant has an `admin_token` field used for programmatic API access. This token is separate from principal tokens and grants tenant-level management capabilities.

### Principal Token

Principals (advertisers and buying agents) authenticate using tokens sent in request headers:

| Header | Format | Example |
| --- | --- | --- |
| `x-adcp-auth` | Raw token string | `x-adcp-auth: abc123def456` |
| `Authorization` | `Bearer <token>` | `Authorization: Bearer abc123def456` |
{: .table .table-bordered .table-striped }

Either header is accepted. The `x-adcp-auth` header takes precedence if both are present.

## Token Management

### How Tokens Are Stored

Auth tokens are **hashed** before storage in the database. The original plaintext token is displayed only once -- at creation time -- and cannot be retrieved afterward.

### Token Lifecycle

| Action | Method | Effect |
| --- | --- | --- |
| Create | Admin UI or API | Generates a new token, displays it once, stores the hash |
| Rotate | Admin UI > Regenerate Token | Invalidates the old hash, creates a new token |
| Expire | Set `auth_token_expires_at` | Token automatically rejected after the expiry timestamp |
| Revoke | Delete the token via Admin UI | Immediately invalidates access |
{: .table .table-bordered .table-striped }

### Token Expiry

The `auth_token_expires_at` field on the principal record sets an expiry time for the token. After this timestamp, the token is rejected even if the hash matches. This provides automatic credential rotation without manual intervention.

<div class="alert alert-info" role="alert">
Always set token expiry for production deployments. Tokens without expiry remain valid indefinitely until manually revoked.
</div>

## Encryption at Rest

### Fernet Symmetric Encryption

The Sales Agent uses Fernet symmetric encryption (from the `cryptography` library) to encrypt sensitive fields before they are stored in the database. This provides authenticated encryption -- data is both encrypted and integrity-protected.

### ENCRYPTION_KEY

The `ENCRYPTION_KEY` environment variable holds the Fernet key used for all encryption operations. If not provided, a key is auto-generated on first run.

Generate a key manually:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

<div class="alert alert-info" role="alert">
<strong>Critical</strong>: The <code>ENCRYPTION_KEY</code> is required to decrypt all encrypted fields. If this key is lost, encrypted data (API keys, OAuth credentials, webhook secrets) cannot be recovered. Store the key in a secure vault or secrets manager, and include it in your backup strategy.
</div>

### Encrypted Fields

The following fields are encrypted before database storage:

| Field | Location | Purpose |
| --- | --- | --- |
| `gemini_api_key` | Tenant settings | Per-tenant Gemini API key for AI features |
| OAuth client secret | SSO configuration | OIDC provider client secrets |
| Webhook secrets | Tenant settings | Slack and delivery webhook authentication secrets |
{: .table .table-bordered .table-striped }

All other data (product definitions, media buys, audit logs) is stored unencrypted in PostgreSQL and protected by database-level access controls.

## Multi-Tenant Isolation

When `ADCP_MULTI_TENANT=true`, tenant isolation is enforced at the application layer through several mechanisms.

### Composite Primary Keys

Database tables that hold tenant-specific data use composite primary keys that include `tenant_id`. This ensures that records from different tenants cannot collide.

### Tenant-Scoped Queries

Every database query includes a `WHERE tenant_id = :tenant_id` clause. The tenant ID is resolved from the request's `Host` header (subdomain routing) and injected into the query context by middleware.

### No Cross-Tenant Data Access

The `UnifiedAuthMiddleware` (ASGI middleware) resolves the tenant from the request and creates an `AuthContext` that is passed through the entire request lifecycle. Business logic functions receive a `ResolvedIdentity` object that is always scoped to a single tenant. There is no API endpoint that returns data across tenants except for super admin tenant management.

### Request Flow

```text
Request → Host header → Subdomain extraction → Tenant resolution
       → Token validation (scoped to resolved tenant)
       → AuthContext created (tenant_id + principal_id)
       → ResolvedIdentity passed to business logic
       → All queries filtered by tenant_id
```

## Network Security

### Nginx Reverse Proxy

In Docker deployments, nginx sits in front of the application and provides:

- **TLS termination**: HTTPS with configurable certificates
- **CORS**: Cross-origin request filtering
- **Rate limiting**: Request rate limits to prevent abuse
- **Request buffering**: Protection against slow-client attacks
- **Header injection**: `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`

### Port Exposure

Only port 8000 (nginx) should be exposed to the public internet. Internal ports are:

| Port | Service | Exposure |
| --- | --- | --- |
| 8000 | nginx | Public (external traffic) |
| 8080 | FastAPI unified app | Internal (Docker network only) |
| 5432 | PostgreSQL | Internal (Docker network only) |
{: .table .table-bordered .table-striped }

{: .alert.alert-info :}
As of v1.5.0, all protocols (MCP, A2A, REST, Admin UI) are served by a single FastAPI process on port 8080. Ports 8001 and 8091 from the legacy multi-process architecture are no longer used.

### Cloud Deployments

On Fly.io and Cloud Run, TLS termination and load balancing are handled by the platform. Set `SKIP_NGINX=true` and let the platform manage network security.

## Super Admin Access

Super admin access is controlled entirely through environment variables and checked at authentication time.

### Configuration

```bash
# Specific email addresses
SUPER_ADMIN_EMAILS=alice@corp.com,bob@corp.com

# All users at these domains
SUPER_ADMIN_DOMAINS=corp.com,platform.io
```

### Security Considerations

- Use `SUPER_ADMIN_EMAILS` for the tightest control -- only named individuals receive super admin access.
- Use `SUPER_ADMIN_DOMAINS` cautiously -- anyone with an email at the listed domain can gain super admin access if they authenticate via SSO.
- In multi-tenant mode, super admins are the only users who can access data across tenants.
- Super admin status is not stored in the database -- it is evaluated at request time from the environment variables.

## Audit Trail

Every operation is logged in the `audit_logs` table, providing a complete trail for security review and compliance.

### Audit Log Schema

| Column | Type | Description |
| --- | --- | --- |
| `log_id` | String | Unique log entry identifier |
| `tenant_id` | UUID | Tenant where the operation occurred |
| `operation` | String | Operation name (e.g., `create_media_buy`, `update_product`) |
| `principal_id` | UUID | The principal (advertiser) who performed the action |
| `principal_name` | String | Display name of the principal |
| `adapter_id` | String | The ad server adapter involved |
| `success` | Boolean | Whether the operation succeeded |
| `details` | JSON | Structured data about the operation |
| `error` | String | Error message if the operation failed |
| `ip_address` | String | Source IP address of the request |
| `created_at` | Timestamp | When the operation occurred |
{: .table .table-bordered .table-striped }

See [Monitoring & Audit Logging](monitoring.html) for querying and alerting on audit data.

## Production Hardening Checklist

Use this checklist before deploying to production:

| Item | Action | Priority |
| --- | --- | --- |
| Disable test mode | Set `ADCP_AUTH_TEST_MODE=false` | Critical |
| Set encryption key | Set `ENCRYPTION_KEY` to a strong Fernet key; back it up securely | Critical |
| Configure SSO | Set up OIDC provider (Google, Microsoft, Okta, Auth0, or Keycloak) | Critical |
| Enable HTTPS | Configure TLS certificates on nginx, Fly.io, or Cloud Run | Critical |
| Set super admin emails | Set `SUPER_ADMIN_EMAILS` to specific trusted email addresses | Critical |
| Configure CORS | Restrict allowed origins in nginx configuration | High |
| Enable audit logging | Verify `audit_logs` table is being populated (enabled by default) | High |
| Set token expiry | Configure `auth_token_expires_at` on all principal tokens | High |
| Database backups | Configure automated `pg_dump` or managed database backups | High |
| Secure ENCRYPTION_KEY | Store in a secrets manager (AWS Secrets Manager, GCP Secret Manager, Vault) | High |
| Rotate default passwords | Change all default database and service passwords | High |
| Restrict port exposure | Only expose port 8000 (nginx) externally | Medium |
| Enable Slack audit webhooks | Set `slack_audit_webhook_url` for security event notifications | Medium |
| Review advertising policies | Configure blocked categories, tactics, and brands | Medium |
| Set DATABASE_QUERY_TIMEOUT | Keep at 30s or lower to prevent long-running queries | Medium |
{: .table .table-bordered .table-striped }

## Next Steps

- [Monitoring & Audit Logging](monitoring.html) -- health checks, structured logging, and alerting
- [Admin UI Guide](admin-ui.html) -- SSO setup and user management
- [Multi-Tenant Deployment](../deployment/multi-tenant.html) -- tenant isolation in practice
- [Deployment Overview](../deployment/deployment-overview.html) -- platform-specific security configuration
