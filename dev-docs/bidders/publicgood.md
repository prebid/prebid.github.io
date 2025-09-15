---
layout: bidder
title: Public Good
description: Public Gppd Bid Adapter
biddercode: publicgood
pbjs: true
sidebarType: 1
media_types: banner
safeframes_ok: true
tcfeu_supported: false
usp_supported: false
coppa_supported: false
---

### Bid params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                                                                                                  | Example                       | Type          |
|-------------|----------|--------------------------------------------------------------------------------------------------------------|-------------------------------|---------------|
| `partnerId` | required | Publisher ID                                                                                                 | `'prebid-test'`               | `string`      |
| `slotId`    | required | Slot ID = 'all' unless negotiated otherwise                                                                  | `'all'`                       | `string`      |
