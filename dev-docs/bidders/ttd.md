---
layout: bidder
title: The Trade Desk
description: The Trade Desk Prebid Bidder Adapter
biddercode: ttd
gdpr_supported: true
gvl_id: 21
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
userIds: unifiedId, uid2
media_types: banner, video
floors_supported: true
pbjs: true
pbs: false
prebid_member: true
---

### Disclosure:

This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

{: .alert.alert-danger :}
Note: The Trade Desk Header Bidding adapter requires setup and approval before beginning. Please reach out to OpenPathPublishers@thetradedesk.com for more details.

### Bid Params

{: .table .table-bordered .table-striped }
Name | Scope | Description | Example | Type
--- | --- | --- | --- | ----
`supplySourceId` | required | The TTD-provided supply source name. | `'supplier'` | `String`
`publisherId` | required | The publisher ID. If there is a sellers.json, this should be the same as the seller_id in the sellers.json for the site being trafficked. If there is no sellers.json, this should be hardcoded to "1". | `'1427ab10f2e448057ed3b422'` | `String`
`placementId` | optional | This field is optional if GPID is passed through the GPT module https://docs.prebid.org/dev-docs/modules/gpt-pre-auction.html. If that module isn't used, the GPID value should be passed in this field. | `'/1111/home#header'` | `String`
`banner` | optional | Display banner targeting parameters. See the banner section below. | `{}` | `object`

### Banner Object

The following banner parameters are supported:

{: .table .table-bordered .table-striped }
Name | Scope | Description | Example | Type
--- | --- | --- | --- | ----
`expdir` | optional | Directions in which the banner may expand. See "Expandable Direction" in the [OpenRTB 2.5 docs](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for possible values. | `[1, 3]` | `Array[integer]`

#### `mediaTypes.banner` Parameters

The TTD adapter for banner uses certain parameters in the AdUnit's
[mediaTypes.banner](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.banner) definition. Specifically, `sizes` is required for banner ad units. `pos` is recommended.

Here's a banner ad unit example:

```javascript
var bannerAdUnit = {
    code: 'myBannerAdUnit',
    mediaTypes: {
        banner: {
            sizes: [400, 600],
            pos: 1
        }
    },
    bids: [
        {
            bidder: 'ttd',
            params: {
                supplySourceId: 'supplier'
                publisherId: '1427ab10f2e448057ed3b422',
                siteId: 'site-123',
                placementId: 'sidebar_1',
                banner: {
                    expdir: [1, 3]
                }
            }
        }
    ]
}
```

### Video

#### `mediaTypes.video` Parameters

The TTD adapter for video requires certain parameters in the AdUnit's
[mediaTypes.video](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.video) definition. Specifically, `maxduration`, `api`, `mimes`, `placement`, and `protocols` are all required for video ad units. `playerSize`, `startdelay`, `playbackmethod`, and `pos` are recommended. `minduration`, `minbitrate`, `maxbitrate`, `skip`, `skipmin`, and `skipafter` are optional.

Note: TTD does not currently support `adpod` video contexts.

Here's a video ad unit example:

```javascript
var videoAdUnit = {
    code: 'myVideoAdUnit',
    mediaTypes: {
        video: {
            minduration: 1,
            maxduration: 60,
            playerSize: [640, 480],
            api: [1, 3],
            mimes: ['video/mp4'],
            placement: 3,
            protocols: [2, 3, 5, 6],
            startdelay: -1,
            playbackmethod: [1],
            pos: 1,
            minbitrate: 0,
            maxbitrate: 5000,
            skip: 1,
            skipmin: 5,
            skipafter: 10
        }
    },
    bids: [
        {
            bidder: "ttd",
            params: {
                supplySourceId: 'supplier',
                publisherId: '1427ab10f2e448057ed3b422',
                siteId: 'site-123',
                placementId: 'video1'
            }
        }
    ]
}
```

---
Lists of `api`, `playbackmethod`, `protocols`, `pos`, and `expdir` potential values are in the [OpenRTB 2.5 docs](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), copied here for convenience:

`api`

- `1` : VPAID 1.0
- `2` : VPAID 2.0
- `3` : MRAID-1
- `4` : ORMMA
- `5` : MRAID-2
- `6` : MRAID-3
- `7` : OMID-1

`playbackmethod`

- `1` : Initiates on Page Load with Sound On
- `2` : Initiates on Page Load with Sound Off by Default
- `3` : Initiates on Click with Sound On
- `4` : Initiates on Mouse-Over with Sound On
- `5` : Initiates on Entering Viewport with Sound On
- `6` : Initiates on Entering Viewport with Sound Off by Default

`protocols`

- `1` : VAST 1.0
- `2` : VAST 2.0
- `3` : VAST 3.0
- `4` : VAST 1.0 Wrapper
- `5` : VAST 2.0 Wrapper
- `6` : VAST 3.0 Wrapper
- `7` : VAST 4.0
- `8` : VAST 4.0 Wrapper
- `9` : DAAST 1.0
- `10` : DAAST 1.0 Wrapper
- `11` : VAST 4.1
- `12` : VAST 4.1 Wrapper

`pos`

- `0` :  Unknown
- `1` :  Above the Fold
- `3` :  Below the Fold
- `4` :  Header
- `5` :  Footer
- `6` :  Sidebar
- `7` :  Full Screen

`expdir`

- `1` : Left
- `2` : Right
- `3` : Up
- `4` : Down
- `5` : Full Screen
