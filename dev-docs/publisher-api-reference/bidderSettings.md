---
layout: api_prebidjs
title: pbjs.bidderSettings
description: bidderSettings API
sidebarType: 1
---


#### 1. Overview

The bidderSettings object provides a way to define some behaviors for the
platform and specific adapters. The basic structure is a 'standard' section with defaults for all adapters, and then one or more adapter-specific sections that override behavior for that bidder:

```javascript
pbjs.bidderSettings = {
    standard: {
         [...]
    },
    ix: {
        [...]
    },
    rubicon: {
        [...]
    },
}
```

Defining bidderSettings is optional; the platform has default values for all of the options.
Adapters may specify their own default settings, though this isn't common.
Some sample scenarios where publishers may wish to alter the default settings:

* using bidder-specific ad server targeting instead of Prebid-standard targeting
* passing additional information to the ad server
* adjusting the bid CPM sent to the ad server

#### 2. Bidder Setting Attributes

{: .table .table-bordered .table-striped }
| Attribute | Scope | Version | Default | Description |
| --- | --- | --- | --- | --- |
| adserverTargeting | standard or adapter-specific | all | see below | Define which key/value pairs are sent to the ad server. |
| bidCpmAdjustment | standard or adapter-specific | all | n/a | Custom CPM adjustment function. Could, for example, adjust a bidder's gross-price bid to net price. |
| inverseBidAdjustment | standard or adapter-specific | 7.33.0 | n/a | Inverse of `bidCpmAdjustment` |
| sendStandardTargeting | adapter-specific | 0.13.0 | true | If adapter-specific targeting is specified, can be used to suppress the standard targeting for that adapter. |
| suppressEmptyKeys | standard or adapter-specific | 0.13.0 | false | If custom adserverTargeting functions are specified that may generate empty keys, this can be used to suppress them. |
| allowZeroCpmBids | standard or adapter-specific | 6.2.0 | false | Would allow bids with a 0 CPM to be accepted by Prebid.js and could be passed to the ad server. |
| storageAllowed | standard or adapter-specific | 6.13.0 | true in 6.x, false after 7.0 | Allow use of cookies and/or local storage. |  
| allowAlternateBidderCodes | standard or adapter-specific | 6.23.0 | true in v6.x <br /> false from v7.0| Allow adapters to bid with alternate bidder codes. |  
| allowedAlternateBidderCodes | standard or adapter-specific | 6.23.0 | n/a | Array of bidder codes for which an adapter can bid. <br />`undefined` or `['*']` will allow adapter to bid with any bidder code. |
| adjustAlternateBids | standard or adapter-specific | 7.48.0 | false | Optionally allow alternate bidder codes to use an adapter's bidCpmAdjustment function by default instead of the standard bidCpmAdjustment function if present (note: if a bidCpmAdjustment function exists for the alternate bidder code within bidderSettings, then this will be used instead of falling back to the adapter's bidCpmAdjustment function). |

##### 2.1. adserverTargeting

As described in the [AdOps documentation]({{site.baseurl}}/adops/before-you-start.html), Prebid has a recommended standard
set of ad server targeting that works across bidders. This standard targeting approach is
defined in the adserverTargeting attribute in the 'standard' section, but can be overridden
per adapter as needed. Both scenarios are described below.

{: .alert.alert-warning :}
Note that once `standard.adserverTargeting` is specified,
you'll need to fully manage the targeting -- the default `hb_` targeting variables will not be added.

**Keyword targeting for all bidders**

The below code snippet is the *default* setting for ad server targeting. For each bidder's bid,
Prebid.js will set 6 keys (`hb_bidder`, `hb_adid`, `hb_pb`, `hb_size`, `hb_format`) with their corresponding values.
In addition, video will receive additional keys: `hb_cache_id` and `hb_cache_host`.
The key value pair targeting is applied to the bid's corresponding ad unit. Your ad ops team will have the ad server's line items and creatives to utilize these keys.

If you'd like to customize the key value pairs, you can overwrite the settings as the below example shows. *Note* that once you updated the settings, let your ad ops team know about the change, so they can update the line item targeting accordingly. See the [Ad Ops](/adops/before-you-start.html) documentation for more information.

<a name="bidderSettingsDefault"></a>
<a name="default-keywords"></a>

There's no need to include the following code if you choose to use the *below default setting*.

```javascript
pbjs.bidderSettings = {
    standard: {
        adserverTargeting: [{
            key: "hb_bidder",
            val: function(bidResponse) {
                return bidResponse.bidderCode;
            }
        }, {
            key: "hb_adid",
            val: function(bidResponse) {
                return bidResponse.adId;
            }
        }, {
            key: "hb_pb",
            val: function(bidResponse) {
                return bidResponse.pbMg;
            }
        }, {
            key: 'hb_size',
            val: function (bidResponse) {
                return bidResponse.size;
            }
        }, {
            key: 'hb_source',
            val: function (bidResponse) {
                return bidResponse.source;
            }
        }, {
            key: 'hb_format',
            val: function (bidResponse) {
                return bidResponse.mediaType;
            }
        }]
    }
}
```

