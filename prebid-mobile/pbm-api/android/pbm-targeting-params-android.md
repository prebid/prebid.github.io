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


### Open Measurment SDK (OMSDK)

OMSDK is designed to facilitate 3rd party viewability and verification measurement for ads served in mobile app enviroments. Prebid SDK will provide the signaling component to Bid Adapters, by way of Prebid Server, indicating the impression is elligible for OMSDK support. Prebid SDK does not currently integrate with OMSDK itself, instead it will rely on a publisher ad server to render viewability and verification measurement code.

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
parameters.setApi(Arrays.asList(new Signals.Api(6, 7)));
```



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

 The below first party user and inventory context will apply to all ad units. For ad unit level first party data, refer to [First Partay Data section in the Ad Unit](pbm-adunit-android#first-party-data) page.

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


## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
