---
layout: bidder
title: EngageADX
description: EngageADX Bidder Adaptor
pbjs: true
pbs: true
biddercode: engageadx
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: true
schain_supported: true
aliasCode : adkernel
---

### Note:

The EngageADX bidding adapter requires setup and approval before implementation. Please reach out to <admin@engageadx.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Host | `'cpm.engageadx.com'` | `string` |
| `zoneId` | required | Zone Id           | `30164`                 | `integer` |
