---
layout: bidder
title: Displayio
description: Prebid Displayio Bidder Adapter
biddercode: displayio
media_types: banner, video
gdpr_supported: true
usp_supported: true
safeframes_ok: true
pbjs: true
pbs: false
prebid_member: false
gvl_id: none
---

### Note:

Before configuring the display.io adapter you must reach out your account manager from display.io team  (or send a request to contact@display.io) for approval and setup steps.

### Bid Params

{: .table .table-bordered .table-striped }

| Name  | Scope | Type | Description                            | Example                                                      |
|----------------| ----- | ---- |----------------------------------------|--------------------------------------------------------------|
| `siteId`       | required | Number | SiteId and PlacementID are your inventory IDs on the display.io platform (please ask your Account Manager for your site and placement IDs). | 7753                                                         |
| `placementId`  | required | Number | SiteId and PlacementID are your inventory IDs on the display.io platform (please ask your Account Manager for your site and placement IDs).                                       | 5375                                                         |
| `adsSrvDomain` | required | String |                                        | "appsrv.display.io"                                          |
| `cdnDomain`    | required | String |                                        | "cdn.display.io"                                             |
| `renderURL`    | optional | String |                                        | "https://cdn.display.io/webis/webis-prebid.min.js"                               |
| `pageCategory` | optional | String | Comma-separated list of IAB content categories that describe the current page or view of the site, list of available values. | "pageCategory1, pageCategory2"                               |
| `keywords`     | optional | String | Comma-separated list of keywords describing the content. | "keyword1, keyword2, keyword3"                               |
| `custom`       | optional | Object | User-defined targeting key-value pairs. custom applies to a specific unit. | `{headerTextColor: "red", fixedHeaderSelector: '.site-header'}` |
| `custom.headerText`| optional | String | Ad container header text. By default, text is "Scroll to continue with content". Limited to 50 characters. | "Our awesome advertisement"                                  |
| `custom.headerTextColor`| optional | String | Ad container header text color, "white" by default | "#2196f3"                                                    |
| `custom.headerBackgroundColor`| optional | String | Ad container header background color, "black" by default | "#fff"                                                       |
| `custom.adContainerBackgroundColor`| optional | String | Ad container body background color, "transparent" by default | "#000"                                                       |
| `custom.fixedHeaderSelector`| optional | String | In case your webpage has a fixed header – the header Id attribute or header class attribute should be defined as a value for parameter fixedHeaderSelector. | ".site-header"                                               |
