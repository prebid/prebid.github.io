---
layout: page_v2
page_type: module
title: Module - IAB Category Translation
description: Converts between ad agency brand categories and IAB brand categories.
module_code : categoryTranslation
display_name : CategoryTranslation
enable_download : true
sidebarType : 1
---

# IAB Category Translation

{:.no_toc}

This module converts the IAB sub category to FreeWheel industry group identifiers. The FreeWheel identifiers ensure competitve separation of industries and products. 

Each bid request must return one [IAB subcategory](https://support.aerserv.com/hc/en-us/articles/207148516-List-of-IAB-Categories).

The module provides the following: 

- Converts IAB subcategories to a FreewWheel industry group identifier.

## How to use the module:

1. A Prebid.js package is built that contains this module and the [FreeWheel](/dev-docs/modules/freewheel.html) module.  
2. The inclusion of this module causes Prebid to download a mapping file to local storage. The user also has the option to provide their own mapping file. 
3. At runtime, brand category translation happens as needed. 


## Using A Custom Map File
The IAB Category Translation module uses a default mapping file to convert adserver categories to IAB sub categories. If a publisher prefers to use their own mapping file they will need to set the URL location of that file. They can do so by adding the following to their Prebid.js configuration: 

```
pbjs.setConfig({
    "brandCategoryTranslation": {
       "translationFile": "<url_to_file>"
    }
});
```

This file will be stored locally to expedite the conversion process. If a publisher opts to not provide a conversion mapping file Prebid will use its default conversion mapping file. 

Publishers should ensure that the JSON returned from their custom file is valid for Prebid by adhering to the following structure: 

```JSON
{
    “mapping”: {
        “<your-iab-sub-category>“: {
            “id”: “<industry/group/category id>“,
            “name”: “<industry/group/category name>”
        },
   ....
   }
}
```

Refer to Prebid Github repository for a [custom file reference](https://github.com/prebid/category-mapping-file).


## Further Reading

[Prebid.js](/dev-docs/getting-started.html)   
[Prebid Video](/prebid-video/video-overview.html)  
[FreeWheel Module](/dev-docs/modules/freewheel.html)  
[Adapter Integration](/dev-docs/bidder-adaptor.html)







