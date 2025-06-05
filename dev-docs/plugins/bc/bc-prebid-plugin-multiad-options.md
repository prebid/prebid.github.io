---
layout: page_v2
title: Specifying Multiple Ad Breaks for a Video
description: Specifying Multiple Ad Breaks for a Video
---

<div class="bs-docs-section" markdown="1">

# Specifying Multiple Ad Breaks for a Video

## Overview

The plugin can be configured to render more than one ad break during a content video.  At this time, each ad break can contain only one ad slot.

## How to Configure an Ad Break

Each ad break needs its own set of prebid configuration options, including prebid options and rendering options.  The configuration for each ad break is represented by a JSON object, just like when you configure the plugin for a single ad.  Then, to pass the configuration for each ad break to the plugin, include each configuration object in an array of configuration options.  The array of configuration settings is what is passed to the plugin, both when configuring the plugin on page or in Brightcove Studio.

## Role of the timeOffset Option

Use the `timeOffset` rendering option to indicate when the corresponding ad break should play.  At this time, since only one ad slot is allowed per ad break, each configuration set must have a unique value for `timeOffset`.  If more than one set of configuration settings is detected for the same `timeOffset` value, the plugin will only use the first configuration and ignore the others with the same `timeOffset` value.

## Options That Apply to All Ad Breaks

While most of the configuration options apply only to the ad break for which they are specified, there a few configuration options that have global scope, meaning that ad breaks cannot have differing values for these options.

Therefore, for the following configuration options, the plugin will use the value of the first definition of the option that it finds.  If the option is also defined in a subsequent ad break configuration, the subsequent value(s) will be ignored.  The set of options having global scope include:

* `prebidPath`: url used to load `prebid.js`
* `scriptLoadTimeout`: used to specify the maximum time in milliseconds that the plugin will wait for a script file to load
* `frequencyRules`: used to express control of ad frequency in a playlist
* `adRenderer`: used to override the default behavior of selecting the plugin used to render the ad
* `loggerLevel`: used to control the amount of information that is emitted by the plugin into the browser’s console.log

## Sample Code

### Preroll and Postroll Configuration

The following is a sample JSON definition of the plugin configuration defining configuration for a preroll ad (with `timeOffset = 'start'`) and a postroll ad (with `timeOffset = 'end'`).

```javascript
[
{
    "label" : "preroll-ad",
    "prebidPath" : "//files.prebid.org/prebid-org.js",  // not for production use
    "scriptLoadTimeout": 3000,
    "biddersSpec" : {
        "code" : "my-video-tag",
        "mediaTypes": {
            "video": {
                  "context": "instream",
          "playerSize": [640,480],
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
                    "placementId": 12527596
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
        }
    },
    "prebidConfigOptions" : {
        "cache": {
            "url": "https://prebid.adnxs.com/pbc/v1/cache"
        },
        "enableSendAllBids" : true
    },
    "dfpParameters" : {
        "params" : {
            "iu" : "/19968336/encino_prebid_demo_adunit",
            "output" : "vast"
        },
        "url" : "",
        "bid" : {}
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true,
    "skippable": {
        "enabled": true,
          "videoThreshold": 15,
          "videoOffset": 5,
          "skipText": "Video can be skipped in %%TIME%% seconds",
          "skipButtonText": "SKIP"
    },
    "wrapperLimit": 5,
      "adStartTimeout" : 3000,
      "adServerTimeout" : 1000,
      "timeOffset": "start",
      "adText": "Ad"
},
{
    "label" : "postroll-ad",
    "prebidPath" : "//files.prebid.org/prebid-org.js",  // not for production use
    "biddersSpec" : {
        "code" : "my-video-tag",
        "mediaTypes": {
            "video": {
                  "context": "instream",
          "playerSize": [640,480],
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
                    "placementId": 12531984
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
        }
    },
    "prebidConfigOptions" : {
        "cache": {
            "url": "https://prebid.adnxs.com/pbc/v1/cache"
        },
        "enableSendAllBids" : true
    },
    "dfpParameters" : {
        "params" : {
            "iu" : "/19968336/encino_prebid_demo_adunit",
            "output" : "vast"
        },
        "url" : "",
        "bid" : {}
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true,
    "skippable": {
        "enabled": true,
          "videoThreshold": 15,
          "videoOffset": 5,
          "skipText": "Video can be skipped in %%TIME%% seconds",
          "skipButtonText": "SKIP ME"
    },
    "wrapperLimit": 5,
      "adStartTimeout" : 3000,
      "adServerTimeout" : 1000,
      "timeOffset": "end",
      "adText": "Advertising"
}
]
```

### Preroll and Two Midrolls Configuration

The following is a sample JSON definition of the plugin configuration defining configuration for a preroll ad (with `timeOffset = 'start'`) and two midroll ads, one with `timeOffset = '00:05:00'` and another with `timeOffset = '00:15:00'`.

