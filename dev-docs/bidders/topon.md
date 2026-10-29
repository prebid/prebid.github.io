---
layout: bidder
title: TopOn
description: Prebid TopOn Bidder Adaptor
biddercode: topon
media_types: banner
tcfeu_supported: false
usp_supported: check with bidder
coppa_supported: true
gpp_supported: check with bidder
schain_supported: true
dchain_supported: false
floors_supported: check with bidder
userIds: false
prebid_member: false
safeframes_ok: false
deals_supported: false
pbjs: true
pbs: false
pbs_app_supported: false
fpd_supported: false
ortb_blocking_supported: false
gvl_id: 1305
multiformat_supported: false
sidebarType: 1
endpoint_compression: check with bidder
---

### Table of contents

- [Introduction](#introduction)
- [Bid Params](#bid-params)
- [Banner](#banner)

### Introduction

Publishers can use Prebid.js to call TopOn in any of the following ways:

- **Call through our client-side adapter**: Prebid.js calls TopOn directly from the browser using our client-side adapter.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|--------------------|
| `pubid` | required | TopOn-specific identifier associated with your account | `'e005f4d49dd3'` | `string` |

### Banner

```javascript
var adUnits = [
  {
    code: "test-div",
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250],
          [300, 600],
        ],
      },
    },
    bids: [
      {
        bidder: "topon",
        params: {
          pubid: "e005f4d49dd3", // required
        },
      },
    ],
  },
];
```
