---
layout: bidder
title: Tremor 
description: Tremor Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
pbjs: true
biddercode: tremor
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description | Example     | Type |
|---------------------|----------|-------------|-------------| --- |
| `adCode` | required | The Ad Code from Tremor. | `'ssp-!demo!-lufip'` | String |
|`supplyCode` | required | The Supply Code from Tremor. | `'ssp-%21demo%21-rm6rh'` | String |
|`playerWidth` | optional |The width of the video player. Full-screen video fills the width of the device, that is, if the video can play in full screen mode, the player width is the screen width. | `600` | Integer |
|`playerHeight` | optional | The height of the video player. Full-screen video fills the height of the device, that is, if the video can play in full screen mode, the player height is the screen height. | `400` | Integer |
|`mediaId` | optional | A unique (not random) value that identifies the content video aligned with the ad opportunity. Typically provided by the video player CMS. | `12345` | Integer |
|`mediaUrl` | optional | The URL to the content video source. | `'http://www.mycms.com/myhostedvideo.mp4'` | String |
|`mediaTitle` | optional | The title of the content video aligned with the ad opportunity. | `'Description of the content video'` | String |
|`contentLength` | optional | The length of the content video in seconds. | `120` | Integer |
|`srcPageUrl` | optional | The url of the page where the video ad will be displayed. | `'http://www.mysite.com/my-content-page/'` | String |
|`floor` | optional | This is a formatted string of values. The format is a comma separated list of "currency pairs". Each pair consists of a currency code and the floor for that currency, separated by a colon. | `'USD:5.00,AUD:7.25'` | String |
|`efloor` | optional | Same as floor, except the entire string is encrypted using HMAC encryption and the encryption keys set on the supply's seat from the SSP UI. | `'IFHR00cxR5ul_t20sMQ0OsvMVP7fOS-mnVsxu78%3d'` | String |
|`custom` | optional | Any custom value that will be later be available for reporting. | `'myCustomValue'` | String |
|`categories` | optional | Validated against RTB table 6.1 (Send comma delimited list if more than one category applies. | `'IAB20,IAB20-1'` | 
|`keywords` | optional | Comma separated list of keywords describing the supply. | `'funny,television'` | String |
|`srcRelationship` | optional | Describes the relationship between the content owner and the requestor of the ad opportunity. 1 for "direct", 0 for "indirect" | `1` | Integer |
|`blockDomains` | optional | A comma separated list of advertiser domains that should be added to the existing list of blocked advertiser domains that is set in the SSP console. | `'blockthis.com, blockthat.com'` | String |
|`skip` | optional | Is the video skippable? True or false. 1/T/Y is true and 0/F/N/null is false. | `'1'` | Character |
|`skipmin` | optional | Shortest video ad (in seconds) that can be skipped. If provided and "skip" is not, then "skip" is automatically set to true. | `30` | Integer |
|`skipafter` | optional | Number of seconds after which the video can be skipped. If provided and "skip" is not, then "skip" is automatically set to true. | `15` | Integer |
|`delivery` | optional | Comma delimited listed of Integers representing allowed delivery methods. See below as well as RTB 2.5 specification for valid values. | `'1,3'` | String |
|`placement` | optional | Integer value of placement type. See below as well as RTB 2.5 specification for valid values. | `1` | Integer |
|`videoMinBitrate` | optional | Minimum bitrate in kbps | `400` |Integer |
|`videoMaxBitrate` | optional | Maximum bitrate in kbps | `800` |Integer |
|`minDur` | optional | Minimum duration for an ad in seconds | `15` |Integer |
|`maxDur` | optional | Maximum duration for an ad in seconds | `60` |Integer |

  
The following values are defined in the [ORTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf).

<a name="tremor-video"></a>

### delivery

+ `1` : In-Stream: Played before, during or after the streaming video content that the consumer has requested (e.g., Pre-roll, Mid-roll, Post-roll).
+ `2` : In-Banner: Exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
+ `3` : In-Article: Loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
+ `4` : In-Feed: Found in content, social, or product feeds.
+ `5` : Interstitial/Slider/Floating: Covers the entire or a portion of screen area, but is always on screen while displayed (i.e. cannot be scrolled out of view). Note that a full-screen interstitial (e.g., in mobile) can be distinguished from a floating/slider unit by the imp.instl field.

### placement

+ `1` : Streaming
+ `2` : Progressive
+ `3` : Download
