---
layout: bidder
title: AlgoriX
description: Prebid AlgoriX Bidder Adapter
biddercode: algorix
gdpr_supported: false
gvl_id:
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: true
---

### Note:

Algorix adapter requires setup and approval from the Algorix team, even for existing in-app developers and publishers. Please reach out to your account team or email to prebid@algorix.co for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                              | Type     |
|---------------|----------|---------------|--------------------------------------|----------|
| `sid`         | required | Sid           | `'30014'`                            | `string` |
| `token`       | required | Token         | `'028bca2d3b5c4f0ba155fa34864b0c4d'` | `string` |

Note: Prebid Server adapter only checks for and uses first imp bid params. All other imp bid params are ignored.
