---
layout: bidder
title: Integr8
description: Prebid Integr8 Bidder Adapter
pbjs: true
biddercode: integr8
media_types: banner, video
sidebarType: 1
---


### Bid Params

| Name          | Scope    |Description                                                             | Example            | Type      |
|---------------|----------|------------------------------------------------------------------------|--------------------|-----------|
| `propertyId`  | required |Property id                                                             | `"12345"`          | `string`  |
| `placementId` | required |Placement id                                                            | `"54321"`          | `string`  |
| `deliveryUrl` | optional |Custom endpoint url for the bid request                                 | `"https://central.sea.integr8.digital/bid"`     | `string`  |
| `data`        | optional |Catalog data (contents) and/or inventory data (custom key/value pairs)  | `{catalogs: [{ catalogId: "699229", items: ["193", "4", "1"] }], inventory: { category: ["tech"], query: ["iphone 12"] }}` | `object` |
