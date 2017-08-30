---
layout: bidder
title: Tremor 
description: Prebid Tremor Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: tremor
biddercode_longer_than_12: false
---

This is the `tremor` adapter


### bid params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                               | Example                                               |
|---------------------+----------+---------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------------|
| `adCode`            | required | The Ad Code from Tremor                                                                                                   | `"ssp-!demo!-lufip"`                                  |
| `supplyCode`        | required | The Supply Code from Tremor                                                                                               | `"ssp-%21demo%21-rm6rh"`                              |
| `mediaId`           | optional | A unique (not random) value that identifies the content video aligned with the ad opportunity. Typically provided by the video player CMS.                                                                                                                         |                                                       |
| `mediaUrl`          | optional |                                                                                                                           |                                                       |
| `mediaTitle`        | optional |                                                                                                                           | `video: { playback_method: ['auto_play_sound_off'] }` |
| `contentLength`     | optional |                                                                                                                           | `"abc123"`                                            |
| `floor`             | optional |                                                                                                                           | `"12345"`                                             |
| `efloor`            | optional |                                                                                                                           |                                                       |
| `custom`            | optional |                                                                                                                           |                                                       |
| `categories`        | optional |                                                                                                                           |                                                       |
| `keywords`          | optional | A set of key-value pairs applied to all ad slots on the page.  Mapped to query string segments for buy-side targeting.    | `keywords: { genre: ['rock', 'pop'] }`                |
| `blockDomains`      | optional |                                                                                                                           |                                                       |
| `c2`                | optional |                                                                                                                           |                                                       |
| `c3`                | optional |                                                                                                                           |                                                       |
| `c4`                | optional |                                                                                                                           |                                                       |
| `skip`              | optional |                                                                                                                           |                                                       |
| `skipmin`           | optional |                                                                                                                           |                                                       |
| `skipafter`         | optional |                                                                                                                           |                                                       |
| `delivery`          | optional |                                                                                                                           |                                                       |
| `placement`         | optional |                                                                                                                           |                                                       |
| `videoMinBitrate`   | optional |                                                                                                                           |                                                       |
| `videoMaxBitrate`   | optional |                                                                                                                           |                                                       |

  
(Sizes set in `adUnit` object will also apply to the Tremor bid requests.)

<a name="tremor-video"></a>

#### video

The following video parameters are supported.  For more information, see the video parameters in the [OpenRTB specification](http://www.iab.com/wp-content/uploads/2016/01/OpenRTB-API-Specification-Version-2-4-DRAFT.pdf).