## Overview

This how-to guide covers the original approach for integrating the Prebid SDK into your app with the GMA SDK. It utilizes:

- **Prebid SDK** and **Prebid server** to handle the bidding and auction process.
- **GAM** and the **Google Moble Ads (GMA) SDK** manage the ad inventory and select the winning ad to display.
- **Prebid Universal Creative** renders display ads.
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
- **Prebid Universal Creative** - This needs to be hosted on a CDN and loaded from the creative in GAM as detailed in the [AdOps GAM creative reference](/adops/gam-creative-banner-sbs.html#prebid-universal-creative).
- **Prebid Server** - You will need a cluster of servers running [Prebid Server](/prebid-server/use-cases/pbs-sdk.html). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
  - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
  - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
  - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## How it Works

Here's how the ad bidding-auction-rendering process works in this integration scenario.

![GAM Bidding Only Integration Details](/assets/images/prebid-mobile/mobile-details-gam-bidding-only.png)

1. Prebid SDK calls Prebid Server which supplies one or more bids
1. PBSDK adds targeting 'key value pairs' to GMA SDK
1. GMA SDK calls GAM
1. If a 3rd party HTML creative is chosen (banner or interstitial)
    1. GMA SDK writes the HTML to a webview, loading the Prebid Universal Creative (PUC)
    1. The PUC calls Prebid Cache to load the winning creative
    1. The PUC writes this creative into an iframe and hits all the tracking strings: Prebid win URL, billing url (burl), and notice url (nurl)
        1. If MRAID is available, it will consider the view state before hitting the burl
1. If a video VastUrl creative is chosen
    1. The GMA SDK uses the platform video player which loads the VAST from Prebid Cache
    1. It then starts playing the VAST, hitting the embedded Impression tags when appropriate
1. If an In-App Native format is chosen
    1. GMA SDK delegates the rendering of native to the App and PBSDK when a special signal is specified
    1. The app code gets the native assets from PBSDK. The app is coded to render the ad.
        1. PBSDK fires the eventtrackers when appropriate
        1. PBS win event is fired
1. GMA SDK handles Open Measurement SDK interactions.

## Major Integration Steps

Assuming your app is already built with GMA AdUnits, the technical implementation of Prebid mobile into your app will involve these major steps:

1. [Initialize the Prebid SDK](/prebid-mobile/pbm-api/ios/code-integration-ios.html) - create a connection to your Prebid Server.
2. [Set Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html) - let bidders know important data about the page, privacy consent, and other settings.
3. Work with your Prebid Server team to create the adunit configIds that will be used in the app.
4. Set up GAM orders, line items, and creatives. See [AdOps guidance](#ad-operations-guidance)
5. Link Prebid AdUnit code to your GMA AdUnits - for any adunits that your business team wants to connect to Prebid with the configIds generated in Step 3. See the [adunit-specific instructions](#adunit-specific-instructions) below.

## Ad Operations Guidance

The Ad Operations team will need to create line items in GAM. The creatives used depend on which media formats your adunits can utilize.

{: .table .table-bordered .table-striped }
| Format | Line Item Targeting | Creative Type | Prebid Cache? | Ad Ops Details |
| --- | --- | --- | --- | --- |
| HTML banner, interstitial banner | hb_pb<br/>hb_format=banner | 3rd party HTML that loads the [PUC](/overview/prebid-universal-creative.html) | yes | [link](/adops/gam-creative-banner-sbs.html) |
| Video (instream, non-instream, interstitial) | hb_pb<br/>hb_format=video<br/>inventoryType in (instream, mobile app) | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp.html) |
| Rewarded Video | hb_pb<br/>hb_format=video<br/>inventoryType in (instream, mobile app)<br/>rewarded adunits | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp.html) |
| In-app native | hb_pb<br/>hb_format=native | GAM native | no | [link](adops/gam-native.html#create-a-new-native-creative) |
| In-Webview native | hb_pb<br/>hb_format=native | 3rd party HTML that loads the native-trk script. | yes | [link](/adops/gam-native.html) |

Notes:

- You may need up to 4 sets of line items to support Prebid Mobile depending on adunit types. If you also run Prebid.js or AMP, please see [line item considerations](/adops/line-item-creation.html) for more information.
- Use the Prebid Cache column to communicate with the Prebid Server team. They can set up the "top-level stored request" for your account to cache or not cache requests as needed.

### Rendering and Tracking

This information may be useful when comparing data across various reporting systems:

{: .table .table-bordered .table-striped }
| Scenario | Creative: PUC | Creative: VastUrl | Creative: GAM Native |
| --- | --- | --- | --- |
| Rendering Method | PUC in iframe | GMA SDK player | App code with data from PBSDK |
| Fires Prebid win event | always | never | always |
| Fires Prebid imp event | never | VAST impression tag | never |
| Fires OpenRTB burl | when in view | n/a | never (1) |
| Fires OpenRTB nurl | always |  n/a | always |
| Fires OpenMeasurement events | GMA SDK |  n/a | PB SDK |

Notes:

1. OpenRTB burl and nurl will be utilized in a future release.
