---
layout: page_v2
title: Global Targeting Parameters - Android
description: Prebid Mobile API global targeting parameters for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Global Targeting Parameters
{:.no_toc}

Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

* TOC
{:toc}

## Global GDPR Targeting

Prebid Mobile supports the [IAB GDPR recommendations](https://www.iab.com/topics/consumer-privacy/gdpr/). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice](/prebid-mobile/prebid-mobile-privacy-regulation.html)

Prebid SDK doesn't modify values for IAB-defined keys in the `SharedPreferences`. Instead, SDK will keep the provided value in the in-memory property.

The values provided via targeting API will be included in the bid request according to the `TCF v2` framework.

{% capture warning_note %}  

Since the SDK API has priority over CMP values, using the API blocks the CMP signals. Use a single way to provide the TCF signals. 

If you need to use an API way, ensure that all the following properties are set in the app code. 

If you need to use a CMP way, ensure that you don't set any of the following API properties. 


{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}


### Subject To GPDR
{:.no_toc}

Enable (true) or disable (false) the ability to provide consent.

```
TargetingParams.isSubjectToGDPR()
TargetingParams.setSubjectToGDPR(true)
```

### GDPR Consent String
{:.no_toc}

```
val consent = TargetingParams.getGDPRConsentString();
TargetingParams.setGDPRConsentString(string);
```

### Purpose Consent
{:.no_toc}

```
val consent = TargetingParams.getPurposeConsents()
TargetingParams.setPurposeConsents(string)
```

## COPPA

Prebid supports passing of the Child Online Privacy Prection (COPPA) signal to Prebid Server (PBS) for all COPPA traffic. When PBS receives the COPPA flag we strip out all personal data from the requeset. For a general overview of COPPA, see the [FTC's guidlines](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule).

Example:

```
TargetingParams.setSubjectToCOPPA(true);
```


## Parameters

The tables below list the methods and properties that the Prebid Rendering API uses for customization.
The more data about the user, app, and device that can be provided the more chances to win an impression.

It is advised that you strictly follow the recommendations in the tables below. Any field marked with an ❗is required and recommended. 

1. [Targeting Params](#targeting)
2. [SDK Settings](#prebidrenderingsettings)

### Targeting

You can use `Targeting` to pass ad call request parameters.

{: .table .table-bordered .table-striped }

| **Parameter**              | **Method**                | Description                                                  | Required?|
| -------------------------- | ------------------------- | ------------------------------------------------------------ | -------- |
| User Age                        | `setUserAge`              | Age of the user in years. For example: `35`   | ❗ Highly Recommended  |
| Buyer Id                    | `setBuyerId`              | Buyer-specific ID for the user as mapped by the exchange for the buyer. | Optional |
| Custom User Data                 | `setUserCustomData`       | Optional feature to pass bidder data that was set in the exchange’s cookie. The string must be in base85 cookie safe characters and be in any format. Proper JSON encoding must be used to include “escaped” quotation marks. | Optional |
| User Extensions                        | `setUserExt`              | Placeholder for exchange-specific extensions to OpenRTB. | Optional |
| User Gender                        | `setGender`           | The gender of the user (Male, Female, Other, Unknown). For example: `Gender.FEMALE`  | ❗ Highly Recommended |
| Keywords                   | `addUserKeywords`         | Comma separated list of keywords, interests, or intent. | Optional |
| Lat, Lon                   | `setUserLatLng`           | Location of the user’s home base defined by a provided longitude and latitude. It's highly recommended to provide Geo data to improve the request.| Optional |
| Publisher Name                  | `setPublisherName`        | Publisher name (may be aliased at the publisher’s request).| Recommended if available  |
| Store Url               | `setStoreUrl`    | The URL for the mobile application in Google Play. That field is required in the request. <br />**For example:**` https://play.google.com/store/apps/details?id=com.outfit7.talkingtom`. | ❗ Required  |
| User ID                        | `setUserId`               | ID of the user within the app. For example: `"24601"` | ❗ Highly Recommended  |
|Year of Birth|`setYearOfBirth`| The year of user's birth||


Example:

``` java
// Set user parameters to enrich ad request data.
// Please see Targeting for the userKeys and the APIs available.
TargetingParams.addUserKeyword("socialNetworking");
TargetingParams.setUserAge(18); 
```

### Global User Targeting


#### User Keywords
{:.no_toc}

User keywords are a list of keywords, intrests or intent as defined by user.keywords in OpenRTB 2.5. Any keywords passed in the UserKeywords object may be passsed to DSPs.

```
void addUserKeyword(String keyword)
void addUserKeywords(Set<String> keywords)
void removeUserKeyword(String keyword)
void clearUserKeywords()
```

Example:

```kotlin
TargetingParams.addUserKeyword("globalUserKeywordValue1")
TargetingParams.addUserKeyword("globalUserKeywordValue2")
```

## Global Application Targeting

### Inventory (Context) Keywords
{:.no_toc}

Context Keywords are a list of keywords about the app as referenced in OpenRTB 2.5 as app.keywords. Any keyword passed in the context keyword field may be passed to the buyer for targeting.


```
void addContextKeyword(String keyword)
void addContextKeywords(Set<String> keywords)
void removeContextKeyword(String keyword)
void clearContextKeywords()
```

Example:

```
TargetingParams.addContextKeyword("globalContextKeywordValue1")
TargetingParams.addContextKeyword("globalContextKeywordValue2")
```


### Bundle ID
{:.no_toc}

Use the following code to retrieve the platform-specific bundle/package name:

```
bundleName = TargetingParams.getBundleName()
```

Pass in the platform-specific identifier - the bundle/package name - to set the bundle ID:

```
TargetingParams.setBundleName(bundleName)
```

### Domain
{:.no_toc}

Retrieve and set the domain of your app with the following commands:

```kotlin
TargetingParams.setDomain(domain)

val domain = TargetingParams.getDomain()
```

## Open Measurement SDK (OMSDK) API

**NOTE**: these properties are relevant only for the original Prebid integration into GAM monetization. In this case the creative is rendered by GMA SDK and publishers should provide OMID description in the bid re qest. If you use Prebid SDK as a rendering engine you shouldn’t use these properties. Prebid SDK sends them automaticaly according to the current OMID setup.

OMSDK is designed to facilitate 3rd party viewability and verification measurement for ads served in mobile app enviroments. Prebid SDK will provide the signaling component to Bid Adapters, by way of Prebid Server, indicating the impression is eligible for OMSDK support. Prebid SDK does not currently integrate with OMSDK itself, instead it will rely on a publisher ad server to render viewability and verification measurement code.

There three components to signaling support for OMSDK:
* Partner Name
* Partner Version
* API code

#### Partner Name
{:.no_toc}

This will be the [IAB OMSDK compliant partner name](https://complianceomsdkapi.iabtechlab.com/compliance/latest) responsible for integrating with the OMSDK spec. See below for configuration and examples

Open Measurement partner name. 

```
TargetingParams.setOmidPartnerName("Google")
```

#### Partner Version
{:.no_toc}

The OMSDK version number the partner integrated with. See below for configuration and examples.

Partner's OMSDK version number implementation
```
TargetingParams.setOmidPartnerVersion();
```

## First Party Data

First Party Data (FPD) is free form data supplied by the publisher to provide additional targeting of the user or inventory context, used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain


### First Party User Data
{:.no_toc}

User specic data is passed in the global scope (i.e. applicable to all ad units).

```
void addUserData(String key, String value)
void updateUserData(String key, Set<String> value)
void removeUserData(String key)
void clearUserData()
```

Example:
```
TargetingParams.addUserData("globalUserDataKey1", "globalUserDataValue1")
```

### First Party Inventory (Context) Data
{:.no_toc}

Inventory specific free form data decribing the context of the inventory.

#### Global Context Data
{:.no_toc}

```
void addContextData(String key, String value)
void updateContextData(String key, Set<String> value)
void removeContextData(String key)
void clearContextData()
```

Example:

```
TargetingParams.addContextData("globalContextDataKey1", "globalContextDataValue1, globalContextDataValue2")
```

#### Ad Unit Context Data
{:.no_toc}

For ad unit context data, please refer to the [ad unit](pbm-adunit-android.html) section.

### Access Control List
{:.no_toc}

The First Party Data Access Control List provides a method to restrict access to first party data to a supplied list of bidders.

Only bidders supplied in the ACL will have access to the first party data. If no bidder is supplied, Prebid Server will supply first party data to all bid adapers.

```
void addBidderToAccessControlList(String bidderName)
void removeBidderFromAccessControlList(String bidderName)
void clearAccessControlList()
```

Example:
```
TargetingParams.addBidderToAccessControlList(TargetingParams.BIDDER_NAME_RUBICON_PROJECT);
```

## User Identity

Prebid SDK supports two interfaces to pass / maintain User IDs and ID vendor details:
* Real-time in Prebid SDK's API field setExternalUserIds
* Store User Id(s) in local storage

Any identity vendor's details in local storage will be sent over to Prebid Server as is, unadulterated. If data is sent in the API and entered into local storage, the API detail will prevail.

### Prebid SDK API Access
{:.no_toc}

Prebid SDK supports passing an array of UserID(s) at auction time in the field setExternalUserIds, that is globably scopped. It is sufficient enough to set the externalUserIdArray object once per user session, as these values would be used in all consecutive ad auctions in the same session.

```java
public static void setExternalUserIds(List<ExternalUserId> externalUserIds)

public static List<ExternalUserId> getExternalUserIds() 
```

Exmaple (JAVA):

```
// User Id from External Third Party Sources
ArrayList<ExternalUserId> externalUserIdArray = new ArrayList<>();
externalUserIdArray.add(new ExternalUserId("adserver.org", "111111111111", null, new HashMap() {
    {
        put ("rtiPartner", "TDID");
    }

}));
externalUserIdArray.add(new ExternalUserId("netid.de", "999888777", null, null));
externalUserIdArray.add(new ExternalUserId("criteo.com", "_fl7bV96WjZsbiUyQnJlQ3g4ckh5a1N", null, null));
externalUserIdArray.add(new ExternalUserId("liveramp.com", "AjfowMv4ZHZQJFM8TpiUnYEyA81Vdgg", null, null));
externalUserIdArray.add(new ExternalUserId("sharedid.org", "111111111111", 1, new HashMap() {
    {
        put("third", "01ERJWE5FS4RAZKG6SKQ3ZYSKV");
    }

}));
//Set External User ID
PrebidMobile.setExternalUserIds(externalUserIdArray);
```

### Local Storage
{:.no_toc}

Prebid SDK provides a local storage interface to set, retrieve or update an array of user IDs with associated identity vendor details. Prebid SDK will retrieve and pass User IDs and ID vendor details to PBS if values are present in local storage. The main difference between the Prebid API interface and the local storage interface is the persistence of storage of data. Local Storage data will persist across user sessions whereas the Prebid API interface (setExternalUserIds) persists only for the user session. If a vendor's details are passed both in local storage and the Prebid API at the same time, the Prebid  API data (setExternalUserIds) will prevail.

Prebid SDK Provides five functions to handle User ID details:

```
public static void storeExternalUserId(ExternalUserId externalUserId)
public static ExternalUserId fetchStoredExternalUserId(@NonNull String source)
public static List<ExternalUserId> fetchStoredExternalUserIds()
public static void removeStoredExternalUserId(@NonNull String source)
public static void clearStoredExternalUserIds()
```

Examples

```java
//Set External User ID
TargetingParams.storeExternalUserId(new ExternalUserId("sharedid.org", "111111111111", 1, new HashMap() {
    {
        put ("third", "01ERJWE5FS4RAZKG6SKQ3ZYSKV");
    }

}));

//Get External User ID
ExternalUserId externalUserId = TargetingParams.fetchStoredExternalUserId("sharedid.org");

//Get All External User IDs
List<ExternalUserId> externalUserIdList = TargetingParams.fetchStoredExternalUserIds();

//Remove External UserID
TargetingParams.removeStoredExternalUserId("adserver.org");

//Remove All External UserID
TargetingParams.clearStoredExternalUserIds();
```

