---
layout: page_v2
title: Show OTT Video Ads with Prebid
description: Show OTT Video Ads with Prebid
sidebarType: 4
---

# Show OTT Video Ads with Prebid

{: .no_toc}

In this tutorial, we'll detail how to set up Prebid.js to display a Programmatic OTT with Prebid (POP) video ad (ad pod) from Google Ad Manager (GAM).

* TOC
{:toc }

## Prerequisites

The code example below was built with Prebid.js and the following:

* At least one video-enabled bidder supporting `adpod`.  
* The [`dfpAdServerVideo` module](/dev-docs/modules/dfp_video.html), which will provide the video ad support.  
* The [`categoryTranslation` module](/dev-docs/modules/categoryTranslation.html), to enable competitive separation.

For example, to build with the AppNexus bidder adapter and GAM use the following command:

```bash
gulp build --modules=appnexusBidAdapter,dfpAdServerVideo
```

For more information about how to build with modules, see the [Prebid module documentation](/dev-docs/modules/).

{% include alerts/alert_important.html content="If competitve separation is required the optional [`categoryTranslation` module](/dev-docs/modules/categoryTranslation.html) needs to be added to the build command." %}

{% include alerts/alert_important.html content="Ensure your ad ops team has set up line items in Google Ad Manager." %}

## Ad Pod Module

When the [`dfpAdServerVideo` module](/dev-docs/modules/dfp_video.html) is included in the Prebid.js build, the [Ad Pod module](/dev-docs/modules/adpod.html), for working with ad pods, is automatically included. This module enables developers to add support for an adserver, like Google Ad Manager or Freewheel, that handles ad unit types of adpod. Specifically, the module provides functions to validate, cache, and modify long-form video bids.

## Implementation

This section provides information on how to implement and configure Prebid.js to display ad unit types of adpod.

### 1. Create an ad unit

Create an ad unit that contains a video `mediaType` object and set the `mediaTypes.video.context` to `adpod`. Set the other parameters to the specific properties for the publisher's inventory.

{% include alerts/alert_warning.html content="Make sure you replace the `placementId` in the sample with a proper `placementId`." %}

```javascript
var videoAdUnit = [{
    code: 'sample-code',
    sizes: [640,480],
    mediaTypes: {
        video: {
            context: 'adpod',
            playerSize: [640, 480],
            adPodDurationSec: 300,
            durationRangeSec: [15, 30],
            requireExactDuration: true
        }
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 14542875
            }
        }
    ]
}]
```

### 2. Get ad pod targeting

If a publisher wants to retrieve ad pod targeting and create the master tag themselves they can use the getAdPodTargeting method of the `dfpAdServerVideo` module. The method requires an array of ad unit codes and returns targeting key values and the cache id as JSON.

Example:

```javascript
pbjs.adServers.dfp.getAdpodTargeting({
  codes: ['adUnitcode-1'],
  callback: function(err, targeting) {
    // Pass targeting to publisher api which will construct the master tag
  }
});
```

Sample return:

```json
{
  "adUnitCode-1": [
    {
      "hb_pb_cat_dur": "10.00_<label>_15s"
    },
    {
      "hb_pb_cat_dur": "15.00_<label>_30s"
    },
    {
      "hb_cache_id": "123"
    }
  ]
}
```

#### getAdpodTargeting parameters

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description |
| --- | --- | --- | --- |
| codes | Required | [string] | An array of `adunit` codes. |
| callback | Required | function | Call back function to pass targeting `key-values` to publisher API for construction of the master tag. |

**3. Configuring for competitve exclusion**  
Competitive exclusion is the process of preventing ads in the same industry group from appearing either in the same ad pod or adjacent to each other in the same ad pod. To enable competitive exclusion Prebid.js will need to be configured properly.  

After you have instantiated a Prebid instance, call the setConfig method and add the following key-values.

```javascript
pbjs.setConfig({
  'adpod': {
    'brandCategoryExclusion': true
  }
});
```

