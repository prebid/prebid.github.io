---
layout: bidder
title: xe.works
description: Prebid Xe.works Bidder Adaptor
biddercode: xe
media_types: banner, video
coppa_supported: true
gdpr_supported: true
usp_supported: true
prebid_member: false
pbjs: true
pbs: false
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note:

The Xe.works adapter requires setup before beginning. Please contact us at team@xe.works


### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example       | Type      |
|-------------|----------|-----------------------------|---------------|-----------|
| `placement` | required | Placement ID                | `test-banner` | `string`  |
| `env`       | required | Environment name            | `xe`          | `string`  |
| `ext`       | optional | Specific integration config | `{}`          | `object`  |