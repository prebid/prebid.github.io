---
layout: bidder
title: Dianomi
description: Prebid Dianomi Bidder Adaptor
biddercode: dianomi
media_types: banner, native, video
coppa_supported: false
gdpr_supported: true
usp_supported: true
prebid_member: true
pbjs: true
pbs: true
schain_supported: true
userIds: all
gvl_id: 885
floors_supported: true
fpd_supported: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note
- Supports `display` and `banner` formats.
- Uses `OpenRTB` standard.

### Registration

The Dianomi Adapter requires setup before beginning. Please contact us at eng@dianomi.com.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope                      | Description          | Example            | Type      |
|-------------|----------------------------|----------------------|--------------------|-----------|
| `smartadId` | required                   | Placement ID         | `12345`            | `integer` |
| `endpoint`  | optional                   | for testing only     | `www-prebid.dianomi.com`             | `string` |


Note: smartadId is a pre agreed ID between the publisher and Dianomi.

#### Native example

```js
var adUnits = [
    code: 'your-native-container-id',
    mediaTypes: {
        native: {
            image: {
                required: false,
                sizes: [100, 50]
            },
            title: {
                required: false,
                len: 140
            },
            sponsoredBy: {
                required: false
            },
            clickUrl: {
                required: false
            },
            body: {
                required: false
            },
            icon: {
                required: false,
                sizes: [50, 50]
            }
        }
    },
    bids: [{
        bidder: 'dianomi',
        params: {
            smartadId: 9607
        }
    }]
];
```

#### Banner example
```js
var adUnits = [
    code: 'your-banner-container-id',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      } 
    },
    bids: [{
        bidder: 'dianomi',
        params: {
            smartadId: 9607
        }
    }]
];
```

#### Video example
```js
var adUnits = [
    code: 'your-video-container-id',
    mediaTypes: {
      video: {
        playerSize: [[640, 480]]
      } 
    },
    bids: [{
        bidder: 'dianomi',
        params: {
            smartadId: 9607
        }
    }]
];
```