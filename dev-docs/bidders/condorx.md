---
layout: bidder
title: CondorX
description: Prebid CondorX Bidder Adapter
biddercode: condorx
tcfeu_supported: true
dsa_supported: false
gvl_id: 1375
usp_supported: false
coppa_supported: false
schain_supported: true
dchain_supported: false
media_types: banner, native
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Note

The CondorX Bidding adapter requires setup before beginning. Please contact us at [CondorX](https://condorx.io).

### Bid params

| Name     | Scope    | Description                                                 | Example              | Type    | Default |
|----------|----------|-------------------------------------------------------------|----------------------|---------|---------|
| `widget` | required | The widget ID, by CondorX                                  | `12345`              | integer | - |
| `website`| required | The website ID, by CondorX                                  | `12345`              | integer | - |
| `url`    | optional | Current url                                                 | `https://condorx.io` | string  | `'current url'` |
| `bidfloor` | optional | Minimum bid price in USD                                  | `0.50`               | number  | `-1` |
| `useOpenRTB` | optional | Enable OpenRTB format requests                          | `true`               | boolean | `false` |

### Request Formats

The adapter supports both legacy and OpenRTB request formats:

#### Legacy Format (Default)
Uses GET request to legacy endpoint:

```http
GET https://api.condorx.io/cxb/get.json
```

#### OpenRTB Format
Uses POST request to OpenRTB endpoint:

```http
POST https://api.condorx.io/cxb/openrtb.json
```

To enable OpenRTB format, set `useOpenRTB: true` in the bid parameters.

### Example Ad Units

```javascript
var adUnits = [{
    code: 'condorx-container-id',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]],
        }
    },
    bids: [{
        bidder: "condorx",
        params: {
            widget: 'widget id by CondorX',
            website: 'website id by CondorX',
            url:'current url',
            bidfloor: 0.50
        }
    }]
},
    {
        code: 'condorx-container-id',
        mediaTypes: {
            native: {
                image: {
                    required: true,
                    sizes: [236, 202]
                },
                title: {
                    required: true,
                    len: 100
                },
                sponsoredBy: {
                    required: true
                },
                clickUrl: {
                    required: true
                },
                body: {
                    required: true
                }
            }
        },
        bids: [{
            bidder: "condorx",
            params: {
                widget: 'widget id by CondorX',
                website: 'website id by CondorX',
                url:'current url',
                bidfloor: 0.75
            }
        }]
    },
    {
        code: 'condorx-container-id',
        mediaTypes: {
            banner: {
                sizes: [[728, 90]],
            }
        },
        bids: [{
            bidder: "condorx",
            params: {
                widget: 'widget id by CondorX',
                website: 'website id by CondorX',
                url:'current url',
                bidfloor: 1.00,
                useOpenRTB: true
            }
        }]
    }];
```
