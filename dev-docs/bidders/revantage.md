---
layout: bidder
title: Revantage
description: Prebid Revantage Bidder Adapter
biddercode: revantage
tcfeu_supported: true
gvl_id: none
usp_supported: true
gpp_supported: true
coppa_supported: false
schain_supported: true
dchain_supported: false
userId: all
media_types: banner, video
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sideload_disabled: false
---

### Registration

To use the Revantage adapter, you need to register for an account and obtain a Feed ID. Please contact [adops@revantage.io](mailto:adops@revantage.io) to get started.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                   | Example              | Type     |
|---------------|----------|-----------------------------------------------|----------------------|----------|
| `feedId`      | required | Unique identifier for your feed configuration | `'abc123xyz'`        | `string` |

### Banner Configuration

Revantage supports standard banner ad units. The adapter will automatically use the sizes defined in your ad unit configuration.
```javascript
var adUnits = [
  {
    code: 'banner-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600], [728, 90]]
      }
    },
    bids: [
      {
        bidder: 'revantage',
        params: {
          feedId: 'your-feed-id'
        }
      }
    ]
  }
];
```

### Video Configuration

Revantage supports instream and outstream video. The following video parameters are supported:

{: .table .table-bordered .table-striped }
| Name             | Scope       | Description                                      | Example                  | Type            |
|------------------|-------------|--------------------------------------------------|--------------------------|-----------------|
| `playerSize`     | required    | Video player dimensions                          | `[[640, 480]]`           | `array`         |
| `mimes`          | recommended | Supported video MIME types                       | `['video/mp4']`          | `array<string>` |
| `protocols`      | recommended | Supported VAST protocols                         | `[2, 3, 5, 6]`           | `array<int>`    |
| `api`            | optional    | Supported API frameworks                         | `[1, 2]`                 | `array<int>`    |
| `placement`      | optional    | Video placement type (1=instream, 2=outstream)   | `1`                      | `int`           |
| `minduration`    | optional    | Minimum video duration in seconds                | `5`                      | `int`           |
| `maxduration`    | optional    | Maximum video duration in seconds                | `30`                     | `int`           |
| `skip`           | optional    | Whether video is skippable (0=no, 1=yes)         | `1`                      | `int`           |
| `skipmin`        | optional    | Minimum duration before skip is allowed          | `5`                      | `int`           |
| `skipafter`      | optional    | Seconds until skip button appears                | `5`                      | `int`           |
| `startdelay`     | optional    | Start delay (0=pre-roll, -1=mid-roll, -2=post)   | `0`                      | `int`           |
| `playbackmethod` | optional    | Playback methods                                 | `[1, 2]`                 | `array<int>`    |
| `linearity`      | optional    | Linearity (1=linear, 2=non-linear)               | `1`                      | `int`           |

#### Video Example
```javascript
var adUnits = [
  {
    code: 'video-div',
    mediaTypes: {
      video: {
        playerSize: [[640, 480]],
        context: 'instream',
        mimes: ['video/mp4', 'video/webm'],
        protocols: [2, 3, 5, 6],
        api: [1, 2],
        placement: 1,
        minduration: 5,
        maxduration: 30,
        skip: 1,
        skipmin: 5,
        skipafter: 5
      }
    },
    bids: [
      {
        bidder: 'revantage',
        params: {
          feedId: 'your-feed-id'
        }
      }
    ]
  }
];
```

### User Syncing

Revantage supports both iframe and pixel-based user syncing. Enable user syncing in your Prebid.js configuration:
```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['revantage'],
        filter: 'include'
      },
      image: {
        bidders: ['revantage'],
        filter: 'include'
      }
    },
    syncsPerBidder: 1,
    syncDelay: 3000
  }
});
```

### Privacy Support

Revantage fully supports the following privacy frameworks:

- **GDPR (TCF 2.0)**: The adapter reads consent data from the `gdprConsent` object and passes it to the bidding endpoint.
- **US Privacy (CCPA)**: The adapter reads the USP consent string and includes it in bid requests.
- **GPP**: Global Privacy Platform consent strings and applicable sections are supported.

### First Party Data

Revantage supports First Party Data via the standard `ortb2` configuration:
```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      name: 'Example Site',
      domain: 'example.com',
      cat: ['IAB1'],
      content: {
        language: 'en'
      }
    },
    user: {
      data: [
        {
          name: 'example.com',
          ext: {
            segtax: 600
          },
          segment: [
            { id: '1' },
            { id: '2' }
          ]
        }
      ]
    }
  }
});
```

### Price Floors

Revantage supports the [Prebid.js Price Floors Module](https://docs.prebid.org/dev-docs/modules/floors.html). Configure floors as usual and the adapter will include floor data in bid requests.
```javascript
pbjs.setConfig({
  floors: {
    enforcement: {
      floorDeals: true
    },
    data: {
      currency: 'USD',
      schema: {
        fields: ['mediaType', 'size']
      },
      values: {
        'banner|300x250': 0.50,
        'banner|728x90': 0.75,
        'video|640x480': 2.00
      }
    }
  }
});
```

### Supply Chain (schain)

Revantage passes supply chain information to demand partners. Configure schain in your Prebid.js setup:
```javascript
pbjs.setConfig({
  schain: {
    validation: 'relaxed',
    config: {
      ver: '1.0',
      complete: 1,
      nodes: [
        {
          asi: 'yoursite.com',
          sid: 'your-seller-id',
          hp: 1
        }
      ]
    }
  }
});
```

### User ID Modules

Revantage supports all Prebid.js User ID modules. User IDs are automatically passed in the bid request when available.

### Test Parameters

Use these parameters to test the Revantage adapter:
```javascript
var adUnits = [
  {
    code: 'test-banner',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: 'revantage',
        params: {
          feedId: 'test-feed-123'
        }
      }
    ]
  }
];
```
