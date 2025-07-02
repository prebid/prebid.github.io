---
layout: bidder
title: Afront
description: Prebid Afront Bidder Adaptor
biddercode: afront
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbs: true
sidebarType: 1
floors_supported: true
prebid_member: false
fpd_supported: false
gvl_id: none
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
userIds: all
---

### Note

The Afront Bidding adapter requires setup before beginning. Please contact us at [support@afront.io](mailto:support@afront.io).
Afront will bid on the first impression in request.

### Bid Params

{: .table .table-bordered .table-striped }

| Name              | Scope    | Description       | Example  | Type     |
| ----------------- | -------- | ----------------- | -------- | -------- |
| `clientAccountId` | required | Client account id | `'id'`   | `string` |
| `dataSourceId`    | required | Data source id    | `'hash'` | `string` |
