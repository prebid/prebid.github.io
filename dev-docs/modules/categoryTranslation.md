---
layout: page_v2
page_type: module
title: Module - Category Translation
description: Converts IAB category to ad server category for long-form videos.
module_code : categoryTranslation
display_name : CategoryTranslation
enable_download : true
sidebarType : 1
---

# IAB Category Translation

{:.no_toc}

This module converts the IAB sub category to Ad server industry group identifiers. The identifiers ensure competitive separation of industries and products.

Each bidder must return one [IAB subcategory](https://support.aerserv.com/hc/en-us/articles/207148516-List-of-IAB-Categories) if they want to do competitive separation.

The module provides the following:

- Converts IAB subcategories to Ad server group identifier.

## How to use the module

1. A Prebid.js package is built that contains this module and the Ad server module. Prebid supports [FreeWheel](/dev-docs/modules/freewheel.html) and Google Ad Manager ad servers.
2. The inclusion of this module and long-form ad server module causes Prebid to download a mapping file to local storage. The user also has the option to provide their own mapping file. The default ad server is Freewheel. To hook to the DFP video ad server module you must configure it in the mapping url.
3. At runtime, brand category translation happens as needed.

## Using A Custom Map File

The IAB Category Translation module uses a default mapping file to convert adserver categories or labels to IAB sub categories. If a publisher prefers to use their own mapping file they will need to set the URL location of that file. They can do so by adding the following to their Prebid.js configuration:

```javascript
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
