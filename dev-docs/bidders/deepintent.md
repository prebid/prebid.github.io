---
layout: bidder
title: Deepintent
description: Prebid Deepintent Bidder Adaptor
pbjs: true
pbs: true
biddercode: deepintent
media_types: banner, video
gdpr_supported: true
usp_supported: true
gvl_id: 541
sidebarType: 1
---

### Bid Params

| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `tagId`       | mandatory| Ad Tag Id             | `'1399'`                  | `string` |
| `height`      | optional | height of the creative| `350`                     | `number` |
| `width`       | optional | width of the creative | `250`                     | `number` |
| `custom`      | optional | custom key value params| `'{"position":"right-box"}''`| `object` |
| `user`        | optional | user params according to IAB standards | `'{"gender":"F"}''`| `object` |
| `pos`         | optional | ad position as per IAB standards       | `1`                | `number` |

### Configuration

Deepintent recommends the UserSync configuration below.  Without it, the Deepintent adapter will not able to perform user syncs, which lowers match rate and reduces monetization.

```javascript
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
```

### AdUnit Format for Banner

```javascript
var adUnits = [
            {
                code: 'div-22',
                mediaTypes: {
                    banner: {
                        sizes: [
                            [300, 250],
                            [300, 600]
                         ]
                    }
                },
                bids: [{
                    bidder: 'deepintent',
                    params: {
                        tagId: "1399",
                        height: 300,
                        width: 250,
                        pos: 1,
                        user: {
                            gender: "F",
                            uid: "publisher_uid",
                            buyeruid: "test_buyeruid",
                            yob: 2000  
                        },
                        custom: {
                            "position": "right-box"
                        }
                    }
                }]
            }
        ];
```

### video parameters

Deepintent supports video as of Prebid v1.16.0

{: .table .table-bordered .table-striped }
| Name                      | Scope    | Description                                                  | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `video.mimes`          | required | Video MIME types                                               | `['video/mp4','video/x-flv']` |
| `video.skippable`      | optional | If 'true', user can skip ad                                   | `true` |
| `video.minduration`      | optional | Minimum ad duration in seconds                              | `5` |
| `video.maxduration`       | optional | Maximum ad duration in seconds                               | `30` |
| `video.startdelay`      | optional | Start delay in seconds for pre-roll, mid-roll, or post-roll ad placements | `5` |
| `video.playbackmethod` | optional | Defines whether inventory is user-initiated or autoplay sound on/off<br/>Values:<br/>`1`: Auto-play, sound on<br/>`2`: Auto-play, sound off<br/>`3`: Click-to-play<br/>`4`: mouse-over      | `1` |
| `video.api`              | optional | API frameworks supported<br/>Values:<br/>`1`: VPAID 1.0<br/>`2`: VPAID 2.0<br/>`3`: MRAID-1<br/>`4`: ORMMA<br/>`5`: MRAID-2                                                                            | `[1, 2]` |
| `video.protocols`      | optional |  Supported video bid response protocols<br/>Values<br/>`1`: VAST 1.0<br/>`2`: VAST 2.0<br/>`3`: VAST 3.0<br/> `4`: VAST 1.0 Wrapper<br/>`5`: VAST 2.0 Wrapper<br/>`6`: VAST 3.0 Wrapper            | `[5, 6]` |
| `video.battr`          | optional | Blocked creative attributes, See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.3 for values             | `[3, 9]` |
| `video.linearity`      | optional | Indicates if the impression is linear or nonlinear<br/>Values:<br/>`1`: Linear/In-Stream<br/>`2`: Non-Linear/Overlay.                                                                                | `1` |
| `video.placement`      | optional | Video placement type.  See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.9 for Values                            | `1` |
| `video.minbitrate`      | optional | Minumim bit rate in Kbps.                                   | 50 |
| `video.maxbitrate`      | optional | Maximum bit rate in Kbps.                                   | 70 |

### AdUnit Format for Video

```javascript
var videoAdUnits = [
{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'instream'
          }
    },
    bids: [{
      bidder: 'deepintent',
      params: {
        tagId: "1399",                            // required
        publisherId: '32572',                     // required
        adSlot: '38519891@300x250'                // required
        video: {
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
      }
    }]
}]
```
