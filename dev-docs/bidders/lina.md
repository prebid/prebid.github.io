---
layout: bidder
title: LINA
description: Prebid.js LINA Bidder Adapter
biddercode: lina
pbjs: true
pbs: false
media_types: video, native
multiformat_supported: will-bid-on-any
tcfeu_supported: false
usp_supported: false
floors_supported: false
userId: none
sidebarType: 1
---

<!--
Submission draft for prebid/prebid.github.io: dev-docs/bidders/lina.md.
Before opening the documentation PR:
- Configure and verify the adapter's deployed HTTPS endpoint and browser CORS.
  The fixed endpoint is https://ssp-api.qa.web3lge.com/v1/prebid/bids (QA).
- Verify deployed test inventory and creative supply for every declared format
  using the test parameters in modules/linaBidAdapter.md.
- Validate the examples with the target Prebid.js release, including auction ID
  handling, video caching/player integration, native rendering, and multi-format.
- Verify backend behavior before declaring GPP sections, COPPA, supply chain,
  first-party data, deals, SafeFrame, or OpenRTB blocking support in metadata.
  Omitted fields are unconfirmed. TCF-EU and USP support are not declared.
  Do not add a GVL ID until a real vendor registration has been confirmed.
- Link the code and documentation PRs and remove this comment before publication.
-->

<!-- markdownlint-disable-next-line MD001 -->
### Note

LINA connects Prebid.js to LINA SSP for client-side Banner, Video, and Native
auctions. An active LINA publisher account and registered placements are required.
Contact LINA SSP at [linadev@lge.com](mailto:linadev@lge.com) to obtain your `publisherId` and
`placementId` and confirm the formats and sizes enabled for each placement.

