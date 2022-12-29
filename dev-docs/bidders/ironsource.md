---
layout: bidder
title: IronSource
description: Prebid IronSource Bidder Adaptor
pbjs: true
biddercode: ironsource
media_types: no-display, video
schain_supported: true
gdpr_supported: true
usp_supported: true
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---

### Note

The IronSource adapter requires setup and approval. Please reach out to prebid-digital-brands@ironsrc.com to setup an IronSource account.

### Bid Parameters

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `isOrg` | required | String |  IronSource publisher Id provided by your IronSource representative  | "56f91cd4d3e3660002000033"
| `floorPrice` | optional | Number |  Minimum price in USD. <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue | 2.00
| `ifa` | optional | String |  The ID for advertisers (also referred to as "IDFA")  | "XXX-XXX"
| `testMode` | optional | Boolean |  This activates the test mode  | false

## Example
```javascript
var adUnits = [
       {
        code: 'dfp-video-div',
        sizes: [[640, 480]],
        mediaTypes: {
          video: {
            playerSize: [[640, 480]],
            context: 'instream'
          }
        },
        bids: [{
          bidder: 'ironsource',
          params: {
            isOrg: '56f91cd4d3e3660002000033', // Required
            floorPrice: 5.00, // Optional
            ifa: 'XXX-XXX', // Optional
            testMode: false // Optional
          }
        }]
      }
   ];
```

### Configuration
IronSource recommends setting UserSync by iframe for monetization.

For Prebid.js v1.15.0 and later:

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

For Prebid.js v1.14.0 and before:

pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    enabledBidders: ['ironsource']
  }
});
