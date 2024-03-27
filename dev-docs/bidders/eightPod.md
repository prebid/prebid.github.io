---
layout: bidder
title: 8pod
description: Prebid EightPod Bidder Adaptor
biddercode: eightPod
tcfeu_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: false
dchain_supported: false
userId: none
media_types: banner
deals_supported: false
floors_supported: false
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
safeframes_ok: false
multiformat_supported: will-not-bid
privacy_sandbox: no
ortb_blocking_supported: false
---

### Registration

The Example Bidding adapter requires setup before beginning. Please contact us at <ewald@8pod.com>

### Bid Params

| Name          | Scope    | Description                                                                                                 | Example                    | Type     |
|---------------|----------|-------------------------------------------------------------------------------------------------------------|----------------------------|----------|
| `placementId` | required | The unique identifier of the ad placement. Could be obtained from the 8pod UI or from your account manager. | "placementId-438753744289" | `string` |
| `publisherId` | optional | The unique identifier of the publisher.                                                                     | "publisherId-438753744289" | `string` |
