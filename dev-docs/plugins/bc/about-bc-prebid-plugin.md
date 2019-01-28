---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player
description: Overview
top_nav_section: dev_docs
nav_section: plugins
is_top_nav: yeah
pid: 1
---



# Prebid Plugin for Brightcove (Videojs) Player

## Overview

The Brightcove Plugin for Prebid (BcPrebidVast) is a plugin to the Brightcove player. This plugin will provide prebid support and then manage the ad playback of the ad that was selected via prebid, as supported by prebid.js via prebid.org.

## Plugin Behavior

The Brightcove Prebid Plugin supports the following features:

- Several prebid styles, depending on how the prebid options are configured:
    - No ad server is specified
    - DFP ad server is specified
    - Publisher uses another preferred ad server
    - Header bidding is conducted outside of the plugin

- Video ad playback within a Brightcove player:
    - Single Ad Playback via VAST XML at one or more ad break positions within a video. (For example, you can specify options for a preroll and a postroll ad in a single call to the plugin.)
    - Versions up thru VAST 3.0
    - Both Video and VPAID creatives
    - If the AppNexus Viewability Wrapper is delivered:
        - AppNexus viewability measurement
        - AppNexus domain detection

- Includes no Google IMA code by default

- Open source project

The plugin will support the following UI features:

- Standard ad controls used for single ads:
    - Ad Indicator with configurable text
    - Optional skip button including countdown text with configurable text
    - Ad pause and resume
    - Fullscreen support

- Disabled scrubbing during ad playback

- Standard click-through support

The plugin supports one or more of the following ad slot locations in a single video and/or in a player configured for playlisting:

- Preroll
-  Midroll
    - by time
    - by percentage
- Postroll
- Ad Icons
-	Playlisting Players
    - This feature includes the ability to customize how often, by video clips, you want to display an ad during a playlist.
    - Be default, the plugin will attempt to play an ad for every video in the playlist.


## Components

BcPrebidVast is supported by the following components:

- **bc_prebid_vast**
- **bc_prebid_vast_plugin**
- **MailOnline Plugin**
- **CSS files**

### bc_prebid_vast

`bc_prebid_vast` is a loader script that loads in the full Prebid plugin.  The loader was added to:

- make it easier to debug the plugin, particularly when the plugin is directly embedded into the Brightcove Player in the Studio
- remove the necessity to have to re-publish a Brightcove Player instance every time the code in the main plugin has been modified.  The only time a player instance would need to be re-published is when the code in the loader itself changes.

You can think of the “plugin” as being a combination of the loader and the plugin code itself. However, when registering the Prebid plugin, either on page or in the Brightcove Studio, the URL to the loader should be used.  This loader will then load in the main plugin script, either from the default location or from a custom location that may be specified in the Prebid options passed via the plugin configuration.

#### Minified Version

- Default location:  `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js`
- Repository location:  `https://github.com/prebid/prebid-js-plugin-brightcove.git`
   - after building: `./prebid-js-plugin-brightcove/dist/bc_prebid_vast.min.js`

#### Non-Minified Version

- Default location:  `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.js`
- Repository location:  `https://github.com/prebid/prebid-js-plugin-brightcove.git`
   - after building: `./prebid-js-plugin-brightcove/dist/bc_prebid_vast.js`

### bc_prebid_vast_plugin

`bc_prebid_vast_plugin` is the main Brightcove plugin itself, which invokes the Prebid process and renders the selected video ad.  This script is loaded by the Prebid plugin loader described above.

#### Minified Version

- Default location: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_plugin.min.js`
- Repository location:  `https://github.com/prebid/prebid-js-plugin-brightcove.git`
    - after building: `./prebid-js-plugin-brightcove/dist/bc_prebid_vast_plugin.min.js`

#### Non-Minified Version

- Default location: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_plugin.js`
- Repository location:  `https://github.com/prebid/prebid-js-plugin-brightcove.git`
    - after building: `./prebid-js-plugin-brightcove/dist/bc_prebid_vast_plugin.js`

### MailOnline Plugin

The MailOnline plugin is used by the prebid plugin to render the ad. This plugin includes modifications to the plugin that can be found in the MailOnline repository. These modifications were made to improve its behavior when rendering ads. If you have your own modified version of the MailOnline plugin, you can replace this link with a link to your own build if you build your own version of this plugin. You may also replace this plugin with your own custom video ad renderer.

