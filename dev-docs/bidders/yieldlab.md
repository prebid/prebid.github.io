---
layout: bidder
title: Yieldlab
description: Prebid Yieldlab Bidder Adapter
biddercode: yieldlab
media_types: video, banner, native
gdpr_supported: true
schain_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: true
pbjs: true
pbs: true
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                           | Example                                     | Type     |
|----------------|----------|---------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `adslotId`     | required | Yieldlab Adslot ID                                                                    | `'12345'`                                   | `string` |
| `supplyId`     | required | Yieldlab Supply ID. Please reach out to your account management for more information. | `'12345'`                                   | `string` |
| `adSize`       | optional | Override the default prebid size                                                      | `'970x250'`                                 | `string` |
| `targeting`    | optional | Key-Value Targeting                                                                   | `{ 'key1': 'value1', 'key2': 'value2' }`    | `object` |
| `extId`        | optional | External Id                                                                           | `'abc'`                                     | `string` |
| `customParams` | optional | Custom parameters to append to the query string of the bidding endpoint.              | `{ 'param': 'value1', 'param2': 'value2' }` | `object` |
