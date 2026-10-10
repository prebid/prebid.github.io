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

Adswag bids in **EUR**. If your ad-server currency is not EUR, include the
Prebid [currency module](https://docs.prebid.org/dev-docs/modules/currency.html).

Outstream video units get the Adswag renderer attached to the winning bid.
A `renderer` you set on the ad unit takes precedence.

Audio requires the `FEATURES.AUDIO` build flag and `mimes`. Hand the
returned VAST to your audio player.

First-party data is forwarded the standard Prebid way: `ortb2.site` (page
and content keys), `ortb2Imp.ext.data` or the `kv` bid param (ad unit keys,
sent as `imp.ext.data`; `kv` wins when a key is in both), and `ortb2.user.data` / `ortb2.user.ext.data` (user
keys, forwarded with identity consent, like eids). Declare each key in your
Adswag account before you send it.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                  | Example               | Type     |
|---------------|----------|----------------------------------------------------------------------------------------------|-----------------------|----------|
| `publisherId` | required | Your Adswag publisher id.                                                                    | `"pub-nl-news-1"`     | `string` |
| `placementId` | optional | Names the placement. Omit it and the placement is discovered from GPID or the ad unit code.  | `"plc-homepage-mrec"` | `string` |
| `bidFloor`    | optional | Floor in EUR, used when the Prebid Price Floors module is not configured.                    | `0.50`                | `number` |
| `video`       | optional | Overrides for `mediaTypes.video` params.                                                     | `{ maxduration: 15 }` | `object` |
| `kv`          | optional | Key/values for this ad unit, sent as `imp.ext.data`. Strings, numbers, or arrays of those.   | `{ section: "news" }` | `object` |

## Video params

Video params are read from `mediaTypes.video`, with `params.video`
overrides; `mimes` is required. Supported: `mimes`, `minduration`,
`maxduration`, `protocols`, `playerSize`, `plcmt` (derived from `context`
when not set), `linearity`, `skip` and `skipafter`.

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

Adswag is TCF vendor 1417; add it to your CMP. With consent, the adapter
forwards eids and keeps an Adswag first-party id through Prebid's
StorageManager. Without consent, traffic is served contextually. The adapter
registers one iframe or image sync per auction on `ev.adswag.ai`, following
your `userSync` configuration and consent; enabling iframe syncing improves
match rates.
