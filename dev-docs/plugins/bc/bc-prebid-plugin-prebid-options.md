---
layout: page_v2
title: Prebid Options Supported by the Brightcove Prebid Plugin
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---

# Prebid Options Supported by the Brightcove Prebid Plugin

## Overview

Configuration options for a single ad break are typically passed into the plugin in a JSON object structure. However, if you want to configure more than one ad break (containing a single ad slot) in a single video, configuration options would be passed into the plugin as an array of JSON objects, each object representing the configuration settings for one of the ad breaks. (See [Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html) for more details.) These options can include:

* Prebid options, which configure how the prebid process should be executed.
* Rendering options, which customize the ad playback.

## Plugin Prebid Options

These options are used to configure how the plugin should execute the prebid process for a single ad break.  They are included in the same JSON structure where the rendering options are also provided for the ad break.

When configuring prebid options for more than one ad break, create an array of Prebid and rendering options for each ad break.

* [Prebid Options Supported by the Brightcove Prebid Plugin](#prebid-options-supported-by-the-brightcove-prebid-plugin)
  * [Overview](#overview)
  * [Plugin Prebid Options](#plugin-prebid-options)
    * [prebidPath](#prebidpath)
    * [biddersSpec](#biddersspec)
    * [bidderAliases](#bidderaliases)
    * [bidderSettings](#biddersettings)
    * [prebidConfigOptions](#prebidconfigoptions)
    * [dfpParameters](#dfpparameters)
    * [adServerCallback](#adservercallback)
    * [prebidTimeout](#prebidtimeout)
    * [enablePrebidCache](#enableprebidcache)
    * [label](#label)
    * [scriptLoadTimeout](#scriptloadtimeout)
    * [prebidPluginPath](#prebidpluginpath)
    * [adapters](#adapters)
    * [loggerLevel](#loggerlevel)
    * [Setting Up Prebid Parameters](#set-up-params)
  * [Links](#links)
    * [Plugin Render Options](#plugin-render-options)
    * [Plugin API](#plugin-api)
    * [Sample Implementations](#sample-implementations)

<a name="prebidPath"></a>

### prebidPath

**Description:**

The path to prebid.js that you wish to use.

NOTE: By default, the plugin currently supports prebid 1.0 and up. It does NOT support version 0.x due to the breaking changes that were added in prebid 1.0

**Acceptable Values:**

String that represents the full path to a version of prebid.js

**Required?**

Not required but recommended.

**Default Value:**

[https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js]

**Example:**

`options.prebidPath = 'https://your-path/prebid.js'`

<a name="biddersSpec"></a>

### biddersSpec

**Description:**

The parameters that are used in making a prebid call. These parameters include definitions of the bidders that will be used during prebid as well as placement configuration parameters.

**Acceptable Values:**

* If prebid should be invoked by the plugin, the value of `biddersSpec` should be a JSON structure providing the definition of the bidders to use as well as placement configuration. (See [Setting Up Prebid Parameters](#set-up-params) for details.)

* If prebid is invoked outside of the plugin, the value of `biddersSpec` must be null; the results of the pre-bidding will be passed into the plugin ad renderer by calling `renderAd()`, passing in the selected creative.

**Required?**

Yes - if you want the plugin to execute prebid.

**Default Value:**

`{}` - this will result in no prebid being executed

**Example:**

See [Setting Up Prebid Parameters](#set-up-params) below

<a name="bidderAliases"></a>

### bidderAliases

**Description:**

Define aliases for bidders that are being specified in the biddersSpec. Using aliases allows to you to use the same bidder more than once with different targeting parameters.

**Acceptable Values:**

Array of one or more bidder aliases definitions.

Each bidder alias definition is defined in a JSON object containing the following fields:

* `bidderName`: The name of a known bidder adapter that is being used in bidding.
* `name`: A String that species the name of the alias for the bidder adapter.

See "aliasBidder" at [Prebid.org]({{site.baseurl}}/dev-docs/publisher-api-reference.html) for details.

**Required?**

No

**Default Value:**

None

**Example:**

```javascript
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

### bidderSettings

**Description:**

Define some behaviors for the platform and specific adapters. The basic structure is a 'standard' section with defaults for all adapters, and then one or more adapter-specific sections that override behavior for that bidder.

**Acceptable Values:**

When you are defining all options to the prebid plugin directly on the page, you may use a JSON Object using same syntax described under "bidderSettings" on [Prebid.org]({{site.baseurl}}/dev-docs/publisher-api-reference.html).

However, if you're defining all options directly in Brightcove Studio, you cannot use inline functions as the "val" of a bidder setting key. The use of inline functions breaks the JSON object that you are creating in the Studio. To get around this problem, the plugin supports using a syntax consisting of an array of strings to represent the inline function. The plugin then takes care of re-creating the inline function once the plugin has been loaded.

When using this syntax, the first element of the array MUST be a String with the following value: "valueIsFunction".

The rest of the elements in the array are a series of strings that comprise the literal lines of code of your function. In other words, each line of code in your `bidderSettings` value function is converted to a string value, and added in order to the JSON array.

For example, if a `bidderSettings` function value on the page would normally look like this:

```javascript
...,
{
  key: "hb_size",
  val: function(bidResponse) {
    return bidResponse.size;
  }  
},
...
```

When you put it into Brightcove Studio as part of your settings JSON, it would look like:

```javascript
...,
{
  "key": "hb_size",
  "val": [
    "valueIsFunction",
    "function(bidResponse) {",
    "  return bidResponse.size;",
    "}"
  ]
},
...
```

NOTE: That if the value of a bidder setting is NOT a function, but is instead a standard JSON-supported value type (Number, String, or Boolean), then you do not need to use this special array-based syntax.

For example:

```json
...,
{
  "key": "hb_size",
  "val": "640x480"
},
...
```

A Brightcove Prebid Plugin : Bidder Settings JSON Converter tool has been created that you can use to convert bidder settings as they would be defined on the page into the format acceptable in Brightcove Studio. You can access this tool directly from the GitHub repository for the plugin: [https://github.com/prebid/prebid-js-plugin-brightcove/blob/master/tools/biddersettings.html](https://github.com/prebid/prebid-js-plugin-brightcove/blob/master/tools/biddersettings.html)

See "bidderSettings" at [Prebid.org]({{site.baseurl}}/dev-docs/publisher-api-reference.html) for details.

**Required?**

No - Defining `bidderSettings` is optional; the platform has default values for all of the options.

Adapters may specify their own default settings, though this isn't common. Some sample scenarios where publishers may wish to alter the default settings include:

* Using bidder-specific ad server targeting instead of Prebid-standard targeting.
* Passing additional information to the ad server.
* Adjusting the bid CPM sent to the ad server.

**Default Value:**

None

**Example:**

When `bidderSettings` are defined on the page:

```javascript
bidderSettings = {
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

When `bidderSettings` are defined in Brightcove Studio:

```javascript
"bidderSettings": {
    "standard": {
      "adserverTargeting": [{
        "key": "hb_bidder",
        "val": [
          "valueIsFunction",
          "function(bidResponse) {",
          "  return bidResponse.bidderCode;",
          "}"
        ]
      }, {
        "key": "hb_adid",
        "val": [
          "valueIsFunction",
          "function(bidResponse) {",
          "  return bidResponse.adId;",
          "}"
        ]
      }, {
        "key": "hb_pb",
        "val": [
          "valueIsFunction",
          "function(bidResponse) {",
          "  return bidResponse.pbMg;",
          "}"
        ]
      }, {
        "key": "hb_size",
        "val": [
          "valueIsFunction",
          "function (bidResponse) {",
          "  return bidResponse.size;",
          "}"
        ]
      }]
    }
}
```

<a name="prebidConfigOptions"></a>

### prebidConfigOptions

**Description:**

Additional options that are passed in to the prebid.js `setConfig()` method.

**Acceptable Values:**

JSON object.

Supported fields are documented in the [Prebid.org Publisher API Reference](/dev-docs/publisher-api-reference/setConfig.html)

**Required?**

No

**Default Value:**

None

**Example:**

`options.prebidConfigOptions = { pageUrl: "https://www.theverge.com"};`

<a name="dfpParameters"></a>

### dfpParameters

**Description:**

Parameters used when using Google Ad Manager as the ad server.

See prebid.org documentation for [buildVideoUrl](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html)

**Acceptable Values:**

JSON object

Can contain the following fields:

* `params`: JSON object containing parameters needed to make Google Ad Manager call. Parameters include:
  * `iu`: string (Required)
  * Google Ad Manager adUnit ID. For more information, see the Google Ad Manager documentation on iu.
  * `cust_params`: JSON object (Optional). Key-value pairs that will be sent to Google Ad Manager on the video ad tag URL. If present, any key-values here will be merged with Prebid standard targeting key-values. For more information, see the Google Ad Manager documentation on cust_params.

* `output`: (Required) String specifying the type of response expected. This value should be `"vast"`

* `url`: String specifying the Google Ad Manager ad tag to call. You can use this parameter rather then using the `params` object to specify the Google Ad Manager tag. This URL MUST contain the Google Ad Manager `iu` value fully resolved. This URL may contain any other parameters that need to be passed to Google Ad Manager. This string can NOT contain any `#` characters - all macros using that syntax must be fully resolved

* `bid`: (Optional) JSON object describing the Prebid bid for which targeting will be set. If this is not defined, Prebid will use the bid with the highest CPM for the adUnit.

**Required?**

No - If present, then Google Ad Manager is considered to be the primary ad server and the results of the prebid auction will be passed to Google Ad Manager. One or both of `dfpParameters.params` and `dfpParameters.url` is required.

**Default Value:**

None

**Example:**

```javascript
options.dfpParameters = { 
  params: { 
    iu: '/19968336/prebid_cache_video_adunit',
    cust_params: { 
      section : 'blog',
      output : 'vast' 
    }
  }
}
```

<a name="adServerCallback"></a>

### adServerCallback

**Description:**

Specifies the callback that the plugin should use if the publisher is using an ad server other than DFP. The results of prebid will then be passed to the code managing the third-party ad server. The third-party ad server code will then make the final decision about which ad to play.

**Acceptable Values:**

May be one of the following:

* function (bids, pluginCallback)
* String identifying the name of the function that exists on the page that the plugin should call with the prebid results. NOTE: You must use this format if you are configuring the prebid options inside the Brightcove Studio.

The publisher-provided callback should take the following arguments:

* `bids`: array of bid objects that include the bid price for each bid, as returned by `pbjs.requestBids()`

* `pluginCallback`: an optional argument which represents an inline function defined within the plugin. It is used to return the selected ad to plugin for rendering.
`pluginCallback` has the prototype `function (creative)`, where *creative* is the selected ad to be played. The creative argument may be XML or a URL to the XML. This argument should be used as follows:
  * If prebid is being run in the header, this argument is not needed. Instead, the publisher should call `renderAd()` from the third-party ad server code, passing in the selected ad to play
  * If prebid is being run in the body of the document where the Brightcove Player is being loaded, then the publisher must specify this callback argument, which will be used to pass back the third-party ad server results to the plugin so that it can render the selected ad.

**Required?**

No - If present, the publisher-specified ad server is assumed and the results of the prebid auction will be sent back to the publisher via the specified callback. The publisher will then pass back the URL of the winning ad to render when they call `renderAd()` if they are running prebid in the header. If they are running prebid after the Brightcove Player has loaded, then publisher will pass back the URL of the winning ad using the pluginCallback provided.

NOTE: If both `dfpParameters` AND `adServerCallback` have non-null values, then it is assumed that DFP is the primary ad server.

**Default Value:**

None

**Example:**

`options.adServerCallback =  myAdServerCallback(bids, pluginCallback)`

<a name="prebidTimeout"></a>

### prebidTimeout

**Description:**

Specify how long the plugin will wait for the prebid process to complete.

**Acceptable Values:**

Integer, greater than zero, specifying max time in milliseconds that the plugin will wait for a response from prebid.

**Required?**

No

**Default Value:**

700

{: .alert.alert-info :}
NOTE:  You may need to increase the `prebidTimeout` value when running on mobile platforms, especially when the ad is scheduled as a late midroll or postroll.

**Example:**

`options.prebidTimeout = 900;`

<a name="enablePrebidCache"></a>

### enablePrebidCache

**Description:**

Specify whether `prebidCache` should be enabled.<br>Used to convert a VAST URL to a wrapped VAST XML. It allows prebid.js to accept either VAST URLs or VAST XML. In most cases, `prebidCache` should be enabled. It is required when using DFP as the ad server.<br>Some publishers may not need the extra processing of `prebidCache` depending on their particular workflow.

**Acceptable Values:**

Boolean; true = use of prebidCache is enabled; false = use of prebidCache is disabled.

**Required?**

No

**Default Value:**

true

**Example:**

`options.enablePrebidCache = false;`

<a name="labeloption"></a>

### label

**Description:**

User-defined text that identifies a set of prebid/rendering options.  This string is particularly useful when defining configuration options for more than one ad break.  Use this option to make it easier to manage all the sets of configuration options.

**Acceptable Values:**

String that uniquely identifies a set of prebid options.  Your label should be logically correct.  For example, do not use a label of "preroll ad" if the ad is going to be used in the midroll position.

**Required?**

No

**Default Value:**

None

**Example:**

`options1.label = 'midroll-at-5-minutes';`

<a name="scriptLoadTimeout"></a>

### scriptLoadTimeout

**Description:**

Maximum time in milliseconds that the plugin will wait for a script file to load.  For example, this value controls how long the plugin will wait for Prebid.js to load.

**Acceptable Values:**

Any positive integer

**Required?**

No

**Default Value:**

3000

**Example:**

`options1.scriptLoadTimeout = 5000;`

<a name="prebidPluginPath"></a>

### prebidPluginPath

**Description:**

Allows the user to specify a custom path used to load the Prebid plugin script.  This option could be used when you are building custom or test versions of the plugin that you want to try out.

In version 0.4, the original plugin was split into a loader and the main plugin.  The loader is the file that you specify when embedding the plugin into the player.  The loader will then load the main plugin itself at runtime.  This separation simplifies the process of debugging the plugin, especially when the plugin is embedded directly into the player in Brightcove Studio.  It also means that when updates are published for the plugin, publishers will be able to pick up the updates without having to re-publish their players.

When registering the plugin to the Brightcove Player, you should continue to use the original path to the plugin.  This is now the path to the loader.  By default, this path is: `https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js`.

Also, by default, the loader will load in the plugin from: `https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_plugin.min.js`.

However, if you are trying to run custom or trial versions of the plugin, you can specify the path to this trial version using this new option: `prebidPluginPath`.

**Acceptable Values:**

String that represents the full path to a version of the custom or trial Prebid plugin.

**Required?**

No.

**Default Value:**

[https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_plugin.min.js]

**Example:**

`options1.prebidPluginPath = 'https://your-path/bc_prebid_vast_plugin.js';`

<a name="pb-adapters"></a>

### adapters

**Description:**

Adapters are a mechanism that a publisher can use to add some specific behavior at runtime to customize the behavior of the Prebid plugin.  

The `adapters` option defines a list of adapters that the publisher would like the Prebid plugin to load and execute.

See [How To Build An Adapter for Prebid Plugin]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-building-adapter.html) for details on how to build an adapter.

**Acceptable Values:**

If specified, the value of this option should be an array containing one or more adapter definitions.

Each adapter definition is specified as an object with the following fields:

* id: A string that uniquely identifies an adapter.  The adapter will then create itself as a variable on the window object of the document where it is loaded.  This should also be the identifier that the adapter code itself knows.
* url: A string which specifies the URL used to load the adapter script.

**Required?**

No

**Default Value:**

No default value. If this option is not specified with a valid value, then the plugin will not load and start any adapters.

**Example:**

`options.adapters = [{id : 'my-adapter', url : 'https://my-path/my-plugin-adapter.js'}]`

<a name="loggerLevel"></a>

### loggerLevel

**Description:**

The `loggerLevel` is used to control the amount of information that is emitted by the plugin into the browser's console.log.  These levels correspond roughly to the log levels supported by many of the browsers.

{% capture noteAlert %} It is not recommended to set the `loggerLevel` to 0 (silent). {% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

**Acceptable Values:**

Use one of the following integer values to set `loggerLevel`:

* 0 = Silent (not recommended)
* 1 = Always (trace messages that are always reported, e.g. Version Number)
* 2 = Error level
* 3 = Warn
* 4 = Info
* 5 = Log
* 6 = Verbose

**Required?**

No

**Default Value:**

1 (meaning that version number and other “always” reported messages will be emitted to the console.log.)

**Example:**

`options.loggerLevel = 6`

<a name="set-up-params">
### Setting Up Prebid Parameters

The publisher must pass the prebid parameters to the plugin, via the `biddersSpec` option, if the plugin is expected to invoke the prebid process.  The syntax for these parameters is defined in [Bidders' Params]({{site.baseurl}}/dev-docs/bidders.html) on Prebid.org.

Use the parameters for AppNexus bidder to include an AppNexus bidder for video ads.

If these parameters are not specified, the plugin assumes that the prebid process has occurred outside of the plugin and that the results of the header bidding will be provided to the plugin via the `headerBiddingResult` option.

## Links

### Plugin Render Options

Information about the Render Options supported by the plugin can be found at:

**[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**

### Plugin API

The Brightcove Prebid Plugin supports an API.  Information about this API can be found at

**[Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**

### Sample Implementations

Sample implementations are provided at:

* **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**

* **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

* **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

* **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**

* **[Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html)**

</div>
