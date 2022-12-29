---
layout: bidder
title: Between
description: Prebid Between Bidder Adapter
pbjs: true
pbs: true
biddercode: between
schain_supported: true
gdpr_supported: true
pbs_app_supported: true
userIds: all
gvl_id: 724
usp_supported: true
safeframes_ok: false
sidebarType: 1
---

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `s` | required |  Section ID from Between SSP control panel | 999999 | `integer` |
| `cur` | optional | 3-letter ISO 4217 code defining the currency of the bid (currently support USD and EUR), default is USD | `'USD'` | `string` |

### Prebid-Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `host` | required |  Between SSP host url prefix. Defines data center where requests will be sent. Choose the closest one to the prebid-server you are using. Allowed values: `lbs-eu1.ads`, `lbs-ru1.ads`, `lbs-asia1.ads`, `lbs-us-east1.ads` | `'lbs-eu1.ads'` | `string` |
| `publisher_id` | required |  Publisher ID from Between SSP control panel | `'123'` | `string` |

