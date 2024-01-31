---
layout: page_v2
title: Prebid Mobile FAQ | Prebid
description: Prebid Mobile FAQ
sidebarType: 2
---

# Prebid Mobile FAQ

{:.no_toc}

This page has answers to some frequently asked questions about Prebid Mobile. If you don't find what you're looking for here, there are other ways to [get help](/support/index.html).

- TOC
{:toc}

## General

### What size is the SDK?

Compiled sizes:

- Android: 800 KB
- iOS: 3.2 Mb

Note: these sizes will go down as several assets will be pulled out into a CDN over the coming months.

### Does the SDK have UI components?  If so, are they localized?

The Prebid SDK has no localized UI components.

Most probably you will use an integration approach that doesn’t utilize UI component at all, as they are used only with the Rendering API.

### Is the SDK compressed using any compression tools?

No.

### Is the SDK encrypted or obfuscated in any way?

No.

### Is the SDK synchronous?

Prebid SDK is always async. The completion handler for the main fetchDemand() method is called asynchronously when the bid response (or timeout, network error, etc.) is received. The app defines the desired timeout.

### How long do bids remain valid?

Prebid SDK does not support a [limited bid cache](/dev-docs/faq.html#does-prebidjs-cache-bids) like Prebid.js does. Which means it's up to the app to build any kind of pre-fetch or bid-cache feature. Notes:

1. If Prebid Cache is being utilized, the Time-To-Live for that cache should be understood. By default, the TTL for Prebid Cache is 5 minutes for banners and 15 minutes for video, but this can be changed.
2. No matter what the Cache TTL is set to, it's important that any pre-fetch or bid-cache feature built into the app should respect the OpenRTB `seatbid.bid.exp` field for each bid, which is the expiration of the bid in seconds.

### Does Prebid SDK support integration into the Unity SDK?

Prebid does not support Unity directly and no one in the community has recent experience with it. We believe that it may be possible to call for bids  using the [custom bidding integration(/prebid-mobile/modules/rendering/ios-sdk-integration-pb.html) approach.

Contributions from the community (whether code or documentation) would be welcome.

## Dependencies

### Does the SDK use third-party libraries?  

Prebid Mobile SDK is bundled with the Open Measurement (OM) SDK. If you will be using Prebid Mobile SDK to render ads, then the Open Measurement signals are available and are passed in the ad request. If you are using different SDK (e.g. GAM) to render ads, then the OM signals should be checked with the respective SDK (e.g. if there is OM SDK dependency there).

### Is Prebid Certified for the Open Measurement SDK?

No, the Prebid SDK is currently not certified with the IAB. The open-source nature of the Prebid SDK means that app developers can modify the code, which means that publishers requiring certification need to reach out to the IAB and get their particular implementation of the Prebid + OM SDK dependency certified.

Advertisers can leverage 3rd party vendors of their choice when measuring viewability using OM SDK. Majority of the vendors are providing viewability scores for all types of the OM SDK integrations allowing advertisers to independently measure viewability across any publisher independently of their certifications. The only known exception currently is MOAT. This vendor is known to nullify the viewability scores if the integration is not certified. In this case, publishers can directly reach out to the IAB and get their own version of the Prebid SDK integration with OM SDK dependency certified.

More details available at:

- [IAB OM SDK](https://iabtechlab.com/standards/open-measurement-sdk/)
- [Prebid iOS OM SDK](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#open-measurement-sdk-omsdk-api)
- [Prebid Android OM SDK](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html#open-measurement-sdk-omsdk-api)

### Does it have external dependencies?  

No.

### Does it use open-source libraries? If so, which licenses are used?

No. The Prebid SDK is itself a library open sourced under the Apache 2 license.

### Are there any back-end dependencies to this SDK?

Yes - the app developer must have a [Prebid Server](/prebid-server/overview/prebid-server-overview.html) at their disposal. This is open source software that they may run themselves, or they may contract with a [Managed Service](https://prebid.org/product-suite/managed-services/).

## Communication

### Does the SDK make network requests and how often and how heavy?  

Yes. Its main job is to formulate requests to [Prebid Server](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) to obtain bids for ad units.

The frequency of HTTPS network calls is up to the app developer. It depends on whether and how frequently ad units are refreshed. The payload size will depend on how many ad units are present in the app and what kind of consent strings are present. For one ad unit, the size should be under 2KB, with each ad unit adding a couple hundred bytes.

## Maintenance

### How often is the SDK updated?

It varies, but on average, it's updated about once per month.

The open source repos have a list of releases:

- <https://github.com/prebid/prebid-mobile-ios/releases>
- <https://github.com/prebid/prebid-mobile-android/releases>

### How does one update the Prebid Mobile version?

The best way is to integrate SDK via dependency managers - CocoaPods (iOS) and Maven (Android). You can specify the particular version or point the dependency manager to the latest SDK version. In the second case, the new version of SDK will be added to the app as soon as released.

### If a bug is found in the SDK, what is the process for reporting it?

Please open a github issue:

- <https://github.com/prebid/prebid-mobile-ios/issues>
- <https://github.com/prebid/prebid-mobile-android/issues>

### Is there a support forum where we can monitor issues and resolutions?

Yes, you may monitor github issues and pull requests at the repositories noted above.

### Are there debug/logging options that can be toggled on/off?

Yes.

1. You can change app console log verbose level via PrebiMobile.shared.logLevel
2. You can set the OpenRtb 'test' flag for Prebid Server to return additional server-side information. See 'debug' in <https://docs.prebid.org/prebid-mobile/pbm-api/android/code-integration-android.html> and <https://docs.prebid.org/prebid-mobile/pbm-api/ios/code-integration-ios.html>

## Privacy/Security

### Does the SDK store any data locally on the device?  If so, what is it?

If the developer calls certain functions, the SDK will store the results for future auctions. See the "Local Storage" section of
<https://docs.prebid.org/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html>

In all other cases SDK plays a transport role. It collects information from API (if it’s allowed by privacy settings) and sends it in the bid requests to the server. SDK uses the following datasources:

- TCF API - SDK reads data from UserDefaults
- Configuration / Targeting API - publishers provide data to SDK in runtime
- Device API - SDK collects device info using public OS API, like user agent, OS version, location

### Does the SDK send any Personal Information over the network?

The Prebid SDK sends information provided by the publisher using the Targeting API. We recommend that publishers avoid targeting to personal information unless reviewed by their own legal teams.

The SDK will send IP address and device latitude/longitude information. Prebid Server will anonymize requests as required by regulations, including GDPR, COPPA, CCPA. See the [Prebid Server privacy features](/prebid-server/features/pbs-privacy.html) for more details.

### Is the SDK GDPR compliant?

Yes - the SDK will forward TCF consent strings to Prebid Server where requests may be anonymized or restricted. It is up to the entity hosting Prebid Server to configure the server properly.

Also note that Prebid.org is committed to other privacy initiatives such as the IAB's Global Privacy Platform, including US National Privacy and TCF-Canada.

### How does the SDK allow for deletion of user private data?

SDK does’t commit any action on managing user data. Only publishers using SDK’s API can provide/store/remove user data.

### Does SDK Provide an Apple Privacy Manifest? 

No, because the Prebid SDK is an open-source SDK, that doesn't have a single domain to send bid requests.

However, here is the list of items that the app developer can add to the application's privacy manifest to cover Prebid SDK activity and data consumption: 

`NSPrivacyTracking` - true. Because Prebid SDK collects IDFA. 
`NSPrivacyTrackingDomains` - the tracking domain for the PBS. 

Pay attention - if `NSPrivacyTracking` is true, the tracking domain is provided, and the user doesn't allow the app to track him or her, iOS will block the bid requests. Prebid SDK doesn't support tracking and non-tracking endpoints yet. Follow the [issue](https://github.com/prebid/prebid-mobile-ios/issues/954) for the details. 

The `NSPrivacyCollectedDataTypes` array should contain the following `NSPrivacyCollectedDataType` items: `NSPrivacyCollectedDataTypePreciseLocation`, `NSPrivacyCollectedDataTypeCoarseLocation`,`NSPrivacyCollectedDataTypeDeviceID`, `NSPrivacyCollectedDataTypeProductInteraction`, `NSPrivacyCollectedDataTypeAdvertisingData`. The values for `NSPrivacyCollectedDataTypeLinked` and `NSPrivacyCollectedDataTypeTracking` in each entry depend on your demand partners, you should consult with them to provide proper info.   The `NSPrivacyCollectedDataTypePurposes` array should contain `NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising` and/or other purposes your demand partners require. Neither SDK nor Server process data.

The `NSPrivacyAccessedAPITypes` array should contain the `NSPrivacyAccessedAPICategoryUserDefaults` item. The `NSPrivacyAccessedAPITypeReasons` for this item should contain `CA92.1` value.


## Performance

### Does the SDK do any work in the background?  If so, what is it?

The SDK will receive responses from Prebid Server in the background and call the application-defined callbacks.

The developer may set up auto-refresh for ad units. If in the background, Prebid SDK will not perform bid requests.

### Has power usage related to this SDK been tested?

No. We'd welcome any community member to help us with requirements, code, and/or results.

### How long does it take to initialize?

Is not measured, but very fast. Because it makes only initialization of internal classes and optional health check calls to PBS. The result of the health check call does not influence the SDK behavior, so publishers may not wait for its result during the initialization.

## API Questions

### What is the difference between Original API and Rendering API?

The main difference is that with Original API, the Prebid demand is rendered by the Ad Server SDK (Google Mobile Ads SDK) using Prebid Universal Creative. But with Rendering API, Prebid SDK renders the winning bid in its own Web or Video views.

## iOS Specifics

### Does the SDK support Swift 3+?

Yes. Prebid SDK is developed with latest Xcode version.  

### Does it ship as a CocoaPod?

Yes - <https://cocoapods.org/pods/PrebidMobile>

### Is it bit code enabled?

Starting with 2.1.0: No

### Does it support 64-bit?

Yes.

## Android Specifics

### What are the targeted APIs?

Android API 32.

### Does it include Broadcast Receivers in the Manifest?

No.

## Further Reading

- [Prebid Mobile home page](/prebid-mobile/prebid-mobile.html)
