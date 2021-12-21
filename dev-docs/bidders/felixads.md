---
layout: bidder
title: felixads
description: Prebid felixads Bidder Adaptor
pbjs: true
pbs: true
biddercode: felixads
aliascode: adkernel
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: true
schain_supported: true
userIds: all
---

### Note:

The felixads Bidding adaptor requires setup and approval before beginning. Please reach out to <ops@felixads.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | felixads's RTB host   | `'cpm.felixads.com'`      | `string` |
| `zoneId` | required | RTB zone id           | `'30164'`                 | `integer` |
