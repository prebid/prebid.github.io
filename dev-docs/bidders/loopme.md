---
layout: bidder
title: Loopme
description: Loopme Bidder Adapter
biddercode: loopme
gvl_id: 109
media_types: banner, video, audio, native
coppa_supported: true
tcfeu_supported: true
usp_supported: true
prebid_member: false
pbjs: false
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
sidebarType: 1
---

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                 | Example        | Type      |
|---------------|----------|---------------------------------------------|----------------|-----------|
| `publisherId` | required | A ID which identifies Loopme partner.       | `'45qkf5s9zf'` | `string`  |
| `bundleId`    | required | A ID which identifies app/site in Loopme.   | `'v5qvf9fx4f'` | `string`  |
| `placementId` | required | A placement ID in Loopme.                   | `'x6fnvfd7ty'` | `string`  |
