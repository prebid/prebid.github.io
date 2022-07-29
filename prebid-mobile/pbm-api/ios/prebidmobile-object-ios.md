---
layout: page_v2
title: Prebid Mobile Object
description: Prebid Mobile Object
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid: NSObject

{: .notoc}

The Prebid class is a singleton that enables the user to apply global settings.

- TOC
 {:toc}

---

## Properties

`prebidServerAccountId`: String containing the Prebid Server account ID.

```
var prebidServerAccountId: String { get set }
```

`prebidServerHost`: String containing configuration your Prebid Server host with which Prebid SDK will communicate. Choose from the system-defined Prebid Server hosts or define your own custom Prebid Server host.

```
var prebidServerHost: PrebidHost { get set }
func setCustomPrebidServer(url: String)	throws
```

`shareGeoLocation`: Optional Bool, if this flag is True AND the app collects the user’s geographical location data, Prebid Mobile will send the user’s geographical location data to Prebid Server. If this flag is False OR the app does not collect the user’s geographical location data, Prebid Mobile will not populate any user geographical location information in the call to Prebid Server. The default setting is false.

```
var shareGeoLocation: Bool { get set }
```

`logLevel`: Optional level of loging to output in the console. Options are one of following sorted by verbosity of the log:

```
public enum LogLevel: String {
* debug = "[💬]" // debug
* verbose = "[🔬]" // verbose
* info = "[ℹ️]" // info
* warn = "[⚠️]" // warning
* error = "[‼️]" // error
* severe = "[🔥]" // severe
}
```

Default value is `debug`. All logging will be disabled in the release build. For furthe information, refer to [PR#217](https://github.com/prebid/prebid-mobile-ios/pull/217)

```
var logLevel: LogLevel { get set }
```
`timeoutMillis`: The Prebid timeout (accessible to Prebid SDK 1.2+), set in milliseconds, will return control to the ad server SDK to fetch an ad once the expiration period is achieved. Because Prebid SDK solicits bids from Prebid Server in one payload, setting Prebid timeout too low can stymie all demand resulting in a potential negative revenue impact.

```swift
var timeoutMillis: Int
```

`storedAuctionResponse`: Set as type string, stored auction responses signal Prebid Server to respond with a static response matching the storedAuctionResponse found in the Prebid Server Database, useful for debugging and integration testing. No bid requests will be sent to any bidders when a matching storedAuctionResponse is found. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

```swift
var storedAuctionResponse: String
```

## Methods

### Stored Response

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

`pbsDebug`: adds the debug flag ("test":1) on the outbound http call to Prebid Server. The test:1 flag will signal to Prebid Server to emit the full resolved request (resolving any Stored Request IDs) as well as the full Bid Request and Bid Response to and from each bidder.
```swift
pbsDebug = BOOL
```

### Custom headers

The following methods enables the customization of the HTTP call to the prebid server:

```
func addCustomHeader(name: String, value: String) 
```

```
func clearCustomHeaders() 
```

# Examples

*SWIFT*
```swift
//Host
Prebid.shared.prebidServerHost = .Rubicon
//or set a custom host
Prebid.shared.prebidServerHost = PrebidHost.Custom
do {
    try Prebid.shared.setCustomPrebidServer(url: "https://prebid-server.customhost.com")
} catch {
    print(error)
}

//Account Id
Prebid.shared.prebidServerAccountId = "1234"

//Geolocation
Prebid.shared.shareGeoLocation = true

//Log level data
Prebid.shared.logLevel = .verbose

//set Prebid timeout in milliseconds
Prebid.shared.timeoutMillis = 3000

//Enable Prebid Server debug respones
Prebid.shared.pbsDebug = true

//Stored responses  can be one of storedAuction response or storedBidResponse
Prebid.shared.storedAuctionResponse = "111122223333"

//or
Prebid.shared.addStoredBidResponse(bidder: "appnexus", responseId: "221144")
Prebid.shared.addStoredBidResponse(bidder: "rubicon", responseId: "221155")
```

*Objective C*
```objective_c
//Host
Prebid.shared.prebidServerHost = PrebidHostRubicon;

//or set a custom host
Prebid.shared.prebidServerHost = PrebidHostCustom;

NSError *error = nil;
bool ok = [Prebid.shared setCustomPrebidServerWithUrl:@"https://prebid-server.customhost.com" error: &error];

if (!ok) {
    NSLog(@"An error happend: %@", error);
}

//Account Id
Prebid.shared.prebidServerAccountId = @"1001";

//Geolocation
Prebid.shared.shareGeoLocation = YES;
Prebid.shared.timeoutMillis = 3000;

//Stored responses  can be one of storedAuction response or storedBidResponse
Prebid.shared.storedAuctionResponse = @"111122223333";

//Enable Prebid Server debug respones
Prebid.shared.pbsDebug = true;

//or
[Prebid.shared addStoredBidResponseWithBidder:@"appnexus" responseId:@"221144"];
[Prebid.shared addStoredBidResponseWithBidder:@"rubicon" responseId:@"221155"];
```


# Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Prebid Utilities - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-util-ios.html)
