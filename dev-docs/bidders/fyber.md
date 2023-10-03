---
layout: bidder
title: Fyber
description: Prebid Fyber Bidder Adaptor
pbjs: true
biddercode: fyber
media_types: banner
sidebarType: 1
---

{: .alert.alert-warning :}
Fyber is probably a defunct bidder, as the domain previously registered, inner-active.com, is no-longer-active.

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                                                          | Example            | Type     |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------|
| `appId`        | required | The app. ID provided by Inneractive                                                                                                                                  | `'Company_App_OS'` | `string` |
| `adSpotType`   | required | The ad spot type (`'BANNER'`/`RECTANGLE`)                                                                                                                            | `'BANNER'`         | `string` |
| `customParams` | optional | Allows passing custom parameters in the bid request. |                    | `object` |
