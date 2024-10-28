---
layout: page_v2
title: Audigent Hadron Real Time Data Provider
display_name: Audigent Hadron Real-time Segmentation Module
description: Audigent Hadron Real-time Segmentation Module
page_type: module
module_type: rtd
module_code : hadronRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Audigent Hadron Real-time Data Submodule

{:.no_toc}

* TOC
{:toc}

Audigent is a next-generation, first-party data management platform and the
world’s first "data agency", powering the programmatic landscape and DTC
eCommerce with actionable first-party audience and contextual data from
retailers, lifestyle publishers, content creators, athletes and artists.

The Hadron real-time data module in Prebid has been built so publishers
can maximize the power of their first-party audiences and contextual data.
This module provides both an integrated cookieless Hadron identity, contextual
targeting and audience segmentation solution that seamlessly and easily
integrates into your existing Prebid deployment.

Users, devices, content, cohorts and other features are identified and utilized
to augment every bid request with targeted, first-party data-derived segments
before being submitted to supply-side platforms. Enriching the bid request with
robust first-party audience and contextual data, Audigent's Hadron RTD module
helps optimize targeting and header-bidding performance.  For more information,
please visit <a href="https://audigent.com">https://audigent.com</a> or contact our Prebid integration team at
<prebid@audigent.com>.

## Publisher Usage

Compile the Hadron RTD module into your Prebid build:

`gulp build --modules=userId,unifiedIdSystem,rtdModule,hadronRtdProvider,appnexusBidAdapter`

Add the Hadron RTD provider to your Prebid config. In this example we will configure
publisher 1234 to retrieve segments from Audigent. See the
"Parameter Descriptions" below for more detailed information of the
configuration parameters. Please work with your Audigent Prebid support team
(<prebid@audigent.com>) on which version of Prebid.js supports different bidder
and segment configurations.

```javascript
pbjs.setConfig({
    // ...
    realTimeData: {
        auctionDelay: auctionDelay,
        dataProviders: [
            {
                name: "hadron",
                waitForIt: true,
                params: {
                    segmentCache: false,
                    partnerId: 1234
                }
            }
        ]
    }
    // ...
});
```

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'hadron' |
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| params | Object | | |
| params.handleRtd | Function | A passable RTD handler that allows custom adunit and ortb2 logic to be configured. The function signature is (bidConfig, rtd, rtdConfig, pbConfig) => {}. | Optional |
| params.segmentCache | Boolean | This parameter tells the Hadron RTD module to attempt reading segments from a local storage cache instead of always requesting them from the Audigent server. | Optional. Defaults to false. |
| params.partnerId | Number | This is the Audigent Partner ID obtained from Audigent. | Required |
| params.hadronIdUrl | String | Parameter to specify alternate hadronid endpoint url. | Optional |

## Publisher Customized RTD Handling

As indicated above, it is possible to provide your own bid augmentation
functions rather than simply merging supplied data.  This is useful if you
want to perform custom bid augmentation and logic with Hadron real-time data
prior to the bid request being sent. Simply add your custom logic to the
optional handleRtd parameter and provide your custom RTD handling logic there.

Please see the following example, which provides a function to modify bids for
a bid adapter called adBuzz and perform custom logic on bidder parameters.

```javascript
pbjs.setConfig({
    // ...
    realTimeData: {
        auctionDelay: auctionDelay,
        dataProviders: [
            {
                name: "hadron",
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
                    partnerId: 1234                    
                }
            }
        ]
    }
    // ...
});
```

The handleRtd function can also be used to configure custom ortb2 data
processing. Please see the examples available in the hadronRtdProvider_spec.js
tests and work with your Audigent Prebid integration team (<prebid@audigent.com>)
on how to best configure your own Hadron RTD & Open RTB data handlers.

## Testing

To view an example of available segments returned by Audigent's backends:

`gulp serve --modules=userId,unifiedIdSystem,rtdModule,hadronRtdProvider,appnexusBidAdapter`

and then point your browser at:

`http://localhost:9999/integrationExamples/gpt/hadronRtdProvider_example.html`
