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

## Global User Targeting

### Year of Birth

You can retrieve and set the year of birth for targeting:

```
yob = TargetingParams.getYearOfBirth();
```

```
TargetingParams.setYearOfBirth(1990);
```

### Gender

You can retrieve and set the following values for gender:

- `FEMALE`
- `MALE`
- `UNKNOWN`

```
gender = TargetingParams.getGender();
```

```
TargetingParams.setGender(FEMALE);
```

### User Keywords
User keywords are a list of keywords, intrests or intent as defined by user.keywords in OpenRTB 2.5. Any keywords passed in the UserKeywords object may be passsed to DSPs.

#### Add User Keywords

```
void addUserKeyword(String keyword)
void addUserKeywords(Set<String> keywords)
```

#### Remove User Keywords*

```
void removeUserKeyword(String keyword)
```

#### Clear User Keywords*

```
void clearUserKeywords()
```

Example:
```
TargetingParams.addUserKeyword("globalUserKeywordValue1")
TargetingParams.addUserKeyword("globalUserKeywordValue2")
```

## Global Application Targeting

### Bundle ID

Use the following code to retrieve the platform-specific bundle/package name:

```
bundleName = TargetingParams.getBundleName();
```

Pass in the platform-specific identifier - the bundle/package name - to set the bundle ID:

```
TargetingParams.setBundleName(bundleName);
```

### Domain

Retrieve and set the domain of your app with the following commands:

```
domain = TargetingParams.getDomain();
```

```
TargetingParams.setDomain(domain);
```

### Store URL

Retrieve and set your app's store URL:

```
storeUrl = TargetingParams.getStoreUrl();
```

```
TargetingParams.setStoreUrl(storeUrl);
```


### Open Measurement SDK (OMSDK)

OMSDK is designed to facilitate 3rd party viewability and verification measurement for ads served in mobile app enviroments. Prebid SDK will provide the signaling component to Bid Adapters, by way of Prebid Server, indicating the impression is eligible for OMSDK support. Prebid SDK does not currently integrate with OMSDK itself, instead it will rely on a publisher ad server to render viewability and verification measurement code.

There three components to signaling support for OMSDK:
* Partner Name
* Partner Version
* API code

**Partner Name**

