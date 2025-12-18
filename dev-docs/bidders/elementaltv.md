---
layout: bidder
title: ElementalTV
description: Prebid ElementalTV Bidder Adapter
biddercode: elementaltv
pbs: true
pbjs: false
media_types: banner, video, native
pbs_app_supported: true
schain_supported: true
coppa_supported: true
deals_supported: true
usp_supported: true
gpp_supported: true
dsa_supported: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Registration

The ElementalTV bidder adapter requires prior setup. Please contact us at <support@elementaltv.com>.

### OpenRTB Version

References to the OpenRTB specification in this document assume **OpenRTB 2.6**.

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description                                  | Example      | Type     |
|---------|----------|----------------------------------------------|--------------|----------|
| `adunit`| required | Ad Unit ID or Supply Source reference to bid against | `'test'` or `'SSP:12345'` | `string` |

### Notes

- `adunit` can reference either:
  - an **Ad Unit ID** (pass the ID as-is), or
  - a **Supply Source reference** using the prefix format `SSP:<supply_source_id>` (e.g., `SSP:12345`).
