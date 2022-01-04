---
layout: bidder
title: UOL
description: Prebid UOL Bidder Adaptor
pbjs: true
biddercode: uol
gdpr_supported: false
media_types: banner
enable_download: false
pbjs_version_notes: not in 5.x
---


### Note:
The UOL Project adapter requires setup and approval from the UOL Project team, even for existing UOL Project publishers. Please reach out to your account team or l-prebid@uolinc.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                      | Example                |
|-----------------+----------+------------------------------------------------------------------+------------------------|
| `placementId`   | required | UOL placement ID                                                 | '123124', 123154       |
| `test`          | optional | Activate AdServer test endpoint                                  | true, false            |
| `cpmFactor`     | optional | Positive Integer value that will be used by the AdServer as a cpm multiplier. If passed, also requires 'test' flag to be set to 'true' | 1, 2, 5 |

## Note:
Currently, the UOL bidAdapter is under initial tests. Please follow this page for updates regarding required parameters and new features. 
