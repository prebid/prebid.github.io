---
layout: bidder
title: 33Across
description: Prebid 33Across Bidder Adapter
pbjs: true
pbs: true
biddercode: 33across
media_types: banner, video, no-native
tcfeu_supported: true
floors_supported: true
schain_supported: true
dchain_supported: false
usp_supported: true
gpp_supported: true
coppa_supported: true
fpd_supported: true
multiformat_supported: will-bid-on-any
safeframes_ok: true
deals_supported: true
prebid_member: true
userIds: all
gvl_id: 58
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `siteId`    | required | Publisher  GUID from 33Across                                                                                                  | `'examplePub123'` | `string` |
| `productId` | required | 33Across Product ID that the Publisher has registered for (use `'siab'` for Banner or Outstream Video , `'inview'` for Adhesion, `'instream'` for Instream Video) | `'siab'`   | `string` |

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
        siteId: 'examplePub123',    // required 
        productId: 'siab|inview'    // required
    }
  }]
}
```

### Ad Unit Setup for Outstream Video

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
      protocols: [ 2, 3 ],                  // required, set at least 1 value in array
      placement: 2,                         // optional, defaults to 2 when context = outstream
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
    bidder: '33across',
    params: {
        siteId: 'examplePub123',    // required     
        productId: 'siab'           // required     
    }
  }],
  ...
}
```

### Ad Unit Setup for Instream Video

```javascript
var adUnits = [
{
  code: '33across-hb-ad-123456-1', // ad slot HTML element ID  
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
    bidder: '33across',
    params: {
        siteId: 'examplePub123',    // required    
        productId: 'instream'       // required     
    }
  }],
  ...
}
```

### Ad Unit Setup for Multi-format: Banner, Video (Outstream)

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
      protocols: [ 2, 3 ],                  // required, set at least 1 value in array
      placement: 2,                         // optional, defaults to 2 when context = outstream
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
    bidder: '33across',
    params: {
        siteId: 'examplePub123',    // required     
        productId: 'siab'           // required     
    }
  }],
  ...
}
```

### SRA Mode

We recommend using SRA mode to optimize the bidding process as this allows our adapter to group together bid requests for Ad Units pertaining to the same product and site ID thereby minimizing the number of http requests made to our endpoint. To enable SRA set the following bidder specific config under 33Across

```
pbjs.setBidderConfig({
   bidders: ['33across'],
   config: {
      ttxSettings: {
        enableSRAMode: true
      }
   }
});
```
