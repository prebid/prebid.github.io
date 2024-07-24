## Overview

This how-to guide covers the 'Prebid-Rendered' approach for integrating the Prebid SDK into your app with the GMA SDK. It utilizes:

- **Prebid SDK** and **Prebid server** to handle the bidding and auction process.
- **GAM** and the **Google Moble Ads (GMA) SDK** manage the ad inventory and select the winning ad to display.
- **Prebid SDK** renders display ads.
- **GMA SDK** renders video ad content.

If you do not have GMA SDK in the app yet, refer to the [Google Integration Documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/{{include.platform}}/quick-start).

### Alternative Approaches

Another way to integrate GAM into your app is with the [GAM Bidding-Only integration](/prebid-mobile/pbm-api/{{include.platform}}/{{include.platform}}-sdk-integration-gam-original-api.html).

Tradeoffs between these integration approaches:

{: .table .table-bordered .table-striped }
| Aspect | Bidding-Only Integration | Prebid-Rendered Integration |
| --- |:---:|:---:|
| Direct access to bids | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> | |
| Support for MRAID 3.0 | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| Support for SKAdnetwork | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| Loads data from Prebid Cache | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> | |
| Supports instream video | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> | |
| Triggers billing and Notice URLs | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> | |
| Supports Third Party Rendering libraries | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |

**Notes:**

- On one hand, using Prebid Cache reduces the amount of data that must be sent to the mobile device -- the body of the creative does not need to be transmitted for bids. On the other hand, though, when a bid wins in the ad server, the body of the creative must be retrieved from the cache.
- It is possible to mix-and-match implementations within an app. e.g. you could implement instream video with the Bidding-Only approach and other adunits with Prebid-Rendered.

### Prerequisites

The GAM Prebid-Rendered Integration method assumes that you have the following components:

- **Google Ad Manager Account** - A GAM account allows you to manage and serve ads within your mobile app. Within this account you'll need to configure your inventory and create orders for serving ads within your app. This involves defining ad units (spaces within your app where ads will be displayed) and setting up orders and line items to deliver ads to those units. See [Prebid's AdOps Guide](/adops/before-you-start.html) for more information.
- **Google Mobile Ads (GMA) SDK** - This refers to the software development kit provided by Google. You need to ensure that you have the latest version of the SDK supported by Prebid SDK. This SDK integration is necessary to communicate with the ad server and display ads in your app.
- **Prebid SDK** - You will need the latest version of the Prebid Mobile SDK for either [Android](/prebid-mobile/pbm-api/android/code-integration-android.html) or [iOS](/prebid-mobile/pbm-api/ios/code-integration-ios.html).
- **Prebid Server** - You will need a cluster of servers running [Prebid Server](/prebid-server/use-cases/pbs-sdk.html). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
  - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
  - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
  - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## How it Works

Here's how the ad bidding-auction-rendering process works in this integration scenario.

![GAM Prebid-Rendered Integration Details](/assets/images/prebid-mobile/mobile-details-gam-prebid-rendered.png)

1. Prebid SDK calls Prebid Server which supplies one or more bids
1. PBSDK adds targeting 'key value pairs' to GMA SDK
1. GMA SDK calls GAM
1. If a 3rd party HTML creative is chosen (banner, native, interstitial, non-instream video)
    1. GMA SDK writes HTML to a webview, loading google_mobile_app_ads.js
    1. This script triggers a "PrebidAppEvent"
    1. Which in turn triggers PBSDK to handle the rendering of the creative:
        1. Fire the Prebid Server win event
        1. If a 3rd party rendering SDK is in use, call it for rendering
        1. Otherwise, write the creative into an iframe and:
            1. Inject mraid.js into the webview and listen for events from MRAID: change size, etc.
            1. Send data to the creative (e.g. viewable) which may trigger impression tracking within the creative
            1. It does not currently hit the billing or notive urls (burl or nurl)
