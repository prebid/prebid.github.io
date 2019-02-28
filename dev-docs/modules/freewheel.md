---
layout: page_v2
page_type: module
title: Module - Freewheel
description: Returns targeting kev/value pairs for adpod mediaType adUnits.
module_code : Freewheel
display_name : Freewheel
enable_download : true
sidebarType : 1
---

# Freewheel Module

{:.no_toc}

This module returns the targeting key value pairs for the Freewheel ad server.

## How to use the module:

Send ad unit codes to the getTargeting method of this module. 

#### Example:

Ad Unit Code

```javascript
{
  adUnitCode-1: [
    {
      'hb_pb_cat_dur': '10.00_400_15s'
    },
    {
      'hb_pb_cat_dur': '15.00_402_30s'
    },
    {
      'hb_cache_id': '123'
    }
  ]
}

pbjs.adservers.freewheel.getTargeting({
    codes: [adUnitCode1],
    callback: function(err, targeting) { 
        //pass targeting to player api 
    }
});
```

The values sent to `getTargeting` are concatenation of CPM, industy code, and video duration. Freewheel SDK will send those values to Freewheel Ad Server within the following query: 

```
http://[customerId].v.fwmrm.net/ad/g/1[globalParams];hb_pb_cat_dur=10.00_400_15s&hb_pb_cat_dur=15.00_402_30s&hb_cacheid=123;[ParamsForSlot1];[ParamsForSlot2];...;[ParamsForSlotN];
```


## Further Reading

[Prebid.js](http://prebid.org/dev-docs/getting-started.html)  
[Prebid Video](http://prebid.org/prebid-video/video-overview.html)  
[IAB Category Translation](/dev-docs/modules/iabCatalogTranslation.html)