---
layout: bidder
title: My6Sense
description: My6Sense Prebid Bidder Adapter
media_type: native
biddercode: my6sense
pbjs: true
gdpr_supported: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                            | Example                     | Type |
| :---          | :----    | :----------------------------------------------------  | :-------------------------  | --- |
| key           | required | Widget key, provided by the network.                   | `'dxSUw7n8ec74Nqxl7mxKk3'`    | String |
| pageUrl       |  optional        | Used to pass the served page URL.                      |  `'url'`       | String |
| zone          | optional         | Used to pass optional data to the platform.            | `'zone'`                    | String |
| dataView      | optional         | 3rd party tracker URL in order to track widget view.   | `'url'`                          | String |
| organicClicks | optional         | 3rd party click tracker URL to track organic clicks.   | `'url'`                          | String |
| paidClicks    | optional         | 3rd party click tracker URL to track paid clicks.      | `'url'`                          | String |
