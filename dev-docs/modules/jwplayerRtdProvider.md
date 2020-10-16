---
layout: page_v2
title: JW Player Real Time Data Provider
description: makes JW Player's video ad targeting information accessible 
             to Bid Adapters.
page_type: module
module_type: rtd
module_code : jwplayer
enable_download : true
sidebarType : 1
---

# JW Player RTD Provider
{:.no_toc}

* TOC
{:toc}

## Overview

The purpose of this Real Time Data Provider is to allow publishers to target against their JW Player media without 
being forced to integrate with the Player Bidding product. This prebid module makes JW Player's video ad targeting information accessible 
to Bid Adapters.

## Implementation for Publishers:

1) Compile the JW Player RTD Provider into your Prebid build:

`gulp build --modules=jwplayerRtdProvider`

2) Publishers must register JW Player as a real time data provider by using `setConfig` to load a Prebid Config containing a `realTimeData.dataProviders` object:

```javascript
const jwplayerRtdProvider = {
  name: "jwplayer"
};

pbjs.setConfig({
    ...,
    realTimeData: {
      dataProviders: [
          jwplayerRtdProvider
      ]
    }
});
``` 

3) In order to prefetch targeting information for certain media, include the media IDs in the `jwplayerRtdProvider` var before calling `setConfig`:

```javascript
const jwplayerRtdProvider = {
  name: "jwplayer",
  auctionDelay: 1000,
  params: {
    mediaIDs: ['abc', 'def', 'ghi', 'jkl']
  }
};
```

**Note:** `auctionDelay` is required to ensure the auction waits for prefetching to complete.

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'jwplayer' |
| auctionDelay  | Number | Max time in ms that auction will wait for the requested targeting information | Optional. Default to 0. Required to ensure that the auction is delayed until prefetch is complete |
| params | Object | | |
| params.mediaIDs | Array of Strings | Media Ids for prefetching | Optional. |

4) Include the content's media ID and/or the player's ID in the matching AdUnit before calling `addAdUnits`:

```javascript
   const adUnit = {
     code: '/19968336/prebid_native_example_1',
     ...
     jwTargeting: {
       waitForIt: true,
       playerID: 'abcd',
       mediaID: '1234'
     }
   };
   
   pbjs.que.push(function() {
       pbjs.addAdUnits([adUnit]);
       pbjs.requestBids({...});
   });
```

**Note:** `waitForIt` is required to ensure the auction waits for prefetching to complete.

**AdUnit Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| jwTargeting | Object | | |
| jwTargeting.mediaID | String | Media Id of the content associated to the Ad Unit | Optional but highly recommended |
| jwTargeting.playerID | String | Id of the JW Player instance which will render the content associated to the Ad Unit | Optional but recommended |
| jwTargeting.waitForIt | Boolean | Media Ids for prefetching | Optional. Defaults to false. Required to ensure that the auction is delayed until prefetch is complete |

## Implementation for Bid Adapters:

Implement the `buildRequests` function. When it is called, the `bidRequests` param will be an array of bids.
Each bid for which targeting information was found will conform to the following object structure:

```javascript
{
    adUnitCode: 'xyz',
    bidId: 'abc',
    ...,
    jwTargeting: {
      segments: ['123', '456'],
      content: {
        id: 'jw_abc123'
      }
    }
}
```
  
**Bid Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| jwTargeting | Object | | |
| jwTargeting.segments | Array of Strings | jwpseg targeting segments | |
| jwTargeting.content | Object | | |
| content.id | String | Unique identifier for the specific media asset. | |
  
## Example

To view an example:
 
- in the Prebid repo, run in your cli:

`gulp serve --modules=jwplayerRtdProvider`

- in your browser, navigate to:

`http://localhost:9999/integrationExamples/gpt/jwplayerRtdProvider_example.html`

**Note:** the mediaIds in the example are placeholder values; replace them with your existing IDs.