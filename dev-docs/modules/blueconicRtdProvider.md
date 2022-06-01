---
layout: page_v2
title: BlueConic Real Time Data Provider
display_name: BlueConic Real-time Module
description: BlueConic Real-time Data Module
page_type: module
module_type: rtd
module_code : blueconicRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# BlueConic Real-time Data Submodule
{:.no_toc}

* TOC
{:toc}

BlueConic is the Customer Data Platform that liberates customer data to make individualized marketing a reality. We are the first and only company that delivers to marketers the promise of a single view of a customer. BlueConi gather rela-time and batch data of customers from all the channels to the tailor products, services and experiences according to their wants and needs.

The BlueConic real-time data module in Prebid has been built so that publishers
can maximize the power of their first-party audiences, user-level and contextual data.
This module provides both an integrated BlueConic identity with real-time
contextual and audience segmentation solution that seamlessly and easily
integrates into your existing Prebid deployment. For more information, 
please visit <a href="https://www.blueconic.com/">https://www.blueconic.com/</a> or contact our Prebid integration team at connectors@blueconic.com.


## Publisher Usage

Compile the BlueConic RTD module into your Prebid build:

`gulp build --modules=rtdModule,blueconicRtdProvider,appnexusBidAdapter`

Add the BlueConic RTD provider to your Prebid config. In this example we will configure
publisher 1234 to retrieve segments, profile data from BlueConic. See the
"Parameter Descriptions" below for more detailed information of the
configuration parameters. Please work with your BlueConic Prebid support team
(info@blueconic.com) on which version of Prebid.js supports different bidder
and segment configurations.

```
pbjs.setConfig(
    ...
    realTimeData: {
        auctionDelay: 5000,
        dataProviders: [
            {
                name: "blueconic",
                waitForIt: true,
                params: {
                    requestParams: {
                        publisherId: 1234
                    }
                }
            }
        ]
    }
    ...
}
```

## BlueConic Configuration Parameters

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'blueconic' |
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| params | Object | | |
| params.requestParams | Object | Publisher partner specific configuration options, such as optional publisher id and other segment query related metadata | Optional |


Please see the examples available in the blueconicRtdProvider_spec.js
tests and work with your Blueconic Prebid integration team (connectors@blueconic.com).

## Testing 

To run test suite for blueconic:

`gulp test --modules=rtdModule,blueconicRtdProvider,appnexusBidAdapter`

## Example

To view an example of available segments:

`gulp serve --modules=rtdModule,blueconicRtdProvider,appnexusBidAdapter`

and then point your browser at:

`http://localhost:9999/integrationExamples/gpt/blueconicRtdProvider_example.html`