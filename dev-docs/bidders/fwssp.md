---
layout: bidder
title: FWSSP
description: Freewheel Bidder Adaptor
pbs: true
biddercode: fwssp
gvl_id: 285
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
media_types: video
ortb_blocking_supported: partial
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------------------|--------|----------|
| `custom_site_section_id` | required | custom Site Section tag or numeric Site Section ID | "ss_12345" | `string` |
| `network_id` | required | Network ID | "12345" | `string` |
| `profile_id` | required | The value should contain a profile name. and NOT a numeric profile ID. This can either include the network ID prefix or with the profile name alone | "prof_12345" | `string` |

