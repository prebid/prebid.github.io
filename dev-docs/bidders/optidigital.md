---
layout: bidder
title: Optidigital
description: Prebid Optidigital Bidder Adapter
biddercode: optidigital
pbjs: true
floors_supported: true
tcf2_supported: true
usp_supported: true
schain_supported: true
media_types: banner
gvl_id: 915
sidebarType: 1
---

### Note:

The Optidigital Bidding adapter requires setup before beginning. Please contact us at prebid@optidigital.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                    | Example                  | Type      |
|----------------|----------|------------------------------------------------|--------------------------|-----------|
| `publisherId`  | required | Unique id of the publisher                     | `'p1234'`                | `string`  |
| `placementId`  | required | Identifier for specific ad placement or ad tag | `'Billboard_Top'`        | `string`  |
| `divId`        | optional | Id of the div containing the ad slot           | `'Billboard_Top_3c5425'` | `string`  |
| `pageTemplate` | optional | Page template name of the current page         | `'home'`                 | `string`  |