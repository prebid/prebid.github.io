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

This module passes key value targeting pairs to the Freewheel SDK. 

## How to use the module:

Send ad unit codes to the getTargeting method of this module. 

#### Example:

Ad Unit Code
```
{
  'adUnitCode-1: [
    {
      'hb_pb_cat_dur': '10.00_400_15'
    },
    {
      'hb_pb_cat_dur': '15.00_402_30'
    },
    {
      'hb_uuid': '123'
    }
  ]
}

pbjs.adServers.freewheel.getTargeting({codes:['adUnitCode-1']});
```
The values sent to `getTargeting` are concatenation of CPM, industy code, and video duration. Freewheel SDK will then send to Freewheel Ad Server the following query: 

```
http://[customerId].v.fwmrm.net/ad/g/1[globalParams];hb_pb_cat_dur=10.00_400_15s&hb_pb_cat_dur=15.00_402_30s&hb_uuid=123;[ParamsForSlot1];[ParamsForSlot2];...;[ParamsForSlotN];
```


## Further Reading

[Prebid.js](http://prebid.org/dev-docs/getting-started.html)  
[Prebid Video](http://prebid.org/prebid-video/video-overview.html)  
[IAB Category Translation](/dev-docs/modules/iabCatalogTranslation.html)