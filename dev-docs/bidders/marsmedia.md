---
layout: bidder
title: Marsmedia
description: Prebid Mars Media Group Bidder Adaptor
pbjs: true
pbs: true
biddercode: marsmedia
media_types: video, banner
gdpr_supported: true
floors_supported: true
schain_supported: true
usp_supported: true
coppa_supported: true
gvl_id: 776
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| zoneId | required | The zone ID from Mars Media Group. | 9999 | integer |


### Banner - Ad Unit Setup
```javascript
var adUnits = [
{
  code: 'marsmedia-ad-123456-1', // ad slot HTML element ID  
  mediaTypes: {
    banner: {  
      sizes: [
          [300, 250]
      ]
    }   
  } 
  bids: [{
    bidder: 'marsmedia',
    params: {
        zoneId: 9999    // required 
    }
  }]
}
``` 

### Instream Video - Ad Unit Setup
```javascript
var adUnits = [
{
  code: 'marsmedia-ad-123456-1', // ad slot HTML element ID  
  mediaTypes: {
    video: {                                // We recommend setting the following video params
                                            // in Ad Unit rather than bidder params as per Prebid 4.0 recommendation. 
      playerSize: [300, 250],               // required
      context: 'instream',                  // required
      mimes: ['video/mp4','video/x-flv'],   // required
      protocols: [ 2, 3 ],                  // required, set at least 1 value in array
      placement: 1,                         // optional, defaults to 1 when context = instream
      startdelay: 0,                        // optional, defaults to 0 when context = instream
      api: [ 1, 2 ],                        // optional
      skip: 0,                              // optional
      minduration: 5,                       // optional
      maxduration: 30,                      // optional
      playbackmethod: [1,3],                // optional
      battr: [ 13, 14 ],                    // optional
      linearity: 1,                         // optional
      minbitrate: 10,                       // optional
      maxbitrate: 10                        // optional
    }   
  }, 
  bids: [{
    bidder: 'marsmedia',
    params: {
        zoneId: 9999    // required    
    }
  }],
  ...
}
```
