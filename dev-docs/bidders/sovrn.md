---
layout: bidder
title: Sovrn
description: Prebid Sovrn Bidder Adaptor
pbjs: true
pbs: true
biddercode: sovrn
gdpr_supported: true
usp_supported: true
userIds: all
prebid_member: true
schain_supported: true
gvl_id: 13
floors_supported: true
fpd_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `tagid`    | required | The sovrn Ad Tag ID  | `'315045'` | `string` |
| `bidfloor` | optional | Bid floor in dollars | `'0.04'`   | `string` |

### Bid Params for video ads

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description          | Example    | Type           |
|---------------------|----------|------------------------------------------------------------------------------------------|-----------------|-----------------|
| `video.mimes`       | required | Content MIME types supported                                                             | `['video/mp4']` | `string array`  |
| `video.minduration` | required | Minimum video ad duration in seconds                                                     | `5`             | `integer`       |
| `video.maxduration` | required | Maximum video ad duration in seconds                                                     | `10`            | `integer`       |
| `video.protocols`   | optional | The array of supported video protocols                                                   | `[1, 2]`        | `integer array` |
| `video.w`           | optional | Width of the video player in device independent pixels (DIPS)                            | `5`             | `integer`       |
| `video.h`           | optional | Height of the video player in device independent pixels (DIPS)                           | `5`             | `integer`       |
| `video.startdelay`  | optional | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements  | `5`             | `integer`       |

### Note

[Protocols list](https://docs.prebid.org/dev-docs/bidders/conversant.html#protocols)

#### MIME types:

##### iOS with VPAID2:

video/3gpp,
video/mov,
video/mp4,
video/mpv,
application/javascript

##### iOS without VPAID2:  

video/3gpp,
video/mov,
video/mp4,
video/mpv

##### Others with VPAID2:  

video/mp4,
video/3gpp,
application/javascript

##### Others without VPAID2:

video/mp4,
video/3gpp

Source: [OpenRTB scpecification](https://developers.smaato.com/demand-partners/openrtb-2-5-specifications/)

### Example

#### Video instream adUnit

```
    var instreamAdUnit = {
      code: 'instream-div',
      sizes: [[640, 480]],
      mediaTypes: {
        video: {
          mimes: ['video/mp4'],
          minduration: 4,
          maxduration: 6,
          context: 'instream'
        }
      },
      bids: [{
        bidder: 'sovrn',
        params: {
          tagid: '315045'
        }
      }]
    }
```
#### Video outstream adUnit

```
    var outstreamAdUnit = {
      code: 'outstream-div',
      sizes: [[640, 480]],
      mediaTypes: {
        video: {
          mimes: ['video/mp4'],
          minduration: 4,
          maxduration: 6,
          context: 'outstream'
        }
      },
      bids: [{
        bidder: 'sovrn',
        params: {
          tagid: '315045'
        }
      }]
    },
```
#### Banner adUnit

```
    var bannerAdUnit = {
      code: 'banner-div',
      sizes: [[300, 250]],
      bids: [{
        bidder: 'sovrn',
        params: {
          tagid: '315045'
        }
      }]
    }
```
