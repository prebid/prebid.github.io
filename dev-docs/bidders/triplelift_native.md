---
layout: bidder
title: TripleLift Native
description: Prebid TripleLift Native Bidder Adapter
biddercode: triplelift_native
gdpr_supported: true
tcf2_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: native
userIds: criteo, identityLink, unifiedId
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
gvl_id: 28
---

{% capture version2 %}
The Triplelift Prebid Server bidding adapter and user sync endpoint require setup before beginning. Please contact us at prebid@triplelift.com.
{% endcapture %}
{% include alerts/alert_important.html content=version2 %}

This is a Prebid Server adapter for running component native only. For the standard Prebid JS Triplelift bid adapter, see the "Triplelift" bidder.

### Table of Contents

- [Bid Params](#triplelift-bid-params)
- [First Party Data](#triplelift-first-party)

<a name="triplelift-bid-params" />

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| inventoryCode | required | TripleLift inventory code for this ad unit (provided to you by your partner manager) | 'code1' | string |
| floor | optional | the bid floor, in usd | 1.2 | number |

<a name="triplelift-first-party" />

### First Party Data

Triplelift supports standard IAB OpenRTB 2.5 First Party Data fields, including:
- `site.*`
- `user.*`