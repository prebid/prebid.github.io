---
layout: page_v2
title: Audigent Halo Real Time Data Provider
display_name: Audigent Halo Real-time Segmentation Module
description: Audigent Halo Real-time Segmentation Module
page_type: module
module_type: rtd
module_code : haloRtdProvider
enable_download : true
sidebarType : 1
---

# Audigent Halo Real-time Data Submodule
{:.no_toc}

* TOC
{:toc}

Audigent is a next-generation data management platform and a first-of-a-kind
"data agency" containing some of the most exclusive content-consuming audiences
across desktop, mobile and social platforms.

This real-time data module provides an integrated post-cookie Halo identity and
real-time user segmentation solution that seamlessly integrates into your bid
request cycle. Users are identified and bid request objects are augmented
with first-party data derived segments prior to being sent to exchange/ssp
services in order to optimize targeting and increase publisher revenue.

Audigent maintains a large database of first-party Tradedesk Unified ID,
Audigent Halo ID and other id provider mappings to various third-party segment
types that are utilizable across different backends. With the Halo RTD module,
these segments and other data can be retrieved and utilized by supporting
exchange and SSP backends in real-time during your bid request cycle.


## Publisher Usage

Compile the Halo RTD module into your Prebid build:

`gulp build --modules=userId,unifiedIdSystem,rtdModule,haloRtdProvider,appnexusBidAdapter`

Add the Halo RTD provider to your Prebid config. In this example we will configure
publisher 1234 to retrieve segments from Audigent. See the
"Parameter Descriptions" below for more detailed information of the
configuration parameters. Please work with your Audigent Prebid support team
(prebid@audigent.com) on which version of Prebid.js supports different bidder
and segment configurations.

```
pbjs.setConfig(
    ...
    realTimeData: {
        auctionDelay: auctionDelay,
        dataProviders: [
            {
                name: "halo",
                waitForIt: true,
                params: {
                    segmentCache: false,
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

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'halo' |
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| params | Object | | |
| params.handleRtd | Function | A passable RTD handler that allows custom adunit and ortb2 logic to be configured. The function signature is (bidConfig, rtd, rtdConfig, pbConfig) => {}. | Optional |
| params.segmentCache | Boolean | This parameter tells the Halo RTD module to attempt reading segments from a local storage cache instead of always requesting them from the Audigent server. | Optional. Defaults to false. |
| params.requestParams | Object | Publisher partner specific configuration options, such as optional publisher id and other segment query related metadata to be submitted to Audigent's backend with each request.  Contact prebid@audigent.com for more information. | Optional |
| params.haloIdUrl | String | Parameter to specify alternate haloid endpoint url. | Optional |

## Publisher Customized RTD Handling

As indicated above, it is possible to provide your own bid augmentation
functions rather than simply merging supplied data.  This is useful if you
want to perform custom bid augmentation and logic with Halo real-time data
prior to the bid request being sent. Simply add your custom logic to the
optional handleRtd parameter and provide your custom RTD handling logic there.

Please see the following example, which provides a function to modify bids for
a bid adapter called adBuzz and perform custom logic on bidder parameters.

```
pbjs.setConfig(
    ...
    realTimeData: {
        auctionDelay: auctionDelay,
        dataProviders: [
            {
                name: "halo",
                waitForIt: true,
                params: {
                    handleRtd: function(bidConfig, rtd, rtdConfig, pbConfig) {
                        var adUnits = bidConfig.adUnits;
                        for (var i = 0; i < adUnits.length; i++) {
                            var adUnit = adUnits[i];
                            for (var j = 0; j < adUnit.bids.length; j++) {
                                var bid = adUnit.bids[j];
                                if (bid.bidder == 'adBuzz' && rtd['adBuzz'][0].value != 'excludeSeg') {
                                    bid.params.adBuzzCustomSegments.push(rtd['adBuzz'][0].id);
                                }
                            }
                        }
                    },
                    segmentCache: false,
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

The handleRtd function can also be used to configure custom ortb2 data
processing. Please see the examples available in the haloRtdProvider_spec.js
tests and work with your Audigent Prebid integration team (prebid@audigent.com)
on how to best configure your own Halo RTD & Open RTB data handlers.

## Testing

To view an example of available segments returned by Audigent's backends:

`gulp serve --modules=userId,unifiedIdSystem,rtdModule,haloRtdProvider,appnexusBidAdapter`

and then point your browser at:

`http://localhost:9999/integrationExamples/gpt/haloRtdProvider_example.html`




