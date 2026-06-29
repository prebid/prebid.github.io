---
layout: bidder
title: MyFeature
description: MyFeature Bidder Adapter
biddercode: myfeature
aliasCode: ferio
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

The MyFeature bidder adapter is a client-side alias of the `ferio` adapter and
requires setup before beginning. Please contact <prebid@ferio.cloud> for more
information.

User syncs for the alias only run when the publisher enables
`userSync.aliasSyncEnabled` via `pbjs.setConfig`.

## Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | ---------- | ------------------------------------ | ----------------------------------- | ---------- |
| `publisherId` | required | Publisher ID on the Ferio platform | `'pubwZR87JRDZSf6V'` | `string` |
| `adUnitId` | required | Ad unit ID on the Ferio platform | `'3855715c-2ceb-4ba5-a876-8c43a987f210'` | `string` |
| `tenantId` | required | Tenant ID on the Ferio platform | `'myfeature-pbjs'` | `string` |
