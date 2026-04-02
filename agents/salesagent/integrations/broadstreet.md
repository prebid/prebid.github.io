---
layout: page_v2
title: Prebid Sales Agent - Broadstreet Integration
description: Configure and use the Broadstreet adapter for local and community publisher ad serving
sidebarType: 10
---

# Prebid Sales Agent - Broadstreet Integration
{: .no_toc}

- TOC
{:toc}

## Overview

The Broadstreet integration connects the Prebid Sales Agent to the [Broadstreet](https://broadstreetads.com/) ad serving platform. Broadstreet is purpose-built for local and community publishers, offering a simplified ad management experience tailored to direct-sold display advertising.

The adapter is identified by `adapter_name: "broadstreet"` and is implemented as a multi-module package under `src/adapters/broadstreet/`.

{: .alert.alert-warning :}
The Broadstreet adapter is in design phase and not yet production-ready. The module structure and API client exist but the integration has not been validated against a live Broadstreet account. Use the [Mock Adapter](/agents/salesagent/integrations/mock-adapter.html) for testing until this adapter reaches production status.

## Prerequisites

Before configuring the Broadstreet integration, ensure you have:

- An active Broadstreet account
- API access credentials from Broadstreet
- Your Broadstreet network configured with zones and advertisers

## Configuration

The Broadstreet adapter is configured through the Admin UI. Navigate to **Settings > Ad Server** and select **Broadstreet** as the adapter type.

Enter your Broadstreet API credentials and network configuration in the adapter config JSONB field. The exact settings required are defined by the adapter's `config_schema.py` module, which validates the configuration on save.

## Architecture

The Broadstreet adapter follows a modular architecture similar to the GAM adapter, with separate components for different responsibilities:

{: .table .table-bordered .table-striped }
| Module | File | Responsibility |
|--------|------|----------------|
| Adapter | `adapter.py` | Main `Broadstreet(AdServerAdapter)` implementation |
| API Client | `client.py` | HTTP client for the Broadstreet API |
| Config Schema | `config_schema.py` | Pydantic validation for adapter configuration |
| Schemas | `schemas.py` | Broadstreet-specific data models and type definitions |
| Managers | `managers/` | Specialized managers for inventory and other operations |

### Request Flow

1. The Sales Agent receives a tool call (e.g., `create_media_buy`).
2. The business logic layer invokes the Broadstreet adapter's corresponding method.
3. The adapter delegates to the appropriate manager module.
4. The manager uses `client.py` to make API calls to Broadstreet.
5. Responses are parsed through `schemas.py` models and returned to the business logic layer.

## Supported Features

### Direct-Sold Display Advertising

The Broadstreet adapter is optimized for the direct-sold advertising workflow that local publishers use:

- **Campaign creation** — Create advertiser campaigns mapped to Broadstreet orders
- **Creative management** — Upload display ad creatives and associate them with campaigns
- **Zone targeting** — Target specific ad zones configured in Broadstreet
- **Delivery reporting** — Pull impression and click metrics from Broadstreet
- **Advertiser management** — Manage advertiser records within Broadstreet

### Capabilities

{: .table .table-bordered .table-striped }
| Capability | Supported | Notes |
|------------|-----------|-------|
| Display Advertising | Yes | Standard banner and display ad formats |
| Zone Targeting | Yes | Target Broadstreet ad zones |
| Geo Targeting | Limited | Basic geographic targeting |
| Inventory Sync | No | Inventory managed in Broadstreet |
| Inventory Profiles | No | Not applicable |
| Custom Targeting | Limited | Zone-based targeting |
| Dynamic Products | No | Products statically configured |
| Frequency Capping | No | Not supported by the adapter |
| Webhooks | No | Use polling for delivery data |

## Use Cases

### Local News Publishers

Broadstreet is widely used by local news organizations that sell advertising directly to local businesses. The Sales Agent integration allows these publishers to:

- Offer their ad inventory to AI buying agents
- Automate campaign setup that would otherwise require manual Broadstreet configuration
- Provide self-service buying for local advertisers through AI-powered interfaces

### Community Media

Community-focused media outlets (neighborhood blogs, hyperlocal news, community radio websites) benefit from Broadstreet's simplicity. The Sales Agent adapter enables:

- Small publishers to participate in the AI-driven advertising ecosystem
- Automated campaign fulfillment without dedicated ad operations staff
- Standardized reporting through the Sales Agent's delivery metrics tools

### Niche Vertical Publishers

Publishers in niche verticals (e.g., local sports, community events, regional business news) that use Broadstreet for its ease of management can extend their reach through the Sales Agent.

## Limitations

{: .table .table-bordered .table-striped }
| Area | Limitation |
|------|-----------|
| Channels | Display only (no video, audio, or native) |
| Targeting | Zone-based and basic geo; no audience or contextual targeting |
| Scale | Designed for small to mid-size publishers; not intended for high-volume programmatic |
| Frequency Capping | Not supported |
| Inventory Sync | Not supported — inventory managed in Broadstreet |
| Inventory Profiles | Not supported |
| Dynamic Products | Not supported |
| Reporting | Basic delivery metrics (impressions, clicks) |

## Troubleshooting

### Common Errors

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `AuthenticationError` | Invalid API credentials | Verify API credentials in Admin UI adapter config |
| `ConfigValidationError` | Invalid adapter configuration | Check that all required fields defined in `config_schema.py` are present |
| `ZoneNotFound` | Referenced zone does not exist in Broadstreet | Verify zone IDs in product configuration match zones in your Broadstreet account |
| `CreativeUploadFailed` | Creative asset rejected | Ensure creative dimensions and file format are supported by Broadstreet |

### Debugging Tips

1. Review the Sales Agent logs for Broadstreet API response codes and error messages.
2. Verify your Broadstreet account has the necessary zones and advertisers configured before creating media buys.
3. Test the adapter configuration by using the Admin UI health check or calling `get_adcp_capabilities` through the MCP/A2A/REST interface.
4. Use the [Mock Adapter](/agents/salesagent/integrations/mock-adapter.html) to validate media buy flows before switching to the live Broadstreet adapter.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — Adapter pattern overview
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) — Full-featured ad server integration
- [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) — Extend the adapter pattern
