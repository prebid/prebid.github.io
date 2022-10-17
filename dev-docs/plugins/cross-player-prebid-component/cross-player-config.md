---
layout: page_v2
title: Cross-Player Prebid Component Configuration
description: Configuring the cross-player Prebid component
top_nav_section: dev_docs
nav_section: plugins
---

# Cross Player Prebid Component Configuration
{:.no_toc}

Options that configure the behavior of the Prebid process are passed to the [Cross-Player Prebid Component]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component.html) in a JSON structure.  These options include the bidders and bidder settings for Prebid.js to use, the URL to your custom Prebid.js build, and any ad server parameters.

The Prebid Component supports almost all the Prebid options supported by the other Prebid plugins, with some exceptions.  The following is the list of Prebid options supported in the Component:

- [prebidPath](#prebidPath)
- [biddersSpec](#biddersSpec)
- [bidderAliases](#bidderAliases)
- [bidderSettings](#bidderSettings)
- [prebidConfigOptions](#prebidConfigOptions)
- [dfpParameters](#dfpParameters)
- [prebidTimeout](#prebidTimeout)
- [enablePrebidCache](#enablePrebidCache)

<a name="prebidPath"></a>
## prebidPath

**Description:**

The path to Prebid.js that you wish to use.

{% capture noteAlert %}
By default, the plugin currently supports Prebid.js 1.0 and up.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

**Acceptable Values:**

String that represents the full path to a version of Prebid.js

**Required?**

Not required but recommended.

**Default Value:**

https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js

**Example:**

`options.prebidPath = 'https://your-path/prebid.js'`

<a name="biddersSpec"></a>
## biddersSpec

**Description:**

The parameters that are used in making a prebid call. These parameters include definitions of the bidders that will be used during prebid as well as placement configuration parameters.

**Acceptable Values:**

The value of `biddersSpec` should be a JSON structure providing the definition of the bidders to use as well as placement configuration. The syntax for these parameters is defined in [Bidder Params](/dev-docs/bidders.html).

**Required?**

Yes - if you want the plugin to execute prebid.

**Default Value:**

`{}` - this will result in no prebid being executed.

**Example:**

See [Sample Configuration](#sample-config) below.

<a name="bidderAliases"></a>
## bidderAliases

**Description:**

Define aliases for bidders that are being specified in the `biddersSpec`. Using aliases allows you to use the same bidder more than once with different targeting parameters.

**Acceptable Values:**

Array of one or more bidder aliases definitions.

Each bidder alias definition is defined in a JSON object containing the following fields:

- `bidderName`: The name of a known bidder adapter that is being used in bidding.
- `name`: A String that species the name of the alias for the bidder adapter.

See "aliasBidder" in the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html) for details.

**Required?**

No

**Default Value:**

None

**Example:**

```
"bidderAliases": [
    {
      "bidderName": "appnexus",
      "name": "alias1"
    },
    {
      "bidderName": "appnexus",
      "name": "alias2"
    }
]
```

<a name="bidderSettings"></a>
## bidderSettings

**Description:**

Define some behaviors for the platform and specific adapters. The basic structure is a ‘standard’ section with defaults for all adapters, and then one or more adapter-specific sections that override behavior for that bidder.

**Acceptable Values:**

When you are defining all options to the prebid plugin directly on the page, you may use a JSON object using same syntax described under “bidderSettings” in the [Publisher API Reference](/dev-docs/publisher-api-reference/bidderSettings.html)

**Required?**

No - Defining `bidderSettings` is optional; the platform has default values for all of the options.

Bidder adapters may specify their own default settings, though this isn’t common. Some sample scenarios where publishers may wish to alter the default settings include:

- Using bidder-specific ad server targeting instead of Prebid-standard targeting.
- Passing additional information to the ad server.
- Adjusting the bid CPM sent to the ad server.

**Default Value:**

None

**Example:**

```
options. bidderSettings = {
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
    }]
  }
}
```

<a name="prebidConfigOptions"></a>
## prebidConfigOptions

**Description:**

Additional options that are passed in to the prebid.js `setConfig()` method.

**Acceptable Values:**

JSON object.

Supported fields are documented in the [Publisher API Reference](/dev-docs/publisher-api-reference/setConfig.html)

**Required?**

No

**Default Value:**

None

**Example:**

`options.prebidConfigOptions = { pageUrl: "https://www.mydomain.com"};`

<a name="dfpParameters"></a>
## dfpParameters

**Description:**

Parameters used when using Google Ad Manager (formerly DFP) as the ad server.

See documentation for [buildVideoUrl](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html) for more information.

**Acceptable Values:**

JSON object

Can contain the following fields:

- `params`: JSON object containing parameters needed to make Google Ad Manager call. Parameters include:
  - `iu`: string (Required)
  - Google Ad Manager adUnit ID. For more information, see the Google Ad Manager documentation on iu.
  - `cust_params`: JSON object (Optional). Key-value pairs that will be sent to Google Ad Manager on the video ad tag URL. If present, any key-values here will be merged with Prebid standard targeting key-values. For more information, see the Google Ad Manager documentation on cust_params.

- `output`: (Required) String specifying the type of response expected. This value should be `"vast"`

- `url`: String specifying the Google Ad Manager ad tag to call. You can use this parameter rather then using the `params` object to specify the Google Ad Manager tag. This URL MUST contain the Google Ad Manager `iu` value fully resolved. This URL may contain any other parameters that need to be passed to Google Ad Manager. This string can NOT contain any `#` characters - all macros using that syntax must be fully resolved

- `bid`: (Optional) JSON object describing the Prebid bid for which targeting will be set. If this is not defined, Prebid will use the bid with the highest CPM for the adUnit.

**Required?**

No - If present, then Google Ad Manager is considered to be the primary ad server and the results of the prebid auction will be passed to Google Ad Manager. **One or both of `dfpParameters.params` and `dfpParameters.url` is required.**

**Default Value:**

None

**Example:**

```
options.dfpParameters =
    { params :
      { iu : ‘/19968336/prebid_cache_video_adunit’,
        cust_params :
          { section : ‘blog’),
            output : ‘vast’ }
      }
```

<a name="prebidTimeout"></a>
## prebidTimeout

**Description:**

Specify how long the plugin will wait for the Prebid process to complete.

**Acceptable Values:**

Integer, greater than zero, specifying the maximum time (in milliseconds) that the plugin will wait for a response from Prebid.

**Required?**

No

**Default Value:**

700

{: .alert.alert-info :}
NOTE:  You might need to increase the `prebidTimeout` value when running on mobile platforms, especially when the ad is scheduled as a late midroll or postroll.

**Example:**

`options.prebidTimeout = 900;`

<a name="enablePrebidCache"></a>
## enablePrebidCache

**Description:**

Specify whether `prebidCache` should be enabled.<br>Used to convert a VAST URL to a wrapped VAST XML. It allows prebid.js to accept either VAST URLs or VAST XML. In most cases, `prebidCache` should be enabled. It is required when using Google Ad Manager as the ad server.<br>Some publishers may not need the extra processing of `prebidCache` depending on their particular workflow.

**Acceptable Values:**

Boolean; true = use of prebidCache is enabled; false = use of prebidCache is disabled.

**Required?**

No

**Default Value:**

true

**Example:**

`options.enablePrebidCache = false;`

<a name="sample-config"></a>
## Sample Configuration

Here is a sample Prebid configuration JSON object returned via URL:

```
{
    "prebidPath" : "//cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js",
    "biddersSpec" : {
        "code" : "my-video-tag",
        "mediaTypes": {
            "video": {
                "context": "instream",
		"playerSize": [640, 480],
                "mimes": ["video/mp4", "application/javascript"],
                "protocols" : [1,2,3,4,5,6,7,8],
                "playbackmethod" : [1, 2],
                "api":[1,2]
            }
        },
        "bids": [
            {
                "bidder": "appnexus",
                "params": {
                    "placementId": 9999
                }
            }
        ]
    },
    "bidderSettings": {
        "standard": {
            "adserverTargeting": [
                {
                    "key": "hb_bidder",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return bidResponse.bidderCode;",
                        "}"
                    ]
                },
                {
                    "key": "hb_adid",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return bidResponse.adId;",
                        "}"
                    ]
                },
                {
                    "key": "hb_pb",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return '5.00';",
                        "}"
                    ]
                },
                {
                    "key": "hb_size",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return bidResponse.size;",
                        "}"
                    ]
                }
            ]
        },
        "appnexus": {
            "adserverTargeting": [
                {
                    "key": "hb_appnexus_key1",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return 'value1';",
                        "}"
                    ]
                },
                {
                    "key": "hb_appnexus_key2",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return 'value2';",
                        "}"
                    ]
                },
                {
                    "key": "hb_appnexus_key3",
                    "val": "value3"
                }
            ]
        }
    },
    "prebidConfigOptions" : {
        "enableSendAllBids" : true
    },
    "dfpParameters" : {
        "params" : {
            "iu" : "/123456/your_demo_adunit",
            "output" : "vast"
        },
        "url" : "",
        "bid" : {}
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true
}
```

## Further Reading

- [About the Cross Player Prebid Component]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component.html)
- [Cross Player Prebid Component API]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-api.html)
- [Communication Between Prebid Component and Player]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-communication.html)
- [Download Cross-Player Prebid Component](https://github.com/prebid/cross-player-prebid-component)
