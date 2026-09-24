---
layout: bidder
title: Floxis
description: Prebid Floxis Bidder Adapter
biddercode: floxis
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

The Floxis bidder adapter enables integration with the Floxis programmatic advertising platform. It supports banner, video, and native formats with OpenRTB 2.x compliance via Prebid.js, and banner, video, native, and audio via Prebid Server. Please contact Floxis at <prebid@floxis.tech> to set up your account and obtain the required parameters.

## Prebid.js Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seat` | required | Seat identifier provided by Floxis | `"testSeat"` | `string` |
| `region` | optional | Routing region: `us-e`, `eu`, or `apac` (default: `us-e`) | `"us-e"` | `string` |
| `partner` | optional | Partner identifier (default: `floxis`) | `"floxis"` | `string` |

## Prebid Server

The Floxis Prebid Server adapter is available in both Go (`prebid-server`) and Java (`prebid-server-java`). The server-side endpoint follows the pattern `https://{region}.floxis.tech/pbs`, where `{region}` is one of `us-e`, `eu`, or `apac` (default: `us-e`). When a non-default `partner` is configured, the region host is prefixed accordingly (`https://{partner}-{region}.floxis.tech/pbs`). User-sync is handled via the standard Prebid Server cookie-sync mechanism. For setup assistance contact <prebid@floxis.tech>.

## Prebid Server Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seat` | required | Seat identifier provided by Floxis | `"testSeat"` | `string` |
| `region` | optional | Routing region: `us-e`, `eu`, or `apac` (default: `us-e`) | `"us-e"` | `string` |
| `partner` | optional | Partner identifier (default: `floxis`) | `"floxis"` | `string` |

## Floors Support

The Floxis adapter supports the Prebid.js [Floors Module](https://docs.prebid.org/dev-docs/modules/floors.html). Floor values are automatically included in the OpenRTB request as `imp.bidfloor` and `imp.bidfloorcur`.

## Privacy Support

Privacy signals (GDPR/TCF EU, US Privacy, GPP, COPPA) are provided by Prebid.js core / Prebid Server and forwarded on the OpenRTB request. The Floxis exchange enforces IAB TCF EU vendor consent (GVL ID 1609) and honors US Privacy and GPP US national/state opt-out signals.

## First-Party Fallback Id (Storage Use)

In browsers that block third-party cookies, the Prebid.js adapter maintains a first-party fallback identifier: a random v4 UUID stored under the key `flx_uid` in `localStorage` (preferred) and a cookie (~30-day lifetime), both scoped to the publisher's own origin. The id is per-publisher — it is never shared across sites — and is sent as `user.ext.floxisId`. It is used only as an identity of last resort when the Floxis `__fxId` cookie is unavailable. Storage details are disclosed at [floxis.tech/vendor-storage.json](https://floxis.tech/vendor-storage.json).

All storage access goes through the Prebid.js `storageManager`, so it is gated by the standard `deviceAccess` configuration and GDPR purpose-1 consent under GVL ID 1609. Bidder-level storage access is denied by default and requires an explicit publisher opt-in — without it, no id is generated or sent (a safe no-op):

```javascript
pbjs.bidderSettings = {
    floxis: {
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
        bidder: 'floxis',
        params: {
            seat: 'testSeat',
            region: 'us-e',
            partner: 'floxis'
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
        bidder: 'floxis',
        params: {
            seat: 'testSeat',
            region: 'us-e',
            partner: 'floxis'
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
        bidder: 'floxis',
        params: {
            seat: 'testSeat',
            region: 'us-e',
            partner: 'floxis'
        }
    }]
}];
```

## Example

```javascript
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits([{
        code: 'div-gpt-ad-1234567890123-0',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [320, 50]]
            }
        },
        bids: [{
            bidder: 'floxis',
            params: {
                seat: 'testSeat',
                region: 'us-e',
                partner: 'floxis'
            }
        }]
    }]);

    pbjs.requestBids({
        timeout: 3000,
        bidsBackHandler: function(bidResponses) {
            // Handle bid responses
            pbjs.setTargetingForGPTAsync();
        }
    });
});
```
