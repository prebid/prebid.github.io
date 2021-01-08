---
layout: bidder
title: AdKernel
description: Prebid AdKernel Bidder Adaptor
pbjs: true
pbs: true
biddercode: adkernel
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
---

### Note:

The Adkernel Bidding adaptor requires setup and approval before beginning. Please reach out to <prebid@adkernel.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.metaadserving.com'` | `string` |
| `zoneId` | required | RTB zone id           | `'30164'`                 | `string` |
