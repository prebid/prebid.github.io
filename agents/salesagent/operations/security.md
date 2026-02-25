---
layout: page_v2
title: Prebid Sales Agent - Operations - Security Model
description: Authentication, encryption, access control, and security architecture of the Prebid Sales Agent
sidebarType: 10
---

# Security Model
{: .no_toc}

This page documents the security architecture of the Prebid Sales Agent, covering authentication mechanisms, principal resolution, multi-tenant access control, encryption, audit logging, and operational security practices.

- TOC
{:toc}

## Authentication Mechanisms

The Sales Agent uses three distinct authentication mechanisms depending on the interface being accessed.

### MCP Authentication

AI agents connecting via the Model Context Protocol authenticate using the `x-adcp-auth` header. Each principal (advertiser) receives a unique token generated through the Admin UI.

```bash
curl -H "x-adcp-auth: <principal-token>" https://yourdomain.com/mcp/
```

The token is a per-principal credential that maps the request to a specific advertiser and tenant. All MCP tool calls require this header.

### A2A Authentication

Agent-to-Agent protocol requests use standard `Authorization: Bearer` token authentication:

```bash
curl -H "Authorization: Bearer <principal-token>" https://yourdomain.com/a2a
```

The same principal token works for both MCP and A2A authentication, but the header format differs.

### Admin UI Authentication

The Admin UI supports two authentication modes:

{: .table .table-bordered .table-striped }
| Mode | Mechanism | Use Case |
|------|-----------|----------|
| **Setup Mode** | Password (`test123`) | Initial setup and evaluation only |
| **OAuth SSO** | Google, Microsoft, Okta, Auth0, Keycloak | Production deployments |

{: .alert.alert-danger :}
Setup Mode password authentication (`ADCP_AUTH_TEST_MODE=true`) must never be used in production. It enables well-known credentials that grant full administrative access.

Supported OAuth providers:

{: .table .table-bordered .table-striped }
| Provider | Protocol | Configuration |
|----------|----------|---------------|
| Google | OAuth 2.0 / OpenID Connect | Client ID, Client Secret |
| Microsoft | OAuth 2.0 / OpenID Connect | Client ID, Client Secret, Tenant ID |
| Okta | OAuth 2.0 / OpenID Connect | Client ID, Client Secret, Domain |
| Auth0 | OAuth 2.0 / OpenID Connect | Client ID, Client Secret, Domain |
| Keycloak | OAuth 2.0 / OpenID Connect | Client ID, Client Secret, Realm, Server URL |

## Principal Resolution Flow

When an API request arrives, the Sales Agent resolves the principal through a chain that maps the token to a tenant and adapter configuration:

```text
┌────────────────┐    ┌─────────────┐    ┌────────────┐    ┌─────────────┐
│  Auth Token    │───▶│  Principal   │───▶│   Tenant   │───▶│   Adapter   │
│  (header)      │    │  (advertiser)│    │ (publisher) │    │ (ad server) │
└────────────────┘    └─────────────┘    └────────────┘    └─────────────┘
```

1. **Token** -- Extracted from the `x-adcp-auth` or `Authorization: Bearer` header
2. **Principal** -- Looked up in the database by token hash; identifies the advertiser
3. **Tenant** -- The publisher tenant that the principal belongs to; provides configuration context
4. **Adapter** -- The ad server integration configured for the tenant (e.g., GAM, Mock)

This resolution chain ensures every API request is scoped to a specific advertiser operating within a specific publisher's context, using the correct ad server integration.

{: .alert.alert-info :}
Tokens are stored as hashes in the database, not in plaintext. The original token value is shown only once at generation time.

## Multi-Tenant Access Control

In multi-tenant deployments, the Sales Agent enforces strict data isolation between publishers.

### Composite Identity Constraint

Tenant isolation is enforced at the database level through a composite `(tenant_id, email)` constraint. This ensures:

- Each tenant's data is isolated from all other tenants
- A user with the same email across multiple tenants has separate, independent identities
- Database queries are automatically scoped to the authenticated tenant

### Role-Based Permissions

{: .table .table-bordered .table-striped }
| Role | Scope | Capabilities |
|------|-------|-------------|
| **Super Admin** | All tenants | Create/deactivate tenants, manage cross-tenant settings, view all activity |
| **Tenant Admin** | Single tenant | Manage products, advertisers, creatives, workflows, and settings for their tenant |
| **Principal** | Single tenant, limited | Submit media buys and creatives, view own campaigns and delivery data |

### Cross-Tenant Protection

The following safeguards prevent cross-tenant data access:

- All database queries include `tenant_id` in their WHERE clause
- Principal tokens are scoped to a single tenant and cannot access other tenants' data
- Admin UI sessions are bound to a specific tenant context
- API responses never include data from other tenants
- Subdomain routing ensures requests are directed to the correct tenant

## Encryption

### Fernet Symmetric Encryption

