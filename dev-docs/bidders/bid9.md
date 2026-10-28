---
layout: bidder
title: bid9
description: Prebid bid9 Bidder Adapter
biddercode: bid9
pbjs: true
pbs: false
media_types: banner, video
multiformat_supported: will-bid-on-any
tcfeu_supported: false
gvl_id: none
usp_supported: true
gpp_sids: usnat, usstate_all, usp
coppa_supported: true
dsa_supported: true
schain_supported: true
dchain_supported: false
userIds: all
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: true
privacy_sandbox: no
prebid_member: false
sidebarType: 1
---

## Note

The bid9 adapter sends one OpenRTB 2.6 request per ad unit, routed by the ad unit's channel ID. It supports Banner and Video (instream and outstream), floors, deals, schain, user IDs and first-party data. Contact `amit@kolorowey.com` or `kshitiz@kolorowey.com` to set up an account and channels.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                            | Example                      | Type     |
|---------------|----------|------------------------------------------------------------------------|------------------------------|----------|
| `channelId`   | required | bid9 channel ID                                                        | `'6a0c1b2d3e4f5a6b7c8d9e0f'` | `string` |
| `publisherId` | optional | bid9 publisher ID (sent as `site.publisher.id` / `app.publisher.id`)   | `'pub-001'`                  | `string` |
| `bidFloor`    | optional | Static floor, used only when the Price Floors Module provides no floor | `0.5`                        | `number` |
| `bidFloorCur` | optional | Currency of `bidFloor`, default `USD`                                  | `'EUR'`                      | `string` |

## Video

All standard OpenRTB video fields set in `mediaTypes.video` are sent in `imp.video`, including `mimes`, `protocols`, `minduration`/`maxduration`, `startdelay`, `plcmt`, `linearity`, `skip`/`skipmin`/`skipafter`, `playbackmethod`, `api` and the pod fields. `playerSize` is sent as `w`/`h`. Objects that `mediaTypes.video` does not model, such as `companionad`, can be passed through `ortb2Imp.video`.

Outstream bids need a renderer configured by the publisher on the ad unit.

## First Party Data

`ortb2` (site, app, user, device, content, regs, source, `bcat`, `badv`) and `ortb2Imp` (for example `ext.gpid`, `ext.data`, `instl`, `rwdd`) are passed through unchanged.
