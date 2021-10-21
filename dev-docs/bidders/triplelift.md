---
layout: bidder
title: TripleLift
description: Prebid TripleLift Bidder Adapter
biddercode: triplelift
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video
userIds: criteo, identityLink, unifiedId, pubCommonId
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
gvl_id: 28
---

{% capture version2 %}
The Triplelift Prebid Server bidding adapter and user sync endpoint require setup before beginning. Please contact us at prebid@triplelift.com.
{% endcapture %}
{% include alerts/alert_important.html content=version2 %}

### Bid Params

{: .table .table-bordered .table-striped }

| Name            | Scope                        | Description                                                                          | Example                                    | Type     |
|-----------------|------------------------------|--------------------------------------------------------------------------------------|--------------------------------------------|----------|
| `inventoryCode` | required                     | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_main_feed'`                      | `string` |
| `floor`         | optional                     | Bid floor                                                                            | `1.00`                                     | `float`  |
| `video`         | required for instream video  | oRTB video object                                                                    | `{ mimes: ['video/mp4'], w: 640, h: 480 }` | `object` |
| `video.w`       | required for instream video  | oRTB video object width dimension                                                    | `640`                                      | `int`    |
| `video.h`       | required for instream video  | oRTB video object height dimension                                                   | `480`                                      | `int`    |
