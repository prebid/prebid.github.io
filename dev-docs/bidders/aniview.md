---
layout: bidder
title: Aniview
description: Prebid Aniview Bidder Adapter
pbjs: true
biddercode: aniview
media_types: banner, video
tcfeu_supported: true
floors_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: true
gvl_id: 780
sidebarType: 1
---

### Note

For more information about [Aniview Ad Server](https://www.aniview.com/), please contact <info@aniview.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                      | Type     |
|------------------|----------|------------------|------------------------------|----------|
| `AV_PUBLISHERID` | required | Publisher/Netid  | `'55b88d4a181f465b3e8b4567'` | `string` |
| `AV_CHANNELID`   | required | Channel id       | `'5a5f17a728a06102d14c2718'` | `string` |
| `playerDomain`   | optional | Player domain    | `'www.example.com'`          | `string` |
| `replacements`   | optional | Replacements     | `{ AV_CDIM1: "123" }`        | `object` |

### Setup for Video

```javascript
const adUnit = [{
  code: 'videoAdUnit',
  mediaTypes: {
    video: {
      // Required
      playerSize: [[640, 480]],
      context: 'outstream',
      mimes: ['video/mp4', 'video/mpeg'],
      
      // Optional
      playbackmethod: [1, 2],
      protocols: [1, 2, 3, 5, 6, 7, 8],
      api: [1, 2],
      maxduration: 60,
      plcmt: 2,
    },
  },
  bids: [{
    bidder: 'aniview',
    params: {
      // Required
      AV_PUBLISHERID: '55b78633181f4603178b4568',
      AV_CHANNELID: '5d19dfca4b6236688c0a2fc4',
        
      // Optional
      playerDomain: 'www.example.com',
      replacements: { 
        AV_CDIM1: "123",
        AV_CDIM2: "321",
      }
    }
  }]
}];
```

### Setup for Banner

```javascript
const adUnit = [{
  code: 'bannerAdUnit',
  mediaTypes: {
    banner: {
      // Required
      sizes: [[300, 250], [300, 600]],
    },
  },
  bids: [{
    bidder: 'aniview',
    params: {
      // Required
      AV_PUBLISHERID: '55b78633181f4603178b4568',
      AV_CHANNELID: '5d19dfca4b6236688c0a2fc4'
    }
  }]
}];
```

### Setup for Multi-format (Banner & Video)

```javascript
const adUnit = [{
  code: 'multiformatAdUnit',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [300, 600]],
    },
    video: {
      playerSize: [[640, 480]],
      context: 'outstream',
      mimes: ['video/mp4', 'video/mpeg'],
    },
  },
  bids: [{
    bidder: 'aniview',
    params: {
      AV_PUBLISHERID: '55b78633181f4603178b4568',
      AV_CHANNELID: '5d19dfca4b6236688c0a2fc4'
    }
  }]
}];
```

### Floors

```javascript
const adUnit = [{
  code: 'floorsAdUnit',
  mediaTypes: {/*...*/},
  bids: [/*...*/],
  floors: {
    currency: 'USD',
    schema: {
      delimiter: '|',
      fields: ['mediaType', 'size'],
    }, 
    values: {
      'banner|300x250': 0.1,
      'banner|*': 0.05,
      'video|640x360': 0.5,
      'video|*': 0.25,
    },
  },
}];
```

### Configs

```javascript
pbjs.setConfig({
  currency: { adServerCurrency: 'USD' },
  
  // User ID module
  userSync: {
    userIds: [
      {
        name: 'id5Id',
        storage: {
          type: 'html5',
          name: 'id5id',
          expires: 90,
          refreshInSeconds: 8 * 3600,
        },
      },
    ],
      
    // Cookie sync (Image & Iframe)
    filterSettings: {
      all: {
        bidders: '*',
        filter: 'include',
      },
    },
  },
    
  // See: https://docs.prebid.org/dev-docs/modules/floors.html#in-page-interface
  floors: {},
    
  // See: https://docs.prebid.org/features/firstPartyData.html#supplying-global-data
  ortb2: {
    badv: ["test1.com", "test2.com"],
    bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"],
    bapp: ["com.foo.mygame"],

    // At most, only one of wseat and bseat should be used in the same request.
    // Omission of both implies no seat restrictions.
    wseat: ["Agency1"],
    bseat: ["Agency2", "Agency3"],
  },
});
```

### Bidder configs

```javascript
pbjs.setBidderConfig({
  bidders: ['aniview'],
  config: {
    ortb2: {
      ext: {
        aniview: {
          // Set replacements for the `aniview` bidder
          replacements: {
            AV_CDIM1: "dimension1",
          },
        }
      }
    }
  }
}, true);
```