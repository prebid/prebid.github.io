---
layout: bidder
title: AdSpirit
description: Prebid AdSpirit Bidder Adapter
hide: true
biddercode: adspirit
biddercode_longer_than_12: false
---

### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope                                   | Description                                      | Example                | Type     |
|-------------|-----------------------------------------|--------------------------------------------------|------------------------|----------|
| placementId | required                                | The placement ID                                 | `'5'`                  | `string` |
| host        | required (only for biddercode adspirit) | The advertiser specific url provided by AdSpirit | `'n1test.adspirit.de'` | `string` |
