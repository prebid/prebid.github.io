---
layout: bidder
title: Sellwild
description: Prebid Sellwild Bidder Adapter
biddercode: sellwild
pbjs: false
pbs: true
pbs_app_supported: true
media_types: banner, video, native
userIds: all
fpd_supported: false
tcfeu_supported: false
usp_supported: true
coppa_supported: true
gpp_supported: true
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

### Note

The Sellwild adapter requires setup and approval before use. Sellwild assigns each partner a partner code and an auth token. Contact <prebid@sellwild.com> to get started.

Keep the `token` in server-side stored requests or stored impressions, not in parameters sent from the page or app.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                             | Example        | Type     |
|---------------|----------|-----------------------------------------|----------------|----------|
| `partnerCode` | required | Partner code assigned by Sellwild       | `'acme'`       | `string` |
| `token`       | required | Partner auth token assigned by Sellwild | `'your-token'` | `string` |

### Example

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

### Notes

- Send `device.ip`, `device.ua` and `device.geo.country` on every request. Without `device.geo.country`, Sellwild doesn't apply floors and geo-targeted demand won't bid.
- Fire the returned `nurl` or `burl` when the ad wins or renders. Sellwild bills its demand from that notice.
