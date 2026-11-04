---
layout: bidder
title: LuponMedia
description: LuponMedia Bidder Adapter
pbjs: true
biddercode: luponmedia
gvl_id: 1132
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
userIds: all
media_types: banner, video, native
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Note

The LuponMedia bidder adapter requires setup and approval from the LuponMedia support team, even for existing LuponMedia publishers. Please contact us at [info@luponmedia.com](mailto:info@luponmedia.com).

Each ad unit sends an integration key issued by LuponMedia. All bids are returned under the `luponmedia` bidder code.

## Bid Params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type     |
|-------|----------|---------------------------------|----------|----------|
| `key` | required | Integration key from LuponMedia | `'acme'` | `string` |

## Banner

```javascript
var adUnits = [{
  code: 'div-mpu',
  mediaTypes: { banner: { sizes: [[300, 250], [300, 600]] } },
  bids: [{ bidder: 'luponmedia', params: { key: 'acme' } }]
}];
```

## Outstream Video

Only outstream video is supported. Bids carry VAST XML and play in Prebid's outstream renderer inside the ad unit's div (its id must be the ad unit code), unless the ad unit sets its own `renderer`. Video and native ad units need their own key from LuponMedia.

```javascript
var adUnits = [{
  code: 'div-outstream',
  mediaTypes: {
    video: {
      context: 'outstream',
      playerSize: [[640, 360]],
      mimes: ['video/mp4', 'video/webm'],
      protocols: [2, 3, 5, 6, 7, 8],
      plcmt: 4,
      maxduration: 30,
      playbackmethod: [6]
    }
  },
  bids: [{ bidder: 'luponmedia', params: { key: 'acme.outstream' } }]
}];
```

## Native

```javascript
var adUnits = [{
  code: 'div-native',
  mediaTypes: {
    native: {
      ortb: {
        assets: [
          { id: 1, required: 1, title: { len: 90 } },
          { id: 2, required: 1, img: { type: 3, wmin: 300, hmin: 157 } },
          { id: 3, required: 1, data: { type: 1 } }
        ]
      }
    }
  },
  bids: [{ bidder: 'luponmedia', params: { key: 'acme.native' } }]
}];
```

## Multiple Bids

The adapter may return several bids per ad unit, highest CPM first. To send more than the best `luponmedia` bid to the ad server, enable the `multibid` module:

```javascript
pbjs.setConfig({
  multibid: [{ bidder: 'luponmedia', maxBids: 3, targetBiddercodePrefix: 'lupon' }]
});
```

## User Sync

Enable iframe user syncs for `luponmedia`:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: { bidders: ['luponmedia'], filter: 'include' }
    }
  }
});
```
