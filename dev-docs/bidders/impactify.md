---
layout: bidder
title: Impactify
description: Prebid Impactify Bidder Adapter
pbjs: true
pbs: true
biddercode: impactify
tcfeu_supported: true
usp_supported: true
schain_supported: true
coppa_supported: true
floors_supported: true
media_types: banner, video
userIds: criteo, id5Id, pubCommonId, unifiedId, uid2, netId
gvl_id: 606
sidebarType: 1
---

### Note

The Impactify adapter requires setup and validation from the Impactify team. Simply email us your contact details at <support@impactify.io> and we'll make sure we connect with you within 48h.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `accountId` | required | Impactify publisher ID | `'1234'` | `string` |
| `appId` | required | Impactify inventory ID | `'example.com'` | `string` |
| `style` | required | Impactify ad style | `'impact'` | `string` |
| `format` | required | Impactify ad format | `'screen'` | `string` |
| `size` | optional | Impactify ad size | `'300x250'` | `string` |
| `render` | optional | Render options. See sub-options below. | `{ bottom: 10, expandAd: true }` | `object` |

#### `render` sub-options

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `top` | optional | Top offset used for ad rendering. | `10` | `number` |
| `bottom` | optional | Bottom offset used for ad rendering. | `10` | `number` |
| `expandAd` | optional | Enables ad expansion behavior when supported. | `true` | `boolean` |
| `location` | optional | Changes the position of the player. | `'top-left'` | `string` |
| `onAdEventName` | optional | Name of the browser event fired when an ad is rendered. | `'impactifyAdLoaded'` | `string` |
| `onNoAdEventName` | optional | Name of the browser event fired when no ad is returned. | `'impactifyNoAd'` | `string` |

### Formats

Impactify supports the following format styles:

- **impact (`outstream`)**: sticky at the bottom.
- **inline (`outstream`)**: in-content then sticky at the bottom on scroll.
- **skyline (`outstream`)**: in-content then sticky at the top on scroll.
- **static (`banner/instream/outstream`)**: in-content (not sticky).

### Media Types

#### Banner

Banner ads are supported with standard IAB sizes.

```javascript
var bannerAdUnit = [
    {
        code: "Publisher DIV",
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250],
                    [336, 280]
                ]
            }
        },
        bids: [
            {
                bidder: "impactify",
                params: {
                    accountId: "YOUR_ACCOUNTID_HERE",
                    appId: "YOUR_APPID_HERE",
                    format: "screen",
                    style: "static",
                }
            }
        ]
    }
];
```

#### Video

Video ads are supported.

```javascript
var instreamAdUnit = [
    {
      code: "Publisher DIV",
      mediaTypes: {
        video: {
          context: "instream",
          mimes: ["video/mp4", "video/webm", "application/javascript"],
          minduration: 1,
          maxduration: 35,
          protocols: [2, 3, 5, 6, 7, 8, 11, 12, 13, 14],
          api: [2, 7, 8],
          placement: 1,
          plcmt: 1,
          startdelay: 0,
          w: 640,
          h: 360,
          playbackmethod: [1, 2, 6],
          skip: 1
        }
      },
      bids: [
        {
          bidder: "impactify",
          params: {
            accountId: "YOUR_ACCOUNTID_HERE",
            appId: "YOUR_APPID_HERE",
            format: "player",
            style: "static"
          }
        }
      ]
    }
  ];

  var outstreamAdUnit = [
    {
      code: "Publisher DIV",
      mediaTypes: {
        video: {
          context: "outstream",
          mimes: ["video/mp4", "video/webm", "application/javascript"],
          minduration: 1,
          maxduration: 35,
          protocols: [2, 3, 5, 6, 7, 8, 11, 12, 13, 14],
          api: [2, 7, 8],
          placement: 4,
          plcmt: 4,
          startdelay: 0,
          w: 640,
          h: 360,
          playbackmethod: [1, 2, 6],
          skip: 1
        }
      },
      bids: [
        {
          bidder: "impactify",
          params: {
            accountId: "YOUR_ACCOUNTID_HERE",
            appId: "YOUR_APPID_HERE",
            format: "screen",
            style: "impact"
          }
        }
      ]
    }
  ];
```

### Configuration

Impactify recommends the UserSync configuration below. Without it, the Impactify adapter will not be able to perform user syncs, which lowers match rate and reduces monetization.

Note: Impactify adapter needs storage access to work properly. Do not forget to set `storageAllowed` to `true`.

{% include dev-docs/storageAllowed.md %}

For Prebid.js v1.15.0 and later:

```javascript
pbjs.bidderSettings = {
  impactify: {
    storageAllowed: true // Mandatory
  }
};

pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

For Prebid.js v1.14.0 and before:

```javascript
pbjs.bidderSettings = {
  impactify: {
    storageAllowed: true // Mandatory
  }
};

pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    enabledBidders: ['impactify']
  }
});
```

Note: Combine the above configuration with any other UserSync configuration. Multiple `setConfig()` calls overwrite each other and only the last call for a given attribute takes effect.
