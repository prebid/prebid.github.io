---
layout: page_v2
title: Adnuntius Data Segment Module
display_name: Adnuntius Data Segments
description: Adnuntius Data Segments
page_type: module
module_type: rtd
module_code: adnuntiusRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Adnuntius Data Segment Module

## Integration

1. Compile the Adnuntius RTD Module and Adnuntius Bid Adapter into your Prebid build:

    ```bash
    gulp build --modules="adnuntiusRtdProvider,adnuntiusBidAdapter,..."
    ```

2. Use `setConfig` to instruct Prebid.js to initilize the adnuntius module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders`

```javascript
var pbjs = pbjs || { que: [] }
pbjs.que.push(function () {
    pbjs.setConfig({
        realTimeData: {
            auctionDelay: 300,
            dataProviders: [
                {
                    name: 'adnuntius',
                    waitForIt: true,
                    params: {
                        bidders: ['adnuntius'],
                        providers: [
                            {
                                siteId: 'site123',
                                userId: 'user123',
                            },
                        ],
                    },
                },
            ],
        },
    })
})
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name |Type | Description | Notes |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'adnuntius' |
| waitForIt | Boolean | Should be `true` if there's an `auctionDelay` defined (optional) | `false` |
| params | Object | | |
| params.bidders | Array | A list of bidders that the module should affect | |
| params.bidders | Array | An array of users users and site ID that to send to Adnuntius data | |
