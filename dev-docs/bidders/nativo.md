---
layout: bidder
title: Nativo
description: Prebid Nativo Bidder Adapter
pbjs: true
pbs: true
media_types: banner, native, video
multiformat_supported: will-bid-on-one
floors_supported: true
gvl_id: 263
tcfeu_supported: true
usp_supported: true
userIds: all 
biddercode: nativo
sidebarType: 1
privacy_sandbox: topics
---

### Note

The Nativo Bidder adapter requires setup before beginning. Please contact us at <prebiddev@nativo.com> beforehand.

### Bid Params

#### Prebid Server

Prebid Server primarily relies on the OpenRTB specification for its field definitions, along with widely recognized extensions that have become semi-standard within the industry.

{: .table .table-bordered .table-striped }
| Name                         | Scope                               | Description                                                                                                                | Example                                             | Type      |
|------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|-----------|
| `imp.tagid`                  | required - preferred                | Represents the Ad Slot Tag ID, which is the primary identifier linked to a specific placement ID within the Nativo platform.  Read more about [tagid in the oRTB 2.6 docs](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md#324---object-imp-) |  `placement_tagid_example`                          | `string`  |
| `imp.ext.nativo.placementid` | required if no tagID                | Refers to the unique Placement ID assigned by the Nativo platform.                                                         |  `12345678`                                         | `integer` |
| `imp.ext.gpid`               | required if no other ID is provided | Represents the Ad Slot GP ID. It is another layer of identification tied to a placement ID within the Nativo platform. Read more about [gpid in the prebid docs](/features/pbAdSlot.html#the-gpid)       |  `/22888152279/publication/placement/gpid_example`  | `string`  |

#### Prebid JS

{: .table .table-bordered .table-striped }
 | Name          | Scope    | Description                                                                     | Example      | Type      |
 |---------------|----------|---------------------------------------------------------------------------------|--------------|-----------|
 | `placementId` | required | Publication placement ID value from the Nativo Platform                         |  `13144370`  | `integer` |
 | `url`         | optional | Publication url value associated with placement ID value in the Nativo Platform |  `https://test-sites.internal.nativo.net/testing/prebid_adpater.html`  | `string` |
 