---
layout: bidder
title: RelevateHealth
description: Prebid RelevateHealth Bidder Adaptor
pbjs: true
biddercode: relevatehealth
media_types: banner
tcfeu_supported: false
usp_supported: true
coppa_supported: true
gpp_sids: usstate_all
schain_supported: false
safeframes_ok: false
ortb_blocking_supported: false
dsa_supported: false
deals_supported: true
floors_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope     | Description           | Example        | Type     |
|---------------|-----------|-----------------------|----------------|----------|
| `placement_id`| mandatory | Placement Id          | `110011`       | `number` |
| `height`      | optional  | Height of the creative| `600`          | `number` |
| `width`       | optional  | Width of the creative | `160`          | `number` |
| `domain`      | optional  | Domain                | `'domain.com'` | `string` |
| `bid_floor`   | optional  | Bid Floor Price       | `0.5`          | `decimal`|

### AdUnit Format for Banner

```javascript
var adUnits = [
            {
                code: 'banner-ad',
                mediaTypes: {
                    banner: {
                        sizes: [[160, 600]]
                    }
                },
                bids: [{
                    bidder: 'relevatehealth',
                    params: {
                        placement_id: 110011,
                        user_id: '',
                        height: 600,
                        width: 160,
                        domain: '',
                        bid_floor: 0.5
                    }
                }]
            }
        ];
```

#### First Party Data

In release 4.30 and later, publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

* ortb2.user.id
* ortb2.user.buyeruid
* ortb2.user.keywords
* ortb2.user.ext.*

Example first party data that's available to all bidders and all adunits:

```javascript
pbjs.setConfig({
  ortb2: {
    user: {
      id: 123456789,        // Unique pseudonymized ID for the user (e.g., NPI).
      buyeruid: 987654321,  // DSP-assigned user ID for identity resolution.
      keywords: "kw1,kw2",  // Interest or specialty tags (e.g., oncology, cardiology)
      ext: {
        key1: "values",    // Custom healthcare metadata (e.g., icd10), single or comma seperated.
        key2: "values"     // Additional campaign context (e.g., ndc), single or comma seperated.
      }
    }
  }
});
```
