---
layout: page_v2
title: Mile RTD Module
display_name: Mile RTD Module
description: The Mile RTD module computes per-slot targeting values through a runtime engine and sets GPT slot targeting used by GAM unified Pricing rules.
page_type: module
module_type: rtd
module_code : mileRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Mile RTD Provider

## Overview

The `mile` RTD provider computes per-slot targeting values through a runtime engine and sets GPT slot targeting used by GAM unified Pricing rules.

It sets a single targeting key:

- `mile_rtd`

The value is provider-specific and is returned by `window[params.runtimeGlobalName].getMileTargetingByAdUnit(...)`

{% include dev-docs/loads-external-javascript.md %}

## Installation

Build the Mile RTD module into your Prebid.js package with:

```bash
gulp build --modules=rtdModule,mileRtdProvider,...
```

## When targeting is applied

Targeting is applied during:

- `onAuctionInitEvent`
- `onBidResponseEvent`

## Key-value mapping

The runtime engine returns a map keyed by ad unit identifier (slot element ID or ad unit path), and each resolved slot gets:

- key: `mile_rtd`
- value: `targetingByAdUnit[slotElementId]` or `targetingByAdUnit[adUnitPath]`

Example runtime response:

```js
{
  "div-gpt-ad-123": "segA_floorHigh",
  "/1234567/homepage/top": "segB_floorMid"
}
```

Resulting GPT slot targeting:

```js
slot.setTargeting("mile_rtd", "segA_floorHigh");
```

## Configuration

Use the RTD module with provider name `mile`:

```js
pbjs.setConfig({
  realTimeData: {
    dataProviders: [
      {
        name: "mile",
        waitForIt: false,
        params: {
          runtimeScriptUrl: "https://cdn.example.com/mile-rtd-runtime.js",
          runtimeGlobalName: "mileRtdRuntime", // optional, default shown
        },
      },
    ],
  },
});
```

### Params

- `runtimeScriptUrl` (optional): URL of runtime script to load.
- `runtimeGlobalName` (optional): global object name exposing `getMileTargetingByAdUnit`; defaults to `mileRtdRuntime`.
