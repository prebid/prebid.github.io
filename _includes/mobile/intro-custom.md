## Overview

You can use the Prebid SDK to monetize your app with a custom ad server or even without an ad server at all. 

This guide outlines how to integrate the Prebid SDK into your app if you don't fit into any of the other approaches documented on the site. Since there are
many unknown details about your specific situation, guidance will
remain general.

General components:

- **Prebid SDK** collects parameters and sends to Prebid Server.
- **Prebid server** handles the bidding and auction process.
- An ad server or mediation platform without specific Prebid Mobile integration instructions.
    - If this ad server has an SDK, great, otherwise, your app code will be responsible for crafting requests to the ad server based on response data pulled from Prebid SDK.
    - It's possible for your app code to just make the ad decision itself, utilizing no ad server at all.
- **Rendering method** - the first big decision is about how Prebid ads will be rendered:
    - Either in a webview with the Prebid Universal Creative
    - Or delegate the rendering to Prebid SDK
    - The tradeoffs are discussed below

### General Approaches

Custom integrations will need to determine whether they want to utilize Prebid SDK's full rendering capacity, or just obtain bids to do their own rendering.

#### Custom Bidding Only

![Custom Bidding Only Integration Details](/assets/images/prebid-mobile/mobile-details-custom-bidding-only.png)

1. Prebid SDK calls Prebid Server which supplies one or more bids.
1. The app inspects the targeting values.
1. Something makes an ad decision - either your ad server or your app.
1. If a 3rd party HTML creative is chosen (banner or interstitial):
    1. The HTML should be written to a webview, optionally using the Prebid Universal Creative (PUC).
    1. The PUC or your custom rendering code loads the winning creative from Prebid Cache.
    1. The PUC or your custom rendering code  writes this creative into an iframe and hits all the tracking strings: Prebid win URL, billing url (burl), and notice url (nurl).
        1. If MRAID is available, the PUC uses it to consider the view state before hitting the burl.
1. If a video VastUrl creative is chosen:
    1. The platform video player loads the VAST from Prebid Cache.
    1. It then starts playing the VAST, hitting the embedded Impression tags when appropriate.
1. Your app code will need to handle Open Measurement SDK interactions.

#### Custom Prebid Rendered

![Custom Prebid-Rendered Integration Details](/assets/images/prebid-mobile/mobile-details-custom-prebid-rendered.png)

1. Prebid SDK calls Prebid Server which supplies one or more bids.
1. The app inspects the targeting values.
1. Something makes an ad decision - either your ad server or your app.
1. If a 3rd party HTML creative is chosen (banner, native, interstitial, non-instream video):
    1. The app calls Prebid SDK rendering functions.
1. If a video VastUrl creative is chosen (rewarded video only):
    1. The app calls Prebid SDK rendering functions.

#### Tradeoffs

Here are the tradeoffs between two integration approaches:

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
- Over time, we expect the "Prebid-Rendered" approach to mature and become the obvious choice.

### Prerequisites

- **Prebid SDK** - You will need the latest version of the Prebid Mobile SDK for either [Android](/prebid-mobile/pbm-api/android/code-integration-android.html) or [iOS](/prebid-mobile/pbm-api/ios/code-integration-ios.html).
- **Prebid Universal Creative** - If you choose the "Bidding-Only" approach, the PUC needs to be hosted on a CDN.
- **Video player** - If you let Prebid SDK do the rendering, it will use the platform default: AVPlayer for iOS and ExoPlayer for Android.
- **Prebid Server** - You will need a cluster of servers running [Prebid Server](/prebid-server/use-cases/pbs-sdk.html). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
  - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
  - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
  - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## Major Integration Steps

The technical implementation of Prebid mobile into your app will involve these major steps:

1. [Initialize the Prebid SDK](/prebid-mobile/pbm-api/{{include.platform}}/code-integration-{{include.platform}}.html) - create a connection to your Prebid Server.
2. [Set Global Parameters](/prebid-mobile/pbm-api/{{include.platform}}/pbm-targeting-{{include.platform}}.html) - let bidders know important data about the page, privacy consent, and other settings.
3. Work with your Prebid Server team to create the adunit configIds that will be used in the app.
4. Set up ad server orders, line items, and creatives. See [AdOps guidance](#ad-operations-guidance)
5. Link Prebid AdUnit code to your AdUnits - for any adunits that your business team wants to connect to Prebid with the configIds generated in Step 3. See the adunit-specific instructions below.

## Ad Operations Guidance

If you're using an ad server, the Ad Operations team will need to create line items. If you're not using an ad server, the app code will need to generate an appropriate response to render the winning ad.

The creatives used depend on which media formats your adunits can utilize. The details for what creatives are needed for each ad format will depend on the type of integration:

- [AdOps Guidance for Bidding-Only](/prebid-mobile/pbm-api/{{include.platform}}/{{include.platform}}-sdk-integration-gam-original-api.html#ad-operations-guidance)
- [AdOps Guidance for Prebid-Rendered](/prebid-mobile/modules/rendering/{{include.platform}}-sdk-integration-gam.html#ad-operations-guidance)
