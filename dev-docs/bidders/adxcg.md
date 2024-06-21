---
layout: bidder
title: adxcg
description: Prebid adxcg bidder adaptor
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
biddercode: adxcg
media_types: native, video
tcfeu_supported: false
userIds: id5Id, identityLink, pubCommonId, unifiedId
sidebarType: 1
---

### Note

{% include dev-docs/pbjs-adapter-required-for-pbs.md %}

Prebid-server activation requires setup and approval before beginning. Please reach out to your account manager or <info@adxcg.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description   | Example | Type     |
|----------|----------|---------------|---------|----------|
| adzoneid | required | adxcg zone id | `'1'`   | `string` |
