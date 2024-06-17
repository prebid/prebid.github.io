---
layout: bidder
title: Connatix
description: Connatix Bidder Adapter
biddercode: connatix
tcfeu_supported: true
gvl_id: 143
usp_supported: true
coppa_supported: false
gpp_sids: tcfeu, usp
schain_supported: false
dchain_supported: false
userId: none
media_types: video, banner
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement id | `'ed8a9c16-88ea-4724-aa0d-013c3e595e49'` | `string` |
| `bidfloor` | optional | Floor price | `2.5` | `float` |

#### Example Video Media Type

```js
var adUnits = [
  {
    code: "1",
    mediaTypes: {
      video: {
        context: "instream",
        w: 1280,
        h: 720,
        playerSize: [1280, 720], // recommended
        placement: 1,
        plcmt: 1,
        api: [1, 2],
        mimes: ["video/mp4", "application/javascript"],
        minduration: 30,
        maxduration: 60,
        startdelay: 0,
      },
    },
    bids: [
      {
        bidder: "connatix",
        params: {
          placementId: "e4984e88-9ff4-45a3-8b9d-33aabcad634e", // required
          bidfloor: 2.5, // optional
        },
      },
      // Add more bidders and their parameters as needed
    ],
  },
  // Define more ad units here if necessary
];
```

#### Example Banner Media Type

```js
var adUnits = [
  {
    code: "1",
    mediaTypes: {
      banner: {
        sizes: [
          [640, 480],
          [320, 180],
        ],
      },
    },
    bids: [
      {
        bidder: "connatix",
        params: {
          placementId: "e4984e88-9ff4-45a3-8b9d-33aabcad634e", // required
          bidfloor: 2.5, // optional
        },
      },
      // Add more bidders and their parameters as needed
    ],
  },
  // Define more ad units here if necessary
];
```

### Configuration

To maximize revenue efficiency, please enable `iframe` user syncing.

Connatix strongly recommends enabling user syncing through iFrames. This functionality improves DSP user match rates and increases the bid rate and bid price. Make sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Connatix.

#### Example configuration

```js
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ["connatix"],
        filter: "include",
      },
    },
  },
});
```
