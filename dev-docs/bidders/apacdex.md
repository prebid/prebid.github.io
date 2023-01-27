---
layout: bidder
title: Apacdex
description: Prebid APAC Digital Exchange Bidder Adapter
pbjs: true
biddercode: apacdex
media_types: banner, video
gdpr_supported: true
schain_supported: true
usp_supported: true
userIds: all
floors_supported: true
pbs: true
pbs_app_supported: true
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Bid Params](#bid-params)
- [Geo Object](#geo-object)
- [Video Ad Unit](#video-ad-unit)
- [Sample Banner Ad Unit](#sample-banner-ad-unit)
- [Sample Video Ad Unit: Instream](#sample-video-ad-unit-instream)
- [Sample Video Ad Unit: Outstream](#sample-video-ad-unit-outstream)

<a name="apacdex-bid-params" />

### Bid Params

{: .table .table-bordered .table-striped }
|  Name         | Scope    | Description                                                                         | Example                                           | Type     |
|---------------|----------|-------------------------------------------------------------------------------------|---------------------------------------------------|----------|
| `placementId`*| required | Placement ID provided by Apacdex                                                    | `'plc100000'`                                     | `string` |
| `siteId`*     | required | Publisher site ID from Apacdex                                                      | `'apacdex1234'`                                   | `string` |
| `floorPrice`  | optional | CPM bidfloor in USD                                                                 | `0.03`                                            | `float`  |
| `geo`         | optional | GEO data of device. See [Geo Object](#apacdex-geo-object) for details.              | `{"lat":17.98928,"lon":99.7741712,"accuracy":20}` | `object` |

(*) Please do not use `placementId` and `siteId` at the same time.

<a name="apacdex-geo-object" />

### Geo Object

If the publisher has GEO data of the user's device. Make it available through the geo audience so we can improve ad targeting, which means improving bids. The list of fields can be referenced in Section 3.2.19 from the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) document.

{: .table .table-bordered .table-striped }
|  Name        | Scope    | Description                                                                                                                                                                                                                                                                                | Example         | Type      |
|--------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `lat`        | required | Latitude from -90.0 to +90.0, where negative is south.                                                                                                                                                                                                                                     | `17.98928`      | `float`   |
| `lon`        | required | Longitude from -180.0 to +180.0, where negative is west.                                                                                                                                                                                                                                   | `99.7741712`    | `float`   |
| `accuracy`   | required | Estimated location accuracy in meters; recommended when lat/lon are specified and derived from a device’s location services (i.e., type = 1). Note that this is the accuracy as reported from the device. Consult OS specific documentation (e.g., Android, iOS) for exact interpretation. | `20`            | `integer` |
| `lastfix`    | optional | Number of seconds since this geolocation fix was established. Note that devices may cache location data across multiple fetches. Ideally, this value should be from the time the actual fix was taken.                                                                                     | `30`            | `integer` |
| `utcoffset`  | optional | Local time as the number +/- of minutes from UTC.                                                                                                                                                                                                                                          | `-420`          | `integer` |

<a name="apacdex-video-ad-unit" />

### Video Ad Unit

Publishers declare video inventory by passing the following parameters via mediaTypes.video

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `context` | required | instream or outstream |`"outstream"` | `string` |
| `playerSize`| required | width, height of the player in pixels | `[640,360]` - will be translated to w and h in bid request | `array<integers>` |
| `mimes` | recommended | List of content MIME types supported by the player (see openRTB v2.5 for options) | `["video/mp4"]`| `array<string>`|
| `protocols` | recommended | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | `[2,3,5,6]` | `array<integers>`|
| `api` | recommended | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | `[2]` |  `array<integers>` |
| `maxduration` | recommended | Maximum video ad duration in seconds. | `30` | `integer` |
| `minduration` | recommended | Minimum video ad duration in seconds | `6` | `integer` |
| `playbackmethod` | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see openRTB v2.5 section 5.10 for options)| `[2]`| `array<integers>` |
| `skip` | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | `1` | `integer` |
| `skipafter`| optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable. | `6` | `integer`|
| `minbitrate` | optional | Minimum bit rate in Kbps. | `300` | `integer` |
| `maxbitrate` | optional | Maximum bit rate in Kbps. | `9600` | `integer` |
| `startdelay`* | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.<br /> >0: Mid-Roll (value indicates start delay in second)<br /> 0: Pre-Roll<br />-1: Generic Mid-Roll<br />-2: Generic Post-Roll | `0` | `integer` |
| `placement`* | recommended | Placement type for the impression. (see openRTB v2.5 section 5.9 for options) | `1` | `integer` |

Lists of values are in the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) documentation as referenced above.

<a name="apacdex-sample-banner-ad-unit" />

### Sample Banner Ad Unit
```
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300,600]]
      }
    },
    bids: [
      {
          bidder: 'apacdex',
          params: {
              siteId: 'apacdex1234', // siteId provided by Apacdex
              floorPrice: 0.01, // default is 0.01 if not declared
          }
      }
    ]
  }
];
```

<a name="apacdex-sample-instream-ad-unit" />

### Sample Video Ad Unit: Instream
```
var instreamAdUnit = {
  code: 'test-div',
  sizes: [[640, 480]],
  mediaTypes: {
    video: {
      playerSize: [[640, 480]],
      context: "instream"
      api: [2],
      placement: 1,
      skip: 1,
      linearity: 1,
      minduration: 1,
      maxduration: 120,
      mimes: ["video/mp4", "video/x-flv", "video/x-ms-wmv", "application/vnd.apple.mpegurl", "application/x-mpegurl", "video/3gpp", "video/mpeg", "video/ogg", "video/quicktime", "video/webm", "video/x-m4v", "video/ms-asf", video/x-msvideo"],
      playbackmethod: [6],
      startdelay: 0,
      protocols: [1, 2, 3, 4, 5, 6]
    },
  },
  bids: [
    {
      bidder: 'apacdex',
      params: {
        siteId: 'apacdex1234', // siteId provided by Apacdex
        floorPrice: 0.01, // default is 0.01 if not declared
      }
    }
  ]
};
```
mediaTypes.video object reference to section 3.2.7 Object: Video in the OpenRTB 2.5 document
You must review all video parameters to ensure validity for your player and DSPs

<a name="apacdex-sample-outstream-ad-unit" />

### Sample Video Ad Unit: Outstream
```
var outstreamAdUnit = {
  code: 'test-div',
  sizes: [[410, 231]],
  mediaTypes: {
    video: {
      playerSize: [[410, 231]],
      context: "outstream"
      api: [2],
      placement: 5,
      linearity: 1,
      minduration: 1,
      maxduration: 120,
      mimes: ["video/mp4", "video/x-flv", "video/x-ms-wmv", "application/vnd.apple.mpegurl", "application/x-mpegurl", "video/3gpp", "video/mpeg", "video/ogg", "video/quicktime", "video/webm", "video/x-m4v", "video/ms-asf", video/x-msvideo"],
      playbackmethod: [6],
      startdelay: 0,
      protocols: [1, 2, 3, 4, 5, 6]
    },
  },
  bids: [
    {
      bidder: 'apacdex',
      params: {
        siteId: 'apacdex1234', // siteId provided by Apacdex
        floorPrice: 0.01, // default is 0.01 if not declared
      }
    }
  ]
};
```
mediaTypes.video object reference to section 3.2.7 Object: Video in the OpenRTB 2.5 document
You must review all video parameters to ensure validity for your player and DSPs
