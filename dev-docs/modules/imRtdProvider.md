---
layout: page_v2
title: Intimate Merger Real time Data Provider
display_name: Intimate Merger Real-time Data Submodule
description: Intimate Merger Real-time Data Submodule
page_type: module
module_type: rtd
module_code : imRtdProvider
enable_download : true
sidebarType : 1
---

# Intimate Merger Real time Data Provider

{:.no_toc}

* TOC
{:toc}

This module reads segments from [Intimate Merger](https://corp.intimatemerger.com/) audience data platform and attaches them as targeting keys to bid requests.

The audience data platform performs segmentation even in environments where 3rd party cookies are not available, but curretly only available in Japan.

## Usage

Add it to your Prebid.js package with:

`gulp build --modules=rtdModule,imRtdProvider`

## Publisher Customized RTD Handling

The following configuration parameters are available:

```
pbjs.setConfig(
    ...
    realTimeData: {
        auctionDelay: 5000,
        dataProviders: [
            {
                name: "im",
                waitForIt: true,
                params: {
                    cid: 5126, // Set your Intimate Merger Customer ID here for production
                    setGptKeyValues: true
                }
            }
        ]
    }
    ...
}
```

## Parameters

{: .table .table-bordered .table-striped }
| Param under dataProviders | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"im"` |
| waitForIt | Optional | Boolean | Required to ensure that the auction is delayed until prefetch is complete. Defaults to false but recommended to true | `true` |
| params | Required | Object | Details of module params. | |
| params.cid | Required | Number | This is the Customer ID value obtained via Intimate Merger. | `5126` |
| params.setGptKeyValues | Optional | Boolean | This is set targeting for GPT/GAM. Default setting is true. | `true` |

## Testing

First, make sure to add the Intimate Merger submodule to your Prebid.js package with:

`gulp serve --modules=rtdModule,imRtdProvider`

and then point your browser at:

`http://localhost:9999/integrationExamples/gpt/imRtdProvider_example.html`
