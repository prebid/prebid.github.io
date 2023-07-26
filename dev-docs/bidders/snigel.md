---
layout: bidder
title: Snigel
description: Snigel Prebid Bidder Adapter
biddercode: snigel
gvl_id: 1076
media_types: banner
tcfeu_supported: true
prebid_member: false
schain_supported: true
coppa_supported: true
usp_supported: true
deals_supported: false
floors_supported: true
pbjs: true
sidebarType: 1
---

#### Note

This bid adapter requires our ad operation experts to create an optimized setup for the desired placements on your property.
Please reach out to us at <https://snigel.com/get-in-touch>.

#### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `placement`    | required | Placement identifier from Snigel | `"top_leaderboard"` | `string` |

Use placement `"prebid_test_placement"` to receive unbilled test ads.
