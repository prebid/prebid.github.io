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

The WURFL RTD module enriches the Prebid.js bid request's OpenRTB 2.0 device data with [WURFL device data](https://www.scientiamobile.com/wurfl-js-business-edition-at-the-intersection-of-javascript-and-enterprise/). The module populates the `device` and `device.ext.wurfl` with WURFL device capabilities, ensuring that all bidder adapters have access to enriched device data. At a minimum, three WURFL capabilities are made available to all adapters: `is_mobile`, `complete_device_name` and `form_factor`.

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
| SSP adapter is not currently passing the data to server. | Update adapter to read `device` and/or `device.ext.wurfl` data and pass it to the endpoint. | Update backend logic to utilize the device data. |
| SSP doesn't have a Bidder Adapter. | Implement PreBid.js adapter and read `device` and/or `device.ext.wurfl` data and pass it to the endpoint. | Update end-point to read and utilize the data. |

## Usage

### Build

To build the WURFL RTD module with Prebid.js, use the following command:

```bash
gulp build --modules="wurflRtdProvider,appnexusBidAdapter,..."  
```

### Configuration

To initialize the WURFL RTD module in Prebid.js, use the `setConfig` function as shown below. 
The module is configured within `realTimeData.dataProviders`. 
Ensure `waitForIt` is set to `true`. We recommend setting `auctionDelay` to `500 ms` initially, 
though lower values may be suitable with fine-tuning.

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 500,
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
| waitForIt                 | Boolean       | Set to `true` if an `auctionDelay` is defined (required)         | `false`               |
| params                    | Object        | Configuration parameters for the WURFL RTD module.               |                       |
| params.altHost            | String        | Alternate host for connecting to WURFL.js                        |                       |
| params.debug              | Boolean       | Enable debug mode.                                               | `false`               |

## Testing 

To test how the WURFL RTD module works, run the following command:

`gulp serve --modules=wurflRtdProvider,appnexusBidAdapter`

Then, point your browser to:

`http://localhost:9999/integrationExamples/gpt/wurflRtdProvider_example.html`

## Expected Behavior

WURFL RTD adds device information to the bidderRequest's `ortb2.device.ext.wurfl` object (enabled SSPs have access to an extended capability set).

```json
{
  "id": "1edd88d3-12c6-40b2-a80b-138e276b4553",
  "at": 1,
  "site": {...},
  "device": {
    "w": 1170,
    "h": 2532,
    "dnt": 0,
    "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
    "language": "it",
    "make": "Apple",
    "model": "iPhone 16e",
    "devicetype": 1,
    "os": "iOS",
    "osv": "18.3",
    "hwv": "iPhone 16e",
    "ppi": 456,
    "pxratio": 3.0,
    "js": 1,
    "ext": {
      "vpw": 980,
      "vph": 1429,
      "wurfl": {
        "wurfl_id": "apple_iphone_ver18_3_subhw16e",
        "advertised_browser": "Mobile Safari",
        "advertised_browser_version": "18.3",
        "advertised_device_os": "iOS",
        "advertised_device_os_version": "18.3",
        "ajax_support_javascript": true,
        "brand_name": "Apple",
        "complete_device_name": "Apple iPhone 16e",
        "density_class": "3.0",
        "form_factor": "Smartphone",
        "is_app_webview": false,
        "is_connected_tv": false,
        "is_full_desktop": false,
        "is_mobile": true,
        "is_ott": false,
        "is_phone": true,
        "is_robot": false,
        "is_smartphone": true,
        "is_smarttv": false,
        "is_tablet": false,
        "manufacturer_name": "",
        "marketing_name": "",
        "max_image_height": 568,
        "max_image_width": 320,
        "model_name": "iPhone 16e",
        "physical_screen_height": 141,
        "physical_screen_width": 65,
        "pixel_density": 456,
        "pointing_method": "touchscreen",
        "resolution_height": 2532,
        "resolution_width": 1170
      }
    }
  }
}
```
