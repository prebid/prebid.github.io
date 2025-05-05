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
                    [300, 250]
                ]
            }
        },
        bids: [
            {
                bidder: 'epom_dsp',
                params: {
                    endpoint: 'https://bidder.epommarket.com/bidder/v2_5/bid?key=d0b9fb9de9dfbba694dfe75294d8e45a'
                },
                "imp": [
                    {
                        "banner": {
                            "w": 300,
                            "h": 250,
                            "btype": [
                                4
                            ],
                            "pos": 0,
                            "api": [
                                3
                            ]
                        },
                        "instl": 0,
                        "tagid": "test4",
                        "bidfloor": 0.01,
                        "bidfloorcur": "USD",
                        "id": "2"
                    }
                ],
                "site": {
                    "id": "fc59bd54-36df-4d33-830c-fdsfds",
                    "domain": "epom.com",
                    "privacypolicy": 0,
                    "publisher": {
                        "id": "testid"
                    },
                    "content": {
                        "id": "1234567",
                        "episode": 23,
                        "title": "Car Show",
                        "series": "All About Cars",
                        "season": "2",
                        "cat": [
                            "IAB2-2"
                        ]
                    }
                },
                "device": {
                    "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                    "geo": {
                        "country": "UKR",
                        "region": "",
                        "city": ""
                    },
                    "ip": "176.112.120.50",
                    "devicetype": 2,
                    "os": "windows",
                    "osv": "",
                    "js": 1,
                    "language": "US",
                    "carrier": "VERIZON",
                    "connectiontype": 5,
                    "ifa": "AA000DFE74168477C70D291f574D344790E0BB11"
                },
                "user": {
                    "id": "testiduser"
                },
                "test": 0,
                "at": 2,
                "allimps": 0,
                "cur": [
                    "USD"
                ],
                "bcat": [
                    "IAB25-2",
                    "IAB25-1"
                ],
                "badv": [],
                "id": "NewIdTest"
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
