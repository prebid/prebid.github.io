---
layout: page_v2
page_type: module
title: Module - First Party Data Enrichment
description: Injects additional data into the auction stream, including&#58; domain, keywords, and page url.
module_code : enrichmentFpdModule
display_name : First Party Data Enrichment
enable_download : true
recommended: true
sidebarType : 1
---

# First Party Data Enrichment Module
{:.no_toc}

{: .alert.alert-warning :}
Since version 7.29, this module does nothing; its functionality is instead included by default in all Prebid distributions.

This module adds a number of First Party Data (FPD) fields from the environment. 

Add it to the Prebid.js build with this command:
```
gulp build --modules=enrichmentFpdModule
```

If included in the build, it will automatically perform the enrichments unless controlled with setConfig:

```javascript
pbjs.setConfig({
    firstPartyData: {
        skipEnrichments: true   // defaults to false
    }
});
```

## How it works

At the beginning of each auction, this module merges a number of values into the `ortb2` [requestBids parameter](/dev-docs/publisher-api-reference/requestBids.html). Specific details below.

## Enrichments

{: .table .table-bordered .table-striped }
| Page Source | ortb2 field | Notes |
|---+---+---|
| page URL | site.page | Uses pbjs getRefererInfo().page |
| referer URL | site.ref | Uses pbjs getRefererInfo().ref |
| host domain | site.domain | Pulled from the getRefererInfo().page the host domain is used with the www component dropped. |
| aggregated domain | site.publisher.domain | The highest level domain in which cookies can be set. |
| viewport width | device.w | Hunts for window.innerWidth, window.document.documentElement.clientWidth, window.document.body.clientWidth |
| viewport height | device.w | Hunts for window.innerHeight, window.document.documentElement.clientHeight, window.document.body.clientHeight |
| UA client hints | device.sua | Collects user agent client hints. See [note](#ua-hints) below. |
| meta keywords | site.keywords | Looks for a meta tag. e.g. <meta name="keywords" content="cars, boats"> |
| currency | cur | Collects the currency defined by the [Currency module](/dev-docs/modules/currency.html). |

<a  id="ua-hints" />
### User agent client hints

The module populates `device.sua` with UA client hints retrieved from `navigator.userAgentData`. By default, it asks for [every available high entropy hint](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData#returning_high_entropy_values); you may specify the list of hints with the `uaHints` option:

```javascript
pbjs.setConfig({
    firstPartyData: {
        uaHints: [
            'platform',
            // ...
        ]
    }
})
```

If `uaHints` is set to an empty array, the module will not attempt to retrieve any high entropy hint and use only the available low-entropy values.   

# Related Reading
- [Prebid.js First Party Data feature](/features/firstPartyData.html)
- [First Party Data Validation Module](/dev-docs/modules/validationFpdModule)
- [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)
