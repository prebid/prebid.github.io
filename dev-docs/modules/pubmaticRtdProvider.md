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

The PubMatic RTD module fetches pricing floor data and updates the Price Floors Module based on user's context in real-time as per Price Floors Modules Floor Data Provider Interface guidelines [Dynamic Floor Data Provider](https://docs.prebid.org/dev-docs/modules/floors.html#floor-data-provider-interface).

## Integration

Step 1: Contact PubMatic to get a publisher ID and create your first profile.

Step 2: Integrate the PubMatic Analytics Adapter (see Prebid Analytics modules) as well as the Price Floors module.

Step 3: Prepare the base Prebid file.

For example:

To compile the Price Floors, PubMatic RTD module and PubMatic Analytics Adapter into your Prebid build:

```shell
gulp build --modules=priceFloors,rtdModule,pubmaticRtdProvider,pubmaticAnalyticsAdapter
```

{: .alert.alert-info :}
Note: The PubMatic RTD module is dependent on the global real-time data module : `rtdModule`, price floor module : `priceFloors` and PubMatic Analytics Adapter : `pubmaticAnalyticsAdapter`.

Step 4: Set configuration and enable PubMatic RTD Module using pbjs.setConfig.

## Configuration

This module is configured as part of the `realTimeData.dataProviders`.  We recommend setting `auctionDelay` to at least 250 ms and make sure `waitForIt` is set to `true` for the `pubmatic` RTD provider.

```js
const AUCTION_DELAY = 250;
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
| waitForIt          | Boolean | Should be `true` if an `auctionDelay` is defined (mandatory)    | `false`                     |
| params             | Object  |                                                                |                            |
| params.publisherId | String  | Publisher ID                                                   |                            |
| params.profileId   | String  | Profile ID                                                     |                            |
