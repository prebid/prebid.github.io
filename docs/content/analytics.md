---
sidebar_position: 4
title: Analytics for Prebid.js
description: Prebid.js Analytics Adapters
---

# Prebid.js Analytics Adapters

There are many analytics adapter plugins available to track header bidding performance for your site.

## Video Overview

<div><iframe src="https://player.vimeo.com/video/957374949?h=1a3701d51a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Analytics for Prebid.js"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:

- [Transcript of this video](/content/analytics-video)
- [Prebid.js Events](https://docs.prebid.org/dev-docs/publisher-api-reference/getEvents.html)
- [All videos](/content/all-videos)

## How to Integrate an Analytics Adapter

Each analytics provider has specific instructions for using their system, but these are the general steps:

- Create an account with the analytics vendor and obtain the necessary IDs
- Build Prebid.js package with the vendor's analytics adapter

```javascript
gulp bundle --modules=exAnalyticsAdapter,xyzBidAdapter
```

- If required, load analytics JavaScript from vendor directly on the page
- Call the [`pbjs.enableAnalytics()` function](/dev-docs/publisher-api-reference/enableAnalytics.html)

e.g.

```javascript
pbjs.que.push(function() {
  pbjs.enableAnalytics({
    provider: 'NAME',
    options: {
    [...]
    }
  });
});
```

## Analytics Adapters

:::note
This section will be updated with a proper analytics adapter listing once the analytics adapter pages are migrated to the new structure.
:::

For now, you can find analytics adapters in the [Prebid.js documentation](https://docs.prebid.org/dev-docs/modules/analytics.html).
