---
layout: bidder
title: Adapex
description: Prebid Adapex Bidder Adapter
biddercode: adapex
pbjs: true
pbs: true
pbs_app_supported: true
media_types: banner, video, native
safeframes_ok: true
sidebarType: 1
tcfeu_supported: true
dsa_supported: true
gvl_id: 1609
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
deals_supported: true
floors_supported: true
fpd_supported: true
userIds: all
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
---

## Note

The Adapex bidder adapter connects publishers to the Adapex programmatic exchange over OpenRTB 2.x and supports banner, video and native. Contact <prebid@adapex.io> to set up an account and obtain a seat.

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seat` | required | Seat identifier provided by Adapex | `"testSeat"` | `string` |
| `bidFloor` | optional | Static floor (CPM) when `ortb2Imp` sets no floor, no Floors API applies and floor signaling is not suppressed | `0.5` | `number` |
| `bidFloorCur` | optional | Currency of `bidFloor` (default: `USD`) | `"USD"` | `string` |

Bid requests are sent to `https://hb.adapex.io/pbjs?seat={seat}`, one request per distinct seat. Parameter and configuration types are exported from `prebid.js/modules/adapexBidAdapter` for publishers using TypeScript.

## Prebid Server

The Adapex adapter is available in Prebid Server Go (`prebid-server`) and Prebid Server Java (`prebid-server-java`) as an alias of the Floxis adapter, and also supports audio there. Requests are sent to `https://hb.adapex.io/pbs?seat={seat}`, one request per seat. User sync uses the standard Prebid Server cookie-sync mechanism via `https://sync.adapex.io/sync`.

## Prebid Server Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seat` | required | Seat identifier provided by Adapex | `"testSeat"` | `string` |

## Error and Timeout Telemetry

By default, the adapter sends cookieless `keepalive` beacons to `https://sync.adapex.io/event` for auction timeouts and bidder transport errors. They contain the seat, region label, event type and available operational fields (HTTP status, timeout flag, duration and publisher domain). Error beacons also carry consent signals when available; timeout beacons carry none. They contain no user, device or auction identifier and are deduplicated per seat per event.

Publishers can disable these beacons. Bidding and user sync continue to operate independently:

```javascript
pbjs.setConfig({ adapex: { enableTelemetry: false } });
```

For split requests, errors are reported only for the seat identified by the failed response URL. If a network failure provides no URL and multiple seats were requested, the error beacon is omitted.

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

When `filterSettings.all` is configured, that rule must allow `adapex`; `all` cannot be combined with `iframe` or `image` filters.

## First-Party Fallback Id (Storage Use)

The adapter can maintain a first-party fallback identifier: a random v4 UUID stored under the key `adpx_uid` in `localStorage` (preferred) and a cookie (~30-day lifetime), both scoped to the publisher's own origin. The id is per-publisher, never shared across sites, and is sent as `user.ext.wlid`.

All storage access goes through the Prebid.js `storageManager`, so it is gated by the standard `deviceAccess` configuration and GDPR purpose-1 consent under GVL ID 1609. Bidder-level storage access is denied by default and requires an explicit publisher opt-in; without it no stored fallback id is read or generated:

```javascript
pbjs.bidderSettings = {
    adapex: {
        storageAllowed: true
    }
};
```

Sending the fallback identifier also requires both `transmitEids` and `transmitUfpd` activity controls to allow it. If either is denied, the adapter omits both custom identifiers (`user.ext.wlid` and `user.ext.floxisId`), including publisher-supplied values, and does not access fallback storage or generate an identifier. Storage permission alone does not enable transmission. On a CMP data-deletion request (`registerDeletion`, forwarded by Prebid.js core), the adapter attempts to remove both stored copies of `adpx_uid`. Deletion uses Prebid's ordinary storage controls and can be blocked if storage access has already been withdrawn.

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

For outstream video, the publisher must provide a renderer through `mediaTypes.video.renderer`.

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
