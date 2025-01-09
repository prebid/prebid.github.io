---
layout: page_v2
title: LiveIntent RTD Module
display_name: LiveIntent RTD Module
description: LiveIntent Real Time Data Module
page_type: module
module_type: rtd
module_code : liveIntentRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# LiveIntent RTD Module

{% include dev-docs/loads-external-javascript.md %}

This module extracts segments from `bidRequest.userId.lipb.segments` enriched by the userID module and
injects them in `ortb2.user.data` array entry.

Please visit [LiveIntent](https://www.liveIntent.com/) for more information.

## Integration

1) Build the LiveIntent RTD Module into the Prebid.js package with:

    ```bash
    gulp build --modules=rtdModule,liveIntentRtdProvider,...
    ```

2) Use `setConfig` to instruct Prebid.js to initialize the LiveIntent RTD module, as specified below.

## Configuration

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 1000,
        dataProviders: [
            {
                name: "liveintent",
                waitForIt: true
            }
        ]
    }
});
```

## Parameters

{: .table .table-bordered .table-striped }
| Name             |Type           | Description                                                         |Required | Notes  |
| :--------------- | :------------ | :------------------------------------------------------------------ |:---------|:------------ |
| `name`           | String        | Real time data module name                                          | yes     | Always 'liveIntent' |
| `waitForIt`      | Boolean       | Should be `true` if there's an `auctionDelay` defined (recommended) | no      | Default `false` |
