---
layout: page_v2
title: Global Parameters - Android
description: Prebid Mobile API global parameters for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid SDK Global Parameters - Android
{:.no_toc}

- TOC
{:toc}

## How to Read this Guide

This page documents various global parameters you can set on the Prebid SDK for Android. It describes the properties and methods of the Prebid SDK that allow you to supply important parameters to the header bidding auction.

Specifically, app developers should consider each of these general sections:

- Prebid SDK class parameters: these cover behavior of the SDK. Some values are required like a Prebid Server.
- Privacy / Consent Management parameters: we recommend developing a clear plan for user privacy with your legal counsel.
- First Party Data: data about the app or user that helps bidders choose an appropriate ad.

{: .alert.alert-info :}
Note that the SDK's Targeting class uses the term "Targeting" loosely. It's mostly about
passing data to bidders that would help improve auction results. But there are also fields and methods
in the Targeting class that convey privacy data, Open Measurement info, and other data used beyond actual
bid targeting.

## Prebid Global Properties and Methods

The `Prebid` class is a singleton that enables you to apply certain global settings.

### Prebid Class Global Properties

All of these properties of the Prebid class can be set on the `shared` object like this:

```kotlin
Prebid.shared.sendMraidSupportParams=true
```

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Purpose | Description | Example |
| --- | --- | --- | --- | --- |
| isCoppaEnabled | optional | boolean | ORTB | Set this to true if this app is aimed at children. It sets the ORTB `regs.coppa` flag. Default is false. | `true` |
| useExternalBrowser | optional | boolean | behavior | If true, clicking on the ad will open your default browser instead of showing within the app's webview. Defaults to `false`. | `true` |
| sendMraidSupportParams | optional | boolean | ORTB | If `true`, the SDK sends imp[].banner.api=[3,5], indicating support for MRAID. Defaults to `true`. | `false` |

### Prebid Class Global Methods

#### setPrebidServerAccountId()

Your Prebid Server team will tell you whether this is required or not and if so, the value. See the initialization page for [Android](/prebid-mobile/pbm-api/android/code-integration-android.html).

#### setPrebidServerHost()

This is where the Prebid SDK will send the auction information.

Signature:

```kotlin
func setPrebidServerHost(host: String)
```

Parameters: 

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| host | required | object | Host.APPNEXUS, Host.RUBICON, Host.createCustomHost<wbr>(PREBID_SERVER<wbr>_AUCTION_ENDPOINT) | Host.createCustomHost<wbr>(`https://prebidserver`<wbr>`.example.com`<wbr>`/openrtb2/auction`) |

Examples:

```kotlin
PrebidMobile.setPrebidServerHost(Host.APPNEXUS)
PrebidMobile.setPrebidServerHost(Host.RUBICON)
PrebidMobile.setPrebidServerHost(Host.createCustomHost("https://prebidserver.example.com/openrtb2/auction"))
```

#### setCustomStatusEndpoint()

Signature:

```kotlin
    public static void setCustomStatusEndpoint(String url) {
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| url | required | string | Use this URL to check the status of Prebid Server. The default status endpoint is the PBS URL appended with '/status'. | `https://prebidserver`<wbr>`.example`<wbr>`.com/custom`<wbr>`/status` |

#### setTimeoutMillis()

The Prebid SDK timeout. When this number of milliseconds passes, the Prebid SDK returns control to the ad server SDK to fetch an ad without Prebid bids. See the initialization page for [Android](/prebid-mobile/pbm-api/android/code-integration-android.html).

#### setShareGeoLocation()

If this flag is true AND the app collects the user’s geographical location data, Prebid Mobile will send the user’s lat/long geographical location data to the Prebid Server. The default is false.

#### setIncludeWinnersFlag()

If `true`, Prebid sdk will add the `includewinners` flag inside the targeting object described in [PBS Documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) . This is needed if you've set up line items in an ad server in "Send Top Bid" mode, as it's what creates the key value pairs like `hb_pb`. 

