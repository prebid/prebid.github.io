---
layout: page_v2
title: MS Clarity RTD Module
display_name: MS Clarity RTD Module
description: Microsoft Clarity Real-Time Data Module
page_type: module
module_type: rtd
module_code: msClarityRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# MS Clarity RTD Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Microsoft Clarity RTD module collects behavioral signals from a self-contained DOM tracker and enriches bid requests with **bucketed categorical features**. Signals are compact string labels (e.g. `"deep"`, `"moderate"`, `"high"`) — not raw numerics — making them directly usable in DSP targeting rules without additional processing.

Signals are written into **global ORTB2 fragments**, making them available to **all bidders**. Data is published through three complementary paths:

1. **`site.ext.data.msclarity`** — structured key-value features
2. **`user.data` segments** — ORTB2-native segments for DSPs and platforms like Microsoft Curate
3. **`site.keywords`** — keyword strings for adapters that consume keywords (e.g. AppNexus)

The module also persists signals to **localStorage** for warm-start support — the first auction of a new page load can use recent (≤ 30 min) signals instead of empty defaults.

The Clarity JS tag is **injected by default** for analytics and session-recording functionality. Set `params.injectClarity: false` to opt out of automatic injection. Bid-enrichment signals are computed independently from DOM events regardless of whether the Clarity tag is present.

## Prerequisites

1. A Microsoft Clarity account and project — sign up at [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Your Clarity **Project ID** (found in Project Settings)

## Integration

1. Build the MS Clarity RTD module into the Prebid.js package with:

    ```bash
    gulp build --modules=rtdModule,msClarityRtdProvider,appnexusBidAdapter,msftBidAdapter
    ```

2. Use `setConfig` to instruct Prebid.js to initialize the MS Clarity RTD module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 200,
        dataProviders: [{
            name: 'msClarity',
            waitForIt: true,
            params: {
                projectId: 'abc123xyz',     // Required: Clarity project ID
                // injectClarity: false,    // Optional: disable auto-injection (default: true)
                targetingPrefix: 'msc'      // Optional: keyword prefix (default: 'msc')
            }
        }]
    }
});
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name | Type | Description | Notes |
| :--- | :--- | :---------- | :---- |
| name | String | Real-time data module name | Always `'msClarity'` |
| waitForIt | Boolean | Should be `true` if there's an `auctionDelay` defined | Optional. Default `false` |
| params | Object | | |
| params.projectId | String | Microsoft Clarity project ID | Required |
| params.injectClarity | Boolean | Automatically inject the Clarity JS tag if not already present | Optional. Default `true` |
| params.targetingPrefix | String | Prefix for keyword key-values in `site.keywords` | Optional. Default `'msc'` |

{: .alert.alert-info :}
**Note:** The module automatically injects the Clarity JS tag unless `params.injectClarity` is explicitly set to `false`. To manage the Clarity tag yourself, set `injectClarity: false` and add the tag to your page before Prebid loads.

## Features

The module computes **11 features** in two tiers:

### Durable Features (7) — persisted to localStorage for warm-start

These accumulate over the page session and are saved to `localStorage` for use in the first auction of subsequent page loads.

{: .table .table-bordered .table-striped }
| Feature | Key | Values | Description |
| :------ | :-- | :----- | :---------- |
| Engagement | `engagement` | `low`, `medium`, `high`, `very_high` | Composite: scroll + dwell + interaction − frustration |
| Dwell Time | `dwell` | `bounce`, `brief`, `moderate`, `long`, `extended` | Visibility-aware active dwell time |
| Scroll Depth | `scroll` | `none`, `shallow`, `mid`, `deep`, `complete` | High-water-mark page scroll depth |
| Frustration | `frustration` | `none`, `mild`, `moderate`, `severe` | Deduplicated rage clicks + exploratory clicks + scroll reversals |
| Interaction | `interaction` | `passive`, `light`, `moderate`, `active`, `intense` | Deliberate events per second of active time |
| Reading Mode | `readingMode` | `skim`, `scan`, `read` | Whether the user is reading steadily, scanning, or skimming |
| View Quality | `viewQuality` | `low`, `medium`, `high` | Composite of reading time, active time, and scroll depth |

### Transient Snapshot Features (4) — computed fresh at auction time

These reflect the user's instantaneous state when a bid request fires. They are **not** persisted.

{: .table .table-bordered .table-striped }
| Feature | Key | Values | Description |
| :------ | :-- | :----- | :---------- |
| Activity Recency | `activityRecency` | `live`, `recent`, `stale` | Time since last deliberate interaction |
| Recent Engagement | `recentEngagement` | `cold`, `warming`, `hot` | Count of deliberate interactions in the last 10 seconds |
| Auction Attention | `auctionAttention` | `low`, `medium`, `high` | Whether the user is attentive right now |
| Page Momentum | `pageMomentum` | `arrival`, `in_reading_flow`, `post_scroll`, `fatigued` | Phase of the page visit lifecycle |

## Output

### Global ORTB2

All 11 features are written into global ORTB2 fragments, available to every bidder:

**Structured features** at `site.ext.data.msclarity`:

```json
{
    "engagement": "high",
    "dwell": "moderate",
    "scroll": "deep",
    "frustration": "none",
    "interaction": "active",
    "readingMode": "read",
    "viewQuality": "high",
    "activityRecency": "live",
    "recentEngagement": "hot",
    "auctionAttention": "high",
    "pageMomentum": "in_reading_flow"
}
```

**User segments** at `user.data`:

```json
[{
    "name": "msclarity",
    "segment": [
        { "id": "engagement_high" },
        { "id": "dwell_moderate" },
        { "id": "scroll_deep" },
        { "id": "frustration_none" },
        { "id": "interaction_active" },
        { "id": "readingMode_read" },
        { "id": "viewQuality_high" },
        { "id": "activityRecency_live" },
        { "id": "recentEngagement_hot" },
        { "id": "auctionAttention_high" },
        { "id": "pageMomentum_in_reading_flow" }
    ]
}]
```

**Keywords** at `site.keywords`:

```text
msc_engagement=high,msc_dwell=moderate,msc_scroll=deep,msc_interaction=active,msc_readingMode=read,msc_viewQuality=high,msc_activityRecency=live,msc_recentEngagement=hot,msc_auctionAttention=high,msc_pageMomentum=in_reading_flow
```

{: .alert.alert-info :}
The `frustration` keyword is omitted when its value is `"none"` to reduce noise.

### Warm-Start (localStorage)

The module persists the 7 durable features to `localStorage` (key: `msc_rtd_signals`) with a 30-minute TTL. On the first auction of a new page load, if all durable features are at baseline defaults, the module falls back to the cached snapshot. Transient snapshot features are always computed fresh.

The storage manager respects consent — if localStorage access is blocked by consent management, warm-start is silently skipped.

## Privacy

- All signals are page-level behavioral data (scroll, clicks, timing) — **no PII** is collected or transmitted.
- Signal values are bucketed categorical strings, not raw measurements, providing an additional privacy layer.
- localStorage persistence uses the consent-aware `storageManager` and respects TCF/GPP consent signals.
- The Clarity JS tag injection can be disabled via `params.injectClarity: false`.
- If `projectId` is not configured, the module silently disables itself.

## Further Reading

- [Microsoft Clarity](https://clarity.microsoft.com) — sign up and manage projects
- [Prebid Real-Time Data Module]({{site.baseurl}}/dev-docs/modules/rtdModule.html) — RTD module overview
