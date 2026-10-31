---
layout: bidder
title: VDO.AI
description: Prebid vdo.ai Bidder Adaptor
biddercode: vdoai
pbjs: true
pbs: false
pbs_app_supported: false
media_types: video, banner
userIds: all
fpd_supported: true
tcfeu_supported: true
usp_supported: true
gvl_id: 1561
coppa_supported: true
schain_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
sidebarType: 1
---

## Before you begin

Your VDO.AI account manager provides your `publisherId`, your `host`, and one `adUnitId` per placement you want to monetize. If you don't have these yet, ask your account manager to create your sites and ad units.

Prebid.js 11.39 or later is recommended, as it includes the VDO.AI GVL ID (1561) used for TCF enforcement. Build Prebid.js with `vdoaiBidAdapter` plus the consent and user ID modules you use, for example:

```bash
gulp build --modules=vdoaiBidAdapter,consentManagementTcf,consentManagementUsp,consentManagementGpp,userId
```

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                                                                                                         | Example               | Type               |
| :------------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------- | :----------------- |
| `host`        | required | VDO.AI RTB host, provided at onboarding                                                                                                                             | `'ortb.vdo.ai'`       | `string`           |
| `publisherId` | required | Your VDO.AI publisher ID                                                                                                                                            | `'your-publisher-id'` | `string`           |
| `adUnitId`    | required | The ad unit ID for this placement, generated on the VDO.AI platform                                                                                                 | `'au_1a2b3c4d'`       | `string / integer` |
| `adUnitType`  | required | Type of ad unit (`'banner'` or `'video'`)                                                                                                                           | `'banner'`            | `string`           |
| `bidfloor`    | optional | Minimum bid floor in USD. If the Price Floors module is configured, its floor takes precedence. If no floor is set, your ad unit or account floor on VDO.AI applies | `1.5`                 | `float`            |
| `custom1`     | optional | Free-form passthrough value surfaced in VDO.AI reporting                                                                                                            | `'section:sports'`    | `string`           |
| `custom2`     | optional | Free-form passthrough value surfaced in VDO.AI reporting                                                                                                            | `'custom2'`           | `string`           |
| `custom3`     | optional | Free-form passthrough value surfaced in VDO.AI reporting                                                                                                            | `'custom3'`           | `string`           |
| `custom4`     | optional | Free-form passthrough value surfaced in VDO.AI reporting                                                                                                            | `'custom4'`           | `string`           |
| `custom5`     | optional | Free-form passthrough value surfaced in VDO.AI reporting                                                                                                            | `'custom5'`           | `string`           |

The Prebid.js adapter supports only `banner` and `video` media types, and does not support `audio` or `native`.

## Banner Example

```javascript
var adUnits = [{
  code: 'div-gpt-ad-leaderboard',
  mediaTypes: {
    banner: {
      sizes: [[728, 90], [970, 250]]
    }
  },
  bids: [{
    bidder: 'vdoai',
    params: {
      host: 'ortb.vdo.ai',
      publisherId: 'your-publisher-id',
      adUnitId: 'au_1a2b3c4d',
      adUnitType: 'banner',
      custom1: 'section:sports'
    }
  }]
}];
```

## Video Example

```javascript
var videoAdUnits = [{
  code: 'video-div',
  mediaTypes: {
    video: {
      context: 'outstream',
      playerSize: [[640, 480]],
      mimes: ['video/mp4'],
      protocols: [2, 3, 5, 6],
      plcmt: 4
    }
  },
  bids: [{
    bidder: 'vdoai',
    params: {
      host: 'ortb.vdo.ai',
      publisherId: 'your-publisher-id',
      adUnitId: 'au_5e6f7a8b',
      adUnitType: 'video'
    }
  }]
}];
```

Fields set on `mediaTypes.video` (such as `mimes`, `protocols` and `plcmt`) are forwarded to VDO.AI.

For `outstream` video, the publisher must provide a renderer on the ad unit (`renderer` or `mediaTypes.video.renderer`); the VDO.AI adapter does not supply one.

For `instream` video served through Google Ad Manager, enable Prebid Cache so the VAST XML can be stored and retrieved:

```javascript
pbjs.setConfig({
  cache: {
    url: 'https://prebid.example.com/pbc/v1/cache'
  }
});
```

## Multi-format Ad Units

VDO.AI bids only on the media type set in `adUnitType`. On a multi-format ad unit, set `adUnitType` to the format you want VDO.AI to bid on.

## User Sync

VDO.AI uses iframe and image user syncs. To allow VDO.AI iframe syncs while keeping image syncs enabled for all bidders:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['vdoai'],
        filter: 'include'
      },
      image: {
        bidders: '*',
        filter: 'include'
      }
    }
  }
});
```
