---
layout: page_v2
title: Relevad RTD Provider
display_name: Relevad RTD Provider
description: Contextual Categories and Segments, cookieless and privacy-first.
page_type: module
module_type: rtd
module_code : relevadRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Relevad RTD Provider

Relevad is a contextual semantic analytics company. Our privacy-first, cookieless contextual categorization, segmentation, and keyword generation platform is designed to help publishers and advertisers optimize targeting and increase ad inventory yield.

This real-time data processing module provides quality contextual IAB categories and segments to prebid.js auction bidders. Every category and segment comes with a score measuring its relevance to the publisher’s web page. Publishers may configure their preferred minimum score setting with the module parameter “minscore”. Relevad service does not use browser cookies and is fully GDPR compliant.

{:.no_toc}
* TOC
{:toc}

## Usage

Compile the Relevad RTD module (`relevaddRtdProvider`) into your Prebid build, along with the parent RTD Module (`rtdModule`):

`gulp build --modules=rtdModule,relevadRtdProvider`

Next we configure the module, via `pbjs.setConfig`. See the **Parameter Descriptions** below for more detailed information of the configuration parameters. 

```js
pbjs.setConfig(
    ...
    realTimeData: {
      auctionDelay: 1000,
      dataProviders: [
        {
          name: "RelevadRTDModule",
          waitForIt: true,
          params: { 
              partnerId: your_partner_id, // Your Relevad partner id.
              setgpt: true,               // Target or not google GAM/GPT on your page.
            minscore: 30,               // Minimum relevancy score (0-100). If absent, defaults to 30.
 
            // The list of bidders to target with Relevad categories and segments. If absent or empty, target all bidders.
            bidders: [
              { bidder: "appnexus",                   // Bidder name
                adUnitCodes: ['adUnit-1','adUnit-2'], // List of adUnit codes to target. If absent or empty, target all ad units.
                minscore: 70, // Minimum relevancy score for this bidder (0-100). If absent, defaults to the global minscore.
              },
              ...
            ]
          }
      }
    ]
  }
 ...
}
```



## Parameter Descriptions

{: .table .table-bordered .table-striped }



| Name               | Type       | Description                                                  | Notes                                                        |
| :----------------- | :--------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| name               | String     | Relevad RTD module name                                      | Mandatory, must be **RelevadRTDModule**                      |
| waitForIt          | Boolean    | Whether to delay auction for the RTD module response         | Optional. Defaults to false.We recommend setting it to true. Relevad RTD service is very fast. |
| params             | Object     |                                                              | Relevad RTD module configuration                             |
| params.partnerid   | String     | Relevad Partner ID, required to enable the service           | Mandatory                                                    |
| params.publisherid | String     | Relevad publisher id                                         | Mandatory                                                    |
| params.apikey      | String     | Relevad API key                                              | Mandatory                                                    |
| param.actualUrl    | String     | Your page URL. When present, will be categorized instead of the browser-provided URL | Optional, defaults to the browser-providedURL                |
| params.setgpt      | Boolean    | Target or not Google GPT/GAM when it is configured on your page | Optional, defaults to true.                                  |
| params.minscore    | Integer    | Minimum categorization relevancy score in the range of 0-100. Our categories and segments come  with their relevancy scores. We’ll send to the bidders only categories and segments with the scores higher than the minscore. | Optional, defaults to 30                                     |
| params.bidders     | Dictionary | Bidders with which to share category and segment information | Optional. If empty or absent, target all bidders.            |



### Bidder-specific configuration. Every bidder may have these configuration parameters

| Name        | Type             | Description                                                  | Notes                                                    |
| :---------- | :--------------- | :----------------------------------------------------------- | :------------------------------------------------------- |
| bidder      | String           | Bidder name                                                  | Mandatory. Example: “appnexus”                           |
| adUnitCodes | Array of Strings | List of specific AdUnit codes you with to target             | Optional. If empty or absent, all ad units are targeted. |
| minscore    | Integer          | Bidder-specific minimum categorization relevancy score (0, 100) | Optional, defaults to global minscore above.             |

If you do not have your own `partnerid, publisherid, apikey` please reach out to [info@relevad.com](mailto:info@relevad.com).

## Testing

To view an example of the on page setup required:

```bash
gulp serve-fast --modules=rtdModule,relevadRtdProvider
```

Then in your browser access:

```
http://localhost:9999/integrationExamples/gpt/relevadRtdProvider_example.html
```

Run the unit tests for Relevad RTD module:

```bash
gulp test --file "test/spec/modules/relevadRtdProvider_spec.js"
```


## Support

If you require further assistance or are interested in discussing the module functionality please reach out to [anna@relevad.com](mailto:anna@relevad,com).
