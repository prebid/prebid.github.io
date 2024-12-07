---
layout: bidder
title: Rediads
description: Prebid Rediads Bidder Adaptor
biddercode: rediads
media_types: banner, video, native
prebid_member: false
pbjs: true
pbs: false
pbs_app_supported: false
fpd_supported: true
multiformat_supported: will-bid-on-one
---

### Note

The Rediads bidding adapter requires setup and approval before implementation. Please reach out to <support@rediads.com> for more details.

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `account_id` | Required | account_id will be generated on Rediads Platform. | `'12345'`        | `string` |
| `site` | optional | Site Domain Name. | `'rediads.com'`        | `string` |
| `slot` | optional | Unique identifier for Ad Slot. Generated on Rediads Platform.  | `'54321'`        | `string` |
