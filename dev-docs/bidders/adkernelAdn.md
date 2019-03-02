---
layout: bidder
title: AdKernelAdn
description: Prebid AdKernel Ad Delivery Network Bidder Adaptor
hide: true
biddercode: adkernelAdn
biddercode_longer_than_12: false
media_types: video
gdpr_supported: true
---

### Note:

The AdkernelAdn Header Bidding adaptor requires setup and approval before beginning. Please reach out to <prebid@adkernel.com> for more details

### bid params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description     | Example              | Type      |
|---------|----------|-----------------|----------------------|-----------|
| `host`  | optional | Ad network host | `'tag.adkernel.com'` | `string`  |
| `pubId` | required | Publisher Id    | `102`                | `integer` |
