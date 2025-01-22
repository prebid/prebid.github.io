---
layout: page_v2
title: Dynamic Plugin Integration With Brightcove Player - On the Page
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Dynamic Plugin Integration With Brightcove Player - On the Page

## Overview

The Prebid Plugin for the Brightcove Player can be either integrated dynamically directly on the page or via Brightcove Studio.  This page describes the steps to take when integrating the plugin directly on the page.

When you integrate the plugin directly on the page, you have greater flexibility in handling the plugin and the prebid process. Using this method allows you to run prebid at different times depending on your preferences.

* You can run prebid in the header, before the Brightcove Player is loaded. Note that you cannot run prebid in the header if you are integrating the plugin via Brightcove Studio.
* You can run prebid "just-in-time", after the Brightcove Player is loaded.
* You can run prebid externally to the plugin and then simply use the plugin to render the selected ad.

## Integrating the Plugin on the Page

Here is sample code for loading in the plugin and its constituents directly on the page.

```html
<!-- Load in the plugin css stylesheets -->
<!-- This is usually done in the header -->
<!-- You may need to modify these paths if you are using your own build -->
<link href="https://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css" rel="stylesheet">
<link href="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css" rel="stylesheet">


<!-- Load in the plugin  -->
<!-- This can be done in the header or the body depending on where the plugin is first going to be invoked -->
<!-- You may need to modify these paths if you are using your own build -->
<script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js"></script>
```

## Triggering the Plugin to Execute Prebid in the Header

Publishers can instruct the Brightcove Prebid Plugin to run prebid in the header before the Brightcove Player is loaded.  This allows prebid to get a head start in its processing before the Brightcove Player is ready to start playing video.

To do this, the publisher must add code in the header and in the body of the document where the Brightcove Player will  be located.  If the  Brightcove Player is going to be located in an iframe, then the header code must be defined in the header of the iframe.

Publishers need to define all of the options needed to configure the prebid process in a well-known variable in the header, as described below.  They must also load the Plugin script in the header *after* they have defined the options.  When the Plugin script loads, it looks to see if the specific variable is present and it has a non-empty value.  If it does, then the script will invoke the prebid process before the rest of the page loads.

Once the Brightcove Player has loaded, then publisher needs to call `renderAd()` on the plugin, passing in any render options as well as the ID of the Brightcove Player video tag.  At that time, the plugin will find the prebid results and will use those results to display the ad when `renderAd()` is called.

### Code to be Added to the Header

* Define the prebid options in the header of the document where the Brightcove Player will be located.
  * The specified options MUST be saved in a variable named `bc_plugin_pbjs` in a property named `plugin_prebid_options`.
  * These options can include any of the options supported in **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**
* AFTER the prebid options have been defined, load the Plugin script. Once the script is loaded, it will look to see if `bc_plugin_pbjs.plugin_prebid_options` is defined.  If so, then the Plugin script will invoke the prebid process.

#### How To Invoke Header Prebid by the Plugin

```html
<head>
...
<script>
    ...
    // define options for ad playback
    window.bc_plugin_pbjs = {plugin_prebid_options: {}};
    // specify prebid parameters as the value of biddersSpec
    // the set of bidders here shows how to specify the AppNexus video bidder:  appnexus
    var params = {
            code : 'my-video-tag',
            sizes : [640, 480],
            mediaType: 'video',
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: 12334567,
                        video: {
                            skippable: true,
                            playback_method: ['auto_play_sound_off']
                        }
                    }
                }
            ]
        };
    window.bc_plugin_pbjs.plugin_prebid_options.biddersSpec = params;

    // set the Google Ad Manager parameters (if you want to use Google Ad Manager as your ad server)
    // otherwise, remove this option
    var dfpParams = {
        params : {
            iu : '/1234456/prebid_cache_video_ad_unit_test',
            output : 'vast'
        }
    };
    window.bc_plugin_pbjs.plugin_prebid_options.dfpParameters = dfpParams;
    ...
<script>

<script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js"></script>
</head>
```

### Code To Be Added In the Body After the Brightcove Player Has Been Loaded

