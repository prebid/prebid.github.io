---
layout: bidder
title: 33Across
description: Prebid 33Across Bidder Adapter
hide: true
biddercode: 33across
media_types: banner, video
gdpr_supported: true
schain_supported: true
usp_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `siteId`    | required | Publisher  GUID from 33Across                                                                                                  | `'examplePub123'` | `string` |
| `productId` | required | 33Across Product ID that the Publisher has registered for (use `'siab'` for standard supply, `'inview'` for renderer, `'instream'` for instream video) | `'siab'`   | `string` |

### Ad Unit Setup for Banner
```javascript
var adUnits = [
{
  code: '33across-hb-ad-123456-1', // ad slot HTML element ID  
  mediaTypes: {
    banner: {  
      sizes: [
          [300, 250], 
          [728, 90]
      ]
    }   
  } 
  bids: [{
    bidder: '33across',
    params: {
        siteId: 'cxBE0qjUir6iopaKkGJozW',    // required 
        productId: 'siab|inview'             // required
    }
  }]
}
``` 

### Ad Unit Setup for Video: Outstream
```javascript
var adUnits = [
{
  code: '33across-hb-ad-123456-1', // ad slot HTML element ID  
  mediaTypes: {
    video: {                                // We recommend setting the following video params
                                            // in Ad Unit rather than bidder params as per Prebid 4.0 recommendation. 
      playerSize: [300, 250],               // required
      context: 'outstream',                 // required
      mimes: ['video/mp4','video/x-flv'],   // required
      placement: 2,                         // optional defaults to 2 for outstream
      api: [ 1, 2 ],                        // optional
      protocols: [ 2, 3 ],                  // optional
      skippable: true,                      // optional
      minduration: 5,                       // optional
      maxduration: 30,                      // optional
      playbackmethod: [1,3],                // optional
      battr: [ 13, 14 ],                    // optional
      linearity: 1,                         // optional
      placement: 2,                         // optional
      minbitrate: 10,                       // optional
      maxbitrate: 10                        // optional
    }   
  }, 
  bids: [{
    bidder: '33across',
    params: {
        siteId: 'cxBE0qjUir6iopaKkGJozW',     
        productId: 'siab'     
    }
  }],
  ...
}
```

### Ad Unit Setup for Video: Instream
```javascript
var adUnits = [
{
  code: '33across-hb-ad-123456-1', // ad slot HTML element ID  
  mediaTypes: {
    video: {                                // We recommend setting the following video params
                                            // in Ad Unit rather than bidder params as per Prebid 4.0 recommendation. 
      playerSize: [300, 250],               // required
      context: 'outstream',                 // required
      mimes: ['video/mp4','video/x-flv'],   // required
      placement: 2,                         // optional, defaults to 1 for outstream
      startdelay: 0,                        // optional, defaults to 0 for instream
      api: [ 1, 2 ],                        // optional
      protocols: [ 2, 3 ],                  // optional
      skippable: true,                      // optional
      minduration: 5,                       // optional
      maxduration: 30,                      // optional
      playbackmethod: [1,3],                // optional
      battr: [ 13, 14 ],                    // optional
      linearity: 1,                         // optional
      placement: 2,                         // optional
      minbitrate: 10,                       // optional
      maxbitrate: 10                        // optional
    }   
  }, 
  bids: [{
    bidder: '33across',
    params: {
        siteId: 'cxBE0qjUir6iopaKkGJozW',     
        productId: 'siab'     
    }
  }],
  ...
}
```

### Ad Unit Setup for Mult-format: Banner, Video (Outstream only)
```javascript
var adUnits = [
{
  code: '33across-hb-ad-123456-1', // ad slot HTML element ID  
  mediaTypes: {
    banner: {  
      sizes: [
          [300, 250], 
          [728, 90]
      ]
    },
    video: {                                // We recommend setting the following video params
                                            // in Ad Unit rather than bidder params as per Prebid 4.0 recommendation. 
      playerSize: [300, 250],               // required
      context: 'outstream',                 // required
      mimes: ['video/mp4','video/x-flv'],   // required
      placement: 2,                         // optional defaults to 2 for outstream
      api: [ 1, 2 ],                        // optional
      protocols: [ 2, 3 ],                  // optional
      skippable: true,                      // optional
      minduration: 5,                       // optional
      maxduration: 30,                      // optional
      playbackmethod: [1,3],                // optional
      battr: [ 13, 14 ],                    // optional
      linearity: 1,                         // optional
      placement: 2,                         // optional
      minbitrate: 10,                       // optional
      maxbitrate: 10                        // optional
    }   
  }, 
  bids: [{
    bidder: '33across',
    params: {
        siteId: 'cxBE0qjUir6iopaKkGJozW',     
        productId: 'siab'     
    }
  }],
  ...
}
```

