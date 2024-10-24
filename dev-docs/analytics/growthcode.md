---
layout: analytics
title: Growthcode
description: GrowthCode Analytics Adapter
modulecode: growthCodeAnalytics
enable_download: false
---

#### Registration

[GrowthCode](https://growthcode.io) offers scaled infrastructure-as-a-service to
empower independent publishers to harness data and take control of identity and
audience while rapidly aligning to industry changes and margin pressure.

Please visit [growthcode.io](https://growthcode.io/) for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Param enableAnalytics | Scope    | Type   | Description                                             | Example                  |
|-----------------------|----------|--------|---------------------------------------------------------|--------------------------|
| provider              | Required | String | The name of this Adapter.                               | `"growthCodeAnalytics"`  |
| params                | Required | Object | Details of module params.                               |                          |
| params.pid            | Required | String | This is the Customer ID value obtained from GrowthCode. | `"<Contact GrowthCode>"` |
| params.url            | Optional | String | Custom URL for server                                   |                          |
| params.trackEvents    | Required | String | Name if the variable that holds your publisher ID       |                          |

#### Example Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'growthCodeAnalytics',
  options: {
    pid: '<Contact GrowthCode>',
    trackEvents: [
      'auctionEnd',
      'bidAdjustment',
      'bidTimeout',
      'bidRequested',
      'bidResponse',
      'noBid',
      'bidWon',
      'bidderDone']
  }
});
```
