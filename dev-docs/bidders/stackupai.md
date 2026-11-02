---
layout: bidder
title: StackUp AI
description: StackUp AI Prebid Bidder Adapter
biddercode: stackupai
pbjs: true
pbs: false
media_types: banner, video
tcfeu_supported: false
safeframes_ok: true
floors_supported: true
deals_supported: true
fpd_supported: true
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The StackUp AI adapter sends one OpenRTB request per auction to the StackUp ad server, with one imp per ad unit.

Use the bidder code `stackupai` directly. Don't alias it (`pbjs.aliasBidder('stackupai', ...)`): aliased requests don't get bids.

To get a supply tag ID for your placements, contact <support@stackup-ai.com>.

### GDPR

StackUp AI is not yet registered with the IAB TCF, so the adapter declares no GVL ID. When GDPR applies and the TCF control module enforces its default rules, the `stackupai` bidder is blocked on that traffic. Traffic where GDPR doesn't apply is unaffected.

### First Party Data

Publishers should use the `ortb2` and `ortb2Imp` methods of setting first party data. The adapter passes them to StackUp AI in the OpenRTB request.

### Timeout Notifications

When StackUp AI's response misses the auction timeout, the adapter sends one POST per auction to `events.<endpoint host>/e/timeout` with the timed-out bid IDs, their `tag` and the timeout in milliseconds. It is sent without cookies.

### Bid Params

{: .table .table-bordered .table-striped }

| Name  | Scope    | Description                                                     | Example      | Type     |
|-------|----------|-----------------------------------------------------------------|--------------|----------|
| `tag` | required | Supply tag ID for this placement (`[A-Za-z0-9_-]`, up to 128 characters) | `'test-tag'` | `string` |

### Video

StackUp AI returns video bids as inline VAST (`vastXml`), with no `vastUrl`. Prebid.js drops vastXml-only video bids unless a cache is configured, so set one of:

```javascript
pbjs.setConfig({ cache: { url: 'https://prebid.example.com/pbc/v1/cache' } }); // Prebid Cache
pbjs.setConfig({ cache: { useLocal: true } });                                 // in-browser cache
```

### AdUnit Examples

#### Banner

```javascript
var adUnits = [{
  code: 'banner-1',
  mediaTypes: {
    banner: { sizes: [[300, 250]] }
  },
  bids: [{
    bidder: 'stackupai',
    params: { tag: 'test-tag' }
  }]
}];
```

#### Video

```javascript
var adUnits = [{
  code: 'video-1',
  mediaTypes: {
    video: {
      context: 'instream',
      playerSize: [[640, 480]],
      mimes: ['video/mp4'],
      protocols: [2, 3, 5, 6]
    }
  },
  bids: [{
    bidder: 'stackupai',
    params: { tag: 'test-tag' }
  }]
}];
```
