---
layout: bidder
title: PubMatic
description: Prebid PubMatic Bidder Adaptor
biddercode: pubmatic
media_types: banner, video, native
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: true
floors_supported: true
userIds: all
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
ortb_blocking_supported: true
gvl_id: 76
multiformat_supported: true
sidebarType: 1
endpoint_compression: true
---

### Table of contents

* [Introduction](#introduction)
* [Bid Params](#bid-params)
* [First Party Data](#first-party-data)
* [UserSync](#usersync)
* [adSlot](#adslot)
* [Banner](#banner)
* [Video](#video)
* [Native](#native)
* [Multi-format](#multi-format)
* [Prebid Server](#prebid-server)
* [Endpoint Compression](#endpoint-compression)

### Introduction

Publishers can use Prebid.js to call PubMatic in any of the following ways:

* **Call through our client-side adapter**: Prebid.js calls PubMatic directly from the browser using our client-side adapter.
* **Call through our server-side adapter**: Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call PubMatic.

We highly recommend adding the `gptPreAuction` module to populate GPID (Global Placement ID) values. See the [gptPreAuction module documentation](https://docs.prebid.org/dev-docs/modules/gptPreAuction.html) for implementation details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                                                                                                                                                                                                                       | Example                                                   | Type               |
|-----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|--------------------|
| `publisherId`   | required | PubMatic-specific identifier associated with your account                                                                                                                                                                                                                        | `'32572'`                                                 | `string`           |
| `adSlot`        | optional | PubMatic-specific identifier associated with this ad unit. Refers to Ad Tags within PubMatic UI. We accept Ad Tag Name or Ad Tag ID, refer to example.                                                                                                                          | `'38519891'` or `'homepage_banner'`                      | `string`           |
| `dctr`          | optional | Deal Custom Targeting<br><i>(Value configured in each adunit will be passed inside adunit configs i.e., imp.ext)</i>                                                                                                                                                             | `'key1:abc\|key2:123'`                                      | `string`           |
| `deals`         | optional | PMP deals<br><i>(Passed per slot. Each deal-id should be a string with more than 3 characters.)</i>                                                                                                                                                                                         | `['deal-id-5', 'deal-id-6', 'deal-id-7']`               | `array of strings` |
| `outstreamAU`   | optional | Renderer ID provided by your account representative. Required for outstream video bids unless the ad unit has a [supplied renderer](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html#renderers).                                                                 | `'renderer_test_pubmatic'`                                | `string`           |

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`
- `ortb2.user.*`

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`

### UserSync

PubMatic recommends the UserSync configuration below. Without it, the PubMatic adapter will not be able to perform user syncs, which lowers match rate and reduces monetization.

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*', // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

**Note:** *Combine the above configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only the last call for a given attribute will take effect.*

### adSlot

The adSlot parameter is optional. If you choose to omit it, your PubMatic account must have default site and tag settings enabled. Contact your PubMatic Account Manager to learn more.

The adSlot parameter accepts either an Ad Tag Name or Ad Tag ID from PubMatic UI. We recommend using only one adSlot value per ad unit. See the [Banner](#banner) section for an example.

{: .table .table-bordered .table-striped }

| Format         | Example              |
|----------------|----------------------|
| Ad Tag ID   | `'38519891'`         |
| Ad Tag Name      | `'unique-name-here'` |

### Banner

```javascript
var adUnits = [{
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [300, 600]
            ]
        }
    },
    bids: [{
        bidder: 'pubmatic',
        params: {
            publisherId: '32572', // required
            adSlot: '38519891' // optional - can be ID or name like 'homepage_banner'
        }
    }]
}];
```

### Video

The following parameters are available for `mediaTypes.video` configuration:

{: .table .table-bordered .table-striped }

| Name                      | Scope    | Description                                              | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `mimes`          | required | List of content MIME types supported by the player. See [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for options | `['video/mp4']` |
| `minduration`    | recommended | Minimum video ad duration in seconds | `5` |
| `maxduration`    | recommended | Maximum video ad duration in seconds | `30` |
| `startdelay`     | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements<br/>`>0`: Mid-Roll (value indicates start delay in seconds)<br/>`0`: Pre-Roll<br/>`-1`: Generic Mid-Roll<br/>`-2`: Generic Post-Roll | `0` |
| `playbackmethod` | recommended | Playback methods that may be in use. Only one method is typically used in practice. See [OpenRTB 2.5 section 5.10](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for options<br/>`1`: Auto-play, sound on<br/>`2`: Auto-play, sound off<br/>`3`: Click-to-play<br/>`4`: Mouse-over | `[2]` |
| `protocols`      | recommended | Supported video bid response protocol values<br/>`1`: VAST 1.0<br/>`2`: VAST 2.0<br/>`3`: VAST 3.0<br/>`4`: VAST 1.0 Wrapper<br/>`5`: VAST 2.0 Wrapper<br/>`6`: VAST 3.0 Wrapper<br/>`7`: VAST 4.0<br/>`8`: VAST 4.0 Wrapper | `[2, 3, 5, 6]` |
| `linearity`      | recommended | OpenRTB2 linearity<br/>`1`: Linear/In-Stream<br/>`2`: Non-Linear/Overlay | `1` |
| `placement`      | recommended | Placement type for the impression. See [OpenRTB 2.5 section 5.9](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for options | `1` |
| `plcmt`          | recommended | Video placement type. See [OpenRTB 2.6 Plcmt Subtypes - Video](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md#list_plcmtsubtypesvideo) | `1` |
| `skippable`      | optional | Indicates if the player will allow the video to be skipped, where `true` = skippable | `true` |
| `api`            | optional | Supported API framework values<br/>`1`: VPAID 1.0<br/>`2`: VPAID 2.0<br/>`3`: MRAID-1<br/>`4`: ORMMA<br/>`5`: MRAID-2 | `[1, 2]` |
| `battr`          | optional | Blocked creative attributes. See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.3 for values | `[3, 9]` |
| `minbitrate`     | optional | Minimum bit rate in Kbps | `300` |
| `maxbitrate`     | optional | Maximum bit rate in Kbps | `1500` |

#### Instream Video

```javascript
var videoAdUnits = [{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480], // required
            context: 'instream', // required
            mimes: ['video/mp4'], // required
            minduration: 5,
            maxduration: 30,
            startdelay: 0,
            playbackmethod: [2],
            protocols: [2, 3, 5, 6],
            linearity: 1,
            placement: 1,
            plcmt: 1
        }
    },
    bids: [{
        bidder: 'pubmatic',
        params: {
            publisherId: '32572', // required
            adSlot: '38519891' // optional - can be ID or name like 'video_preroll'
        }
    }]
}];
```

#### Outstream Video

```javascript
var videoAdUnits = [{
    code: 'test-div-video-outstream',
    mediaTypes: {
        video: {
            playerSize: [300, 250], // required
            context: 'outstream', // required
            mimes: ['video/mp4'], // required
            minduration: 5,
            maxduration: 30,
            startdelay: 0,
            playbackmethod: [2],
            protocols: [2, 3, 5, 6],
            linearity: 1,
            placement: 3,
            plcmt: 4
        }
    },
    bids: [{
        bidder: 'pubmatic',
        params: {
            publisherId: '32572', // required
            adSlot: '38519891', // optional - can be ID or name like 'outstream_article'
            outstreamAU: 'renderer_test_pubmatic' // required for outstream video
        }
    }]
}];
```

**Note:** *As an alternative to using the `outstreamAU` parameter, you can supply your own renderer at the ad unit level. This gives you more control over the rendering process. For more information on configuring custom renderers, see the [Prebid.js Outstream Video documentation](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html#renderers).*

#### Configuration for Video

For video ads, Prebid cache needs to be enabled for the PubMatic adapter.

```javascript
pbjs.setConfig({
    cache: {
        url: 'https://my-pbs.example.com/cache'
    }
});
```

### Native

We recommend using the ORTB Native spec 1.2.

```javascript
var adUnits = [{
    code: 'test-div-native',    
    mediaTypes: {
        native: {
            ortb: {
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50
                    }
                },
                {
                    id: 2,
                    required: 1,
                    title: {
                        len: 80
                    }
                },
                {
                    id: 3,
                    required: 1,
                    data: {
                        type: 1
                    }
                },
                {
                    id: 4,
                    required: 1,
                    data: {
                        type: 2
                    }
                }]
            }
        }
    },
    bids: [{
        bidder: 'pubmatic',
        params: {
            publisherId: '32572', // required
            adSlot: '38519891' // optional - can be ID or name like 'native_sidebar'
        }
    }]
}];
```

### Multi-format

PubMatic supports multi-format ad units, allowing a single ad unit to accept multiple media types (banner, video, and native). The adapter will prioritize formats based on the order they are defined in the `mediaTypes` object.

```javascript
var adUnits = [{
    code: 'test-div-multi',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [300, 600]
            ]
        },
        video: {
            context: 'outstream',
            playerSize: [300, 250],
            mimes: ['video/mp4'],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30
        },
        native: {
            ortb: {
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50
                    }
                },
                {
                    id: 2,
                    required: 1,
                    title: {
                        len: 80
                    }
                }]
            }
        }
    },
    bids: [{
        bidder: 'pubmatic',
        params: {
            publisherId: '32572', // required
            adSlot: '38519891' // optional - can be ID or name like 'multi_format_ad'
        }
    }]
}];
```

### Prebid Server

The following test parameters can be used to verify that Prebid Server is working properly with the
PubMatic adapter. This example includes an `imp` object with a PubMatic test publisher ID, ad slot,
and sizes that would match with the test creative.

```json
{
"imp":[
      {
         "id":"some-impression-id",
         "banner":{
            "format":[
               {
                  "w":300,
                  "h":250
               },
               {
                  "w":300,
                  "h":600
               }
            ]
         },
         "ext":{
            "pubmatic":{
               "publisherId": "156276",
               "adSlot":"pubmatic_test"
            }
         }
      }
   ]
}
```

### Endpoint Compression

This adapter utilizes gzip compression support built into Prebid.js core. For more information, see [Compression Support for Outgoing Requests](https://docs.prebid.org/dev-docs/bidder-adaptor.html#compression-support-for-outgoing-requests)

#### Disabling Compression

You can disable gzip compression at the bidder level using `pbjs.setBidderConfig`. Set the `gzipEnabled` value to false:

```javascript
pbjs.que.push(function () {
  pbjs.setBidderConfig({
    bidders: ['pubmatic'],
    config: {
      gzipEnabled: false
    }
  });
});
```

<!-- workaround bug where code blocks at end of a file are incorrectly formatted-->
