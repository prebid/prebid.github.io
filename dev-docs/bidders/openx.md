---
layout: bidder
title: OpenX
description: Prebid OpenX Bidder Adaptor
pbjs: true
pbs: true
biddercode: openx
media_types: banner, video
schain_supported: true
gdpr_supported: true
usp_supported: true
coppa_supported: true
getFloor: true
userIds: britepoolId, criteo, fabrickId, haloId, id5Id, identityLink, idxId, intentIqId, liveIntentId, lotamePanoramaId, merkleId, netId, parrableId, pubCommonId, quantcastId, sharedId, tapadId, unifiedId, verizonMediaId, zeotapIdPlus
prebid_member: true
gvl_id: 69
---

### Registration

If you have any questions regarding set up, please reach out to your account manager or support@openx.com.

### Bid Parameters
#### Banner

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `delDomain` or `platform` | required | OpenX delivery domain or platform id provided by your OpenX representative. Both may be present. `platform` is preferred | "PUBLISHER-d.openx.net" or "555not5a-real-plat-form-id0123456789" | String |
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
| `delDomain` or `platform` | required | OpenX delivery domain or platform id provided by your OpenX representative. Both may be present. `platform` is preferred | "PUBLISHER-d.openx.net" or "555not5a-real-plat-form-id0123456789" | String |
| `openrtb` | optional | An OpenRtb Impression with Video subtype properties | `{ imp: [{ video: {mimes: ['video/x-ms-wmv, video/mp4']} }] }` | Object |


## Example
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
      }, {
        bidder: 'openx',
        params: {
          unit: '539439964',
          platform: 'a3aece0c-9e80-4316-8deb-faf804779bd1',
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
        video: {
          mimes: ['video/x-ms-wmv, video/mp4']
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

## Additional Details
[Banner Ads](https://docs.openx.com/Content/developers/containers/prebid-adapter.html)

[Video Ads](https://docs.openx.com/Content/developers/containers/prebid-video-adapter.html)
