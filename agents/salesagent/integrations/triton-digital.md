---
layout: page_v2
title: Prebid Sales Agent - Triton Digital Integration
description: Configure and use the Triton Digital adapter for audio and streaming audio advertising
sidebarType: 10
---

# Prebid Sales Agent - Triton Digital Integration
{: .no_toc}

- TOC
{:toc}

## Overview

The Triton Digital integration connects the Prebid Sales Agent to the [Triton Digital](https://www.tritondigital.com/) platform, enabling AI buying agents to plan, execute, and measure audio and streaming audio advertising campaigns. Triton Digital is the leading technology platform for the digital audio industry, powering ad insertion for podcasts, internet radio, and streaming audio services.

The adapter is identified by `adapter_name: "triton_digital"` and is implemented at `src/adapters/triton_digital.py`.

## Prerequisites

Before configuring the Triton Digital integration, ensure you have:

- An active Triton Digital account with API access
- API credentials (provided by your Triton Digital account representative)
- Network configuration details for your Triton Digital setup

## Configuration

The Triton Digital adapter is configured through the Admin UI. Navigate to **Settings > Ad Server** and select **Triton Digital** as the adapter type.

### Required Settings

{: .table .table-bordered .table-striped }
| Setting | Type | Required | Description |
|---------|------|----------|-------------|
| API credentials | string | Yes | Authentication credentials for the Triton Digital API |
| Network configuration | object | Yes | Network-specific configuration for your Triton Digital account |

Enter these values in the adapter config JSONB field in the Admin UI.

## Supported Channels

{: .table .table-bordered .table-striped }
| Channel | Description |
|---------|-------------|
| `audio` | Standard digital audio advertising (pre-roll, mid-roll, post-roll audio ads) |
| `streaming_audio` | Live streaming audio and internet radio ad insertion |

## Capabilities

{: .table .table-bordered .table-striped }
| Capability | Supported | Notes |
|------------|-----------|-------|
| Audio Targeting | Yes | Target by genre, station, content type, and listener demographics |
| Frequency Capping | Yes | Control ad exposure per listener |
| Advertiser Management | Yes | Manage advertiser accounts within Triton Digital |
| Inventory Sync | No | Audio inventory is managed in Triton Digital |
| Inventory Profiles | No | Not applicable to audio ad serving |
| Custom Targeting | Limited | Audio-specific targeting dimensions |
| Geo Targeting | Yes | Geographic targeting for audio campaigns |
| Dynamic Products | No | Products are statically configured |
| Webhooks | No | Use polling for delivery data |
| Real-Time Reporting | No | Reporting pulled on demand |

## How It Works

### Audio Ad Serving

When an AI buying agent creates a media buy through the Sales Agent, the Triton Digital adapter:

1. Creates a campaign in Triton Digital with the specified advertiser, budget, and flight dates.
2. Configures audio ad placements based on the product's channel and targeting settings.
3. Uploads audio creative assets (typically MP3 or companion display banners).
4. Activates the campaign for ad insertion into audio streams.

### Targeting

The Triton Digital adapter supports audio-specific targeting dimensions:

- **Content targeting** — Target specific stations, shows, podcasts, or genres
- **Geographic targeting** — Country, region, and metro-level targeting for audio listeners
- **Daypart targeting** — Schedule ads during specific times of day or days of week
- **Device targeting** — Target by listening device (smart speaker, mobile, desktop, connected car)
- **Listener demographics** — Age, gender, and interest-based targeting where available

### Frequency Capping

Frequency capping controls how many times a listener hears an ad within a given time window. The Triton Digital adapter supports:

- Per-listener frequency caps at the campaign level
- Time-window-based caps (e.g., maximum 3 impressions per listener per 24 hours)

### Advertiser Management

The adapter can manage advertiser entities within Triton Digital, including:

- Creating and updating advertiser records
- Associating campaigns with advertisers
- Tracking advertiser-level delivery metrics

## Use Cases

### Podcast Advertising

Monetize podcast content with dynamically inserted audio ads. The Sales Agent enables AI buying agents to target specific podcast categories, shows, or audience segments through Triton Digital's podcast ad insertion technology.

### Streaming Audio / Internet Radio

Serve audio ads into live streaming audio feeds. Triton Digital powers ad insertion for many internet radio stations, enabling real-time ad serving to listeners across devices.

### Radio Digital Extension

Extend terrestrial radio campaigns into digital audio channels. Publishers can offer audio inventory alongside display and video through the Sales Agent's multi-adapter architecture.

## Limitations

{: .table .table-bordered .table-striped }
| Area | Limitation |
|------|-----------|
| Channels | Audio and streaming audio only (no display, video, or native) |
| Creative Types | Audio files (MP3) and companion banners only |
| Inventory Sync | Not supported — inventory managed in Triton Digital |
| Inventory Profiles | Not supported |
| Dynamic Products | Not supported |
| Reporting | Audio-specific metrics; delivery reporting may have longer latency than display |

## Troubleshooting

### Common Errors

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `AuthenticationError` | Invalid API credentials | Verify credentials with your Triton Digital account representative |
| `NetworkConfigError` | Incorrect network configuration | Check network settings in Admin UI adapter config |
| `UnsupportedCreativeFormat` | Non-audio creative uploaded | Ensure creatives are audio files (MP3) or companion banners |
| `CampaignCreationFailed` | Missing required campaign fields | Verify that the media buy includes all required fields (dates, budget, targeting) |

### Debugging Tips

1. Confirm your API credentials are active by contacting your Triton Digital account representative.
2. Check the Sales Agent logs for detailed error messages from the Triton Digital API.
3. Verify that products configured for Triton Digital use the `audio` or `streaming_audio` channel.
4. Use the [Mock Adapter](/agents/salesagent/integrations/mock-adapter.html) with the `streaming_audio` channel to test audio media buy flows before connecting to Triton Digital.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — Adapter pattern overview
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) — Display and video ad serving
- [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html) — Extend the adapter pattern
