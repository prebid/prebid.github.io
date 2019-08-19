---
layout: page_v2
title: Code Integration
description: Code Integration
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---

{% capture warningNote %}
This document describes a pre-release version of the Prebid Mobile API that has been deprecated. See our updated [code Integration document](/prebid-mobile/pbm-api/ios/code-integration-ios.html) for information on working with the current version of Prebid Mobile.
{% endcapture %}

{% include alerts/alert_warning.html content=warningNote %}


# Code Integration for iOS

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html).

### Use Cocoapods?

Easily include the Prebid Mobile SDK for your primary ad server in your Podfile.

```
platform :ios, '11.0'

target 'MyAmazingApp' do
    pod 'PrebidMobile'
end
```

### Build framework from source

Build Prebid Mobile from source code. After cloning the repo, from the root directory run

```
./scripts/buildPrebidMobile.sh
```

to output the PrebidMobile.framework.


## Ad Unit Setup for iOS
{:.no_toc}

Register Prebid Mobile ad units as early as possible in the application's lifecycle.  

When registering a Prebid Mobile ad unit, you must replace `@"PREBID-MOBILE-SLOT-ID"` with a unique user-defined identifier.  Prebid Mobile will use this identifier to determine the unique ad unit to which bid key-values will be associated.  This identifier must be unique across all registered Prebid Mobile ad units, and does not need to map to any ad unit ID defined in your ad server.

We recommend doing this in the `didFinishLaunchingWithOptions` method in `AppDelegate.m` using the following steps, as shown in the code sample below:

