---
layout: bidder
title: NextMillennium
gdpr_supported: true
usp_supported: true
coppa_supported: false
schain_supported: false
dchain_supported: false
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: false
pbs_app_supported: false
pbjs: true
pbs: true
biddercode: nextMillennium
media_types: banner
description: NextMillennium bid adapter
---

### bid params

{: .table .table-bordered .table-striped }
| Name           | Description                              | Example   | Type    |
|----------------+------------------------------------------+-----------|---------|
| `placement_id` | Placement ID, provided by nextMillennium | `'12345'` | String  |
| `group_id`     | Group ID, provided by nextMillennium     | `'12345'` | String  |

Required one of the two parameters placement_id or group_id.

Further information for the auction on NextMillennium side is generated automatically.
