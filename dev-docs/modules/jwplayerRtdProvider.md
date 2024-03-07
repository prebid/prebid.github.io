---
layout: page_v2
title: JW Player Real Time Data Provider
display_name: JW Player video ad targeting
description: makes JW Player's video ad targeting information accessible to Bid Adapters.
page_type: module
module_type: rtd
module_code : jwplayerRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# JW Player RTD Provider

{:.no_toc}

* TOC
{:toc}

## Overview

The JW Player RTD module passes contextual and performance based information about individual video impression opportunities to bid adapters in order to increase monetization.
To use this module, you'll need to work with [JW Player](https://www.jwplayer.com/video-monetization/) to get an account and discuss the best integration path.

## Implementation for Publishers

1. Compile the JW Player RTD Provider into your Prebid build:

    ```bash
    gulp build --modules=jwplayerRtdProvider
    ```

2. Publishers must register JW Player as a Real Time Data provider by using `setConfig` to load a Prebid Config containing a `realTimeData.dataProviders` array:

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

3. Optionally, if you would like to prefetch the targeting information for certain media, you must include the media IDs in `params.mediaIDs`, as displayed above. You must also set `waitForIt` to `true` and make sure that a value is set to `realTimeData.auctionDelay`.

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

4. Include the content's media ID and/or the player's ID in the matching AdUnit's `fpd.context.data.jwTargeting` before calling `addAdUnits`:

    ```javascript
    const adUnit = {
      code: '/19968336/prebid_native_example_1',
      ...,
      ortb2Imp: {
        ext: {
          data: {
            jwTargeting: {
              // Note: the following Ids are placeholders and should be replaced with your Ids.
              playerDivId: 'abcd',
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
| ortb2Imp.ext.data.jwTargeting.playerDivId | String | the ID of the HTML div element used when instantiating the JW Player instance that will render the content associated with the Ad Unit | Optional but recommended. You can retrieve this ID by calling `player.id`, where player is the JW Player instance variable. |
| ortb2Imp.ext.data.jwTargeting.playerID | String | Deprecated as of 8.40.0 - use playerDivId instead | |

## Implementation for Bid Adapters

This section contains guidelines for bid adapters that are working with JW Player to utilize the additional targeting.

Those bidders should implement the `buildRequests` function. When it is called, the `bidRequests` param will be an array of bids.
Each bidRequest for which targeting information was found will conform to the following object structure:

```javascript
{
  adUnitCode: 'xyz',
  bidId: 'abc',
  ...,
  ortb2: {
    site: {
      content: {
        id: 'jw_abc123',
        title: 'media title',
        url: 'https:www.cdn.com/media.mp4',
        data: [
          {
            name: 'jwplayer.com',
            ext: {
              segtax: 502,
              cids: ['abc123']
            },
            segment: [
              {
                id: '123'
              },
              {
                id: '456'
              }
            ]
          }
        ],
        ext: {
          description: 'media description'
        }
      }
    }
  }
}
```

Each bid for which targeting information was found will have a ortb2 param conforming to the [oRTB v2 object structure](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf). The `ortb2` object will contain our proprietaty targeting segments in a format compliant with the [IAB's segment taxonomy structure](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/extensions/community_extensions/segtax.md).

The content's ID can be obtained in the `bid.ortb2.site.content.id` property path and the targeting segments can be found in `bid.ortb2.site.content.data.segment`.
  
**BidRequest Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| ortb2.site.content | Object | | |
| ortb2.site.content.id | String | Unique identifier for the specific media asset | |
| ortb2.site.content.url | String | URL for the specific media asset | |
| ortb2.site.content.title | String | The title of the media content | |
| ortb2.site.content.ext.description | String | The description of the media content | |
| ortb2.site.content.data | Array | Contains segment taxonomy objects | |
| ortb2.site.content.data[index].name | String | the `jwplayer.com` string indicating the provider name | |
| ortb2.site.content.data[index].ext.segtax | Integer | the `502` value is the unique identifier for JW Player's proprietary taxonomy | |
| ortb2.site.content.data[index].ext.cids | Array | List of extended content ids as defined in [oRTB's community extensions](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/extensions/community_extensions/extended-content-ids.md#example---content-id-and-seller-defined-context). | |
| ortb2.site.content.data[index].segment | Array | Contains the segment taxonomy values as an object | |
| ortb2.site.content.data[index].segment[index].id | String | String representation of the data segment value | |

## Example

To view an example:

* in the Prebid repo, run in your cli:

`gulp serve --modules=jwplayerRtdProvider`

* in your browser, navigate to:

`http://localhost:9999/integrationExamples/gpt/jwplayerRtdProvider_example.html`

**Note:** the mediaIds in the example are placeholder values; replace them with your existing IDs.
