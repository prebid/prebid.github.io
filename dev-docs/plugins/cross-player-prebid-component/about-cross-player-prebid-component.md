---
layout: page_v2
title: Cross-Player Prebid Component
description: Overview of the cross-player Prebid component
top_nav_section: dev_docs
nav_section: plugins
---

# Cross-Player Prebid Component

The [Cross-Player Prebid Component](https://github.com/prebid/cross-player-prebid-component) is a JavaScript component that manages the client-side Prebid process for video and then passes the Prebid results over to a publisher player. It is then the player's responsibility to render the selected ad.  Since the component itself does not do any of the rendering it can be used with any video player.

## Overview

The Component is a JavaScript file that is loaded via URL.  It can be loaded into the header of the HTML document for header bidding or it can be loaded by a player for "just-in-time" Prebid.  You can use the default location of the Component or, because it is an open-source project, you can download the source for the Component, modify it (if needed) to meet your needs, and build it, then host your custom build on your own site.

{% capture noteAlert %}
Users have the option of running a localized version of the Cross-Player Prebid Component by either downloading or checking out the current build from our Github repo at [github.com/prebid/cross-player-prebid-component](https://github.com/prebid/cross-player-prebid-component) or loading the most current production version from our CDN located at [acdn.adnxs.com/video/plugins/cp/PrebidPluginCP.min.js](https://acdn.adnxs.com/video/plugins/cp/PrebidPluginCP.min.js)
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

## Using the Component

The process for using the Cross-Player Prebid Component is as follows:

{: .table .table-bordered .table-striped }
| Step | Who | What | Comments |
| :---- | :------------ | :------------------------------- |:------------------------- |
| 1 | Publisher | Passes the Prebid configuration options to the Component. Options should be expressed in a JSON object. | Options can be defined a) in a file that is loaded using a URL or b) directly on the page where the Component is running. See [Cross Player Prebid Component Configuration]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-config.html) for more information. |
| 2 | Component | Passes the Prebid configuration to Prebid.js and starts the Prebid process. | You can specify your custom build of Prebid.js. |
| 3 | Prebid.js | Passes the Prebid results back to the Component. | |
| 4 | Component | If the primary ad server has been indicated as Google Ad Manager, the Component passes the Prebid results to the primary ad server in a format supported by the ad server. | |
| 5 | Component | If a primary ad server has been indicated, the Component receives the final results of the Prebid process from the primary ad server. | |
| 6 | Component | Communicates the results of the Prebid process. The exact method of this communication varies depending on where the Component is running and whether the publisher is in the same HTML document as the Component. | See [Communication Between Prebid Component and Player]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-communication.html) for more information. |
| 7 | Publisher | Publisher uses the Prebid results to load and render the winning ad in their video player. | Result is typically a URL to the Prebid cache provided by Prebid.js where the VAST XML can be loaded. |

## Further Reading

* [Cross-Player Prebid Component API]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-api.html)
* [Cross Player Prebid Component Configuration]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-config.html)
* [Communication Between Prebid Component and Player]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-communication.html)
* [Download Cross-Player Prebid Component](https://github.com/prebid/cross-player-prebid-component)
