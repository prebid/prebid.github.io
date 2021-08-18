---
layout: bidder
title: Unruly
description: Prebid Unruly Bidder Adaptor
biddercode: unruly
gdpr_supported: true
usp_supported: true
coppa_supported: false
schain_supported: true
getFloor: true
media_types: banner, video
userIds: all
prebid_member: false
safeframes_ok: check with bidder
bidder_supports_deals: check with bidder
pbjs: true
pbs: true
pbs_app_supported: true
gvl_id: 162
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name               | Scope          | Description                                                                                                                  | Example                                          | Type      |
|--------------------|----------------|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------|
| `siteId`           | required       | The site ID from Unruly. This will be provided to you by your Unruly account manager.                                        | `123456`                                         | `integer` |
| `featureOverrides` | optional       | This param is a generic object for configuring Unruly outstream demand. To run UNmissable, set ‘canRunUnmissable’ to true.   | `"featureOverrides": {"canRunUnmissable": true}` | `object`  |
