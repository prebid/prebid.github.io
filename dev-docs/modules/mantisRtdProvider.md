---
layout: page_v2
title: Mantis RTD Module
display_name: Mantis RTD Module
description: Enables publishers to enrich their ad auction requests with contextual intelligence sourced from the Mantis API into OpenRTB bid requests
page_type: module
module_type: rtd
module_code: mantisRtdProvider
vendor_specific: true
enable_download: true
sidebarType: 1
---

# Mantis RTD Module
{:.no_toc}

* TOC
{:toc}

# Description

The Mantis RTD provider module for Prebid.js enables publishers to enrich ad auction requests with contextual intelligence from the Mantis API. It runs client-side as part of the Prebid RTD framework and injects structured signals — brand safety ratings, sentiment, emotions, and content categories — into OpenRTB (`ortb2`) objects before bidding occurs, allowing demand partners to make more informed bidding decisions.

---

# Salient Features

## Contextual enrichment

- Page categories (Mantis taxonomy and IAB taxonomy)
- Sentiment (`positive` / `negative` / `neutral` / `unknown`)
- Emotions (e.g. `joy-high`, `anger-low`)
- Brand safety ratings (e.g. `GREEN`, `AMBER`, `RED`)

## oRTB2-compliant output

Populates `site.content.data` and `user.data` with named segment groups.

## Fail-safe design

- Timeout controlled by `auctionDelay` — auction is never blocked
- Graceful degradation on any error or missing data

---

# Integration Guide

## Required Configuration Fields

|   Parameter   |   Type   |   Required   |   Description  |
|---------------|----------|--------------|----------------|
| `endpoint` | string | yes | Base URL of the Mantis API service |


The API request timeout is controlled by the top-level `auctionDelay` setting in the `realTimeData` config. Keep it as low as possible — higher values increase auction latency.

## Example Configuration

```js
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 1000, // keep as low as possible for production
    dataProviders: [
      {
        name: 'mantis',
        waitForIt: true,
        params: {
          endpoint: 'https://publisher-mantis.example.com/api/demo'
        }
      }
    ]
  }
});
```
# Behavior & Failure Modes

All errors fail gracefully with no retries — the auction is never blocked.

| Scenario | Behavior |
|----------|----------|
| Valid config, response within `auctionDelay` | Segments injected into `ortb2Fragments.global` |
| Missing `endpoint` param | No request made; auction continues immediately |
| Non-2xx response (e.g. 404, 500) | Error logged; no segments added; auction continues |
| Response exceeds `auctionDelay` | Module stops waiting; auction continues without data |
| Network error (DNS failure, unreachable) | Error logged; no segments added; auction continues |
| Late response (arrives after timeout) | Response discarded; auction already proceeding |
| Empty or below-threshold API data | No segments injected; auction continues normally |

---

# Debugging

Filter console logs by `mantisRtdProvider:` to see init, timeout, and error messages. Check the network tab for the GET request to the configured `endpoint`.
