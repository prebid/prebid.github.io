---
layout: page_v2
page_type: module
title: Module - Adpod
description: Enables developers to add support for a new adserver that handles ad pod (long-form) videos.
module_code : adpod
display_name : Adpod
enable_download : true
sidebarType : 1
---

# Adpod Module

{:.no_toc}

* TOC
{:toc}

The adpod module enables developers to add support for a new adserver that handles `adpod` (long-form) videos, like Freewheel.  Specifically, the module provides functions to validate, cache, and modify long-form video bids.

## How to use the module as a publisher

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

## How to use the module as a developer

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

## CPM Adjustments by Deal Tier for CSAI

To enable publishers to prioritize video deals with direct buys and over deals at the same price in the FreeWheel stack two new ad pod configs have been added, `prioritzeDeals` and `dealTier`. To obtain this higher priority the method uses the deal priority tier value that is passed by the bidder. This helps inflate the bid CPM that is passed into FreeWheel and gives it a higher priority.

{: .table .table-bordered .table-striped }
| Parameter  | Scope  | Type  | Description  |
|---|---|---|---|
| prioritizeDeals  |  Optional | Boolean  |  A flag to give a higher preference to deals. This will replace the CPM value within the `hb_pb_cat_dur` key with the `bid.video.dealTier` value.  For example: A bid with `hp_pb_cat_dur` value of `12.00_395_15s` that has a `dealTier.BIDDER.prefix` of tier and a `bid.video.dealTier` value of 6 would have its `hp_pb_cat_dur` value changed to `tier6_395_15s`. |
| dealTier  | Optional  | Object  | The dealTier parameter contains objects which hold information about the minimum deal tier to set for each bidder and the prefix required by that bidder to conduct a deal. This enables each publisher to have line items set up in the ad server with different priorities. See the `dealTier` object below for parameters.  |
| dealTier.BIDDER.prefix  | Optional  | String  | The prefix required by the bidder to indicate this is a deal.  |
| dealTier.BIDDER.minDealTier  | Optional  | Integer  | When an `adpod` is passed with the `prioritizeDeals` flag set to true, a higher preference is given to bids with a deal tier greater than the `minDealTier` setting. As an example, if the `dealTier.BIDDER.minDealTier` is set to 5 than all bids with a `dealTier` greater than or equal to five will be given a higher preference. Bid with a `dealTier` less than five will be considered the same as non-deal bids.   |

### Examples

```javascript
// This will replace the cpm with dealId in cache key as well as targeting kv pair when prioritizeDeals flag is set to true.
pbjs.setConfig({
  adpod: {
    prioritizeDeals: true,
    dealTier: {
      'appnexus': {
        prefix: 'tier',
        minDealTier: 5
      },
      'some-other-bidder': {
        prefix: 'deals',
        minDealTier: 20
      }
    }
  }
})
```

If the bidder returns multiple bid, each bid can have a different priority/deal tier set. To give publishers control over the deal tier a `filterBids` option has been added to `pbjs.adServers.freewheel.getTargeting` to select certain deal bids.

```javascript
pbjs.adServers.freewheel.getTargeting({

    codes: [adUnitCode1],
    callback: function(err, targeting) {
        //pass targeting to player api
    }
});
```

#### Return

```javascript
// Sample return targeting key value pairs
{
  'adUnitCode-1': [
    {
      'hb_pb_cat_dur': 'tier9_400_15s', // Bid with deal id
    },
    {
      'hb_pb_cat_dur': 'tier7_401_15s', // Bid with deal id
    },
    {
      'hb_pb_cat_dur': '15.00_402_15s',
    },
    {
      'hb_cache_id': '123'
    }
  ]
}
```

## Further Reading

[Prebid.js](/dev-docs/getting-started.html)
[Prebid Video](/prebid-video/video-overview.html)  
[Freewheel Module](/dev-docs/modules/freewheel.html)