#### Minified Version

- Default location: `http://acdn.adnxs.com/video/plugins/mol/videojs_5.vast.vpaid.min.js`
- Repository location:  `https://github.com/prebid/videojs-mailonline-plugin.git`
   - after building: `./videojs-mailonline-plugin/dist/videojs_5.vast.vpaid.min.js`

#### Non-Minified Version

- Default location:  `http://acdn.adnxs.com/video/plugins/mol/videojs_5.vast.vpaid.js`
- Debuggable Non-Minified Version:  `http://acdn.adnxs.com/video/plugins/mol/debug/videojs_5.vast.vpaid.js`
- Repository location:  `https://github.com/prebid/videojs-mailonline-plugin.git`
   - after building: `./videojs-mailonline-plugin/dist/videojs_5.vast.vpaid.js`

### CSS

The plugin relies on two CSS files to control the ad playback:

- Prebid plugin CSS: `bc_prebid_vast_vjs.css`
- MailOnline plugin CSS: `bc_vpaid_vast_mo.css`

#### Prebid Plugin CSS

Defines CSS styles that are used directly by the plugin.

- Default location: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css`
- Repository location: `./prebid-js-plugin-brightcove/src/bc_prebid_vast_vjs.css`

#### MailOnline Plugin CSS

Defines CSS styles that are used by the MailOnline Plugin. If you are using another renderer, you might need to include your own CSS file for that renderer.

- Default location: `http://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css`
- After building:  `./videojs-mailonline-plugin/bin/bc_vpaid_vast_mo.css`

## Models Supported

The plugin supports several styles of prebid processing:

- DFP is the primary ad server
    - Bids from defined bidders will be passed to DFP
    - DFP will return the ad URL to play

- An ad server other than DFP is the primary ad server
    - Publishers will provide a callback that the plugin will use to pass the list of bids to consider to the publisher's code
    - Publisher code and your preferred ad server will be responsible for determining which ad to play
    - Publisher code will specify the selected ad when requesting playback of the ad by the plugin

- There is no main ad server  
    - Only the bidders defined in the ad unit will be considered
    - Bids from the defined bidders will be collected by the plugin
    - The plugin will pick the highest bid
    - The plugin will then play the ad it selected

In addition, the publisher can run its own prebid code outside the of the plugin but use the plugin to render the ad in the Brightcove Player.

## How It Works

For each ad break that will be shown in a video:

- The plugin will use the parameters passed to it to invoke prebid.
- If a primary ad server is being used to make the final decision, the prebid bidding results will be passed to the desired ad server.
- The response should provide a URL to a VAST creative or a VAST XML document that defines an ad to play.
- Upon completion of the prebid, the winning ad can then be played by the plugin at the specified time.
- By default, the prebid plugin implicitly invokes the default MailOnline plugin to render the ad.
- If a valid VAST creative is not returned or if the prebid process does not complete successfully within a specified period of time, then no ad will play.
- A publisher can invoke the prebid/render methods as many times as desired if they want to play ads at different points along the video timeline.

### Where Prebid Can be Invoked

The prebid process can be executed at three different times.

1. The plugin can run the prebid process in the header
2. The plugin can run the prebid process after the Brightcove Player has been loaded.
3. A publisher can choose to run the prebid process on their own and simply ask the plugin to play the selected ad.

There are pros and cons for each of these methods, as shown below. Publishers should use the method that best suits their needs.

#### Plugin running prebid in the header

The plugin can run the prebid process in the header so that it can be started before the Brightcove Player is loaded. The plugin can be then be instructed to play the results of prebid once the Brightcove Player is ready to play.

**Advantages**

- Potentially lower latency in rendering the selected ad. The reduction in latency is directly related on how long the prebid process is allowed to run.

**Disadvantages**

- Requires publisher code both in the header, to start the prebid process, and also in the body, to render the ad once the Brightcove Player is loaded.
    - See **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**
- Publisher *must* register the plugin on the page; it cannot register the plugin in the Brightcove Studio.

**Caveats**

