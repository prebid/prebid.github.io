---
layout: bidder
title: Billowlink
description: Prebid Billowlink OpenRTB 2.5 Bidder Adapter
pbjs: true
pbs: false
pbs_app_supported: false
biddercode: billow_rtb25
media_types: banner, video, native
tcfeu_supported: false
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
floors_supported: false
fpd_supported: true
safeframes_ok: true
deals_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
privacy_sandbox: no
gvl_id: none
sidebarType: 1
---

## Note

The Billowlink bidder adapter requires setup and approval before beginning. Please reach out to <support@billowlink.com> for more details.

This adapter sends requests to Billowlink using OpenRTB 2.5. Billowlink bids are returned in USD.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                         | Example                                                | Type                  |
|---------------|----------|-----------------------------------------------------------------------------------------------------|--------------------------------------------------------|-----------------------|
| `placementId` | required | Placement ID configured on the Billowlink side. This value is sent as OpenRTB `imp.tagid`.          | `'12345'`                                              | `string`              |
| `endpoint`    | optional | Overrides the default Billowlink bid endpoint. This is normally only needed for testing or staging. | `'https://adx-sg.billowlink.com/api/rtb/adsWeb'`       | `string`              |

## First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).
The adapter uses Prebid's OpenRTB converter, so standard request-level and impression-level ORTB data can be included in the outgoing request.

## Ad Unit Setup for Banner

```javascript
var adUnits = [{
  code: 'div-gpt-ad-123456-1',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [728, 90]]
    }
  },
  bids: [{
    bidder: 'billow_rtb25',
    params: {
      placementId: '12345'
    }
  }]
}];
```

## Ad Unit Setup for Video

```javascript
var adUnits = [{
  code: 'video-ad-unit',
  mediaTypes: {
    video: {
      context: 'instream',
      playerSize: [640, 480],
      mimes: ['video/mp4'],
      minduration: 1,
      maxduration: 120,
      protocols: [2, 3, 5, 6]
    }
  },
  bids: [{
    bidder: 'billow_rtb25',
    params: {
      placementId: 'video-placement-123'
    }
  }]
}];
```

For outstream video, publishers must provide a renderer through the ad unit or use their standard video integration.

## Ad Unit Setup for Native

```javascript
var adUnits = [{
  code: 'native-ad-unit',
  mediaTypes: {
    native: {
      ortb: {
        ver: '1.2',
        assets: [
          { id: 1, required: 1, title: { len: 80 } },
          { id: 2, required: 1, img: { type: 3, wmin: 100, hmin: 100 } }
        ]
      }
    }
  },
  bids: [{
    bidder: 'billow_rtb25',
    params: {
      placementId: 'native-placement-123'
    }
  }]
}];
```

## Endpoint Override

```javascript
var adUnits = [{
  code: 'div-gpt-ad-123456-2',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'billow_rtb25',
    params: {
      placementId: '12345',
      endpoint: 'https://adx-sg.billowlink.com/api/rtb/adsWeb'
    }
  }]
}];
```
