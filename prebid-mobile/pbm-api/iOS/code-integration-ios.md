---
layout: page_v2
title: Code Integration - iOS
description: Code Integration - iOS
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---




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

### Integrate Ad Servers With Your App

Integrating **MoPub** with your application
1.  Go to [MoPub.com](https://app.mopub.com/account/register/) and  register for a MoPub account . If you already have an account with them, you can [log in](https://app.mopub.com/account/login/) . 
2.  After the registration you will be automatically prompted to set up a new MoPub application required for integrating mobile ads to your application.

Integrating **Google** with your application   

Go to Google's developer site and follow the instructions for integrating their [Mobile Ads SDK](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/quick-start) into your app.

### Set Targeting Parameters (Optional)

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)

### Create Ad Units
Banner and interstitial ad units can be created: 

```
let bannerUnit = BannerAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", size: CGSize(width: 300, height: 250))
```
For details on creating the specific ad units and additional parameters and methods associated with each view the documentation pertaining to them: 

[Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)  
[Interstitial Ad Unit](/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html)

### Add Custom Keywords

Once an ad unit has been instantiated, custom keywords can be added to it to improve its targeting.  

```
bannerUnit.addKeyword(key:"Sample", value:"Value to add")
```
For more details on custom keywords, review the [adUnit class documention](/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)

## Further Reading

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)