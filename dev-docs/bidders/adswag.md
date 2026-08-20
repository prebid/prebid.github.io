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

The Adswag bid adapter connects a Prebid.js or Prebid Server auction to the
Adswag bid endpoint. It is available **client-side** (Prebid.js) and
**server-side** (Prebid Server, Go and Java), supporting **banner, video**
(instream and outstream) and **audio** media types, including mixed-format ad
units (the adapter bids on any valid media type in the unit); server-side,
both site and app requests are supported. TCF (IAB
Europe vendor **1417**) and GPP consent strings are forwarded to the
endpoint; the platform parses consent once at the edge. Consentless traffic
is served contextually — no identifier is read, written, or forwarded
without consent.

Publisher-side, the adapter is **fail-open**: any error results in a clean
no-bid and never blocks the page or the auction.

**Outstream note:** ad units with `mediaTypes.video.context: "outstream"` get
an Adswag renderer attached automatically — nothing is downloaded unless an
Adswag outstream bid wins. It plays the VAST in the ad unit's div, starts
muted with click-to-unmute, and collapses the slot when the ad finishes,
errors, or no ad is available. Supplying your own `renderer` on the ad unit
or on `mediaTypes.video` overrides it (a `backupOnly: true` renderer keeps
ours, per Prebid convention). Instream video returns standard
`vastXml`/`vastUrl` for your video player / ad server integration.

**Audio note:** audio units are supported via `mediaTypes.audio`
(`FEATURES.AUDIO` build flag; `mimes` required) or, for setups whose ad
server needs a video-typed unit, via `ortb2Imp.audio`. Prebid has no
built-in audio renderer: hand the returned VAST to your audio player.

**Currency note:** Adswag bids in **EUR** (`currency: "EUR"` on every bid).
Publishers whose ad-server currency is not EUR should include the Prebid
[currency module](https://docs.prebid.org/dev-docs/modules/currency.html).

**First-party data:** publisher FPD set via `setConfig({ ortb2 })` is read
from the bid request — the `site` (page/domain/content), `device` and `regs`
objects are forwarded to the endpoint, as are `ortb2Imp.ext.gpid`,
`ortb2Imp.ext.tid` and `ortb2Imp.ext.data.pbadslot` per impression.

From `ortb2.user`, **only extended identifiers are forwarded** (`user.eids` /
`user.ext.eids`, merged with the `userId` modules' `userIdAsEids` and gated on
consent). Other `user` FPD — `user.data`, `user.keywords`, `user.yob`,
`user.gender` and the like — is deliberately **not** sent: Adswag does not
consume audience data attached to the user object, and forwarding it would
move publisher audience signal across a consent boundary for fields the
endpoint never reads. Contextual and inventory-level audience signal belongs
on `site` / `ortb2Imp` instead, both of which are forwarded in full.

No OpenRTB blocking parameters (`bcat`/`badv`/`battr`/`bapp`) are consumed.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                  | Example               | Type     |
|---------------|----------|----------------------------------------------------------------------------------------------|-----------------------|----------|
| `publisherId` | required | Adswag publisher id (issued at onboarding). Resolves the canonical publisher at the edge.    | `"pub-nl-news-1"`     | `string` |
| `placementId` | optional | Explicit placement override. Omit to let Adswag discover the placement from GPID/adUnitCode. | `"plc-homepage-mrec"` | `string` |
| `bidFloor`    | optional | Static floor (EUR) used only when the Prebid Price Floors module is not configured.          | `0.50`                | `number` |
| `video`       | optional | Overrides for `mediaTypes.video` ad-unit params (Prebid video-params convention).            | `{ maxduration: 15 }` | `object` |

Placement identity on prebid paths is **publisher-id-only** by design: supply
the standardized GPID (`ortb2Imp.ext.gpid`) via the GPID module (or rely on the
`adUnitCode`) and Adswag discovers and curates the placement. Hand-maintained
placement ids are not required.

## Video params

Video parameters are read from `mediaTypes.video` on the ad unit;
`params.video` on the bid overrides them. `mimes` is **required** for a video
bid. The adapter reads the standard Prebid video params (`mimes`,
`minduration`, `maxduration`, `protocols`, `startdelay`, `placement`,
`plcmt`, `skip`, `skipafter`, `minbitrate`, `maxbitrate`, `delivery`,
`playbackmethod`, `api`, `linearity`, `playerSize`, `context`) and forwards
the subset the Adswag platform consumes (`mimes`, `minduration`,
`maxduration`, `protocols`, `playerSize` → `w`/`h`, `plcmt` — derived from
`context` when not set explicitly — `linearity`, `skip`, `skipafter`).

## Audio params

Audio parameters are read from `mediaTypes.audio` (or `ortb2Imp.audio`).
`mimes` is **required** for an audio bid; the platform additionally consumes
`minduration`, `maxduration`, `minbitrate`, `maxbitrate`, `protocols` and
`feed`.

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

- **TCF v2.2**: the adapter forwards `gdprConsent.consentString` and
  `gdprConsent.gdprApplies`. Ensure your CMP includes Adswag (vendor 1417).
- **GPP**: `gppConsent` is forwarded unparsed.
- **User IDs**: with consent (vendor 1417), the adapter forwards eids from
  Prebid userId modules and publisher first-party data (`ortb2`), and
  maintains an Adswag first-party id (`adswag_uuid`, eid source
  `adswag.ai`) through Prebid's StorageManager — respecting `deviceAccess`
  and TCF purpose-1 enforcement. Storage use is declared in the IAB GVL
  device-storage disclosure for vendor 1417.
- **User syncs**: registered via `getUserSyncs` only (one iframe or image
  sync per auction, on `ev.adswag.ai`), honoring your `userSync`
  configuration and GDPR/GPP/USP consent. No sync is registered for
  consentless traffic.
- **Consentless traffic** is served contextually: no identifiers are read,
  written, or forwarded.
