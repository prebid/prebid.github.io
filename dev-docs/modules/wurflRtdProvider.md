---
layout: page_v2
title: WURFL RTD Provider Module
display_name: WURFL RTD Module
description: WURFL Real Time Data Module
page_type: module
module_type: rtd
module_code : wurflRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

{: .alert.alert-warning :}
This module loads a dynamically generated JavaScript from prebid.wurflcloud.com

# WURFL RTD Submodule
{:.no_toc}

* TOC
{:toc}

## Description

The WURFL RTD module enriches the Prebid.js bid request's OpenRTB 2.0 device data with [WURFL device data](https://www.scientiamobile.com/wurfl-js-business-edition-at-the-intersection-of-javascript-and-enterprise/). The module populates the `device.ext.wurfl` with WURFL device capabilities, ensuring that all bidder adapters have access to enriched device data. At a minimum, three WURFL capabilities are made available to all adapters: `is_mobile`, `complete_device_name` and `form_factor`.

SSPs and other demand partners subscribed to this service with ScientiaMobile will also receive an expanded set of device properties, including more detailed detection for iOS devices (e.g., specific iPhone and iPad model information). For a comprehensive list of available device capabilities, please refer to the [WURFL device capabilities](https://www.scientiamobile.com/capabilities/?products%5B%5D=wurfl-js) documentation.

## A Note About User-Agent Client Hints

WURFL.js is fully compatible with Chromium's User-Agent Client Hints (UA-CH) device identification mechanisms. If the User-Agent string is generic and Client Hints are not available in the HTTP request, the service will automatically request and obtain [high entropy client hint values](https://wicg.github.io/ua-client-hints/#getHighEntropyValues) from the client.

However, it is still recommended to explicitly opt-in and declare support for User-Agent Client Hints on the publisher's website. Doing so improves performance and contributes to a faster user experience. For detailed instructions on implementing User-Agent Client Hint support, refer to the [relevant documentation here](https://docs.scientiamobile.com/guides/implementing-useragent-clienthints).

## Integration Notes

While the WURFL RTD module enriches the OpenRTB 2.0 payload, it is the responsibility of the SSP's adapter to access and pass the information to the auction endpoint. The auction endpoint must then use the new data to support its business logic.

The following scenarios are possible:

{: .table .table-bordered .table-striped }
|                           | SSP Adapter   | SSP Server Side End-Point                                        |
| :------------------------ | :------------ | :--------------------------------------------------------------- |
| SSP adapter is already passing the ORTB2 device to the server (auction endpoint). | No changes required. | Update backend logic to utilize the device data. |
| SSP adapter is not currently passing the data to server. | Update adapter to read `device.ext.wurfl` data and pass it to the endpoint. | Update backend logic to utilize the device data. |
| SSP doesn't have a Bidder Adapter. | Implement PreBid.js adapter and read `device.ext.wurfl` data and pass it to the endpoint. | Update end-point to read and utilize the data. |

## Usage

### Build

To build the WURFL RTD module with Prebid.js, use the following command:

```bash
gulp build --modules="wurflRtdProvider,appnexusBidAdapter,..."  
```

### Configuration

To initialize the WURFL RTD module in Prebid.js, use the `setConfig` function as shown below. The module is configured as part of `realTimeData.dataProviders`

```javascript
var TIMEOUT = 1000;
pbjs.setConfig({
    realTimeData: {
        auctionDelay: TIMEOUT,
        dataProviders: [{
            name: 'wurfl',
            waitForIt: true,
            params: {
                debug: false
            }
        }]
    }
});
```

### Parameters

{: .table .table-bordered .table-striped }
| Name                      | Type          | Description                                                      | Default               |
| :------------------------ | :------------ | :--------------------------------------------------------------- |:----------------------|
| name                      | String        | Real time data module name                                       | Always set to 'wurfl' |
| waitForIt                 | Boolean       | Set to `true` if an `auctionDelay` is defined (optional)         | `false`               |
| params                    | Object        | Configuration parameters for the WURFL RTD module.               |                       |
| params.altHost            | String        | Alternate host for connecting to WURFL.js                        |                       |
| params.debug              | Boolean       | Enable debug mode.                                               | `false`               |

## Testing 

To test how the WURFL RTD module works, run the following command:

`gulp serve --modules=wurflRtdProvider,appnexusBidAdapter`

Then, point your browser to:

`http://localhost:9999/integrationExamples/gpt/wurflRtdProvider_example.html`
