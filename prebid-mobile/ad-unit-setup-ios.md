---
layout: page
title: Ad Unit Setup
description: Ad Unit Setup
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
---

<div class="bs-docs-section" markdown="1">

# Ad Unit Setup for iOS
{:.no_toc}

Register Prebid Mobile ad units as early as possible in the application's lifecycle.

We recommend doing this in the `didFinishLaunchingWithOptions` method in `AppDelegate.m` using the following steps as shown in the code sample below:

	1. Create the ad units with ad unit ids and add sizes for banner ad units
	2. Add a server side configuration for each ad unit to Prebid Server Adapter
	3. Set targeting parameters for the ad units (Optional)
	4. Register the ad units with the adapter to start bid fetching process

Embed the ad unit registration in a try-catch block to catch all the exceptions (if any) thrown by the SDK.

```objc
#import "PrebidMobileForDFP/PBBannerAdUnit.h"
#import "PrebidMobileForDFP/PBServerAdapter.h"
#import "PrebidMobileForDFP/PBTargetingParams.h"
#import "PrebidMobileForDFP/PrebidMobile.h"
#import "PrebidMobileForDFP/PBLogManager.h"
 
[PBLogManager setPBLogLevel:PBLogLevelAll];
  
// 1. Create the ad units with ad unit ids and add sizes for banner ad units
PBBannerAdUnit *__nullable adUnit1 = [[PBBannerAdUnit alloc] initWithAdUnitIdentifier:@"HomeScreen" andConfigId:@"YOUR-CONFIG-ID-HERE"];
[adUnit1 addSize:CGSizeMake(300, 250)];
  
// 2. Set targeting parameters for the ad units (Optional)
[[PBTargetingParams sharedInstance] setAge:25];
[[PBTargetingParams sharedInstance] setGender:PBTargetingParamsGenderFemale];
  
// 3. Register the ad units with Prebid Mobile to start bid fetching process
[PrebidMobile registerAdUnits:@[adUnit1] withAccountId:@"YOUR-ACCOUNT-ID-HERE"];
```


</div>
