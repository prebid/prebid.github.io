---
layout: bidder
title: Yaleo
description: Prebid Bidder Adapter for Yaleo
biddercode: yaleo
media_types: banner
tcfeu_supported: true
safeframes_ok: false
floors_supported: true
gvl_id: 783
pbjs: true
pbs: false
sidebarType: 1
---

### Note

The Yaleo Bidding adapter requires setup before beginning. Please contact us at [hola@yaleo.com](mailto:hola@yaleo.com).

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                          | Example                              | Type   |
| ------------- | -------- | ------------------------------------------------------------------------------------ | ------------------------------------ | ------ |
| `placementId` | required | Yaleo placement identifier.                                                          |`460a301d-a9f7-4104-b55f-2a3d4674a973`|`string`|
| `memberId`    | optional | Member identifier.                                                                   |`12345`.                              |`number`|
| `maxCpm`      | optional | Maximum CPM value. Bids with a CPM higher than the specified value will be rejected. |`2.5`                                 |`number`|
