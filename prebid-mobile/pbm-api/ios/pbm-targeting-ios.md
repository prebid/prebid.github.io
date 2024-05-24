---
layout: page_v2
title: Global Parameters - iOS
description: Prebid Mobile API global parameters for iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid SDK Global Parameters - iOS
{:.no_toc}

- TOC
{:toc}

## How to Read this Guide

This page documents various global parameters you can set on the Prebid SDK for iOS. It describes the properties and methods of the Prebid SDK that allow you to supply important parameters to the header bidding auction.

Specifically, app developers should consider each of these general sections:

- Prebid SDK class parameters: these cover behavior of the SDK. Some values are required like a Prebid Server.
- Privacy / Consent Management parameters: we recommend developing a clear plan for user privacy with your legal counsel.
- First Party Data: data about the app or user that helps bidders choose an appropriate ad.

{: .alert.alert-info :}
Note that the SDK's Targeting class uses the term "Targeting" loosely. It's mostly about
passing data to bidders that would help improve auction results. But there are also fields and methods
in the Targeting class that convey privacy data, Open Measurement info, and other data used beyond actual
bid targeting.

## Prebid Class Global Properties and Methods

The `Prebid` class is a singleton that enables you to apply certain global settings.

### Prebid Class Global Properties

All of these properties of the Prebid class can be set on the `shared` object like this:

```swift
Prebid.shared.prebidServerAccountId="12345"
Prebid.shared.customStatusEndpoint="https://pbs.example.com/v2/status"
```

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Purpose | Description | Example |
| --- | --- | --- | --- | --- | --- |
| prebidServerAccountId | either | string | init | Your Prebid Server team will tell you whether this is required or not and if so, the value. | "abc123" |
| prebidServerHost | optional | enum | init | This can take the values "Appnexus", "Rubicon", or "Custom". If "Custom", you need to use the setCustomPrebidServerUrl() method to set a URL. This is where the Prebid SDK will send the auction information. Your Prebid Server team will tell you which value to use. The default is "Custom". | "Custom" |
| customStatusEndpoint | optional | string | init | Use this URL to check the status of Prebid Server. The default status endpoint is the PBS URL appended with '/status'. | `https://prebidserver`<wbr>`.example`<wbr>`.com/custom`<wbr>`/status` |
| shareGeoLocation | optional | boolean | ORTB | If this flag is true AND the app collects the user’s geographical location data, Prebid Mobile will send the user’s lat/long geographical location data to the Prebid Server. The default is false. | `true` |
| locationUpdatesEnabled | optional | boolean | ORTB | If true, the SDK will periodically try to listen for location updates. Default is `false`. | `true` |
| logLevel | optional | enum | SDK control | This property controls the level of logging output to the console. The value can be .error, .info, .debug, .verbose, .warn, .severe, and .info. The default is `.debug`. | `.error` |
| debugLogFileEnabled | optional | boolean | SDK control | If set to true, the output of PrebidMobile's internal logger is written to a text file. Default is `false`. | `true` |
| timeoutMillis | optional | integer | init | (SDK v1.2+) The Prebid SDK timeout. When this number of milliseconds passes, the Prebid SDK returns control to the ad server SDK to fetch an ad without Prebid bids. | 1000 |
| creativeFactoryTimeout | optional | integer | SDK control | Controls how long a banner creative has to load before it is considered a failure. This value is in seconds. The default is 6 seconds. | 10 |
| creativeFactory<wbr>TimeoutPreRenderContent | optional | integer | SDK control | Controls how much time video and interstitial creatives have to load before it is considered a failure. This value is in seconds. The default is 30 seconds. | 60 |
| storedAuctionResponse | optional | string | ORTB | For testing and debugging. Get this value from your Prebid Server team. It signals Prebid Server to respond with a static response from the Prebid Server Database. See [more information on stored auction responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses). | "abc123-sar-test-320x50" |
| pbsDebug | optional | boolean | ORTB | Adds the debug flag (`test`:1) on the outbound http call to the Prebid Server. The `test` flag signals to the Prebid Server to emit the full resolved request and the full Bid Request and Bid Response to and from each bidder. | true |
| shouldAssign<wbr>NativeAssetID | optional | boolean | ORTB | Whether to automatically assign an assetID for a Native ad. Default is `false`. | true |
| useCacheForReporting<wbr>WithRenderingAPI | optional | boolean | ORTB | Indicates whether PBS should cache the bid on the server side. If the value is `true` the Prebid SDK will make the cache request to retrieve the cached asset. Default is `false`. | true |
| useExternal<wbr>ClickthroughBrowser | optional | boolean | SDK control | Controls whether to use PrebidMobile's in-app browser or the Safari App for displaying ad clickthrough content. Default is false. | true |
| impClickbrowserType | optional | enum | ORTB | Indicates the type of browser opened upon clicking the creative in an app. This corresponds to the OpenRTB imp.clickbrowser field. Values are "embedded" and "native". Default is "native". | "native". |
| includeWinners | optional | boolean | ORTB | If `true`, Prebid sdk will add `includewinners` flag inside the targeting object described in [PBS Documentation](prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) . Default is `false`. | `true` |
| includeBidderKeys | optional | boolean | ORTB | If `true`, Prebid sdk will add `includebidderkeys` flag inside the targeting object described in [PBS Documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) . Default is `false`. | `true` |

