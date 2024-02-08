---
layout: page_v2
page_type: module
title: Module - First Party Data Validation
description: Verify First Party Data fields and data types. Not recommended for production use.
module_code : validationFpdModule
display_name : First Party Data Validation
enable_download : true
sidebarType : 1
---

# First Party Data Validation Module

{:.no_toc}

This module performs a number of validations on First Party Data (FPD) fields.The scope and number of validations is large enough that it increases the size of the PBJS package by about 1KB: verifying fields and data types. e.g. confirm that site.sectioncat is an array of strings.

For this reason, publishers sensitive to javascript size may want to consider running this module only when testing a new release of Prebid.js or during major changes to how Prebid.js is integrated into their pages.

Add it to the Prebid.js build with this command:

```bash
gulp build --modules=validationFpdModule
```

If included in the build, it will automatically perform the defined validations unless controlled with setConfig:

```javascript
pbjs.setConfig({
    firstPartyData: {
        skipValidations: true    // defaults to false
    }
});
```

## Validations

This module does its checks at the beginning of each auction.

When a data field doesn't meet the defined validations, it will be removed. In addition, the module will look for the _pubcid_optout cookie (or local storage),
and if it exists, certain fields will be removed.

{: .table .table-bordered .table-striped }
| Field | Validations | Notes |
| --- | --- | --- |
| ortb2.imp | remove | imp elements can only be defined by AdUnits |
| ortb2.cur | array of strings | OpenRTB currency is an array, but Prebid supports only a single currency |
| ortb2.device.w and .h | number | Device width and height must be numbers |
| ortb2.site.name | string | |
| ortb2.site.domain | string | |
| ortb2.site.page | string | |
| ortb2.site.ref | string | referrer |
| ortb2.site.keywords | string | comma-separated list of keywords |
| ortb2.site.search | string | |
| ortb2.site.cat | array of strings | |
| ortb2.site.pagecat | array of strings | |
| ortb2.site.sectioncat | array of strings | |
| ortb2.site.publisher | object | |
| ortb2.site.content.data | Must be an array of objects, each element must have a name and a segment. Each segment must contain an id that is a string | |
| ortb2.user.yob | number | removed if _pubcid_optout is defined |
| ortb2.user.gender | string | removed if _pubcid_optout is defined |
| ortb2.user.data | Must be an array of objects, each element must have a name and a segment. Each segment must contain an id that is a string | |
| ortb2.user.data.ext | Must be an object | |

# Related Reading

- [Prebid.js First Party Data feature](/features/firstPartyData.html)
- [First Party Data Enrichment Module](/dev-docs/modules/enrichmentFpdModule)
- [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)
