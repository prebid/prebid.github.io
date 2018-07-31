---
layout: bidder
title: Fyber
description: Prebid Fyber Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: fyber
biddercode_longer_than_12: false
prebid_1_0_supported : true
media_types: banner
---

### bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                                                          | Example            | Type     |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------|
| `appId`        | required | The app. ID provided by Inneractive                                                                                                                                  | `'Company_App_OS'` | `string` |
| `adSpotType`   | required | The ad spot type (`'BANNER'`/`RECTANGLE`)                                                                                                                            | `'BANNER'`         | `string` |
| `customParams` | optional | Allows passing custom parameters in the bid request. See more details at: https://confluence.inner-active.com/display/DevWiki/IA+Adapter+AdUnit+Bidder+Configuration |                    | `object` |
