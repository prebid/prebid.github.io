---
layout: page_v2
title: Prebid Sales Agent - Admin UI Guide
description: Complete guide to the Prebid Sales Agent Admin UI for managing tenants, products, advertisers, and configuration
sidebarType: 10
---

# Prebid Sales Agent - Admin UI Guide
{: .no_toc}

- TOC
{:toc}

## Overview

The Admin UI is a Flask-based web application that provides a graphical interface for managing every aspect of the Prebid Sales Agent. It is served at the `/admin` path and supports per-tenant OIDC SSO (Google, Microsoft, Okta, Auth0, Keycloak) in production or test mode for development.

The Admin UI is composed of approximately 26 blueprints, each responsible for a functional area:

| Blueprint | Purpose |
| --- | --- |
| tenants | Tenant creation and management |
| products | Product catalog management |
| creatives | Creative format and asset management |
| media_buys | Media buy monitoring and management |
| principals | Advertiser (principal) management |
| adapters | Ad server adapter configuration |
| settings | Tenant-level settings and preferences |
| users | User management and roles |
| activity_stream | SSE-powered live event feed |
| workflows | Approval workflow management |
| signals_agents | External audience signal source configuration |
| creative_agents | External creative format provider configuration |
| authorized_properties | Publisher domain and property management |
| inventory | Ad inventory management |
| inventory_profiles | Reusable inventory configuration profiles |
| oidc | SSO / OIDC provider configuration |
| operations | Operational tools and maintenance |
| policy | Advertising policy management |
| public | Public-facing tenant landing pages |
| gam | Google Ad Manager-specific tools |
| format_search | Creative format search and discovery |
| publisher_partners | Publisher partner management |
| schemas | Schema viewing and validation |
{: .table .table-bordered .table-striped }

## Accessing the Admin UI

### URL

The Admin UI is available at the `/admin` path of your deployment:

- **Docker**: `http://localhost:8000/admin` (via nginx)
- **Fly.io**: `https://your-app.fly.dev/admin`
- **Cloud Run**: `https://your-service-url.run.app/admin`
- **Multi-tenant**: `https://tenant.yourdomain.com/admin`

### Authentication Methods

| Method | When to Use | Configuration |
| --- | --- | --- |
| Test Mode | Development and initial setup | Set `ADCP_AUTH_TEST_MODE=true` |
| Per-Tenant OIDC | Production | Configure via Admin UI > Settings > SSO |
| Per-Tenant OIDC | Production multi-tenant | Configure via Admin UI > Settings > SSO |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
In test mode, the Admin UI allows login without OAuth credentials. Never enable test mode in production -- set <code>ADCP_AUTH_TEST_MODE=false</code> and configure a proper SSO provider.
</div>

## Dashboard

The dashboard is the landing page after login. It provides:

- **Real-time activity stream**: An SSE (Server-Sent Events) powered live feed showing operations as they happen -- media buy creation, approval workflows, creative uploads, and more
- **Summary metrics**: Active media buys, pending approvals, advertiser count, and recent activity
- **Quick actions**: Links to common tasks like creating products, managing advertisers, and viewing pending workflows

The activity stream updates in real time without page refreshes, using the `business_activity_service` to push events to connected browsers.

## Product Catalog Management

Navigate to **Products** to manage the publisher's ad product catalog. Products define what AI buying agents can purchase.

### Creating a Product

1. Click **Create Product**
2. Fill in the required fields:
   - **Name**: Display name shown to buying agents
   - **Description**: Natural language description of the product
   - **Pricing**: CPM, flat rate, or custom pricing options
   - **Format IDs**: Supported creative format identifiers
   - **Targeting**: Available targeting options (geo, audience, contextual)
   - **Flight dates**: Default minimum and maximum campaign durations
3. Save the product

### Product Fields

