---
layout: bidder
title: Epsilon
description: Epsilon Prebid Bidder Adaptor (formerly Conversant)
pbjs: true
pbs: true
biddercode: conversant
media_types: video
gdpr_supported: true
userIds: criteo, id5Id, identityLink, liveIntentId, parrableId, pubCommonId, unifiedId, publinkId
prebid_member: true
schain_supported: true
gvl_id: 24
sidebarType: 1
---



### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope                       | Description                                                                                                               | Example           | Type             |
|---------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------|-------------------|------------------|
| `site_id`     | required                    | The site ID from Epsilon.                                                                                              | `'87293'`         | `string`         |
| `secure`      | required (for secure pages) | If impression requires secure HTTPS URL creative assets and markup. 0 for non-secure, 1 for secure. Default is non-secure | `1`               | `integer`        |
| `bidfloor`    | optional                    | Bid floor                                                                                                                 | `0.50`            | `float`          |
| `tag_id`      | optional                    | Identifies specific ad placement.                                                                                         | `'cnvr-test-tag'` | `string`         |
| `white_label_url`| optional                  | Override the destination URL the request is sent to.                                                                       | `'https://mydomain.com/hbendpoint'`  | `string` |
| `pubcid_name` | optional                    | Name of the pub common id. Epsilon adapter can read the id directly if the UserID module is absent. Default is _pubcid.| `'_pubcid'`         | `string`         |

### Video Params

{: .table .table-bordered .table-striped }

| Name          | Scope                       | Description                                                                                                               | Example           | Type             |
|---------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------|-------------------|------------------|
| `position`    | optional                    | Ad position on screen. See details below.  Only supported in bids.params.                                                 | `1`               | `integer`        |
| `mimes`       | optional                    | Array of content MIME types supported. Required for video                                                                 | `['video/mp4']`   | `Array<string>`  |
| `maxduration` | optional                    | Maximum duration in seconds for this video as an integer.                                                                 | `30`              | `integer`        |
| `api`         | optional                    | Array of supported API frameworks. See details below.                                                                     | `[2]`             | `Array<integer>` |
| `protocols`   | optional                    | Array of supported video protocols. See details below.                                                                    | `[2]`             | `Array<integer>` |


Video parameters can be included in either `mediaTypes.video` or `bids.params` except where noted.

The following values are defined in the [ORTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf).

### position

+ `0` : Unknown
+ `1` : Above the Fold
+ `3` : Below the Fold
+ `4` : Header
+ `5` : Footer
+ `6` : Sidebar
+ `7` : Full Screen

### api

+ `1` : VPAID 1.0
+ `2` : VPAID 2.0
+ `3` : MRAID 1.0
+ `4` : ORMMA
+ `5` : MRAID 2.0
+ `6` : MRAID 3.0

<a id="epsilon-protocols"></a>
### protocols
+ `1` : VAST 1.0
+ `2` : VAST 2.0
+ `3` : VAST 3.0
+ `4` : VAST 1.0 Wrapper
+ `5` : VAST 2.0 Wrapper
+ `6` : VAST 3.0 Wrapper
+ `7` : VAST 4.0
+ `8` : VAST 4.0 Wrapper
+ `9` : DAAST 1.0
+ `10` : DAAST 1.0 Wrapper

### First Party Data
Publishers should use the `ortb2` method of setting for setting First Party Data.
Example first party data configuration that is available to all adUnits
```
pbjs.setConfig({
    debug: true,
    cache: {
    url: 'https://prebid.adnxs.com/pbc/v1/cache'
    },
    ortb2: { 
        site: { 
            content: { 
                series: 'MySeries', 
                season: 'My Season', 
                episode: 3, 
                title: 'My Title' 
            } 
        } 
    }
});
``` 

Example AdUnit specific data using the `ortb2Imp` object
```
        var videoAdUnit = {
            code: 'video1',
            mediaTypes: {
                video: {
                    playerSize: [[640, 480]]
                }
            },
            ortb2Imp: {
                instl: 1,
                ext: {
                    data: {
                        adUnitSpecificAttribute: "123"
                    }
                }
            },
            bids: [{
                bidder: 'conversant',
                params: {
                    site_id: '108060',
                    mimes: ['video/mp4', 'video/webm']
                }
            }]
        }

        pbjs.que.push(function(){
            pbjs.addAdUnits(videoAdUnits);
        }
```