Include `linaBidAdapter` in your Prebid.js build. The examples below configure Ad
Units; use them with your page's existing auction and ad server integration. See
the [Prebid.js developer getting started guide](https://docs.prebid.org/dev-docs/getting-started.html)
for the common setup flow.

### SSP Endpoint

The adapter uses the fixed HTTPS endpoint
`https://ssp-api.qa.web3lge.com/v1/prebid/bids` (QA).
Endpoint overrides are not supported.

Requests send a JSON body with `Content-Type: text/plain` and no custom headers.
The body field `publisherId` is the only publisher integration key;
`X-App-Key` is not used and cannot replace a missing `publisherId`.
The SSP must allow the page origin through CORS and return
`Access-Control-Allow-Credentials: true`. Confirm SSP support for this body-only
contract before using this adapter version. Responses remain JSON.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `publisherId` | required | The public integration key (`app_key`), not the account UUID or login password. | `'<SSP-issued publisherId>'` | `string` |
| `placementId` | required | The placement UUID, independent of media types. It must be active and belong to the publisher. | `'<SSP-issued placementId>'` | `string` |

Replace all `<SSP-issued ...>` placeholders with values issued for your account.
These placeholders are illustrative and do not identify test inventory.

The Ad Unit's `code` identifies the slot in your page. It is separate from the
SSP-issued `placementId`. Media types and sizes belong in `mediaTypes`, not in
LINA bidder parameters.

When using several placements in the same auction, use placements registered to
the same site for each publisher. LINA SSP rejects a batch that combines
placements from different sites under the same publisher.

Transaction ID sharing is optional. LINA accepts requests when Prebid does not
share TIDs. When shared, `ortb2.source.tid` and `ortb2Imp.ext.tid` are preserved;
missing TIDs are left unset. LINA SSP uses a separate request ID for its own
request tracking. You do not need to enable TID sharing to use LINA.

### Banner Example

Configure sizes that your page can display and that are enabled for the LINA
placement. Width and height must be positive integers. LINA SSP forwards only
sizes that match the placement; a request with no matching Banner size is
rejected.

```javascript
const bannerAdUnit = {
  code: 'lina-banner-top',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'lina',
    params: {
      publisherId: '<SSP-issued publisherId>',
      placementId: '<SSP-issued banner placementId>'
    }
  }]
};
```

Add this Ad Unit to your Prebid configuration inside the Prebid command queue:

```javascript
window.pbjs = window.pbjs || { que: [] };
window.pbjs.que.push(function () {
  window.pbjs.addAdUnits([bannerAdUnit]);
});
```

Run `pbjs.requestBids()` through your normal auction flow and pass the resulting
targeting to your ad server. A Bid response alone does not display the creative;
the page's ad server or rendering integration must select and render it.

### Video Example

Use a placement enabled for Video and configure a player size supported by the
placement. This example configures an instream Ad Unit; player, cache, and ad
server setup must be completed for your integration.

```javascript
const videoAdUnit = {
  code: 'lina-video-player',
  mediaTypes: {
    video: {
      context: 'instream',
      playerSize: [[1280, 720]],
      mimes: ['video/mp4'],
      protocols: [2, 3],
      minduration: 5,
      maxduration: 30
    }
  },
  bids: [{
    bidder: 'lina',
    params: {
      publisherId: '<SSP-issued publisherId>',
      placementId: '<SSP-issued video placementId>'
    }
  }]
};
```

The adapter accepts `playerSize` as `[width, height]` or an array of sizes and
uses the first valid positive-integer size. It does not retry another size if
that size is incompatible with the LINA placement.

{: .table .table-bordered .table-striped }

| Video field | When omitted | Requirements |
| --- | --- | --- |
| `mimes` | Required; no default. | A non-empty array of nonblank MIME types supported by your player. |
| `protocols` | Not sent unless supplied in `ortb2Imp.video`. | If supplied, a non-empty array of positive-integer OpenRTB VAST protocol values. |
| `minduration` | Not sent unless supplied in `ortb2Imp.video`. | If supplied, a nonnegative integer, in seconds; `0` is valid. |
| `maxduration` | Not sent unless supplied in `ortb2Imp.video`. | If supplied, a nonnegative integer, at least as large as a supplied `minduration`. |

Explicit fields in `mediaTypes.video` override corresponding `ortb2Imp.video`
fields; omitted fields retain their OpenRTB values. The adapter does not infer
MIME types, protocols, or durations. Explicit empty or invalid values reject the
LINA bid.

LINA returns inline VAST XML as `vastXml`. Configure compatible video caching
and playback, or set `cache.allowVastXmlOnly: true` only when your player can
consume raw VAST XML. See [Prebid cache configuration](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#client-side-caching-of-vast-xml).
LINA does not supply an outstream renderer; an outstream integration requires
a compatible publisher-supplied renderer.

### Native Example

Define Native assets using OpenRTB Native in `mediaTypes.native.ortb`. The
`assets` array must be non-empty. Each asset must have a unique non-negative
integer `id`, exactly one asset type, and the required fields for that type.

```javascript
const nativeAdUnit = {
  code: 'lina-native-feed',
  mediaTypes: {
    native: {
      ortb: {
        ver: '1.2',
        assets: [
          { id: 1, required: 1, title: { len: 80 } },
          { id: 2, required: 1, img: { type: 3, wmin: 300, hmin: 169 } },
          { id: 3, required: 1, data: { type: 1 } }
        ]
      }
    }
  },
  bids: [{
    bidder: 'lina',
    params: {
      publisherId: '<SSP-issued publisherId>',
      placementId: '<SSP-issued native placementId>'
    }
  }]
};
```

LINA returns OpenRTB Native markup as `native.ortb`. Configure a Native template
or creative that can render the requested assets. Include the
[`nativeRendering` module](https://docs.prebid.org/dev-docs/modules/nativeRendering.html)
when rendering Native through `pbjs.renderAd()` or dynamic creatives, or use
Prebid Universal Creative for the corresponding ad server integration.

A Native-only Ad Unit with invalid or missing assets is rejected by the adapter.
In a Multi-format Ad Unit with a valid Banner or Video configuration, invalid
Native assets cause only Native to be omitted.

### Multi-format Example

One LINA placement can have multiple enabled formats. Declare the formats that
your slot can render, using the same `publisherId` and `placementId` for that
placement.

```javascript
const multiFormatAdUnit = {
  code: 'lina-multi-format-slot',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    },
    video: {
      context: 'instream',
      playerSize: [[1280, 720]],
      mimes: ['video/mp4'],
      protocols: [2, 3],
      minduration: 5,
      maxduration: 30
    }
  },
  bids: [{
    bidder: 'lina',
    params: {
      publisherId: '<SSP-issued publisherId>',
      placementId: '<SSP-issued multi-format placementId>'
    }
  }]
};
```

Native can also be included using the Native configuration above. LINA SSP
auctions the requested formats that are enabled for the placement and returns
one winning format per bid request. The page must support rendering every format
it requests; declaring multiple formats does not produce multiple creatives
for one bid request.

### Currency, Pricing, and Floors

LINA SSP manages the publisher currency, placement floor, and applicable fees.
Confirm your account currency when configuring your ad server. The adapter
does not offer bidder parameters to override currency or floors and does not
integrate with the Prebid Floors Module.

An SSP placement floor takes priority, including an explicit zero. When it is
unset, LINA uses `ortb2Imp.bidfloor` from the request. If both are unset or null,
no floor restriction applies. There are no currency-specific default floors.
Floors are publisher Net CPM; LINA converts the selected floor to DSP Gross CPM
using the publisher fee. A positive request floor's `bidfloorcur` must match the
publisher currency. An omitted `bidfloorcur` means USD under OpenRTB; LINA does
not convert a floor between currencies.

Returned CPM is publisher Net CPM after applicable SSP fees, with
`netRevenue: true`. The adapter passes this CPM to Prebid unchanged. A zero fee
rate still produces a Net CPM response.

### Timeout

LINA uses the timeout budget supplied by Prebid. When it is absent, LINA uses
the SSP's configured default, which is 1000ms if not configured. LINA caps the
total budget at 5000ms and reserves 200ms for network and SSP processing before
allocating the remainder to its server-side auction. Budgets of 200ms or less
are rejected. Configure the page's normal Prebid timeout; there is no
LINA-specific bidder timeout parameter.

### Privacy and User Sync

The adapter forwards GDPR applicability and consent strings, GPP strings and
applicable sections, and the COPPA flag when supplied by Prebid. Forwarding
signals alone does not declare production support for a privacy framework;
confirm the deployed service's supported scope with LINA before enabling traffic
that requires it. LINA does not currently declare a GVL ID or TCF-EU support.

The adapter does not access cookies or local storage itself and does not
register user sync pixels or iframes. It does not explicitly map Prebid User ID
module values and does not declare support for User ID providers.

### Troubleshooting

{: .table .table-bordered .table-striped }

| Symptom | What to check |
| --- | --- |
| No LINA request | Ensure the build contains `linaBidAdapter`, both required parameters are populated, and the Ad Unit has a valid media type configuration. |
| Invalid publisher or placement | Confirm the IDs with LINA, that the placement is active and belongs to the publisher, and that batched placements belong to the same site. |
| Rejected media configuration | Check placement formats, Banner sizes, the first selected Video size and playback fields, or Native assets. |
| HTTP 204 or an empty Bid list | This is a normal No Bid result. A valid configuration does not guarantee available demand. |
| Timeout | Check the page's Prebid timeout and network timing. LINA uses the Prebid timeout budget when available; there is no LINA-specific timeout parameter. |
| Browser CORS or network failure | Check the browser Network panel and contact LINA to verify endpoint availability and CORS. |
| Bid received but no ad displayed | Check ad server targeting and creative setup. For Video, verify caching and player integration; for Native, verify the template and rendering integration. |
