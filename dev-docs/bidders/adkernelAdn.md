---
layout: bidder
title: AdKernelAdn
description: Prebid AdKernel Ad Delivery Network Bidder Adaptor
pbjs: true
pbs: true
biddercode: adkernelAdn
media_types: banner, video
gdpr_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: true
gvl_id: 14
sidebarType: 1
---

### Note

The AdkernelAdn Header Bidding adaptor requires setup and approval before beginning. Please reach out to <prebid@adkernel.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description     | Example              | Type      |
|---------|----------|-----------------|----------------------|-----------|
| `host`  | optional | Ad network host | `'tag.adkernel.com'` | `string`  |
| `pubId` | required | Publisher Id    | `102`                | `integer` |
