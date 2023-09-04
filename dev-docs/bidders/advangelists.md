---
layout: bidder
title: Advangelists
description: Prebid Advangelists Bidder Adapter
pbjs: true
pbs: true
biddercode: advangelists
sidebarType: 1
---

### Note

For more information about [Advangelists https://advangelists.com], please contact <lokesh@advangelists.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                                  | Type              |
|------------------|----------|------------------|------------------------------------------|-------------------|
| `placement`    | required |                  | `'263'`                                  | `string`          |
| `pubid`          | required |                  | `'0cf8d6d643e13d86a5b6374148a4afac'`     | `string`          |
| `mimes`          | optional |  video only      | `['video/mp4', 'application/javascript']`| `array of strings`|
| `playbackmethod` | optional |  video only      | `[2,6]`                                  | `array of numbers`|
| `maxduration`    | optional |  video only      | `30`                                     | `number`          |
| `skip`           | optional |  video only      | `0 or 1`                                 | `number`          |
