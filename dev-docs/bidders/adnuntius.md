---
layout: bidder
title: Adnuntius
description: Prebid Adnuntius Bidder Adaptor
biddercode: adnuntius
pbjs: true
media_types: banner, video, native
tcfeu_supported: true
prebid_member: true
userIds: false
schain_supported: true
gvl_id: 919
usp_supported: true
coppa_supported: true
safeframes_ok: true
floors_supported: true
sidebarType: 1
---

### Note

The Adnuntius Bidder Adapter requires setup and approval from Adnuntius AS.
Please reach out to <ops@adnuntius.com> for more information.

### bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `adUnitId`          | optional | The ad unit ID from Adnuntius. You must use the `adUnitId` or `publisherId`.                                                                                                  | `'the-ad-unit-id'`                                    | `string`         | 
| `publisherId`       | optional | The publisher ID from Adnuntius. You must use the `adUnitId` or `publisherId`.                                                                                                | `'the-publisher-id'`                                  | `string`         |
| `adUnitName`        | optional | The ad unit name from Adnuntius. Adds extra information to the immediate ad request for debugging purposes                                                                    | `'panorama_d_1'`                                      | `string`         |

