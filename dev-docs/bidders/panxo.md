---
layout: bidder
title: Panxo
description: Prebid Panxo Bidder Adapter
biddercode: panxo
tcfeu_supported: true
gvl_id: 1527
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: true
dsa_supported: true
floors_supported: true
fpd_supported: true
media_types: video, native
safeframes_ok: true
deals_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: true
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Before You Begin

`panxoBidAdapter` first shipped in Prebid.js 10.23 and the Panxo provider
`panxoRtdProvider` in 10.25. Both modules use the unchanged core `rtdModule`
dependency.

This documentation covers a proposed update; it is not yet a released version.

Register at [app.panxo.ai](https://app.panxo.ai) to obtain your `propertyKey`
and RTD `siteId`. Build Prebid with `panxoBidAdapter`, `rtdModule` and
`panxoRtdProvider`, then enable the Panxo provider. Do not install a separate
Panxo Signal tag on the page; the provider loads its implementation through
Prebid.

This candidate no longer reads `panxo_uid`, forwards EIDs or emits user sync.
It preserves existing OpenRTB consent fields and continues contextual bidding
without a user ID.

The Panxo RTD provider forwards only the coarse AI visit flag `{ai: true}`
through `site.ext.data.panxo`; false, missing or invalid `ai` produces `{}`.
It discards the bridge's legacy device/user payloads and richer site context.
The bidder independently excludes those identity channels. It remains tolerant of missing RTD data, but
publishers must enable the provider for Panxo AI
classification and RTD-targeted demand.
Configure that provider with `waitForIt: true` and a bounded `auctionDelay` when
its signals must be available to the first auction.

## Property-key migration restriction

This candidate does not support migration of path-scoped zone keys. The
ordinary `/openrtb/2.6/bid` receiver rejects a key whose trusted zone
configuration has a non-root `pathPrefix`, even if a caller supplies
`site.page`. Both JS and PBS intentionally omit `site.page` and `site.ref`;
full URLs or pathnames that may contain identifiers must not be restored as a
workaround.

Before migrating an existing `propertyKey`, confirm its trusted inventory
scope and exclude non-root zone keys from this update. An ordinary host-based
property or root-zone success does not prove section membership. Root-zone
keys retain their host, device and other authorization checks. An unknown key
scope is not evidence of compatibility; do not silently substitute a host or
root-zone key to make a request bid.

Contact Panxo before migrating a path-scoped key; this update does not support
that configuration.

## Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | ---------- | -------------------------------------------------- | ---------------------- | ---------- |
| `propertyKey` | required | Property identifier from Panxo dashboard | `'abc123def456'` | `string` |
| `floor` | deprecated, legacy Prebid.js only | Legacy CPM fallback in USD; use standard Price Floors rules/defaults or an OpenRTB floor for new configurations | `0.50` | `number` |

For new configurations, use publisher-controlled Price Floors rules/defaults
or a static OpenRTB floor. The legacy JS `params.floor` is deprecated but remains
available in USD when no standard floor control is active. Existing fallback
values must not be relabeled as the ad-server currency during migration.

An active Price Floors model controls the floor even when a rule yields zero,
null, no match, an A/B skip or `noFloorSignalBidders`. Those cases do not restore
the legacy bidder fallback. If the module reports no floor data, the existing
fallback remains available. Without active Price Floors control, JS preserves
an explicit `ortb2Imp.bidfloor` and `bidfloorcur` before considering the legacy
parameter; an omitted OpenRTB floor currency means USD.

Panxo transport uses USD. The adapter requests floors in USD and uses Prebid's
configured Currency module to convert any foreign impression or deal floor.
A positive floor without a valid rate causes that impression to be skipped;
the amount is never relabeled, ignored or replaced with a legacy fallback.
Zero can be normalized without a rate. Publisher inputs and other impressions
are preserved. Prebid converts the returned USD bid to the configured ad-server
currency after adapter response validation.

For Prebid Server, configure standard floors through its core or supply OpenRTB
`imp.bidfloor` and `bidfloorcur`. The Server adapter converts copied impression
and deal floors to USD using PBS currency rates, while the exchange retains the
original auction currency. It does not read `params.floor`. Migrate the legacy
value to an equivalent standard
rule/default before changing routes; `floorMin` is a mandatory minimum and is
not an equivalent fallback. Keep explicit zero and skip behavior in migration
checks. If a static positive floor is also present, both the pinned
Prebid.js-to-PBS serializer and PBS core floor processing can retain it when a
dynamic rule returns zero. Resolve that configuration conflict before asserting
equivalence across routes.

## Setup Example

```bash
gulp build --modules=panxoBidAdapter,rtdModule,panxoRtdProvider
```

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 1500,
        dataProviders: [{
            name: 'panxo',
            waitForIt: true,
            params: { siteId: 'YOUR_SITE_ID' }
        }]
    }
});
```

```javascript
var adUnits = [{
    code: 'banner-ad',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'panxo',
        params: {
            propertyKey: 'your-property-key'
        }
    }]
}];
```

## Reviewer Test Ad Units

The isolated synthetic reviewer uses the fixed origin
`https://panxo-prebid-reviewer-external.okpbidgx.workers.dev`. The fixtures below
exercise synthetic inventory and do not verify a commercial integration.

