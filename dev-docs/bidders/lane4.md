---
layout: bidder
title: Lane4
description: Prebid lane4 Bidder Adaptor
pbjs: true
biddercode: lane4
media_types: banner, native
tcfeu_supported: false
usp_supported: true
coppa_supported: true
gpp_sids: usstate_all, usnat
schain_supported: false
safeframes_ok: false
ortb_blocking_supported: false
dsa_supported: false
deals_supported: true
floors_supported: true
sidebarType: 1
---
### Registration

For assistance or setup instructions, please contact us at <adsupport@lane4.io>.

### Banner Params

{: .table .table-bordered .table-striped }
| Name           | Scope     | Description           | Example        | Type     |
|----------------|-----------|-----------------------|----------------|----------|
| `placement_id` | mandatory | Placement Id          | `110044`       | `number` |
| `height`       | optional  | Height of the creative| `250`          | `number` |
| `width`        | optional  | Width of the creative | `300`          | `number` |
| `bid_floor`    | optional  | Bid Floor Price       | `0.5`          | `decimal`|

### AdUnit Format for Banner

```javascript
var adUnits = [
            {
                code: 'banner-ad',
                mediaTypes: {
                    banner: {
                        sizes: [[300, 250]]
                    }
                },
                bids: [{
                    bidder: 'lane4',
                    params: {
                        placement_id: 110044,
                        height: 250,
                        width: 300,
                        bid_floor: 0.5
                    }
                }]
            }
        ];
```

### Native Params

{: .table .table-bordered .table-striped }
| Name           | Scope     | Description           | Example        | Type     |
|----------------|-----------|-----------------------|----------------|----------|
| `placement_id` | mandatory | Placement Id          | `110045`       | `number` |
| `bid_floor`    | optional  | Bid Floor Price       | `1`            | `decimal`|

### AdUnit Format for Native

```javascript
var adUnits = [
            {
                code: 'native-ad-container',
                mediaTypes: {
                    native: {
                        title: { required: true, len: 100 },
                        image: { required: true, sizes: [300, 250] },
                        sponsored: { required: false },
                        clickUrl: { required: true },
                        desc: { required: true },
                        icon: { required: false, sizes: [50, 50] },
                        cta: { required: false }
                    }
                },
                bids: [{
                    bidder: 'lane4',
                    params: {
                        placement_id: 110045, // Required parameter
                        bid_floor: 1 // Optional parameter
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
