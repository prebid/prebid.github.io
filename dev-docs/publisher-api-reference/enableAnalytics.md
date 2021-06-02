---
layout: api_prebidjs
title: pbjs.enableAnalytics(config)
description: 
---


Enables sending analytics data to the analytics provider of your choice. For a list of analytics adapters, see [Analytics for Prebid](/overview/analytics.html).

Note that each analytics adapter has it's own invocation parameters. Analytics adapters that are built in the standard way should
support a `sampling` option. You'll need to check with your analytics provider to confirm
whether their system recommends the use of this parameter. They may have alternate methods of sampling.

```
pbjs.enableAnalytics([{
    provider: "analyticsA",
    options: {
        providerSpecificParams: ...
        sampling: 0.25          // only call the analytics adapter this percent of the time
    }
}]);
```

To learn how to build an analytics adapter, see [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html).

<hr class="full-rule" />