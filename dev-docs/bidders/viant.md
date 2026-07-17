---
layout: bidder
title: Viant
description: Prebid Viant Bidder Adapter
biddercode: viantOrtb
media_types: banner, video, native, audio
tcfeu_supported: true
coppa_supported: true
usp_supported: true
gpp_supported: false
schain_supported: true
userId: uid2, unifiedId
pbjs: true
prebid_member: true
dchain_supported: false
safeframes_ok: false
deals_supported: true
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
gvl_id: 1542
pbs: true
multiformat_supported: true
sidebarType: 1
pbs_app_supported: true

---

## Registration

If you have any questions regarding set up, please reach out to your Viant account manager: <dist-vps@viantinc.com>.

Please note that Viant Publisher Solutions has transitioned its serving architecture to Prebid Server. The Prebid.js Module is now legacy, and only the Prebid Server integration is active.

To activate an account, publishers must already have an approved Viant Publisher Solutions (VPS) login and an active `publisherId` in order for the adapter to function appropriately.

All other configurations occur within the VPS self-service environment.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                           | Example                  | Type     |
|---------------|----------|-------------------------------------------------------|--------------------------|----------|
| `publisherId` | required | Publisher ID assigned by Viant during onboarding.     | `'prebid-test-pub-001'`  | `string` |

## Example Ad Unit

### Banner

```javascript
var adUnits = [
  {
    code: 'banner-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [728, 90]]
      }
    },
    bids: [
      {
        bidder: 'viant',
        params: {
          publisherId: 'your-publisher-id'
        }
      }
    ]
  }
];
```

### Video (Instream)

```javascript
var adUnits = [
  {
    code: 'video-div',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [640, 480],
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6],
        maxduration: 30
      }
    },
    bids: [
      {
        bidder: 'viant',
        params: {
          publisherId: 'your-publisher-id'
        }
      }
    ]
  }
];
```

### Native

```javascript
var adUnits = [
  {
    code: 'native-div',
    mediaTypes: {
      native: {
        ortb: {
          assets: [
            {
              id: 1,
              required: 1,
              title: { len: 90 }
            },
            {
              id: 2,
              required: 1,
              img: { type: 3, w: 300, h: 250 }
            }
          ]
        }
      }
    },
    bids: [
      {
        bidder: 'viant',
        params: {
          publisherId: 'your-publisher-id'
        }
      }
    ]
  }
];
```

### Audio

```javascript
var adUnits = [
  {
    code: 'audio-div',
    mediaTypes: {
      audio: {
        mimes: ['audio/aac', 'audio/mpeg', 'audio/mp3'],
        protocols: [2, 3, 5, 6, 7, 8],
        minduration: 1,
        maxduration: 90,
        startdelay: -2
      }
    },
    bids: [
      {
        bidder: 'viant',
        params: {
          publisherId: 'your-publisher-id'
        }
      }
    ]
  }
];
```
