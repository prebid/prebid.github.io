---
layout: bidder
title: MediaForce
description: MediaForce Prebid Bidder Adapter
media_types: banner, native 
biddercode: mediaforce
pbjs: true
gdpr_supported: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                            | Example                     | Type |
| :---          | :----    | :----------------------------------------------------  | :-------------------------  | --- |
| bidfloor | optional | The floor price, or minimum amount, a publisher will accept for an impression, given in CPM in USD. | 1.00 | Float |
| placement_id | required | Identifier for specific ad placement | `placement123`  | `String` |
| publisher_id | required | The publisher ID assigned to the publisher by MediaForce | `pub_348`  | `String` |