1. Create the ad units and add sizes for banner ad units.  Be sure to replace `@"PREBID-MOBILE-SLOT-ID"` with a unique user-defined identifier.

   NOTE: The [fluid ad size](https://developers.google.com/mobile-ads-sdk/docs/dfp/ios/api/reference/Constants#/c:@kGADAdSizeFluid) (used in Google Ad Manager) is not supported.

2. Add a server-side configuration for each ad unit to Prebid Server Adapter.
3. Set targeting parameters for the ad units. (Optional)
4. Set the primary adserver for the bid to either Google Ad Manager or MoPub. (Primary ad server is necessary to determine the caching mechanism.)
5. Set the Prebid Server host to AppNexus or Rubicon.
6. Register the ad units with the adapter to start the bid fetching process.

### User-Replaced Macros

In the code snippets below, any values that must be substituted by your developers are identified in capital letters.  These values are defined below:

{: .table .table-bordered .table-striped }
| Value | Description |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PREBID-SERVER-ACCOUNT-ID` | Your unique account ID with your Prebid Server vendor.  |
| `PREBID-MOBILE-SLOT-ID` | User-defined identifier that must be unique across all registered Prebid Mobile ad units.  Note: this value should not map to any ad unit ID defined in your ad server, unless that ID is unique. |
| `PREBID-SERVER-CONFIGURATION-ID` | The ID of a Prebid Server demand partner configuration.  Represents the set of demand that will be fetched for a given ad unit. |
| `AD-SERVER-AD-VIEW-INSTANCE` | The ad server ad view object instance to which bids will be attached.  Supported values are defined in a table below. |
| `AD-SERVER-AD-LOAD-METHOD` | The ad server API to load this ad type. |

### Ad Unit Registration

Embed the ad unit registration in a try-catch block to catch all the exceptions (if any) thrown by the SDK.

```
#import "PrebidMobile/PBBannerAdUnit.h"
#import "PrebidMobile/PBServerAdapter.h"
#import "PrebidMobile/PBTargetingParams.h"
#import "PrebidMobile/PrebidMobile.h"

// See http://prebid.org/prebid-mobile/logging-troubleshooting-ios.html for information on log level settings.

[PBLogManager setPBLogLevel:PBLogLevelAll];

/**
 * 1. Create the ad units and add sizes for banner ad units.
 *
 * Replace @"PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 *
 * Replace @"PREBID-SERVER-CONFIGURATION-ID" with the ID of
 * your Prebid Server demand partner configuration.
 */
PBBannerAdUnit *__nullable adUnit1 = [[PBBannerAdUnit alloc] initWithAdUnitIdentifier:@"PREBID-MOBILE-SLOT-ID" andConfigId:@"PREBID-SERVER-CONFIGURATION-ID"];
[adUnit1 addSize:CGSizeMake(300, 250)];

/**
 * 2. Set targeting parameters for the ad units (Optional).
 */
[[PBTargetingParams sharedInstance] setAge:25];
[[PBTargetingParams sharedInstance] setGender:PBTargetingParamsGenderFemale];

/**
 * 3. Register the ad units with Prebid Mobile to start bid fetching process.
 *
 * Google Ad Manager Example
 *
 * Replace @"PREBID-SERVER-ACCOUNT-ID" with your Prebid Server account ID.
 *
 * If you are using a Prebid Server host other than AppNexus, be sure
 * to replace 'PBServerHostAppNexus'.
 */
[PrebidMobile registerAdUnits:@[adUnit1, adUnit2]
          		withAccountId:@"PREBID-SERVER-ACCOUNT-ID"
               		 withHost:PBServerHostAppNexus
    	   andPrimaryAdServer:PBPrimaryAdServerDFP];
```

If you are using MoPub as your ad server, modify step 3 above to use `PBPrimaryAdServerMoPub`, as shown below:
```
/**
 * 3. Register the ad units with Prebid Mobile to start bid fetching process.
 *
 * MoPub Example
 *
 * Replace @"PREBID-SERVER-ACCOUNT-ID" with your Prebid Server account ID.
 *
 * If you are using a Prebid Server host other than AppNexus, be sure
 * to replace 'PBServerHostAppNexus'.
 */
[PrebidMobile registerAdUnits:@[adUnit1, adUnit2]
          		withAccountId:@"PREBID-SERVER-ACCOUNT-ID"
               		 withHost:PBServerHostAppNexus
    	   andPrimaryAdServer:PBPrimaryAdServerMoPub];
```
Note that host should be the prebid server host you're using.

### Set Ad Server Targeting
{:.no_toc}

Prebid Mobile continuously pre-caches creatives in the background, so that right before the ad unit makes an ad request from your network, your app can ask Prebid Mobile for a bid price and creative without waiting as shown in the code below.


```
/**
 * Set the prebid keywords on your adObject immediately.
 *
 * Replace @"PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 *
 * Replace AD-SERVER-AD-VIEW-INSTANCE with the ad view instance
 * from your ad server (defined in the table below).
 */
[PrebidMobile setBidKeywordsOnAdObject:AD-SERVER-AD-VIEW-INSTANCE withAdUnitId:@"PREBID-MOBILE-SLOT-ID"];
```

Alternatively, if you want to set the bid keywords on your adObject shortly after registering ad units, you can wait for bids with a timeout using the API method below.

```
/**
 * Set the prebid keywords on your adObject.  
 * Upon completion, call the ad server's ad load method.
 *
 * Replace @"PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 *
 * Replace AD-SERVER-AD-VIEW-INSTANCE with the ad view instance
 * from your ad server (defined in the table below).
 *
 * Replace AD-SERVER-AD-LOAD-METHOD with the ad server's method
 * to load this ad type (defined in the table below).
 */
[PrebidMobile setBidKeywordsOnAdObject:AD-SERVER-AD-VIEW-INSTANCE withAdUnitId:@"PREBID-MOBILE-SLOT-ID" withTimeout:600 completionHandler:^{
    [AD-SERVER-AD-VIEW-INSTANCE AD-SERVER-AD-LOAD-METHOD];
}];
```

Use the table below to see which ad objects are supported currently.

{: .table .table-bordered .table-striped }
| Primary Ad Server | Ad Object Type | Ad Server Ad View            | Ad Server Ad Load Method                    |
|-------------------|----------------|------------------------------|---------------------------------------------|
| Google Ad Manager               | Banner         | `DFPBannerView`              | `- (void)loadRequest:(GADRequest *)request` |
| Google Ad Manager               | Interstitial   | `DFPInterstitial`            | `- (void)loadRequest:(GADRequest *)request` |
| MoPub             | Banner         | `MPAdView`                   | `- (void)loadAd`                            |
| MoPub             | Interstitial   | `MPInterstitialAdController` |` - (void)loadAd`                            |