* Register the plugin by calling `init()`
* Call `renderAd()`  to tell the plugin to render the selected ad
  * Pass in desired rendering options as listed in **[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**
  * Pass a null value or no value to the `creative` parameter. Doing so will instruct the plugin to find the prebid results that it has saved in an internal variable.

#### How To Render the Results of Plugin-Invoked Header Prebid

```html
<body>
    ...
<script>
    …
    // register Brightcove Plugin for Pre-Bidding
    BCVideo_PrebidVastPlugin.init();
    // define options for ad playback
    var options = {};

    // set timeOffset for a preroll
    options.timeOffset = 'start';

    // other publisher preferences can be passed in if needed
    options.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};

    // request the plugin to render the ad
    // note - do not pass in the creative since the plugin has stored the results of running prebid in the header
    BCVideo_PrebidVastPlugin.renderAd(options, 'bc_player');
    …
</script>
</body>
```

### Running Prebid in the Header Using a Publisher-Preferred Ad Server

Using the `adServerCallback` option described in **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**, you can instruct the plugin to pass the results of the prebidding process to your preferred ad server.  You can then pass the results from your ad server back to the plugin by calling `renderAd()` as described in the **[Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**.  The plugin will render the final results in the Brightcove Player.  In this case, you MUST pass in a value for the `creative` parameter.

## How to Run Prebid Just-in-Time After Brightcove Player Has Been Loaded

You may choose to run the prebidding process after the Brightcove Player has been loaded on your page. Using this approach, the running of prebid does not compete with the other page load events.

To do this, the publisher must add code in the body of the document where the Brightcove Player will  be located. If the  Brightcove Player is going to be located in an iframe, then the plugin code must be defined in the body of that iframe.

### Code To Be Added To The Body of the Page or iFrame

* Define the options that are being passed into the plugin in the body of the document where the Brightcove Player will be located.
  * These options can include any of the options supported in **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)** as well as the options supported in the **[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**.
  * These options can be defined either before you load the Brightcove Player or afterwards.
* After you have loaded the Brightcove Player, load the prebid plugin script.
* Register the plugin by calling `init()`.
* Call `renderAd()`  to tell the plugin to execute prebid and then render the selected ad
  * Pass in the desired prebid options and rendering options that you defined above.
  * Pass a null value or no value to the `creative` parameter.

#### How To Run Prebid and Render the Selected Ad After the Brightcove Player Has Been Loaded

```html
<body>
...
... code to load the Brightcove Player ...
// set the id of the player to 'bc_player'

<!-- load the prebid plugin script -->
<script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js"></script>

<script>
    …
    // define options for prebid
    var plugin_options = {};
    // specify prebid parameters as the value of biddersSpec
    // the set of bidders here shows how to specify the AppNexus video bidder:  appnexus
    var params = {
            code : 'my-video-tag',
            sizes : [640, 480],
            mediaType: 'video',
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: 12334567,
                        video: {
                            skippable: true,
                            playback_method: ['auto_play_sound_off']
                        }
                    }
                }
            ]
        };
    plugin_options.biddersSpec = params;

    // set the Google Ad Manager Parameters (if want to use Google Ad Manager as your ad server)
    // otherwise, remove this option
    var dfpParams = {
        params : {
            iu : '/1234456/prebid_cache_video_ad_unit_test',
            output : 'vast'
        }
    };
    plugin_options.dfpParameters = dfpParams;


    // define any renderer options
    var skippableParams = {enabled: true, videoThreshold : 16, videoOffset : 5};
    plugin_options.skippable = skippableParams;


    // register Brightcove Plugin for Pre-Bidding
    BCVideo_PrebidVastPlugin.init();
    // request the plugin to run prebid and render the ad
    // note - do not pass in the creative since the plugin has stored the results of running prebid in the header
    BCVideo_PrebidVastPlugin.renderAd(plugin_options, 'bc_player');
    …
<script>
...
</body>
```

### Running Prebid Just-in-Time Using a Publisher-Preferred Ad Server

Using the `adServerCallback` option described in **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**, you can instruct the plugin to pass in the results of the prebidding process to your preferred ad server.  You can then pass the results from your ad server back to the plugin by calling `renderAd()`.  In this case, you *do* need to specify the `creative` parameter, which contains the VAST XML needed to play the ad (either as a URL or a String containing the XML). The plugin will then render the final results in the Brightcove Player.

A sample implementation for running prebid after the Brightcove Player has been loaded and then passing the results to a third-party ad server can be found in **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

## How to Trigger the Plugin to Render the Ad After Prebid Has Been Executed Externally to the Plugin

You can choose to run your custom version of the prebid process outside of the plugin and simply use the plugin to render the results.  In order to do this, you must be able to pass in the results (as a URL to a creative or as creative XML) to the plugin.  So, you must be mindful about barriers that a cross-domain (unfriendly) iframe may pose.

### Running Prebid Externally to the Plugin

* Run your custom prebid code either in the header or the body of the page.
* Save the winning creative in a variable that can be passed to the plugin; the winning creative can be
  * creative XML
  * URL to the creative XML

### Code to Be Added to the Body of the Page or iFrame

* Load the prebid plugin script.
* Define the render options that are being passed into the plugin in the body of the document where the Brightcove Player will be located.
  * These options are described in the **[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**.
* Register the plugin by calling `init()`.
* Call `renderAd()`  to tell the plugin to render the selected ad.
  * Pass in the desired rendering options as listed in Render Options.
  * Pass in the `creative` parameter, which contains the results of the external prebid process. This can be:
    * URL to the creative XML
    * creative XML

#### How to Render the Selected Ad After Prebid Has Been Run Externally

```html
<head>
...
<script>
// running custom prebid in header
// save winning creative in a variable
var prebid_creative = getPrebidResults();
</script>
</head>


<body>
...
... code to load the Brightcove Player ...
// set the id of the player to 'bc_player'


<!-- load the prebid plugin script -->
<script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js"></script>

<script>
    …
    // define any renderer options
    var skippableParams = {enabled: true, videoThreshold : 16, videoOffset : 5};
    plugin_options.skippable = skippableParams;


    // register Brightcove Plugin for Pre-Bidding
    BCVideo_PrebidVastPlugin.init();
    // request the plugin to render the ad
    // pass in the winning creative from your custom prebid code
    BCVideo_PrebidVastPlugin.renderAd(plugin_options, 'bc_player', prebid_creative);
    …
<script>
...
</body>
```

## Links

### Plugin Integration with Brightcove Player Using Brightcove Studio

See **[Plugin Integration with Brightcove Player Using Brightcove Player Studio]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration-studio.html)**

### Plugin API

Information about the plugin API can be found at **[Prebid Plugin for Brightcove (Videojs) Player API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**

### Plugin Options

Details about the options supported by the Brightcove Prebid Plugin can be found at:   **[Prebid Plugin for Brightcove (Videojs) Player - Plugin Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html)**

### Sample Implementations

* **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**
* **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**
* **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**
* **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**