### Prebid Class Global Methods

#### setCustomPrebidServerUrl()

Defines which Prebid Server to connect to. See the initialization page for [iOS](/prebid-mobile/pbm-api/ios/code-integration-ios.html).

#### addStoredBidResponse()

Stored Bid Responses are for testing and debugging similar to Stored Auction Responses (see the Global Properties above). They signal Prebid Server to respond with a static pre-defined response, except Stored Bid Responses actually exercise the bidder adapter. For more information on how stored bid responses work, refer to the [Prebid Server endpoint doc](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses). Your Prebid Server team will help you determine how best to setup test and debug.

Signature:

```swift
func addStoredBidResponse(bidder: String, responseId: String)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| bidder | required | string | Bidder name as defined by Prebid Server | "bidderA" |
| responseId | required | string | ID used in the Prebid Server Database. Get this value from your Prebid Server team. | "abc123-sbr-test-300x250" |

#### clearStoredBidResponses()

This method clears any stored bid responses. It doesn’t take any parameters.

Signature:

```swift
func clearStoredBidResponses()
```

Parameters: none.

#### addCustomHeader()

This method enables you to customize the HTTP call to Prebid Server.

Signature:

```swift
func addCustomHeader(name: String, value: String)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | required | string | Name of the custom header | "X-mycustomheader" |
| value | required | string | Value for the custom header | "customvalue" |

#### clearCustomHeaders()

Allows you to clear any custom headers you have previously set.

Signature:

```swift
func clearCustomHeaders()
```

Parameters: none

---

## Consent Management Parameters

This section describes how app developers can provide info on user consent to the Prebid SDK and how SDK behaves under different kinds of restrictions.

### iOS App Tracking Transparency

You should follow Apple's Guidelines on implementing [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency). The Prebid SDK automatically sends ATT signals, so no Prebid-specific work is required.

### GDPR / TCF-EU

