---
layout: bidder
title: Sonobi
description: Prebid Sonobi Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: sonobi
biddercode_longer_than_12: false
prebid_1_0_supported : true
---

### Note:
The Sonobi Bidder adapter requires setup and approval from your Sonobi Account Manager. If you require assistance 
implementing our adapter please don't hesitate to contact us at apex.prebid@sonobi.com.

### bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                  | Type          | Example                          |
|:---------------|:---------|:---------------------------------------------|:--------------|:---------------------------------|
| `placement_id` | required | The placement ID                             | String        | `'1a2b3c4d5e6f1a2b3c4d'`         |
| `ad_unit`      | required | The adunit ID                                | String        | `'/1234567/example/adUnit/code'` |
| `floor`        | optional | Bid floor for this placement in USD          | Integer       | `0.50`                           |
| `sizes`        | optional | Adunit sizes that will override global sizes | Array[String] | `[[300, 250], [300, 600]]`       |
| `hfa`          | optional | Publisher Unique Identifier                  | String        | `'123985'`                       |

### Configuration

The `ad_unit` and `placement_id` are **mutually exclusive** but at least one is required. If you pass both, `ad_unit` takes precedence. 

If you pass the optional `sizes` Array in your bid params it will override the global config sizes for the Sonobi Adapter only.

The `hfa` parameter requires your Sonobi Account Manager to enable this feature for you. Please contact them for further information.

### Example Video Implementation with VideoJs
```
<!--
  This page exists to test a video ad, end-to-end.
-->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Prebid.js video adUnit example</title>

    <!-- videojs -->
    <link rel="stylesheet" href="http://vjs.zencdn.net/5.9.2/video-js.css">
    <script type="text/javascript" src="http://vjs.zencdn.net/5.9.2/video.js"></script>

    <!-- videojs-vast-vpaid -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-vast-vpaid/2.0.2/videojs.vast.vpaid.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-vast-vpaid/2.0.2/videojs_5.vast.vpaid.min.js"></script>

    <!-- prebid.js -->
    <script src="../../build/dist/prebid.js" async=true></script>


    <script>

      var pbjs = pbjs || {};
      pbjs.que = pbjs.que || [];

      /*
       Prebid Video adUnit
       */

      var videoAdUnit = {
        code: 'video1',
        sizes: [640, 480],
        mediaTypes: {
          video: {context: 'instream'}
        },
        bids: [
          {
            bidder: 'sonobi',
            params: {
            	sizes: [],
              placement_id: '92e95368e86639dbd86d',
              video: {
                skipppable: false,
                playback_methods: ['auto_play_sound_off']
              }
            }
          }
        ]
      };

      pbjs.que.push(function(){
        pbjs.addAdUnits(videoAdUnit);
        pbjs.requestBids({
          timeout : 100000,
          bidsBackHandler : function(bids) {
            var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
                adUnit: videoAdUnit,
                params: {
                    cust_params: {
                        hb_vid: bids.video1.bids[0].creativeId
                    },
                    iu: '/7780971/apex_jwplayer_video'
                }
            });
            invokeVideoPlayer(videoUrl);
          }
        });
      });

      pbjs.bidderSettings =
        {
          standard: {
            adserverTargeting: [
              {
                key: "hb_bidder",
                val: function (bidResponse) {
                  return bidResponse.bidderCode;
                }
              }, {
                key: "hb_adid",
                val: function (bidResponse) {
                  return bidResponse.adId;
                }
              }, {
                key: "hb_pb",
                val: function (bidResponse) {
                  return "10.00";
                }
              }, {
                key: "hb_size",
                val: function (bidResponse) {
                  return bidResponse.size;

                }
              }
            ]
          }
        };
    </script>
</head>

<body>

<h2>Prebid Video -- video.js</h2>

<div class="example-video-container">

    <video id="vid1" class="video-js vjs-default-skin vjs-big-play-centered" controls
           data-setup='{}'
           width='640'
           height='480'
    >
        <source src="http://vjs.zencdn.net/v/oceans.mp4" type='video/mp4'/>
        <source src="http://vjs.zencdn.net/v/oceans.webm" type='video/webm'/>
        <source src="http://vjs.zencdn.net/v/oceans.ogv" type='video/ogg'/>

    </video>
</div>

<script>
  function invokeVideoPlayer(url) {
    videojs("vid1").ready(function() {
      this.vastClient({
        adTagUrl: url,
        playAdAlways: true,
        verbosity: 4,
          timeout: 100000,
        vpaidFlashLoaderPath: "https://github.com/MailOnline/videojs-vast-vpaid/blob/RELEASE/bin/VPAIDFlash.swf?raw=true",
        autoplay: true,
      });

      this.muted(true);
      this.play();
    });
  }

</script>
</body>
</html>


```

