---
layout: bidder
title: HyperBrainz
description: Prebid.js HyperBrainz Bid Adapter
biddercode: hyperbrainz
media_types: banner, video, native
gdpr_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
userIds: all
pbjs: true
pbs: false
maintainer_email: it@hyperbrainz.com
---

### Note

The HyperBrainz bid adapter requires setup and approval before implementation.
Please reach out to it@hyperbrainz.com for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example             | Type     |
|---------------|----------|-------------------------------------------|---------------------|----------|
| `placementId` | required | Unique placement identifier               | `'hb_test_banner'`  | `string` |
| `publisherId` | optional | Publisher identifier                      | `'pub-1'`           | `string` |
| `bidFloor`    | optional | Minimum CPM floor override (USD)          | `0.30`              | `number` |
| `ext`         | optional | Custom extension fields passed to the exchange | `{}`           | `object` |
