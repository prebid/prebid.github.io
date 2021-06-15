---
layout: bidder
title: Rise
description: Prebid  Bidder Adaptor
pbjs: true
biddercode: rise
media_types: no-display, video
schain_supported: true
gdpr_supported: true
usp_supported: true
pbjs_version_notes: not in 5.x
---

### Note

The Rise adapter requires setup and approval. Please reach out to prebid-rise-engage@risecodes.com to setup an Rise account.

### Bid Parameters

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  Rise publisher Id provided by your Rise representative  | "56f91cd4d3e3660002000033"
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
          bidder: 'rise',
          params: {
            org: '56f91cd4d3e3660002000033', // Required
            floorPrice: 5.00, // Optional
            ifa: 'XXX-XXX', // Optional
            testMode: false // Optional
          }
        }]
      }
   ];
```

### Configuration
Rise recommends setting UserSync by iframe for monetization.

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
