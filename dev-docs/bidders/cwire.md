---
layout: bidder
title: C-WIRE
description: C-WIRE Prebid Bidder Adapter
pbjs: true
pbs: true
biddercode: cwire
tcfeu_supported: false
usp_supported: false
schain_supported: false
userIds: none
enable_download: true
media_types: banner
sidebarType: 1
---
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          |  Scope   |     Description     | Example  |   Type    |
|---------------|:--------:|:-------------------:|:--------:|:---------:|
| `pageId`      | required |   C-WIRE page id    |  `2453`  | `integer` |
| `placementId` | required | C-WIRE placement id | `113244` | `integer` |

### URL parameters

Additionally, the following parameters can be passed by URL parameters for testing.

{: .table .table-bordered .table-striped }
| Name         |  Scope   |           Description            |             Example             |   Type   |
|--------------|:--------:|:--------------------------------:|:-------------------------------:|:--------:|
| `cwcreative` | optional |   C-WIRE creative id to force    |       `&cwcreative=1234`        | `string` |
| `cwgroups`   | optional |    C-WIRE group name to force    |     `&cwgroups=test-group`      | `string` |
| `cwfeatures` | optional | Comma separated list of features | `&cwfeatures=feature1,feature2` | `string` |
| `cwdebug`    | optional |            Debug flag            |         `&cwdebug=true`         | `string` |
