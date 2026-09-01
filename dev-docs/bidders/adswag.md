---
layout: bidder
title: Adswag
description: Prebid Adswag Bidder Adapter
biddercode: adswag
media_types: banner, video, audio
multiformat_supported: will-bid-on-any
tcfeu_supported: true
dsa_supported: true
gvl_id: 1417
usp_supported: false
gpp_sids: tcfeu
userId: all
coppa_supported: false
schain_supported: true
dchain_supported: false
prebid_member: false
floors_supported: true
fpd_supported: true
ortb_blocking_supported: false
safeframes_ok: true
deals_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
privacy_sandbox: no
sidebarType: 1
---

## Note

Maintainer contact: [prebid@adswag.ai](mailto:prebid@adswag.ai)

Adswag bids in **EUR** on every bid. Publishers whose ad-server currency is
not EUR should include the Prebid
[currency module](https://docs.prebid.org/dev-docs/modules/currency.html).

Outstream video units get an Adswag renderer attached automatically: nothing
is downloaded unless an Adswag outstream bid wins, and a publisher-supplied
`renderer` overrides it per Prebid convention.

Audio requires the `FEATURES.AUDIO` build flag and `mimes`; Prebid has no
built-in audio renderer, so hand the returned VAST to your audio player.

From `ortb2.user` only extended identifiers (`user.eids` / `user.ext.eids`)
are forwarded, gated on consent; other `user` first-party data is not sent.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                  | Example               | Type     |
|---------------|----------|----------------------------------------------------------------------------------------------|-----------------------|----------|
| `publisherId` | required | Adswag publisher id (issued at onboarding). Resolves the canonical publisher at the edge.    | `"pub-nl-news-1"`     | `string` |
| `placementId` | optional | Explicit placement override. Omit to let Adswag discover the placement from GPID/adUnitCode. | `"plc-homepage-mrec"` | `string` |
| `bidFloor`    | optional | Static floor (EUR) used only when the Prebid Price Floors module is not configured.          | `0.50`                | `number` |
| `video`       | optional | Overrides for `mediaTypes.video` ad-unit params (Prebid video-params convention).            | `{ maxduration: 15 }` | `object` |

## Video params

Standard Prebid video params are read from `mediaTypes.video` (with
`params.video` overrides); `mimes` is required. The endpoint consumes
`mimes`, `minduration`, `maxduration`, `protocols`, `playerSize` (as
`w`/`h`), `plcmt` (derived from `context` when not set explicitly),
`linearity`, `skip` and `skipafter`.

## Example ad units

```javascript
var adUnits = [
  {
    code: "div-gpt-ad-homepage-mrec",
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600]]
      }
    },
    ortb2Imp: {
      ext: { gpid: "/1234/homepage#mrec" }
    },
    bids: [
      {
        bidder: "adswag",
        params: {
          publisherId: "pub-nl-news-1"
        }
      }
    ]
  },
  {
    code: "video-player-1",
    mediaTypes: {
      video: {
        context: "instream",
        playerSize: [[640, 480]],
        mimes: ["video/mp4"],
        minduration: 5,
        maxduration: 30,
        protocols: [2, 3, 7, 8]
      }
    },
    ortb2Imp: {
      ext: { gpid: "/1234/article#player" }
    },
    bids: [
      {
        bidder: "adswag",
        params: {
          publisherId: "pub-nl-news-1"
        }
      }
    ]
  },
  {
    code: "audio-slot-1",
    mediaTypes: {
      audio: {
        mimes: ["audio/mpeg", "audio/mp4"],
        minduration: 10,
        maxduration: 30,
        protocols: [2, 3, 7, 8]
      }
    },
    bids: [
      {
        bidder: "adswag",
        params: {
          publisherId: "pub-nl-news-1"
        }
      }
    ]
  }
];
```

## Privacy / consent / identity

Consentless traffic is served contextually: no identifiers are read,
written, or forwarded. Enabling user syncs is recommended (registered via
`getUserSyncs`, one iframe or image sync per auction on `ev.adswag.ai`,
honoring your `userSync` configuration and GDPR/GPP/USP consent).
