---
layout: page_v2
title: Pubx.ai RTD Provider
display_name: Pubx.ai RTD Module
description: RTD module for Prebid provided by Pubx.ai to set dynamic floors
page_type: module
module_type: rtd
module_code: pubxaiRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Pubx.ai RTD Module

{:.no_toc}

* TOC
{:toc}

## Description

This RTD module, provided by Pubx.ai, sets dynamic floors for Prebid auctions.

## Integration

Ensure that the following modules are listed when building Prebid: `priceFloors`.
For example:

```shell
gulp build --modules=priceFloors
```

To compile the RTD module into your Prebid build:

```shell
gulp build --modules=rtdModule,pubxaiRtdProvider
```

## Configuration

To use the Pubx.ai RTD module, add `realTimeData` with the parameters mentioned below to the Prebid config.

```js
const AUCTION_DELAY = 100;
pbjs.setConfig({
    // rest of the config
    ...,
    realTimeData: {
        auctionDelay: AUCTION_DELAY,
        dataProviders: [
            {
                name: "pubxai",
                waitForIt: true,
                params: {
                    pubxId: `<publisher_id>`,
                    endpoint: `<publisher_endpoint>`, // (optional)
                    floorMin: `<floorMin>`, // (optional)
                    enforcement: `<enforcement>`, // (optional)
                    data: `<defaultConfig>` // (optional)
                },
            },
        ],
    },
    // rest of the config
    ...,
});
```

## Parameters

| Name               | Type    | Description                                                    | Default                    |
| :----------------- | :------ | :------------------------------------------------------------- | :------------------------- |
| name               | String  | Name of the real-time data module                              | Always `pubxai`            |
| waitForIt          | Boolean | Should be `true` if an `auctionDelay` is defined (optional)    | `false`                    |
| params             | Object  |                                                                |                            |
| params.pubxId      | String  | Publisher ID                                                   |                            |
| params.endpoint    | String  | URL to retrieve floor data (optional)                          | `https://floor.pbxai.com/` |
| params.floorMin    | Number  | Minimum CPM floor (optional)                                   | `None`                     |
| params.enforcement | Object  | Enforcement behavior within the Price Floors Module (optional) | `None`                     |
| params.data        | Object  | Default floor data provided by pubX.ai (optional)              | `None`                     |
