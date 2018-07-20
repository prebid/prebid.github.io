---
layout: page
title: Prebid Options Supported by the Brightcove Prebid Plugin
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---

<div class="bs-docs-section" markdown="1">

# Prebid Options Supported by the Brightcove Prebid Plugin

## Overview

Configuration options are passed into the plugin in a JSON object structure.  These options can include:

- Prebid options, which configure how the prebid process should be executed.
- Rendering options, which customize the ad playback.

## Plugin Prebid Options

These options are used to configure how the plugin should execute the prebid process.  They are included in the same JSON structure where the rendering options are also provided.

- [prebidPath](#prebidPath)
- [biddersSpec](#biddersSpec)
- [bidderSettings](#bidderSettings)
- [prebidConfigOptions](#prebidConfigOptions)
- [dfpParameters](#dfpParameters)
- [adServerCallback](#adServerCallback)
- [prebidTimeout](#prebidTimeout)
- [enablePrebidCache](#enablePrebidCache)

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

https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js

**Example:**

`options.prebidPath = 'http://your-path/prebid.js'`

<a name="biddersSpec"></a>
### biddersSpec

**Description:**

The parameters that are used in making a prebid call. These parameters include definitions of the bidders that will be used during prebid as well as placement configuration parameters.

**Acceptable Values:**

- If prebid should be invoked by the plugin, the value of `biddersSpec` should be a JSON structure providing the definition of the bidders to use as well as placement configuration. (See [Setting Up Prebid Parameters](#set-up-params) for details.)

- If prebid is invoked outside of the plugin, the value of `biddersSpec` must be null; the results of the pre-bidding will be passed into the plugin ad renderer by calling `renderAd()`, passing in the selected creative.

**Required?**

Yes - if you want the plugin to execute prebid.

**Default Value:**

`{}` - this will result in no prebid being executed

**Example:**

See [Setting Up Prebid Parameters](#set-up-params) below

<a name="bidderSettings"></a>
### bidderSettings

**Description:**

Define some behaviors for the platform and specific adapters. The basic structure is a ‘standard’ section with defaults for all adapters, and then one or more adapter-specific sections that override behavior for that bidder.

**Acceptable Values:**

JSON object.

See "bidderSettings" at [Prebid.org]({{site.baseurl}}/dev-docs/publisher-api-reference.html) for details.

**Required?**

No - Defining `bidderSettings` is optional; the platform has default values for all of the options.

Adapters may specify their own default settings, though this isn’t common. Some sample scenarios where publishers may wish to alter the default settings include:

- Using bidder-specific ad server targeting instead of Prebid-standard targeting.
- Passing additional information to the ad server.
- Adjusting the bid CPM sent to the ad server.

**Default Value:**

None

**Example:**

`options.bidderSettings = { ... };`

<a name="prebidConfigOptions"></a>
### prebidConfigOptions

**Description:**

Additional options that are passed in to the prebid.js `setConfig()` method.

**Acceptable Values:**

JSON object.

Supported fields are documented in the [Prebid.org Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setConfig)

**Required?**

No

**Default Value:**

None

**Example:**

`options.prebidConfigOptions = { publisherDomain: "https://www.theverge.com"};`

<a name="dfpParameters"></a>
### dfpParameters

**Description:**

Parameters used when using DFP as the ad server.

See prebid.org documentation for [buildVideoUrl]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.adServers.dfp.buildVideoUrl)

**Acceptable Values:**

JSON object

Can contain the following fields:

- `params`: JSON object containing parameters needed to make DFP call. Parameters include:
  - `iu`: string (Required)
  - DFP adUnit ID. For more information, see the DFP documentation on iu.

- `cust_params`: JSON object (Optional). Key-value pairs that will be sent to DFP on the video ad tag URL. If present, any key-values here will be merged with Prebid standard targeting key-values. For more information, see the DFP documentation on cust_params

- `output`: (Required) String specifying the type of response expected. This value should be `"vast"`

- `url`: String specifying the DFP ad tag to call. You can use this parameter rather then using the `params` object to specify the DFP tag. This URL MUST contain the DFP `iu` value fully resolved. This URL may contain any other parameters that need to be passed to DFP. This string can NOT contain any `#` characters - all macros using that syntax must be fully resolved

- `bid`: (Optional) JSON object describing the Prebid bid for which targeting will be set. If this is not defined, Prebid will use the bid with the highest CPM for the adUnit.

**Required?**

No - If present, then DFP is considered to be the primary ad server and the results of the prebid auction will be passed to DFP. One or both of `dfpParameters.params` and `dfpParameters.url` is required.

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

<a name="adServerCallback"></a>
### adServerCallback

**Description:**

Specifies the callback that the plugin should use if the publisher is using an ad server other than DFP. The results of prebid will then be passed to the code managing the third-party ad server. The third-party ad server code will then make the final decision about which ad to play.

**Acceptable Values:**

function (bids, pluginCallback)

The publisher-provided callback should take the following arguments:

- `bids`: array of bid objects that include the bid price for each bid, as returned by `pbjs.requestBids()`

- `pluginCallback`: an optional argument which represents an inline function defined within the plugin. It is used to return the selected ad to plugin for rendering.
`pluginCallback` has the prototype `function (creative)`, where *creative* is the selected ad to be played. The creative argument may be XML or a URL to the XML. This argument should be used as follows:
  - If prebid is being run in the header, this argument is not needed. Instead, the publisher should call `renderAd()` from the third-party ad server code, passing in the selected ad to play
  - If prebid is being run in the body of the document where the Brightcove Player is being loaded, then the publisher must specify this callback argument, which will be used to pass back the third-party ad server results to the plugin so that it can render the selected ad.

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

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**

</div>
