---
layout: bidder
title: MadSense
description: Prebid MadSense Bidder Adapter
pbjs: true
pbs: true
biddercode: madsense
tcfeu_supported: false
gdpr_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
multiformat_supported: will-not-bid
sidebarType: 1

---

### Integration

The MadSense Header Bidding adapter needs approval from the MadSense team. For more details, contact <prebid@madsense.io>.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `company_id` | required | Company ID | `'1234567'` | `string`  |
| `bidfloor`   | optional | Bid floor price | `0.5` | `number` |
| `currency`   | optional | Bid floor currency | `'USD'` | `string` |
