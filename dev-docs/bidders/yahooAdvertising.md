---
layout: bidder
title: Yahoo Advertising
description: Yahoo Advertising Bid Adapter
pbs: true
pbjs: true
media_types: banner, video
filename: yahooAdsBidAdapter
biddercode: yahooAds
prebid_member: true
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
coppa_supported: true
floors_supported: true
fpd_supported: false
gvl_id: 25
userIds: All
sidebarType: 1
---

### Important Notice (JS vs PBS)

There are differences between our Prebid.js & Prebid-Server Yahoo Advertising adapters.
The Prebid-server adapter currently does not support:

1. Integration via the `pubId` method.

### Prebid.js Mandatory Bid Params

The Prebid.js Yahoo Advertising bid adapter supports 2 alternate integration types:

1. **dcn & pos** (Site/App & Position explicit targeting) - For legacy "aol", "oneMobile" adapter partners/publishers.
2. **pubId** (Publisher ID) - For new partners/publishers joining Yahoo Advertising and legacy "oneVideo" partners/publishers migrating to Yahoo Advertising.

### Prebid-Server Mandatory Bid Params

Prebid-server Yahoo Advertising bid adapter supports one integration method:

* **dcn & pos** (Site/App & Position explicit targeting) - For legacy "aol", "oneMobile" adapter partners/publishers.

#### DCN & POS Integration Parameters (JS & PBS)

For legacy "aol", "oneMobile" adapter partners/publishers.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| dcn | Required | Site ID provided by Yahoo Advertising | 'site1' | string |
| pos | Required | Placement ID provided by Yahoo Advertising | 'placement1' | string |

#### PubId Integration Parameters (JS Only)

For new partners/publishers joining Yahoo Advertising and legacy "oneVideo" partners/publishers migrating to Yahoo Advertising.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| pubId | Required | Your Publisher External ID provided by Yahoo Advertising | 'DemoPublisher' | string |
| siteId | Optional | Ability to target a specific Site using an External ID provided by Yahoo Advertising | '1234567' | string |
| placementId | Optional | Ability to target a specific Placement using an External ID provided by Yahoo Advertising | 'header' | string |

### Prebid.js Adapter Supported Features

For further setup details & examples please see <https://github.com/prebid/Prebid.js/blob/master/modules/yahooAdsBidAdapter.md>

* Media Types: Banner & Video
* Outstream renderer
* Multi-format adUnits
* Schain module
* Price floors module
* Advertiser domains
* End-2-End self-served testing mode
* Outstream renderer/Player
* User ID Modules - ConnectId and others
* First Party Data (ortb2 & ortb2Imp)
* Custom TTL (time to live)