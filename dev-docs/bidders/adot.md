---
layout: bidder
title: Adot
description: Prebid Adot Bidder Adapter
biddercode: adot
pbjs: true
media_types: banner, video, native
gdpr_supported: true
---

### Table of Contents

- [Bid Params](#bid-params)
- [Video Object](#video-object)

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | optional | The placement ID from Adot.                                                      | `'adot_placement_224521'`                                            | `string`         |
| `position`            | optional | Specify the position of the ad as a relative measure of visibility or prominence. Allowed values: Unknown: `0` (default); Above the fold: `1` ; Below the fold: `3`.                                                                                                                   | `0`                                             | `integer-`         |
| `video`             | optional | Object containing video targeting parameters.  See [Video Object](#video-object) for details.                                                                        | `video: { mimes: ['video/mp4'] }` | `object`         |

#### Video Object

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `mimes`           | Array of strings listing the content MIME types supported, e.g., `['video/mp4']`.                                                                                                                                        | `Array<string>`  |
| `minduration`     | Integer that defines the minimum video ad duration in seconds.                                                                                                                                                                               | `integer`        |
| `maxduration`     | Integer that defines the maximum video ad duration in seconds.                                                                                                                                                                               | `integer`        |
| `protocols`      | Array of supported video protocols, e.g., `[2, 3]` | `Array<integer>`        |
| `container`      | Selector used for finding the element in which the video player will be displayed, e.g., `#div-1`. The `ad unit code` will be used if no `container` is provided.  | `string`        |
