---
layout: api_prebidjs
title: pbjs.setConfig(options)
description:
---


`setConfig` supports a number of configuration options. Every
call to setConfig overwrites supplied values at the top level. e.g. if `ortb2` is provided as a value, any previously-supplied `ortb2` values will disappear.
If this is not the desired behavior, there is a [`mergeConfig()`](mergeConfig.html) function that will preserve previous values to do not conflict with the newly supplied values.

See below for usage examples.

Core config:

+ [Debugging](#setConfig-Debugging)
+ [Device Access](#setConfig-deviceAccess)
+ [Bidder Timeouts](#setConfig-Bidder-Timeouts)
+ [Max Requests Per Origin](#setConfig-Max-Requests-Per-Origin)
+ [Disable Ajax Timeout](#setConfig-Disable-Ajax-Timeout)
+ [Set Timeout Buffer](#setConfig-timeoutBuffer)
+ [Turn on send all bids mode](#setConfig-Send-All-Bids)
+ [Configure send bids control](#setConfig-Send-Bids-Control)
+ [Bid cache](#setConfig-Use-Bid-Cache)
+ [Set the order in which bidders are called](#setConfig-Bidder-Order)
+ [Set the page URL](#setConfig-Page-URL)
+ [Set price granularity](#setConfig-Price-Granularity)
+ [Set media type price granularity](#setConfig-MediaType-Price-Granularity)
+ [Configure server-to-server header bidding](#setConfig-Server-to-Server)
+ [Configure user syncing](#setConfig-Configure-User-Syncing)
+ [Configure targeting controls](#setConfig-targetingControls)
+ [Configure responsive ad units with `sizeConfig` and `labels`](#setConfig-Configure-Responsive-Ads)
+ [COPPA](#setConfig-coppa)
+ [First Party Data](#setConfig-fpd)
+ [Caching VAST XML](#setConfig-vast-cache)
+ [Site Metadata](#setConfig-site)
+ [Disable performance metrics](#setConfig-performanceMetrics)
+ [Generic Configuration](#setConfig-Generic-Configuration)
+ [Troubleshooting configuration](#setConfig-Troubleshooting-your-configuration)

Module config: other options to `setConfig()` are available if the relevant module is included in the Prebid.js build.

+ [Currency module](/dev-docs/modules/currency.html)
+ [Consent Management](/dev-docs/modules/consentManagement.html#page-integration)
+ [User ID module](/dev-docs/modules/userId.html#configuration)
+ [Adpod](/dev-docs/modules/adpod.html)
+ [IAB Category Translation](/dev-docs/modules/categoryTranslation.html)

<a name="setConfig-Debugging" />

#### Debugging

Debug mode can be enabled permanently in a page if desired. In debug mode,
Prebid.js will post additional messages to the browser console and cause Prebid Server to
return additional information in its response. If not specified, debug is off.
Note that debugging can be specified for a specific page view by adding
`pbjs_debug=true` to the URL's query string. e.g. <code>/pbjs_demo.html?pbjs_debug=true</code> See [Prebid.js troubleshooting guide](/troubleshooting/troubleshooting-guide.html) for more information.

Turn on debugging permanently in the page:
{% highlight js %}
pbjs.setConfig({ debug: true });
{% endhighlight %}

{: .alert.alert-warning :}
Note that turning on debugging for Prebid Server causes most server-side adapters to consider it a test request, meaning that they won't count on reports.

<a name="setConfig-deviceAccess" />

#### Device Access

You can prevent Prebid.js from reading or writing cookies or HTML localstorage by setting this flag:

{% highlight js %}
pbjs.setConfig({ deviceAccess: false });
{% endhighlight %}

This can be useful in GDPR, CCPA, COPPA or other privacy scenarios where a publisher has determined that header bidding should not read from or write the user's device.

<a name="setConfig-Bidder-Timeouts" />

#### Bidder Timeouts

Set a global bidder timeout:

{% highlight js %}
pbjs.setConfig({ bidderTimeout: 3000 });
{% endhighlight %}

{: .alert.alert-warning :}
**Bid Timeouts and JavaScript Timers**
Note that it's possible for the timeout to be triggered later than expected, leading to a bid participating in the auction later than expected.  This is due to how [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) works in JS: it queues the callback in the event loop in an approximate location that *should* execute after this time but *it is not guaranteed*.
With a busy page load, bids can be included in the auction even if the time to respond is greater than the timeout set by Prebid.js.  However, we do close the auction immediately if the threshold is greater than 200ms, so you should see a drop off after that period.
For more information about the asynchronous event loop and `setTimeout`, see [How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/).

#### Max Requests Per Origin

<a name="setConfig-Max-Requests-Per-Origin" />

Since browsers have a limit of how many requests they will allow to a specific domain before they block, Prebid.js
will queue auctions that would cause requests to a specific origin to exceed that limit.  The limit is different
for each browser. Prebid.js defaults to a max of `4` requests per origin.  That value can be configured with
`maxRequestsPerOrigin`.

{% highlight js %}
// most browsers allow at least 6 requests, but your results may vary for your user base.  Sometimes using all
// `6` requests can impact performance negatively for users with poor internet connections.
pbjs.setConfig({ maxRequestsPerOrigin: 6 });

// to emulate pre 1-x behavior and have all auctions queue (no concurrent auctions), you can set it to `1`.
pbjs.setConfig({ maxRequestsPerOrigin: 1 });
{% endhighlight %}

#### Disable Ajax Timeout

<a name="setConfig-Disable-Ajax-Timeout" />

Prebid core adds a timeout on XMLHttpRequest request to terminate the request once auction is timedout. Since Prebid is ignoring all the bids after timeout it does not make sense to continue the request after timeout. However, you have the option to disable this by using `disableAjaxTimeout`.

{% highlight js %}
pbjs.setConfig({ disableAjaxTimeout: true });
{% endhighlight %}

#### Set Timeout Buffer

<a name="setConfig-timeoutBuffer" />

Prebid core adds a timeout buffer to extend the time that bidders have to return a bid after the auction closes. This buffer is used to offset the "time slippage" of the setTimeout behavior in browsers. Prebid.js sets the default value to 400ms. You can change this value by setting `timeoutBuffer` to the amount of time you want to use. The following example sets the buffer to 300ms.

{% highlight js %}
pbjs.setConfig({ timeoutBuffer: 300 });
{% endhighlight %}

#### Send All Bids

<a name="setConfig-Send-All-Bids" />

When enableSendAllBids is **true** (the default), the page will send keywords for all bidders to your ad server. The ad server can then make the decision on which bidder will win. Some ad servers, such as Google Ad Manager, can then generate reporting on historical bid prices from all bidders.

However, there will be a set of ad server targeting values for each bidder, so if you run many bidders this could cause an issue with how much data is being sent to the ad server.

There are several ways to address the issue of sending too much data to the ad server:

1. Set `enableSendAllBids` to **false**. This will minimize the number of targeting variables sent to the ad server; only the top bid will be sent.
1. Define the `auctionKeyMaxChars` setting. This allows you to establish a limit on the number of bytes sent to the ad server. See [targetingControls](#setConfig-targetingControls) for more details.
1. Set `enableSendAllBids` to **false** and `targetingControls.alwaysIncludeDeals` to **true**. This will send the top bid and any deals.
1. Set `enableSendAllBids` to **false**, `targetingControls.alwaysIncludeDeals` to **true**, and `auctionKeyMaxChars`. This will send the top bid and any deals up to the maximum number of characters.

Note that targeting config must be set before either `pbjs.setTargetingForGPTAsync()` or `pbjs.getAdserverTargeting()` is called.

##### Example results where enableSendAllBids is true

{% highlight bash %}
{
  "hb_adid_audienceNetw": "1663076dadb443d",
  "hb_pb_audienceNetwor": "9.00",
  "hb_size_audienceNetw": "300x250",
  "hb_format_audienceNe": "banner",
  "hb_source_audienceNe": "client",
  "hb_adid_rubicon": "3485968928",
  "hb_pb_rubicon": "8.00",
  "hb_size_rubicon": "300x250",
  "hb_deal_rubicon": "11111111",
  "hb_format_rubicon": "banner",
  "hb_source_rubicon": "client",
  "hb_adid_appnexus": "191f4aca0c0be8",
  "hb_pb_appnexus": "10.00",
  "hb_size_appnexus": "300x250",
  "hb_format_appnexus": "banner",
  "hb_source_appnexus": "client",
  // the winning bid is copied to attributes without a suffix
  "hb_bidder": "appnexus",
  "hb_adid": "191f4aca0c0be8",
  "hb_pb": "10.00",
  "hb_size": "300x250",
  "hb_format": "banner"
}
{% endhighlight %}

You can see how the number of ad server targeting variable could get large
when many bidders are present.

{% capture noteAlert %}
The Prebid recommendation is to leave `enableSendAllBids` as **true** when ad server targeting volume is not a concern. This approach is more transparent and leaves the decisioning in the ad server.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

##### Example of setting enableSendAllBids to false

Turning off `enableSendAllBids` will cause the system to return only the
winning bid. However, this could be a problem if you need to support [deals](/adops/deals.html), as often a deal may be chosen to win over an open market bid.

To make sure that deal bids are sent along with the winning bid in the enableSendAllBids:false scenario, use the `alwaysIncludeDeals` flag that's part of [targetingControls](#setConfig-targetingControls):

```javascript
pbjs.setConfig({
  enableSendAllBids: false,
  targetingControls: {
    alwaysIncludeDeals: true
  }
});
```

<a name="setConfig-Bidder-Order" />

#### Configure Send Bids Control

<a name="setConfig-Send-Bids-Control" />

The `sendBidsControl` object passed to `pbjs.setConfig` provides the publisher with the ability to adjust the targeting behavior when [sendAllBids](#setConfig-Send-All-Bids) is enabled.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description             |
|------------+---------+---------------------------------|
| `bidLimit` | integer | The maximum number of bids the system can add to ad server targeting. |
| `dealPrioritization` | boolean | When `true`, bids with deals are prioritized before bids without deals. |

##### Details on the bidLimit setting

Below is an example config containing `bidLimit`:

```javascript
pbjs.setConfig({
  sendBidsControl: {
    bidLimit: 2
  }
});
```
When this property is set, the value assigned to `bidLimit` is the maximum number of bids that will be sent to the ad server. If `bidLimit` is set to 0, sendAllBids will have no maximum bid limit and *all* bids will be sent. This setting can be helpful if you know that your ad server has a finite limit to the amount of query characters it will accept and process.

{: .alert.alert-info :}
Note that this feature overlaps and can be used in conjunction with [targetingControls.auctionKeyMaxChars](#setConfig-targetingControls). Please see that section for tips on controlling the number of characters being sent to the ad server.

#### Use Bid Cache

<a name="setConfig-Use-Bid-Cache" />

Prebid.js currently allows for [caching and reusing bids in a very narrowly defined scope](/dev-docs/faq.html#does-prebidjs-cache-bids).
However, if you'd like, you can disable this feature and prevent Prebid.js from using anything but the latest bids for
a given auction.

{: .alert.alert-warning :}
This option is available in version 1.39 as true-by-default and became false-by-default as of Prebid.js 2.0. If you want to use this
feature in 2.0 and later, you'll need to set the value to true.

{% highlight js %}
pbjs.setConfig({ useBidCache: true })
{% endhighlight %}


#### Bid Cache Filter Function

<a name="setConfig-Bid-Cache-Filter-Function" />

When [Bid Caching](#setConfig-Use-Bid-Cache) is turned on, a custom Filter Function can be defined to gain more granular control over which "cached" bids can be used.  This function will only be called for "cached" bids from previous auctions, not "current" bids from the most recent auction.  The function should take a single bid object argument, and return `true` to use the cached bid, or `false` to not use the cached bid.  For Example, to turn on Bid Caching, but exclude cached video bids, you could do this:

{% highlight js %}
pbjs.setConfig({
    useBidCache: true,
    bidCacheFilterFunction: bid => bid.mediaType !== 'video'
});
{% endhighlight %}


#### Bidder Order

Set the order in which bidders are called:

{% highlight js %}
pbjs.setConfig({ bidderSequence: "fixed" })   /* default is "random" */
{% endhighlight %}

<a name="setConfig-Page-URL" />

#### Page URL

Override the Prebid.js page referrer for some bidders.

{% highlight js %}
pbjs.setConfig({ pageUrl: "https://example.com/index.html" })
{% endhighlight %}


<a name="setConfig-Price-Granularity" />

#### Price Granularity

This configuration defines the price bucket granularity setting that will be used for the `hb_pb` keyword.

{% highlight js %}
pbjs.setConfig({ priceGranularity: "medium" })
{% endhighlight %}

Standard values:

+ `"low"`: $0.50 increments, capped at $5 CPM
+ `"medium"`: $0.10 increments, capped at $20 CPM (the default)
+ `"high"`: $0.01 increments, capped at $20 CPM
+ `"auto"`: Applies a sliding scale to determine granularity as shown in the [Auto Granularity](#autoGranularityBucket) table below.
+ `"dense"`: Like `"auto"`, but the bid price granularity uses smaller increments, especially at lower CPMs.  For details, see the [Dense Granularity](#denseGranularityBucket) table below.
+ `customConfigObject`: If you pass in a custom config object (as shown in the [Custom CPM Bucket Sizing](#customCPMObject) example below), you can have much finer control over CPM bucket sizes, precision, and caps.

<a name="autoGranularityBucket"></a>

##### Auto Granularity

{: .table .table-bordered .table-striped }
| CPM                 | 	Granularity                  |  Example |
|---------------------+----------------------------------+--------|
| CPM <= $5            | 	$0.05 increments             | $1.87 floored to $1.85 |
| CPM <= $10 and > $5  | 	$0.10 increments             | $5.09 floored to $5.00 |
| CPM <= $20 and > $10 | 	$0.50 increments             | $14.26 floored to $14.00 |
| CPM > $20           | 	Caps the price bucket at $20 | $24.82 floored to $20.00 |

<a name="denseGranularityBucket"></a>

##### Dense Granularity

{: .table .table-bordered .table-striped }
| CPM        | 	Granularity                  | Example |
|------------+-------------------------------+---------|
| CPM <= $3  | 	$0.01 increments             | $1.87 floored to $1.87 |
| CPM <= $8 and >$3  | 	$0.05 increments             | $5.09 floored to $5.05 |
| CPM <= $20 and >$8 | 	$0.50 increments             | $14.26 floored to $14.00 |
| CPM >  $20 | 	Caps the price bucket at $20 | $24.82 floored to $20.00 |

<a name="customCPMObject"></a>

##### Custom CPM Bucket Sizing

To set up your own custom CPM buckets, create an object like the following, and pass it into `setConfig`:

```javascript
const customConfigObject = {
  "buckets" : [{
      "precision": 2,  //default is 2 if omitted - means 2.1234 rounded to 2 decimal places = 2.12
      "max" : 5,
      "increment" : 0.01  // from $0 to $5, 1-cent increments
    },
    {
      "max" : 8,
      "increment" : 0.05  // from $5 to $8, round down to the previous 5-cent increment
    },
    {
      "max" : 40,
      "increment" : 0.5   // from $8 to $40, round down to the previous 50-cent increment
    }]
};

//set custom config object
pbjs.setConfig({
    priceGranularity: customConfigObject
})
```

Here are the rules for CPM intervals:

- `max` and `increment` must be specified
- A range's minimum value is assumed to be the max value of the previous range. The first interval starts at a min value of 0.
- `precision` is optional and defaults to 2

{% capture warning-granularity %}
As of Prebid.js 3.0, the 'min' parameter is no longer supported in custom granularities.
<br/>
<br/>
Also note an important idiosyncracy of the way that price ranges are supported: the
interval starts at the min value, and the max of one range defines the min of the next range.
So if the second interval defines an implicit min of 0.99 and goes to 5 with an increment of 0.05, Prebid.js will generate the values: 0.99, 1.04, 1.09, etc.
<br/>
<br/>
This implies that ranges should have max values that are really the min value of next range.
{% endcapture %}

{% include alerts/alert_warning.html content=warning-granularity %}


<a name="setConfig-MediaType-Price-Granularity" />

#### Media Type Price Granularity

The standard [Prebid price granularities](#setConfig-Price-Granularity) cap out at 20, which isn't always convenient for video ads, which can command more than that. One solution is to set up a custom price
granularity as described above. Another approach is to use
`mediaTypePriceGranularity` config that may be set to define different price bucket
structures for different types of media:
- for each of five media types: banner, video, video-instream, video-outstream, and native.
- it is recommended that defined granularities be custom. It's possible to define "standard" granularities (e.g. "medium"), but it's not possible to mix both custom and standard granularities.

{% highlight js %}
const customPriceGranularityVideo = {
            'buckets': [
              { 'precision': 2, 'max': 5, 'increment': 0.25 },
              { 'precision': 2, 'max': 20, 'increment': 0.5 },
              { 'precision': 2, 'max': 100, 'increment': 1 }
            ]
};
const customPriceGranularityBanner = {
            'buckets': [
              { 'precision': 2, 'max': 5, 'increment': 0.5 },
              { 'precision': 2, 'max': 20, 'increment': 1 }
            ]
};

pbjs.setConfig({'mediaTypePriceGranularity': {
          'video': customPriceGranularity,   // used as default for instream video
	  'video-outstream': customPriceGranularityBanner,
          'banner': 'customPriceGranularityBanner'
        }
});
{% endhighlight %}

Any `mediaTypePriceGranularity` setting takes precedence over `priceGranularity`.

{: .alert.alert-warning :}
mediaTypePriceGranularity works in two modes: either auctions contain adunits with a single media type, or all defined price granularities are custom.
i.e. You cannot run an auction containing a mix of mediatypes across an adunit AND having a mix of "custom" and "standard" price granularities across mediatypes.

{: .alert.alert-info :}
Note that mediaTypePriceGranularity is the only place that 'video-outstream' or 'video-instream'
are recognized. This was driven by the recognition that outstream often shares line items with banner.
If the mediatype is video, the price bucketing code further looks at the context (e.g. outstream) to see if there's
a price granularity override. If it doesn't find 'video-outstream' defined, it will then look for just 'video'.

<a name="setConfig-Server-to-Server" />

#### Server to Server

See the [Prebid Server module](/dev-docs/modules/prebidServer.html).

<a name="setConfig-app" />

#### Mobile App Post-Bid

To support [post-bid](/overview/what-is-post-bid.html) scenarios on mobile apps, the
prebidServerBidAdapter module recognizes the `app` config object to
forward details through the server:

{% highlight js %}
pbjs.setConfig({
   app: {
      bundle: "org.prebid.mobile.demoapp",
      domain: "prebid.org"
   }
{% endhighlight %}

<a name="setConfig-Configure-User-Syncing" />

#### Configure User Syncing

The user sync configuration options described in this section give publishers control over how adapters behave with respect to dropping pixels or scripts to cookie users with IDs.
This practice is called "user syncing" because the aim is to let the bidders match IDs between their cookie space and the DSP's cookie space.
There's a good reason for bidders to be doing this -- DSPs are more likely to bid on impressions where they know something about the history of the user.
However, there are also good reasons why publishers may want to control the use of these practices:

- *Page performance*: Publishers may wish to move ad-related cookie work to much later in the page load after ads and content have loaded.
- *User privacy*: Some publishers may want to opt out of these practices even though it limits their users' values on the open market.
- *Security*: Publishers may want to control which bidders are trusted to inject images and JavaScript into their pages.

{: .alert.alert-info :}
**User syncing default behavior**
If you don't tweak any of the settings described in this section, the default behavior of Prebid.js is to wait 3 seconds after the auction ends, and then allow every adapter to drop up to 5 image-based user syncs.

For more information, see the sections below.

- [User Sync Properties](#setConfig-ConfigureUserSyncing-UserSyncProperties)
- [User Sync Examples](#setConfig-ConfigureUserSyncing-UserSyncExamples)
- [How User Syncing Works](#setConfig-ConfigureUserSyncing-HowUserSyncingWorks)

<a name="setConfig-ConfigureUserSyncing-UserSyncProperties" />

##### User Sync Properties

For descriptions of all the properties that control user syncs, see the table below.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description                                                                                             |
|------------------+---------+---------------------------------------------------------------------------------------------------------|
| `syncEnabled`    | Boolean | Enable/disable the user syncing feature. Default: `true`.  |
| `filterSettings` | Object  | Configure lists of adapters to include or exclude their user syncing based on the pixel type (image/iframe). |
| `syncsPerBidder` | Integer | Number of registered syncs allowed per adapter. Default: `5`. To allow all, set to `0`. |
| `syncDelay`      | Integer | Delay in milliseconds for user syncing (both bid adapter user sync pixels and [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) ID providers) after the auction ends. Default: `3000`. Ignored by the [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) if auctionDelay > 0. |
| `auctionDelay`   | Integer | Delay in milliseconds of the auction to retrieve user ids via the [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) before the auction starts. Continues auction once all IDs are retrieved or delay times out. Does not apply to bid adapter user sync pixels. Default: `0`. |
| `enableOverride` | Boolean | Enable/disable publisher to trigger user syncs by calling `pbjs.triggerUserSyncs()`. Default: `false`. |
| `aliasSyncEnabled` | Boolean | Enable/disable registered syncs for aliased adapters. Default: `false`. |

<a name="setConfig-ConfigureUserSyncing-UserSyncExamples" />

##### User Sync Examples

For examples of configurations that will change the default behavior, see below.

Push the user syncs to later in the page load:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        syncDelay: 5000 // write image pixels 5 seconds after the auction
    }
});
{% endhighlight %}

Turn off user syncing entirely:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        syncEnabled: false
    }
});
{% endhighlight %}

Delay auction to retrieve userId module IDs first:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        auctionDelay: 1000 // delay auction up to 1 second
    }
});
{% endhighlight %}

Allow iframe-based syncs (the presence of a valid `filterSettings.iframe` object automatically enables iframe type user-syncing):

{% highlight js %}
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: '*',   // '*' means all bidders
                filter: 'include'
            }
        }
    }
});
{% endhighlight %}
_Note - iframe-based syncing is disabled by default.  Image-based syncing is enabled by default; it can be disabled by excluding all/certain bidders via the `filterSettings` object._

Only certain bidders are allowed to sync and only certain types of sync pixels:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ['def'],  // only this bidder is excluded from syncing iframe pixels, all other bidders are allowed
                filter: 'exclude'
            },
            image: {
                bidders: ['abc', 'def', 'xyz'],  //only these 3 bidders are allowed to sync image pixels
                filter: 'include'
            }
        },
        syncsPerBidder: 3, // and no more than 3 syncs at a time
        syncDelay: 6000, // 6 seconds after the auction
    }
});
{% endhighlight %}

If you want to apply the same bidder inclusion/exlusion rules for both types of sync pixels, you can use the `all` object instead specifying both `image` and `iframe` objects like so:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        /* only these bidders are allowed to sync.  Both iframe and image pixels are permitted. */
        filterSettings: {
            all: {
                bidders: ['abc', 'def', 'xyz'],
                filter: 'include'
            }
        },
        syncsPerBidder: 3, // and no more than 3 syncs at a time
        syncDelay: 6000, // 6 seconds after the auction
    }
});
{% endhighlight %}

_Note - the `all` field is mutually exclusive and cannot be combined with the `iframe`/`image` fields in the `userSync` config.  This restriction is to promote clear logic as to how bidders will operate in regards to their `userSync` pixels.  If the fields are used together, this will be considered an invalid config and Prebid will instead use the default `userSync` logic (all image pixels permitted and all iframe pixels are blocked)._

The same bidders can drop sync pixels, but the timing will be controlled by the page:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        /* only these bidders are allowed to sync, and only image pixels */
        filterSettings: {
            image: {
                bidders: ['abc', 'def', 'xyz'],
                filter: 'include'
            }
        },
        enableOverride: true // publisher will call `pbjs.triggerUserSyncs()`
    }
});
{% endhighlight %}

As noted, there's a function available to give the page control of when registered user syncs are added.

{% highlight js %}
pbjs.triggerUserSyncs();
{% endhighlight %}

<a name="setConfig-ConfigureUserSyncing-HowUserSyncingWorks" />

##### How User Syncing Works

The [userSync.registerSync()]({{site.baseurl}}/dev-docs/bidder-adaptor.html#bidder-adaptor-Registering-User-Syncs) function called by the adapter keeps a queue of valid userSync requests. It prevents unwanted sync entries from being placed on the queue:

* Removes undesired sync types. (i.e. blocks iframe pixels if `filterSettings.iframe` wasn't declared)
* Removes undesired adapter registrations. (i.e. enforces the configured filtering logic from the `filterSettings` object)
* Makes sure there's not too many queue entries from a given adapter. (i.e. enforces syncsPerBidder)

When user syncs are run, regardless of whether they are invoked by the platform or by the page calling pbjs.triggerUserSyncs(), the queue entries are randomized and appended to the bottom of the HTML tag.

<a name="setConfig-targetingControls" />

#### Configure Targeting Controls

The `targetingControls` object passed to `pbjs.setConfig` provides some options to influence how an auction's targeting keys are generated and managed.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description             |
|------------+---------+---------------------------------|
| auctionKeyMaxChars | integer | Specifies the maximum number of characters the system can add to ad server targeting. |
| alwaysIncludeDeals | boolean | If [enableSendAllBids](#setConfig-Send-All-Bids) is false, set this value to `true` to ensure that deals are sent along with the winning bid |
| allowTargetingKeys | Array of Strings | Selects supported default targeting keys. |
| addTargetingKeys   | Array of Strings | Selects targeting keys to be supported in addition to the default ones |
| allowSendAllBidsTargetingKeys | Array of Strings | Selects supported default targeting keys. |

{: .alert.alert-info :}
Note that this feature overlaps and can be used in conjunction with [sendBidsControl.bidLimit](#setConfig-Send-Bids-Control).

##### Details on the auctionKeyMaxChars setting

Below is an example config containing `auctionKeyMaxChars`:

```javascript
pbjs.setConfig({
  targetingControls: {
    auctionKeyMaxChars: 5000,
  }
});
```

When this property is set up, the `auctionKeyMaxChars` setting creates an effective ceiling for the number of auction targeting keys that are passed to an ad server.  This setting can be helpful if you know that your ad server has a finite limit to the amount of query characters it will accept and process.  When there is such a limit, query characters that exceed the threshold are normally just dropped and/or ignored, which can cause potential issues with the delivery or rendering of the ad.

Specifically, Prebid will go through the following steps with this feature:

* Collect all the available targeting keys that were generated naturally by the auction.  The keys are grouped by each of the adUnits that participated in the auction.
* Prioritize these groups of targeting keys based on the following factors:
  * Bids with deals are prioritized before bids without deals.
  * Bids with higher CPM are ranked before lower CPM bids.
  **Note** - The sorting follows this order specifically, so a bid with a deal that had a $10 CPM would be sorted before a bid with no deal that had a $15 CPM.
* Convert the keys for each group into the format that they are passed to the ad server (i.e., an encoded query string) and count the number of characters that are used.
* If the count is below the running threshold set in the `setConfig` call, that set of targeting keys will be passed along.  If the keys exceed the limit, then they are excluded.

 If you want to review the particular details about which sets of keys are passed/rejected, you can find them in the Prebid console debug log.

##### Finding the right value

Given the varying nature of how sites are set up for advertising and the varying mechanics and data-points needed by ad servers, providing a generic threshold setting is tricky.  If you plan to enable this setting, it's recommended you review your own setup to determine the ideal value.  The following steps provide some guidance on how to start this process:

* Use Prebid to set up a test page that uses the typical setup for your site (in terms of the number of ad slots, etc.).
* Once it's working, look for the average number of characters Prebid uses for the auction targeting keys.
  * You can do this by enabling the Prebid debug mode, enabling this setting in your `setConfig` with a high value, and then opening the browser's console to review the Console Logs section.
* Also in the browser console, find your ad server's ad URL in the Network tab and review the details of the request to obtain information about the query data (specifically the number of characters used).
  * You can copy the data to another tool to count the number of characters that are present.

Between these two values (Prebid's targeting key count and the overall ad URL query character count), you will find the average number of characters that are used by your ad server.  It's likely that these ad server values will remain consistent given that type of setup.  So if you know your ad server has a particular character limit, you can assume that these ad server characters will be reserved and the difference is what you could allot to Prebid.

Between this feature and the overlapping [sendBidsControl.bidLimit](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control), you should be able to make sure that there's not too much data going to the ad server.

<a name="targetingControls-allowTargetingKeys" />

##### Details on the allowTargetingKeys setting

The `allowTargetingKeys` config creates a targeting key mask based on the default targeting keys defined in CONSTANTS.TARGETING_KEYS and CONSTANTS.NATIVE_KEYS. Any default keys that do not match the mask will not be sent to the adserver. This setting can be helpful if you find that your default Prebid.js implementation is sending key values that your adserver isn't configured to process; extraneous key values may lead to the ad server request being truncated, which can cause potential issues with the delivery or rendering ads.

Prebid.js introduced the concept of optional targeting keys with 4.23. CONSTANTS.DEFAULT_TARGETING_KEYS is defined as a subset of CONSTANTS.TARGETING_KEYS. When a publisher defines targetingControls.allowTargetingKeys, this replaces the constant CONSTANTS.DEFAULT_TARGETING_KEYS and can include optional keys defined in CONSTANTS.TARGETING_KEYS. One example of this would be to make `hb_adomain` part of the default set.

To accomplish this, Prebid does the following:
* Collect original targeting generated by the auction.
* Generate new targeting filtered against allowed keys.
  * Custom targeting keys are always added to targeting.
  * Default targeting keys are added to targeting only if they match an allowed key named in `setConfig`.
* New targeting replaces original targeting before targeting is flattened.

The targeting key names and the associated prefix value filtered by `allowTargetingKeys`:

{: .table .table-bordered .table-striped }
| Name        | Value    | Default | Notes |
|------------+-----------+-------------+------------|
| BIDDER | `hb_bidder` | yes | |
| AD_ID | `hb_adid` | yes | Required for displaying a winning creative. |
| PRICE_BUCKET | `hb_pb` | yes | The results of the [price granularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity) calculation. |
| SIZE | `hb_size` | yes | '300x250' |
| DEAL | `hb_deal` | yes | |
| SOURCE | `hb_source` | no | 'client' or 's2s' |
| FORMAT | `hb_format` | yes | 'banner', 'video', or 'native' |
| UUID | `hb_uuid` | no | Network cache ID for video |
| CACHE_ID | `hb_cache_id` | yes | Network cache ID for AMP or Mobile |
| CACHE_HOST | `hb_cache_host` | yes | |
| ADOMAIN | `hb_adomain` | no | Set to bid.meta.advertiserDomains[0]. Use cases: report on VAST errors, set floors on certain buyers, monitor volume from a buyer, track down bad creatives. |
| title | `hb_native_title` | yes | |
| body | `hb_native_body` | yes | |
| body2 | `hb_native_body2` | yes | |
| privacyLink | `hb_native_privacy` | yes | |
| privacyIcon | `hb_native_privicon` | yes | |
| sponsoredBy | `hb_native_brand` | yes | |
| image | `hb_native_image` | yes | |
| icon | `hb_native_icon` | yes | |
| clickUrl | `hb_native_linkurl` | yes | |
| displayUrl | `hb_native_displayurl` | yes | |
| cta | `hb_native_cta` | yes | |
| rating | `hb_native_rating` | yes | |
| address | `hb_native_address` | yes | |
| downloads | `hb_native_downloads` | yes | |
| likes | `hb_native_likes` | yes | |
| phone | `hb_native_phone` | yes | |
| price | `hb_native_price` | yes | |
| salePrice | `hb_native_saleprice` | yes | |

Below is an example config of `allowTargetingKeys` excluding all default targeting keys except `hb_bidder`, `hb_adid`, and `hb_pb`:

```javascript
config.setConfig({
  targetingControls: {
    allowTargetingKeys: ['BIDDER', 'AD_ID', 'PRICE_BUCKET']
  }
});
```
Another example config showing the addition of `hb_adomain` and excluding all default targeting keys except `hb_bidder`, `hb_adid`, `hb_size` and `hb_pb`:

```javascript
config.setConfig({
  targetingControls: {
    allowTargetingKeys: ['BIDDER', 'AD_ID', 'PRICE_BUCKET', 'SIZE', 'ADOMAIN']
  }
});
```

<a name="targetingControls-addTargetingKeys" />

##### Details on the addTargetingKeys setting

The `addTargetingKeys` config is similar to `allowTargetingKeys`, except it adds to the keys in CONSTANTS.DEFAULT_TARGETING_KEYS instead of replacing them. This is useful if you need Prebid.js to generate targeting for some keys that are not allowed by default without removing any of the default ones (see [allowTargetingKeys](#targetingControls-allowTargetingKeys) for details on how targeting is generated). 

Note that you may specify only one of `allowTargetingKeys` or `addTargetingKeys`.

For example, this allows every default key, plus `hb_adomain`:

```javascript
config.setConfig({
    targetingControls: {
        addTargetingKeys: ['ADOMAIN']
    }
});
```

Which is equivalent to:

```javascript
config.setConfig({
    targetingControls: {
        allowTargetingKeys: [
            'BIDDER',
            'AD_ID',
            'PRICE_BUCKET',
            'SIZE',
            'DEAL',
            'FORMAT',
            'UUID',
            'CACHE_HOST',
            'title',
            'body',
            'body2',
            'privacyLink',
            'privacyIcon',
            'sponsoredBy',
            'image',
            'icon',
            'clickUrl',
            'displayUrl',
            'cta',
            'rating',
            'address',
            'downloads',
            'likes',
            'phone',
            'price',
            'salePrice',
            'rendererUrl',
            'adTemplate',
            'ADOMAIN'
        ]
    }
});
```


##### Details on the allowSendAllBidsTargetingKeys setting

The `allowSendAllBidsTargetingKeys` is similar to `allowTargetingKeys` except it limits any default bidder specific keys sent to the adserver when sendAllBids is enabled. Any default bidder specific keys that do not match the mask will not be sent to the adserver. This setting can be helpful if you find that your default Prebid.js implementation is sending key values that your adserver isn't configured to process; extraneous key values may lead to the ad server request being truncated, which can cause potential issues with the delivery or rendering ads. An example of an extraneous key value many publishers may find redundant and want to remove is `hb_bidder_biddercode = biddercode`.

Below is an example config of `allowSendAllBidsTargetingKeys` excluding all default send all bids targeting keys except `hb_adid_biddercode`, `hb_pb_biddercode`:

```javascript
config.setConfig({
  targetingControls: {
    allowSendAllBidsTargetingKeys: ['AD_ID', 'PRICE_BUCKET'],
  },
});
```


<a name="setConfig-Configure-Responsive-Ads" />

#### Configure Responsive Ads

The `sizeConfig` object passed to `pbjs.setConfig` provides a global way to describe types of devices and screens using [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  See below for an explanation of the feature and examples showing how to use it.

{% capture tip-choosing %}
As of Prebid.js 3.11.0, the [Advanced SizeMapping module](/dev-docs/modules/sizeMappingV2.html) provides an alternate way to handle responsive AdUnits.
You should consider using that module if any of these scenarios are true:
{::nomarkdown}
<ul>
<li> You need to work with video or native AdUnits</li>
<li> The site needs to alter different AdUnits at different screen widths; e.g., the left-nav changes sizes at 600 pixels, but the footer's size behavior changes at 620 pixels.</li>
<li>The site needs to alter different mediaTypes at different screen widths; e.g., the banner size ranges are 0-400px, 401-700px, and 701+px, but the native ads appear at 500px.</li>
<li>Some bidders or mediaTypes should be included (or removed) at different overlapping size ranges.</li>
</ul>
<br/>
{:/}
If, on the other hand, you're only working with the banner mediaType and the AdUnits all change behavior together at the same viewport width, then the built-in sizeConfig feature is appropriate.
{% endcapture %}
{% include alerts/alert_tip.html content=tip-choosing %}

+ [How it works](#sizeConfig-How-it-Works)
+ [Example](#sizeConfig-Example)
+ [Labels](#labels)

<a name="sizeConfig-How-it-Works" />

##### How Size Config Works for Banners

- Before `requestBids` sends bid requests to adapters, it will evaluate and pick the appropriate label(s) based on the `sizeConfig.mediaQuery` and device properties.  Once it determines the active label(s), it will then filter the `adUnit.bids` array based on the `labels` defined and whether the `banner` mediaType was included. Ad units that include a `banner` mediaType that don't match the label definition are dropped.
- The required `sizeConfig.mediaQuery` property allows [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  The queries are tested using the [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API.
- If a label conditional (e.g. `labelAny`) doesn't exist on an ad unit, it is automatically included in all requests for bids.
- If multiple rules match, the sizes will be filtered to the intersection of all matching rules' `sizeConfig.sizesSupported` arrays.
- The `adUnit.mediaTypes.banner.sizes` selected will be filtered based on the `sizesSupported` of the matched `sizeConfig`. So the `adUnit.mediaTypes.banner.sizes` is a subset of the sizes defined from the resulting intersection of `sizesSupported` sizes and `adUnit.mediaTypes.banner.sizes`. (Note: size config will also operate on `adUnit.sizes`, however `adUnit.sizes` is deprecated in favor of `adUnit.mediaTypes`)

###### Note on sizeConfig and different mediaTypes

The sizeConfig logic only applies to `adUnits`/`bids` that include the `banner` `mediaType` (regardless of whether the request is single or multi-format).

For example, if a request  contained the `banner` and `video` `mediaTypes` and it failed the label check, then the entire adUnit/bid would be dropped (including the `video` part of the request).  However if the same request passed the label check, then the `adUnit.mediaTypes.banner.sizes` would be filtered as per the matching sizeConfig and the multi-format request would proceed as normal.

If the ad unit does not include `banner` `mediaType` at all, then the sizeConfig logic will not influence that ad Unit; it will automatically be passed into the auction.

<a name="sizeConfig-Example" />

##### Example

To set size configuration rules, pass in `sizeConfig` as follows:

{% highlight js %}

pbjs.setConfig({
    sizeConfig: [{
        'mediaQuery': '(min-width: 1600px)',
        'sizesSupported': [
            [1000, 300],
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop-hd']
    }, {
        'mediaQuery': '(min-width: 1200px)',
        'sizesSupported': [
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop']
    }, {
        'mediaQuery': '(min-width: 768px) and (max-width: 1199px)',
        'sizesSupported': [
            [728, 90],
            [300, 250]
        ],
        'labels': ['tablet']
    }, {
        'mediaQuery': '(min-width: 0px)',
        'sizesSupported': [
            [300, 250],
            [300, 100]
        ],
        'labels': ['phone']
    }]
});

{% endhighlight %}

##### Labels

There are two parts to defining responsive and conditional ad units with labels:

1. Defining the labels
2. Defining the conditional ad unit targeting for the labels

Labels may be defined in two ways:

1. Through [`sizeConfig`](#setConfig-Configure-Responsive-Ads)
2. As an argument to [`pbjs.requestBids`](/dev-docs/publisher-api-reference/requestBids.html)

{% highlight js %}
pbjs.requestBids({labels: []});
{% endhighlight %}

Labels may be targeted in the AdUnit structure by two conditional operators: `labelAny` and `labelAll`.

With the `labelAny` operator, just one label has to match for the condition to be true. In the example below, either A or B can be defined in the label array to activate the bid or ad unit:
{% highlight bash %}
labelAny: ["A", "B"]
{% endhighlight %}

With the `labelAll` conditional, every element of the target array must match an element of the label array in
order for the condition to be true. In the example below, both A and B must be defined in the label array to activate the bid or ad unit:
{% highlight bash %}
labelAll: ["A", "B"]
{% endhighlight %}

{: .alert.alert-warning :}
Only one conditional may be specified on a given AdUnit or bid -- if both `labelAny` and `labelAll` are specified, only the first one will be utilized and an error will be logged to the console. It is allowable for an AdUnit to have one condition and a bid to have another.

{: .alert.alert-warning :}
If either `labeAny` or `labelAll` values is an empty array, it evaluates to `true`.

{: .alert.alert-warning :}
It is important to note that labels do not act as filters for sizeConfig. In the example above, using a screen of 1600px wide and `labelAll:["desktop"]` will *not* filter out sizes defined in the `desktop-hd` sizeConfig. Labels in sizeConfig are only used for selecting or de-selecting AdUnits and AdUnit.bids.

Label targeting on the ad unit looks like the following:

{% highlight js %}

pbjs.addAdUnits([{
    code: "ad-slot-1",
    mediaTypes: {
        banner: {
            sizes: [
                [970, 90],
                [728, 90],
                [300, 250],
                [300, 100]
            ]
        }
    },
    labelAny: ["visitor-uk"]
    /* The full set of bids, not all of which are relevant on all devices */
    bids: [{
            bidder: "pulsepoint",
            /* Labels flag this bid as relevant only on these screen sizes. */
            labelAny: ["desktop", "tablet"],
            params: {
                "cf": "728X90",
                "cp": 123456,
                "ct": 123456
            }
        },
        {
            bidder: "pulsepoint",
            labelAny: ["desktop", "phone"],
            params: {
                "cf": "300x250",
                "cp": 123456,
                "ct": 123456
            }
        },
        {
            bidder: "sovrn",
            labelAny: ["desktop", "tablet"],
            params: {
                "tagid": "123456"
            }
        },
        {
            bidder: "sovrn",
            labelAny: ["phone"],
            params: {
                "tagid": "111111"
            }
        }
    ]
}]);

{% endhighlight %}

See [Conditional Ad Units]({{site.baseurl}}/dev-docs/conditional-ad-units.html) for additional use cases around labels.


<a name="setConfig-coppa" />

#### COPPA

Bidder adapters that support the Child Online Privacy Protection Act (COPPA) read the `coppa` configuration.
Publishers with content falling under the scope of this regulation should consult with their legal teams.
The flag may be passed to supporting adapters with this config:

{% highlight js %}
pbjs.setConfig({coppa: true});
{% endhighlight %}

<a name="setConfig-fpd" />

#### First Party Data

The First Party Data feature allows publishers to specify key/value data in one place where each compatible bid adapter can read it.
See the [First Party Data Feature](/features/firstPartyData.html) for more detailed examples.

{: .alert.alert-warning :}
Not all bid adapters currently support reading first party data in this way, but support should increase over time.

**Scenario 1** - Global (cross-adunit) First Party Data open to all bidders

{% highlight js %}
pbjs.setConfig({
   ortb2: {
       site: {
	 ...
       },
       user: {
         ...
       }
    }
});
{% endhighlight %}

The `ortb2` JSON structure reflects the OpenRTB standard:
- Fields that like keywords, search, content, gender, yob, and geo are values defined in OpenRTB, so should go directly under the site or user objects.
- Arbitrary values should go in site.ext.data or user.ext.data.
- Segments should go in site.content.data[] or user.data[].
- Any other OpenRTB 2.5 field could be added here as well, e.g. site.content.language.

**Scenario 2** - Auction (cross-adunit) First Party Data open to all bidders

If a page needs to specify multiple different sets of top-level data (`site`, `user`, or `app`), use the `ortb2` parameter of [`requestBids`](/dev-docs/publisher-api-reference/setConfig.html) ([example](/features/firstPartyData.html#supplying-auction-specific-data)  

**Scenario 3** - Global (cross-adunit) First Party Data open only to a subset of bidders

If a publisher only wants certain bidders to receive the data, use the [setBidderConfig](/dev-docs/publisher-api-reference/setBidderConfig.html) function.

**Scenario 4** - AdUnit-specific First Party Data

See the [AdUnit Reference](/dev-docs/adunit-reference.html) for AdUnit-specific first party data.

See [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html) for details about passing data server-side.

<a name="setConfig-vast-cache" />

#### Client-side Caching of VAST XML

When serving video ads, VAST XML creatives must be cached on the network so the
video player can retrieve them when it's ready. Players don't obtain the VAST XML from
the JavaScript DOM in Prebid.js, but rather expect to be given a URL where it can
be retrieved. There are two different flows possible with Prebid.js around VAST XML caching:

- Server-side caching:  
  Some video bidders (e.g. Rubicon Project) always cache the VAST XML on their servers as part of the bid. They provide a 'videoCacheKey', which is used in conjunction with the VAST URL in the ad server to retrieve the correct VAST XML when needed. In this case, Prebid.js has nothing else to do. As of Prebid.js 4.28, a publisher may specify the `ignoreBidderCacheKey` flag to re-cache these bids somewhere else using a VAST wrapper.
- Client-side caching:  
  Video bidders that don't cache on their servers return the entire VAST XML body. In this scenario, Prebid.js needs to copy the VAST XML to a publisher-defined cache location on the network. Prebid.js POSTs the VAST XML to the named Prebid Cache URL. It then sets the 'videoCacheKey' to the key that's returned in the response.

{: .table .table-bordered .table-striped }
| Cache Attribute | Required? | Type | Description |
|----+--------+-----+-------|
| cache.url | yes | string | The URL of the Prebid Cache server endpoint where VAST creatives will be sent. |
| cache.vasttrack | no | boolean | Passes additional data to the url, used for additional event tracking data. Defaults to `false`. |
| cache.ignoreBidderCacheKey | no | boolean | If the bidder supplied their own cache key, setting this value to true adds a VAST wrapper around that URL, stores it in the cache defined by the `url` parameter, and replaces the original video cache key with the new one. This can dramatically simplify ad server setup because it means all VAST creatives reside behind a single URL. The tradeoff: this approach requires the video player to unwrap one extra level of VAST. Defaults to `false`. |

Here's an example of basic client-side caching. Substitute your Prebid Cache URL as needed:

{% highlight js %}
pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
});
{% endhighlight %}

{: .alert.alert-warning :}
The endpoint URL provided must be a Prebid Cache or be otherwise compatible with the [Prebid Cache interface](https://github.com/prebid/prebid-cache).

As of Prebid.js 4.28, you can specify the `ignoreBidderCacheKey` option:

{% highlight js %}
pbjs.setConfig({
        cache: {
            url: 'https://my-pbs.example.com/cache',
	    ignoreBidderCacheKey: true
        }
});
{% endhighlight %}

As of Prebid.js 2.36, you can track client-side cached VAST XML. This functionality is useful for publishers who want to allow their analytics provider to measure video impressions. The prerequisite to using this feature is the availability of a Prebid Server that supports:

- the /vtrack endpoint
- an analytics module with connection to an analytics system that supports joining the impression event to the original auction request on the bidid
- the ability of a publisher to utilize the feature (if account-level permission is enabled)

Given those conditions, the `vasttrack` flag can be specified:

{% highlight js %}
pbjs.setConfig({
        cache: {
            url: 'https://my-pbs.example.com/vtrack',
            vasttrack: true
        }
});
{% endhighlight %}

Setting the `vasttrack` parameter to `true` supplies the POST made to the `/vtrack`
Prebid Server endpoint with a couple of additional parameters needed
by the analytics system to join the event to the original auction request.

<a name="setConfig-instream-tracking" />

#### Instream tracking

{: .alert.alert-info :}
To enable this tracking, include the `instreamTracking` module in your Prebid.js build.

This configuration will allow Analytics Adapters and Bid Adapters to track `BID_WON` events for Instream video bids.

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `instreamTracking` | Required | Object | Configuration object for instream tracking |
| `instreamTracking.enabled` | Required | Boolean | Enable/disable the instream tracking feature. Default: `false`. |
| `instreamTracking.maxWindow` | Optional | Integer | The time in ms after which polling for instream delivery stops. Default: `60000` i.e. 60 seconds |
| `instreamTracking.pollingFreq` | Optional | Integer |The frequency of polling. Default: `500`ms |
| `instreamTracking.urlPattern` | Optional | RegExp | Regex for cache url patterns, to avoid false positives. |

#### Example

{% highlight js %}
pbjs.setConfig({
        'instreamTracking': {
            enabled: true,
        }
});
{% endhighlight %}

More examples [here](/dev-docs/modules/instreamTracking.html#example-with-urlpattern).

<a name="setConfig-site" />

#### Site Configuration

{: .alert.alert-info :}
This setting is obsolete as of Prebid.js 4.30. Please set site fields in `ortb2.site` as [First Party Data](#setConfig-fpd).

Adapters, including Prebid Server adapters, can support taking site parameters like language.
The structure here is OpenRTB; the site object will be available to client- and server-side adapters.

{% highlight js %}
pbjs.setConfig({
   site: {
       content: {
           language: "en"
       }
   }
});
{% endhighlight %}

<a name="setConfig-auctionOptions" />

#### Auction Options

The `auctionOptions` object controls aspects related to auctions.

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `secondaryBidders` | Optional | Array of Strings | Specifies bidders that the Prebid auction will no longer wait for before determining the auction has completed. This may be helpful if you find there are a number of low performing and/or high timeout bidders in your page's rotation. |
| `suppressStaleRender` | Optional | Boolean | When true, prevents `banner` bids from being rendered more than once. It should only be enabled after auto-refreshing is implemented correctly.  Default is false.

##### Examples
Exclude status of bidder _doNotWaitForMe_ when checking auction completion.
{% highlight js %}
pbjs.setConfig({
    'auctionOptions': {
        'secondaryBidders': ['doNotWaitForMe']
    }
});
{% endhighlight %}

Render winning bids only once.
{% highlight js %}
pbjs.setConfig({
    'auctionOptions': {
        'suppressStaleRender': true
    }
});
{% endhighlight %}

##### More on Stale Rendering
When auto-refreshing is done incorrectly, it could cause the same bids to be rendered repeatedly. For instance, when googletag.pubads.refresh() is called directly without removing the PBJS targeting, the same hb_ variables get re-sent to GAM, re-chosen, and re-rendered. Over and over without ever asking PBJS for updated targeting variables.

PBJS performs following actions when stale rendering is detected.
* Log a warning in the browser console if pbjs_debug=true.
* Emit a `STALE_RENDER` event before `BID_WON` event.

Stale winning bids will continue to be rendered unless `suppressStaleRender` is set to true.  Events including `STALE_RENDER` and `BID_WON` are unaffected by this option.


<a name="setConfig-maxNestedIframes" />

#### maxNestedIframes

Prebid.js will loop upward through nested iframes to find the top-most referrer. This setting limits how many iterations it will attempt before giving up and not setting referrer.

```
pbjs.setConfig({
    maxNestedIframes: 5   // default is 10
});
```

<a name="setConfig-realTimeData" />

#### Real-Time Data Modules

All of the modules that fall under the [Real-Time Data (RTD) category](/dev-docs/modules/index.html#real-time-data-providers) conform to
a consistent set of publisher controls. The pub can choose to run multiple
RTD modules, define an overall amount of time they're willing to wait for
results, and even flag some of the modules as being more "important"
than others.

```
pbjs.setConfig({
    ...,
    realTimeData: {
      auctionDelay: 100,     // REQUIRED: applies to all RTD modules
      dataProviders: [{
          name: "RTD-MODULE-1",
          waitForIt: true,   // OPTIONAL: flag this module as important
          params: {
	    ... module-specific parameters ...
          }
      },{
          name: "RTD-MODULE-2",
          waitForIt: false,   // OPTIONAL: flag this module as less important
          params: {
	    ... module-specific parameters ...
          }
      }]
    }
});

```

The controls publishers have over the RTD modules:

{: .table .table-bordered .table-striped }
| Field | Required? | Type | Description |
|---|---|---|---|
| realTimeData.auctionDelay | no | integer | Defines the maximum amount of time, in milliseconds, the header bidding auction will be delayed while waiting for a response from the RTD modules as a whole group. The default is 0 ms delay, which means that RTD modules need to obtain their data when the page initializes. |
| realTimeData.dataProviders[].waitForIt | no | boolean | Setting this value to true flags this RTD module as "important" enough to wait the full auction delay period. Once all such RTD modules have returned, the auction will proceed even if there are other RTD modules that have not yet responded. The default is `false`. |

The idea behind the `waitForIt` flag is that publishers can decide which
modules are worth waiting for and which better hustle. For example, imagine a bus stop:
the bus driver will wait up to 100ms for a few important passengers: A, J, and X.
Once these three passengers are on the bus, it will leave immediately, even if 100ms hasn't been reached. Other potential passengers need to be on before these three or they will be left behind. If A, J, or X doesn't get on the bus before the 100ms are up, they, too, will be left behind.

This may not seem fair, but keep in mind that speed has a significant impact
on ad performance: header bidding gets only a small amount of time to run the auction before the ad server is called.
Some publishers carefully manage these precious milliseconds, balancing impact
of the real-time data with the revenue loss from auction delay.

Notes:
- The only time `waitForIt` means anything is if some modules are flagged as true and others as false. If all modules are the same (true or false), it has no effect.
- Likewise, `waitForIt` doesn't mean anything without an auctionDelay specified.



<a id="setConfig-performanceMetrics" />
#### Disable performance metrics

Since version 7.17, Prebid collects fine-grained performance metrics and attaches them to several events for the purpose of analytics. If you find that this generates too much data for your analytics provider you may disable this feature with: 

```
pbjs.setConfig({performanceMetrics: false})
```

<a name="setConfig-Generic-Configuration" />
#### Generic setConfig Configuration

Some adapters may support other options, as defined in their documentation. To set arbitrary configuration values:

{% highlight js %}
pbjs.setConfig({ <key>: <value> });
{% endhighlight %}

<a name="setConfig-Troubleshooting-your-configuration" />

#### Troubleshooting your configuration

Towards catching syntax errors, one tip is to call `pbjs.setConfig` without an object, e.g.,

{% highlight js %}
pbjs.setConfig('debug', 'true'));
{% endhighlight %}

then Prebid.js will print an error to the console that says:

```
ERROR: setConfig options must be an object
```

If you don't see that message, you can assume the config object is valid.

<hr class="full-rule" />

## Related Reading

- [Prebid.js and Ad Server Key Values](/features/adServerKvps.html)
