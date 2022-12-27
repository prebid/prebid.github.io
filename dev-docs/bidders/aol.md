---
layout: bidder
title: AOL
description: Prebid AOL Bidder Adaptor
pbjs: true
biddercode: aol
gdpr_supported: true
usp_supported: true
gvl_id: 25
userIds: connectId
sidebarType: 1

---
### IMPORTANT NOTICE!
**TL;DR**
1. The `aol` adapter is scheduled to be depreciated.
2. Our New `yahoossp` is available for early adoption.
3. Please contact your Account Manager/Executive for migration details.

Dear Publishers & Partners,
As part of our platform consolidation process to simplify your integrations moving forward
We invite you to switch from the `oneVideo` Adapter to our NEW `yahoossp` bid adapter for both Display & Video inventory.
FYI - The oneVideo adapter is scheduled for depreciation in the upcoming months.

Thanks in advance,
Yahoo SSP

### Note:
This adapter allows use of both ONE by AOL: Display and ONE by AOL: Mobile platforms. In order to differentiate these sources of demand in your ad server and reporting, you may use the optional `onedisplay` and `onemobile` adapter aliases instead.

### Bid Params

#### ONE by AOL: Display

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                             | Example                                       | Type     |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|----------|
| `placement` | required | The placement ID from AOL.                                                                                                                                                              | `'23324932'`                                  | `string` |
| `network`   | required | The network ID from AOL.                                                                                                                                                                | `'5071.1'`                                    | `string` |
| `alias`     | optional | The placement alias from AOL.                                                                                                                                                           | `'desktop_articlepage_something_box_300_250'` | `string` |
| `server`    | optional | The server domain name. Default is adserver-us.adtech.advertising.com. EU customers must use adserver-eu.adtech.advertising.com, and Asia customers adserver-as.adtech.advertising.com. | `'adserver-eu.adtech.advertising.com'`        | `string` |

#### ONE by AOL: Mobile

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                                 | Example                              | Type     |
|-------|----------|-------------------------------------------------------------|--------------------------------------|----------|
| `dcn` | required | Site ID provided by ONE.                                    | `'2c9d2b50015a5aa95b70a9b0b5b10012'` | `string` |
| `pos` | required | Position on a page where an ad will appear.                 | `'header'`                           | `string` |
| `ext` | optional | Object that allows the client to send any extra parameters. |                                      | `object` |