1. If a video VastUrl creative is chosen (rewarded video only)
    1. The GMA SDK uses the platform video player which loads the special VAST file from the Prebid CDN.
    1. Prebid SDK watches VAST events for "<AdTitle>PrebidAppEvent</AdTitle>". When it sees this, it takes over the rendering:
        1. PBSDK fires the PBS win event
        1. If the response indicates a 3rd party rendering SDK, PBSDK will call it
        1. Otherwise:
            1. PDBSK renders with the platform-standard VAST player
            1. It uses the VAST from the bid response, not from Prebid Cache
            1. The player fires any <Impression> tags in the VAST
            1. PBSDK handles MRAID events
            1. The app is called to handle the reward
1. If an In-App Native format is chosen:
    1. GMA SDK delegates the rendering of native to the App and PBSDK when a special signal is specified
    1. The app code gets the native assets from PBSDK. The app is coded to render the ad.
        1. PBSDK fires the eventtrackers when appropriate
        1. PBS win event is fired
1. Open Measurement events are handled directly by the Prebid SDK
    1. If a 3rd party rendering SDK is used to render, then it will handle Open Measurement.

## Major Integration Steps

Assuming your app is already built with GMA AdUnits, the technical implementation of Prebid mobile into your app will involve these major steps:

1. [Initialize the Prebid SDK](/prebid-mobile/pbm-api/{{include.platform}}/code-integration-{{include.platform}}.html) - create a connection to your Prebid Server.
2. [Set Global Parameters](/prebid-mobile/pbm-api/{{include.platform}}/pbm-targeting-{{include.platform}}.html) - let bidders know important data about the page, privacy consent, and other settings.
3. Work with your Prebid Server team to create the adunit 'configIds' that will be used in the app.
4. Set up GAM orders, line items, and creatives. See [AdOps guidance](#ad-operations-guidance)
5. Link Prebid AdUnit code to your GMA AdUnits - for any adunits that your business team wants to connect to Prebid with the configIds generated in Step 3. See the [adunit-specific instructions](#adunit-specific-instructions) below.

## Ad Operations Guidance

The AdOps team will need to create line items in GAM. The creatives used depend on which media formats your adunits can utilize:

{: .table .table-bordered .table-striped }
| Format | Line Item Targeting | Creative Type | Prebid Cache? | Ad Ops Details |
| --- | --- | --- | --- | --- |
| HTML banner, interstitial banner or video, non-instream video | hb_pb<br/>hb_format=banner | 3rd party HTML that loads google_mobile_app_ads.js | no | [link](/adops/mobile-rendering-gam-line-item-setup.html#third-party-html) |
| Instream Video | hb_pb<br/>hb_format=video<br/>inventoryType in (instream, mobile app) | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp.html) |
| Rewarded Video | hb_pb<br/>hb_format=video<br/>inventoryType in (instream, mobile app)<br/>rewarded adunits | VastUrl pointing to prebid-mobile-rewarded-vast.xml | no | [link](/adops/mobile-rendering-gam-line-item-setup.html#rewarded-video) |
| In-app native | hb_pb<br/>hb_format=native | GAM native | no | [link](adops/gam-native.html#create-a-new-native-creative) |

Notes:

- Instream video requires the [Bidding-Only](/prebid-mobile/pbm-api/{{include.platform}}/{{include.platform}}-sdk-integration-gam-original-api.html) application coding integration approach. However, the line item setup is the same.
- You may need up to 4 sets of line items to support Prebid Mobile depending on adunit types. If you also run Prebid.js or AMP, please see [line item considerations](/adops/line-item-creation.html) for more information.
- Prebid Cache column to communicate with the Prebid Server team. They can set up the "top-level stored request" for your account to cache or not cache requests as needed.

### Rendering and Tracking

This information may be useful when comparing data across various reporting systems:

{: .table .table-bordered .table-striped }
| Scenario | Creative: 3pHTML | Creative: VastUrl | Creative: GAM Native |
| --- | --- | --- | --- |
| Rendering Method | js in iframe fires an event | GMA SDK player | App code with data from PBSDK |
| Fires Prebid win event | always | never | always |
| Fires Prebid imp event | never | VAST impression tag | never |
| Fires OpenRTB burl | never | n/a | never |
| Fires OpenRTB nurl | never |  n/a | never |
| Fires OpenMeasurement events | PBSDK |  n/a | PBSDK |

Notes:

- OpenRTB burl and nurl will be utilized in a future release.
