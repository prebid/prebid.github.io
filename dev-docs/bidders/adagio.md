---
layout: bidder
title: Adagio
description: Prebid Adagio Bidder Adaptor
hide: true
biddercode: adagio
media_types: banner
gdpr_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `siteId`      | required | Site ID from Adagio.                                                       | `0`                    | `string`        |
| `placementId` | required | Placement ID from Adagio. Refers to the placement of an ad unit in a page. | `4`                    | `string`        |
| `pagetypeId`  | required | Page type ID from Adagio.                                                  | `343`                  | `string`        |
| `categories`  | required | IAB categories of the page.                                                | `['IAB12', 'IAB12-2']` | `Array<string>` |
