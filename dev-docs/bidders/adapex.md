---
layout: bidder
title: Adapex
description: Prebid Adapex Bidder Adapter
biddercode: adapex
pbjs: true
pbs: true
pbs_app_supported: true
media_types: banner, video, native, audio
safeframes_ok: true
sidebarType: 1
tcfeu_supported: true
dsa_supported: false
gvl_id: 1609
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
deals_supported: false
floors_supported: true
fpd_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
---

## Note

The Adapex bidder adapter connects publishers to the Adapex programmatic exchange over OpenRTB 2.x. Prebid.js supports banner, video and native; Prebid Server also supports audio. Contact <prebid@floxis.tech> to set up an account and obtain a seat.

## Prebid.js Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seat` | required | Seat identifier provided by Adapex | `"testSeat"` | `string` |
| `bidFloor` | optional | Static floor (CPM), used only when the Floors Module is not in the build | `0.5` | `number` |
| `bidFloorCur` | optional | Currency of `bidFloor` (default: `USD`) | `"USD"` | `string` |

Bid requests are sent to `https://hb.adapex.io/pbjs?seat={seat}`, one request per distinct seat.

## Prebid Server

The Prebid Server adapter (Go and Java) sends requests to `https://hb.adapex.io/pbs`. User sync uses the standard Prebid Server cookie-sync mechanism via `https://sync.adapex.io/sync`.

## Prebid Server Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seat` | required | Seat identifier provided by Adapex | `"testSeat"` | `string` |

## Floors Support

The adapter supports the Prebid.js [Floors Module](https://docs.prebid.org/dev-docs/modules/floors.html). Floor values are sent in the OpenRTB request as `imp.bidfloor` and `imp.bidfloorcur`.

## Privacy Support

Privacy signals (GDPR/TCF EU, US Privacy, GPP, COPPA) are provided by Prebid.js core / Prebid Server and forwarded on the OpenRTB request, and consent strings are appended to user-sync calls. The adapter declares IAB TCF EU vendor ID 1609.

## User Sync

Iframe and image syncs are both supported. An iframe sync matches more demand partners per call; enable it for the adapter:

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ['adapex'],
                filter: 'include'
            }
        }
    }
});
```

If `filterSettings.all` is already configured, iframe syncs are already enabled and the block above should not be added.

## First-Party Fallback Id (Storage Use)

In browsers that block third-party cookies, the Prebid.js adapter maintains a first-party fallback identifier: a random v4 UUID stored under the key `adpx_uid` in `localStorage` (preferred) and a cookie (~30-day lifetime), both scoped to the publisher's own origin. The id is per-publisher, never shared across sites, and is sent as `user.ext.floxisId`. It is used only when the exchange's own cookie is unavailable.

All storage access goes through the Prebid.js `storageManager`, so it is gated by the standard `deviceAccess` configuration and GDPR purpose-1 consent under GVL ID 1609. Bidder-level storage access is denied by default and requires an explicit publisher opt-in; without it no id is generated or sent:

```javascript
pbjs.bidderSettings = {
    adapex: {
        storageAllowed: true
    }
};
```

## AdUnit Configuration for Banner

```javascript
var adUnits = [{
    code: 'banner-ad-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'adapex',
        params: {
            seat: 'testSeat'
        }
    }]
}];
```

## AdUnit Configuration for Video

```javascript
var adUnits = [{
    code: 'video-ad-div',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [[640, 480]],
            mimes: ['video/mp4'],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30
        }
    },
    bids: [{
        bidder: 'adapex',
        params: {
            seat: 'testSeat'
        }
    }]
}];
```

## AdUnit Configuration for Native

```javascript
var adUnits = [{
    code: 'native-ad-div',
    mediaTypes: {
        native: {
            title: {
                required: true,
                len: 80
            },
            body: {
                required: true
            },
            image: {
                required: true,
                sizes: [150, 50]
            },
            sponsoredBy: {
                required: true
            }
        }
    },
    bids: [{
        bidder: 'adapex',
        params: {
            seat: 'testSeat'
        }
    }]
}];
```