The Sales Agent uses [Fernet symmetric encryption](https://cryptography.io/en/latest/fernet/) (from the Python `cryptography` library) to protect sensitive data at rest. Fernet provides authenticated encryption using AES-128-CBC with HMAC-SHA256.

Encrypted fields include:

{: .table .table-bordered .table-striped }
| Data | Location | Purpose |
|------|----------|---------|
| Principal API tokens | `principals` table | Advertiser authentication credentials |
| Ad server credentials | `adapter_config` table | GAM service account keys, API keys |
| OAuth client secrets | `sso_config` table | Identity provider credentials |

### Encryption Key Management

The `ENCRYPTION_KEY` environment variable holds the Fernet key used for all encryption operations.

```bash
# Generate a new Fernet key
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

{: .alert.alert-danger :}
The `ENCRYPTION_KEY` is the root secret for the entire deployment. If lost, all encrypted data becomes unrecoverable. Store it securely (e.g., in a secrets manager) and back it up separately from the deployment.

Key rotation requires decrypting all data with the old key and re-encrypting with the new key. This is a manual operation -- contact the development team for guidance if key rotation is needed.

## Super Admin

Super admins have cross-tenant administrative privileges and are configured through environment variables.

### Configuration

{: .table .table-bordered .table-striped }
| Variable | Format | Description |
|----------|--------|-------------|
| `SUPER_ADMIN_EMAILS` | Comma-separated emails | Specific email addresses granted super admin access |
| `SUPER_ADMIN_DOMAINS` | Comma-separated domains | All users from these email domains are granted super admin access |

Example:

```bash
SUPER_ADMIN_EMAILS=admin@yourcompany.com,ops@yourcompany.com
SUPER_ADMIN_DOMAINS=yourcompany.com
```

{: .alert.alert-warning :}
Super admin access is a whitelist -- only emails or domains explicitly listed are granted elevated privileges. There is no default super admin. If neither variable is set, no user has cross-tenant access.

### Super Admin Capabilities

- Create and deactivate tenants
- View all tenants and their configurations
- Reactivate deactivated tenants
- Access any tenant's Admin UI
- View cross-tenant audit logs

## HTTPS Requirements

{: .alert.alert-danger :}
HTTPS is mandatory for all production deployments. The Sales Agent enforces HTTPS for all non-localhost connections to protect authentication tokens in transit.

Recommended SSL/TLS configuration:

- Terminate SSL at the Nginx reverse proxy layer
- Use Let's Encrypt for automatic certificate management
- Enforce TLS 1.2 or higher
- Enable HSTS headers

For localhost development (`http://localhost:8000`), HTTPS enforcement is relaxed to allow evaluation without certificate setup.

## Token Lifecycle

Principal tokens follow a defined lifecycle managed entirely through the Admin UI:

### Generation

1. Navigate to **Advertisers** in the Admin UI
2. Select or create a principal
3. Click **Generate Token**
4. Copy the token immediately -- it is displayed only once

The token is hashed before storage. The plaintext value cannot be retrieved after generation.

### Rotation

To rotate a token (e.g., if compromised or as part of regular security hygiene):

1. Navigate to the principal in the Admin UI
2. Click **Rotate Token**
3. The old token is immediately invalidated
4. A new token is generated and displayed once
5. Share the new token with the advertiser's agent operator

{: .alert.alert-warning :}
Token rotation is immediate. The old token stops working as soon as the new token is generated. Coordinate with the advertiser before rotating to avoid disrupting active campaigns.

### Revocation

To revoke access without generating a replacement token:

1. Navigate to the principal in the Admin UI
2. Click **Revoke Token**
3. All API access for this principal is immediately blocked

Revoked principals can have new tokens generated later if access needs to be restored.

## Audit Logging

The Sales Agent maintains a detailed audit log backed by the PostgreSQL database. Every significant operation is recorded for compliance, debugging, and security analysis.

### Tracked Operations

{: .table .table-bordered .table-striped }
| Category | Events |
|----------|--------|
| **Authentication** | Login attempts, token usage, failed authentication, SSO callbacks |
| **Media Buys** | Submissions, approvals, rejections, modifications |
| **Creatives** | Uploads, approval/rejection, format validation results |
| **Products** | Creation, modification, deletion, pricing changes |
| **Advertisers** | Principal creation, token generation/rotation/revocation |
| **Configuration** | Adapter changes, SSO updates, domain changes, tenant settings |
| **Security** | Cross-tenant access attempts, unauthorized requests, rate limit violations |

### Log Fields

Each audit log entry includes:

{: .table .table-bordered .table-striped }
| Field | Description |
|-------|-------------|
| `timestamp` | UTC timestamp of the event |
| `tenant_id` | Tenant context for the operation |
| `principal_id` | The principal that performed the action (if applicable) |
| `user_email` | The admin user email (for Admin UI actions) |
| `operation` | The operation type (e.g., `media_buy.created`, `creative.approved`) |
| `details` | JSON payload with operation-specific data |
| `ip_address` | Source IP address of the request |

### Security Violation Detection

The audit log captures security-relevant events that can be used to detect unauthorized access patterns:

- Repeated failed authentication attempts
- Requests with invalid or expired tokens
- Attempts to access resources outside the principal's tenant
- Unusual request patterns (volume, timing, endpoint access)

## Tenant Deactivation

Tenant deactivation is a soft delete mechanism that immediately blocks all access while preserving data for potential reactivation.

### What Happens on Deactivation

{: .table .table-bordered .table-striped }
| Aspect | Behavior |
|--------|----------|
| MCP/A2A API access | Immediately blocked for all principals |
| Admin UI access | Blocked for tenant admins |
| Data (campaigns, creatives, logs) | Preserved in database |
| Active campaigns | Stopped in the ad server (adapter-dependent) |
| Public discovery | Tenant removed from agent card listings |

### Reactivation

Only super admins can reactivate a deactivated tenant:

1. Log in as a super admin
2. Navigate to the tenant management page
3. Select the deactivated tenant
4. Click **Reactivate**
5. All API access is restored with existing tokens

{: .alert.alert-info :}
Deactivation does not delete or invalidate tokens. Upon reactivation, existing principal tokens work immediately without regeneration.

## Further Reading

- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Managing authentication, products, and advertisers
- [Single-Tenant Deployment](/agents/salesagent/deployment/single-tenant.html) -- SSL/TLS and Nginx configuration
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Infrastructure requirements
- [AdCP Advanced Topics: Principals & Security](https://docs.adcontextprotocol.org/docs/advanced/principals-security) -- Protocol-level security model
