---
layout: page_v2
title: SemantIQ RTD module
display_name : SemantIQ
description: SemantIQ RTD module allows to retrieve real-time data from the SemantIQ service.
page_type: module
module_type: rtd
module_code: semantiqRtdProvider
enable_download: true
sidebarType: 1
vendor_specific: true

---

# Semantiq Rtd Provider

## Description

This module retrieves real-time data from the SemantIQ service and populates ORTB data.

You need to obtain a company ID from [Audienzz](https://audienzz.com) for the module to function properly. Contact [service@audienzz.ch](mailto:service@audienzz.ch) for details.

## Integration

1. Include the module into your `Prebid.js` build.

    ```sh
    gulp build --modules='rtdModule,semantiqRtdProvider,...'
    ```

1. Configure the module via `pbjs.setConfig`.

    ```js
    pbjs.setConfig({
      ...
      realTimeData: {
        dataProviders: [
          {
            name: 'semantiq',
            waitForIt: true,
            params: {
              companyId: 12345,
              timeout: 1000,
            },
          },
        ],
      },
    });
    ```

## Parameters

{: .table .table-bordered .table-striped }
|Name     |Required|Description                                                 |Type    |Default value|Example              |
|---------+--------+------------------------------------------------------------+--------+-------------+---------------------|
|companyId|No      |Company ID or IDs obtained from [Audienzz](https://audienzz.com).|number \| number[]|-  |12345                |
|timeout  |No      |The maximum time to wait for a response in milliseconds.    |number  |1000         |3000                 |
|trackSpaPages|No  |Send a page impression for every page that a single-page app opens without a reload.|boolean|false|true|

## ORTB data

The module adds SemantIQ keywords to `site.keywords` and IAB category IDs to `site.content.data`, with `segtax` 6 for IAB Content Taxonomy 2.2 and `segtax` 7 for IAB Content Taxonomy 3.0:

```js
site: {
  keywords: 'iab_category_id=386,iab2_category_id=379,sentiment=negative',
  content: {
    data: [
      { name: 'semantiq', ext: { segtax: 6 }, segment: [{ id: '379' }] },
      { name: 'semantiq', ext: { segtax: 7 }, segment: [{ id: '386' }] },
    ],
  },
}
```

### Site categories

To also get the category IDs in `site.cat`, set `site.cattax` to `6` or `7`:

```js
pbjs.setConfig({
  ortb2: {
    site: {
      cattax: 7,
    },
  },
});
```

Without `site.cattax`, `site.cat` is not changed.

## Page impressions

At the start of the first auction on each page load, the module sends a page impression to Audienzz. With `trackSpaPages`, it also sends one for every page that a single-page app opens without a reload. Prebid's consent enforcement applies to it as analytics reporting (TCF purpose 7).
