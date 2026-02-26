---
layout: bidder
title: T-Advertising Solutions
description: T-Advertising Solutions Prebid Bidder Adapter
biddercode: tadvertising
tcfeu_supported: true
gvl_id: 213
usp_supported: false
coppa_supported: false
gpp_supported: false
schain_supported: true
dchain_supported: false
userIds: unifiedId
media_types: banner, video
floors_supported: true
pbjs: true
pbs: false
prebid_member: no
sidebarType: 1
pbs_app_supported: false
deals_supported: false
multiformat_supported: will-not-bid
ortb_blocking_supported: true
gpp_sids: false
fpd_supported: false
---

### Disclosure

{: .alert.alert-danger :}
Note: The T-Advertising Solutions Bidding adapter requires setup and approval from the T-Advertising Solutions service team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }

Name | Scope | Description | Example | Type
--- | --- | --- | --- | ----
`publisherId` | required | The publisher ID | `'1427ab10f2e448057ed3b422'` | `String`
`placementId` | required | the GPID value should be passed in this field. | `'5e9f2c8b7d31a45620fa8d3c'` | `String`
`bidfloor` | optional | Sets a bid floor price | `0.95` | `Float`

### Banner Ad Unit Example

The T-Advertising Solutions adapter for banner uses certain parameters in the AdUnit's
[mediaTypes.banner](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.banner) definition.

Here's a banner ad unit example:

```javascript
var bannerAdUnit = {
    code: 'myBannerAdUnit',
    mediaTypes: {
        banner: {
            sizes: [400, 600],
        }
    },
    bids: [
        {
            bidder: 'tadvertising',
            params: {
                publisherId: '1427ab10f2e448057ed3b422',
                placementId: 'sidebar_1',
                bidfloor: 0.95 // Optional - default is 0
            }
        }
    ]
}
```

### Video Ad Unit Example

The T-Advertising Solutions adapter for video requires certain parameters in the AdUnit's
[mediaTypes.video](/dev-docs/adunit-reference.html#adUnit.mediaTypes.video) definition.

Here's a video ad unit example:

```javascript
var videoAdUnit = {
    code: 'myVideoAdUnit',
    mediaTypes: {
        video: {
            mimes: ['video/mp4'],
            minduration: 1,
            maxduration: 60,
            api: [1, 3],
            placement: 3,
            protocols: [2,3,5,6]
        }
    },
    bids: [
        {
            bidder: "tadvertising",
            params: {
                publisherId: '1427ab10f2e448057ed3b422',
                placementId: 'sidebar_1',
                bidfloor: 0.95 // Optional - default is 0
            }
        }
    ]
}
```

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](/features/firstPartyData.html).
