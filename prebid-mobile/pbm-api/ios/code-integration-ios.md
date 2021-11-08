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
{: .notoc}

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html). Once your account is set up include the Prebid Mobile SDK in your app by either using Cocoapods or by [cloning the repo](https://github.com/prebid/prebid-mobile-ios) and using our included script to build the SDK.

- TOC
 {:toc}

### Include with Cocoapods

If you are not familar with using Cocoapods for dependency management visit their [getting started page](https://guides.cocoapods.org/using/getting-started.html). Once you have your `podfile` setup, include the following:

```
platform :ios, '10.0'

target 'MyAmazingApp' do
    pod 'PrebidMobile'
end
```

### Include with Carthage

If you are not familiar with the Carthage package builder, please refere to the project [github page](https://github.com/Carthage/Carthage) for more details.

Since Prebid SDK architecture supports a multi-module feature for future enhancements, that currently use the same module name for every schema, please use CarthageBuild.sh script to build a necessary binary.

There are two shared schemes available ([issue #239](https://github.com/prebid/prebid-mobile-ios/issues/239)):

- PrebidMobile
- PrebidMobileCore

Follow the next steps:

1. Add PrebidSDK dependency into Cartfile. Release notes
```
github "prebid/prebid-mobile-ios" == 1.5
```
2. Update Carthage
```
carthage update
```

3. Build the specific schema `CarthageBuild.sh`

    **Variant 1**

    - Run CarthageBuild.sh script from Cartfile folder. The path should be:
        `.../Carthage/Checkouts/prebid-mobile-ios/scripts/CarthageBuild.sh`

    - Enter Schema name (PrebidMobile or PrebidMobileCore)
        - If you run CarthageBuild.sh and see Permission denied use:
             `chmod +x <path_to_CarthageBuild.sh>`

    **Variant 2**

    - Open `PrebidMobile.xcodeproj` at `.../Carthage/Checkouts/prebid-mobile-ios/PrebidMobile.xcodeproj` using Xcode

    - Manage Schemes -> Check Shared checkbox for a necessary schema

    - run `carthage build prebid-mobile-ios`
4. Integrate the binary into your project

You can find the schema name in the build PrebidSDK framework inside Info.plist with `PrebidMobileName` key

### Build framework from source

Build Prebid Mobile from source code. After [cloning the repo](https://github.com/prebid/prebid-mobile-ios), use Terminal or another command line tool, change to the root directory and run:

```
./scripts/buildPrebidMobile.sh
```
This will output the PrebidMobile.framework.

### Setup Prebid Server Account

In order to conduct header bidding within your app you will need a Prebid Server hosted account. There are two options available for publishers:

1. The simplest option is to sign up for a hosted solution. Several [Prebid.org members](https://prebid.org/product-suite/managed-services/) provide hosting packages.

2. Implement your own Prebid Server solution. You will need to [download](https://github.com/prebid/prebid-server) the source code from Github. The repository has [full instructions](https://github.com/prebid/prebid-server/tree/master/docs/developers) for configuring, deploying, and testing your implementation.

Once you have a Prebid Server account, you will need to add your account credentials to the app.


```
Prebid.shared.prebidServerAccountId = @"YOUR_ACCOUNT_ID";
Prebid.shared.prebidServerHost = PrebidHostAppnexus;
```

If you have opted to host your own Prebid Server solution you will need to store the url to the server in your app.


```
Prebid.shared.setCustomPrebidServer(url:URL_STRING_TO_SERVER)
```


### Integrate Ad Servers With Your App

Integrating **MoPub** with your application

1.  Go to [MoPub.com](https://app.mopub.com/register) and  register for a MoPub account . If you already have an account with them, you can [log in](https://app.mopub.com/account/login/).

2.  After the registration you will be automatically prompted to set up a new MoPub application required for integrating mobile ads to your application.

Integrating **Google** with your application   

Go to Google's developer site and follow the instructions for integrating their [Mobile Ads SDK](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/quick-start) into your app.

### Set Targeting Parameters (Optional)

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html).

### Create Ad Units

Banner and interstitial ad units can be created:


```
let bannerUnit = BannerAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", size: CGSize(width: 300, height: 250))
```

For details on creating the specific ad units and additional parameters and methods associated with each view the documentation pertaining to them:

[Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)  
[Interstitial Ad Unit](/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)

#### Using Asset Ids with In-App Native Ad Units

Setting this option to `true`, in your instance of Prebid Mobile, enables you to add an id for each asset in the assets array. The default setting is `false`

```
Prebid.shared.shouldAssignNativeAssetID = true
```

### Resize ad slot

Prebid recommends app developers to resize ads slots to the Prebid rendering ad size using native code due to an unresolved bug in the Google Mobile Ads SDK (described [here](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!category-topic/google-admob-ads-sdk/ios/648jzAP2EQY)) where render failures can occur with 3rd party creatives (such as Prebid Universal Creative) using size overrides.

{% capture warning_note %}  
Failure to resize rendering Prebid ads can cause revenue loss under certain conditions. For this reason, we advise using the below resize function in all scenarios. {% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

*SWIFT*
```swift
func adViewDidReceiveAd(_ bannerView: GADBannerView) {

    AdViewUtils.findPrebidCreativeSize(bannerView,
                                            success: { (size) in
                                                guard let bannerView = bannerView as? DFPBannerView else {
                                                    return
                                                }

                                                bannerView.resize(GADAdSizeFromCGSize(size))

        },
                                            failure: { (error) in
                                                print("error: \(error)");

        })
}



 ```

*Objective C*
 ```objective_c
 -(void) adViewDidReceiveAd:(GADBannerView *)bannerView {
    NSLog(@"Ad received");
    [AdViewUtils findPrebidCreativeSize:bannerView
                                   success:^(CGSize size) {
                                       if ([bannerView isKindOfClass:[DFPBannerView class]]) {
                                           DFPBannerView *dfpBannerView = (DFPBannerView *)bannerView;

                                           [dfpBannerView resize:GADAdSizeFromCGSize(size)];
                                       }
                                   } failure:^(NSError * _Nonnull error) {
                                       NSLog(@"error: %@", error);
                                   }];
}
 ```


## Further Reading

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Utilities - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-util-ios.html)
