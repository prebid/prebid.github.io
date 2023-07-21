---
layout: page_v2
title: Cross-Player Prebid Component API
description: Description of the cross-player Prebid component API
top_nav_section: dev_docs
nav_section: plugins
---

# Cross-Player Prebid Component API

The [Cross-Player Prebid Component]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component.html) supports the doPrebid(prebidConfig) API.

## doPrebid(prebidConfig)

Use this API to start the Prebid process with the Prebid configuration options provided.  The Component will invoke Prebid.js using the Prebid configuration options and handle the response.  If needed, the Component will then pass the Prebid results over to the primary ad server and retrieve the final URL to be used to retrieve the selected ad.

{% capture importantAlert %} When the component is loaded, it will automatically create a window variable named prebidPluginCP, which will contain the instance of the Component.  You *must* use this name when calling the API. :::

{% include alerts/alert_important.html content=importantAlert %}

### Arguments

* **prebidConfig**  
  Specifies the Prebid configuration options that are to be used when calling Prebid.js.  The options can be expressed in one of the following formats:
  * JSON object containing all the needed configuration options.
  * URL, which loads in a file containing the configuration options expressed in a JSON object.

### Return Value

None

### Sample Code

`window.prebidPluginCP.doPrebid('https://my-url-to-prebid-options.json');`

## Further Reading

* [About the Cross Player Prebid Component]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component.html)
* [Cross Player Prebid Component Configuration]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-config.html)
* [Communication Between Prebid Component and Player]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-communication.html)
* [Download Cross-Player Prebid Component](https://github.com/prebid/cross-player-prebid-component)
