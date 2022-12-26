---
layout: bidder
title: Taboola
description: Prebid Taboola Bidder Adapter
pbjs: true
pbs: true
biddercode: taboola
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: false
media_types: banner
gvl_id: 42
prebid_member: true
floors_supported: true
safeframes_ok: true
fpd_supported: true
ortb_blocking_supported: partial
deals_supported: false
sidebarType: 1
---

### Note
- Supports `display` format.
- Uses `OpenRTB` standard.

### Registration

The Taboola Adapter requires setup before beginning. Please contact us at prebid@taboola.com.

### First Party Data
Publishers can use the `ortb2` configuration parameter to provide First Party Data.

#### OpenRTB Parameters
The following table contains currently supported parameters.

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                                   | Example           | Type           |
|--------------------|----------|---------------------------------------------------------------|-------------------|----------------|
| `bcat`             | optional | List of blocked advertiser categories (IAB)                   | `['IAB1-1']`      | `string array` |
| `badv`             | optional | Blocked Advertiser Domains                                    | `['example.com']` | `string array` |
| `wlang`            | optional | Allow List of languages for creatives using ISO-639-1-alpha-2 | `['fr', 'en']`    | `string array` |

Example configuration:
```
pbjs.setConfig({
    ortb2: {
      bcat: ['IAB1-1'],
      badv: ['example.com'],
      wlang: ['fr', 'en']
    }
});
```


### Bid Params

{: .table .table-bordered .table-striped }

| Name              | Scope    | Description                                       | Example               | Type         |
|-------------------|----------|---------------------------------------------------|-----------------------|--------------|
| `tagId`           | required | Tag ID / Placement Name <br>                      | `'Below The Article'` | `String`     |
| `publisherId`     | required | Numeric Publisher ID <br>(as provided by Taboola) | `'1234567'`           | `String`     |
| `publisherDomain` | optional | Publisher Domain (server-side adapter only)       | `'example.com'`       | `String`     |
| `bidfloor`        | optional | CPM bid floor                                     | `0.25`                | `Float`      |
| `bcat`            | optional | List of blocked advertiser categories (IAB)       | `['IAB1-1']`          | `Array`      |
| `badv`            | optional | Blocked Advertiser Domains                        | `'example.com'`       | `String Url` |

Note: Preferred to provide the `bcat` and `badv` within the first party data (above). When both methods are provided, first party data values will be prioritized. 

### Example Ad Unit
```javascript
 var adUnits = [{
  code: 'your-unit-container-id',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [300,600]]
    }
  },
  bids: [{
    bidder: 'taboola',
    params: {
      tagId: 'Placement Name',
      publisherId: 'your-publisher-id',
      publisherDomain: 'example.com',// Optional (server-side adapter only)
      bidfloor: 0.25, // Optional - default is null
      bcat: ['IAB1-1'], // Optional - default is []
      badv: ['example.com']  // Optional - default is []
    }
  }]
}];
```
