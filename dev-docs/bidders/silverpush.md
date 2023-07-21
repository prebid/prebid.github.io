---
layout: bidder
title: Silverpush
description: Prebid Silverpush Bidder Adaptor
pbjs: true
pbs: true
biddercode: silverpush
media_types: banner, video
schain_supported: true
gdpr_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
floors_supported: true
userIds: 
prebid_member: false
fpd_supported: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Registration
The Example Bidding adapter requires setup before beginning. Please contact us at prebid@silverpush.co.


### Bid Parameters

#### Banner

{: .table .table-bordered .table-striped }
|       Name     |    Scope    |                 Description                |    Example    |     Type     |
| -------------- | ----------- | ------------------------------------------ | ------------- | ------------ |
| `publisherId` | required | Publisher id provided by silverpush | "123456" | String |
| `bidFloor` | optional | Minimum price in USD. bidFloor applies to a specific unit. For example, use the following value to set a $1.50 floor: 1.50. <br/> | 1.50 | Number |

#### mediaTypes.banner

The following banner parameters are supported here so publishers may fully declare their banner inventory:

{: .table .table-bordered .table-striped }
|    Name   |    Scope    |                      Description                                  |  Example  |    Type   |
| --------- | ------------| ----------------------------------------------------------------- | --------- | --------- |
| sizes | required | Avalaible sizes supported for banner ad unit | [ [300, 250], [300, 600] ] | [[Integer, Integer], [Integer, Integer]] | 


### AdUnit Format for Banner
```javascript
const adUnits = [{
    code: 'div-1',
    mediaTypes: {
        banner: {
            sizes: [ [300, 250], [300,600] ]
        }
    },
    bids: [{
      bidder: 'silverpush',
      params: {
          publisherId: "123456",
          bidFloor: 1.2
      }
    }]
}];
```

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `publisherId` | required | Publisher id provided by silverpush | "123456" | String |
| `bidFloor` | optional | Minimum price in USD. bidFloor applies to a specific unit. For example, use the following value to set a $1.50 floor: 1.50. | 1.50 | Number |

#### mediaTypes.video

The following video parameters are supported here so publishers may fully declare their video inventory:

{: .table .table-bordered .table-striped }
|    Name   |    Scope    |                      Description                                  |  Example  |    Type   |
| --------- | ------------| ----------------------------------------------------------------- | --------- | --------- |
| context | required | instream or outstream |"outstream" | string | 
| playerSize | required | Avalaible sizes supported for video ad unit. | [300, 250] | [Integer, Integer] | 
| mimes | required | List of content MIME types supported by the player. | ["video/mp4"]| [String]|
| protocols | required | Supported video bid response protocol values. | [2,3,5,6] | [integers]|
| api | required | Supported API framework values. | [2] |  [integers] |
| maxduration | required | Maximum video ad duration in seconds. | 30 | Integer |
| minduration | required | Minimum video ad duration in seconds. | 6 | Integer |
| startdelay | required | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements. | 0 | Integer |
| placement | required | Placement type for the impression. | 1 | Integer |
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | Integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | Integer |
| playbackmethod | optional | Playback methods that may be in use. Only one method is typically used in practice. | [2]| [Integers] |
| linearity | optional | OpenRTB2 linearity. in-strea,overlay... | 1 | Integer |
| skip | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes . | 1 | Integer |
| skipafter | optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable. | 5 | Integer |
| delivery | optional | OpenRTB2 delivery. Supported delivery methods (e.g., streaming, progressive). If none specified, assume all are supported.  | 1 | [Integer] |



### AdUnit Format for Video
```javascript
var videoAdUnits = [{
    code: 'video-1',
    mediaTypes: {
        video: {
            api: [1, 2, 4, 6],
            mimes: ['video/mp4'],
            context: 'instream', // or 'outstream'
            playerSize: [ 640, 480 ],
            protocols: [4,5,6,7],
            placement: 1,
            minduration: 0,
            maxduration: 60,
            startdelay: 0
        }
    },
    bids: [
        {
            bidder: 'silverpush',
            params: {
                publisherId: "123456",
                bidfloor: 2.5
            }
        }
    ]
}]
```

### First Party Data
Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:
- ortb2.user.ext.eids

## Prebid Server 

```javascript
pbjs.setConfig({
    s2sConfig : {
        accountId:"someaccountId" // replace with accountId
        bidders : ['silverpush'],
        timeout : 1000, //default value is 1000
        adapter : 'prebidServer', //if we have any other s2s adapter, default value is s2s
        endpoint: 'https://prebid.adnxs.com/pbs/v1/openrtb2/auction',
    },
    ortb2: {
        user: {
            ext: {
                eids: [ {
                    source:"sharedid.org",
                    uids:[
                        {
                            id:"01EAJWWNEPN3CYMM5N8M5VXY22",
                            atype:1,
                            ext:{
                                third:"01EAJWWNEPN3CYMM5N8M5VXY22"
                             }
                        }
                    ]
                  }
                ]
            }
        }   
    
    }
});
```

## Additional Details
For any queries, reach us at prebid@silverpush.co.
