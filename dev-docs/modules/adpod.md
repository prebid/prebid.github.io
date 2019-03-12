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

The adpod module enables developers to add support for a new adserver that handles `adpod` (long-form) videos, like Freewheel. The  module provides functions to validate, cache, and modify long-form video bids. 

## How to use the module as a publisher:

There is a flag available to a publisher to influence how this module behaves.  This setting can be set by adding the following to the Prebid.js configuration:

```
pbjs.setConfig({
  "adpod": {
    "brandCategoryExclusion": true
  }
});
```

When this setting is enabled, it requires the bidder to include a brand category id on the incoming adpod bids (otherwise the bid is rejected).  Additionally, this category is used in the bid caching process and in the winning bid's targeting keys that get sent to the adserver.

Below is an example of the targeting keys with the setting enabled (where `123` is the category id):
```
hb_pb_cat_dur = '10.00_123_10s'
```

When the setting is disabled (which is the default state), bidder's don't have to supply a brand category on the adpod bids.  The bids are cached using a combination of the cpm, the duration and a unique string that's generated once per auction.

Below is an example of the targeting keys with the setting not enabled:
```
hb_pb_cat_dur = '10.00_10s'
```


## How to use the module as a developer:

In the user's equivalent `<name>AdServerVideo` module, import the `initAdpodHooks` function and call it from within their module. Executing the init function will initialize several key functions from the module that are designed to handle `adpod` objects (ie. adUnits, bids, etc.) as the auction proceeds. These functions will only affect `adpod` objects, other `mediaTypes` will be handled by the base Prebid code. 

```
initAdpodHooks();
```

## Optional Values for Developers
In addition to the `initAdpodHooks` function, users can import values from the Adpod module that contain the adpod specific targeting keys (as strings). These values can be used to generate the correct output (ie. targeting keys) to send to the adserver.  

`TARGETING_KEY_PB_CAT_DUR`  
This variable equates to `hb_pb_cat_dur`.

`TARGETING_KEY_CACHE_ID`  
This variable equates to `hb_cache_id`. 

## Further Reading

[Prebid.js](/dev-docs/getting-started.html)   
[Prebid Video](/prebid-video/video-overview.html)  
[Freewheel Module](/dev-docs/modules/freewheel.html)