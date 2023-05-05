---
layout: bidder
title: ONE by AOL Mobile
description: Prebid AOL Bidder Adaptor aliase
pbjs: true
biddercode: onemobile
aliasCode : aol
sidebarType: 1
---

### IMPORTANT NOTICE!
**TL;DR**
1. The `onemobile` adapter is scheduled to be depreciated.
2. Our New `yahoossp` is available for early adoption.
3. Please contact your Account Manager/Executive for migration details.

Dear Publishers & Partners,
As part of our platform consolidation process to simplify your integrations moving forward
We invite you to switch from the `onemobile` Adapter to our NEW `yahoossp` bid adapter for both Display & Video inventory.
FYI - The oneVideo adapter is scheduled for depreciation in the upcoming months.

Thanks in advance,
Yahoo SSP

### Bid Params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                                 | Example                              | Type     |
|-------|----------|-------------------------------------------------------------|--------------------------------------|----------|
| `dcn` | required | Site ID provided by ONE.                                    | `'2c9d2b50015a5aa95b70a9b0b5b10012'` | `string` |
| `pos` | required | Position on a page where an ad will appear.                 | `'header'`                           | `string` |
| `ext` | optional | Object that allows the client to send any extra parameters. |                                      | `object` |

ONE by AOL Mobile is an aliased bidder for AOL