| Field | Description |
| --- | --- |
| Name | Product display name |
| Description | Natural language description for AI agents |
| Pricing Options | CPM, flat rate, sponsorship, or custom models |
| Format IDs | Linked creative format specifications |
| Targeting | Geographic, audience, contextual, and device targeting options |
| Min/Max Flight | Default campaign duration constraints |
| Active | Whether the product appears in catalog queries |
{: .table .table-bordered .table-striped }

Products are returned by the `get_products` tool when AI agents query the catalog. The description field is particularly important as AI agents use it to understand what the product offers.

## Advertiser Management

Navigate to **Advertisers** to manage principals (advertisers and buying agents).

### Creating an Advertiser

1. Click **Create Advertiser**
2. Enter:
   - **Name**: Advertiser or agency name
   - **Contact information**: Email, company details
   - **Adapter mappings**: Identifiers in the connected ad server (e.g., GAM advertiser ID)
3. Save and **Generate Auth Token**

<div class="alert alert-info" role="alert">
Auth tokens are displayed only once at creation time. The token is hashed before storage and cannot be retrieved later. Copy and securely store the token immediately.
</div>

### Token Management

- **Generate new token**: Invalidates the previous token and creates a new one
- **Set expiry**: Configure `auth_token_expires_at` to auto-expire tokens
- **Revoke access**: Delete the token to immediately revoke API access

## Ad Server Settings

Navigate to **Settings** > **Ad Server** to configure the ad server adapter.

### Available Adapters

| Adapter | Description |
| --- | --- |
| GAM | Google Ad Manager (DFP) |
| Kevel | Kevel (formerly Adzerk) ad serving platform |
| Triton | Triton Digital audio ad serving |
| Broadstreet | Broadstreet local ad management |
| Mock | Test adapter for development (no real ad server) |
{: .table .table-bordered .table-striped }

### Configuring GAM

1. Select **GAM** as the adapter
2. Enter your GAM network code
3. Provide OAuth client credentials (`GAM_OAUTH_CLIENT_ID`, `GAM_OAUTH_CLIENT_SECRET`)
4. If using a service account, upload the JSON key file or set `GOOGLE_APPLICATION_CREDENTIALS`
5. Test the connection to verify access

## SSO Configuration

Navigate to **Settings** > **SSO** to configure single sign-on for the Admin UI.

### Supported Providers

| Provider | Setup Steps |
| --- | --- |
| Google | Create OAuth 2.0 credentials in Google Cloud Console; set authorized redirect URI to `https://yourdomain.com/admin/oidc/callback` |
| Microsoft / Entra ID | Register an application in Azure AD; set redirect URI; note client ID and tenant ID |
| Okta | Create an OIDC application in Okta admin; set redirect URI; note client ID and Okta domain |
| Auth0 | Create a Regular Web Application in Auth0; set callback URL; note domain, client ID, and secret |
| Keycloak | Create a client in your Keycloak realm; set redirect URI; note realm URL, client ID, and secret |
{: .table .table-bordered .table-striped }

### Configuration Fields

For each provider, enter:

- **Provider type**: Select from the dropdown
- **Client ID**: OAuth client identifier
- **Client Secret**: OAuth client secret (encrypted at rest)
- **Discovery URL**: OIDC discovery endpoint (auto-populated for common providers)
- **Allowed domains**: Restrict login to specific email domains

### Provider-Specific Requirements

| Provider | Required Fields |
| --- | --- |
| Google | Client ID, Client Secret (from Google Cloud Console OAuth 2.0 credentials) |
| Microsoft / Entra ID | Client ID, Client Secret, Tenant ID (from Azure AD app registration) |
| Okta | Client ID, Client Secret, Okta Domain (from Okta admin console) |
| Auth0 | Client ID, Client Secret, Auth0 Domain (from Auth0 dashboard) |
| Keycloak | Client ID, Client Secret, Keycloak URL, Realm Name |
{: .table .table-bordered .table-striped }

Configuration is stored encrypted in the `auth_config` table. Super admin access bypasses SSO and is configured via the `SUPER_ADMIN_EMAILS` environment variable.

