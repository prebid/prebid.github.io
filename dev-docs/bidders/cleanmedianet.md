---
layout: bidder
title: Clean Media Net
description: Clean Media Bidder Adapter
biddercode: cleanmedianet
pbjs: true
media_types: banner, video
tcfeu_supported: false
usp_supported: true
coppa_supported: false
schain_supported: true
floors_supported: true
userIds:
prebid_member: false
safeframes_ok: true
deals_supported: false
pbs_app_supported: false
fpd_supported: false
ortb_blocking_supported: false
gvl_id:
multiformat_supported: will-bid-on-any
---

### Disclosure

Note: This bidder appears to only consider gdprApplies if a consent string is available. This may result in some incorrect GDPR processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See <https://github.com/prebid/Prebid.js/issues/7775>

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------------+----------+--------------------------------------------------------+-------------------------+---------|
| `supplyPartnerId` | required | The supply account's ID in your Clean Media dashboard. | `"1253"`, `"1254"`, etc | string |
