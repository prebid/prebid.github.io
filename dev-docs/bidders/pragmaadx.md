---
layout: bidder
title: Pragma Adx
description: Prebid pragmaAdx Bidder Adapter
biddercode: pragmaAdx
pbjs: true
pbs: false
media_types: video, banner
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: false
schain_supported: false
dchain_supported: false
floors_supported: false
fpd_supported: false
safeframes_ok: true
deals_supported: false
prebid_member: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

## Note

`pragmaAdx` serves **video or banner**: it rejects any bid request that has
neither `mediaTypes.video` nor `mediaTypes.banner`. Which format an ad
unit actually gets is decided server-side by Pragma's own ad unit
configuration (`adUnitId`), not by the publisher's requested media type —
an ad unit registered as banner in Pragma always answers as banner,
regardless of which `mediaTypes` the publisher's ad unit declares. It also
only ever answers with a bid when a real external DSP has cleared a
genuine price for the impression through Pragma's own auction. A Pragma
house creative or a self-serve customer campaign fill deliberately
produces **no bid** on this endpoint (an empty `bids` array), even though
both serve fine on Pragma's other, non-header-bidding integration paths —
neither has a real market price to enter into a header auction against
bidders who priced honestly.

`pragmaAdx` does not yet have a Prebid Server (`pbs`) adapter, an IAB
Global Vendor List ID, and does not implement `getUserSyncs` (Pragma runs
no cookie/pixel-sync endpoint) or `onBidWon`/`onTimeout` (win/impression
accounting already happens server-side, off the VAST tracking beacons
baked into the returned creative, which fire from the actual player on
actual playback).

## Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                              | Example            | Type      |
|-------------|----------|--------------------------------------------------------------------------|--------------------|-----------|
| `apiKey`    | required | The publisher API key issued when registering as a Pragma Adx publisher. | `'adx_pub_abc123'` | `string`  |
| `adUnitId`  | required | The Pragma Adx ad unit ID to request a bid for.                          | `1`                | `integer` |
| `placement` | optional | A publisher label to correlate a bid with a slot in Pragma reporting.    | `'article_inline'` | `string`  |
| `userId`    | optional | A publisher-supplied end-user identifier, forwarded for reporting only.  | `'user-123'`       | `string`  |
| `ifa`       | optional | Device advertising ID (IDFA/AAID), forwarded for reporting only.         | `'idfa-456'`       | `string`  |

## Test Parameters

```javascript
var adUnits = [{
    code: 'video-slot-1',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [[640, 360]],
            mimes: ['video/mp4']
        }
    },
    bids: [{
        bidder: 'pragmaAdx',
        params: {
            apiKey: 'adx_pub_test_key',
            adUnitId: 1,
            placement: 'article_inline'
        }
    }]
}, {
    code: 'banner-slot-1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
    },
    bids: [{
        bidder: 'pragmaAdx',
        params: {
            apiKey: 'adx_pub_test_key',
            adUnitId: 2,
            placement: 'sidebar'
        }
    }]
}];
```
