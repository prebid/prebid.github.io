---
layout: bidder
title: Connatix
description: Connatix Bidder Adapter
biddercode: connatix
tcfeu_supported: true
gvl_id: 143
usp_supported: true
coppa_supported: false
gpp_sids: tcfeu, usp
schain_supported: false
dchain_supported: false
userId: none
media_types: video, banner
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement id | `'ed8a9c16-88ea-4724-aa0d-013c3e595e49'` | `string` |
| `bidfloor` | optional | Floor price | `2.5` | `float` |

### Media Types

#### Video

The following parameters are available for `mediaTypes.video`.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| context | recommended | instream or outstream |"instream" | string |
| playerSize| required | width, height of the player in pixels | [640,360] - will be translated to w and h in bid request | Array\<integer> |
| mimes | recommended | List of content MIME types supported by the player (see openRTB v2.5 for options) | ["video/mp4"]| Array\<string>|
| protocols | recommended | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | [2,3,5,6] | Array\<integer>|
| linearity | recommended | OpenRTB2 linearity. 1: linear (in-stream ad), 2: non-linear (overlay ad) | 1 | integer |
| maxduration | recommended | Maximum video ad duration in seconds. | 30 | integer |
| minduration | recommended | Minimum video ad duration in seconds | 6 | integer |
| playbackmethod | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see [openRTB v2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) section 5.10 for options)| [2]| Array\<integer> |
| api | optional | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | [2] | Array\<integer> |
| skip | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | 1 | integer |
| skipmin | optional | Videos of total duration greater than this number of seconds can be skippable; only applicable if the ad is skippable. | 30 | integer |
| skipafter| optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable. | 6 | integer|
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | integer |
| startdelay | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.<br /> >0: Mid-Roll (value indicates start delay in second)<br /> 0: Pre-Roll<br />-1: Generic Mid-Roll<br />-2: Generic Post-Roll | 0 | integer |
| placement | recommended | Placement type for the impression. (see OpenRTB v2.5 section 5.9 for options) | 1 | integer |
| plcmt | recommended | Placement type for the impression. (See [OpenRTB v2.6](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md) Plcmt Subtypes - Video) | 1 | integer |
| pos | optional | OpenRTB page position value: 0=unknown, 1=above-the-fold, 3=below-the-fold, 4=header, 5=footer, 6=sidebar, 7=full-screen | 1 | integer |

**Example video**

```javascript
var adUnits = [
  {
    code: "1",
    mediaTypes: {
      video: {
        context: "instream",
        w: 1280,
        h: 720,
        playerSize: [1280, 720], // recommended
        placement: 1,
        plcmt: 1,
        api: [1, 2],
        mimes: ["video/mp4", "application/javascript"],
        minduration: 30,
        maxduration: 60,
        startdelay: 0,
      },
    },
    bids: [
      {
        bidder: "connatix",
        params: {
          placementId: "e4984e88-9ff4-45a3-8b9d-33aabcad634e", // required
          bidfloor: 2.5, // optional
        },
      },
      // Add more bidders and their parameters as needed
    ],
  },
  // Define more ad units here if necessary
];
```

#### Banner

The following parameters are available for `mediaTypes.banner`.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| sizes| required | All the sizes of the banner this ad unit can accept. | [[300, 250], [300, 600]] | \[number, number\][] |
| pos | optional | OpenRTB page position value: 0=unknown, 1=above-the-fold, 3=below-the-fold, 4=header, 5=footer, 6=sidebar, 7=full-screen | 1 | integer |

**Example banner**

```js
var adUnits = [
  {
    code: "1",
    mediaTypes: {
      banner: {
        sizes: [
          [640, 480],
          [320, 180],
        ],
      },
    },
    bids: [
      {
        bidder: "connatix",
        params: {
          placementId: "e4984e88-9ff4-45a3-8b9d-33aabcad634e", // required
          bidfloor: 2.5, // optional
        },
      },
      // Add more bidders and their parameters as needed
    ],
  },
  // Define more ad units here if necessary
];
```

### Configuration

To maximize revenue efficiency, please enable `iframe` user syncing.

Connatix strongly recommends enabling user syncing through iFrames. This functionality improves DSP user match rates and increases the bid rate and bid price. Make sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Connatix.

#### Example configuration

```js
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ["connatix"],
        filter: "include",
      },
    },
  },
});
```
