---
layout: bidder
title: Insticator
description: Prebid Insticator Bidder Adapter
biddercode: insticator
tcfeu_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video
multiformat_supported: will-bid-on-any
pbjs: true
gvl_id: 910
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description               | Example              | Type     |
|---------------|----------|---------------------------|----------------------|----------|
| `adUnitId`    | Required | The ad unit ID provided by Insticator | `'test'` | `string` |
| `yob`         | optional | Year of Birth             | `'1982'`             | `string` |
| `gender`      | optional | Gender                    | `'M'`                | `string` |
| `instl`       | optional | 1 = the ad is interstitial or full screen, 0 = not interstitial.    | `1`    | `number` |
| `pos`         | optional | ad position as per IAB standards       | `1`                | `number` |

### video parameters

{: .table .table-bordered .table-striped }
| Name                   | Scope       | Description                                                     | Example                       |
|------------------------|-------------|-----------------------------------------------------------------|-------------------------------|
| `video.mimes`          | required    | Video MIME types                                                | `['video/mp4','video/x-flv']` |
| `video.w`              | recommended | Width of the video player in device independent pixels (DIPS).  | `300`                         |
| `video.h`              | recommended | Height of the video player in device independent pixels (DIPS). | `250` |                       |
| `video.placement`      | recommended | Video placement type  | `2` |
