---
layout: page_v2
title: JW Player Real Time Data Provider
display_name: JW Player video ad targeting
description: makes JW Player's video ad targeting information accessible to Bid Adapters.
page_type: module
module_type: rtd
module_code : jwplayerRtdProvider
enable_download : true
sidebarType : 1
---

# JW Player RTD Provider
{:.no_toc}

* TOC
{:toc}

## Overview

The JW Player RTD module passes contextual and performance based information about individual video impression opportunities to bid adapters in order to increase monetization. 
To use this module, you'll need to work with [JW Player](https://www.jwplayer.com/video-monetization/) to get an account and discuss the best integration path.

## Implementation for Publishers:

1) Compile the JW Player RTD Provider into your Prebid build:

`gulp build --modules=jwplayerRtdProvider`

2) Publishers must register JW Player as a Real Time Data provider by using `setConfig` to load a Prebid Config containing a `realTimeData.dataProviders` array:

```javascript
pbjs.setConfig({
    ...,
    realTimeData: {
      auctionDelay: 100,
      dataProviders: [{
          name: "jwplayer",
          waitForIt: true,
          params: {
            mediaIDs: ['abc', 'def', 'ghi', 'jkl']
          }
      }]
    }
});
``` 

3) Optionally, if you would like to prefetch the targeting information for certain media, you must include the media IDs in `params.mediaIDs`, as displayed above. You must also set `waitForIt` to `true` and make sure that a value is set to `realTimeData.auctionDelay`.

`waitForIt` is required to ensure the auction waits for the prefetching of the relvant targeting information to complete. It signals to Prebid that you allow the module to delay the auction if necessary.
Setting an `auctionDelay` in the `realTimeData` object is required to ensure the auction waits for prefetching to complete. The `auctionDelay` is the max time in ms that the auction will wait for the requested targeting information.

**Note:** Though prefetch is optional, we highly recommend enabling it to ensure that the targeting information is available before bids are requested.

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'jwplayer' |
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| params | Object | | |
| params.mediaIDs | Array of Strings | Media Ids for prefetching | Optional |

4) Include the content's media ID and/or the player's ID in the matching AdUnit's `fpd.context.data.jwTargeting` before calling `addAdUnits`:

```javascript
   const adUnit = {
     code: '/19968336/prebid_native_example_1',
     ...,
     ortb2Imp: {
       ext: {
         data: {
           jwTargeting: {
             // Note: the following Ids are placeholders and should be replaced with your Ids.
             playerID: 'abcd',
             mediaID: '1234'
           }
         }
       }
     }
   };
   
   pbjs.que.push(function() {
       pbjs.addAdUnits([adUnit]);
       pbjs.requestBids({...});
   });
```
**Note**: You may also include `jwTargeting` information in the prebid config's `ortb2.site.ext.data`. Information provided in the adUnit will always supersede the information in the config; use the config to set fallback information or information that applies to all adUnits.

**AdUnit Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| ortb2Imp.ext.data.jwTargeting | Object | | |
| ortb2Imp.ext.data.jwTargeting.mediaID | String | Media Id of the content associated to the Ad Unit | Optional but highly recommended |
| ortb2Imp.ext.data.jwTargeting.playerID | String | the ID of the HTML div element used when instantiating the JW Player instance that will render the content associated with the Ad Unit | Optional but recommended. You can retrieve this ID by calling `player.id`, where player is the JW Player instance variable. |

## Implementation for Bid Adapters:

This section contains guidelines for bid adapters that are working with JW Player to utilize the additional targeting.

Those bidders should implement the `buildRequests` function. When it is called, the `bidRequests` param will be an array of bids.
Each bidRequest for which targeting information was found will conform to the following object structure:

```json
{
   adUnitCode: 'xyz',
   bidId: 'abc',
   ...,
   rtd: {
       jwplayer: {
           targeting: {
               segments: ['123', '456'],
               content: {
                   id: 'jw_abc123'
               }
           }
       }   
   }
}
```

Read the bidRequest.jwTargeting object and pass the values to your endpoint as appropriate.
  
**BidRequest Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| rtd.jwplayer.targeting | Object | | |
| rtd.jwplayer.targeting.segments | Array of Strings | jwpseg targeting segments | |
| rtd.jwplayer.targeting.content | Object | | |
| rtd.jwplayer.targeting.content.id | String | Unique identifier for the specific media asset | |
  
## Example

To view an example:
 
- in the Prebid repo, run in your cli:

`gulp serve --modules=jwplayerRtdProvider`

- in your browser, navigate to:

`http://localhost:9999/integrationExamples/gpt/jwplayerRtdProvider_example.html`

**Note:** the mediaIds in the example are placeholder values; replace them with your existing IDs.