Prebid Mobile supports [IAB TCF](https://iabeurope.eu/transparency-consent-framework/). For a general overview of Prebid Mobile support for GDPR, see the [Prebid Mobile Guide to Privacy Regulation](/prebid-mobile/prebid-mobile-privacy-regulation.html).

There are two ways to provide information on user consent to the Prebid SDK:

- Explicitly via Prebid SDK API: publishers can provide TCF data via Prebid SDK’s 'Targeting' class.
- Implicitly set through the Consent Management Platform (CMP): Prebid SDK reads the TCF data stored in `UserDefaults`. This is the preferred approach.

{: .alert.alert-warning :}
The Prebid SDK prioritizes values set explicitly through the API over those stored by the CMP.  If the publisher provides TCF data both ways, the values set through the API will be sent to the PBS, and values stored by the CMP will be ignored.

#### Setting TCF-EU Values with the API

Prebid SDK provides three properties to set TCF consent values explicitly, though this method is not preferred. Ideally, the Consent Management Platform will set these values – see the next section.

If you need to set the values directly, here's how to indicate that the user is subject to GDPR:

Swift:

```swift
Targeting.shared.subjectToGDPR = false
Targeting.shared.setSubjectToGDPR(false)
```

To provide the consent string:

Swift:

```swift
Targeting.shared.gdprConsentString = "BOMyQRvOMyQRvABABBAAABAAAAAAEA"
```

To set the purpose consent:

Swift:

```swift
Targeting.shared.purposeConsents = "100000000000000000000000"
```

See also the API references for getSubjectToGDPR(), getDeviceAccessConsent(), getDeviceAccessConsentObjc, getPurposeConsent(), isAllowedAccessDeviceData().

#### Getting Consent Values from the CMP

Prebid SDK reads the values for the following keys from the `UserDefaults` object:

- **IABTCF_gdprApplies** - indicates whether the user is subject to GDPR
- **IABTCF_TCString** - full encoded TC string
- **IABTCF_PurposeConsents** - indicates the consent status for the purpose.

For more detailed information, read the [In-App Details section](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#in-app-details) of the TCF.

{: .alert.alert-warning :}
Publishers shouldn’t explicitly assign values for these keys unless they have a custom-developed Consent Management Platform (CMP). If the publisher wants to provide this data to the Prebid SDK, they should use the explicit APIs described above.

Here's how Prebid SDK processes CMP values:

- It reads CMP values during the initialization and on each bid request, so the latest value is always used.
- It doesn’t verify or validate CMP values in any way

### CCPA / US Privacy

The California Consumer Protection Act prompted the IAB to implement the "US Privacy" protocol.

Prebid SDK reads and sends USP/CCPA signals according to the [US Privacy User Signal Mechanism](https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/USP%20API.md) and [OpenRTB extension](https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/7f4f1b2931cca03bd4d91373bbf440071823f257/CCPA/OpenRTB%20Extension%20for%20USPrivacy.md).

Prebid SDK reads the value for the `IABUSPrivacy_String` key from the `UserDefaults` and sends it in the `regs.ext.us_privacy` object of the OpenRTB request.

### COPPA

The Children's Online Privacy Protection Act of the United States is a way for content producers to declare that their content is aimed at children, which invokes additional privacy protections.

Prebid SDK follows the OpenRTB 2.6 spec and provides an API to indicate whether the current content falls under COPPA regulation. Publishers can set the respective flag using the targeting API:

Swift:

```swift
Targeting.shared.subjectToCOPPA = true
```

Prebid SDK passes this flag in the `regs.coppa` object of the bid requests.

If you're app developer setting this COPPA flag, we recommend you also:

- set the `shareGeoLocation` property to false
- avoid passing any sensitive first party data

### Global Privacy Platform (GPP)

A Consent Management Platform (CMP) utilizing [IAB's Global Privacy Protocol](https://iabtechlab.com/gpp/) is a comprehensive way for apps to manage user consent across multiple regulatory environments.

Since version 2.0.6, Prebid SDK reads and sends GPP signals:

- The GPP string is read from IABGPP_HDR_GppString in `UserDefaults`. It is sent to Prebid Server on `regs.gpp`.
- The GPP Section ID is likewise read from IABGPP_GppSID. It is sent to Prebid Server on `regs.gpp_sid`.

---

## Open Measurement SDK (OMSDK) API

{: .alert.alert-info :}
Defining OMSDK values is only relevant for the 'Bidding-Only' Prebid integration with GAM. In this case the creative is rendered by GMA SDK and publishers should provide OMID description in the bid request. If you use Prebid SDK as a rendering engine you shouldn’t use these properties -- it sends them automaticaly according to the current OMID setup.

OMSDK is designed to facilitate 3rd party viewability and verification measurement for ads served in mobile app enviroments. Prebid SDK will provide the signaling component to Bid Adapters by way of Prebid Server, indicating that the impression is eligible for OMSDK support. Prebid SDK does not currently integrate with OMSDK itself, instead it will rely on a publisher ad server to render viewability and verification measurement code.

There are three components to signaling support for OMSDK:

- Partner Name
- Partner Version
- Banner API code

### Partner Name
{:.no_toc}

The [IAB OMSDK compliant partner name](https://complianceomsdkapi.iabtechlab.com/compliance/latest) responsible for integrating with the OMSDK spec.

```swift
Targeting.shared.omidPartnerName = "Google"
```

### Partner Version
{:.no_toc}

The OMSDK version number for the integration partner.

```swift
Targeting.shared.omidPartnerVersion = "1.0"
```

### Banner API Code

The following code lets bidders know that Open Measurement is being used for this adunit:

```swift
let parameters = BannerParameters()
parameters.api = [Signals.Api.OMID_1]
```

This translates in OpenRTB to `imp[].banner.api=7`.

---

## First Party Data

First Party Data (FPD) is information about the app or user known by the developer that may be of interest to advertisers.

- User FPD includes details about a specific user like "frequent user" or "job title". This data if often subject to regulatory control, so needs to be specified as user-specific data. Note that some attributes like health status are limited in some regions. App developers are strongly advised to speak with their legal counsel before passing User FPD.
- Inventory or Contextual FPD includes details about the particular part of the app where the ad will displayed like "sports/basketball" or "editor 5-star rating".

### User FPD

Prebid SDK provides a number of properties in the [Targeting class](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#targeting-class-properties-and-methods) for setting user-oriented First Party Data.

```swift
func setLatitude(latitude: Double, longitude: Double)

func addUserData(key: String, value: String)

func updateUserData(key: String, value: Set<String>)

func removeUserData(forKey: String)

func clearUserData()

func addUserKeyword(_ newElement: String)

func addUserKeywords(_ newElements: Set<String>)

func removeUserKeyword(_ element: String)

func clearUserKeywords()

func getUserKeywords()
```

Example:

```swift
Targeting.shared.addUserData(key: "globalUserDataKey1", value: "globalUserDataValue1")
```

{: .alert.alert-info :}
Note: The 'UserData' functions end up putting data into the OpenRTB user.ext.data object while the 'UserKeywords' functions
put data into user.keywords.

See also the API reference for setYearOfBirth(), getYearOfBirth() and clearYearOfBirth().

### Inventory FPD

Prebid SDK provides a number of methods and properties in the [Targeting class](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#targeting-class-properties-and-methods) for setting content-oriented First Party Data.

```swift
func addAppExtData(key: String, value: String)

func updateAppExtData(key: String, value: Set<String>)

func removeAppExtData(for key: String)

func clearAppExtData()

func getAppExtData()

func addAppKeyword(_ newElement: String)

func addAppKeywords(_ newElements: Set<String>)

func removeAppKeyword(_ element: String)

func clearAppKeywords()

func getAppKeywords()
```

Example:

```swift
Targeting.shared.addAppExtData((key: "globalContextDataKey1", value: "globalContextDataValue1")
```

### Controlling Bidder Access to FPD

Prebid Server will let you control which bidders are allowed access to First Party Data. Prebid SDK collects this an Access Control List with the following methods:

```swift
func addBidderToAccessControlList(_ bidderName: String)

func removeBidderFromAccessControlList(_ bidderName: String)

func clearAccessControlList()
```

Example:

```swift
Targeting.shared.addBidderToAccessControlList(Prebid.bidderNameRubiconProject)
```

---

## User Identity

Mobile apps traditionally rely on IDFA-type device IDs for advertising, but there are other User ID systems available to app developers and more will be made available in the future. Prebid SDK supports two ways to maintain User ID details:

- A global property - in this approach, the app developer sets the IDs while initializing the Prebid SDK. This data persists only for the user session.
- Local storage - the developer can choose to store the IDs persistently in local storage and Prebid SDK will utilize them on each bid request.

Any identity vendor's details in local storage will be sent to Prebid Server unadulterated. If user IDs are set both in the property and entered into local storage, the property data will prevail.

{: .alert.alert-info :}
Note that the phrase "EID" stands for "Extended IDs" in [OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md), but for historic reasons, Prebid SDK methods use the word "external" rather than "extended". Please consider the phrase "external ID" a synonym for "extended ID".

### Storing IDs in a Property

Prebid SDK supports passing an array of EIDs at auction time in the Prebid global field `externalUserIdArray`. Setting the `externalUserIdArray` object once per user session is sufficient unless one of the values changes.

```swift
public var externalUserIdArray = [ExternalUserId]()
```

**Examples**

```swift
// User Id from External Third Party Sources
var externalUserIdArray = [ExternalUserId]()

externalUserIdArray.append(ExternalUserId(source: "adserver.org", identifier: "111111111111", ext: ["rtiPartner" : "TDID"]))
externalUserIdArray.append(ExternalUserId(source: "netid.de", identifier: "999888777"))
externalUserIdArray.append(ExternalUserId(source: "criteo.com", identifier: "_fl7bV96WjZsbiUyQnJlQ3g4ckh5a1N"))
externalUserIdArray.append(ExternalUserId(source: "liveramp.com", identifier: "AjfowMv4ZHZQJFM8TpiUnYEyA81Vdgg"))
externalUserIdArray.append(ExternalUserId(source: "sharedid.org", identifier: "111111111111", atype: 1))

Prebid.shared.externalUserIdArray = externalUserIdArray
```

```kotlin
setExternalUserIds(List<ExternalUserId> externalUserIds)
```

### Storing IDs in Local Storage

Prebid SDK provides a local storage interface to set, retrieve, or update an array of user IDs with associated identity vendor details. It will then retrieve and pass these User IDs to Prebid Server on each auction, even on the next user session.

Prebid SDK Provides several functions to handle User ID details within the local storage:

```swift
public func storeExternalUserId(_ externalUserId: ExternalUserId)

public func fetchStoredExternalUserIds() -> [ExternalUserId]?

public func fetchStoredExternalUserId(_ source : String) -> ExternalUserId?

public func removeStoredExternalUserId(_ source : String)

public func removeStoredExternalUserIds()
```

**Examples**

```swift
//Set External User ID
Targeting.shared.storeExternalUserId(ExternalUserId(source: "sharedid.org", identifier: "111111111111", atype: 1))

//Get External User ID
let externalUserIdSharedId = Targeting.shared.fetchStoredExternalUserId("sharedid.org")

//Get All External User IDs
let externalUserIdsArray = Targeting.shared.fetchStoredExternalUserIds()

//Remove External UserID
Targeting.shared.removeStoredExternalUserId("sharedid.org")

//Remove All External UserID
Targeting.shared.removeStoredExternalUserIds()
```

---

## Targeting Class Properties and Methods

There are several other fields app developers may want to set to give bidders additional information about the auction.

### Targeting Class Properties

Note that several of the properties noted here are also mentioned above for other use cases, e.g. `subjectToCOPPA`. All properties of the 'Targeting' class are listed here.

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Platform | Description | Example |
| --- | --- | --- | --- | --- | --- |
| storeURL | recommended | string | both | App store URL for an installed app; for Inventory Quality Guidelines 2.1 compliance. Translates to OpenRTB app.storeurl | `https://apps.apple.com/app/id111111111` |
| contentUrl | recommended | string | both | This is the deep-link URL for the app screen that is displaying the ad. This can be an iOS universal link. | |
| publisherName | recommended | string | both | OpenRTB app.publisher.name | "Example, Co." |
| itunesID | recommended | string | both | Translates to OpenRTB app.bundle | "11111111" |
| coppa | optional | integer | objC | Defines whether this content is meant for children. 0=false, 1=true. Defaults to false. | 1 |
| subjectToCOPPA | optional | boolean | swift | Defines whether this content is meant for children. Defaults to false. | `true` |
| sourceapp | optional | string | both | Translates to OpenRTB app.name | "Example App" |
| domain | optional | string | both | Translates to OpenRTB app.domain | "example.com" |
| omidPartnerName | optional | string | both | The [IAB OMSDK compliant partner name](https://complianceomsdkapi.iabtechlab.com/compliance/latest) responsible for integrating with the OMSDK spec. | "Google" |
| omidPartnerVersion | optional | string | both | The OMSDK version number for the integration partner. | "1.0" |
| userGender | optional | enum | both | "M" = male, "F" = female, "O" = known to be other (i.e., omitted is unknown) | "F" |
| userExt | optional | array of key-value pairs | both | This is a dictionary of key-value pairs that forms the user.ext object. Prebid requires user-first party data in user.ext.data, so this should be a dictionary that contains a 'data' key whose value is another dictionary. | { data: { key1: val1, key2: val2 }}|
| subjectToGDPR | discouraged | boolean | ? | Defines whether this request is in-scope for European privacy regulations. See [above](/prebid-mobile/pbm-api/ios/pbm-targeting-ios#gdpr--tcf-eu) for more information. | `true` |
| gdprConsentString | discouraged | string | both | See the [GDPR settings](/prebid-mobile/pbm-api/ios/pbm-targeting-ios#gdpr--tcf-eu) section above. | |
| purposeConsents | discouraged | string | both | See the [GDPR settings](/prebid-mobile/pbm-api/ios/pbm-targeting-ios#gdpr--tcf-eu) section above. | |

### Targeting Class Methods

All of the targeting class methods have been mentioned above in the context of First Party Data and are linked to
the API reference.

---

## Arbitrary OpenRTB

(requires SDK v2.2.1)

While there are many specific methods for adding data to the request detailed in
this document, OpenRTB is big and it moves quickly. To cover scenarios not already covered by an existing method,
Prebid SDK Provides a way for app publishers to customize most ORTB fields in the partial bid request that Prebid Mobile sends to the Prebid Server. The customization comes in the form of the ortbConfig parameter that takes a JSON String as input. The JSON string must follow the [OpenRTB structure](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md) -- it will be merged with the current JSON of the bid request. If you choose to input extra data using the ortbConfig parameter, please extensively test your requests sent to Prebid Server.

There are certain protected fields such as regs, device, geo, ext.gdpr, ext.us_privacy, and ext.consent which cannot be changed.

```swift
//global invocation
adUnitConfig.setOrtbConfig("{\"ext\":{\"prebid\":{\"debug\":1,\"trace\":\"verbose\"}}}")
```

```swift
//ad unit / impression-level
adUnit.setOrtbConfig("{\"ext\":{\"gpid\":\"abc123"}}\")
```

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
