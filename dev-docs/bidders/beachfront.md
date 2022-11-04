---
layout: bidder
title: Beachfront
description: Prebid Beachfront Bidder Adapter
biddercode: beachfront
media_types: video
floors_supported: true
fpd_supported: true
gdpr_supported: true
usp_supported: true
userIds: unifiedId, identityLink, uid2, hadronId
schain_supported: true
prebid_member: true
pbjs: true
pbs: true
pbs_app_supported: true
gvl_id: 335
---

### Registration

To use the beachfront bidder you will need an appId (Exchange Id) from an exchange
account on [platform.beachfront.io](https://platform.beachfront.io).

For further information, please contact adops@beachfront.com.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------------|----------|---------------------------------------------------------------------------------------------|------------------------------------------|----------|
| `appId` | required | Beachfront Exchange ID | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` | `string` |
| `bidfloor` | required | Bid floor. The floor price module will take priority over this value. | `0.01` | `float` |
| `video` | optional | Object with video parameters. See the [video section below](#beachfront-video) for details. | | `object` |
| `banner` | optional | Object with banner parameters. See the [banner section below](#beachfront-banner) for details. | | `object` |
| `player` | optional | Object with outstream player parameters. See the [player section below](#beachfront-player) for details. | | `object` |

<a name="beachfront-video"></a>

#### video params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------------------|----------|------------------------------------------------|-------------------------------------------|-----------------|
| `appId` | optional | Beachfront Exchange ID for video bids. | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` | `string` |
| `bidfloor` | optional | Bid floor for video bids. | `0.01` | `float` |
| `tagid` | optional | Tag ID | `'placement-name'` | `string` |
| `responseType` | optional | Video response type.<br/>`both`: VAST URL and VAST XML<br/>`nurl`: VAST URL only<br/>`adm`: VAST XML only | `'both'` | `string` |
| `mimes` | optional | Array of strings listing supported MIME types. | `["video/mp4", "application/javascript"]` | `Array<string>` |
| `playbackmethod` | optional | Playback method supported by the publisher.<br/>`1`: Auto-play sound on<br/>`2`: Auto-play sound off<br/>`3`: Click-to-play<br/>`4`: Mouse-over | `1` | `integer` |
| `maxduration` | optional | Maximum video ad duration in seconds. | `30` | `integer` |
| `placement` | optional | Placement type for the impression.<br/>`1`: In-Stream<br/>`2`: In-Banner<br/>`3`: In-Article<br/>`4`: In-Feed<br/>`5`: Interstitial/Slider/Floating | `1` | `integer` |
| `skip` | optional | Indicates if the player will allow the video to be skipped. | `1` | `integer` |
| `skipmin` | optional | Videos of total duration greater than this number of seconds can be skippable. | `15` | `integer` |
| `skipafter` | optional | Number of seconds a video must play before skipping is enabled. | `5` | `integer` |

<a name="beachfront-banner"></a>

#### banner params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------------|----------|-----------------------------------------|------------------------------------------|----------|
| `appId` | optional | Beachfront Exchange ID for banner bids. | `'3b16770b-17af-4d22-daff-9606bdf2c9c3'` | `string` |
| `bidfloor` | optional | Bid floor for banner bids. | `0.01` | `float` |
| `tagid` | optional | Tag ID | `'placement-name'` | `string` |

<a name="beachfront-player"></a>

#### player params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------------|----------|-----------------------------------------|------------------------------------------|----------|
| `progressColor` | optional | The color of the progress bar formatted as a CSS value. | `'#50A8FA'` | `string` |
| `adPosterColor` | optional | The color of the ad poster formatted as a CSS value. | `'#FFFFFF'` | `string` |
| `expandInView` | optional | Defines whether to expand the player when the ad slot is in view. Defaults to `false`. | `false` | `boolean` |
| `collapseOnComplete` | optional | Defines whether to collapse the player when ad playback has completed. Defaults to `true`. | `true` | `boolean` |

### First Party Data

Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:

- ortb2.site.\*
- ortb2.app.\*
- ortb2.user.\*

Example first party data that's available to all bidders and all adunits:

```
pbjs.setConfig({
    ortb2: {
        site: {
            keywords: "kw1,kw2",
            content: {
                title: "title1",
                series: "series1"
            }
        },
        user: {
            keywords: "a,b",
            gender: "M",
            yob: 1984
        }
    }
});
```

### Prebid Server

As seen in the JSON response from \{your PBS server\}\/bidder\/params [(example)](https://prebid.adnxs.com/pbs/v1/bidders/params), the beachfront
bidder can take either an "appId" parameter, or an "appIds" parameter. If the request is for one media type, the appId parameter should be used
with the value of the Exchange Id on the Beachfront platform.

The appIds parameter is for requesting a mix of banner and video. It has two parameters, "banner", and "video" for the appIds of two appropriately
configured exchanges on the platform. The appIds parameter can be sent with just one of its two parameters and it will behave like the appId parameter.

If the request includes an appId configured for a video response, the videoResponseType parameter can be defined as "nurl", "adm" or "both".
These will apply to all video returned. If it is not defined, the response type will be a nurl. The definitions for "nurl" vs. "adm" are
here: (https://github.com/mxmCherry/openrtb/blob/master/openrtb2/bid.go).
