---
layout: bidder
title: Asterio
description: Prebid Asterio Bidder Adapter
biddercode: asterio
pbjs: true
pbs: false
media_types: banner, video, native
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
userId: none
safeframes_ok: false
deals_supported: true
floors_supported: true
fpd_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `adUnitToken` | required | Ad unit token provided by Asterio. | `'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'` | `string` |
| `pos` | optional | Ad position hint. Allowed values follow OpenRTB position conventions, e.g. above the fold: `1`, below the fold: `3`, middle of the fold: `7`. | `1` | `integer` |

## Banner Test Ad Unit

```javascript
var adUnits = [{
  code: 'test-banner',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'asterio',
    params: {
      adUnitToken: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
  }]
}];
```

## Video Test Ad Unit

```javascript
var adUnits = [{
  code: 'test-video',
  mediaTypes: {
    video: {
      context: 'outstream',
      playerSize: [640, 360],
      mimes: ['video/mp4'],
      protocols: [2, 3],
      playbackmethod: [2],
      plcmt: 4
    }
  },
  bids: [{
    bidder: 'asterio',
    params: {
      adUnitToken: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
  }]
}];
```

## Native Test Ad Unit

Asterio uses `adUnitToken` to resolve the ad unit and format. For native ad units, include `mediaTypes.native` and render the returned native assets in the publisher layout. See the [Prebid Native Implementation Guide](/prebid/native-implementation.html) for rendering options.

```javascript
var adUnits = [{
  code: 'test-native',
  mediaTypes: {
    native: {}
  },
  bids: [{
    bidder: 'asterio',
    params: {
      adUnitToken: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
  }]
}];
```