This will be the [IAB OMSDK compliant partner name](https://complianceomsdkapi.iabtechlab.com/compliance/latest) responsible for integrating with the OMSDK spec. See below for configuration and examples

#### omidPartnerName
Open Measurement partner name. 

```
TargetingParams.setOmidPartnerName()
```

Examples:

Java
```java
TargetingParams.setOmidPartnerName("Google")
```

**Partner Version**

The OMSDK version number the partner integrated with. See below for configuration and examples.


#### omidPartnerVersion
Partner's OMSDK version number implementation
```
TargetingParams.setOmidPartnerVersion();
```

Examples:

Java
```java
TargetingParams.setOmidPartnerVersion("1.0");
```

**API Code**

Per OpenRTB 2.5, support for OMSDK is signaled using the imp.[media type].api field represented in Prebid SDK withing each ad format type under the parameters object. Refer to the documentation of the respective ad unit class.

Example:
```
BannerAdUnit bannerAdUnit = new BannerAdUnit("PREBID_SERVER_CONFIGURATION_ID", 300, 250);
bannerAdUnit.setUserKeyword("my_key", "my_value");
BannerBaseAdUnit.Parameters parameters = new BannerBaseAdUnit.Parameters();
parameters.setApi(Arrays.asList(new Signals.Api(7)));
```

Note that the OMID value for imp.banner/video/native.api field should be 7, as defined by the IAB in the [OMSDK v1.2 document](https://s3-us-west-2.amazonaws.com/omsdk-files/docs/Open+Measurement+SDK+Onboarding_version_1.2.pdf).


### Inventory (Context) Keywords
Context Keywords are a list of keywords about the app as referenced in OpenRTB 2.5 as app.keywords. Any keyword passed in the context keyword field may be passed to the buyer for targeting.

*Add Context Keywords*

```
void addContextKeyword(String keyword)
void addContextKeywords(Set<String> keywords)
```

*Remove Context Keywords*

```
void removeContextKeyword(String keyword)
````

*Clear all Keywords*

```
void clearContextKeywords()
```

Example:
```
TargetingParams.addContextKeyword("globalContextKeywordValue1")
TargetingParams.addContextKeyword("globalContextKeywordValue2")
```


## First Party Data
First Party Data (FPD) is free form data supplied by the publisher to provide additional targeting of the user or inventory context, used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain

 The below first party user and inventory context will apply to all ad units. For ad unit level first party data, refer to [First Party Data section in the Ad Unit](pbm-adunit-android#first-party-data) page.

### First Party User Data
User specic data is passed in the global scope (i.e. applicable to all ad units).

#### Add User data
```
void addUserData(String key, String value)
```

#### Update User Data
```
void updateUserData(String key, Set<String> value)
```

#### Remove User Data
```
void removeUserData(String key)
```

#### Clear User Data
```
void clearUserData()
```

Example:
```
TargetingParams.addUserData("globalUserDataKey1", "globalUserDataValue1")
```

### First Party Inventory (Context) Data
Inventory specific free form data decribing the context of the inventory.

#### Global Context Data


*Add Context data*
```
void addContextData(String key, String value)
```

*Update Context Data*
```
void updateContextData(String key, Set<String> value)
```

*Remove Context Data*
```
void removeContextData(String key)
```

*Clear Context Data*
```
void clearContextData()
```

Example:
```
TargetingParams.addContextData("globalContextDataKey1", "globalContextDataValue1, globalContextDataValue2")
```

#### Ad Unit Context Data
For ad unit context data, please refer to the [ad unit](pbm-adunit-android.html) section.


### Access Control List
The First Party Data Access Control List provides a method to restrict access to first party data to a supplied list of bidders.

#### Add Bidder to Access Control List
Only bidders supplied in the ACL will have access to the first party data. If no bidder is supplied, Prebid Server will supply first party data to all bid adapers.
```
void addBidderToAccessControlList(String bidderName)
```

*Remove Bidder from Access Control List*

```
void removeBidderFromAccessControlList(String bidderName)
```

*Clear Access Control List*

```
void clearAccessControlList()
```

Example:
```
TargetingParams.addBidderToAccessControlList(TargetingParams.BIDDER_NAME_RUBICON_PROJECT);
```


## Global GDPR Targeting

Prebid Mobile supports the [IAB GDPR recommendations](https://www.iab.com/topics/consumer-privacy/gdpr/). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice](/prebid-mobile/privacy-regulation.html)

### Subject To GPDR

Enable (true) or disable (false) the ability to provide consent.

#### Retrieve subjectToGDPR

```
TargetingParams.isSubjectToGDPR();
```
#### Set subjectToGDPR

```
TargetingParams.setSubjectToGDPR(context, true);
```

### GDPR Consent String

#### Retrieve gdprConsentString

```
context = TargetingParams.getGDPRConsentString();
```

#### Set gdprConsentString

```
TargetingParams.setGDPRConsentString(string);
```

### Purpose Consent

#### Retrieve purposeConsent

```
TargetingParams.getPurposeConsents();
```

#### Set purposeConsent

```
TargetingParams.setPurposeConsents(string);
```

Prebid mobile also checks if the values are present in the [SharedPreferences](https://developer.android.com/training/data-storage/shared-preferences) keys specified by the IAB. If the values are also set in these objects they will be passed in the OpenRTB request object.


## COPPA
Prebid supports passing of the Child Online Privacy Prection (COPPA) signal to Prebid Server (PBS) for all COPPA traffic. When PBS receives the COPPA flag we strip out all personal data from the requeset. For a general overview of COPPA, see the [FTC's guidlines](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule).

*Set Subject to COPPA*

```
void setSubjectToCOPPA(boolean consent)
```

Example:
```
TargetingParams.setSubjectToCOPPA(true);
```


## User Identity

Prebid SDK supports two interfaces to pass / maintain User IDs and ID vendor details:
* Real-time in Prebid SDK's API field setExternalUserIds
* Store User Id(s) in local storage

Any identity vendor's details in local storage will be sent over to Prebid Server as is, unadulterated. If data is sent in the API and entered into local storage, the API detail will prevail.

### Prebid SDK API Access

Prebid SDK supports passing an array of UserID(s) at auction time in the field setExternalUserIds, that is globably scopped. It is sufficient enough to set the externalUserIdArray object once per user session, as these values would be used in all consecutive ad auctions in the same session.


```java
/**
* List containing objects that hold External UserId parameters for the current application user. * @param externalUserIds
*/
public static void setExternalUserIds(List<ExternalUserId> externalUserIds){
    PrebidMobile.externalUserIds = externalUserIds;
}
/**
* Returns the List that hold External UserId parameters for the current application user * @@return externalUserIds as Array.
*/
public static List<ExternalUserId> getExternalUserIds() {
    return PrebidMobile.externalUserIds;
```


*Exmaple*:

Java
```java
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

Prebid SDK provides a local storage interface to set, retrieve or update an array of user IDs with associated identity vendor details. Prebid SDK will retrieve and pass User IDs and ID vendor details to PBS if values are present in local storage. The main difference between the Prebid API interface and the local storage interface is the persistence of storage of data. Local Storage data will persist across user sessions whereas the Prebid API interface (setExternalUserIds) persists only for the user session. If a vendor's details are passed both in local storage and the Prebid API at the same time, the Prebid  API data (setExternalUserIds) will prevail.

Prebid SDK Provides five functions to handle User ID details:
* storeExternalUserId
* fetchStoredExternalUserId
* fetchStoredExternalUserIds
* removeStoredExternalUserId
* removeStoredExternalUserIds


```java
/**
* Use this API for storing the externalUserId in the SharedPreference
* @param externalUserId the externalUserId instance to be stored in the SharedPreference
* */
public static void storeExternalUserId(ExternalUserId externalUserId) {
    if (externalUserId != null) {
        StorageUtils.storeExternalUserId(externalUserId);
    }

    else {
        LogUtil.e("Targeting", "External User ID can't be set as null");
    }

}

/**
* Returns the stored (in the SharedPreference) ExternalUserId instance for a given source
* @param source
* */
public static ExternalUserId fetchStoredExternalUserId(@NonNull String source) {
    if (!TextUtils.isEmpty(source)) {
        return StorageUtils.fetchStoredExternalUserId(source);
    }

    return null;
}

/**
* Returns the stored (in the SharedPreferences) External User Id list
* */
public static List<ExternalUserId> fetchStoredExternalUserIds() {
    return StorageUtils.fetchStoredExternalUserIds();
}

/**
* Removes the stored (in the SharedPreference) ExternalUserId instance for a given source
* @param source
* */
public static void removeStoredExternalUserId(@NonNull String source) {
    if (!TextUtils.isEmpty(source)) {
        StorageUtils.removeStoredExternalUserId(source);
    }

}

/**
* Clear the Stored ExternalUserId list from the SharedPreference
* */
public static void removeStoredExternalUserIds() {
    StorageUtils.removeStoredExternalUserIds();
}

```

*Examples*

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
TargetingParams.removeStoredExternalUserIds();
```

## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
