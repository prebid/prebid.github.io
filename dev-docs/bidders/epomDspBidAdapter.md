---
layout: bidder
title: Epom DSP
description: Prebid Epom DSP Bid Adapter
biddercode: epom_dsp
tcfeu_supported: true
gvl_id: none
usp_supported: true
coppa_supported: false
gpp_sids: tcfeu, usnat
schain_supported: true
dchain_supported: false
userId: none
media_types: banner
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Overview

The **Epom DSP Bid Adapter** allows publishers to connect with the Epom DSP Exchange for programmatic advertising. It supports banner formats and adheres to the OpenRTB protocol.

## Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                              | Example  | Type    |
|------------|---------|----------------------------------|---------|--------|
| `endpoint` | required | The URL of the Epom DSP bidding endpoint | `'https://bidder.epommarket.com/bidder/v2_5/bid?key=your_api_key'` | `string` |
| `placementId` | optional | Unique identifier for the placement      | `'12345'` | `string` |
| `bidfloor` | optional | Minimum CPM value for the bid in USD    | `0.5`     | `number` |

## Example Configuration

```javascript
var adUnits = [
    {
        code: 'epom-banner-div',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250],
                    [728, 90],
                    [160, 600],
                ]
            }
        },
        bids: [
            {
                bidder: 'epom_dsp',
                params: {
                    endpoint: 'https://bidder.epommarket.com/bidder/v2_5/bid?key=your_api_key'
                }
            }
        ]
    }
];
```

## GDPR and Privacy Compliance

The **Epom DSP Bid Adapter** supports GDPR and CCPA compliance. Consent information can be passed via:

- `bidderRequest.gdprConsent`
- `bidderRequest.uspConsent`

## Support

For integration assistance, contact [Epom Support](mailto:support@epom.com).
