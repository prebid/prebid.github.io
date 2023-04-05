---
layout: bidder
title: TrustX
description: Prebid TrustX Bidder Adaptor
pbjs: true
pbs: true
biddercode: trustx
aliasCode: grid
media_types: banner, video
multiformat_supported: will-bid-on-any
gdpr_supported: true
usp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
coppa_supported: true
fpd_supported: true
pbjs_version_notes: 7.0 and after
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Bid Params](#bid-params)
- [Bidder Config](#bidder-config)
- [First Party Data](#first-party-data)

<a name="trustx-bid-params" />

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope     | Description                                                                                              | Example                                   | Type      |
|----------------|-----------|----------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`          | required  | Represents the TrustX bidder system Ad Slot ID associated with the respective div id from the site page. | `42`                                      | `integer` |
| `keywords`     | optional  | A set of key-value pairs applied to all ad slots on the page. Values can be empty.                       | `keywords: { topic: ['stress', 'fear'] }` | `object`  |
| `bidFloor`     | optional  | Floor of the impression opportunity. If present in the request overrides XML info.                       | `0.8`                                     | `float`   |

Parameter `keywords` must have following format:
```
{
   "site":{
      "publisher1":[
         {
            "name":"SomeKeywordsBlockName",
            "segment1Name":[
               "segment2Value"
            ],
            "segment2Name":[
               "segment2Value1",
               "segment2Value2",
               ...
            ],
            ...
         }
      ],
      ...
   }
}
```

<a name="trustx-bidder-config" />

### Bidder Config

You can allow writing in localStorage `pbjs.setBidderConfig` for the bidder `trustx`
```
pbjs.setBidderConfig({
    bidders: ["trustx"],
    config: {
        localStorageWriteAllowed: true
    }
})
```
If it will be "true" this allow TheMediaGrid Bid Adapter to write userId in first party localStorage

If you want to make alias on TrustX Bid Adapter, you must set `forceBidderName` in bidderConfig as `"trustx"`.
```
pbjs.setBidderConfig({
    bidders: ["aliasName"],
    config: {
        forceBidderName: 'trustx'
    }
})
```

<a name="trustx-first-party" />

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

Global site or user data using `setConfig()`, or Bidder-specific using `setBidderConfig()` supports following fields:

- `ortb2.user.data[]`: Standard IAB segment taxonomy user data
- `ortb2.user.ext.device`: Non standard arbitrary user device
- `ortb2.user.keywords`: Standard IAB OpenRTB 2.5 user.keywords field. It will be included in ext.keywords.user.ortb2
- `ortb2.site.keywords`: Standard IAB OpenRTB 2.5 site.keywords field. It will be included in ext.keywords.site.ortb2
- `ortb2.site.cat[]`: Standard IAB OpenRTB 2.5 site.cat field. It will be sent as part of site.cat array
- `ortb2.site.pagecat[]`: Standard IAB OpenRTB 2.5 site.pagecat field. It will be sent as part of site.cat array
- `ortb2.site.content.genre`: Standard IAB OpenRTB 2.5 site.content.genre field

AdUnit-specific data using `AdUnit.ortb2Imp` supports following fields:

- `ortb2.imp[].ext.data.*`
- `ortb2.imp[].instl`
