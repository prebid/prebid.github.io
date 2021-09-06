---
layout: page_v2
page_type: module
title: Module - First Party Data Enrichment
description: Enriches First Party Data
module_code : enrichmentFpdModule
display_name : First Party Data Enrichment
enable_download : true
sidebarType : 1
---

# First Party Data Enrichment Module
{:.no_toc}

This module adds a number of First Party Data (FPD) fields from the environment. 

Add it to the Prebid.js build with this command:
```
gulp build --modules=enrichmentFpdModule
```

If included in the build, it will automatically perform the enrichments unless controlled with setConfig:

```
pbjs.setConfig({
    firstPartyData: {
        skipEnrichments: true   // defaults to false
    }
});
```

## How it works

When the first auction on the page is run, this module merges a number of values into the `ortb2` object. Specific details below.

If the publisher needs to refresh the enriched FPD after the first auction, this can be done using a function provided by this module:

```
pbjs.refreshFpd();
```

## Enrichments

{: .table .table-bordered .table-striped }
| Page Source | ortb2 field | Notes |
|---+---+---|
| page URL | site.page | Uses pbjs getRefererInfo().canonicalUrl |
| referer URL | site.ref | Uses pbjs getRefererInfo().referer |
| domain | site.domain | Pulled from the getRefererInfo().canonicalUrl, the host domain is used, with www dropped. |
| viewport width | device.w | Hunts for window.innerWidth, window.document.documentElement.clientWidth, window.document.body.clientWidth |
| viewport height | device.w | Hunts for window.innerHeight, window.document.documentElement.clientHeight, window.document.body.clientHeight |
| meta keywords | site.keywords | Looks for a meta tag. e.g. <meta name="keywords" content="cars, boats"> |
| currency | cur | Collects the currency defined by the [Currency module](/dev-docs/modules/currency.html). |


# Related Reading
- [Prebid.js First Party Data feature](/features/firstPartyData.html)
- [First Party Data Validation Module](/dev-docs/modules/validationFpdModule)
- [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)
