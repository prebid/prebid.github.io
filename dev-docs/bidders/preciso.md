---
layout: bidder
title: Preciso

description: Prebid Preciso Bid Adapter
gdpr_supported: true
gvl_id: 874
media_types: display
gdpr_supported: true
usp_supported: true
pbjs: true
pbs: true
biddercode: preciso
prebid_member: true
floors_supported: true
safeframes_ok: true
schain_supported: true
userIds: sharedId
deals_supported: false
pbs_app_supported: false
coppa_supported: true
sidebarType: 1
---

### Modules

SharedID: We need you to include SharedID module,which is used to get prebid user commonid.It can better differentiating users to bid on ads.

Example configuration:
``````javascript
pbjs.setConfig({
        userSync: {
          userIds: [{
            name: 'sharedId',
            storage: {
              name: '_sharedid',
              type: 'cookie',
              expires: 365
            }
          }],
          filterSettings: {
            iframe: {
              bidders: ['preciso'],
              filter: 'include'
            },
            image: {
              bidders: ['preciso'],
              filter: 'include'
            }
          }
        },enableTIDs: true
      });
``````
### Registration

The preciso Bidding adapter requires setup before beginning. Please contact us at tech@preciso.net

### Note
- Supports `display` format.
- Uses `OpenRTB` standard.

#### OpenRTB Parameters
The following table contains currently supported parameters we parse.

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                                   | Example           | Type           |
|--------------------|----------|---------------------------------------------------------------|-------------------|----------------|
| `bcat`             | optional | List of blocked advertiser categories (IAB)                   | `['IAB1-1']`      | `string array` |
| `badv`             | optional | Blocked Advertiser Domains                                    | `['example.com']` | `string array` |
| `wlang`            | optional | Allow List of languages for creatives using ISO-639-1-alpha-2 | `['fr', 'en']`    | `string array` |


Example configuration:
```javascript
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
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Numeric Publisher ID <br>(as provided by Preciso)  | `'123AB123'`    | `string` |
| `region`      | optional,recommended | 3 letter country code     | `'IND'` | `string` |
| `bidfloor`    | optional,recommended | Minimum bid for this impression expressed in CPM (USD)  | `0.01`        | `float`  |
| `pageType`    | optional, recommended  | Kind of content present in the page   | `'homepage'`          | `String`     |
| `bcat`        | optional | List of blocked advertiser categories (IAB)   | `['IAB1-1']`          | `string array`    |
| `badv`        | optional | Blocked Advertiser Domains| `'example.com'`   | `string array`| 

Notes:
- Preferred to provide the `bcat` and `badv` within the first party data (above). When both methods are provided, first party data values will be prioritized.

### Example Ad Unit

``````javascript
 var adUnits = [{
  code: 'your-unit-container-id',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [300,600]]
    }
  },
  bids: [{
    bidder: 'preciso',
    params: {
      publisherId: 'your-publisher-id',
      region: 'IND',
      pageType: 'news',// Optional
      bidfloor: 0.25, // Optional - default is 0.0
      bcat: ['IAB1-1'], // Optional - default is []
      badv: ['example.com']  // Optional - default is []
    }
  }]
}];
``````
=======
userIds: id5Id, identityLink, pubProvidedId
pbs_app_supported: true
coppa_supported: true
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Unique publisher ID | `'ABCDEF'`    | `string` |
| `region`      | required | Assigned region     | `'prebid-eu'` | `string` |
| `bidfloor`    | optional | Minimal CPM value   | `0.01`        | `float`  |
| `channel`     | optional | Inventory channel identifier, limited to 50 characters  | `Partner 1 - News`        | `string`  |


### ORTB Blocking
Preciso supports blocking advertisers in `badv` and categories in `bcat` parameters.
The blocked advertisers/categories list has no length limitation, but response timeout is more likely to occur as the number of entries grow.
Blocked advertisers list (`badv`) is an array of domains as strings.
Blocked categories list (`bcat`) is an array of IAB categories as strings.

For example:
#### Globally defined ORTB Blocking:
```javascript
pbjs.setConfig({
  ortb2: {
    badv: ["domain1.com", "domain2.com"],
    bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
  }
)};
```
#### ORTB Blocking specific only to preciso bidder:
```javascript
pbjs.setBidderConfig({
  bidders: ['preciso'],
  config:{
    ortb2: {
      badv: ["domain1.com", "domain2.com"],
      bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
    }
  }
});
```