For Prebid.js, set numeric `ortb2.test: 1` and use one of the six reserved
`propertyKey` values below. Both are required: a reserved key without that
exact flag produces no request. Other keys retain the commercial endpoint,
including ordinary auctions carrying OpenRTB `test: 1`. No bidder `params.test`
or arbitrary endpoint parameter is supported. The reviewer additionally checks
the synthetic publisher/domain or app tuple and returns no bid for a mismatch.
It returns synthetic creatives and local notices without live demand or billing.

Run one case per clean test page, before any auction. Do not mix these values
with real publisher inventory. The six shapes include app/CTV protocol fixtures;
browser execution does not prove a mobile SDK or physical CTV device integration.

```javascript
const reviewerBanner = { banner: { sizes: [[300, 250]] } };
const reviewerVideo = {
    video: {
        context: 'instream',
        playerSize: [[640, 360]],
        mimes: ['video/mp4'],
        protocols: [3],
        minduration: 1,
        maxduration: 1,
        plcmt: 1
    }
};
const reviewerNative = {
    native: {
        ortb: {
            ver: '1.2',
            assets: [{ id: 1, required: 1, title: { len: 80 } }, {
                id: 2, required: 1,
                img: { type: 3, wmin: 1200, hmin: 627 }
            }]
        }
    }
};
const reviewerPublisher = { id: 'local-reviewer' };
const reviewerSite = {
    domain: 'publisher.reviewer.invalid', publisher: reviewerPublisher
};
const reviewerApp = {
    id: 'LAB02_REVIEWER_APP', bundle: 'invalid.reviewer.app',
    publisher: reviewerPublisher
};
const reviewerCtv = {
    id: 'LAB02_REVIEWER_CTV', bundle: 'invalid.reviewer.ctv',
    publisher: reviewerPublisher
};
const panxoReviewerCases = [{
    lane: 'banner', propertyKey: 'LAB02_BANNER', siteId: '0000000000000001',
    mediaTypes: reviewerBanner, ortb2: { test: 1, site: reviewerSite }
}, {
    lane: 'instream-video', propertyKey: 'LAB02_INSTREAM_VIDEO', siteId: '0000000000000002',
    mediaTypes: reviewerVideo, ortb2: { test: 1, site: reviewerSite }
}, {
    lane: 'native', propertyKey: 'LAB02_NATIVE', siteId: '0000000000000003',
    mediaTypes: reviewerNative, ortb2: { test: 1, site: reviewerSite }
}, {
    lane: 'ctv-video', propertyKey: 'LAB02_CTV_VIDEO', siteId: '0000000000000004',
    mediaTypes: reviewerVideo,
    ortb2: { test: 1, app: reviewerCtv, device: { devicetype: 3 } }
}, {
    lane: 'inapp-banner', propertyKey: 'LAB02_INAPP_BANNER', siteId: '0000000000000005',
    mediaTypes: reviewerBanner,
    ortb2: { test: 1, app: reviewerApp, device: { devicetype: 4 } }
}, {
    lane: 'inapp-native', propertyKey: 'LAB02_INAPP_NATIVE', siteId: '0000000000000006',
    mediaTypes: reviewerNative,
    ortb2: { test: 1, app: reviewerApp, device: { devicetype: 4 } }
}];

// Choose exactly one case on this clean test page.
const selected = panxoReviewerCases[0];
pbjs.setConfig({
    ortb2: selected.ortb2,
    realTimeData: {
        auctionDelay: 1500,
        dataProviders: [{
            name: 'panxo', waitForIt: true,
            params: { siteId: selected.siteId, test: true }
        }]
    }
});
pbjs.addAdUnits([{
    code: `panxo-review-${selected.lane}`,
    mediaTypes: selected.mediaTypes,
    bids: [{ bidder: 'panxo', params: { propertyKey: selected.propertyKey } }]
}]);
```

The RTD provider's separate `params.test: true` loads `/rtd.js` from the same
fixed reviewer origin. Its activity/consent gates remain in force. RTD mode
does not choose the bidder endpoint; the bidder still requires `ortb2.test: 1`
and the reserved key. Configure RTD before its first initialization.

For Prebid Server, the adapter code and bidder schema are unchanged. Configure
an isolated test instance's Panxo endpoint through the host configuration:

```yaml
adapters:
  panxo:
    endpoint: https://panxo-prebid-reviewer-external.okpbidgx.workers.dev/openrtb/2.6/bid
```

Send top-level OpenRTB `test: 1`, the corresponding site/app/device tuple above,
and the reserved key as `imp[].ext.prebid.bidder.panxo.propertyKey`. This host
override applies to the whole test adapter instance; it is not a per-publisher
parameter or a change to PBS's default commercial endpoint. Never apply it to
a shared production PBS instance. Missing `test: 1` or an incompatible tuple
cannot obtain a reviewer bid.

The reviewer exercises synthetic bids, creatives and notices. A successful
test does not establish commercial serving or physical app/CTV compatibility.