## User Management

Navigate to **Users** to manage who can access the Admin UI.

### Roles

| Role | Permissions |
| --- | --- |
| Admin | Full access to all settings, products, advertisers, and configuration |
| Editor | Create and edit products, advertisers, and media buys; cannot change settings |
| Viewer | Read-only access to all sections |
{: .table .table-bordered .table-striped }

### Managing Users

1. Click **Invite User**
2. Enter the user's email address
3. Select a role
4. The user receives access on their next login via SSO

## Workflow Approvals

Navigate to **Operations** > **Workflows** to view and manage pending approval tasks.

The Admin UI provides a workflow approval interface for human-in-the-loop operations. Workflows are triggered when operations exceed configured thresholds (e.g., budget limits, new advertiser onboarding) or when advertising policy violations are detected.

### Viewing Pending Tasks

Each pending task displays:

| Field | Description |
| --- | --- |
| Step Type | The kind of approval needed (e.g., `media_buy_approval`, `creative_review`) |
| Assignee / Owner | The principal who owns this workflow step |
| Request Data | The original request payload that triggered the workflow |
| Creation Date | When the workflow step was created |
{: .table .table-bordered .table-striped }

### Workflow Actions

| Action | Effect |
| --- | --- |
| Approve | The pending operation proceeds and the media buy is created in the ad server. |
| Reject | The operation is cancelled and the buying agent is notified. |
| Request Changes | The buying agent receives feedback and can resubmit |
{: .table .table-bordered .table-striped }

When `hitl_webhook_url` is configured on the tenant, approval requests are also sent to Slack for notification.

### Approval Behavior Configuration

Configure approval behavior per-tenant under **Settings**:

| Setting | Description |
| --- | --- |
| `approval_mode` | `"require-human"` (all media buys need approval) or `"auto-approve"` |
| `creative_auto_approve_threshold` | AI confidence score above which creatives are auto-approved (default: `0.9`) |
| `creative_auto_reject_threshold` | AI confidence score below which creatives are auto-rejected (default: `0.1`) |
{: .table .table-bordered .table-striped }

When creative review scores fall between the two thresholds, the creative is routed to human review in the workflow queue.

## Inventory Profiles

Navigate to **Settings** > **Inventory Profiles** to create reusable ad server inventory configurations.

Inventory profiles are templates that define where ads can appear. They bundle format IDs, publisher properties, and placement rules into named configurations that products can reference via the `inventory_profile_id` foreign key. This saves time when multiple products share the same inventory configuration -- instead of duplicating settings across products, you configure the inventory once and link it.

Inventory profiles are primarily used with the GAM adapter for mapping to specific ad units and placements.

### Creating a Profile

1. Click **Create Profile**
2. Name the profile (e.g., "Homepage Leaderboard", "ROS Display")
3. Define the profile fields:
   - **Format IDs**: Supported creative format identifiers for this inventory
   - **Publisher Properties**: Property configurations describing where ads will serve
4. Save the profile
5. Link the profile to one or more products (in the product editor, select the profile from the **Inventory Profile** dropdown)

## Creative Agents

Navigate to **Settings** > **Creative Agents** to configure external creative format providers.

Creative agents are external services that define creative format specifications. When a buying agent calls `list_creative_formats`, the Sales Agent queries all enabled creative agents and aggregates the results. Format IDs returned use the pattern `{agent_url}/{format_id}` (the FormatId schema), which uniquely identifies each format across agents.

### Registering a Creative Agent

1. Click **Add Creative Agent**
2. Enter the required fields:
   - **Agent Name**: A unique identifier for this creative agent
   - **Endpoint URL**: The URL providing format specs
   - **Enabled**: Toggle to activate or deactivate the agent
3. Configure authentication (API key or bearer token)
4. Test the connection to verify format specs are returned correctly
5. Save

## Signals Agents

