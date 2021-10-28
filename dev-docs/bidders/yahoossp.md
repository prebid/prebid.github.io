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

### Important Notice (JS vs PBS)
There are differences between our Prebid.js & Prebid-Server Yahoo SSP adapters. The Prebid-server adapter currently does not support Video inventory or integration via the `pubId` method.


### Prebid.js Bid Params
The 'yahoossp' bid adapter supports 2 integration types:
1. **dcn & pos** (Site/App & Position explicit targeting) - For legacy "aol", "oneMobile" adapter partners/publishers.
2. **pubId** (Publisher ID) - For New partners/publishers joining Yahoo SSP and legacy "oneVideo" partners/publishers migrating to the Yahoo SSP.


### Prebid-Server Bid Params
The 'yahoossp' bid adapter supports 2 integration types:
* **dcn & pos** (Site/App & Position explicit targeting) - For legacy "aol", "oneMobile" adapter partners/publishers.


#### DCN & POS Integration Parameters (JS & PBS)
For legacy "aol", "oneMobile" adapter partners/publishers.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| dcn | Required | Site ID provided by Yahoo SSP | 'site1' | string |
| pos | Required | Placement ID provided by Yahoo SSP | 'placement1' | string |

#### PubId Integration Parameters (JS Only)
For New partners/publishers joining Yahoo SSP
floors_supported: true and legacy "oneVideo" partners/publishers migrating to the Yahoo SSP.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| pubId | Required | Your Publisher External ID provided by Yahoo SSP | 'DemoPublisher' | string |
| siteId | Optional | Ability to target a specific Site using an External ID provided by Yahoo SSP | '1234567' | string |
| placementId | Optional | Ability to target a specific Placement using an External ID provided by Yahoo SSP | 'header' | string |
