---
layout: page_v2
title: Prebid Sales Agent - Glossary
description: Definitions of key terms used in Sales Agent documentation.
sidebarType: 10
---

# Prebid Sales Agent - Glossary
{: .no_toc}

- TOC
{:toc}

## A

### A2A (Agent-to-Agent Protocol)

A JSON-RPC 2.0 based protocol for autonomous agent-to-agent communication. The Sales Agent uses A2A as a transport layer alongside MCP, enabling other AI agents to discover and invoke tools without human intervention.

### AdCP (Ad Context Protocol)

An open standard that normalizes how AI agents interact with advertising platforms. AdCP defines tools for product discovery, media buying, creative management, and signal activation, providing a unified interface regardless of the underlying ad server.

### Adapter

An implementation of the `AdServerAdapter` interface that translates Sales Agent operations into ad server-specific API calls. Available adapters include GAM, Kevel, Triton Digital, Broadstreet, and Mock.

### AdapterCapabilities

A dataclass describing what features a specific adapter supports, such as inventory sync, geo targeting, dynamic products, and webhooks. Agents can query capabilities via `get_adcp_capabilities` to understand what a publisher's ad server supports.

### AgentCard

An A2A discovery document served at `/.well-known/agent-card.json` that describes an agent's capabilities, supported tools, and authentication requirements. Buyer agents use the AgentCard to learn how to interact with a Sales Agent instance.

### Audit Log

A record in the `audit_logs` database table tracking every operation performed against the system. Each entry includes the tenant, principal, operation type, success status, and structured details for compliance and debugging.

## B

### Brief

A natural language description of advertising needs passed to the `get_products` tool for AI-powered product matching and ranking. The brief allows buyer agents to describe campaign goals in plain language rather than specifying exact targeting parameters.

## C

### Creative

An advertising asset such as an image, video, HTML snippet, or audio file uploaded via the `sync_creatives` tool. Creatives are subject to format validation and optional approval workflows before they can serve in campaigns.

### Creative Agent

An external service that provides creative format specifications for a tenant. Creative agents are registered per-tenant in the Admin UI and queried by the `list_creative_formats` tool to return available ad formats.

## D

### Delivery Measurement

A configuration specifying how campaign delivery is measured and reported. Each product defines a measurement provider that determines how impressions, clicks, and other metrics are tracked.

### Dynamic Product

A product template with `is_dynamic` set to `true` that automatically generates targeted variants by querying signals agents based on buyer briefs. Dynamic products combine a base product definition with real-time audience data to create tailored offerings.

## F

### Fernet Encryption

Symmetric encryption used to protect sensitive database fields such as API keys and OAuth credentials. Configured via the `ENCRYPTION_KEY` environment variable, Fernet ensures that secrets are encrypted at rest in the database.

### Flight Dates

The start and end dates of a media buy campaign, specified as `flight_start_date` and `flight_end_date`. Flight dates define the active delivery window for all packages within a media buy.

### Format ID

A namespaced creative format identifier consisting of two parts: `agent_url` (the creative agent endpoint) and `id` (the format name within that agent). This namespacing allows multiple creative agents to define formats without name collisions.

## H

### HITL (Human-in-the-Loop)

An approval workflow where a human publisher reviews and approves or rejects media buys or creatives before they go live. HITL is managed through the Admin UI workflow queue and optional Slack notifications via `hitl_webhook_url`, and can be configured per-tenant.

## M

### MCP (Model Context Protocol)

A protocol for AI assistant tool integration that the Sales Agent uses as its primary interface. The Sales Agent implements MCP via FastMCP with StreamableHTTP transport, allowing AI assistants to discover and invoke tools through a standardized protocol.

### Media Buy

A campaign booking that includes one or more packages, a total budget, flight dates, and targeting parameters. Media buys are created via `create_media_buy` and progress through status transitions from draft to live to completed.

## P

### Package

A line item within a media buy that is linked to a specific product. Each package has its own budget allocation, targeting overlay, and creative assignments, allowing a single media buy to span multiple products or audiences.

### Pacing Index

A metric ranging from 0.0 to 2.0+ that indicates delivery speed relative to the allocated budget. A value of 1.0 means the campaign is on pace, values below 1.0 indicate under-delivery, and values above 1.0 indicate over-delivery.

### Pricing Option

A pricing model attached to a product, such as CPM at $15.00 or CPC at $2.50. Products can have multiple pricing options, giving buyers flexibility in how they pay for inventory.

### Principal

An advertiser or buyer entity within a tenant. Principals authenticate via tokens, own media buys and creatives, and have scoped permissions that control which operations they can perform.

### Provenance

AI content metadata for EU AI Act Article 50 compliance. Provenance tracks the digital source type, AI tool used, human oversight status, and C2PA manifests to ensure transparency about AI-generated or AI-assisted advertising content.

## R

### ResolvedIdentity

The internal identity object created after token authentication, containing `tenant_id`, `principal_id`, and permissions. All `_impl` functions receive a `ResolvedIdentity` to enforce authorization and tenant isolation.

## S

### Signals Agent

An external service that provides audience segments and targeting data to the Sales Agent. Products can be configured with `signals_agent_ids` to query signals agents for dynamic variant generation based on buyer briefs.

### Strategy

A configuration object for campaign simulation and testing scenarios, used primarily with the Mock adapter. Strategies allow developers to define predictable delivery patterns for integration testing.

### Super Admin

A platform-level administrator with access to all tenants in a multi-tenant deployment. Super admins are configured via `SUPER_ADMIN_EMAILS` and `SUPER_ADMIN_DOMAINS` environment variables and can manage any tenant's configuration.

## T

### Targeting Overlay

Per-package targeting specifications that layer on top of a product's default targeting template. Targeting overlays support geo, device, audience, and custom dimensions, allowing buyers to refine a product's built-in targeting for their specific campaign needs.

### Tenant

The primary isolation boundary in a multi-tenant deployment. Each publisher gets their own tenant with separate products, principals, configuration, and data, ensuring complete separation between publishers on the same platform.

### ToolContext

The FastMCP context object passed to MCP tool handlers. `ToolContext` contains request metadata -- including authentication headers -- used to resolve the caller's identity into a `ResolvedIdentity`.

### Transport Parity

The architectural principle that all transports (MCP, A2A, REST) call the same `_impl` functions, ensuring identical behavior regardless of how a tool is invoked. This principle is enforced by structural test guards that verify all transports share the same code path.

## W

### Workflow Step

A task in the human-in-the-loop approval system. Workflow steps have types such as `creative_approval` and `manual_approval`, and progress through states including `pending`, `completed`, and `failed`. They are managed through the Admin UI workflow queue.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) -- System design and protocol details
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of all MCP tools
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Get running in 2 minutes
- [API Schema Reference](/agents/salesagent/schemas/api-schemas.html) -- Pydantic model definitions
- [Database Models](/agents/salesagent/schemas/database-models.html) -- SQLAlchemy model reference
