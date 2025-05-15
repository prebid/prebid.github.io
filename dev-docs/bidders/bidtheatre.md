---
layout: bidder
title: Bidtheatre
description: Bidtheatre Prebid Bidder Adapter
biddercode: bidtheatre
gvl_id: 30
tcfeu_supported: true
media_types: banner, video
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: partial
multiformat_supported: will-bid-on-one
privacy_sandbox: topics
pbjs: true
sidebarType: 1
pbs: true
pbs_app_supported: true
---

### Registration

The Bidtheatre bidding adapter requires manual set up before use. Please contact us at [operations@bidtheatre.com](mailto:operations@bidtheatre.com) if you would like to access Bidtheatre's demand.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `publisherId` | required | Manually set up publisher ID | `'73b20b3a-12a0-4869-b54e-8d42b55786ee'` | `string` |

In addition to the required bid param above, Bidtheatre will also enforce the following requirements

- All ad slots on a page must belong to the same publisher ID
- The publisher must provide either a client IP and/or explicit geo data in the request  

### First Party Data

Publishers should use the `ortb2` method of setting First Party Data. All standard OpenRTB 2.5 properties are supported, including but not limited to

- ortb2.site.*
- ortb2.user.*

### ORTB Blocking

`bcat`, `badv` and `battr` are all supported.

### Media Types

All standard OpenRTB 2.5 properties are supported for both banner and video. Bidtheatre Bidding adapter will always return VAST 2.0 or lower for video requests.
