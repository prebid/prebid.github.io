---
layout: bidder
title: TRUSTX
description: Prebid TRUSTX Bidder Adapter
pbjs: true
pbs: true
biddercode: trustx
media_types: banner, video
multiformat_supported: will-bid-on-any
usp_supported: true
schain_supported: true
floors_supported: true
userIds: all
coppa_supported: true
fpd_supported: true
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Bid Params](#bid-params)
- [First Party Data](#first-party-data)

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope     | Description                                                                                              | Example                                   | Type      |
|----------------|-----------|----------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`          | required* | Represents the TRUSTX bidder system Ad Slot ID. Alternative to `secid`.                                 | `42`                                      | `integer` |
| `secid`        | required* | Alternative to `uid`. Represents the TRUSTX bidder system Ad Slot ID.                                     | `42`                                      | `integer` |
| `bidFloor`     | optional  | Floor of the impression opportunity. If present in the request overrides XML info.                       | `0.8`                                     | `float`   |
| `currency`     | optional  | Currency for bid floor. Defaults to `USD`.                                                               | `USD`                                     | `string`  |
| `test`         | optional  | Enable test mode to receive test creatives without real Ad Slots.                                     | `true`                                    | `boolean` |

\* Either `uid` or `secid` is required (one of them must be provided).

**Note:** The adapter also supports Prebid's Floor Module via `getFloor()` function.

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

Global site or user data using `setConfig()`, or Bidder-specific using `setBidderConfig()` supports following fields:

- `ortb2.user.data[]`: Standard IAB segment taxonomy user data
- `ortb2.user.ext.device`: Non standard arbitrary user device
- `ortb2.user.keywords`: Standard IAB OpenRTB 2.5 user.keywords field
- `ortb2.site.keywords`: Standard IAB OpenRTB 2.5 site.keywords field
- `ortb2.site.cat[]`: Standard IAB OpenRTB 2.5 site.cat field
- `ortb2.site.pagecat[]`: Standard IAB OpenRTB 2.5 site.pagecat field
- `ortb2.site.content.genre`: Standard IAB OpenRTB 2.5 site.content.genre field
- `ortb2.site.content.data[]`: Standard IAB OpenRTB 2.5 site.content.data field
- `ortb2.site.content.id`: Standard IAB OpenRTB 2.5 site.content.id field
- `ortb2.site.content.title`: Standard IAB OpenRTB 2.5 site.content.title field
- `ortb2.source.tid`: Transaction ID from source
- `ortb2.source.ext.schain`: Supply chain object
- `ortb2.regs.ext.dsa`: Digital Services Act (DSA) data

AdUnit-specific data using `AdUnit.ortb2Imp` supports following fields:

- `ortb2.imp[].ext.data.*`
- `ortb2.imp[].instl`
