---
layout: bidder
title: AdmixerWL
description: Prebid AdMixer Bidder Adaptor
pbjs: true
biddercode: admixerwl
aliasCode: admixer
media_types: banner, video, native
tcfeu_supported: true
usp_supported: true
schain_supported: true
gvl_id: 511
userIds: AdmixerID
prebid_member: true
floors_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                | Example                      | Type     |
|---------------------|----------|--------------------------------------------------------------------------------------------|------------------------------|----------|
| `endpointId`        | required | Unique Entity ID. Could be obtained from your account manager.                             | 51772                        | `int`    |
| `clientId`          | required | Unique Entity ID. Could be obtained from your account manager.                             | 312                          | `int`    |
| `kvTargeting`       | optional | Key/Value - a pair of the unique values that will be used for the custom targeting option. | {key1: value2, key2: value2} | `object` |
