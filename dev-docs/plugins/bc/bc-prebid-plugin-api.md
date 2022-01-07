---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---


# Prebid Plugin for Brightcove (Videojs) Player API

## Overview

The Brightcove Prebid Plugin supports an API that publishers can use to interact with the plugin. Publishers who choose to use the dynamic, on-page integration method will need to use the API.  Publishers who choose to integrate the plugin via Brightcove Studio may or may not need to use the API depending on how they choose to set up the plugin in the Studio.

## API

The Brightcove Prebid Plugin supports the following methods:

- `init ()`
- `renderAd (options, id, creative)`
- `stop ()`

### init()

The `init()` method registers the Brightcove Prebid Plugin within Brightcove Player (Videojs) as `BCVideo_PrebidVastPlugin`. This method must be called first before any other plugin API methods.

- Internal name = `bcPrebidVastPlugin`  - This name is used only when you are specifying the plugin in Brightcove Studio.

**NOTE:**   This initial registration must be done after the Brightcove Player is loaded.  If the plugin is performing the pre-bidding in the header, then the call to `init()` must wait until the Brightcove Player has been loaded.

#### Arguments:

None

#### Return Value:

None

#### Sample Code:

```
<script>
    …
    // register Brightcove Plugin for Pre-Bidding
    BCVideo_PrebidVastPlugin.init();
    …
</script>
```

### renderAd (options, id, creative)

This method is used to invoke the prebid process and/or the rendering of the selected ad, depending on the arguments that are being passed to it.  

If the creative argument is not present, then the plugin will invoke the prebid process using the options that are passed in. The plugin will then render the ad that was selected by the prebid process in the Brightcove player.

If the results of the prebid process is being determined outside of the plugin, either via a third party ad server other than Google Ad Manager or when the entire prebid process is being run in custom publisher code, then the publisher needs to pass in the creative argument when calling renderAd(). In this case, the plugin will simply render the selected ad in the Brightcove Player.


- Starts ad playback for the creative provided
- This method should be called under any of the following conditions:
    - Pre-bidding is preformed by the plugin in the header of the document
    - Pre-bidding is performed by the plugin just-in-time after the Brightcove Player has been loaded
    - A publisher-preferred ad server is being used to determine whether to select the results of prebid or the ad provided by their ad server
        - If prebid is being run in the header, then the code to manage the third-party ad server should call `renderAd()` with the selected ad to play
        - If prebid is being run after the Brightcove Player has been loaded, then `renderAd()` should be called after the player has been loaded and the ad server code should use a callback to pass the selected ad back to the plugin to render.
        - See **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**
    - The entire bidding process has been executed outside of the plugin
- The publisher can specify all prebid options needed to run the prebidding process
- The publisher can specify preferences about how and when to render the ad
- Ad playback will support preroll, midroll and postroll ads as specified by the `timeOffset` option

#### Arguments:

{: .table .table-bordered .table-striped }
| Field | Description | Acceptable Values | Required | Default | Example |
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| `options` | Publisher configuration settings needed to do prebid and /or execute the ad playback | JSON objects containing any of the supported options as defined in  **[Plugin Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html)**  | Yes | null | See sample code below |
| `id` | Identifies the Brightcove video tag element | String that represents the id of the Brightcove video tag as it appears on the page | Yes | null | 'bc_player' |
| `creative` | The VAST XML that defined the video creative to be played |Either a String containing the URL pointing to the creative VAST XML or a String containing the creative VAST XML. If no value is specified, then this signals the plugin to run prebid | This value is not required if the plugin is invoking the prebid process.  The value is required if the prebid process is being run outside of the plugin. | null | 'https://path-to-creative/creative.xml' |

#### Sample Code

##### Calling renderAd() when prebid is running in the header

```
<script>
    …
    // define options for ad playback
    var options = {};

    // set timeOffset for a midroll at 5 minutes
    options.timeOffset = '00:05:00';

    // other publisher preferences can be passed in if needed
    options.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};

    // request the plugin to render the ad
    // note you do not need to pass in the creative since the plugin has stored the results of running prebid in the header
    BCVideo_PrebidVastPlugin.renderAd(options, 'bc_player');
    …
</script>
```

##### Executing prebid and ad rendering after the player as loaded

```
<script>
    …
    // define prebid options
    var options =
    {"prebidPath": "//files.prebid.org/prebid-org.js",
    "biddersSpec": {
        ”code": "my-video-tag",
        "mediaTypes": {
            "video": {
                "context": "instream",
		"playerSize": [640, 480],
                "mimes": ["video/mp4","application/javascript"],
                "protocols": [1,2,3,4,5,6,7,8],
                "playbackmethod": [1,2],
                "api": [1,2 ]
            }
        },
        "bids": [{
            "bidder": "appnexus",
            "params": {
                "placementId": 8845778
            }
        }]
    },
    "prebidConfigOptions": {
        "cache": {"url": "https://prebid.adnxs.com/pbc/v1/cache"},
    "   enableSendAllBids": true
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true
    };

    // add in the render options
    // set timeOffset for a midroll at 5 minutes
    options.timeOffset = '00:05:00';

    // other publisher preferences can be passed in if needed
    options.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};

    // request the plugin to render the ad
    // note you do not need to pass in the creative since the plugin has stored the results of running prebid in the header
    BCVideo_PrebidVastPlugin.renderAd(options, 'bc_player');
    …
</script>
```

##### Initiating ad playback when the prebid final decision is made outside the plugin

This can occur when the publisher is using a third-party ad server or if all the prebid is being executed outside of the plugin.

```
<script>
    …
    // retrieve the VAST xml for the winning creative
    // this can be a url to the VAST or the VAST xml itself
    var creative = getWinningAdCreative();
    // define options for ad playback
    var options = {};

    // set timeOffset for a midroll at 5 minutes
    options.timeOffset = '00:05:00';

    // other publisher preferences can be passed in if needed
    options.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};
    options.playbackMethod = 3;

    // request the plugin to render the ad where the winning creative has been selected by some external code
    BCVideo_PrebidVastPlugin.renderAd(options, 'bc_player', creative);
    …
</script>
```

### stop ()

#### Purpose:

This method interrupts and terminates the ad playback being managed by the plugin.

- If stopped:
  - Whatever ad is playing will be interrupted.
  - All remaining pending ads will be ignored.
  - Plugin-management of ad playback will be terminated

#### Arguments:

None

#### Return Value:

None

#### Sample Code:

```
<script>
    …
    // terminate Brightcove Plugin for Pre-Bidding
    BCVideo_PrebidVastPlugin.stop();
    …
</script>
```

## Plugin Options

Details about the options supported by the Brightcove Prebid Plugin can be found at:
**[Prebid Plugin for Brightcove (Videojs) Player - Plugin Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html)**

## Sample Implementations

Sample implementations are provided at:

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**


