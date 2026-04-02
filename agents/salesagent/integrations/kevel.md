---
layout: page_v2
title: Prebid Sales Agent - Kevel Integration
description: Configure and use the Kevel adapter with the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Kevel Integration
{: .no_toc}

- TOC
{:toc}

## Overview

The Kevel integration connects the Prebid Sales Agent to the [Kevel](https://www.kevel.com/) (formerly Adzerk) ad serving platform. Kevel is designed for native and display advertising and is commonly used by publishers building custom ad experiences, retail media networks, and social platforms.

The adapter is identified by `adapter_name: "kevel"` and is implemented in a single module at `src/adapters/kevel.py`.

## Prerequisites

Before configuring the Kevel integration, ensure you have:

- An active Kevel account
- Your Kevel **network ID**
- A Kevel **API key** with permissions to manage flights, campaigns, and creatives

## Configuration

The Kevel adapter is configured through the Admin UI. Navigate to **Settings > Ad Server** and select **Kevel** as the adapter type.

### Required Settings

{: .table .table-bordered .table-striped }
| Setting | Type | Required | Description |
|---------|------|----------|-------------|
| `network_id` | integer | Yes | Your Kevel network ID |
| `api_key` | string | Yes | Kevel API key for authentication |
| `userdb_enabled` | boolean | No | Enable Kevel UserDB for audience targeting (default: `false`) |
| `frequency_capping_enabled` | boolean | No | Enable frequency capping on flights (default: `false`) |

### Example Configuration

In the Admin UI adapter config JSONB field:

```json
{
  "network_id": 12345,
  "api_key": "your-kevel-api-key",
  "userdb_enabled": false,
  "frequency_capping_enabled": true
}
```

## Supported Channels

{: .table .table-bordered .table-striped }
| Channel | Description |
|---------|-------------|
| `social` | Social media and social-style content feeds |
| `retail_media` | Retail media network placements (sponsored products, sponsored listings) |

## Supported Media Types

{: .table .table-bordered .table-striped }
| Media Type | Description |
|------------|-------------|
| `display` | Standard banner ads and rich media |
| `native` | Native ad formats that match surrounding content |

## Supported Device Types

{: .table .table-bordered .table-striped }
| Device Type | Description |
|-------------|-------------|
| `mobile` | Mobile phones |
| `desktop` | Desktop and laptop computers |
| `tablet` | Tablets |

## Capabilities

{: .table .table-bordered .table-striped }
| Capability | Supported | Notes |
|------------|-----------|-------|
| Inventory Sync | No | Inventory is managed directly in Kevel |
| Inventory Profiles | No | Not applicable to Kevel's architecture |
| Custom Targeting | Limited | Via Kevel's site and zone targeting |
| Geo Targeting | Limited | Kevel supports country and region-level geo targeting |
| Dynamic Products | No | Products are statically configured |
| Pricing Models | Subset | CPM and flat-rate pricing |
| Webhooks | No | Use polling for delivery data |
| Real-Time Reporting | No | Reporting pulled on demand |

## Targeting

The Kevel adapter supports a subset of targeting dimensions. Targeting rules are validated by the adapter before being sent to the Kevel API.

### Available Targeting Dimensions

- **Device type** — Target by mobile, desktop, or tablet
- **Geographic** — Country and region-level targeting
- **Site and zone** — Target specific Kevel sites and zones
- **Keyword** — Keyword-based contextual targeting

### Targeting Validation

The adapter includes `_validate_targeting()` and `_build_targeting()` methods that:

1. Validate that requested targeting dimensions are supported by Kevel.
2. Transform the Sales Agent's normalized targeting format into Kevel's native targeting structure.
3. Reject unsupported targeting combinations with descriptive error messages.

## Frequency Capping

Kevel supports frequency capping at the **flight level only**. Campaign-level frequency capping is not available.

<div class="alert alert-info" role="alert">
  Frequency capping must be explicitly enabled by setting <code>frequency_capping_enabled: true</code> in the adapter configuration. When disabled, no frequency caps are applied even if media buy requests include them.
</div>

When enabled, frequency caps are set on individual flights (Kevel's equivalent of line items) and control how many times a single user sees an ad within a specified time window.

## Limitations

Compared to the GAM adapter, the Kevel integration has the following limitations:

{: .table .table-bordered .table-striped }
| Area | Limitation |
|------|-----------|
| Channels | Only `social` and `retail_media` (vs. 5 channels in GAM) |
| Media Types | Only `display` and `native` (no video or audio) |
| Targeting | No metro-level targeting, limited geo granularity |
| Inventory Sync | Not supported — inventory must be managed in Kevel directly |
| Inventory Profiles | Not supported |
| Frequency Capping | Flight-level only, not campaign-level |
| Dynamic Products | Not supported |
| Reporting | Basic delivery metrics; no equivalent to GAM's advanced report builder |

These limitations reflect the differences between Kevel's API capabilities and those of a full-featured ad server like Google Ad Manager. For use cases centered on native advertising, retail media, and social feeds, Kevel provides a streamlined and effective integration.

## Troubleshooting

### Common Errors

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `AuthenticationError` | Invalid API key | Verify the `api_key` in adapter config |
| `NetworkNotFound` | Incorrect network ID | Check `network_id` matches your Kevel account |
| `UnsupportedTargeting` | Requested targeting not available in Kevel | Review the targeting dimensions supported by the Kevel adapter |
| `FrequencyCappingDisabled` | Frequency cap requested but not enabled | Set `frequency_capping_enabled: true` in config |

### Debugging Tips

1. Verify your Kevel API key has the necessary permissions by testing it directly against the Kevel API.
2. Check the Sales Agent logs for targeting validation errors — the adapter logs detailed messages when targeting rules are rejected.
3. Use the [Mock Adapter](/agents/salesagent/integrations/mock-adapter.html) to test media buy flows before switching to the live Kevel adapter.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — Adapter pattern overview
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) — Full-featured ad server integration
- [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) — Extend the adapter pattern
