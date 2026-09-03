---
layout: bidder
title: Start.io
biddercode: startio
description: Prebid Start.io Adapter
tcfeu_supported: true
coppa_supported: true
gpp_supported: false
userIds: startioId
floors_supported: true
media_types: banner, video, native
multiformat_supported: will-bid-on-any
safeframes_ok: false
schain_supported: false
gvl_id: 1216
usp_supported: true
pbjs: true
pbs: true
prebid_member: true
fpd_supported: false
privacy_sandbox: no
ortb_blocking_supported: true
sidebarType: 1
---

### Before You Begin

The Start.io bidder adapter requires additional setup and approval from the Start.io team. For additional information, please reach out to <prebid@start.io>.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `publisherId` | required | Publisher ID | `'publisher-1234'` | `string` |
| `testAdsEnabled` | optional | Enable test ads during development | `true` | `boolean` |

#### Configuration

##### Banner

```js
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [728, 90]]
      }
    },
    bids: [
      {
        bidder: 'startio',
        params: {
          publisherId: 'your-account-id',
          testAdsEnabled: true
        }
      }
    ]
  }
];
```

##### Instream Video

```js
var videoAdUnits = [
  {
    code: 'test-div-video',
    mediaTypes: {
      video: {
        context: 'instream',
        placement: 1,
        playerSize: [640, 360],
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6],
        api: [2],
        maxduration: 30,
        linearity: 1,
        playbackmethod: [2]
      }
    },
    bids: [
      {
        bidder: 'startio',
        params: {
          publisherId: 'your-account-id',
          testAdsEnabled: true
        }
      }
    ]
  }
];
```

##### Native

```js
var nativeAdUnits = [
  {
    code: 'test-div-native',
    mediaTypes: {
      native: {
        title: { required: true, len: 80 },
        body: { required: true },
        image: { required: true, sizes: [150, 150] },
        icon: { required: false, sizes: [50, 50] },
        sponsoredBy: { required: true }
      }
    },
    bids: [
      {
        bidder: 'startio',
        params: {
          publisherId: 'your-account-id',
          testAdsEnabled: true
        }
      }
    ]
  }
];
```

### User Sync and User ID Module

The Start.io User ID submodule generates and persists a unique user identifier by fetching it from a Start.io-managed endpoint. The ID is stored in both cookies and local storage for subsequent page loads and is made available to other Prebid.js modules via the standard `eids` interface.

To enable iframe-based user syncing and the Start.io User ID module, include the following configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'startioId',
            storage: {
                type: 'cookie&html5',
                name: 'startioId',
                expires: 90
            }
        }],
        filterSettings: {
            iframe: {
                bidders: ['startio'],
                filter: 'include'
            }
        }
    }
});
```

For integration support, contact <prebid@start.io>.

#### User ID Parameters

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| `name` | required | String | The name of this module. | `"startioId"` |
| `storage` | required | Object | Storage configuration for the user ID. | |
| `storage.type` | required | String | Type of storage: `"cookie"`, `"html5"`, or `"cookie&html5"`. | `"cookie&html5"` |
| `storage.name` | required | String | The name used to store the user ID. | `"startioId"` |
| `storage.expires` | optional | Number | Number of days before the stored ID expires. Defaults to `90`. | `90` |

### Additional Notes

#### Request and Response Attributes

- Bids are returned in **net** - that is, the bids returned reflect the bid amount with revenue sharing already taken into account. No adjustment is necessary.
- The adapter processes requests via OpenRTB 2.5 standards.
- Ensure that the `publisherId` parameter is set correctly for your integration.
- Test ads can be enabled using `testAdsEnabled: true` during development.
