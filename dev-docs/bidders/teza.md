---
layout: bidder
title: Teza
description: Teza Bid Adapter
biddercode: teza
prebid_member: false
schain_supported: true
dchain_supported: false
tcfeu_supported: false
dsa_supported: false
deals_supported: false
floors_supported: false
usp_supported: false
coppa_supported: false
fpd_supported: false
gpp_sids: none
pbjs: true
pbs: false
media_types: banner
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Description

Banner-only adapter for the Teza OpenRTB 2.x endpoint.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ------------- | -------- | --------------------------------------------------------------------------- | ---------- | --------- |
| `account` | required | Account identifier provided by Teza. | `acct123` | `string` |
| `tagid` | optional | Ad placement identifier; falls back to GPID or `adUnitCode` if not present. | `home-top` | `string` |
| `bidfloor` | optional | Minimum price to bid. Default `0.01`. | `0.10` | `number` |
| `bidfloorcur` | optional | Currency for `bidfloor`. Default `USD`. | `USD` | `string` |
| `test` | optional | When `true`, enables test mode (`test=1`) on requests. | `true` | `boolean` |

### Test Parameters

```js
var adUnits = [
    {
        code: "div-1",
        mediaTypes: { banner: { sizes: [[300, 250]] } },
        bids: [
            {
                bidder: "teza",
                params: {
                    account: "acct123",
                    bidfloor: 0.1,
                    test: true,
                },
            },
        ],
    },
]
```
