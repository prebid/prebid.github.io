---
layout: bidder
title: PubWise
description: PubWise Bidder Adaptor
pbjs: true
pbs: true
biddercode: pwbid
aliasCode: pubwise
media_types: banner, native
gdpr_supported: true
usp_supported: true
schain_supported: true
prebid_member: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, pubProvidedId, sharedId, unifiedId
tcf1_supported: true
floors_supported: true
gvl_id: 842
sidebarType: 1
---

### Note:
The PubWise bid adapter is now availalbe self service. Visit http://www.PubWise.io/ to get started.

### Global Bid params
siteID is sufficient for bidding.

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                       | Example                  | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------|--------------------------|-----------|
| `siteId`     | required | The site ID provided by the PubWise system                                                       | `'XXXXXX'`               | `string`  |
| `bidFloor`   | optional | Value to pass as the bidfloor for this bid                                                        | `2.50`                   | `currency` |
| `isTest`     | optional | A boolean to indicate 100% fill test placement request                                            | `false`                  | `boolean` |

### video parameters
The PubWise adapter supports video as of Prebid v7.39.0. Outstream is NOT supported currently.

{: .table .table-bordered .table-striped }
| Name 					 | Scope    | Description        										  | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `video.mimes` 		 | required | Video MIME types 											  | `['video/mp4','video/x-flv']` |
| `video.skippable` 	 | optional | If 'true', user can skip ad 								  | `true` |
| `video.minduration` 	 | optional | Minimum ad duration in seconds							  | `5` |
| `video.maxduration`  	 | optional | Maximum ad duration in seconds 							  | `30` |
| `video.startdelay` 	 | optional | Start delay in seconds for pre-roll, mid-roll, or post-roll ad placements | `5` |
| `video.playbackmethod` | optional | Defines whether inventory is user-initiated or autoplay sound on/off<br/>Values:<br/>`1`: Auto-play, sound on<br/>`2`: Auto-play, sound off<br/>`3`: Click-to-play<br/>`4`: mouse-over	  | `1` |
| `video.api` 			 | optional | API frameworks supported<br/>Values:<br/>`1`: VPAID 1.0<br/>`2`: VPAID 2.0<br/>`3`: MRAID-1<br/>`4`: ORMMA<br/>`5`: MRAID-2 																		   | `[1, 2]` |
| `video.protocols` 	 | optional |  Supported video bid response protocols<br/>Values<br/>`1`: VAST 1.0<br/>`2`: VAST 2.0<br/>`3`: VAST 3.0<br/> `4`: VAST 1.0 Wrapper<br/>`5`: VAST 2.0 Wrapper<br/>`6`: VAST 3.0 Wrapper			| `[5, 6]` |
| `video.battr` 		 | optional | Blocked creative attributes, See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.3 for values 			| `[3, 9]` |
| `video.linearity` 	 | optional | Indicates if the impression is linear or nonlinear<br/>Values:<br/>`1`: Linear/In-Stream<br/>`2`: Non-Linear/Overlay. 	 																		  | `1` |
| `video.placement` 	 | optional | Video placement type.  See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.9 for Values 						   | `1` |
| `video.minbitrate` 	 | optional | Minumim bit rate in Kbps. 								  | 50 |
| `video.maxbitrate` 	 | optional | Maximum bit rate in Kbps. 								  | 70 |

### Example

#### Banner
```javascript
var adUnits = [
    {
        code: "div-gpt-ad-1460505748561-0",
        mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
        },
        bids: [{
            bidder: 'pwbid',
            params: {
                siteId: "xxxxxx",
                isTest: true
            }
        }]
    }
]
```
#### Native

```javascript
var adUnits = [
    {
        code: 'div-gpt-ad-1460505748561-1',
        sizes: [[1, 1]],
        mediaTypes: {
            native: {
                title: {
                    required: true,
                    len: 80
                },
                body: {
                    required: true
                },
                image: {
                    required: true,
                    sizes: [150, 50]
                },
                sponsoredBy: {
                    required: true
                },
                icon: {
                    required: false
                }
            }
        },
        bids: [{
            bidder: 'pwbid',
            params: {
                siteId: "xxxxxx",
                isTest: true,
            },
        }]
    }
]
```

### Video
```javascript
var videoAdUnits = [
{
    code: 'div-gpt-ad-1460505748561-1',
    mediaTypes: {
        video: {
            playerSize: [640, 480],           // required
            context: 'instream',
            mimes: ['video/mp4','video/x-flv'],   // required
            skip: 1,                              // optional
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
      bidder: 'pwbid',
      params: {
        siteId: 'xxxxxx',                       // required
        isTest: 'true'                          // required
      }
    }]
}]
```
