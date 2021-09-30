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
gvl_id: 25
userIds: All
---

### Bid Params
The 'yahoossp' bid adapter supports 2 integration types:
1. **dcn & pos** (Site/App & Position explicit targeting) - For legacy "aol", "oneMobile" adapter partners/publishers.
2. **pubId** (Publisher ID) - For New partners/publishers joining Yahoo SSP and legacy "oneVideo" partners/publishers migrating to the Yahoo SSP.


**Important:** pubId integration (option 2) is only possible when your Seller account is setup for "Inventory Mapping", Please contact your Account Manager to verify your setup.

#### DCN & POS Integration Parameters
For legacy "aol", "oneMobile" adapter partners/publishers.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| dcn | required | Site ID provided by Yahoo SSP | 'site1' | string |
| pos | required | Placement ID provided by Yahoo SSP | 'placement1' | string |

#### PubId Integration Parameters
For New partners/publishers joining Yahoo SSP
floors_supported: true and legacy "oneVideo" partners/publishers migrating to the Yahoo SSP.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| pubId | required | Your Publisher External ID provided by Yahoo SSP | 'DemoPublisher' | string |
| inventoryId | Optional | Ability to target a specific Site using an External ID provided by Yahoo SSP | '1234567' | string |
| placementId | Optional | Ability to target a specific Placement using an External ID provided by Yahoo SSP | 'header' | string |
