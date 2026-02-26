---
title: Cross-Player Prebid Component API
description: Description of the cross-player Prebid component API
---

# Cross-Player Prebid Component API

The [Cross-Player Prebid Component](/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component) supports the doPrebid(prebidConfig) API.

## doPrebid(prebidConfig)

Use this API to start the Prebid process with the Prebid configuration options provided.  The Component will invoke Prebid.js using the Prebid configuration options and handle the response.  If needed, the Component will then pass the Prebid results over to the primary ad server and retrieve the final URL to be used to retrieve the selected ad.

:::warning
When the component is loaded, it will automatically create a window variable named prebidPluginCP, which will contain the instance of the Component. You *must* use this name when calling the API.
:::

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

* [About the Cross Player Prebid Component](/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component)
* [Cross Player Prebid Component Configuration](/dev-docs/plugins/cross-player-prebid-component/cross-player-config)
* [Communication Between Prebid Component and Player](/dev-docs/plugins/cross-player-prebid-component/cross-player-communication)
* [Download Cross-Player Prebid Component](https://github.com/prebid/cross-player-prebid-component)
