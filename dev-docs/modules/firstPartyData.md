---
layout: page_v2
page_type: module
title: Module - First Party Data
description: Validates and adds first party data
module_code : firstPartyData
display_name : First Party Data
enable_download : true
sidebarType : 1
---



# First Party Data Module
{:.no_toc}

This module performs a number of validations on First Party Data (FPD) fields and enriches the
existing data with a number commonly available fields.

If included in the PBJS build, it will automatically perform these validations and enrichments,
but the activities can be controlled with setConfig:

```
pbjs.setConfig({
    firstPartyData: {
        skipValidations: true, // default to false
        skipEnrichments: true // default to false
    }
});
```

## Enrichments

{: .table .table-bordered .table-striped }
| Field | Source | Notes |
| --- | --- | --- |
| ortb2.site.ref | getRefererInfo().referer | obsoletes the need for bid adapters to read bidRequest.refererInfo. |
| ortb2.site.page | getRefererInfo().canonicalUrl | |
| ortb2.site.domain | parses domain out of getRefererInfo().canonicalUrl | |
| ortb2.device.h | window.innerHeight | |
| ortb2.device.w | window.innerWidth | |
| ortb2.cur | getConfig({currency.adServerCurrency}) | Only if the [Currency module](/dev-docs/modules/currency.html) is configured. |
| ortb2.site.keywords | e.g. <meta name="keywords" content="cars, boats"> | 

## Validations

{: .table .table-bordered .table-striped }
| Field | Validations | Notes |
| --- | --- | --- |
| ortb2.imp | remove | imp elements can only be defined by AdUnits |
| ortb2.site.content.data | Must be an array, each element must have a name and a segment. Each segment must contain an id. | |
| ortb2.user.data | Must be an array, each element must have a name and a segment. Each segment must contain an id. | |

# Related Reading
- [Prebid.js First Party Data feature](/features/firstPartyData.html)
- [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)
