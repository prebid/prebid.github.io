---
layout: bidder
title: Criteo
description: Prebid Criteo Bidder Adaptor
pbjs: true
biddercode: criteo
media_types: display, native, video
gdpr_supported: true
usp_supported: true
prebid_member: true
tcf2_supported: true
---
### Note
{: .alert.alert-warning :}
For Native Ads, in order to avoid further decoding issues of special characters, the assets need to be sent as placeholders. 
That means, `sendId: true` becomes mandatory for all fields receiving URLs, notably: `icon`, `image`, `clickUrl`, `privacyLink`, `privacyIcon`.

See [Sending Asset Placeholders]({{site.baseurl}}/dev-docs/show-native-ads.html#sending-asset-placeholders).

### Bid Params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type       |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|------------|
| `networkId`       | required | The network ID from Criteo.Please reach out your Criteo representative for more details.                             | `456456`                                      | `integer`  |
| `nativeCallback`  | optional | Callback to perform render in native integrations. Please reach out your Criteo representative for more details.     | `function(payload) { console.log(payload); }` | `function` |
| `integrationMode` | optional | Integration mode to use for ad render (none or 'AMP'). Please reach out your Criteo representative for more details. | `'AMP'`                                       | `string`   |

### Video Object

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                                                                                                                                                                                  | Example | Type      |
|-------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `minduration`     | optional | Minimum ad duration in seconds                                                                                                                                                                                                                                               | `5`     | `integer` |
| `startdelay`      | optional | Duration offset (in second) from the start of the content for showing the video ad before the start of the Video. Pre-roll: `0` (default); Mid-roll: `>0`; Default mid-roll: `-1`; Post-roll: `-2`;                                                                          | `5`     | `integer` |
| `playbackmethod`  | required | Defines how is initiated the video inventory. Page Load with Sound On: `1`; Page Load with Sound Off: `2`; Click with Sound On: `3`; Mouse-Over with Sound On: `4`; Entering Viewport with Sound On: `5`; Entering Viewport with Sound Off by Default: `6`;                  | `1`     | `integer` |
| `placement`       | required | Video placement type. In-Stream: `1`; In-Banner: `2`; In-Article: `3`: In-Feed: `4`; Interstitial: `5`;                                                                                                                                                                      | `1`     | `integer` |
| `skip`            | required | Ability from the video player for the user to skip the video. Not skippable: `0`; Skippable: `1`;                                                                                                                                                                            | `1`     | `integer` |

In addition, Criteo adapter relies on parameters specified in the mediaTypes.video definition of the video ad-units, namely:

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                                                                                                                                                                                  | Example         | Type             |
|-------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|------------------|
| `context`         | required | `outstream`, `instream` or `long-form`                                                                                                                                                                                                                                       | `instream`      | `string`         |
| `mimes`           | required | List of the content MIME types supported by the player                                                                                                                                                                                                                       | `["video/mp4"]` | `Array<string>`  |
| `playerSize`      | required | Width and height of the player                                                                                                                                                                                                                                               | `[640, 480]`    | `Array<integer>` |
| `protocols`       | required | Supported video bid response protocols. VAST 1.0: `1`; VAST 2.0: `2`; VAST 3.0: `3`; VAST 1.0 Wrapper: `4`; VAST 2.0 Wrapper: `5`; VAST 3.0 Wrapper: `6`;                                                                                                                    | `|5, 6]`        | `Array<integer>` |
| `maxduration`     | required | Maximum ad duration in seconds                                                                                                                                                                                                                                               | `20`            | `integer`        |
| `api`             | required | API frameworks supported. VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID-1: `3`; ORMMA: `4`; MRAID-2: `5`;                                                                                                                                                                            | `[1, 2]`        | `Array<integer>` |

#### Example of Video Ad-unit
```
var adUnits = [
{
    code: 'video1',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'instream',
            mimes: ["video/mp4"],
            maxduration: 30,
            api: [1, 2],
            playerSize: [640,480],
            protocols: [2, 3]
        }
    },
    bids: [{
        bidder: 'criteo',
        params: {
            zoneId: 1455580,
            video: {
                skip: 0,
                playbackmethod: 1,
                placement: 1,
            }
        }
    }]
}];
```
