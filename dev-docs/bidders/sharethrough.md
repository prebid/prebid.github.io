---
layout: bidder
title: Sharethrough
biddercode: sharethrough
description: Prebid Sharethrough Adaptor
gdpr_supported: true
coppa_supported: true
floors_supported: true
media_types: banner, video
safeframes_ok: true
schain_supported: true
userIds: all
usp_supported: true
fpd_supported: true
pbjs: true
pbs: true
---

### Disclosure:

This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Note:
The Sharethrough bidder adapter requires additional setup and approval from the Sharethrough Integrations team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                      | Example                      | Type                 |
|-------------|----------|-----------------------------------------------|------------------------------|----------------------|
| `pkey`      | required | The placement key                             | `'DfFKxpkRGPMS7A9f71CquBgZ'` | `string`             |
| `bcat`      | optional | Array of blocked IAB Categories               | `['IAB1-2', 'IAB1-3']`       | `string[]`           |
| `badv`      | optional | Array of blocked Advertisers by their domains | `['ford.com', 'pepsi.com']`  | `string[]`           |
