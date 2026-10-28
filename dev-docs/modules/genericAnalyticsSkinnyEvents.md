---
layout: page_v2
page_type: module
title: Module - Generic Analytics Skinny Events
description: Skinny event preset for the generic analytics adapter, which collects only the fields typically useful for analytics
module_code : genericAnalyticsSkinnyEvents
display_name : Generic Analytics Skinny Events
enable_download : true
min_js_version: 11.44.0
sidebarType : 1
---

# Generic Analytics Skinny Events

This module provides the `skinny` preset for the [generic analytics adapter](/dev-docs/modules/genericAnalyticsAdapter.html). With it, the adapter collects a small set of events, with only the fields that are typically useful for analytics, instead of full event payloads.

Including this module also includes the generic analytics adapter. Enable the preset with `options.preset: 'skinny'`:

```javascript
pbjs.enableAnalytics({
    provider: 'generic',
    options: {
        url: 'https://example.com/analytics',
        preset: 'skinny'
    }
});
```

See [Skinny preset](/dev-docs/modules/genericAnalyticsAdapter.html#skinny-preset) for the events and fields it collects.
