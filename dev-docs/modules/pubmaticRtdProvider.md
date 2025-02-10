---
layout: page_v2
page_type: module
title: PubMatic RTD Provider
display_name: PubMatic RTD Module
description: RTD module for Prebid provided by PubMatic to set dynamic floors
module_type: rtd
module_code: pubmaticRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# PubMatic RTD Module
{:.no_toc}

* TOC
{:toc}

## Overview

This RTD module, provided by PubMatic, sets dynamic floors for Prebid auctions.

## Integration

{: .alert.alert-info :}
Note: Ensure that the following modules are listed when building Prebid: `priceFloors`.
For example:

```shell
gulp build --modules=priceFloors
```

To compile the RTD module into your Prebid build:

```shell
gulp build --modules=rtdModule,pubmaticRtdProvider
```

## Configuration

To utilize the PubMatic RTD module, add `realTimeData` with the parameters mentioned below to the Prebid config.

```js
const AUCTION_DELAY = 500;
pbjs.setConfig({
    // rest of the config
    ...,
    realTimeData: {
        auctionDelay: AUCTION_DELAY,
        dataProviders: [
            {
                name: "pubmatic",
                waitForIt: true,
                params: {
                    publisherId: `<publisher_id>`, // please contact PubMatic to get a publisherId for yourself
                    profileId: `<profile_id>`, // please contact PubMatic to get a profileId for yourself
                },
            },
        ],
    },
    // rest of the config
    ...,
});
```

## Parameters

{: .table .table-bordered .table-striped }
| Name               | Type    | Description                                                    | Default                    |
| :----------------- | :------ | :------------------------------------------------------------- | :------------------------- |
| name               | String  | Name of the real-time data module                              | Always `pubmatic`          |
| waitForIt          | Boolean | Should be `true` if an `auctionDelay` is defined (optional)    | `true`                     |
| params             | Object  |                                                                |                            |
| params.publisherId | String  | Publisher ID                                                   |                            |
| params.profileId   | String  | Profile ID                                                     |                            |
