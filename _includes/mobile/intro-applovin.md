## Overview

Here's how to integrate the Prebid SDK with [Applovin MAX](https://developers.applovin.com/en).

### Prerequisites

These are the required components:

- **Applovin Account** - This account allows you to manage and serve ads within your mobile app. Within this account you'll need to configure your inventory for serving ads within your app.
- **Applovin MAX SDK** - This SDK integration is necessary to communicate with the Applovin service.
- **Prebid SDK** - You will need the latest version of the Prebid Mobile SDK for either [Android](/prebid-mobile/pbm-api/android/code-integration-android.html) or [iOS](/prebid-mobile/pbm-api/ios/code-integration-ios.html).
- **Prebid Server** - You will need a cluster of servers running [Prebid Server](/prebid-server/use-cases/pbs-sdk.html). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
  - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
  - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
  - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## How it Works

Here's how the ad bidding-auction-rendering process works in this integration scenario.

![Rendering with MAX](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-max.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid Server runs an auction and returns the winning bid.

**Step 3** MAX SDK makes an ad request. MAX returns the waterfall with respective placements.

**Step 4** For each Prebid placement, the MAX SDK sequentially instantiates one of Prebid's adapter functions.

**Step 5** The adapter function verifies the targeting keywords of the winning bid and the custom properties of the given placement. If they match the adapter will render the winning bid. Otherwise, adpater will fail with "no ad" immediately and the next placement will instantiate the same adapter but for another custom properties.

## Major Integration Steps

Assuming your app is already integrated with the [Applovin MAX SDK](https://dash.applovin.com/documentation/mediation/android/getting-started/integration), the technical implementation of Prebid mobile into your app will involve these major steps:

1. [Initialize the Prebid SDK](/prebid-mobile/pbm-api/{{include.platform}}/code-integration-{{include.platform}}.html) - create a connection to your Prebid Server.
2. [Set Global Parameters](/prebid-mobile/pbm-api/{{include.platform}}/pbm-targeting-{{include.platform}}.html) - let bidders know important data about the page, privacy consent, and other settings.
3. Work with your Prebid Server team to create the adunit configIds that will be used in the app.
4. Set up Applovin custom network and placements. See [AdOps guidance](#ad-operations-guidance)
5. Link Prebid SDK AdUnit code to your app's AdUnits for the adunits that your business team wants to connect to Prebid with the configIds generated in Step 3. See the [adunit-specific instructions](#adunit-specific-instructions) below.

## Ad Operations Guidance

The Ad Operations team will need to create a [Custom Network in Applovin](/adops/mobile-rendering-max-line-item-setup.html). 

### Rendering and Tracking

This information may be useful when comparing data across various reporting systems:

{: .table .table-bordered .table-striped }
| Scenario | Tracked? |
| --- | --- |
| Fires Prebid win event | yes |
| Fires Prebid imp event | no |
| Fires OpenRTB burl | no (1) |
| Fires OpenRTB nurl | no (1) |
| Fires OpenMeasurement events | yes |

Notes:

1. OpenRTB burl and nurl will be utilized in a future release.
