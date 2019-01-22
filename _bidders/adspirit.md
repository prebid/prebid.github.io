---
layout: bidder
title: AdSpirit
description: Prebid AdSpirit Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: adspirit
prebid_1_0_supported: true
biddercode_longer_than_12: false
---

### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope                                   | Description                                      | Example                | Type     |
|-------------|-----------------------------------------|--------------------------------------------------|------------------------|----------|
| placementId | required                                | The placement ID                                 | `'5'`                  | `string` |
| host        | required (only for biddercode adspirit) | The advertiser specific url provided by AdSpirit | `'n1test.adspirit.de'` | `string` |
