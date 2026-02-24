---
layout: bidder
title: Blasto
description: Prebid Blasto Bidder Adaptor
biddercode: blasto
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
sidebarType: 1
floors_supported: true
prebid_member: false
fpd_supported: false
gvl_id: none
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
userIds: all
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <support@blasto.ai>. 
Blasto will only respond to the first impression.

### Bid Params for Prebid Server
Blasto supports diffrent regions for the prebid server. By default US East.
Please deploy the prebid config in each of your datacenters with the appropriate regional subdomain.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `sourceId` | required | Unique hash provided by blasto | `'6dllcEHSxYdSb6yLmCqE'` | `string` |
| `accountId` | required | Unique name provided by blasto | `'blasto-test'` | `string` |

### Bid Params for Prebid.js

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `sourceId` | required | Unique hash provided by blasto | `'6dllcEHSxYdSb6yLmCqE'` | `string` |
| `accountId` | required | Unique name provided by blasto | `'blasto-test'` | `string` |
| `host` | optional | Blasto server region. US East by default | `'us-e-node1'` | `string` |