{: .alert.alert-warning :}
Note that the existence of `bidderSettings.adserverTargeting.standard` will prevent the system from adding the standard display targeting values: hb_bidder, hb_adid, hb_pb, hb_size, and hb_format. However, if the mediaType is video and `bidderSettings.adserverTargeting.standard` does not specify hb_uuid, hb_cache_id, or hb_cache_host, they will be added unless `bidderSettings.sendStandardTargeting` is set to false.

<a name="key-targeting-specific-bidder"></a>
**Keyword targeting for a specific bidder**

Let’s say the bidder prefers a separate set of line items. You can overwrite the bidder
settings as the below example for AppNexus shows.

*Note that the line item setup has to match the targeting change*

```javascript
pbjs.bidderSettings = {
    appnexus: {
      sendStandardTargeting: false,
      adserverTargeting: [
        {
            key: "apn_pbMg",
            val: function(bidResponse) {
                return bidResponse.pbMg;
            }
        }, {
            key: "apn_adId",
            val: function(bidResponse) {
                return bidResponse.adId;
            }
        }
      ]
    }
}
```

In other words, the above config sends 2 pairs of key/value strings targeting for every AppNexus bid and for every ad unit. The 1st pair would be `apn_pbMg` => the value of `bidResponse.pbMg`. The 2nd pair would be `apn_adId` => the value of `bidResponse.adId`. You can find the bidResponse object documentation [here](/troubleshooting/troubleshooting-guide.html#common-bid-response-parameters).

Note that sendStandardTargeting is set to false so that the standard Prebid targeting (hb_bidder, etc.) aren't also sent to the ad server.

**Price Buckets**

Now let's say you would like to define a bidder-specific price bucket function rather than use the ones available by default in prebid.js. Even the [priceGranularity config](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity) option applies to all bidders -- with this approach you can overwrite price buckets.

*Note: this will only impact the price bucket sent to the ad server for targeting. It won't actually impact the cpm value used for ordering the bids.*

```javascript
pbjs.bidderSettings = {
    standard: {
        [...]
        adserverTargeting: [{
            key: "hb_pb",
            val: function(bidResponse) {
                // define your own function to assign price bucket
                if (cpm < 2)
                    return "pb1"; // all bids less than $2 are assigned to price bucket 'pb1'
                if (cpm < 3)
                    return "pb2"; // all bids less than $3 are assigned to price bucket 'pb2'
                if (cpm < 4)
                    return "pb3"; // all bids less than $4 are assigned to price bucket 'pb3'
                if (cpm < 5)
                    return "pb4"; // all bids less than $5 are assigned to price bucket 'pb4'
                if (cpm < 6)
                    return "pb5"; // all bids less than $6 are assigned to price bucket 'pb5'
                return "pb6"; // all bids $6 and above are assigned to price bucket 'pb6'
            }
        }]
    // [...]
    }
}
```

##### 2.2. bidCpmAdjustment

Some bidders return gross prices instead of the net prices (what the publisher will actually
get paid). For example, a publisher's net price might be 15% below the returned gross price.
In this case, the publisher may want to adjust the bidder's returned price to run a true
header bidding auction. Otherwise, this bidder's gross price will unfairly win over your
other demand sources who report the real price.

Custom adjustment can be provided as a function taking 3 arguments: `bidCpmAdjustment(cpm, bidResponse, bidRequest)`.
Note that either `bidResponse` or `bidRequest` may be missing, although at least one of them is guaranteed to be present. This is because Prebid will sometimes need to run adjustment when no bid has been made yet; see [inverseBidAdjustment](#23-inversebidadjustment) below.

For example:

```javascript
pbjs.bidderSettings = {
  standard: { ... }
  aol: {
    bidCpmAdjustment : function(bidCpm, bid){
      // adjust the bid in real time before the auction takes place
      console.log('Bidder is: ' + bid.bidderCode);
      return bidCpm * .85;
    }
  }
};
```

In the above example, the AOL bidder will inherit from "standard" adserverTargeting keys, so that you don't have to define the targeting keywords again.

##### 2.3. inverseBidAdjustment

When using [price floors](/dev-docs/modules/floors.html), Prebid attempts to calculate the inverse of `bidCpmAdjustment`, so that the floor values it requests from SSPs take into account how the bid will be adjusted.
For example, if the adjustment is `bidCpm * .85` as above, floors are adjusted by `bidFloor * 1 / .85`.

The automatically derived inverse function is correct only when `bidCpmAdjustment` is a simple multiplication. 
If it isn't, the inverse should also be provided, as a function taking 3 arguments: `inverseBidAdjustment(cpm, bidRequest, floorRequest)`, where `floorRequest` is an object containing `{mediaType, size}`, both of which can be null if calculating non-specific floors.    

For example:

```javascript
pbjs.bidderSettings = {
    aol: {
        bidCpmAdjustment : function(cpm) {
          return Math.max(0.2, (cpm - 0.2) * .85)
        },
        inverseBidAdjustment: function(cpm) {
          return Math.max(0.2, (cpm / .85) + 0.2)
        }
    }
};
```

##### 2.4. sendStandardTargeting

This boolean flag minimizes key/value pairs sent to the ad server when
adapter-specific targeting is specified. By default, the platform will send both adapter-specific adServerTargeting as well as the standard adServerTargeting.

While sending extra targeting the ad server may not matter, this flag can be used to
suppress the standard targeting for adapters that define their own.

See the [example above](#key-targeting-specific-bidder) for example usage.

##### 2.5. suppressEmptyKeys

If a custom adServerTargeting function can return an empty value, this boolean flag can be used to avoid sending those empty values to the ad server.

##### 2.6. allowZeroCpmBids

By default, 0 CPM bids are ignored by Prebid.js entirely.  However if there's a valid business reason to allow these bids, this setting can be enabled to allow
either specific bid adapter(s) or all bid adapters the permission for these bids to be processed by Prebid.js and potentially sent to the respective ad server
(depending on the Prebid.js auction results).

<a id="storageAllowed"></a>

##### 2.7. storageAllowed

This setting defines if the bid adapter can access browser cookies or local storage. Allowed values are:

* an array containing either `'html5'`, `'cookie'` or both to allow specific storage methods (e.g. `['cookie']` enables cookies but not local storage)
* `true` to allow any storage method;
* `false` to disable all storage.

<br />Default value is `true` in version 6.x
<br />Default value is `false` in version 7.x

Note that:

* [Disabling device access](/dev-docs/publisher-api-reference/setConfig.html#setConfig-deviceAccess) will prevent access to storage regardless of this setting;  
* `storageAllowed` will only affect bid adapters and not any other type of module (such as analytics or RTD).

<a id="allowAlternateBidderCodes" />

##### 2.8. allowAlternateBidderCodes

If this flag is set to `true`, bidders that have not been explicitly requested in [`adUnit.bids`](../adunit-reference.html#adunitbids) may take part in the auction.
<br />Default value is `true` in version 6.x
<br />Default value will be `false` from version 7.0

##### 2.9. allowedAlternateBidderCodes

This array will work in conjunction with `allowAlternateBidderCodes`. In this array, you can specify the names of the bidder for which an adapter can accept the bid. If the value is not specified for the array or `[‘*’]` is specified, Prebid will accept bids of all the bidders for the given adapter.

```javascript

pbjs.bidderSettings = {
    standard: {
         allowAlternateBidderCodes: false,
         bidCpmAdjustment: function(bidCpm, bid){ return bidCpm * .95; },
         [...]
    },
    pubmatic: {
        allowAlternateBidderCodes: true,
        allowedAlternateBidderCodes: ["groupm"],
        [...]
    },
    appnexus: {
        allowAlternateBidderCodes: true,
        allowedAlternateBidderCodes: ["*"],
        bidCpmAdjustment: function(bidCpm, bid){ return bidCpm * .90; },
        [...]
    },
    groupm:{
        bidCpmAdjustment: function(bidCpm, bid){ return bidCpm * .80; },
        [...]
    }
}
```

In the above example, `groupm` bid will have a bid adjustment of 80% since the `bidCpmAdjustment` function says so.<br />
If `appnexus` bids with another bidder code, say `appnexus2`. This bidder code will adjust the bid cpm to 95% because it will apply the `bidCpmAdjustment` function from `standard` setting, since the `bidCpmAdjustment` is missing for given bidder code I.e `appnexus2`

##### 2.10. adjustAlternateBids

Optionally allow alternate bidder codes originating from a specific bid adapter to fallback to that same adapter's bidCpmAdjustment function. When adjustAlternateBids is set to true, the prioity of which bidCpmAdjustment function to utilize will be as follows based on what is present within the bidderSettings object:

1. Alternate bidder code bidCpmAdjustment function
2. Adapter bidCpmAdjustment function
3. The standard bidCpmAdjustment function

```javascript

pbjs.bidderSettings = {
    standard: {
         allowAlternateBidderCodes: false,
         bidCpmAdjustment: function(bidCpm, bid){ return bidCpm * .95; },
         [...]
    },
    pubmatic: {
        allowAlternateBidderCodes: true,
        allowedAlternateBidderCodes: ["groupm"],
        adjustAlternateBids: true,
        bidCpmAdjustment: function(bidCpm, bid){ return bidCpm * .85; },
        [...]
    },
    appnexus: {
        allowAlternateBidderCodes: true,
        allowedAlternateBidderCodes: ["*"],
        bidCpmAdjustment: function(bidCpm, bid){ return bidCpm * .90; },
        [...]
    }
}
```

In the above example, if PubMatic were to return the "groupm" bidder code then the bidCpmAdjustment function under `pubmatic` would be used instead of what is available under `standard`.

<hr class="full-rule" />
