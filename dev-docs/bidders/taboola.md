---
layout: bidder
title: Taboola
description: Prebid Taboola Bidder Adapter
pbjs: true
pbs: true
biddercode: taboola
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: false
dchain_supported: true
media_types: banner
gvl_id: 42
prebid_member: true
floors_supported: true
safeframes_ok: true
fpd_supported: true
ortb_blocking_supported: partial
deals_supported: false
pbs_app_supported: true
multiformat_supported: will-not-bid
sidebarType: 1
---

### Note

- Prebid.js Supports `display` format only.
- Prebid Server Supports `native+display` formats.
- Uses `OpenRTB` standard.

### Bidder Config
We recommend allowing us access to localStorage.
You can allow writing in localStorage `pbjs.bidderSettings` for the bidder `taboola`

{% include dev-docs/storageAllowed.md %}

```javascript
pbjs.bidderSettings = {
    taboola: {
        storageAllowed : true
    }
}
```

### Registration

The Taboola Adapter requires setup before beginning. Please contact us at <prebid@taboola.com>.

### Prebid Server

Please provide to your relevant Taboola contact person the prebid server host domain, so we enable it before the integration starts.

### First Party Data

Publishers can use the `ortb2` configuration parameter to provide First Party Data.

#### OpenRTB Parameters

The following table contains currently supported parameters we parse.

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                                   | Example           | Type           |
|--------------------|----------|---------------------------------------------------------------|-------------------|----------------|
| `bcat`             | optional | List of blocked advertiser categories (IAB)                   | `['IAB1-1']`      | `string array` |
| `badv`             | optional | Blocked Advertiser Domains                                    | `['example.com']` | `string array` |
| `wlang`            | optional | Allow List of languages for creatives using ISO-639-1-alpha-2 | `['fr', 'en']`    | `string array` |

Notes:

- will extract the page,ref,domain if passed within `ortb2.site`
- will extract the pageType if passed within the preferred field `ortb2.ext.data.pageType` or `ortb2.ext.data.section`

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

| Name              | Scope                  | Description                                                                                                                                                                                                                                    | Example               | Type         |
|-------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|--------------|
| `tagId`           | required               | Tag ID / Unique Placement Name <br>                                                                                                                                                                                                            | `'Below The Article'` | `String`     |
| `publisherId`     | required               | Numeric Publisher ID <br>(as provided by Taboola)                                                                                                                                                                                              | `'1234567'`           | `String`     |
| `pageType`        | optional, recommended  | Kind of content present in the page                                                                                                                                                                                                            | `'homepage'`          | `String`     |
| `position`        | optional, recommended  | Identify the placement position on screen. Possible values:  0 - 7  <br> <br>  0    Unknown <br> 1    Above The Fold <br> 2    Locked  (i.e., fixed position) <br> 3    Below The Fold <br> 4    Header <br> 5    Footer <br> 6    Sidebar <br> 7    Fullscreen <br>   | `2`                   | `Integer`    |
| `publisherDomain` | optional               | Publisher Domain (server-side adapter only)                                                                                                                                                                                                    | `'example.com'`       | `String`     |
| `bidfloor`        | optional               | CPM bid floor                                                                                                                                                                                                                                  | `0.25`                | `Float`      |
| `bcat`            | optional               | List of blocked advertiser categories (IAB)                                                                                                                                                                                                    | `['IAB1-1']`          | `Array`      |
| `badv`            | optional               | Blocked Advertiser Domains                                                                                                                                                                                                                     | `'example.com'`       | `String Url` |

Notes:

- Preferred to provide the `bcat` and `badv` within the first party data (above). When both methods are provided, first party data values will be prioritized.
- If `pageType` or `publisherDomain` provided within the first party data (as explained above), first party data properties will be prioritized.
- `tagId` is an identifier for specific ad placement, and should be the same unique `tagId` per placement/ad unit in all Bid Requests.

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
      pageType: 'news',// Optional
      position: 6,// Optional
      bidfloor: 0.25, // Optional - default is null
      bcat: ['IAB1-1'], // Optional - default is []
      badv: ['example.com']  // Optional - default is []
    }
  }]
}];
```
