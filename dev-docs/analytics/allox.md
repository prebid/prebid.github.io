---
layout: analytics
title: Allox
description: Allox Analytics Adapter
modulecode: allox
prebid_member: false
tcfeu_supported: false
usp_supported: false
coppa_supported: false
enable_download: true
---

#### About

The Allox Analytics Adapter collects and transmits bidding data to Allox's internal analytics server.

This includes bids that lost within Allox's system as well as cases where Allox lost in the overall auction.

The collected data is used to analyze auction performance and optimize bidding strategies.

#### Example Configuration

```js
  pbjs.que.push(function () {
    pbjs.enableAnalytics({
      provider: 'allox'
    });
  });
```
