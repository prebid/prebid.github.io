---
layout: bidder
title: AAX
description: Prebid Aax Bidder Adaptor
biddercode: aax
gdpr_supported: true  
media_types: banner,native,video
usp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: false
pbjs: true
gvl_id: 720
schain_supported: true
floors_supported: true
fpd_supported: true
pbs: true
safeframes_ok: true
multiformat_supported: will-not-bid
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `cid`      | required | The customer id provided by Aax. | `'aax_test_customer'` | `string` |
| `crid`     | required | The placement id provided by Aax. | `'aax_crid'`   | `string` |
| `video`    | required for video Ad units | Object containing video targeting parameters.  See [Video Object](#aax-video-object) for details.|`video: { maxduration: 60 }`         | `object`  |

<a name="aax-video-object" />

#### Video Object

{: .table .table-bordered .table-striped }
| Name       | Type    | Description   | Example|
|------------|----------|--------------|--------|
|mimes|array of strings|(Recommended) Specifies the video content MIME types supported; for example, video/x-ms-wmv and video/x-flv.|["video/x-ms-wmv","video/x-flv"]|
|minduration|integer|(Recommended) Specifies the minimum video ad duration, in seconds.|10|
|maxduration|integer|(Recommended) Specifies the maximum video ad duration, in seconds.|60|
|w|integer|(Recommended) Specifies the width of the video player, in pixels. Required if playerSize not present in `mediaTypes.video`|640|
|h|integer|(Recommended) Specifies the height of the video player, in pixels. Required if playerSize not present in `mediaTypes.video`|480|	
|startdelay	|integer |	(Recommended) Specifies the start delay of the video ad|0|
|battr|	array of integers|Specifies the video creative attributes to block. Refer to section 5.3 of the IAB specification for a list of attributes.| [ 13, 14 ]|
playbackmethod|	array of integers|	Specifies the allowed playback methods. If not specified, all are assumed to be allowed. Currently supported values are: `1: Autoplay, sound on`; `2: Autoplay, sound off`; `3: Click to play`; `4: Mouse over to play`|[1, 3]|
|api| array of integers|	Specifies the supported API frameworks for this impression. If an API is not explicitly listed, it is assumed not to be supported. Currently supported values are: `1: VPAID 1.0`; `2: VPAID 2.0`; `3: MRAID-1`; `4: ORMMA`; `5: MRAID-2`|[1, 2]|
|protocols	|array of integers|	Array of supported video protocols. Currently supported values are: `1: VAST 1.0`; `2: VAST 2.0`; `3: VAST 3.0`; `4: VAST 1.0 Wrapper`; `5: VAST 2.0 Wrapper`; `6: VAST 3.0 Wrapper`; `7: VAST 4.0`|[1, 2]|
|placement	|integer|Placement type for the impression. Possible options: `1: In-Stream`; `2: In-banner`; `3: Outstream/In-article`; `4: In-feed`; `5: Interstitial/Slider/Floating`; `6: Long-Form`;|1|

Besides the above-mentioned parameters, we support all other OpenRTB 2.x video objects as optional parameters.

In addition to `bids[].params.video`, Aax adapter consumes parameters specified in the `mediaTypes.video`.

#### Example of Instream Video Ad-unit
```
var videoAdUnit = {
  code: 'video1',
  mediaTypes: {
    video: {
      context: "instream",
      playerSize: [640, 480],
      mimes: ['video/mp4'],
      placement: 1
    }
  },
  bids: [{
    bidder: 'aax',
    params: {
      cid: 'aax_test_customer',
      crid: 'aax_crid',  
    }
  }]
};
```

#### Example of Native Ad-unit
```
var adUnits = [{
  code: 'div-gpt-ad-6874091242345-0',
  mediaTypes: {
    native: {
      image: {
        required: true,
        sizes: [300, 250],
        wmin: 50,
      },
      title: {
        required: true,
        len: 80
      }
    }
  },
  bids: [{
    bidder: 'aax',
    params: {
      cid: 'aax_test_customer',
      crid: 'aax_crid'
    }
  }]
}];
```

#### Example of Banner Ad-unit
```
var adUnits = [{
  code: 'div-gpt-ad-6874091242345-0',
  mediaTypes: {
    banner: {
      sizes: [
        [728, 90],
        [300, 600],
        [300, 250]
      ],
    }
  },
  bids: [{
    bidder: 'aax',
    params: {
      cid: 'aax_test_customer',
      crid: 'aax_crid'
    }
  }]
}];
```
