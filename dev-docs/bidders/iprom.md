---
layout: bidder
title: iPROM
description: iPROM Prebid Adapter
biddercode: iprom
media_types: banner
pbjs: true
pbs: false
gvl_id: 811
tcfeu_supported: true
usp_supported: false
dsa_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
userId: none
enable_download: true
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: true
prebid_member: false
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Prebid Server Note

For registration with our bidder please see our website at [www.iprom.eu](https://www.iprom.eu) or contact us at <support@iprom.si>.

## First Party Data

iPROM supports first-party data (`ortb2`) and SupplyChain (`schain`) objects.
In legacy mode, `schain` is sent separately and the remaining `ortb2` data is passed as `firstPartyData`.
In ORTB mode, the adapter builds an OpenRTB request from the available Prebid request data.

## Bid Params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                                                                   | Example                                 | Type    |
|-------------|----------|-------------------------------------------------------------------------------|-----------------------------------------|---------|
| `id`        | required | The site ID from iPROM.                                                       | `'1234'`                                | string  |
| `dimension` | optional | iPROM-specific bidding zone. Comma-separated if multiple values are provided. | `'300x250'`                             | string  |
| `endpoint`  | optional | A different HTTPS endpoint to use for bid responses.                          | `'https://core.iprom.net/programmatic'` | string  |
| `ortb`      | optional | Whether the request payload should be constructed using the OpenRTB format.   | `true`                                  | boolean |
