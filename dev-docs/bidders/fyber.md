---
layout: bidder
title: Fyber
description: Prebid Fyber Bidder Adaptor
hide: true
biddercode: fyber
media_types: banner
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                                                          | Example            | Type     |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------|
| `appId`        | required | The app. ID provided by Inneractive                                                                                                                                  | `'Company_App_OS'` | `string` |
| `adSpotType`   | required | The ad spot type (`'BANNER'`/`RECTANGLE`)                                                                                                                            | `'BANNER'`         | `string` |
| `customParams` | optional | Allows passing custom parameters in the bid request. See more details at: https://confluence.inner-active.com/display/DevWiki/IA+Adapter+AdUnit+Bidder+Configuration |                    | `object` |
