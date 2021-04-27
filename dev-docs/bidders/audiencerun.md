---
layout: bidder
title: AudienceRun
description: Prebid AudienceRun Bidder Adaptor
pbjs: true
biddercode: audiencerun
media_types: banner
gdpr_supported: true
---

### Disclosure

This bidder sets `adId` on the bid response and hasn't responded to the Prebid.js team to confirm uniqueness
of this value. See [Issue 6381](https://github.com/prebid/Prebid.js/issues/6381).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `zoneId`      | required |             |         | `string` |

### Description

Module that connects to AudienceRun demand sources.

Use `audiencerun` as bidder.

`zoneId` is required and must be 10 alphanumeric characters.

### AdUnits configuration example
```
    var adUnits = [{
      code: 'test-div',
      sizes: [[300, 600]],
      bids: [{
          bidder: 'audiencerun',
          params: { 
              zoneId: 'xtov2mgij0'
          }
      }]
    }];
```
