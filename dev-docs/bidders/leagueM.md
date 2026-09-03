---
layout: bidder
title: LeagueM
description: LeagueM Bidder Adapter
biddercode: leagueM
media_types: banner, video
coppa_supported: true
tcfeu_supported: false
usp_supported: true
prebid_member: false
pbjs: true
pbs: false
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
safeframes_ok: true
dchain_supported: false
deals_supported: true
fpd_supported: false
ortb_blocking_supported: true
privacy_sandbox: no
---

### Prebid.js Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example                            | Type      |
|-------------|----------|-----------------------------|------------------------------------|-----------|
| `pid`       | required | Placement ID                | `0e232769e6f71d291ee7dbc9d157cf84` | `string`  |
| `env`       | optional | Environment name            | `leagueM`                          | `string`  |
| `ext`       | optional | Specific integration config | `{}`                               | `object`  |
