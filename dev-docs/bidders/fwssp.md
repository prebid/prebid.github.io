---
layout: bidder
title: FWSSP
description: Freewheel Bidder Adaptor
pbjs: true
pbs: true
biddercode: fwssp
gvl_id: 285
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
media_types: video
ortb_blocking_supported: partial
---

### Bid Params

The following bid params are for use with the Prebid Server bid adapter:

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------------------|--------|----------|
| `custom_site_section_id` | required | custom Site Section tag or numeric Site Section ID | "ss_12345" | `string` |
| `network_id` | required | Network ID | "12345" | `string` |
| `profile_id` | required | The value should contain a profile name. and NOT a numeric profile ID. This can either include the network ID prefix or with the profile name alone | "prof_12345" | `string` |

The following bid params are for use with the Prebid.js bid adapter:

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------------------|--------|----------|
| `serverUrl` | required | Server Url | "`https://81cec.v.fwmrm.net/ad/g/1`"   | `string` |
| `networkId` | required | Network ID | "96749" | `string` |
| `profile` | required | Profile Name - The value should contain a profile name. and NOT a numeric profile ID. This can either include the network ID prefix or with the profile name alone | "96749:global-js"   | `string`   |
| `siteSectionId` | required | Custom Site Section tag or numeric Site Section ID | "ss_12345" | `string` |
| `videoAssetId` | required | Custom content Video Asset ID | "pause_ad_video" | `string` |
| `flags` | optional | Optional flags to include in the ad request | '+play-uapl' | `string` |
| `mode` | optional | Request mode. Valid values are: “on-demand", "live". Default: "on-demand" | "live" | `string` |
| `adRequestKeyValues` | optional | An object of ad request key-value pairs. | { \_fw_player_width: '1920', \_fw_player_height: '1080' } | `object` |
| `gdpr_consented_providers` | optional | List of Consented Providers. A comma-separated list of ids. | "216,229,80,359,479" | `string` |
| `tpos` | optional | Slot time position in seconds. Default: 0 | 10 | `number` |
| `slid` | optional | Slot custom ID. Any string with valid letters/digits/symbols. Default: "Preroll_1" | "CustomPreroll" | `string` |
| `slau` | optional | Specify custom ad unit names for this slot. Multiple ad unit names can be put into this parameter, separated by "\|". Ad unit group names are also supported but you can only specify one ad unit group; multiple ad unit groups or mixed ad unit group and ad unit names are not supported. Default: "preroll" | "pre1\|pre2" | `string` |
| `minD` | optional | The minimum duration of a slot, in seconds. | 30 | `number` |
| `maxD` | optional | The maximum duration of a slot, in seconds. | 30 | `number` |
| `listeners` | optional | An object of AdManager event listeners | { onSlotStarted: this.onSlotStarted, adEvent: this.onAdEvent, onSlotEnded: this.onSlotEnded } | `object` |
| `isMuted` | optional | Constrols if ad playback should start with volume muted. Default: true | false | `boolean` |
| `showMuteButton` | optional | Controls if a mute button should be shown during ad playback.  Default: false | true | `boolean` |
| `playerParams` | optional | An object of AdManager player parameter values | { "renderer.video.startDetectTimeout": 5000 } | `object` |
| `sdkVersion` | optional | The AdManager sdk version to use for playback. This is only valid for "outstream" formats. Default: "7.10.0" | "7.11.0" | `string` |
| `format` | optional | The format to use for displaying the ad. Default: outstream | "inbanner" | `string` |
| `env` | optional | The AdManager build to use for ad playback. Valid values: "prd", "stg". Default: "prd" | "stg" | `string` |
