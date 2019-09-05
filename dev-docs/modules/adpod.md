---
layout: page_v2
page_type: module
title: Module - Adpod
description: Adds functions to validate, cache, and modify long-form video bids.
module_code : adpod
display_name : Adpod
enable_download : true
sidebarType : 1
---

# Adpod Module

The adpod module enables developers to add support for a new adserver that handles `adpod` (long-form) videos, like Freewheel.  Specifically, the module provides functions to validate, cache, and modify long-form video bids. 

## How to use the module as a publisher:

There is a flag available for publishers to influence how this module behaves.  This field can be set by adding the following to the Prebid.js configuration:

```
pbjs.setConfig({
  "adpod": {
    "brandCategoryExclusion": true
  }
});
```

When this setting is enabled, it requires the bidder to include a brand category id on the incoming adpod bids (otherwise the bid is rejected).  The bid's brand category will be processed and transformed to the corresponding brand category used by the publisher's adserver (see the [Category Translation](/dev-docs/modules/categoryTranslation.html) module page for more details).   The transformed brand category is then used in the bid caching process and as well as targeting keys that get sent to the adserver for the winning bid(s).

Below is an example of the targeting key's value with the setting enabled (where `123` is the category id):
```
'10.00_123_10s'
```

When the setting is disabled (which is the default state), bidder's don't have to supply a brand category on the adpod bids.  Subsequently, the category part of the bid caching is not included, neither is it included in the generated targeting keys.

Below is an example of the targeting keys with the setting not enabled:
```
hb_pb_cat_dur = '10.00_10s'
```


## How to use the module as a developer:

In the user's equivalent `<name>AdServerVideo` module, import the `initAdpodHooks` function and call it from within their module. Executing the init function will initialize several key functions from the module that are designed to handle `adpod` objects (ie. adUnits, bids, etc.) as the auction proceeds. These functions will only affect `adpod` objects, other `mediaTypes` will be handled by the base Prebid code. 

```
initAdpodHooks();
```

## Optional values for developers
In addition to the `initAdpodHooks` function, users can import values from the Adpod module that contain the adpod specific targeting keys (as strings). These values can be used to generate the correct output (ie. targeting keys) to send to the adserver.  

`TARGETING_KEY_PB_CAT_DUR`  
This variable equates to `hb_pb_cat_dur`.

`TARGETING_KEY_CACHE_ID`  
This variable equates to `hb_cache_id`. 

## Further Reading

[Prebid.js](/dev-docs/getting-started.html)   
[Prebid Video](/prebid-video/video-overview.html)  
[Freewheel Module](/dev-docs/modules/freewheel.html)