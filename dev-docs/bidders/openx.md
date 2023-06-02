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
gpp_supported: true
floors_supported: true
userIds: admixerId, adtelligentId, amxId, britepoolId, criteo, dapId, deepintentId, dmdId, fabrickId, hadronId, id5Id, identityLink, idxId, imuId, intentIqId, kinessoId, liveIntentId, lotamePanoramaId, merkleId, mwOpenLinkId, naveggId, netId, novatiq, parrableId, pubCommonId, publinkId, quantcastId, sharedId, tapadId, uid2, unifiedId, verizonMediaId, zeotapIdPlus
prebid_member: true
fpd_supported: true
gvl_id: 69
sidebarType: 1
---

### Registration

If you have any questions regarding set up, please reach out to your account manager or support@openx.com.

Please note that OpenX is transitioning its serving architecture and currently has 2 bid adapters as of Prebid 7. The legacy adapter is named openxBidAdapter.
The newer of the two is openxOrtbBidAdapter. Publishers are welcome to test with openxOrtbBidAdapter and give feedback.
After the transition openxOrtbBidAdapter will replace openxBidAdapter.

IMPORTANT: only include either openxBidAdapter or openxOrtbBidAdapter in your build.

### Bid Parameters
#### Banner

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `delDomain` ~~or `platform`~~** | required | OpenX delivery domain provided by your OpenX representative. | "PUBLISHER-d.openx.net" | String |
| `unit` | required | OpenX ad unit ID provided by your OpenX representative. | "1611023122" | String |
| `customParams` | optional | User-defined targeting key-value pairs. customParams applies to a specific unit. | `{key1: "v1", key2: ["v2","v3"]}` | Object |
| `customFloor` | optional | Minimum price in USD. customFloor applies to a specific unit. For example, use the following value to set a $1.50 floor: 1.50 <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue.<br/><br/>Note:<br/> OpenX suggests using the [Price Floor Module](/dev-docs/modules/floors.html) instead of customFloor. The Price Floor Module is prioritized over customFloor if both are present. | 1.50 | Number |
| `doNotTrack` | optional | Prevents advertiser from using data for this user. <br/><br/> **WARNING:**<br/> Impacts all bids in the request.  May impact revenue. | true | Boolean |
| `coppa` | optional | Enables Child's Online Privacy Protection Act (COPPA) regulations. **WARNING:**<br/> Impacts all bids in the request.  May impact revenue. | true | Boolean |

** platform is deprecated. Please use delDomain instead. If you have any questions please contact your representative.


### AdUnit Format for Banner
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
          delDomain: 'se-demo-d.openx.net',
          customParams: {
            key1: 'v1',
            key2: ['v2', 'v3']
          },
        }
      }
    ]
  }
];
```

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `unit` | required | OpenX ad unit ID provided by your OpenX representative. | "1611023122" | String |
| `delDomain` ~~or `platform`~~** | required | OpenX delivery domain provided by your OpenX representative. | "PUBLISHER-d.openx.net" | String |

** platform is deprecated. Please use delDomain instead. If you have any questions please contact your representative.

#### mediaTypes.video

The following video parameters are supported here so publishers may fully declare their video inventory:

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| context | required | instream or outstream |"outstream" | string | 
| playerSize| required | width, height of the player in pixels | [640,360] - will be translated to w and h in bid request | array<integers> |
| mimes | required | List of content MIME types supported by the player (see openRTB v2.5 for options) | ["video/mp4"]| array<string>|
| protocols | recommended | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | [2,3,5,6] | array<integers>|
| api | recommended | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | [2] |  array<integers> |
| linearity | recommended | OpenRTB2 linearity. 1: linear (in-stream ad), 2: non-linear (overlay ad) | 1 | integer |
| maxduration | recommended | Maximum video ad duration in seconds. | 30 | integer |
| minduration | recommended | Minimum video ad duration in seconds | 6 | integer |
| playbackmethod | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see openRTB v2.5 section 5.10 for options)| [2]| array<integers> |
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | integer |
| battr | optional | Blocked creative attributes | [13,14] | array<integers>|
| startdelay | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.<br /> >0: Mid-Roll (value indicates start delay in second)<br /> 0: Pre-Roll<br />-1: Generic Mid-Roll<br />-2: Generic Post-Roll | 0 | integer |
| placement | recommended | Placement type for the impression. (see openRTB v2.5 section 5.9 for options) | 1 | integer |
| | | | | |


### AdUnit Format for Video
```javascript
var videoAdUnits = [
{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],           // required
            context: 'instream',
            mimes: ['video/mp4','video/x-flv'],   // required
            minduration: 5,                       // optional
            maxduration: 30,                      // optional
            startdelay: 5,                        // optional
            playbackmethod: [1,3],                // optional
            api: [ 1, 2 ],                        // optional
            protocols: [ 2, 3 ],                  // optional
            battr: [ 13, 14 ],                    // optional
            linearity: 1,                         // optional
            placement: 2,                         // optional
            minbitrate: 10,                       // optional
            maxbitrate: 10                        // optional
        }
    },
    bids: [{
      bidder: 'openx',
      params: {
        unit: '1611023124',
        delDomain: 'PUBLISHER-d.openx.net'
      }
    }]
}]
```


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
        context: 'instream',
        mimes: ['video/x-ms-wmv, video/mp4']
      }
    },
    bids: [{
      bidder: 'openx',
      params: {
        unit: '1611023124',
        delDomain: 'PUBLISHER-d.openx.net'
      }
    }]
  }
];
```

#### First Party Data
OpenX supports FPD configured under `ortb2.user`and `ortb2.site.content` as described [here](/features/firstPartyData.html).
Ad unit specific FPD is not supported, and segment taxonomies (`segtax`) are simply passed through. If you have any 
questions, please reach out to us at prebid@openx.com

Example: 
```
pbjs.setConfig({
   ...
   ortb2: {
       site: {
            content: {
                data: [{
                    name: "www.dataprovider1.com",
                    ext: { segtax: 4 },
                    segment: [
                        { id: "687" },
                        { id: "123" }
                    ]
                }]
            },
       },
       user: {
           data: [{
               name: "dataprovider.com",
               ext: { segtax: 4 },
               segment: [
                    { id: "1" }
               ]
           }],
       }
   }
   ...
});
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
[Banner Ads](https://docs.openx.com/Content/developers/containers/prebid-adapter.html) (Customer login required.)

[Video Ads](https://docs.openx.com/Content/developers/containers/prebid-video-adapter.html) (Customer login required.)
