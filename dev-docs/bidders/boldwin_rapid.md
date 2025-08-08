---
layout: boldwin_rapid
title: Boldwin Rapid
description: Prebid Boldwin Rapid Bidder Adapter
pbjs: true
pbs: true
biddercode: boldwin_rapid
gvl_id: 1151
tcfeu_supported: true
usp_supported: true
coppa_supported: true
floors_supported: true
pbs_app_supported: true
gpp_supported: true
media_types: banner, video, native
multiformat_supported: will-bid-on-one
safeframes_ok: true
sidebarType: 1
---

### Note

The Boldwin Rapid Bidding adapter requires setup before beginning. Please contact us at <support@bold-win.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                      | Type      |
|---------------|----------|---------------|------------------------------|-----------|
| `pid`         | required | Publisher Id  | `'1234'`                     | `string`  |
| `tid`         | required | Placement Id  | `'123e45a6789b9ced876cc543'` | `string`  |

For both the Prebid Server and Prebid.js integrations it is required to use both parameters: `pid` and `tid`.
`pid` - should be sent in the Prebid Server bid request to Boldwin Rapid in case you integrate with Boldwin Rapid bidder.
`tid` - should be sent in the Prebid Server bid request to Boldwin Rapid in case you integrate with Boldwin Rapid bidder.
