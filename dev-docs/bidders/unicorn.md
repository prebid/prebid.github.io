---
layout: bidder
title: UNICORN
description: Prebid UNICORN Bidder Adaptor
pbjs: true
pbs: true
pbs_app_supported: true
media_types: banner
biddercode: unicorn
sidebarType: 1
---

## bid params

{: .table .table-bordered .table-striped }
| Name          | Scope                  | Description                                         | Example              | Type       |
| ------------- | ---------------------- | --------------------------------------------------- | -------------------- | ---------- |
| `placementId` | optional               | Your placement ID                                   | `'rectangle-ad-1'`   | `string`   |
| `accountId`   | required               | Account ID for charge request (provided by UNICORN) | `12345`              | `integer`  |
| `publisherId` | optional               | Account specific publisher id.                      | `'67890'`            | `string`   |
| `mediaId`     | optional               | Publisher specific media id.                        | `'example'`          | `string`   |
| `bcat`        | optional for Prebid.js | Blocked IAB categories                              | `['IAB-1', 'IAB-2']` | `[string]` |

`publisherId` as `integer` is also supported on Prebid.js

## Ad slot position signals

For each bid request the adapter measures the ad slot's on-screen position,
geometry and viewability, and sends it in the OpenRTB request it builds. This is
scoped to the UNICORN request only — nothing is written to shared First Party
Data, so no other bidder is affected. No configuration is required.

- `imp.banner.pos` — OpenRTB AdPosition (`1` = above the fold, `3` = below the
  fold). A publisher-declared `ortb2Imp.banner.pos`, if present, is used instead
  of the measured value.
- `imp.ext.adslot` — `{ ver, ratio, fixed, sticky, w, h, x, y }`: `ratio` is the
  visible-area ratio (0–1), `fixed`/`sticky` flag a fixed/sticky ancestor, and
  `x`/`y`/`w`/`h` are the slot's document-relative position and rendered size in
  CSS pixels.
- `imp.ext.gpid` — the Global Placement ID, forwarded from `ortb2Imp.ext.gpid`
  (set by the `gpid` / `gptPreAuction` module) when present.

The slot element is resolved in this order: `ortb2Imp.ext.data.divId` → the GPT
slot mapping (`getSlotElementId()`) → the ad unit code. Set
`ortb2Imp.ext.data.divId` when the ad unit code is not the div id and GPT is not
defined at auction time.
