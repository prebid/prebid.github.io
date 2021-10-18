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
description: NextMillennium bid adapter is developed for its publishers.
As input parameters, it accepts only `placement_id`, which is issued when registering in NextMillennium.
The adapter also accepts `us_privacy` and `gdpr`. Further information for the auction
on NextMillennium side is generated automatically.
---

### bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                              | Example   | Type    |
|----------------+----------+------------------------------------------+-----------|---------|
| `placement_id` | required | Placement ID, provided by nextMillennium | `'12345'` | String  |
