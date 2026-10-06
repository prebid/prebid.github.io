---
layout: bidder
title: GoAdserver
description: Prebid GoAdserver Bidder Adapter
pbjs: true
pbs: false
biddercode: goadserver
userIds:
media_types: banner, video, native
schain_supported: true
dchain_supported: false
ortb_blocking_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
tcfeu_supported: false
dsa_supported: true
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: usnat, usstate_all, usp
userId: no
safeframes_ok: true
deals_supported: true
fpd_supported: true
prebid_member: false
privacy_sandbox: no
sidebarType: 1
---

## Note

GoAdserver is a self-hosted, multi-tenant ad serving platform with a built-in OpenRTB 2.5 Prebid Server endpoint. One adapter (`goadserver`) serves every deployment — the specific ad server is selected per-ad-unit via `params.host`, and the publisher's SSP campaign authentication token (issued in the GoAdserver panel) is passed via `params.token`. Publishers running multiple GoAdserver instances can mix and match them in a single Prebid.js config by setting different `params.host` values on different ad units.

Requests are POSTed to `https://{params.host}/openrtb2/auction`. The token lands in the outgoing BidRequest as `site.publisher.id`, which the GoAdserver auction handler uses to resolve the publisher account.

For setup or to obtain a token, contact <support@goadserver.com>.

## Bid Parameters

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `host` | required | The GoAdserver deployment's public domain. The adapter POSTs to `https://{host}/openrtb2/auction`. | `"ads.example.com"` | `string` |
| `token` | required | SSP campaign authentication token from the publisher's GoAdserver panel. Forwarded as `site.publisher.id`. | `"a1b2c3d4..."` | `string` |
| `floor` | optional | Per-bid CPM floor (USD). Honored only when the [Price Floors module](/dev-docs/modules/floors.html) hasn't already set `imp.bidfloor`. | `0.50` | `number` |
| `subid` | optional | Per-impression sub-identifier for stats attribution (page section, A/B group, etc.). Emitted as `imp.ext.goadserver.subid` and logged against the bid in GoAdserver reporting. | `"article_page"` | `string` |
| `deals` | optional | Array of private marketplace deal objects attached to this impression. Each entry maps to OpenRTB `imp.pmp.deals[]`: `id` (required), `bidfloor`, `bidfloorcur`, `at`, `wseat[]`, `wadomain[]`. See example below. | see below | `Object[]` |
| `outstreamRendererUrl` | optional | Override URL for the outstream video renderer script. Defaults to `https://{host}/prebid-outstream.js`, which every GoAdserver deployment hosts. Set this to self-host or bundle a custom player. | `"https://cdn.pub.example.com/my-outstream.js"` | `string` |

## Deals / Private Marketplace

```js
bids: [{
  bidder: 'goadserver',
  params: {
    host: 'ads.example.com',
    token: 'your-sspcampaigns-hash',
    deals: [
      { id: 'DEAL_XYZ', bidfloor: 2.50, bidfloorcur: 'USD' },
      { id: 'DEAL_ABC', bidfloor: 1.00, at: 1, wseat: ['agency-42'] }
    ]
  }
}]
```

Deal objects are forwarded verbatim to downstream DSPs. Winning bids return with `bid.dealid`, surfaced by Prebid.js as `bid.dealId` for GAM line-item targeting.

## Outstream Video

Outstream is supported via the standard `mediaTypes.video.context: 'outstream'` setting. When a video bid is returned for an outstream ad unit, the adapter attaches a Prebid.js `Renderer` that loads the GoAdserver-hosted outstream player. The player parses the VAST XML, injects a muted auto-playing `<video>` element into the slot, and fires impression / click trackers — no publisher-side renderer configuration is required.

```js
const adUnit = {
  code: 'outstream-1',
  mediaTypes: {
    video: {
      context: 'outstream',
      playerSize: [[640, 360]],
      mimes: ['video/mp4']
    }
  },
  bids: [{
    bidder: 'goadserver',
    params: {
      host: 'ads.example.com',
      token: 'your-token'
      // outstreamRendererUrl: 'https://cdn.pub.example.com/my-outstream.js' // optional override
    }
  }]
};
```

## Test Parameters

```js
const adUnits = [
  {
    code: 'top-banner',
    mediaTypes: { banner: { sizes: [[728, 90], [970, 250]] } },
    bids: [{
      bidder: 'goadserver',
      params: {
        host: 'ads.example.com',
        token: 'your-sspcampaigns-hash',
        floor: 0.50
      }
    }]
  },
  {
    code: 'preroll',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [[640, 480]],
        mimes: ['video/mp4']
      }
    },
    bids: [{
      bidder: 'goadserver',
      params: { host: 'ads.example.com', token: 'your-sspcampaigns-hash' }
    }]
  },
  {
    code: 'native-1',
    mediaTypes: {
      native: {
        title: { required: true },
        image: { required: true },
        sponsoredBy: { required: true }
      }
    },
    bids: [{
      bidder: 'goadserver',
      params: { host: 'ads.example.com', token: 'your-sspcampaigns-hash' }
    }]
  }
];
```

## Multi-Deployment Example

Two ad units auctioned against two different GoAdserver deployments in one request:

```js
pbjs.addAdUnits([
  {
    code: 'slot-a',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{
      bidder: 'goadserver',
      params: { host: 'deployment1.example.com', token: 'token-a' }
    }]
  },
  {
    code: 'slot-b',
    mediaTypes: { banner: { sizes: [[728, 90]] } },
    bids: [{
      bidder: 'goadserver',
      params: { host: 'deployment2.example.com', token: 'token-b' }
    }]
  }
]);
```

## Consent & Privacy

The adapter relies on Prebid.js's standard consent plumbing via `ortbConverter`. No bidder-specific consent handling is required on the publisher side. GoAdserver reads each signal from both its OpenRTB 2.6 location and the 2.5 `ext` location, and forwards it to every demand partner it calls:

- **US Privacy** (`regs.ext.us_privacy`) and **GPP** (`regs.gpp` + `regs.gpp_sid`)
- **GDPR** (`regs.ext.gdpr`, `user.ext.consent`). The values are forwarded only; see the GVL note below.
- **COPPA** (`regs.coppa`). When set, user identifiers (user id, buyer uid, EIDs, user data segments) are removed from downstream requests, IP addresses are truncated, and no user sync is offered.

User sync pixels carry the auction's consent values. GoAdserver does not set its cookie when GDPR applies and no consent string is present.

**GVL ID:** GoAdserver is not registered with the IAB Global Vendor List, so `tcfeu_supported` is `false`. EU publishers whose CMP enforces the GVL may see bid requests dropped before the auction.

## DSA Transparency

When the request carries `regs.ext.dsa`, it is forwarded to demand partners and every returned bid includes `ext.dsa`, which Prebid.js surfaces as `bid.meta.dsa`. Bids that would fail the [DSA Control module](/dev-docs/modules/dsaControl.html) are filtered server-side, so the next-best bid can win the slot. These are bids with no DSA object when `dsarequired` is 2 or 3, and bids whose `adrender` conflicts with the request's `pubrender`.

## Blocking

Request-level `bcat` and `badv` and per-impression `battr` (banner and video) are forwarded to demand partners and enforced on their bids:

- A blocked tier-1 category such as `IAB25` also blocks its subcategories.
- A blocked advertiser domain also blocks its subdomains.

Set them through first-party data:

```js
pbjs.setConfig({
  ortb2: {
    bcat: ['IAB25', 'IAB26'],
    badv: ['competitor.example']
  }
});
```
