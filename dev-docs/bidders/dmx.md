---
layout: bidder
title: DistrictM DMX
pbs: true
media_types: banner, video
biddercode: dmx
gvl_id: 144
tcfeu_supported: true
pbjs_version_notes: not supported in 7.0+
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| seller_id | required | The DMX Partner ID provided upon onboarding, this is for specific setup BURL, NURL or ADM support | 'seller_id' | string |
| publisher_id | required | Boost MemberId from DistrictM UI | 'member1' | string |
| tagid | required | Represent the placement ID from DistrictM or your own  | '123abc' | string |
| bidfloor | optional | The minimum price acceptable for a bid | '1.0' | string |
| memberid | optional | MemberId from DistrictM UI (legacy: replaced by publisher_id) | 'member1' | string |
| dmxid | optional | Placement ID from DistrictM (legacy: replaced by tagid) | '123abc' | string |

(See [districtmDMX](/dev-docs/bidders.html#districtmDMX) for Prebid.js)
