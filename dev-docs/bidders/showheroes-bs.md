---
layout: bidder
title: ShowHeroes
description: Prebid ShowHeroes Bidder Adapter
pbjs: true
biddercode: showheroes-bs
media_types: video
gvl_id: 111
tcfeu_supported: true
usp_supported: true
schain_supported: true
userId: all
floors_supported: true
fpd_supported: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---



### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope                            | Description                         | Example                                  | Type      |
|-------------|----------------------------------|-------------------------------------|------------------------------------------|-----------|
| `unitId`    | required                         | ShowHeroes MAX unit ID              | `'1234abcd-5678efgh'`                     | `string`  |

All other parameters should be sent inside openRTB request.

### openRTB2 support

{: .alert.alert-danger :}
Starting with Prebid.js version 9.16 ShowHeores bidder adapter is requesting bids via openRTB protocol.  
Publishers can use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). Bidder supports all first-party data fields: site, user, segments, and imp-level first-party data.

### testing

While developing or testing locally, you can request a test request by marking the openRTB as a test.
To do that specifically for `showheroes-Bs` you can do:

```javascript
pbjs.setBidderConfig({
  bidders: ['showheroesBs'],
  config: {
    ortb2: {
      test:1
    }
  }
})
```

Or, more easily you can mark the whole request as a test request by doing:

```javascript
pbjs.setConfig({ortb2: {test: 1}})
```

#### Outstream

Example of adunit configuration for the outstream unit:

```javascript

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
var adUnits = [
    {
        // Video adUnit
        code: 'video-div-1',
        mediaTypes: {
            video: {
                context: 'outstream',
                playerSize: [640, 480],
                mimes: ['video/mp4'],
                playbackmethod: [2, 4, 6],
                api: [1, 2, 4, 6],
                protocols: [3, 4, 7, 8, 10],
                placement: 1,
                minduration: 0,
                maxduration: 60,
                startdelay: 0,
                skip: 1
            },
        },
        bids: [{
            bidder: "showheroes-bs",
            params: {
                unitId: "1234abcd-5678efgh",
            }
        }],
    }
];
pbjs.que.push(function () {
    pbjs.setConfig({...});
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({ bidsBackHandler: sendAdServerRequest });
});
```

You could use this example and place it in .html example pages inside the Prebid.js repository.

#### instream

Example of adunit configuration for the instream unit:

```javascript

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
var videoAdUnit = {
        code: 'video1',
        sizes: [640,480],
        mediaTypes: {
          video: {context: 'instream',  playerSize: [640, 480]}
        },
        bids: [
          {
            bidder: 'showheroesBs',
            params: {
              unitId: "1234abcd-5678efgh",
          }
          }
        ]
};
pbjs.que.push(function(){
    pbjs.addAdUnits(videoAdUnit);
    pbjs.setConfig({
                cache: {
                    url: 'https://prebid.adnxs.com/pbc/v1/cache'
                },
                ...,
            });
    pbjs.requestBids({
        timeout: 10000,
        bidsBackHandler : function(bids) {
            var vastUrl = bids["video1"].bids[0].vastUrl
            invokeVideoPlayer(vastUrl);
        }
    });
});
```

You could use this example and place it in the `test/pages/instream.html` example page inside the Prebid.js repository.