Signature:

```kotlin
    public static void setIncludeWinnersFlag(boolean includeWinners)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| includeWinners | required | boolean | If `true`, Prebid sdk will add `includewinners` flag inside the targeting object described in [PBS Documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) . Default is `false`. | `true` |

#### setIncludeBidderKeysFlag()

If `true`, Prebid sdk will add the `includebidderkeys` flag inside the targeting object described in [PBS Documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) . This is needed if you've set up line items in an ad server in "Send All Bids" mode, as it's what creates the key value pairs like `hb_pb_bidderA`. 

Signature:

```kotlin
    public static boolean setIncludeBidderKeysFlag(boolean includeBidderKeys) {
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| includeBidderKeys | required | boolean | If `true`, Prebid sdk will add `includewinners` flag inside the targeting object described in [PBS Documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) . Default is `false`. | `true` |

#### setStoredAuctionResponse()

For testing and debugging. Get this value from your Prebid Server team. It signals Prebid Server to respond with a static response from the Prebid Server Database. 
See [more information on stored auction responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses).

Signature:

```kotlin
public static void setStoredAuctionResponse(@Nullable String storedAuctionResponse)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| storedAuctionResponse | required | string | Key as defined by Prebid Server. Get this value from your Prebid Server team. | "abc123-sar-test-320x50" |

#### addStoredBidResponse()

Stored Bid Responses are for testing and debugging similar to Stored Auction Responses (see the Global Properties above). They signal Prebid Server to respond with a static pre-defined response, except Stored Bid Responses actually exercise the bidder adapter. For more information on how stored bid responses work, refer to the [Prebid Server endpoint doc](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses). Your Prebid Server team will help you determine how best to setup test and debug.

Signature:

```kotlin
void addStoredBidResponse(String bidder, String responseId)
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

```kotlin
void clearStoredBidResponses()
```

Parameters: none.

#### setLogLevel

Controls the level of logging output to the console.

Signature:

```kotlin
    public static void setLogLevel(LogLevel logLevel)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| logLevel | required | enum | The value can be NONE, VERBOSE, DEBUG, INFO, WARN, ERROR, ASSERT. The default is `NONE`. | `DEBUG` |

#### setPbsDebug()

Adds the debug flag (`test`:1) on the outbound http call to the Prebid Server. The `test` flag signals to the Prebid Server to emit the full resolved request and the full Bid Request and Bid Response to and from each bidder.

Signature:

```kotlin
public static void setPbsDebug(boolean pbsDebug)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| pbsDebug | required | boolean | Turn on/off debug mode. Defaults to `false`. | `true` |

#### assignNativeAssetID()

Whether to automatically assign an assetID for a Native ad. Default is `false`.

Signature:

```kotlin
    public static void assignNativeAssetID(boolean assignNativeAssetID) {
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| assignNativeAssetID | required | boolean | Whether to automatically assign an assetID for a Native ad. Defaults to `false`. | `true` |

#### setCreativeFactoryTimeout()

Controls how long a banner creative has to load before it is considered a failure.

Signature:

```kotlin
    public static void setCreativeFactoryTimeout(int creativeFactoryTimeout)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| creativeFactoryTimeout | required | integer | Controls how long a banner creative has to load before it is considered a failure. This value is in milliseconds. The default is 6,000 milliseconds. | 10000 |

#### setCreativeFactoryTimeoutPreRenderContent()

Controls how much time video and interstitial creatives have to load before it is considered a failure.

Signature:

```kotlin
    public static void setCreativeFactoryTimeoutPreRenderContent(int creativeFactoryTimeoutPreRenderContent)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| creativeFactoryTimeoutPreRenderContent | required | integer | Controls how much time video and interstitial creatives have to load before it is considered a failure. This value is in milliseconds. The default is 30,000 milliseconds. | 60000 |

#### setCustomHeaders()

This method enables you to customize the HTTP call to Prebid Server.

Signature:

```kotlin
    public static void setCustomHeaders(@Nullable HashMap<String, String> customHeaders)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| customHeaders | required | hashmap | Hashmap of custom headers | "X-mycustomheader: customvalue" |

#### setCustomLogger()

Define a custom PrebidLogger object.

Signature:

```kotlin
    public static void setCustomLogger(@NonNull PrebidLogger logger)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| logger | required | object | The PrebidLogger interface enables the app developer to define where the Prebid SDK should send log-level details about the header bidding transaction. | |

#### setEventDelegate()

Sets an event delegate to handle all auction requests and responses. It allows to collect some statistical data. 
Note that the SDK stores this callback as a weak reference so you need to store a reference to it. 

Signature:

```java
public static void setEventDelegate(@Nullable PrebidEventDelegate eventDelegate)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| eventDelegate | required | PrebidEventDelegate | The callback for handling all requests and responses. This interface takes request and response as the JSONObject types. | `{ request, response -> ... }` |

---

## Consent Management Parameters

This section describes how app developers can provide info on user consent to the Prebid SDK and how SDK behaves under different kinds of restrictions.

### GDPR / TCF-EU

Prebid Mobile supports [IAB TCF](https://iabeurope.eu/transparency-consent-framework/). For a general overview of Prebid Mobile support for GDPR, see the [Prebid Mobile Guide to Privacy Regulation](/prebid-mobile/prebid-mobile-privacy-regulation.html).

There are two ways to provide information on user consent to the Prebid SDK:

- Explicitly via Prebid SDK API: publishers can provide TCF data via Prebid SDK’s 'Targeting' class.
- Implicitly set through the Consent Management Platform (CMP): Prebid SDK reads the TCF data stored in the `SharedPreferences`. This is the preferred approach.

{: .alert.alert-warning :}
The Prebid SDK prioritizes values set explicitly through the API over those stored by the CMP.  If the publisher provides TCF data both ways, the values set through the API will be sent to the PBS, and values stored by the CMP will be ignored. 

#### Setting TCF-EU Values with the API

Prebid SDK provides three properties to set TCF consent values explicitly, though this method is not preferred. Ideally, the Consent Management Platform will set these values – see the next section.

If you need to set the values directly, here's how to indicate that the user is subject to GDPR:

```kotlin
TargetingParams.setSubjectToGDPR(true)
```

To provide the consent string:

```kotlin
TargetingParams.setGDPRConsentString("BOMyQRvOMyQRvABABBAAABAAAAAAEA")
```

To set the purpose consent: 

```kotlin
TargetingParams.setPurposeConsents("100000000000000000000000")
```

Related functions: isSubjectToGDPR(), getGDPRConsentString(), getPurposeConsent(int index), getPurposeConsents(), getDeviceAccessConsent()

#### Getting Consent Values from the CMP

Prebid SDK reads the values for the following keys from the `SharedPreferences` object:

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

Prebid SDK reads the value for the `IABUSPrivacy_String` key from `SharedPreferences` and sends it in the `regs.ext.us_privacy` object of the OpenRTB request.

### COPPA

The Children's Online Privacy Protection Act of the United States is a way for content producers to declare that their content is aimed at children, which invokes additional privacy protections.

Prebid SDK follows the OpenRTB 2.6 spec and provides an API to indicate whether the current content falls under COPPA regulation. Publishers can set the respective flag using the targeting API: 

```kotlin
TargetingParams.setSubjectToCOPPA(true)
```

Prebid SDK passes this flag in the `regs.coppa` object of the bid requests.

If you're app developer setting this COPPA flag, we recommend you also:

- set the `shareGeoLocation` property to false
- avoid passing any sensitive first party data

### Global Privacy Platform (GPP)

A Consent Management Platform (CMP) utilizing [IAB's Global Privacy Protocol](https://iabtechlab.com/gpp/) is a comprehensive way for apps to manage user consent across multiple regulatory environments.

Since version 2.0.6, Prebid SDK reads and sends GPP signals:

- The GPP string is read from IABGPP_HDR_GppString in `SharedPreferences`. It is sent to Prebid Server on `regs.gpp`.
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

The [IAB OMSDK compliant partner name](https://complianceomsdkapi.iabtechlab.com/compliance/latest) responsible for integrating with the OMSDK spec.

```kotlin
TargetingParams.setOmidPartnerName("Google")
```

### Partner Version

The OMSDK version number for the integration partner.

```kotlin
TargetingParams.setOmidPartnerVersion("1.0");
```

### Banner API Code

The following code lets bidders know that Open Measurement is being used for this adunit:

```swift
let parameters = BannerParameters()
parameters.api = [Signals.Api.OMID_1]
```

---

## First Party Data

First Party Data (FPD) is information about the app or user known by the developer that may be of interest to advertisers. 

- User FPD includes details about a specific user like "frequent user" or "job title". This data if often subject to regulatory control, so needs to be specified as user-specific data. Note that some attributes like health status are limited in some regions. App developers are strongly advised to speak with their legal counsel before passing User FPD.
- Inventory FPD includes details about the particular part of the app where the ad will displayed like "sports/basketball" or "editor 5-star rating".

### User FPD

Prebid SDK provides a number of properties in the [Targeting class](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#targeting-class-properties-and-
methods) for setting user-oriented First Party Data.

```kotlin
void addUserData(String key, String value)

void updateUserData( String key, Set<String> value)

void removeUserData(String key)

void clearUserData()

Map<String, Set<String>> getUserDataDictionary() {

void addUserKeywords(Set<String> keywords) {

void removeUserKeyword(String keyword) {

void clearUserKeywords() {

String getUserKeywords() {

Set<String> getUserKeywordsSet() {
```

Example:

```kotlin
TargetingParams.addUserData("globalUserDataKey1", "globalUserDataValue1")
```

{: .alert.alert-info :}
Note: The 'UserData' functions end up putting data into the OpenRTB user.ext.data object while the 'UserKeywords' functions
put data into user.keywords.

### Inventory FPD

Prebid SDK provides a number of methods in the [Targeting class](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#targeting-class-properties-and-methods) for setting content-oriented First Party Data.

```kotlin
void addExtData(String key, String value)

void updateExtData(String key, Set<String> value)

void removeExtData(String key)

Map<String, Set<String>> getExtDataDictionary()

void addExtKeyword(String keyword)

void addExtKeywords(Set<String> keywords)

void removeExtKeyword(String keyword)

void clearExtKeywords()

Set<String> getExtKeywordsSet()
```

Example:

```kotlin
Targeting.addExtData("globalContextDataKey1", "globalContextDataValue1")
```

### Controlling Bidder Access to FPD

Prebid Server will let you control which bidders are allowed access to First Party Data. Prebid SDK collects this an Access Control List with the following methods:

```kotlin
void addBidderToAccessControlList(String bidderName)

void removeBidderFromAccessControlList(String bidderName)

void clearAccessControlList()

Set<String> getAccessControlList()
```

Example:

```kotlin
Targeting.addBidderToAccessControlList("bidderA")
```

---

## User Identity

Mobile apps traditionally rely on IDFA-type device IDs for advertising, but there are other User ID systems available to app developers and more will be made available in the future. Prebid SDK supports two ways to maintain Extended User ID (EID) details:

- A global property - in this approach, the app developer sets the IDs while initializing the Prebid SDK. This data persists only for the user session.
- Local storage - the developer can choose to store the IDs persistently in local storage and Prebid SDK will utilize them on each bid request.

Any identity vendor's details in local storage will be sent to Prebid Server unadulterated. If user IDs are set both in the property and entered into local storage, the property data will prevail.

{: .alert.alert-info :}
Note that the phrase "EID" stands for "Extended IDs" in [OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md), but for historic reasons, Prebid SDK methods use the word "external" rather than "extended". Please consider the phrase "external ID" a synonym for "extended ID".

{% capture warning_note %}  
Note that starting from `2.4.0`, the Prebid SDK no longer saves EIDs to permanent storage. As a result, all EIDs will be cleared after the application restarts.

{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

### Prebid SDK API Access

Prebid SDK supports passing an array of EIDs at auction time with the function `TargetingParams.setExternalUserIds()`, which is globally scoped. It is sufficient to set the `userIds` object once per user session, as these values would be used in all consecutive ad auctions in the same session.

```java
public static void setExternalUserIds(@Nullable List<ExternalUserId> userIds)
```

Example:

```java
ArrayList<ExternalUserId> userIds = new ArrayList<>();

ExternalUserId.UniqueId uniqueId1 = new ExternalUserId.UniqueId("111111111111", 20);
uniqueId1.setExt(new HashMap<String, Object>() {% raw %}{{
    put("rtiPartner", "TDID");
}});{% endraw %}
ExternalUserId.UniqueId uniqueId2 = new ExternalUserId.UniqueId("_fl7bV96WjZsbiUyQnJlQ3g4ckh5a1N", 777);
ExternalUserId fullUserId = new ExternalUserId("adserver.org", List.of(uniqueId1, uniqueId2));
userIds.add(fullUserId);

TargetingParams.setExternalUserIds(userIds);
```

### Shared ID

The Shared ID is a randomly generated first-party identifier managed by Prebid. It remains the same throughout the current app session unless reset. If local storage access is permitted, the same ID may persist across multiple app sessions indefinitely. However, Shared ID values do not remain consistent across different apps on the same device.

The SDK will include it in the `user.ext.eids` array during auction request if the publisher explicitly permits it:

```kotlin
TargetingParams.setSendSharedId(true);
```

To remove the existing Shared ID value from local storage, the SDK offers the following method: 

```kotlin
TargetingParams.resetSharedId()
```

Once cleared, the next time `TargetingParams.getSharedId()` is called, a new, randomly generated Shared ID value will be created and returned.

### IDs that Require Additional SDKs

Certain identity vendors require an external dependency to generate user identity and then to pass it via Prebid SDK. Please note that these are references to a 3rd party code and Prebid has not inspected it. Links to the documentations of those references will be listed in this section.

#### Unified ID 2.0 (UID2)

UID2 provides a [native library](https://unifiedid.com/docs/guides/integration-mobile-client-side#optional-uid2-prebid-mobile-sdk-integration) for automatically updating latest UID2 
token stored inside [UID2 SDK for Android](https://unifiedid.com/docs/sdks/sdk-ref-android) into Prebid's external user's ID list. 

App developers are not required to manually call ```PrebidMobile.setExternalUserId``` method as the native library will do so automatically.

Note: 
 
- [Github repo](https://github.com/IABTechLab/uid2-android-sdk)
- [UID2 Android Integration Documentation](https://unifiedid.com/docs/guides/integration-mobile-overview)
- [UID2+Prebid Integration Instruction](https://unifiedid.com/docs/guides/integration-mobile-client-side#optional-uid2-prebid-mobile-sdk-integration)

## Targeting Class Methods

There are several other fields app developers may want to set to give bidders additional information about the auction. Prebid recommends that app developers consider setting the following values for best auction performance:

- setBundleName()
- setPublisherName()
- setStoreUrl()

### setBundleName()

Define the OpenRTB app.bundle field.

Signature:

```kotlin
void setBundleName(String bundleName) {
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| bundleName | required | string | App bundle name. Sets ORTB `app.bundle`. | "com.example" |

Related function: getBundleName().

### setDomain()

Define the OpenRTB app.domain field.

Signature:

```kotlin
void setDomain(String domain)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| domain | required | string | Domain. Sets `app.domain`. | "example.com" |

Related function: getDomain().

### setPublisherName()

Define the OpenRTB app.publisher.name field.

Signature:

```kotlin
void setPublisherName(String publisherName)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| publisherName | required | string | Publisher name. Sets `app.publisher.name`. | "publisher 1" |

Related function: getPublisherName().

### setStoreUrl()

Define the OpenRTB app.storeurl field.

Signature:

```kotlin
void setStoreUrl(String storeUrl)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| storeUrl | required | string | App store URL. Sets `app.storeurl` | `https://play.google.com/store/apps/details?id=1234` |

Related function: getStoreUrl().

### setOmidPartnerName()

Define the OpenRTB source.ext.omidpn field.

Signature:

```kotlin
setOmidPartnerName(@Nullable String omidPartnerName)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| omidPartnerName | required | string | Open Measurement Partner name. | "MyIntegrationPartner" |

Related function: getOmidPartnerName().

### setOmidPartnerVersion()

Define the OpenRTB source.ext.omidpv field.

Signature:

```kotlin
setOmidPartnerVersion(@Nullable String omidPartnerVersion)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| omidPartnerVerson | required | string | Open Measurement Partner version | "7.1" |

Related function: getOmidPartnerVersion().

### setUserLatLng()

Sets the device location for buyer targeting. It's incumbent upon to the app developer to make sure they have permission to read this data. Prebid Server may remove it under some privacy scenarios.

Signature:

```kotlin
void setUserLatLng( Float latitude, Float longitude)
```

Parameters:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| latitude | required | double | The device latitude. | 40.71 |
| longitude | required | double | The device longitude. | 74.01 |

---

## Arbitrary OpenRTB

(requires SDK v2.3.1)

Prebid SDK allows the customization of the OpenRTB request on the global level using `setGlobalOrtbConfig()` function: 

``` kotlin
TargetingParams.setGlobalOrtbConfig(
        "{" +
                " \"displaymanager\": \"Google\"," +
                " \"displaymanagerver\": \"" + MobileAds.getVersion() + "\"," +
                " \"ext\": {" +
                "   \"myext\": {" +
                "    \"test\": 1" +
                "   }" +
                " }" +
        "}"
);
```
 
The parameter passed to `TargetingParams.setGlobalOrtbConfig()` will be merged into all SDK's bid requests on the global level. For instance, the above example will add the `$.ext.myext.test` parameter and change the `displaymanager` and `displaymanagerver` parameters in each request. 

To invalidate the global config, just set the empty string: 

``` kotlin
TargetingParams.setGlobalOrtbConfig("")
```

The `TargetingParams.setGlobalOrtbConfig()` also allows to **add** impression objects to the request. All objects in the `$.imp[]` array will be added to the request. Note that Ad Unit's `imp` object won't be changed using Global Config. To change the `imp` config, use the `setImpORTBConfig()` method of a particular Ad Unit. See the Ad Unit documentation for the details. 

Pay attention that there are certain protected fields such as `regs`, `device`, `geo`, `ext.gdpr`, `ext.us_privacy`, and `ext.consent` which cannot be changed using the `setGlobalOrtbConfig()` method.

- App and User first party data should use the [functions defined for those purposes](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#first-party-data)
- See the [Prebid Server auction endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#prebid-server-ortb2-extension-summary) reference for more information about how it will process incoming fields.

### Deprecated 
{:.no_toc}

The Prebid Mobile SDK v2.2.1 contains the deprecated method to set the impression level RTB config: 

``` swift
//ad unit / impression-level
adUnit.setOrtbConfig("{\"ext\":{\"gpid\":\"abc123"}}\")
```

This method has implementation issues and was deprecated in v2.4.0. If you use this method, we strongly recommend migrating to the new `setImpORTBConfig()` method since this one will be removed entirely in SDK version 3.0.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
