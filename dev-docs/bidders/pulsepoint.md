---
layout: bidder
title: PulsePoint
description: Prebid PulsePoint Bidder Adaptor
biddercode: pulsepoint
gdpr_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, parrableId, pubCommonId, unifiedId
pbjs: true
pbs: true
gvl_id: 81
---

### Disclosure

This bidder sets `adId` on the bid response and hasn't responded to the Prebid.js team to confirm uniqueness
of this value. See [Issue 6381](https://github.com/prebid/Prebid.js/issues/6381).

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                           | Example                      | Type                |
|------------|----------|-------------------------------------------------------|------------------------------|---------------------|
| `cf`       | required | Ad size identifier                                    | `'300X250'`                  | `string`            |
| `cp`       | required | Publisher Id                                          | `12345`                      | `integer`           |
| `ct`       | required | Ad Tag Id                                             | `12345`                      | `integer`           |
| `bcat`     | optional | Blocked IAB Categories                                | `[ 'IAB1-5', 'IAB1-6' ]`     | `array of strings`  |
| `battr`    | optional | Blocked Creative Attributes                           | `[ 1, 2, 5 ]`                | `array of integers` |
| `badv`     | optional | Blocked Advertisers by their domains                  | `['ford.com', 'pepsi.com']`  | `array of strings`  |
| `bidfloor` | optional | Bid floor price CPM                                   | `1.23`                       | `float`             |
