---
layout: bidder
title: Ferio
description: Ferio Prebid Bidder Adapter
biddercode: ferio
gvl_id: none
usp_supported: true
gpp_sids: none
schain_supported: true
media_types: banner, video, native
floors_supported: true
fpd_supported: true
userIds: all
pbjs: true
pbs: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Note

The Ferio bidder adapter requires setup before beginning. Please contact <prebid@ferio.cloud> for more information.

## Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | ---------- | ------------------------------------ | ----------------------------------- | ---------- |
| `publisherId` | required | Publisher ID on the Ferio platform | `'pubwZR87JRDZSf6V'` | `string` |
| `adUnitId` | required | Ad unit ID on the Ferio platform | `'3855715c-2ceb-4ba5-a876-8c43a987f210'` | `string` |
| `tenantId` | required | Tenant ID on the Ferio platform | `'client-pbjs'` | `string` |
