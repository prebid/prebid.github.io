---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Impression Tracking

## Responsibilities

The impression tracking depends on a certain integration approach. 

In case of GAM integration when the Ad Server ad wins - the impression will be tracked according to the policy of the certain Primary Ad Server SDK that will handle the rendering.

If Prebid ad wins on the Primary Ad Server Auction, the impression tracking will depend on particular integration kind:

* **GAM** impression will be tracked only for banner ads since it allows [manual impression counting](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner#manual_impression_counting). Rendering Module is not able to track impressions for GAM Interstitial or Rewarded ads.
* **Pure In-App Bidding** impression pixels for Open Measurement and VAST will be tracked according to the [In-App Bidding Impression](#in-app-bidding-impression) policies of the SDK.


## In-App Bidding Impression

Prebid Rendering Module tracks the impression pixel as stated in a definition of **render impression** from [Mobile Application Advertising Measurement Guidelines](http://mediaratingcouncil.org/Mobile%20In-App%20Measurement%20Guidelines%20(MMTF%20Final%20v1.1).pdf):


> **Ad Impression**: A measurement of responses from an ad delivery system to an ad request from the user's device, which is filtered for invalid traffic and is recorded at a point as late as possible in the process of delivery of the creative material to the user's device. The ad must be loaded and at minimum begin to render in order to count it as a valid ad impression. Measurement of begin to render should include logical components necessary to display the ad, but does not necessarily include logical elements that are not essential (such as other tracking elements).
>
> In the context of the guidance above, “loaded” means the logical creative file has been transmitted and received at the client-side (user device) and “render” refers to the process of painting the creative file or adding it to any portion of the Document Object Model.

The impression pixel is triggered when at least 1 pixel of the creative appears on the screen.
This rule is applied to all tracking pixels display, video, Open Measurement.

## MRAID

### MRAID 2.0 Creative

SDK broadcasts the `mraid.viewableChange()` event when the ad becomes rendered. It means that for proper impression tracking with MRAID the creative's code for tracking impression must depend on `mraid.isViewable()`. For example:


``` javascript
if ( mraid.viewableChangeEventWasDetected() )
   if( mraid.isViewable() == true)
         fireMyImpressionTrackers();
   else if ( mraid.isViewable() == false)
         doNothing();
```

Otherwise the impression tracking would be inconsistent with Prebid Rendering SDK approach.

### MRAID 3.0 Creative

For the ads that support the MRAID 3, the impression tracking code should be rather dependent on `exposureChange()` function. Since it provides much more information about the viewability of an Ad Container, the impression tracking could be much more accurate and correspond to the MRC and IAB guidelines.

However, the IAB strongly recommends not to use the MRAID facilities to track impressions. The best practice is to use the **Open Measurement** framework which is supported by SDK as well.