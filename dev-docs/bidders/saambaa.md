---
layout: bidder
title: Saambaa
description: Prebid Saambaa Bidder Adapter
pbjs: true
biddercode: saambaa
sidebarType: 1
---

### Note:
For more information about Saambaa, please contact matt.voigt@saambaa.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                                  | Type              |
|------------------|----------|------------------|------------------------------------------|-------------------|
| `placement  `    | required |                  | `'263'`                                  | `string`          |
| `pubid`          | required |                  | `'0cf8d6d643e13d86a5b6374148a4afac'`     | `string`          |
| `size`           | optional |                  | `'320x50'`                              | `string`          |
| `mimes`          | optional |  video only      | `['video/mp4', 'application/javascript']`| `array of strings`|
| `playbackmethod` | optional |  video only      | `[2,6]`                                  | `array of numbers`|
| `maxduration`    | optional |  video only      | `30`                                     | `number`          |
| `skip`           | optional |  video only      | `0 or 1`                                 | `number`          |
