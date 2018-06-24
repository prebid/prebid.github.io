---
layout: bidder
title: My6Sense
description: Prebid Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
media_type: native
biddercode: My6Sense
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                            | Example                     |
| :---          | :----    | :----------------------------------------------------  | :-------------------------  |
| key           | required | Widget key, provided by the network.                   | "dxSUw7n8ec74Nqxl7mxKk3"    |
| pageUrl       |          | Used to pass the served page URL.                      | "[PAGE_URL]"                |
| zone          |          | Used to pass optional data to the platform.            | "[ZONE]"                    |
| dataView      |          | 3rd party tracker URL in order to track widget view.   | ""                          |
| organicClicks |          | 3rd party click tracker URL to track organic clicks.   | ""                          |
| paidClicks    |          | 3rd party click tracker URL to track paid clicks.      | ""                          |
