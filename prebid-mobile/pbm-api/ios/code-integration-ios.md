---
layout: page_v2
title: SDK Integration - iOS
description: Code Integration - iOS
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---

# Integration for iOS
{:.no_toc}

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-getting-started.html). Once your account is set up include the Prebid Mobile SDK in your app by either using dependencies managers or by [cloning the repo](https://github.com/prebid/prebid-mobile-ios) and using our included script to build the SDK.

* TOC
{:toc}

## SDK Integration

### Cocoapods

If you are not familiar with using Cocoapods for dependency management visit their [getting started page](https://guides.cocoapods.org/using/getting-started.html). Once you have your `Podfile` setup, include the following:

```
target 'MyAmazingApp' do
    pod 'PrebidMobile'
end
```

Now run `pod install` to add the Prebid SDK to project dependencies. 

### Carthage

If you are not familiar with the Carthage package builder, please refer to the project [github page](https://github.com/Carthage/Carthage) for more details.

1. Install Carthage
2. Add `github "prebid/prebid-mobile-ios" == 2.0.4-carthage` to your `Cartfile`.
3. Run `carthage update`.
4. Drag `PrebidMobile.xcframework` from `Carthage/Build` to `General -> Linked Frameworks and Libraries`

### XCFramework

1. Clone the project and run script `scripts/buildPrebidMobile.sh`
2. Drag `PrebidMobile.xcframework` from `generated/output` directory into your project. Make sure Copy items if needed is selected.
3. Go to your Xcode project’s `General -> Frameworks, Libraries, and Embedded Content` settings. Use `Embed & Sign` for dynamic and `Do Not Embed` for static linking

### Swift PM

SPM isn't supported for Prebid SDK `2.0.0` and higher ([details](https://github.com/prebid/prebid-mobile-ios/issues/640)). 

The next guide is applicable for `1.x` versions of the SDK. 

If you are not familiar with the Swift Package Manager, please refere to the project [github page](https://github.com/apple/swift-package-manager) for more details.

1. Add Prebid dependency `File -> Swift Packages -> Add Package Dependency...` 
2. Select desired version, branch or commit
3. Select Prebid [module]({{site.baseurl}}/prebid-mobile/modules/modules-overview.html)
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
scripts/buildPrebidMobile.sh
```

This will output the PrebidMobile.framework.

## Initialize SDK

Once you have a [Prebid Server]((/prebid-mobile/prebid-mobile-getting-started.html)), you will add 'account' info to the Prebid Mobile. For example, if you're using the AppNexus Prebid Server:

```
Prebid.shared.prebidServerAccountId = "YOUR_ACCOUNT_ID"
Prebid.shared.prebidServerHost = .Appnexus
```

If you have opted to host your own Prebid Server solution you will need to store the url to the server in your app.

```
try! Prebid.shared.setCustomPrebidServer(url: "https://prebid-server-test-j.prebid.org/openrtb2/auction")
```

This method throws an exception if the provided URL is invalid.

Once you set the account ID and the Prebid Server host, you should initialize the Prebid SDK. There are several options for how to do it. 

For the No Ad Server scenario, use the following initialization: 

```
Prebid.initializeSDK { status, error in
    if let error = error {
        print("Initialization Error: \(error.localizedDescription)")
        return
    }
}
```

If you integrate Prebid Mobile with GMA SDK, use the following initializer, wich checks the compatibility of Prebid SDK with GMA SDK used in the app: 


```
Prebid.initializeSDK(GADMobileAds.sharedInstance()) { status, error in
    if let error = error {
        print("Initialization Error: \(error.localizedDescription)")
        return
    }
}
```

Check the log messages of the app. If the provided GMA SDK version is not verified for compatibility, the Prebid SDK informs about it.

## Set Targeting Parameters 

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html).

## Integrate Ad Units

Follow the coresponding guide to integrate Prebid Mobile:

- [No Ad Server]()
- [GAM using Original API]()
- [GAM using Rendering API]()
- [AdMob]()
- [AppLovin MAX]()
