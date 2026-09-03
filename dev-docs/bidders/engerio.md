---
layout: bidder
title: Engerio
description: Prebid Engerio Bidder Adapter
biddercode: engerio
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-not-bid
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Note

The Engerio adapter requires an active publisher account. Please contact [info@thinkeasy.cz](mailto:info@thinkeasy.cz) to obtain an ad slot code (`adUnitCode`) for your placement.

## Supply chain

Engerio publishes [https://api.engerio.sk/sellers.json](https://api.engerio.sk/sellers.json). Your account's seller id from that file is what belongs in your `ads.txt`:

```text
api.engerio.sk, <seller id>, DIRECT
```

and in the supply chain node for this bidder:

```javascript
pbjs.setBidderConfig({
  bidders: ['engerio'],
  config: {
    ortb2: {
      source: {
        ext: {
          schain: {
            ver: '1.0',
            complete: 1,
            nodes: [{ asi: 'api.engerio.sk', sid: '<seller id>', hp: 1 }]
          }
        }
      }
    }
  }
});
```

## Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                | Example              | Type     |
| ------------ | -------- | -------------------------------------------------------------------------- | -------------------- | -------- |
| `adUnitCode` | required | The ad slot identifier configured in the Engerio admin for this placement. | `'homepage-sidebar'` | `string` |
