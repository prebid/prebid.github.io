---
layout: api_prebidjs
title: pbjs.enableAnalytics(config)
description: enableAnalytics API
sidebarType: 1
---


Enables sending event data to the analytics provider of your choice. For a list of analytics adapters, see [Analytics for Prebid](/overview/analytics.html).

### Example

```
pbjs.enableAnalytics([{
    provider: "analyticsA",    
    options: {
        sampling: 0.25          // only call the analytics adapter this percent of the time
        providerSpecificParams: ...
    },
    excludeEvents: ['auctionDebug'],
}]);
```

### Parameters

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| `provider` | Required | String | Analytics adapter code |
| `options`       |  Required  | Object | Adapter specific options |
| `includeEvents` | Optional | Array of strings | Event whitelist; if provided, only these events will be forwarded to the adapter |
| `excludeEvents` | Optional | Array of strings | Event blacklist; if provided, these events will not be forwarded to the adapter |


Note each analytics adapter has its own invocation parameters. Analytics adapters that are built in the standard way should
support a `option.sampling` parameter. You'll need to check with your analytics provider to confirm
whether their system recommends the use of this parameter. They may have alternate methods of sampling.


### See also

- [Prebid.js events](/dev-docs/publisher-api-reference/getEvents.html)
- [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html).


<hr class="full-rule" />
