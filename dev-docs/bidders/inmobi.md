---
layout: bidder
title: InMobi
description: InMobi Bidder Adapter
biddercode: inmobi
tcfeu_supported: true
usp_supported: false
gvl_id: 333
coppa_supported: true
schain_supported: true
media_types: banner, video, native
pbs: true
pbs_app_supported: true
sidebarType: 1
---

### Note

The InMobi Prebid adapter requires a setup to create placement IDs. Please contact your InMobi partner manager for setup assistance.
For queries, write to us at <prebid-support@inmobi.com>

### User Sync Disclosure

Third-party cookie syncing helps publishers leverage their audience data, enhance targeting capabilities, and drive better ad performance. InMobi third party cookie syncing improves monetization for publishers by giving them a competitive positioning in the digital advertising ecosystem.
Ids for third parties can be synced through our pixel:
[pixel]
The uuid Macro is [macro]

To opt out of InMobi ads on web inventory the user needs to visit the Opt-out page on InMobi website (https://www.inmobi.com/page/opt-out/).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `plc`         | required | Placement ID          | `'1234'`  | `string`  |
