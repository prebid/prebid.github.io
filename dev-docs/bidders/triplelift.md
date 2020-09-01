---
layout: bidder
title: TripleLift
description: Prebid TripleLift Bidder Adapter
gdpr_supported: true
tcf2_supported: true
usp_supported: true
schain_supported: true
coppa_supported: true
biddercode: triplelift
userIds: criteo, identityLink, unifiedId
pbjs: true
pbs: true
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name            | Scope                        | Description                                                                          | Example                                    | Type     |
|-----------------|------------------------------|--------------------------------------------------------------------------------------|--------------------------------------------|----------|
| `inventoryCode` | required                     | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_main_feed'`                      | `string` |
| `floor`         | optional                     | Bid floor                                                                            | `1.00`                                     | `float`  |
| `video`         | required for instream video  | oRTB video object                                                                    | `{ mimes: ['video/mp4'], w: 640, h: 480 }` | `object` |
| `video.w`       | required for instream video  | oRTB video object width dimension                                                    | `640`                                      | `int`    |
| `video.h`       | required for instream video  | oRTB video object height dimension                                                   | `480`                                      | `int`    |
