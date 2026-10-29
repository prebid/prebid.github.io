---
layout: bidder
title: Michao
description: Prebid Michao SSP Bidder Adapter
biddercode: michao
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
userId: all
media_types: banner, video, native
safeframes_ok: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
privacy_sandbox: topics
sidebarType: 1
---

### Note

The Michao Bidding adapter requires setup before beginning.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ----------- | -------- | ------------ | --------- | --------- |
| `placement` | required | Placement id | `"12345"` | `string` |
| `site` | required | Site id | `6789` | `number` |
| `partner` | optional | Partner id | `6789` | `number` |
| `test` | optional | Test Mode | `true` | `boolean` |

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`
- `ortb2.user.*`
- `ortb2.device.*`
- `ortb2.regs.*`

Example:

```javascript
pbjs.setBidderConfig({
  bidders: ["michao"],
  config: {
    ortb2: {
      site: {
        keywords: "kw1,kw2",
      },
    },
  },
});
```

### ORTB Blocking

supported:

- `badv`
- `bcat`
- `bseat`
- `bapp`

Example:

```javascript
pbjs.setBidderConfig({
  bidders: ["michao"],
  config: {
    ortb2: {
      badv: ["adomain.com"],
      bcat: ["IAB2"],
      bapp: ["com.app"],
      bseat: ["seat"],
    },
  },
});
```

### Media Types

#### Video

The following video parameters are supported here so publishers may fully declare their video inventory. These apply to both instream and outstream.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------- |
| context | required | instream or outstream | "outstream" | string |
| playerSize | required | width, height of the player in pixels | [640,360] - will be translated to w and h in bid request | array<integers> |
| mimes | required | List of content MIME types supported by the player (see openRTB v2.5 for options) | ["video/mp4"] | array<string> |
| protocols | required | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | [2,3,5,6] | array<integers> |
| maxduration | recommended | Maximum video ad duration in seconds. | 30 | integer |
| minduration | recommended | Minimum video ad duration in seconds | 6 | integer |
| linearity | recommended | OpenRTB2 linearity. 1: linear (in-stream ad), 2: non-linear (overlay ad) | 1 | integer |
| playbackmethod | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see openRTB v2.5 section 5.10 for options) | [2] | array<integers> |
| api | optional | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | [2] | array<integers> |
| skip | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | 1 | integer |
| skipafter | optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable. | 6 | integer |
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | integer |
| placement | recommended | Placement type for the impression. (see OpenRTB v2.5 section 5.9 for options) | 1 | integer |
| plcmt | recommended | Placement type for the impression. (See [OpenRTB v2.6](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md) Plcmt Subtypes - Video) | 1 | integer |

Example:

```javascript
var videoAdUnit = {
    code: 'video',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4']
            protocols: [2, 3, 5, 6],
            api: [2],
            maxduration: 30,
            minduration: 0,
        }
    },
    bids: [{
        bidder: 'michao',
        params: {
            site: 123,
            placement: "456",
        }
    }]
};
```

##### Out-stream Video

Michao adapter supports outstream video renderer in two ways: using your own renderer or using ours on Prebid.org.

#### Native

Example:

```js
var nativeAdUnit = {
  code: "myNativeAdUnit",
  mediaTypes: {
    native: {
      ortb: {
        assets: [
          {
            id: 1,
            required: 1,
            img: {
              type: 3,
              w: 150,
              h: 50,
            },
          },
          {
            id: 2,
            required: 1,
            video: {
              minduration: 0,
              maxduration: 120,
              mimes: ["video/mp4"],
              protocols: [8],
            },
          },
        ],
      },
    },
  },
  bids: [
    {
      bidder: "michao",
      params: {
        site: 123,
        placement: "456",
      },
    },
  ],
};
```
