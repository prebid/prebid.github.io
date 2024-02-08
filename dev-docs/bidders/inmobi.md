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

InMobi has partnered with a third party, ID5, to use their ID as our primary user identifier for mobile web supply. We will also rely on ID5 IDs to handle compliance flows related to Data Subject Right requests in our systems. Hence, we require the publisher to use ID5’s sync URL for user syncing and passing the corresponding ID5 ID to InMobi in the bid request. For this purpose, we provide ID5’s sync URL in our Prebid adapter for User ID sync. Note that, InMobi has a direct contract with ID5 for consuming ID5 ID and the user sync via Prebid does not require the publisher to get into a contractual relationship with ID5.

To opt out of InMobi ads on mobile web inventory or for any other requests, the user needs to visit the Opt-out page on InMobi website (<https://www.inmobi.com/page/opt-out/>). For opting out of ID5 ID entirely, the user needs to visit ID5’s opt out page: <https://id5.io/platform-privacy-policy/>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `plc`         | required | Placement ID          | `'1234'`  | `string`  |
