---
layout: bidder
title: Sellwild
description: Prebid Sellwild Bidder Adapter
biddercode: sellwild
pbjs: true
pbs: true
pbs_app_supported: true
media_types: banner, video, native
userIds: all
fpd_supported: false
tcfeu_supported: false
usp_supported: true
coppa_supported: true
gpp_sids: usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
prebid_member: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
floors_supported: true
deals_supported: false
safeframes_ok: true
privacy_sandbox: no
sidebarType: 1
---

## Note

The Sellwild adapter requires setup and approval before use. Contact <support@sellwild.com> to get started. Sellwild assigns each partner a partner code and, depending on the integration, a Prebid.js key, a Prebid Server token, or both. They are different credentials: never put the Prebid Server token in a page.

### Prebid.js

- The `key` is public by design: it goes in the page config, and Sellwild accepts it only for the site domains approved for that partner (`www.example.com` and `example.com` are separate entries).
- The adapter sends one request per `partnerCode` and `key`. Sellwild bills its demand when the ad renders: the adapter fires `burl` for banner and native, and video creatives carry their own impression tracker in the VAST.

### Prebid Server

- Keep the `token` in server-side stored requests or stored impressions, not in parameters sent from the page or app. Prebid Server returns the resolved request, stored data included, in `ext.debug.resolvedrequest` when debug is on, so disable debug for accounts that carry a Sellwild token.
- Send `device.ip`, `device.ua` and `device.geo.country` on every request. Without `device.geo.country`, Sellwild doesn't apply floors and geo-targeted demand won't bid.
- Fire the returned `nurl` or `burl` when the ad wins or renders. Sellwild bills its demand from that notice.

## Bid Params

### Prebid.js

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                        | Example     | Type     |
|---------------|----------|------------------------------------|-------------|----------|
| `partnerCode` | required | Partner code assigned by Sellwild  | `'acme'`    | `string` |
| `key`         | required | Prebid.js key assigned by Sellwild | `'pub-key'` | `string` |

```javascript
var adUnits = [{
  code: 'banner-div',
  mediaTypes: { banner: { sizes: [[300, 250]] } },
  bids: [{
    bidder: 'sellwild',
    params: { partnerCode: 'acme', key: 'pub-key' }
  }]
}];
```

### Prebid Server

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                             | Example        | Type     |
|---------------|----------|-----------------------------------------|----------------|----------|
| `partnerCode` | required | Partner code assigned by Sellwild       | `'acme'`       | `string` |
| `token`       | required | Partner auth token assigned by Sellwild | `'your-token'` | `string` |

```json
"imp": [{
  "id": "1",
  "banner": { "format": [{ "w": 300, "h": 250 }] },
  "ext": {
    "prebid": {
      "bidder": {
        "sellwild": {
          "partnerCode": "acme",
          "token": "your-token"
        }
      }
    }
  }
}]
```
