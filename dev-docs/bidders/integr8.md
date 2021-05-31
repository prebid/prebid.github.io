---
layout: bidder
title: Integr8
description: Prebid Integr8 Bidder Adapter
pbjs: true
biddercode: integr8
media_types: banner, video
---


### Bid Params

| Name          | Scope    | Example            | Type      |
|---------------|----------|--------------------|-----------|
| `propertyId`  | required | `"12345"`          | `string`  |
| `placementId` | required | `"54321"`          | `string`  |
| `data`        | optional | `{catalogs: [{ catalogId: "699229", items: ["193", "4", "1"] }], inventory: { category: ["tech"], query: ["iphone 12"] }}` | `object` |