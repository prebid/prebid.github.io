---
layout: bidder
title: Yahoo SSP
description: Yahoo SSP Bid Adapter
pbs: true
pbjs: true
media_types: banner, video
biddercode: yahoossp
prebid_member: true
gdpr_supported: true
usp_supported: true
schain_supported: true
coppa_supported: true
floors_supported: true
gvl_id: 25
userIds: All
---

### Bid Params
The 'yahoossp' bid adapter supports 2 types of integration:
1. **dcn & pos** DEFAULT (Site/App & Position targeting) - For Display partners/publishers.
2. **pubId** (Publisher ID) - For legacy "oneVideo" AND New partners/publishers.
**Important:** pubId integration (option 2) is only possible when your Seller account is setup for "Inventory Mapping".

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| dcn | required (for dcn & pos integration) | Site ID provided by Yahoo SSP | 'site1' | string |
| pos | required (for dcn & pos integration)| Placement ID | 'placement1' | string |
| pubId | required (for pubId integration)| Publisher External ID | 'PublisherID' | string |