When this setting is enabled, it requires the bidder to include a brand category id on the incoming adpod bids (otherwise the bid is rejected). The bid’s brand category will be processed and transformed to the corresponding brand category used by the publisher’s adserver (see the [Category Translation module page](/dev-docs/modules/categoryTranslation.html) for more details). The transformed brand category is then used in the bid caching process and targeting keys that get sent to the adserver for the winning bid(s).

Publishers need to provide a mapping file that will convert IAB sub categories to their labels. Publishers can set the mapping file using:

```javascript
pbjs.setConfig({
    "brandCategoryTranslation": {
        "translationFile": "<url_to_file>"
    }
});
```

Publishers should ensure that the JSON returned from their custom translation file is valid for Prebid by adhering to the following structure:

```json
{
    "mapping": {
        "<your-iab-sub-category>": {
            "id": "<label id or name>",
            "name": "<label name>"
        },
   }
}
```

Your ad ops team will need to add labels to the line item to indicate which industries will be included in your competitive exclusion.

Here is an example of the targeting key’s value with the setting enabled (where 123 is the brand category id):

```javascript
hb_pb_cat_dur = '10.00_123_10s'
```

When the setting is disabled (which is the default state), bidder’s don’t have to supply a brand category on the `adpod` bids. The category part of the bid caching is not included and is not within the generated targeting keys.

The following is an example of the targeting keys with the setting not enabled:

```javascript
hb_pb_cat_dur = '10.00_10s'
```

### 4. Implement Custom Price Buckets

By default, Prebid.js caps all CPMs at $20. With sell side video there may be an expecation to see CPMs over $20. In order to receive those bids, custom price buckets need to be implemented by setting the [priceGranularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity) object of the `setConfig` method.

For instructions on setting custom price buckets, view the [Custom Price Granularity Buckets](/dev-docs/examples/custom-price-buckets.html) documentation on prebid.org.

### 5. Send request for bids and build video URL

The `dfpAdServerVideo` module provides a method, `buildAdpodVideoUrl`, that combines publisher-provided parameters with Prebid.js targeting key values to build a GAM video ad tag URL that can be used by a video player.

In the example below the callback in the `bidsBackHandler` returns the video ad tag needed by the video player.

```javascript
pbjs.que.push(function(){
    pbjs.addAdUnits(videoAdUnit);
    pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        },
        adpod: {
            brandCategoryExclusion: true
        },
        brandCategoryTranslation: {
            translationFile: "https://mymappingfile.com/mapping.json"
        }
    });

    pbjs.requestBids({
        bidsBackHandler: function(bids) {
            pbjs.adServers.dfp. buildAdpodVideoUrl({
                codes: ['sample-code'],
                params: {
                    iu: '/123456/testing/prebid.org/adunit1',
                    description_url: 'https://mycontent.com/episode-1'
                },
                callback: function(err, masterTag) {
                    // Invoke video player and pass the master tag
                }
            });
        }
    });
});
```

{% include alerts/alert_warning.html content="Set the `pbjs.setConfig.cache.url` to the URL that will return the cached VAST XML. " %}

#### buildAdpodVideoUrl parameters

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description |
| --- | --- | --- | --- |
| iu | Required | string | `adunit` |
| description_url | Required | string | The value should describe the video playing on the page. |

{% include alerts/alert_important.html content="For `adpod`, Prebid.js will add key-value strings for multiple bids. This prevents retrieving the description url from bid." %}

Understanding the arguments to this method is especially important if you plan to pass any custom parameters to GAM. The params key in the argument to `buildAdpodVideoUrl` supports all parameters from the GAM API.

## Further Reading

[Prebid API Reference](/dev-docs/publisher-api-reference.html)  
[Prebid.js Video Overview](/prebid-video/video-overview.html)  
[Prebid.js Long Form (Ad Pod) Video](/prebid-video/video-long-form.html)
