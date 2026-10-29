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
|companyId|No     |Company ID obtained from [Audienzz](https://audienzz.com).  |number \| number[]  |-            |12345                |
|timeout  |No      |The maximum time to wait for a response in milliseconds.    |number  |1000         |3000                 |