Navigate to **Settings** > **Signals Agents** to configure external audience signal sources.

Signals agents are external services that provide audience segments for targeting. They enrich the Sales Agent's capabilities by providing additional data for targeting and optimization. The system queries all enabled signals agents and aggregates the results when dynamic products generate targeted variants based on buyer briefs.

### Registering a Signals Agent

1. Click **Add Signals Agent**
2. Enter the required fields:
   - **Agent Name**: A unique identifier for this signals agent
   - **Endpoint URL**: The URL where the signals agent API is hosted
   - **Enabled**: Toggle to activate or deactivate the agent
3. Configure authentication (API key or bearer token)
4. Define the signal types provided (audience, contextual, behavioral)
5. **Test connectivity** before enabling in production to verify the agent responds correctly
6. Save

<div class="alert alert-info" role="alert">
Multiple signals agents can be configured per tenant. The system queries all enabled agents in parallel and merges the results. Disable an agent rather than deleting it if you need to temporarily remove it from the query pool.
</div>

## Advertising Policies

Navigate to **Settings** > **Advertising Policy** to configure advertising policies that control what can be sold and to whom.

Publishers can define content policies that restrict what advertisers can promote. The system enforces these policies automatically when AI buying agents create or update media buys.

### Policy Types

| Policy | Description |
| --- | --- |
| Blocked Categories | Product/service categories not allowed (e.g., gambling, tobacco). Mapped to IAB content categories. |
| Blocked Tactics | Advertising techniques not permitted (e.g., pop-ups, auto-play audio). |
| Blocked Brands | Specific brands or advertisers not allowed. |
| Budget Thresholds | Maximum budget amounts before approval is required |
| Approval Rules | Conditions that trigger human-in-the-loop approval workflows |
{: .table .table-bordered .table-striped }

### Policy Enforcement

The Policy Agent (AI) automatically checks new media buys against these policies. Each check produces one of three status outcomes:

- **allowed** -- The media buy complies with all policies and proceeds normally
- **restricted** -- The media buy may violate a policy and needs human review (routed to workflow approvals)
- **blocked** -- The media buy clearly violates a policy and is rejected

Violations trigger workflow approval tasks, giving publishers human-in-the-loop control over edge cases.

## Tenant Settings

Navigate to **Settings** to configure tenant-level preferences.

### Available Settings

| Setting | Description |
| --- | --- |
| Naming Templates | Templates for auto-naming entities in the ad server (orders, line items, creatives). Supports variable interpolation. |
| Measurement Providers | Third-party measurement and verification providers |
| Favicon | Custom favicon for the tenant's Admin UI and landing pages |
| Product Ranking Prompt | Custom prompt used by AI to rank products for relevance |
| Slack Webhooks | `slack_webhook_url` (general), `slack_audit_webhook_url` (audit), `hitl_webhook_url` (approval requests) |
{: .table .table-bordered .table-striped }

## Audit Log Viewer

Navigate to **Activity** to view the audit trail.

Every operation performed through the Sales Agent (via MCP, A2A, REST API, or Admin UI) is logged in the `audit_logs` table. The Admin UI provides a filterable, searchable view of this log.

### Audit Log Fields

| Field | Description |
| --- | --- |
| Timestamp | When the operation occurred |
| Operation | The action performed (e.g., `create_media_buy`, `update_product`) |
| Principal | The advertiser or user who performed the action |
| Adapter | The ad server adapter involved |
| Success | Whether the operation succeeded |
| Details | Structured details about the operation |
| Error | Error message if the operation failed |
| IP Address | Source IP of the request |
{: .table .table-bordered .table-striped }

See [Monitoring & Audit Logging](monitoring.html) for more details on the audit system.

## Next Steps

- [Security Model](security.html) -- authentication layers and access control
- [Monitoring & Audit Logging](monitoring.html) -- health checks, logging, and alerting
- [Deployment Overview](../deployment/deployment-overview.html) -- deployment options and configuration
