---
layout: bidder
title: bid9
description: Prebid bid9 Bidder Adapter
biddercode: bid9
pbjs: true
pbs: true
pbs_app_supported: true
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

## Prebid Server

bid9 is also available in Prebid Server, for banner and video on site and app traffic. It uses the same bid params as Prebid.js, so an ad unit's `params` can stay as they are when bid9 moves server-side. Prebid Server sends each impression to bid9 as its own request. To route bid9 through a Prebid Server host, add it to `s2sConfig`:

```javascript
pbjs.setConfig({
  s2sConfig: {
    accountId: 'your-account-id',
    enabled: true,
    adapter: 'prebidServer',
    bidders: ['bid9'],
    timeout: 800,
    endpoint: 'https://your-pbs-host/openrtb2/auction',
    syncEndpoint: 'https://your-pbs-host/cookie_sync'
  }
});
```

## Regions

bid9 does not serve Europe yet (EEA, UK and Switzerland), because it has no IAB TCF vendor ID. Prebid Server hosts in Europe should consider disabling it. European support is planned once the ID is registered.

## User Sync

bid9 declares an iframe user sync in Prebid Server, so `/cookie_sync` returns an iframe for bid9 and the synced ID is sent as `user.buyeruid`. Publishers using Prebid.js need iframe syncs allowed for bid9, for example:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: { bidders: ['bid9'], filter: 'include' }
    }
  }
});
```

## First Party Data

`ortb2` (site, app, user, device, content, regs, source, `bcat`, `badv`) and `ortb2Imp` (for example `ext.gpid`, `ext.data`, `instl`, `rwdd`) are passed through unchanged.
