---
layout: analytics
title: Optimon
description: Optimon Analytics Adapter
modulecode: optimon
---

## Registration

Please visit [optimon.io](https://optimon.io/?utm_source=prebid-org&utm_medium=analytics-adapters-list) for more information.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'optimon'
});
```

The adapter has no options.

## Data Collection

This is a bundle-type adapter: it forwards every Prebid event to a page-level function, `window.OptimonAnalyticsAdapter('on', eventType, args)`. Optimon's own script must be loaded on the page to define that function; that script, not Prebid.js, determines what is collected and where it is sent.
