---
layout: bidder
title: Synacor Media
description: Prebid Synacor Media Bidder Adapter
hide: true
biddercode: synacormedia
media_types: banner
gdpr_supported: false
---

### Note:

The Synacor Media bidder adapter requires setup and approval from Synacor. Please reach out to your account manager for more information and to start using it.

### Configuration

Synacor Media requires that iframe is used for user syncing.

Example configuration:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*', // represents all bidders
        filter: 'include'
      }
    }
  }
});
```

### DFP Video Creative
To use video, setup a `VAST redirect` creative within Google AdManager (DFP) with the following VAST tag URL:

```
https://track.technoratimedia.com/openrtb/tags?ID=%%PATTERN:hb_cache_id_synacorm%%&AUCTION_PRICE=%%PATTERN:hb_pb_synacormedia%%
```

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seatId` | required | The seat ID from Synacor Media. This will be the same for all ad units. | `'prebid'` | `string` |
| `placementId` | required | The placement ID from Synacor Media. | `'demo1'` | `string` |
| `bidfloor` | optional | The floor price for the request. | `0.1` | `float` |
| `pos` | optional | The position of the placement on the page, see Open RTB spec v2.5. | `0` | `int` |
| `video` | optional | Optional properties specific to video, see next table | `{ }` | Object |

## Video Parameters
{: .table .table-bordered .table-striped }
| Name | Scope | Description | Default | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `minduration` | optional | Minimum ad duration in seconds | `15` | int |
| `maxduration` | optional | Maximum ad duration in seconds | `30` | int |

