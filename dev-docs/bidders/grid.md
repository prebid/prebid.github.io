---
layout: bidder
title: TheMediaGrid
description: Prebid TheMediaGrid Bidder Adaptor
pbjs: true
pbs: true
biddercode: grid
media_types: banner, video, native (s2s only)
multiformat_supported: will-bid-on-any
gvl_id: 686
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
coppa_supported: true
fpd_supported: true
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Bid Params](#bid-params)
- [Bidder Config](#bidder-config)
- [First Party Data](#first-party-data)
- [Native setup example (s2s only)](#native-setup-example-s2s-only)

<a name="grid-bid-params"></a>

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                 | Example                                   | Type      |
|----------------|----------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`          | required | Represents the MediaGrid bidder system Ad Slot ID associated with the respective div id from the site page. | `1`                                       | `integer` |
| `bidFloor`     | optional | Floor of the impression opportunity. If present in the request overrides XML info.                          | `0.8`                                     | `float`   |

<a name="grid-bidder-config"></a>

### Bidder Config

You can allow writing in localStorage `pbjs.setBidderConfig` for the bidder `grid`

```javascript
pbjs.setBidderConfig({
    bidders: ["grid"],
    config: {
        localStorageWriteAllowed: true
    }
})
```

If it will be "true" this allow TheMediaGrid Bid Adapter to write userId in first party localStorage

<a name="grid-first-party"></a>

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

<a name="grid-native-example"></a>

### Native setup example (s2s only)

Setup native in adUnit mediaTypes, for example:

```javascript
...
mediaTypes: {
  native: {
    ortb: {
      ver: '1.2',
      "assets": [
        {
          "id": 1,
          "img": {
            "hmin": 180,
            "wmin": 216,
            "type": 3
          },
          "required": 1
        },
        {
          "title": {
            "len": 140
          },
          "id": 2,
          "required": 1
        },
        {
          "id": 3,
          "data": {
            "len": 25,
            "type": 1
          },
          "required": 1
        }
      ],
    }
  }
},
...
```
