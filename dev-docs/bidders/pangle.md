---
layout: bidder
title: Pangle
description: Prebid Pangle Bidder Adapter
biddercode: pangle
tcfeu_supported: false
coppa_supported: true
schain_supported: false
media_types: banner, video, native
safeframes_ok: false
deals_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
userIds: sharedId
sidebarType: 1
multiformat_supported: will-bid-on-any
---

### Note

The Pangle Bidding adapter requires setup before beginning. Please contact the Pangle team.

**Media type support:**

* Pangle Prebid.js adapter supports banner and video, native is not supported yet.
* Pangle Prebid Server adapter supports banner, video and native media types. 

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example     | Type     |
|---------------|----------|-------------------------------------------------------|-------------|----------|
| token         | required | **Prebid.js**: please fill 'pangle' by default. **Prebid Server**: access token, please contact Pangle team to get your token   | 'Pangle'   | string   |
| appid         | optional | **(Required for Prebid.js)** The app id on Pangle platform, please get them from the platform or contact Pangle team | '5123400'   | string   |
| placementid   | optional | **(Required for Prebid.js)** The placement id created on Pangle platform, please get them from the platform or contact Pangle team | '912340000' | string   |
| test          | optional | For testing, please set it to '1' so that you can test the integration. Pangle strongly recommends testing before going live.            |  1          | number   |

Pangle server-side Prebid Server adapter supports `banner`, `video`, `native` media types. But Pangle client-side Prebid.js adapter supports `banner` and `video` media types, doesn't support `native`.

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
               bidder: "pangle",
               params: {
                    token: "aaaaa",
                    placementid: '1234', // string 
                    appid: '1234' // string 
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
                playerSize: [[300, 250]],
                mimes: ['video/mp4'],
            },
        },
        bids: [
            {
                bidder: 'pangle',
                params: {
                    appid: '8149678',
                    placementid: '980589944',
                    token: '111111',
                },
            },
        ],
    },
    // multi format adUnit
    {
        code: 'div-1',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            },
            video: {
                context: 'outstream',
                playerSize: [[300, 250]],
                mimes: ['video/mp4'],
            },
        },
        bids: [
            {
                bidder: 'pangle',
                params: {
                    token: "Pangle",
                    appid: "8168169", //{YOUR_APP_ID}
                    placementid: "980649718", //{YOUR_PLACEMENT_ID}
                    test: 1 // For test ads
                },
            },
        ],
    },
];
```

### User Sync

Add the following code to enable user sync. Pangle strongly recommends enabling user syncing through iFrames. This functionality improves partners' user match rates and increases the Pangle bid rate and bid price. Be sure to call `pbjs.setConfig()` only once.

```javascript
pbjs.setConfig({
    userSync: {
        iframeEnabled: true,
        userIds: [
          {
            name: 'sharedId',
            storage: {
              name: 'sharedId', // name of the 1st party cookie
              type: 'cookie',
              expires: 365,
            },
          },
        ],
    }
});
```