```javascript
[
{
    "label" : "preroll-ad",
    "prebidPath" : "//files.prebid.org/prebid-org.js",  // not for production use
    "scriptLoadTimeout": 3000,
    "biddersSpec" : {
        "code" : "my-video-tag",
        "mediaTypes": {
            "video": {
                  "context": "instream",
          "playerSize": [640,480],
                  "mimes": ["video/mp4", "application/javascript"],
                  "protocols" : [1,2,3,4,5,6,7,8],
                  "playbackmethod" : [1, 2],
                  "api":[1,2],
          "skip": 1
            }
        },
        "bids": [
            {
                "bidder": "appnexus",
                "params": {
                    "placementId": 12527596
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
        }
    },
    "prebidConfigOptions" : {
        "cache": {
            "url": "https://prebid.adnxs.com/pbc/v1/cache"
        },
        "enableSendAllBids" : true
    },
    "dfpParameters" : {
        "params" : {
            "iu" : "/19968336/encino_prebid_demo_adunit",
            "output" : "vast"
        },
        "url" : "",
        "bid" : {}
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true,
    "skippable": {
        "enabled": true,
          "videoThreshold": 15,
          "videoOffset": 5,
          "skipText": "Video can be skipped in %%TIME%% seconds",
          "skipButtonText": "SKIP"
    },
    "wrapperLimit": 5,
      "adStartTimeout" : 3000,
      "adServerTimeout" : 1000,
      "timeOffset": "start",
      "adText": "Ad"
},
{
    "label" : "midroll-5",
    "prebidPath" : "//files.prebid.org/prebid-org.js",  // not for production use
    "biddersSpec" : {
        "code" : "my-video-tag",
        "mediaTypes": {
            "video": {
                  "context": "instream",
          "playerSize": [640,480],
                  "mimes": ["video/mp4", "application/javascript"],
                  "protocols" : [1,2,3,4,5,6,7,8],
                  "playbackmethod" : [1, 2],
                  "api":[1,2],
          "skip": 1
            }
        },
        "bids": [
            {
                "bidder": "appnexus",
                "params": {
                    "placementId": 12531984
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
        }
    },
    "prebidConfigOptions" : {
        "cache": {
            "url": "https://prebid.adnxs.com/pbc/v1/cache"
        },
        "enableSendAllBids" : true
    },
    "dfpParameters" : {
        "params" : {
            "iu" : "/19968336/encino_prebid_demo_adunit",
            "output" : "vast"
        },
        "url" : "",
        "bid" : {}
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true,
    "skippable": {
        "enabled": true,
          "videoThreshold": 15,
          "videoOffset": 5,
          "skipText": "Video can be skipped in %%TIME%% seconds",
          "skipButtonText": "SKIP ME"
    },
    "wrapperLimit": 5,
      "adStartTimeout" : 3000,
      "adServerTimeout" : 1000,
      "timeOffset": "00:05:00",
      "adText": "Advertising"
},
{
    "label" : "midroll-15",
    "prebidPath" : "//files.prebid.org/prebid-org.js",  // not for production use
    "biddersSpec" : {
        "code" : "my-video-tag",
        "mediaTypes": {
            "video": {
                  "context": "instream",
          "playerSize": [640,480],
                  "mimes": ["video/mp4", "application/javascript"],
                  "protocols" : [1,2,3,4,5,6,7,8],
                  "playbackmethod" : [1, 2],
                  "api":[1,2],
          "skip": 1
            }
        },
        "bids": [
            {
                "bidder": "appnexus",
                "params": {
                    "placementId": 12531977
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
        }
    },
    "prebidConfigOptions" : {
        "cache": {
            "url": "https://prebid.adnxs.com/pbc/v1/cache"
        },
        "enableSendAllBids" : true
    },
    "dfpParameters" : {
        "params" : {
            "iu" : "/19968336/encino_prebid_demo_adunit",
            "output" : "vast"
        },
        "url" : "",
        "bid" : {}
    },
    "prebidTimeout": 700,
    "enablePrebidCache": true,
    "skippable": {
        "enabled": true,
          "videoThreshold": 15,
          "videoOffset": 5,
          "skipText": "Video can be skipped in %%TIME%% seconds",
          "skipButtonText": "SKIP ME"
    },
    "wrapperLimit": 5,
      "adStartTimeout" : 3000,
      "adServerTimeout" : 1000,
      "timeOffset": "00:15:00",
      "adText": "Advertising"
}
]
```

## Links

### Configuration Options

Details about the options supported by the Brightcove Prebid Plugin can be found at: **[Prebid Plugin for Brightcove (Videojs) Player - Plugin Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html)**

### Prebid Options

Information about the Prebid Options supported by the plugin can be found at: **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**

### Plugin Render Options

Information about the Render Options supported by the plugin can be found at:
**[Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html)**

</div>
