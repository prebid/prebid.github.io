---
layout: page_v2
title: SDK Integration - iOS
description: Code Integration - iOS
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---

<!-- markdownlint-disable-file MD046 -->

# Prebid SDK Integration for iOS
{:.no_toc}

Get started with Prebid Mobile by creating a [Prebid Server account](/prebid-mobile/prebid-mobile-getting-started.html). Once your account is set up include the Prebid Mobile SDK in your app by either using dependencies managers or by [cloning the repo](https://github.com/prebid/prebid-mobile-ios) and using our included script to build the SDK.

- TOC
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

### Swift Package Manager (SPM)

Starting from version `3.1.0`, PrebidMobile supports the Swift Package Manager (SPM), making integration much easier and more maintainable compared to manual setups or CocoaPods.

To [add the Prebid Mobile SDK package dependency](https://developer.apple.com/documentation/xcode/adding-package-dependencies-to-your-app#Add-a-package-dependency) using SPM, follow these steps:

1. In Xcode, install the Prebid Mobile SDK by navigating to File > Add Package Dependencies...
2. In the prompt that appears, search for the Prebid Mobile SDK GitHub repository:

    ```bash
    https://github.com/prebid/prebid-mobile-ios.git
    ```
    
3. Select the version of the Prebid Mobile SDK you want to use. For new projects, we recommend using the `Up to Next Major Version`.
4. In the package selection screen, make sure to check the modules you need for your integration and link it to your application target.

{: .alert.alert-info :}
The Swift Package Manager (SPM) integration is currently marked as beta. We are actively working on refining the project structure and modularization to improve clarity, performance, and ease of integration. During this period, some modules or dependencies may be reorganized. We welcome your feedback - if you encounter any issues or have suggestions, please don't hesitate to reach out and help us shape the future of the PrebidMobile SPM support.

### Build framework from source

Build Prebid Mobile from source code. After [cloning the repo](https://github.com/prebid/prebid-mobile-ios), use Terminal or another command line tool, change to the root directory and run:

```bash
scripts/buildPrebidMobile.sh
```

This will output the PrebidMobile.framework.

## Add the Prebid SDK

### Prebid Server Account ID

Once you have a [Prebid Server](/prebid-mobile/prebid-mobile-getting-started.html), you will add 'account' info to the Prebid Mobile.

```swift
Prebid.shared.prebidServerAccountId = YOUR_ACCOUNT_ID
```

### Point to a Prebid Server

{: .alert.alert-warning :}
Starting from PrebidMobile `3.0.0` the setCustomPrebidServer() method and the `Host.Appnexus` and `Host.Rubicon` enums have been removed. Please check the server URL in [API changes](/prebid-mobile/updates-3.0/ios/api-changes#host) and use `PrebidMobile.initializeSdk` (below) to set the Prebid Server URL.

In SDK 2.5 and before, if you're using the AppNexus Prebid Server, you would do this:

```swift
Prebid.shared.prebidServerHost = .Appnexus
```

In SDK 2.5 and before, if you have opted to host your own Prebid Server solution, you will need to store the URL to the server in your app. Make sure that your URL points to the [/openrtb2/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) endpoint.

```swift
try! Prebid.shared.setCustomPrebidServer(url: "https://prebidserver.example.com/openrtb2/auction")
```

This method throws an exception if the provided URL is invalid.

#### Account Settings ID

Each mobile app may have its own "account settings ID". This is used to look up data in Prebid Server like timeout, targeting, and price granularity.

By default the Account Settings ID is set to be the same as the Account ID. i.e. the Prebid.shared.prebidServerAccountId property will set both values.
If you want to define a different Account Settings ID as determined in conjunction with
your Prebid Server team, use the [arbitrary OpenRTB](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#arbitrary-openrtb) method like this:

```swift
Targeting.shared.setGlobalORTBConfig("{\"ext\":{\"prebid\":{\"storedrequest\": {\"id\":\"account-settings-id\"}}}}")
```

### Initialize SDK

Once you set the account ID, you should initialize the Prebid SDK. 

In SDK 3.0 and later, you need to enter a URL to your Prebid Server's auction endpoint in your app. Get this URL from your Prebid Server provider. e.g. `https://prebid-server.example.com/openrtb2/auction`.

If you integrate Prebid Mobile with GMA SDK with version equal or higher than 10.7.0, use the following initializer, which checks the compatibility of Prebid SDK with GMA SDK used in the app:

{% capture gma12 %}Prebid.initializeSDK(PREBID_SERVER_URL, gadMobileAdsVersion: string(for: MobileAds.shared.versionNumber)) { status, error in
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
{% endcapture %}
{% capture gma11 %}Prebid.initializeSDK(PREBID_SERVER_URL, gadMobileAdsVersion: GADGetStringFromVersionNumber(GADMobileAds.sharedInstance().versionNumber) { status, error in
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
{% endcapture %}

{% include code/gma-versions-tabs.html id="pbm-init" gma11=gma11 gma12=gma12 %}

If you integrate Prebid Mobile with GMA SDK with version lower than 10.7.0, use the following initializer:

```swift
Prebid.initializeSDK(PREBID_SERVER_URL, GADMobileAds.sharedInstance()) { status, error in
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
Prebid.initializeSDK(PREBID_SERVER_URL) { status, error in
    // ....
}
```

All initialization methods may throw an exception if the provided server URL is invalid.

During the initialization, SDK creates internal classes and performs the health check request to the [/status](/prebid-server/endpoints/pbs-endpoint-status.html)  endpoint. If your Prebid Server provider has a non-standard path (anything other than `/status`), you should provide a the alternate status endpoint:

```swift
Prebid.shared.customStatusEndpoint = PREBID_SERVER_STATUS_ENDPOINT
```

If something goes wrong with the request, the status of the initialization callback will be `.serverStatusWarning`. It doesn't affect an SDK flow and just informs you about the health check result.

#### Handling Tracking Domains

As part of Apple's evolving privacy policies, SDKs that access user data in a way that could be used for tracking may be required to register tracking domains in the `PrivacyInfo.xcprivacy` file. 

Currently, the Prebid Mobile SDK is not classified as one of these SDKs. But future changes from Apple or internal app review policies may prompt publishers to proactively register the Prebid Server (PBS) endpoint in the privacy manifest. To support this, the Prebid SDK is designed to accommodate both tracking and non-tracking PBS domains. Here are the Prebid recommendations:

- Include the relevant `NSPrivacyCollectedDataTypes` and define your primary Prebid Server domain in the `NSPrivacyTrackingDomains` array in your the `PrivacyInfo.xcprivacy` file to cover a potential "worst case" scenario. Read more about the `PrivacyInfo.xcprivacy` data in the [Prebid Mobile FAQ](https://docs.prebid.org/faq/prebid-mobile-faq.html#privacysecurity).
- You may choose to provide a secondary, privacy-mode PBS URL to the SDK. This secondary domain can be used when tracking is disallowed. Get this additional hostname from your Prebid Server host provider. Every initialization method contains optional parameter to define this privacy-safe PBS domain. Since these requests will have the `limit ad tracking` flag defined, Prebid Server will anonymize the requests.

You’re not required to use a secondary PBS domain -- you can simply allow iOS to block PBS requests when the user opts out of tracking.

```swift
let trackingURL = "https://prebidserver.example.com/openrtb2/auction"
let nonTrackingURL = "https://prebidserver.example.nontracking.com/openrtb2/auction"
Prebid.initializeSDK(trackingURL, nonTrackingURL) { status, error in
    // ....
}
```

{: .alert.alert-warning :}
Depending on Apple’s domain monitoring mechanisms, even the privacy-mode domain could potentially be blocked. In such cases, the PBS provider may need to engage with Apple for resolution.

## Set Global Parameters

There are several types of parameters app developers should consider providing to Prebid SDK:

- Values that control Prebid SDK behavior (timeout, etc)
- Privacy consent settings (TCF, GPP, COPPA, etc).
- First Party Data to help bidders understand the context and/or user better.

See the [global parameters page](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html) for details.

## Setup SDK

The `Prebid` class is a singleton that enables the user to apply global settings.

### Properties

`prebidServerAccountId`: String containing the Prebid Server account ID.

`prebidServerHost`: String containing configuration your Prebid Server host with which Prebid SDK will communicate. Choose from the system-defined Prebid Server hosts or define your own custom Prebid Server host.

`auctionSettingsId`: Allows you to separate account from "auction settings". This is used to set `ext.prebid.storedrequest.id`, otherwise prebidServerAccountId is taken by default. This allows each app to have different global parameters like timeout, price granularity, etc. Please work with your Prebid Server provider to determine what to enter here. 

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

`creativeFactoryTimeout`: Controls how long banner creative has to load before it is considered a failure.

`creativeFactoryTimeoutPreRenderContent`: Controls how long video and interstitial creatives have to load before it is considered a failure.

`storedAuctionResponse`: Set as type string, stored auction responses signal Prebid Server to respond with a static response matching the storedAuctionResponse found in the Prebid Server Database, useful for debugging and integration testing. No bid requests will be sent to any bidders when a matching storedAuctionResponse is found. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

`pbsDebug`: adds the debug flag ("test":1) on the outbound http call to Prebid Server. The test:1 flag will signal to Prebid Server to emit the full resolved request (resolving any Stored Request IDs) as well as the full Bid Request and Bid Response to and from each bidder.

### Methods

#### Stored Response
{:.no_toc}

`addStoredBidResponse`: Function containing two properties:

- `bidder`: Bidder name as defined by Prebid Server bid adapter of type string.
- `responseId`: Configuration ID used in the Prebid Server Database to store static bid responses.

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

### Server Side Configuration

You can pass some SDK configuration properties from PBS to the SDK using the `ext.prebid.passthrough` object, [supported](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#request-passthrough) by Prebid Server, in the stored request.

For now Prebid SDK supports the following configuration properties:

- `cftbanner` - see the `Prebid.creativeFactoryTimeout`
- `cftprerender` - see the `Prebid.creativeFactoryTimeoutPreRenderContent`

An example of a stored request:

```json
{
  "app": {
    "publisher": {
      "ext": {
        "prebid": {

        }
      }
    }
  },
  "ext": {
    "prebid": {
      "passthrough": [
        {
          "type": "prebidmobilesdk",
          "sdkconfiguration": {
            "cftbanner": 42,
            "cftprerender": 4242
          }
        }
      ]
    }
  },
  "test": 1
}
```

All values received in the `passthrough` of the bid response will be applied to the respective `Prebid.*` properties with the highest priority. After that, the SDK will utilize new values received in the bid response.

### Examples
{:.no_toc}

{: .alert.alert-warning :}
Starting from PrebidMobile `3.0.0` the `prebidServerHost` property and the `setCustomPrebidServer` method are removed. Use `Prebid.initializeSDK` instead. If you used `Host.Appnexus` or `Host.Rubicon` to set your host, you should check the server URL in [API changes](/prebid-mobile/updates-3.0/ios/api-changes#host).

```swift

// Host (Removed in 3.0.0. Use `Prebid.initializeSDK` instead.)
Prebid.shared.prebidServerHost = .Rubicon
// or set a custom host (Removed in 3.0.0. Use `Prebid.initializeSDK` instead.)
Prebid.shared.prebidServerHost = PrebidHost.Custom
do {
    // Removed in 3.0.0. Use `Prebid.initializeSDK` instead.
    try Prebid.shared.setCustomPrebidServer(url: "https://prebid-server.customhost.com")
} catch {
    print(error)
}

// Account Id
Prebid.shared.prebidServerAccountId = "1234"

// Auction Settings Id (Optional)
Prebid.shared.auctionSettingsId = "7890"

// Geolocation
Prebid.shared.shareGeoLocation = true

// Log level data
Prebid.shared.logLevel = .verbose

// Set Prebid timeout in milliseconds
Prebid.shared.timeoutMillis = 3000

// Enable Prebid Server debug responses
Prebid.shared.pbsDebug = true

// Stored responses  can be one of storedAuction response or storedBidResponse
Prebid.shared.storedAuctionResponse = "111122223333"

//or
Prebid.shared.addStoredBidResponse(bidder: "appnexus", responseId: "221144")
Prebid.shared.addStoredBidResponse(bidder: "rubicon", responseId: "221155")
```

## Integrate Ad Units

Follow the corresponding guide to integrate Prebid Mobile:

- [GAM using Original API](code-integration-ios.html)
- [No Ad Server](/prebid-mobile/modules/rendering/ios-sdk-integration-pb.html)
- [GAM using Rendering API](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html)
- [AdMob](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html)
- [AppLovin MAX](/prebid-mobile/modules/rendering/ios-sdk-integration-max.html)

### Test configs

In the table below, you can find Prebid's test IDs that are used in the Demo Applications and that you can utilize for SDK integration validation.

{: .table .table-bordered .table-striped }

| Config ID            | Ad Format        | Description            |
| -------------------- | ---------------- | ---------------------- |
|`https://prebid-server-test-j.prebid.org/openrtb2/auction` | **Custom Prebid Server Host**|A PBS instance that is dedicated to testing purposes.|
|`0689a263-318d-448b-a3d4-b02e8a709d9d`| **Stored Request ID**|The test account ID on the test server.|
|`prebid-demo-banner-320-50`|**HTML Banner**|Returns a stored response that contains a Banner 320x50 winning bid.|
|`prebid-demo-display-interstitial-320-480`|**HTML Interstitial**|Returns a stored response that contains a Interstitial 320x480 winning bid.|
|`prebid-demo-video-outstream-original-api`|**Outstream Video** (Original API)|Returns a stored response that contains a Video 320x50 winning bid.|
|`prebid-demo-video-outstream`|**Outstream Video** (Rendering API)|Returns a stored response that contains a Video 320x50 winning bid.|
|`prebid-demo-video-interstitial-320-480-original-api`|**Video Interstitial** (Original API)|Returns a stored response that contains a Video Interstitial 320x480 winning bid.|
|`prebid-demo-video-interstitial-320-480`|**Video Interstitial** (Rendering API)|Returns a stored response that contains a Video Interstitial 320x480 winning bid.|
|`prebid-demo-video-rewarded-320-480-original-api`|**Rewarded Video** (Original API)|Returns a stored response that contains a Rewarded Video 320x480 winning bid.|
|`prebid-demo-banner-rewarded-time`|**Rewarded HTML** Returns a stored response that contains a Rewarded HTML 320x480 winning bid with rewarded configuration.||
|`prebid-demo-video-rewarded-endcard-time`|**Rewarded Video** Returns a stored response that contains a Rewarded Video 320x480 winning bid with rewarded configuration.||
|`prebid-demo-video-interstitial-320-480`|**Instream Video**|Returns a stored response that contains a Video 320x480 winning bid.|
|`prebid-demo-banner-native-styles`|**Native Styles**|Returns a stored response that contains a Native winning bid.|
|`prebid-demo-banner-native-styles`|**In-App Native**|Returns a stored response that contains a Native winning bid.|
