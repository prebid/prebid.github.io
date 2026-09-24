---
layout: bidder
title: Iqiyi
description: Prebid Iqiyi Bidder Adapter
biddercode: iqiyi
tcfeu_supported: false
coppa_supported: false
schain_supported: false
media_types: banner, video, native
safeframes_ok: true
deals_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
---

### Registration

The Iqiyi bidding adapter requires setup before beginning. Please contact the Iqiyi team at <adsglobal@qiyi.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example     | Type     |
|---------------|----------|-------------------------------------------------------|-------------|----------|
| `accountid`   | required | The account ID provided by Iqiyi. Please contact the Iqiyi team to get your account ID. | `'100000099'` | `string` |

### Test Parameters

```javascript
var adUnits = [
    // Banner adUnit
    {
        code: 'test-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]],  // a display size
            }
        },
        bids: [
           {
               bidder: "iqiyi",
               params: {
                    accountid: "100000099"
                }
           }
       ]
    },
    // Video adUnit
    {
        code: 'div-1',
        mediaTypes: {
            video: {
                context: 'outstream',
                playerSize: [[640, 360]],
                mimes: ['video/mp4'],
            },
        },
        bids: [
            {
                bidder: 'iqiyi',
                params: {
                    accountid: '100000099',
                },
            },
        ],
    },
    // Native adUnit
    {
        code: 'div-2',
        mediaTypes: {
            native: {
                title: {
                    required: true,
                    len: 80
                },
                body: {
                    required: true
                },
                image: {
                    required: true,
                    sizes: [150, 50]
                },
                sponsoredBy: {
                    required: true
                },
                clickUrl: {
                    required: false
                },
                privacyLink: {
                    required: false
                }
            }
        },
        bids: [
            {
                bidder: 'iqiyi',
                params: {
                    accountid: '100000099',
                },
            },
        ],
    },
    // Multi-format adUnit
    {
        code: 'div-3',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            },
            video: {
                context: 'outstream',
                playerSize: [[640, 360]],
                mimes: ['video/mp4'],
            },
        },
        bids: [
            {
                bidder: 'iqiyi',
                params: {
                    accountid: '100000099',
                },
            },
        ],
    },
];
```
