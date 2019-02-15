---
layout: bidder
title: AdKernel
description: Prebid AdKernel Bidder Adaptor
hide: true
biddercode: adkernel
biddercode_longer_than_12: false
media_types: video
gdpr_supported: true
---

### Note:

The Adkernel Bidding adaptor requires setup and approval before beginning. Please reach out to <prebid@adkernel.com> for more details

### bid params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.metaadserving.com'` | `string` |
| `zoneId` | required | RTB zone id           | `'30164'`                 | `string` |
