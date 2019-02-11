---
layout: page_v2
page_type: module
title: Module - IAB Category Translation
description: Converts between ad agency brand categories and IAB brand categories.
module_code : CategoryTranslation
display_name : CategoryTranslation
enable_download : true
sidebarType : 1
---

# IAB Category Translation

{:.no_toc}

This module supports the mapping between ad agency brand categories and IAB brand categories. 
In order to ensure competitve separation, (the process of ensuring ads from the same industry do not appear consecutively in the same ad pod)Freewheel requires their proprietary industry group identifier in the bid request. Each bid request must return one (1) [IAB subcategory](https://support.aerserv.com/hc/en-us/articles/207148516-List-of-IAB-Categories).

1. Provide an API that converts the demand providers own ad categories into IAB subcategories. 

2. Convert IAB subcategories to a Freewheel group identifier, if the primary ad server is Freewheel and the demand partner is not returning a adServerCatId value in the bid response.
If a demand provider elects to use Prebid API for this process, they must include a path to a local mapping file that converts the ad server categories to IAB subcatgories. 


## How to use the module:

1. A Prebid.js package is built that contains the extra brand category translation module.  
2. The inclusion of this module causes Prebid to download a mapping file to local storage. The user also has the option to provide their own mapping file. 
3. At runtime, brand category translation happens as needed. 


## Using A Custom Map File
The IAB Category Translation module uses a default mapping file to convert IAB sub categories to adserver categories. If a publisher prefers to use their own mapping file they will need to set the URL location. They can do so by adding the following to their Prebid.js configuration: 

```
pbjs.setConfig({
    "brandCategoryTranslation": {
       "translationFile": "<url_to_file>"
    }
});
```
This file will be stored locally to expedite the conversion process. If a publisher opts to not provide a conversion mapping file Prebid will use its default conversion mapping file. 

## Adapter Integration

Adapters need to return IAB subcategories in their repsonses. For adapters who do not have that capability they will provide a mapping file in JSON format that will convert their proprietary brand categories to IAB subcategories. 
```j
getMappingFileInfo: function() { 
	return { 
		//mapping file json url
		url: mappingFileURL
           
        //since prebid stores mapping data in localstorage you can return how many days until those values are updated.
        refreshInDays: 7

        // some unique key to store your mapping json in localstorage
        key: `${spec.code}MappingFile`

    }
},
```
## Further Reading

    [Prebid.js](http://prebid.org/dev-docs/getting-started.html)
    [Prebid Video](http://prebid.org/prebid-video/video-overview.html)







