---
layout: bidder
title: Geniee Exchange
description: Geniee Exchange Bidder Adapter
biddercode: ex_geniee
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
privacy_sandbox: no
sidebarType: 1
---
## Note

This is the [Geniee](https://geniee.co.jp) *Exchange* Bidder Adapter for Prebid.js.

{: .alert.alert-info :}
Geniee maintains three separate bid adapters. This adapter (`ex_geniee`) is independent of "Geniee SSP" (`ssp_geniee`, `zoneId` based) and "Geniee" (`dsp_geniee`, Geniee DSP) and can be used alongside them.

Please contact us at <aladdin-back@geniee.co.jp> before using the adapter. `partnerId` values are publisher-specific and are issued by Geniee; a generic value will not return bids.

Ads are served when all of the following conditions are satisfied:

- The ad unit declares `mediaTypes.banner` with valid sizes, or `mediaTypes.video` with `mimes` (see [Video](#video)). Native-only ad units are rejected. Native and audio parts of a multiformat ad unit are dropped. A multiformat ad unit (banner + video) is sent as one impression carrying both.
- Payment is possible in Japanese yen or US dollars.
- The request contains either `site` (with `site.page`) or `app` (with `app.bundle`).
- GDPR does not apply to the request. The Exchange does not serve GDPR territories, so no request is sent when `gdprApplies` is true. The adapter does not add consent signals itself; values written to `ortb2` by the TCF consent module (`regs.ext.gdpr`, `user.ext.consent`) are passed through with the rest of the first party data.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Example          | Type      |
|---------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|
| `partnerId`   | required | The per-publisher ID issued by Geniee. Must be an integer >= 1 (number only; string forms such as `'123'` are rejected).                                                                                                                                                                                                                                                                                        | `123`            | `integer` |
| `currency`    | optional | Currency setting, `'JPY'` or `'USD'`. When omitted, the currency module's `adServerCurrency` is used, then `'USD'`. If the resolved currency is neither `JPY` nor `USD`, no request is sent.                                                                                                                                                                                                                    | `'JPY'`          | `string`  |
| `placementId` | optional | Reporting label for the ad unit, defined by the publisher (not issued by Geniee). Use a fixed value per ad unit; if omitted, Geniee reports cannot be broken down by ad unit. Alphanumeric, hyphen and underscore, max 40 characters, case-insensitive. Sent as `imp.tagid`. If the value violates these rules, the request is still bid on, but reports cannot be broken down correctly by that `placementId`. | `'top-banner_1'` | `string`  |

## Video

{: .table .table-bordered .table-striped }
| `mediaTypes.video` field                  | Scope       | Notes                                                              |
|-------------------------------------------|-------------|--------------------------------------------------------------------|
| `mimes`                                   | required    | Non-empty array of MIME types.                                     |
| `playerSize`                              | recommended | Sent as `imp.video.w`/`imp.video.h`.                               |
| `plcmt`                                   | recommended | Passed to demand partners as is; the Exchange does not fill it in. |
| `minduration`, `maxduration`, `protocols` | recommended | Some demand partners require them.                                 |

- If the video part has no `mimes`, a multiformat ad unit is sent as banner only and a video-only ad unit is rejected.
- Geniee does not provide an outstream renderer. You will need to set up your own. See [Show Outstream Video Ads](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html) for more information.
- A video bid takes `w`/`h` from the response when both are present, otherwise both from `playerSize`; without `playerSize`, a missing `w` or `h` is 0.
- Floors: with the Price Floors module, a multiformat ad unit sends the lower of its banner and video floors as `imp.bidfloor`; if either has no floor, no floor is sent.

### Video Caching

Note that the Geniee Exchange adapter expects a client-side Prebid Cache to be enabled for video bidding.

```javascript
pbjs.setConfig({
    cache: {
        url: 'https://prebid.example.com/pbc/v1/cache'
    }
});
```

## First Party Data

`ortb2` and `ortb2Imp` first party data are included in the OpenRTB request. Note the following:

- `imp.tagid` set through `ortb2Imp` is overridden when `params.placementId` is set.
- `ortb2Imp.video` is sent only when the ad unit declares `mediaTypes.video` with `mimes`; otherwise it is dropped.
- `ortb2Imp.native` and `ortb2Imp.audio` are never sent.
- User IDs are read from `user.ext.eids` and mirrored to `user.eids`.
- The Exchange runs a first price auction only. If `at` is set to any value other than `1` through `ortb2`, no request is sent.

## OpenRTB Blocking

Support for OpenRTB blocking parameters is partial. All four parameters below are forwarded to demand partners, but only `badv` and `bapp` are enforced by the Exchange when it filters bid responses. `bcat` and `battr` are passed on to demand partners only; the Exchange does not reject a bid that violates them, so blocking depends on each demand partner honoring the value. Set them through first party data; the adapter passes them to the Exchange unchanged.

{: .table .table-bordered .table-striped }
| Parameter | Where to set                                    | Forwarded to demand partners | Enforced on bid responses by the Exchange |
|-----------|-------------------------------------------------|------------------------------|-------------------------------------------|
| `badv`    | `ortb2.badv`                                    | yes                          | yes                                       |
| `bapp`    | `ortb2.bapp`                                    | yes                          | yes                                       |
| `bcat`    | `ortb2.bcat`                                    | yes                          | no                                        |
| `battr`   | `ortb2Imp.banner.battr`, `ortb2Imp.video.battr` | yes                          | no                                        |

Notes:

- `badv`: every listed domain is checked against the winning bid's advertiser domains. A bid whose advertiser domain contains a listed value is dropped, so `example.com` also blocks subdomains such as `ads.example.com`. An empty array is forwarded as an explicit "nothing blocked" declaration.
- `bapp`: matched case-insensitively against the bid's app bundle.
- `bcat`: only IAB content taxonomy codes with the `IAB` prefix (for example `IAB1`, `IAB26-1`) are forwarded; codes in any other format are dropped.
- `battr`: `banner.battr` and `video.battr` are each sent with their media type.

## User Sync

On a winning response the Exchange returns a single cookie-sync URL, which the adapter registers as an iframe sync. Only the iframe type is supported; no sync is registered on a no-bid.

Prebid disables iframe syncs by default, so publishers must allow them for this bidder:

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ['ex_geniee'],
                filter: 'include'
            }
        }
    }
});
```
