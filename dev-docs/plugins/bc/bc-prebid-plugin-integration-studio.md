---
layout: page_v2
title: Plugin Integration with Brightcove Player Using Brightcove Player Studio
description: Ad Unit Reference
---



# Plugin Integration with Brightcove Player Using Brightcove Player Studio

## Overview

The Prebid Plugin for the Brightcove Player can be registered either directly on the publisher page or it can be registered in Brightcove Player Studio. This page describes how to register this plugin in Brightcove Studio.

## Advantages

* Requires less code on the publisher page.
* Updates can be done in Brightcove Studio without touching the publisher page.
* All CSS and JS files are embedded in the Brightcove Player automatically.
* Can avoid cross-domain iFrame issues.

## What You Need To Know

### Plugin Name

`bcPrebidVastPlugin`

#### Plugin Component Name

`BCVideo_PrebidVastPlugin`

#### Available Options and Targeting Parameters

You can specify all options needed by the plugin in the Studio:

* **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**
* **[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)** (used to customize the playback of the ad)

#### Getting to Brightcove Studio

[studio.brightcove.com](https://studio.brightcove.com/)

#### Integration in Brightcove Studio

There are two ways to register the Brightcove Prebid Plugin in Brightcove Studio:

* **General Integration**
  * Adds the plugin to the Brightcove Player when the player is embedded on the page, without calling prebid
  * Publisher needs to add the prebid options and render options on the page and pass them into `renderAd()` as described in the **[Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**.
  * Publisher may use this method when they want to use a third-party ad server other than Google Ad Manager as their primary ad server

* **Configured Integration**
  * In addition to adding the plugin to the Brightcove Player when the player is embedded on the page, it also invokes the plugin to execute prebid and render the ad based on the prebid options and render options defined in the Studio.
  * Publisher may use this method when using a third-party ad server other than Google Ad Manager as their primary ad server by specifying the `adServerCallback` function by name.

Details for each option are provided below.

## General Integration Option

### What Happens

* The plugin is automatically added to and registered in a Brightcove Player when it is embedded on the page.
* Publisher will still need to invoke `renderAd()` on the Plugin Component Name `BCVideo_PrebidVastPlugin` after the player has been embedded.

### When to Use This Option

You should use this integration option when you use the same player instance on a number of publisher pages but different targeting parameters on some of those pages.

### Values to Provide in Brightcove Studio

#### JavaScript Link

Link to the plugin:

* Default: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js`
* Alternately, the URL to your own custom build of the plugin

#### CSS Links

* Default link to MailOnline CSS file: `http://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css`
* Default link to the plugin CSS file: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css`
* Alternately, the URL to your own custom CSS files

#### Plugin Name

`bcPrebidVastPlugin`

#### Integration Steps

To use the General Integration method in Brightcove Studio, use the following steps:

In Brightcove Studio:

1. Navigate to `https://studio.brightcove.com/` and login using your credentials.
2. Navigate to the `Players` page by selecting the `Players` option from the `Home` menu.
3. You can either create a new player instance and select it, or you can select an existing player instance to modify that instance.
4. Click the `EDIT` button for the `PLUGINS` section and enter the following values specified in the fields provided:
    * `Javascript URL` - enter the path to your prebid plugin build
    * Under `CSS`, enter the following two paths to CSS files
        * MailOnline CSS file
        * Prebid plugin CSS file
    * Under `Name, Options` section
        * enter the plugin name  `bcPrebidVastPlugin`
        * do **not** enter any other options
5. Click the `SAVE` button.
6. Click the `PUBLISH` button. You should then see the Preview Player for your updated instance. **NOTE:** You will not see an ad play since this method requires that you add code on your page to call play on the plugin. However, you should see your content video playing.
7. To retrieve the player embed code to put on your publisher page, click the `EMBED CODE & URL` button at the top of the page. Select `PUBLISHED PLAYER` from the options provided.
8. Use the code provided in the `ADVANCED CODE` field

#### Code to Add to Your Publisher Page

<a name="renderad-step1"></a>

* Step 1: After adding the Brightcove Player embed code to your publisher page, add the `id` attribute to the `<video>` tag present in the embed code to specify the id for the Brightcove Player video element.

Example:

```html
<video id='bcplayer' ...
```

* Step 2: After you embed the Brightcove Player on the page, you must call the `renderAd()` method on `BCVideo_PrebidVastPlugin`.
Pass in the required arguments:
  * `options` - the JSON object containing the prebid options and other desired options as described in **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)** and **[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**. Examples are also provided below.
  * `id` - id of the Brightcove Player video tag - this is value you specified in the preceding step.

Example:

```javascript
// create the options object
var adOptions =
{"prebidPath": "//files.prebid.org/prebid-org.js",  // not for production use
    "biddersSpec": {
        ”code": "my-video-tag",
        "mediaTypes": {
            "video": {
                "context": "instream",
                "playerSize": [640,480],
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
        "enableSendAllBids": true
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true
    };

    // add in the render options
    // other publisher preferences can be passed in if needed
    adOptions.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};


// call renderAd on the plugin
BCVideo_PrebidVastPlugin.renderAd(adOptions, 'bcplayer');    
```

##### What Your Page Would Look Like

Visit **[sample publisher page using the General Integration Method]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-studio-integration-general-method.html)** for details.

## Configured Integration Option

### What Happens

* The plugin is automatically added to and registered in a Brightcove Player when it is embedded on the page
* Prebid process is automatically invoked when the player is embedded on the page
* The plugin will also automatically render the selected ad once the prebid process has completed

### When to Use This Option

Use this integration option when:

* you use the same player instance AND the same targeting parameters on one or more pages.
* you want to avoid making targeting changes directly on a publisher page.
* you are using a third-party ad server as the primary ad server; simply specify the name of the `adServerCallback` as part of the configuration options defined in the Studio.

You can create different player instances, each with their own targeting parameters, if you have different targeting requirements on pages.

### Values You Provide in Brightcove Studio

#### JavaScript Link

Link to the plugin:  

* Default: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js`
* Alternately, use the link to your custom build of the plugin

#### CSS Links

* Default MailOnline CSS file: `http://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css`
* Default plugin CSS file: `http://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css`
* Alternately, use the path to your custom CSS files

#### Plugin Name

`bcPrebidVastPlugin`

#### Prebid and Render Options

Complete set of prebid options and other parameters that should be passed to the plugin to retrieve and render the ad. Options and targeting parameters are specified in a JSON object as described on these pages:

* **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**
* **[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**

Examples are provided below.

#### Integration Steps

To use the Configured Integration method in Brightcove Studio, use the following steps

In Brightcove Studio:

1. Navigate to `https://studio.brightcove.com/` and login using your credentials
2. Navigate to the `Players` page by selecting the `Players` option from the `Home` menu
3. You can either create a new player instance and select it, or you can select an existing player instance to modify that instance.
4. Click the `EDIT` button for the `PLUGINS` section and enter the following values specified in the fields provided:
    * `Javascript URL` - enter the path to your prebid plugin build
    * Under `CSS`, enter the following two paths to CSS files
        * MailOnline CSS file
        * Prebid plugin CSS file
    * Under `Name, Options` section
        * enter the following plugin name:  `bcPrebidVastPlugin`
        * enter a JSON object containing all the prebid and render options you want to use. (A sample set of configuration options are provided [below](#sample-config).)
5. Click the `SAVE` button.
6. Click the `PUBLISH` button. You should then see the Preview Player for your updated instance. NOTE: You should see your ad playing in the preview.
7. To retrieve the player embed code to put on your publisher page, click the `EMBED CODE & URL` button at the top of the page. Select `PUBLISHED PLAYER` from the options provided.
8. Use the code provided in the `ADVANCED CODE` field

#### Code To Add to Your Publisher Page

None

<a name="sample-config"></a>

#### Sample Plugin Configuration in Brightcove Studio

```json
{
    "prebidPath": "//files.prebid.org/prebid-org.js",   // not for production use
    "bidderAliases": [
        {
            "name": "alias1",
            "bidderName": "appnexus"
        }
    ],
    "biddersSpec": {
        "code": "my-video-tag",
        "mediaTypes": {
            "video": {
                "context": "instream",
                "playerSize": [640,480],
                "mimes": ["video/mp4","application/javascript"],
                "protocols": [1,2,3,4,5,6,7,8],
                "playbackmethod": [1,2],
                "api": [1,2 ]
            }
        },
        "bids": [{
            "bidder": "appnexus",
            "params": {
                "placementId": 8845778,
                "video": {"skippable": true,
                "playback_method":
                    ["auto_play_sound_off"]
                }
            }
        },
        {
            "bidder": "alias1",
            "params": {
                "placementId": 12531984,
                "video": {"skippable": true,
                "playback_method":
                    ["auto_play_sound_off"]
                }
            }
        }]
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
                        "  return bidResponse.pbMg;",
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
                    "key": "hb_size",
                    "val": "640x480"
                }
            ]
        },
        "alias1": {
            "adserverTargeting": [
                {
                    "key": "hb_pb",
                    "val": [
                        "valueIsFunction",
                        "function (bidResponse) {",
                        "  return bidResponse.pbHg;",
                        "}"
                    ]
                }
            ]
        }
    },
    "prebidConfigOptions": {
        "cache": {
            "url": "https://prebid.adnxs.com/pbc/v1/cache"
        },
        "enableSendAllBids": true
    },
    "skippable": {
        "enabled": true,
        "videoThreshold": 16,
        "videoOffset": 5
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true
}
```

#### What Your Page Would Look Like

Visit **[sample publisher page after using the Configured Integration Method]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-studio-integration-configured-method.html)** for details.

## How To Use Other Plugin API Methods When Registering Plugin in Brightcove Studio

The plugin API supports a few other methods, which can be used even if you have registered the plugin in Brightcove Studio. See [Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html) for complete details about the API for this plugin.

To use any of the additional API methods for the plugin, you must first call the `init()` method on the Plugin Component name `BCVideo_PrebidVastPlugin`. You only need to call the `init()` method once even if you call the other API methods multiple times. Any use of these additional API methods should be used after the Brightcove Player has been embedded on the page.

### stop()

This method is used to stop the plugin from managing ad playback.

The following sample shows you how to stop the plugin after you have embedded the Brightcove Player with the plugin already added and running.

```javascript
// init the plugin
BCVideo_PrebidVastPlugin.init();

// terminate the rendering process of the Brightcove Plugin for Prebid
BCVideo_PrebidVastPlugin.stop();
```

## Links

### Dynamic Integration with Brightcove Player - On the Page

See **[Dynamic Plugin Integration With Brightcove Player - On the Page]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration-dynamic.html)**

### Plugin API

Information about the plugin API can be found at **[Prebid Plugin for Brightcove (Videojs) Player API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**

### Plugin Options

Details about the options supported by the Brightcove Prebid Plugin can be found at:   **[Prebid Plugin for Brightcove (Videojs) Player - Plugin Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html)**
