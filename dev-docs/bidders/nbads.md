---
layout: bidder
title: nbads(NexBids)
description: Prebid nbads(NexBids) Bidder Adapter
biddercode: nbads
media_types: video, native
tcfeu_supported: false
gvl_id: none
usp_supported: true
gpp_sids: usnat, usstate_all, usp
coppa_supported: true
schain_supported: true
dchain_supported: false
floors_supported: true
fpd_supported: true
ortb_blocking_supported: partial
safeframes_ok: false
deals_supported: true
multiformat_supported: will-bid-on-any
pbjs: true
pbs: false
sidebarType: 1
---

### Registration

Contact [NexBids](https://nexbids.com/) for a publisher account and placement codes.
Register each site's domain with NexBids;
the gateway validates the page origin and the placement's permitted media formats.

### Bid parameters

{: .table .table-bordered .table-striped }

| Parameter | Required | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `publisherId` | If the standard publisher ID is absent | Overrides `ortb2.site.publisher.id`, `ortb2.app.publisher.id`, or `ortb2.dooh.publisher.id`. | `'Pub-d253acc11ce4b315'` | `string` |
| `adUnitCode` | If `ortb2Imp.tagid` is absent | Overrides `ortb2Imp.tagid`. Use the complete registered placement code, including `Unit-`. | `'Unit-59c572bf7ac1ebb1'` | `string` |

Each parameter can be omitted independently when its corresponding standard field
is present. Resolved publisher and placement identifiers must be nonempty strings.
When the publisher ID is configured through `ortb2.site.publisher.id` and the ad
unit sets `ortb2Imp.tagid`, its bidder entry can be
`{ bidder: 'nbads', params: {} }`.

Responses without an OpenRTB `cur` default to `USD`; explicitly returned
currencies are preserved.

### Configuration

{: .table .table-bordered .table-striped }

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `nbads.env` | `string` | `'prod'` | `'prod'` selects `https://us.nexbids.com`; `'test'` selects the integration gateway `https://test.ssp.nexbids.com`. Integration testing requires separately assigned IDs. Custom endpoints are not supported. |

```javascript
pbjs.setConfig({ nbads: { env: 'prod' } });
```

### Media configuration

- Declare banner sizes in `mediaTypes.banner.sizes`.
- For video, declare `mediaTypes.video.playerSize` and the standard OpenRTB video
  fields. Outstream requires a publisher-provided `renderer`; the adapter does not
  supply a player. Responses contain VAST XML, so ad-server delivery requires a
  configured [Prebid video cache](/dev-docs/publisher-api-reference/setConfig.html#client-side-caching-of-vast-xml).
  A publisher whose own player consumes XML directly can explicitly set
  `cache.allowVastXmlOnly: true` instead.
- Declare native assets in `mediaTypes.native.ortb`. Include
  [nativeRendering](/dev-docs/modules/nativeRendering.html) when using Prebid's
  native renderer.
- For mixed-format ad units, requests are batched by publisher and enabled media
  format. Each format can bid independently, subject to the placement's registered
  format allowlist.

### Examples

The following production review placements use publisher `Pub-d253acc11ce4b315`
and the registered page origin `https://test.ssp.nexbids.com`. They must be used
with `nbads.env: 'prod'`; they are not integration-test gateway IDs. A registered
origin does not guarantee demand or a bid for every format or region.

```javascript
pbjs.setConfig({ nbads: { env: 'prod' } });

pbjs.addAdUnits([
  {
    code: 'div-nbads-banner',
    mediaTypes: {
      banner: { sizes: [[320, 50]] }
    },
    bids: [{
      bidder: 'nbads',
      params: {
        publisherId: 'Pub-d253acc11ce4b315',
        adUnitCode: 'Unit-59c572bf7ac1ebb1'
      }
    }]
  },
  {
    code: 'div-nbads-video',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [[1280, 720]],
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6],
        plcmt: 1
      }
    },
    bids: [{
      bidder: 'nbads',
      params: {
        publisherId: 'Pub-d253acc11ce4b315',
        adUnitCode: 'Unit-570416538ad202ef'
      }
    }]
  },
  {
    code: 'div-nbads-native',
    mediaTypes: {
      native: {
        ortb: {
          ver: '1.2',
          assets: [
            { id: 1, required: 1, title: { len: 90 } },
            { id: 2, required: 1, img: { type: 3, w: 300, h: 157 } },
            { id: 3, required: 0, data: { type: 2 } }
          ]
        }
      }
    },
    bids: [{
      bidder: 'nbads',
      params: {
        publisherId: 'Pub-d253acc11ce4b315',
        adUnitCode: 'Unit-156842bb1da61c0f'
      }
    }]
  }
]);
```

### First-party data and privacy

First-party data supplied through Prebid's `ortb2` and `ortb2Imp` fields is
forwarded through the standard OpenRTB converter, including publisher, site,
content, and user data. Supply chain information, EIDs, and privacy signals also
use standard Prebid fields. Blocking fields such as `badv`, `bcat`, `bapp`, and
impression-level `battr` are forwarded; blocking support is partial.

NexBids does not currently have an IAB GVL ID and does not declare TCF-EU support.

Creative viewability measurement requires a same-origin iframe. Do not use
SafeFrame or another cross-origin creative frame.
