---
layout: bidder
title: MonetiseUp (Mul)
description: Prebid MonetiseUp (Mul) Bidder Adapter
biddercode: mul
pbjs: true
pbs: false
media_types: banner, video
gpp_sids: tcfeu, usstate_all, usp
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
fpd_supported: true
safeframes_ok: true
multiformat_supported: will-bid-on-any
userIds: all
sidebarType: 1
---

The MonetiseUp (`mul`) adapter connects publishers directly to MonetiseUp's programmatic advertising marketplace, aggregating demand from top programmatic SSPs and DSPs including Adagio, PubMatic, OpenX, 152Media, Nobid, OnlineMediaSolutions, Scalibur, TripleLift, Eskimi, and Equativ. It supports both banner and video (instream and outstream) ad formats through OpenRTB protocol.

To begin monetizing your inventory, contact [business@responsiq.com](mailto:business@responsiq.com).

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                   | Example            | Type     |
|---------------|----------|-----------------------------------------------|--------------------|----------|
| `placementId` | required | Your MonetiseUp placement or inventory tag ID | `'placement-123'`  | `string` |
| `zoneId`      | optional | Alternative zone identifier                   | `'zone-456'`       | `string` |
| `bidfloor`    | optional | Fallback minimum CPM for the impression       | `0.50`             | `float`  |
| `bidfloorcur` | optional | Currency for the bid floor                    | `'USD'`            | `string` |

## Test Parameters

### Banner Ad Unit

```javascript
var adUnits = [
  {
    code: 'test-banner-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [728, 90], [320, 50]]
      }
    },
    bids: [
      {
        bidder: 'mul',
        params: {
          placementId: 'test-placement-123'
        }
      }
    ]
  }
];
```

### Video Ad Unit

```javascript
var adUnits = [
  {
    code: 'test-video-div',
    mediaTypes: {
      video: {
        playerSize: [[640, 480]],
        context: 'instream',
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6],
        minduration: 5,
        maxduration: 30,
        startdelay: 0,
        playbackmethod: [1, 2],
        api: [1, 2]
      }
    },
    bids: [
      {
        bidder: 'mul',
        params: {
          placementId: 'test-placement-123'
        }
      }
    ]
  }
];
```

### Multi-Format Ad Unit

```javascript
var adUnits = [
  {
    code: 'test-multiformat-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [728, 90]]
      },
      video: {
        playerSize: [[640, 480]],
        context: 'instream',
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6],
        minduration: 5,
        maxduration: 30
      }
    },
    bids: [
      {
        bidder: 'mul',
        params: {
          placementId: 'test-placement-123'
        }
      }
    ]
  }
];
```

## Video Support

The MonetiseUp adapter supports Video ads via both direct VAST XML (`vastXml`) and VAST URLs (`vastUrl`). Video ads support standard IAB video parameters including instream and outstream player configurations.

## First Party Data (FPD)

The adapter supports First Party Data (FPD) in multiple ways:
- **Global FPD**: Automatically includes `pbjs.setConfig({ortb2: {...}})` site and user segment data.
- **User IDs (EIDs)**: Automatically forwards external identifiers provided by Prebid User ID modules (`user.ext.eids`).
- **Supply Chain**: Forwards `source.ext.schain` for transparent supply chain validation.
- **Global Placement ID (GPID)**: Automatically extracts `ortb2Imp.ext.gpid` for ad server targeting.

## User Sync

The MonetiseUp adapter supports user synchronization to maximize bid yield:
- **Client-Side**: Supports `iframe` and `image` syncs.
- All privacy parameters (`gdpr`, `gdpr_consent`, `us_privacy`, `gpp`, `gpp_sid`) are automatically attached to sync requests.

### Configuration Example

```javascript
pbjs.que.push(function() {
  pbjs.addAdUnits(adUnits);

  pbjs.setConfig({
    debug: true,
    userSync: {
      filterSettings: {
        iframe: {
          bidders: ['mul'],
          filter: 'include'
        },
        image: {
          bidders: ['mul'],
          filter: 'include'
        }
      }
    }
  });

  pbjs.requestBids({
    bidsBackHandler: function(bidResponses) {
      console.log('Auction completed', bidResponses);
    }
  });
});
```
