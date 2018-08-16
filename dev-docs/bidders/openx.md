---
layout: bidder
title: OpenX
description: Prebid OpenX Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: openx
biddercode_longer_than_12: false
prebid_1_0_supported : true
media_types: video
gdpr_supported: true
---



### Bid Parameters
#### Banner

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type | 
| ---- | ----- | ----------- | ------- | ---- | 
| `delDomain` | required | OpenX delivery domain provided by your OpenX representative.  | "PUBLISHER-d.openx.net" | String | 
| `unit` | required | OpenX ad unit ID provided by your OpenX representative. | "1611023122" | String | 
| `customParams` | optional | User-defined targeting key-value pairs. customParams applies to a specific unit. | `{key1: "v1", key2: ["v2","v3"]}` | Object | 
| `customFloor` | optional | Minimum price in USD. customFloor applies to a specific unit. For example, use the following value to set a $1.50 floor: 1.50 <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue | 1.50 | Number | 
| `doNotTrack` | optional | Prevents advertiser from using data for this user. <br/><br/> **WARNING:**<br/> Impacts all bids in the request.  May impact revenue. | true | Boolean | 
| `coppa` | optional | Enables Child's Online Privacy Protection Act (COPPA) regulations. **WARNING:**<br/> Impacts all bids in the request.  May impact revenue. | true | Boolean | 

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type | 
| ---- | ----- | ----------- | ------- | ---- | 
| `unit` | required | OpenX ad unit ID provided by your OpenX representative. | "1611023122" | String | 
| `delDomain` | required | OpenX delivery domain provided by your OpenX representative.  | "PUBLISHER-d.openx.net" | String |  
| `openrtb` | optional | An OpenRtb Impression with Video subtype properties | `{ imp: [{ video: {mimes: ['video/x-ms-wmv, video/mp4']} }] }` | Object | 


# Example
```javascript
var adUnits = [
  {
    code: 'test-div',
    sizes: [[728, 90]],  // a display size
    mediaTypes: {'banner': {}},
    bids: [
      {
        bidder: 'openx',
        params: {
          unit: '539439964',
          delDomain: 'se-demo-d.openx.net',
          customParams: {
            key1: 'v1',
            key2: ['v2', 'v3']
          },
        }
      }
    ]
  },
  {
    code: 'video1',
    mediaTypes: {
      video: {
        playerSize: [640, 480],
        context: 'instream'
      }
    },
    bids: [{
      bidder: 'openx',
      params: {
        unit: '1611023124',
        delDomain: 'PUBLISHER-d.openx.net',
        openrtb: {
          imp: [{
            video: {
              mimes: ['video/x-ms-wmv, video/mp4']
            }
          }]
        }
      }
    }]
  }
];
```

### Configuration
Add the following code to enable user syncing. By default, Prebid.js version 0.34.0+ turns off user syncing through iframes.
OpenX strongly recommends enabling user syncing through iframes. This functionality improves DSP user match rates and increases the
OpenX bid rate and bid price. Be sure to call `pbjs.setConfig()` only once.

```javascript
pbjs.setConfig({
   userSync: {
      iframeEnabled: true
   }
});
```

# Additional Details
[Banner Ads](https://docs.openx.com/Content/developers/containers/prebid-adapter.html)

[Video Ads](https://docs.openx.com/Content/developers/containers/prebid-video-adapter.html)