- There is no guarantee that the prebid process will complete *before* the Brightcove Player is loaded, so there may still be some latency.
- If the Brightcove Player is being embedded in a cross-domain (unfriendly) iFrame, then the prebid process must occur in the header of the iFrame and *not* in the header of the page.

#### Plugin running prebid from the Brightcove Player

The plugin can run the prebid process after the Brightcove Player has been loaded. In most cases, the plugin will then automatically render the ad once the prebid process has completed.

**Advantages**

- Simpler publisher integration: the integration code only needs to occur in the body of the document where the Brightcove Player is loaded.
- Publisher can register and completely configure the plugin in the Brightcove Studio or on page, according to their preference. Doing this means you do not need to add any code to a publisher page when using this plugin.
- Because all of the code will run in the same document where the Brightcove Player is located, there are no cross-domain issues (with one potential exception, noted in the Caveats below).
- See **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

**Disadvantages**

- Potentially longer latency in rendering the selected ad. The observed latency is directly related to how long the prebid process is allowed to run.

**Caveats**

- If the Brightcove Player is being embedded in a cross-domain (unfriendly) iFrame *and* the publisher is using a preferred ad server to determine the selected ad, then the publisher's code to select the winning ad must run within the same iFrame where the Brightcove Player is located.

#### Publishers can run header bidding outside of the plugin

Publishers can decide to implement their own custom header bidding outside of the plugin. However, they can use the plugin to render the ad in a Brightcove Player.  

- The result of the header bidding process must be stored and then provided to the plugin when the request to start the ad playback is made.
- This result should be a URL which returns a valid VAST creative defining the ad to be played. The result may also be a string containing the valid VAST creative.
- The winning ad will then be played by the plugin at the specified time.

If the result is not a valid VAST creative, then no ad will play.

**Advantages**

- Potentially lower latency in rendering selected ad. The reduction in latency is directly related to how long the prebid process is allowed to run.
- Publisher only needs to call `renderAd()` to ask the plugin to play the ad at the selected time.
- Publisher does not need to implement code to render the ad.
- Publisher can register the plugin in the Brightcove Studio or on page, according to their preference.

**Disadvantages**

- Publisher is responsible for managing the prebid process as well as providing the results of the prebid.
- Publisher is responsible for syncing the results of prebid with the call to render the results.

**Caveats**

- There is no guarantee that the prebid process will complete before the Brightcove Player is loaded, so there might still be some latency.
- If the Brightcove Player is being embedded in a cross-domain (unfriendly) iFrame, then the prebid process must occur in the header of the iFrame and *not* in the header of the page.

## How To Integrate and Configure

The Brightcove Prebid Plugin can be integrated and configured in one of two ways:

- Directly on the publisher page and/or through scripts that are loaded directly by the publisher page. This method of integration is required if you want to run prebid in the header of the page.
- In the Brightcove Studio in the same area where you set up the Brightcove Player instance that you are going to use.

Details about the Integration Methods can be found in [How to Integrate and Configure Prebid Plugin for Brightcove (Videojs) Player]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration.html).

## Plugin API
The Brightcove Prebid Plugin supports an API. Information about this API can be found in the [Prebid Plugin for Brightcove (Videojs) Player API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html).

## Plugin Options

Configuration options are passed into the plugin via a JSON structure. This structure includes:

- Prebid configuration settings  
  These are options that define how the prebid process should be executed. These options include:
    - Definitions of the bidders that should be used by prebid.js
    - Configuration settings used when DFP is the primary ad server
    - Configuration settings if you are using another ad server as the primary ad server
    - Other bidding settings used by prebid.js

- Rendering options  
  These options configure some of the aspects of video ad playback, such as:
    - Skippable behavior
    - Custom translations for UI components such as the Ad Indicator, the Skip button and the countdown text

{: .alert.alert-info :}
NOTE:  If you are requesting prebid for more than one ad break in a video, you need to define an array of configuration options, one for each ad break.  The configuration should include the `timeOffset` option to identify when the ad break should occur.  See [Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html) for more details.

Details about the options supported by the Brightcove Prebid Plugin can be found in [Prebid Plugin for Brightcove (Videojs) Player - Plugin Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html).

## Sample Implementations

Sample implementations are provided at:

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**

- **[Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html)**

</div>
