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

Get started with Prebid Mobile by creating a [Prebid Server account](/prebid-mobile/prebid-mobile-getting-started.html). Once your account is set up include the Prebid Mobile SDK in your app by either using dependencies managers or by [cloning the repo](https://github.com/prebid/prebid-mobile-ios) and using our included script to build the SDK.

* TOC
{:toc}

## SDK Integration

### Cocoapods

If you are not familiar with using Cocoapods for dependency management, visit their [getting started page](https://guides.cocoapods.org/using/getting-started.html). Once you have your `Podfile` setup, include the following:

```bash
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
2. Drag `PrebidMobile.xcframework` from `generated/output` directory into your project. Make sure "Copy items if needed" is selected.
3. Go to your Xcode project’s `General -> Frameworks, Libraries, and Embedded Content` settings. Use `Embed & Sign` for dynamic and `Do Not Embed` for static linking

### Swift PM

SPM isn't supported for Prebid SDK `2.0.0` and higher ([details](https://github.com/prebid/prebid-mobile-ios/issues/640)).

The next guide is applicable to `1.x` versions of the SDK.

If you are not familiar with the Swift Package Manager, please refer to the project [github page](https://github.com/apple/swift-package-manager) for more details.

1. Add Prebid dependency `File -> Swift Packages -> Add Package Dependency...`
2. Select desired version, branch or commit
3. Select Prebid [module]({{site.baseurl}}/prebid-mobile/modules/modules-overview.html)
4. Build the specific schema `CarthageBuild.sh`

    **Variant 1**

    * Run CarthageBuild.sh script from Cartfile folder. The path should be:
        `.../Carthage/Checkouts/prebid-mobile-ios/scripts/CarthageBuild.sh`

    * Enter Schema name (PrebidMobile or PrebidMobileCore)
        * If you run CarthageBuild.sh and see Permission denied use:
             `chmod +x <path_to_CarthageBuild.sh>`

    **Variant 2**

    * Open `PrebidMobile.xcodeproj` at `.../Carthage/Checkouts/prebid-mobile-ios/PrebidMobile.xcodeproj` using Xcode

    * Manage Schemes -> Check Shared checkbox for a necessary schema

    * run `carthage build prebid-mobile-ios`
5. Integrate the binary into your project

You can find the schema name in the build PrebidSDK framework inside Info.plist with `PrebidMobileName` key

### Build framework from source

Build Prebid Mobile from source code. After [cloning the repo](https://github.com/prebid/prebid-mobile-ios), use Terminal or another command line tool, change to the root directory and run:

```bash
scripts/buildPrebidMobile.sh
```

This will output the PrebidMobile.framework.

## Add SDK

### Set Prebid Server

Once you have a [Prebid Server](/prebid-mobile/prebid-mobile-getting-started.html), you will add 'account' info to the Prebid Mobile. For example, if you're using the AppNexus Prebid Server:

```swift
Prebid.shared.prebidServerAccountId = YOUR_ACCOUNT_ID
Prebid.shared.prebidServerHost = .Appnexus
```

If you have opted to host your own Prebid Server solution, you will need to store the URL to the server in your app. Make sure that your URL points to the [/openrtb2/auction](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) endpoint.

```swift
try! Prebid.shared.setCustomPrebidServer(url: PREBID_SERVER_AUCTION_ENDPOINT)
```

This method throws an exception if the provided URL is invalid.

### Initialize SDK

Once you set the account ID and the Prebid Server host, you should initialize the Prebid SDK. There are several options for how to do it.

If you integrate Prebid Mobile with GMA SDK with version equal or higher than 10.7.0, use the following initializer, which checks the compatibility of Prebid SDK with GMA SDK used in the app:

```swift
Prebid.initializeSDK(gadMobileAdsVersion: GADGetStringFromVersionNumber(GADMobileAds.sharedInstance().versionNumber) { status, error in
    switch status {
    case .succeeded:
        print("Prebid SDK successfully initialized")
    case .failed:
        if let error = error {
            print("An error occurred during Prebid SDK initialization: \(error.localizedDescription)")
        }
    case .serverStatusWarning:
        if let error = error {
            print("Prebid Server status checking failed: \(error.localizedDescription)")
        }
    default:
        break
    }            
}            
```

If you integrate Prebid Mobile with GMA SDK with version lower than 10.7.0, use the following initializer:

```swift
Prebid.initializeSDK(GADMobileAds.sharedInstance()) { status, error in
    switch status {
    case .succeeded:
        print("Prebid SDK successfully initialized")
    case .failed:
        if let error = error {
            print("An error occurred during Prebid SDK initialization: \(error.localizedDescription)")
        }
    case .serverStatusWarning:
        if let error = error {
            print("Prebid Server status checking failed: \(error.localizedDescription)")
        }
    default:
        break
    }            
}            
```

Check the log messages of the app. If the provided GMA SDK version is not verified for compatibility, the Prebid SDK informs about it.

For the No Ad Server scenario, use the following initialization:

```swift
Prebid.initializeSDK { status, error in
    // ....
}
```

During the initialization, SDK creates internal classes and performs the health check request to the [/status](https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-status.html)  endpoint. If you use a custom PBS host you should provide a custom status endpoint as well:

```swift
Prebid.shared.customStatusEndpoint = PREBID_SERVER_STATUS_ENDPOINT
```

If something goes wrong with the request, the status of the initialization callback will be `.serverStatusWarning`. It doesn't affect an SDK flow and just informs you about the health check result.

## Set Targeting Parameters 

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html).

## Setup SDK

The `Prebid` class is a singleton that enables the user to apply global settings.

### Properties

`prebidServerAccountId`: String containing the Prebid Server account ID.

`prebidServerHost`: String containing configuration your Prebid Server host with which Prebid SDK will communicate. Choose from the system-defined Prebid Server hosts or define your own custom Prebid Server host.

`shareGeoLocation`: Optional Bool, if this flag is True AND the app collects the user’s geographical location data, Prebid Mobile will send the user’s geographical location data to Prebid Server. If this flag is False OR the app does not collect the user’s geographical location data, Prebid Mobile will not populate any user geographical location information in the call to Prebid Server. The default setting is false.

`logLevel`: Optional level of logging to output in the console. Options are one of the following sorted by a verbosity of the log:

```swift
public static let debug = LogLevel(stringValue: "[💬]", rawValue: 0)
public static let verbose = LogLevel(stringValue: "[🔬]", rawValue: 1)
public static let info = LogLevel(stringValue: "[ℹ️]", rawValue: 2)
public static let warn = LogLevel(stringValue: "[⚠️]", rawValue: 3)
public static let error = LogLevel(stringValue: "[‼️]", rawValue: 4)
public static let severe = LogLevel(stringValue: "[🔥]", rawValue: 5)
```

`timeoutMillis`: The Prebid timeout (accessible to Prebid SDK 1.2+), set in milliseconds, will return control to the ad server SDK to fetch an ad once the expiration period is achieved. Because Prebid SDK solicits bids from Prebid Server in one payload, setting Prebid timeout too low can stymie all demand resulting in a potential negative revenue impact.


`storedAuctionResponse`: Set as type string, stored auction responses signal Prebid Server to respond with a static response matching the storedAuctionResponse found in the Prebid Server Database, useful for debugging and integration testing. No bid requests will be sent to any bidders when a matching storedAuctionResponse is found. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

`pbsDebug`: adds the debug flag ("test":1) on the outbound http call to Prebid Server. The test:1 flag will signal to Prebid Server to emit the full resolved request (resolving any Stored Request IDs) as well as the full Bid Request and Bid Response to and from each bidder.

### Methods

#### Stored Response
{:.no_toc}

`addStoredBidResponse`: Function containing two properties:

* `bidder`: Bidder name as defined by Prebid Server bid adapter of type string.
* `responseId`: Configuration ID used in the Prebid Server Database to store static bid responses.

Stored Bid Responses are similar to Stored Auction Responses in that they signal to Prebid Server to respond with a static pre-defined response, except Stored Bid Responses is done at the bidder level, with bid requests sent out for any bidders not specified in the bidder parameter. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

```swift
func addStoredBidResponse(bidder: String, responseId: String)
```

`clearStoredBidResponses`: Clears any stored bid responses.

```swift
func clearStoredBidResponses()
```

#### Custom headers
{:.no_toc}

The following methods enable the customization of the HTTP call to the prebid server:

```swift
func addCustomHeader(name: String, value: String) 
```

```swift
func clearCustomHeaders() 
```

### Examples
{:.no_toc}

```swift
// Host
Prebid.shared.prebidServerHost = .Rubicon
// or set a custom host
Prebid.shared.prebidServerHost = PrebidHost.Custom
do {
    try Prebid.shared.setCustomPrebidServer(url: "https://prebid-server.customhost.com")
} catch {
    print(error)
}

// Account Id
Prebid.shared.prebidServerAccountId = "1234"

// Geolocation
Prebid.shared.shareGeoLocation = true

// Log level data
Prebid.shared.logLevel = .verbose

// Set Prebid timeout in milliseconds
Prebid.shared.timeoutMillis = 3000

// Enable Prebid Server debug respones
Prebid.shared.pbsDebug = true

// Stored responses  can be one of storedAuction response or storedBidResponse
Prebid.shared.storedAuctionResponse = "111122223333"

//or
Prebid.shared.addStoredBidResponse(bidder: "appnexus", responseId: "221144")
Prebid.shared.addStoredBidResponse(bidder: "rubicon", responseId: "221155")
```

## Integrate Ad Units

Follow the corresponding guide to integrate Prebid Mobile:

* [GAM using Original API](code-integration-ios.html)
* [No Ad Server](../../modules/rendering/ios-sdk-integration-pb.html)
* [GAM using Rendering API](../../modules/rendering/ios-sdk-integration-gam.html)
* [AdMob](../../modules/rendering/ios-sdk-integration-gam.html)
* [AppLovin MAX](../../modules/rendering/ios-sdk-integration-max.html)

### Test configs

In the table below, you can find Prebid's test IDs that are used in the Demo Applications and that you can utilize for SDK integration validation.

{: .table .table-bordered .table-striped }

| Config ID            | Ad Format        | Description            |
| -------------------- | ---------------- | ---------------------- | 
|`https://prebid-server-test-j.prebid.org/openrtb2/auction` | **Custom Prebid Server Host**|A PBS instance that is dedicated to testing purposes.|
|`0689a263-318d-448b-a3d4-b02e8a709d9d`| **Stored Request ID**|The test account ID on the test server.|
|`imp-prebid-banner-320-50`|**HTML Banner**|Returns a stored response that contains a Banner 320x50 winning bid.|
|`imp-prebid-display-interstitial-320-480`|**HTML Interstitial**|Returns a stored response that contains a Interstitial 320x480 winning bid.|
|`imp-prebid-video-outstream-original-api`|**Outstream Video** (Original API)|Returns a stored response that contains a Video 320x50 winning bid.|
|`imp-prebid-video-outstream`|**Outstream Video** (Rendering API)|Returns a stored response that contains a Video 320x50 winning bid.|
|`imp-prebid-video-interstitial-320-480-original-api`|**Video Interstitial** (Original API)|Returns a stored response that contains a Video Interstitial 320x480 winning bid.|
|`imp-prebid-video-interstitial-320-480`|**Video Interstitial** (Rendering API)|Returns a stored response that contains a Video Interstitial 320x480 winning bid.|
|`imp-prebid-video-rewarded-320-480-original-api`|**Rewarded Video** (Original API)|Returns a stored response that contains a Rewarded Video 320x480 winning bid.|
|`imp-prebid-video-rewarded-320-480`|**Rewarded Video** (Original API)|Returns a stored response that contains a Rewarded Video 320x480 winning bid.|
|`imp-prebid-video-interstitial-320-480`|**Instream Video**|Returns a stored response that contains a Video 320x480 winning bid.|
|`imp-prebid-banner-native-styles`|**Native Styles**|Returns a stored response that contains a Native winning bid.|
|`imp-prebid-banner-native-styles`|**In-App Native**|Returns a stored response that contains a Native winning bid.|



