---
layout: bidder
title: Adot
description: Prebid Adot Bidder Adapter
biddercode: adot
pbjs: true
media_types: banner, video, native
gdpr_supported: true
list_group: 0a
---

### Table of Contents

- [Bid Params](#adot-bid-params)
- [Video Object](#adot-video-object)

#### Adot Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope                             | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | optional                          | The placement ID from Adot.                                                      | `'adot_placement_224521'`                                            | `string`         |
| `position`          | optional                          | Specify the position of the ad as a relative measure of visibility or prominence. Allowed values: Unknown: `0` (default); Above the fold: `1` ; Below the fold: `3`.                                                                                                                   | `0`                                             | `integer-`         |
| `video`             | required if the adUnit is a video | Object containing video targeting parameters. See [Video Object](#adot-video-object) for details.                                                                        | `video: { mimes: ['video/mp4'] }` | `object`         |

#### Adot Video Object

{: .table .table-bordered .table-striped }
| Name              | Scope                                     | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `mimes`           | required                                  | Array of strings listing the content MIME types supported, e.g., `['video/mp4']`.                                                                                                                                                            | `Array<string>`  |
| `minduration`     | optional                                  | Integer that defines the minimum video ad duration in seconds.                                                                                                                                                                               | `integer`        |
| `maxduration`     | optional                                  | Integer that defines the maximum video ad duration in seconds.                                                                                                                                                                               | `integer`        |
| `protocols`       | required                                  | Array of supported video protocols, e.g., `[2, 3]`                                                                                                                                                                                           | `Array<integer>` |
| `container`       | optional                                  | Selector used for finding the element in which the video player will be displayed, e.g., `#div-1`. The `ad unit code` will be used if no `container` is provided.                                                                            | `string`         |
| `instreamContext` | required if `video.context` is `instream` | String used to define the type of instream video. Allowed values: Pre-roll: `pre-roll`; Mid-roll: `mid-roll` ; Post-roll: `post-roll`.                                                                                                       | `string`         |