## First Party Data

This adapter supports First Party Data via `ortb2`:

- `ortb2.site` context except `page` and `ref` (publisher, content, categories, keywords and site extensions)
- `ortb2.user.consent` and `ortb2.user.ext.consent` (existing consent fields only)
- remaining root `ortb2.device` context, including structured user agent data; no `device.ext`
- `ortb2.regs.*` and `ortb2.source.*` (including transaction and supply-chain data)
- per-bid media/placement/PMP/floor fields; no outgoing `imp.ext`, GPID or impression extension transaction IDs

Top-level request `ext` is omitted after currency controls are consumed
locally. `site.page` and `site.ref` are omitted without referer fallback.
The Server adapter extracts its property key before omitting `imp.ext`.
This intentionally removes viewport extensions and other contextual metadata
in the omitted containers, narrowing the previous passthrough behavior.
Media objects, consent, billing and computed floors/currencies retain their
existing behavior; publisher inputs and other bidders are not rewritten.

Both adapters independently limit `site.ext.data.panxo` and
`app.ext.data.panxo` to a strict boolean `ai`. They remove legacy IDs, history,
memberships, links and richer payloads in that namespace, including RTD
context transferred to an app request.

User IDs, buyer IDs, EIDs, audience memberships and arbitrary user extensions
are omitted. Device IFA, hashed device identifiers, IP addresses and the legacy
`device.ext.panxo` envelope are also omitted. The RTD provider retains only an
own boolean `ai: true`, dropping `src`, `conf`, `seg`, `co`, `topics` and arbitrary
`context`. The flag concerns the visit, not whether a page is public or about
AI. Descriptor checks avoid executing getters but do not authenticate origin.
Remaining context, URL locations/extensions and the external runtime may
still carry identifiers; this filtering does not make the integration anonymous.

## User Sync

This candidate does not return user-sync pixels or iframe syncs. The Server
registration also omits user-sync configuration. These adapter changes do not
control independent requests made by the separately loaded RTD runtime.

## Additional Notes

- **Net Revenue**: Bids are returned as net revenue.
- **Prebid.js TTL**: A finite positive OpenRTB `bid.exp` is rounded down to whole seconds. If absent, non-finite or non-positive, the adapter uses 300 seconds (5 minutes). This describes the client adapter; PBS expiration follows its own core configuration.
- **Media and App Readiness**: The candidate implements Banner, Video and Native transport across `site` and `app` inventory. CTV uses standard Video + `app` + connected-TV `device.devicetype`; InApp uses `app`. Synthetic browser and adapter fixtures do not certify a full Go exchange, physical mobile/CTV devices or commercial serving. Unsupported Audio remains safe no-bid.
- **Currency**: Panxo requests and responses use USD. Prebid's configured currency service converts foreign impression/deal floors before transport and converts returned bids to the publisher's currency afterward. Positive floors without a valid rate reject their impression. Malformed explicit ad-server currency values fail closed. The legacy `params.floor` and notice prices retain their USD denomination.
- **Request Validation**: Property key, Banner sizes, Video parameters, Native request and privacy signals are normalized and type-checked before a bid request is emitted; Prebid's `gpp_sid = -1` no-applicable-section sentinel is supported without accepting malformed mixed values
- **Private Deals**: The ordinary endpoint does not support private deals. Impressions with `pmp.private_auction: 1` receive no bid; open-auction siblings remain eligible. Transporting optional deal fields does not establish deal matching or fulfillment.
- **Response Validation**: Request/bid/impression IDs, currency, requested media type, dimensions, price and media-specific creative markup must match the grouped request; omitted `mtype` is accepted only for a single-format impression, optional notification/deal/TTL fields are sanitized, and omitted response currency means USD per OpenRTB
- **Safeframes**: Supported
- **Advertiser Domains**: Available in bid responses at `meta.advertiserDomains`
- **Bid Transparency**: Standard `adomain`, `cat`, `cattax`, `attr`, `ext.dsa`, `ext.dchain`, `ext.eventtrackers` and extensible `ext.prebid.meta` response data are exposed through Prebid's canonical bid fields

## Win and Billing Notifications

In Prebid.js, a non-empty OpenRTB `nurl` is sent from `onBidWon`, and a
non-empty `burl` is sent from `onBidBillable`. Both use Prebid's pixel helper
and require a finite price. The `${AUCTION_PRICE}` macro uses `originalCpm`
when finite, otherwise `cpm`.

By default a winning bid is also billable. If the publisher sets
`adUnit.deferBilling: true`, the win callback still runs, but billing waits for
the publisher's `pbjs.triggerBilling(winningBid)` call when appropriate.
Prebid core processes impression image trackers (`event: 1`, `method: 1`)
before calling `onBidBillable`. If the expanded `burl` exactly matches one of
those tracker URLs, the adapter leaves that notification to core rather than
sending a second pixel. This does not assert general deduplication of all
notification types or backend charging behavior.

These callbacks describe the client adapter. Prebid Server uses its own core
and integration tracking path; it does not execute the JavaScript hooks.
