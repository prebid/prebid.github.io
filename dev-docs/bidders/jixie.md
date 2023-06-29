---
layout: bidder
title: Jixie
description: Prebid Jixie Bidder Adaptor
pbjs: true
pbs: true
biddercode: jixie
deals_supported: false
media_types: banner, video
userIds: uid2, unifiedId
gdpr_supported: false
sidebarType: 1
---

### Registration

To use this bidder you will need an account and a valid unit from us. For further information, please contact <contact@jixie.io>

### Bid Params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type       |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|------------|
| `unit`            | required | The unit from jixie                                                                                                  | `'1000012-VyuoGmDQQQ'`                          | `string`   |
| `accountid`       | optional | The accountid from jixie                                                                                             | `'12345678901234567890'`                        | `string`   |
| `jxprop1`         | optional | special property #1                                                                                                  | `'somethingspecial1'`                           | `string`   |
| `jxprop2`         | optional | special property #2                                                                                                  | `'somethingspecial2'`                           | `string`   |
