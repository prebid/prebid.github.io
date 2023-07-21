---
layout: page_v2
title: Global Targeting Parameters - iOS
description: Prebid Mobile API global targeting parameters for iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---


# Request parameters
{:.no_toc}

The tables below list the methods and properties that the Prebid Rendering API uses for customization.
The more data about the user, app, and device that can be provided the more chances to win an impression.

It is advised that you strictly follow the recommendations in the tables below. Any field marked with an ❗is required and recommended. 

* TOC
{:toc}

## GPDR API

Prebid Mobile supports the [IAB GDPR recommendations](https://www.iab.com/topics/consumer-privacy/gdpr/). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice](/prebid-mobile/prebid-mobile-privacy-regulation.html)

Prebid SDK doesn't modify values for IAB-defined keys in the `UserDefaults`. Instead, SDK will keep the provided value in the in-memory property.

The values provided via targeting API will be included in the bid request according to the `TCF v2` framework.

{% capture warning_note %}  

Since the SDK API has priority over CMP values, using the API blocks the CMP signals. Use a single way to provide the TCF signals. 

If you need to use an API way, ensure that all the following properties are set in the app code. 

If you need to use a CMP way, ensure that you don't set any of the following API properties. 


:::
{% include /alerts/alert_warning.html content=warning_note %}

### Subject To GPDR

```
public var subjectToGDPR:Bool?
```

You can retrieve and set the subjectToGDPR for targeting:

```
guard let subjectToGDPR = Targeting.shared.subjectToGDPR else {
    print("There was an error retrieving subjectToGDPR)
    return
}
```

```
Targeting.shared.subjectToGDPR = false
```
 

### GDPR Consent String

```
public var gdprConsentString?
```

You can retrieve and set the subjectToGDPR for targeting:

```
guard let gdprConsentString = Targeting.shared.gdprConsentString else {
    print("There was an error retrieving gdprConsentString")
    return
}
```

```
Targeting.shared.gdprConsentString = "A String"
```

### Purpose Consent

```
public var purposeConsents: String?
```

You can retrieve and set the purposeConsents for targeting:

```
Targeting.shared.purposeConsents = "100000000000000000000000"

```

## Targeting properties

{: .table .table-bordered .table-striped }

| **Variable**         | **Description**                                              | **Required?**            |
| -------------------- | ---------------- | ------------------------------------------------------------ | ------------------------ |
| `storeURL`    | Stores URL for the mobile application. For example: `"https://itunes.apple.com/us/app/your-app/id123456789"` | ❗ Required            |
|`contentUrl`            |  This is the deep-link URL for the app screen that is displaying the ad. This can be an iOS universal link.  | ❗ Highly Recommended                 |
|`publisherName`| App's publisher's name. | ❗ Highly Recommended                 |
| `yearOfBirth`              | For example: `1987`  | ❗ Highly Recommended |
| `coppa` or `subjectToCOPPA`              | Flag indicating if this request is subject to the COPPA regulations established by the USA FTC, where 0 = no, 1 = yes  | ❗ Highly Recommended |
| `userGender`           | User's gender (Male, Female, Other, Unknown). For example: `.female` | ❗ Highly Recommended  |
|`userGenderDescription`| String representation of the user's gender, where “M” = male, “F” = female, “O” = known to be other (i.e., omitted is unknown) | |
| `userID`               | ID of the user within the app. For example: `"24601"`   | ❗ Highly Recommended  |
| `buyerUID`             | Buyer-specific ID for the user as mapped by the exchange for the buyer. | ❗ Highly Recommended  |
| `keywords`             | Comma separated list of keywords, interests, or intent | Optional |
| `userCustomData`| Optional feature to pass bidder the data that was set in the exchange’s cookie. The string must be in base85 cookie safe characters and be in any format. Proper JSON encoding must be used to include “escaped” quotation marks. | Optional |
|`userExt`| Placeholder for exchange-specific extensions to OpenRTB. | Optional |
|`domain`|Retrieve and set the domain of your app|Optional|
|`itunesID`|Retrieve and set the domain of your iTunes ID with the below command. This field will be transmitted to buyers as the bundle ID as recommended in OpenRTB 2.5. Failure to supply this value can have a negative monetary impact.|Optional|


The code sample:

```swift
let targeting = Targeting.shared
        
targeting.userGender = .male
targeting.yearOfBirth = 1987
targeting.userID = "X345Y678Z890"
```

## Open Measurement SDK (OMSDK) API

> **NOTE**: these properties are relevant only for the original Prebid integration into GAM monetization. In this case the creative is rendered by GMA SDK and publishers should provide OMID description in the bid re qest. If you use Prebid SDK as a rendering engine you shouldn't use these properties. Prebid SDK sends them automaticaly according to the current OMID setup. 

OMSDK is designed to facilitate 3rd party viewability and verification measurement for ads served in mobile app enviroments. Prebid SDK will provide the signaling component to Bid Adapters, by way of Prebid Server, indicating the impression is eligible for OMSDK support. Original API of prebid SDK does not currently integrate with OMSDK itself, instead it will rely on a publisher ad server to render viewability and verification measurement code.

There three components to signaling support for OMSDK:
* Partner Name
* Partner Version
* API code

#### Partner Name
{:.no_toc}

This will be the [IAB OMSDK compliant partner name](https://complianceomsdkapi.iabtechlab.com/compliance/latest) responsible for integrating with the OMSDK spec. See below for configuration and examples

```swift
Targeting.shared.omidPartnerName = "Google"
```

#### Partner Version
{:.no_toc}

The OMSDK version number the partner integrated with. See below for configuration and examples.

```swift
Targeting.shared.omidPartnerVersion = "1.0"
```

## Targeting methods

{: .table .table-bordered .table-striped }

### Inventory (Context) Keywords

Context Keywords are a list of keywords about the app as referenced in OpenRTB 2.5 as app.keywords. Any keyword passed in the context keyword field may be passed to the buyer for targeting. Prebid provides following functions to manage context keywords:


```
func addContextKeyword(_ newElement: String)

func addContextKeywords(_ newElements: Set<String>)

func removeContextKeyword(_ element: String)

func clearContextKeywords()
```

Example:

```swift
Targeting.shared.addContextKeyword("globalContextKeywordValue1")
Targeting.shared.addContextKeyword("globalContextKeywordValue2")
Targeting.shared.addContextKeyword("globalContextKeywordValue3")
```

### First Party User Data

Prebid provides following functions to manage First Party User Data:

```
func addUserData(key: String, value: String)

func updateUserData(key: String, value: Set<String>)

func removeUserData(forKey: String)

func clearUserData()
```

Example:

```swift
Targeting.shared.addUserData(key: "globalUserDataKey1", value: "globalUserDataValue1")
```

### First Party Inventory (Context) Data

Prebid provides following functions to manage First Party Inventory Data:


```
func addContextData(key: String, value: String)

func updateContextData(key: String, value: Set<String>)

func removeContextData(forKey: String)

func clearContextData()
```

Example:

```swift
Targeting.shared.addContextData(key: "globalContextDataKey1", value: "globalContextDataValue1")
```

### Access Control

The First Party Data Access Control List provides a methods to restrict access to first party data to a supplied list of bidders.


```
func addBidderToAccessControlList(_ bidderName: String)

func removeBidderFromAccessControlList(_ bidderName: String)

func clearAccessControlList()
```

Example:

```swift
Targeting.shared.addBidderToAccessControlList(Prebid.bidderNameRubiconProject)
```


### Custom Params

The methods that add or change the custom parameters. The name will be auto-prepended with `c.` to avoid collisions. 

```
public func addCustomParam(_ value: String, withName: String?)

public func setCustomParams(_ params: [String : String]?)
```

### Parameter

Adds a new param by name and sets its value.

``` 
public func addParam(_ value: String, withName: String?)
```

### Latitude Longitude

Store location in the user's section

```
public func setLatitude(_ latitude: Double, longitude: Double)
```

## User Identity API

Prebid SDK supports two interfaces to pass / maintain User IDs and ID vendor details:
* Real-time in Prebid SDK's API field externalUserIdArray
* Store User Id(s) in local storage

Any identity vendor's details in local storage will be sent over to Prebid Server as is, unadulterated. If data is sent in the API and entered into local storage, the API detail will prevail.

### Prebid SDK API Access

Prebid SDK supports passing an array of UserID(s) at auction time in the field externalUserIdArray, that is globably scopped. It is sufficient enough to set the externalUserIdArray object once per user session, as these values would be used in all consecutive ad auctions in the same session.


```swift
public var externalUserIdArray = [ExternalUserId]()
```

**Exmaples**

```swift
// User Id from External Third Party Sources
var externalUserIdArray = [ExternalUserId]()

externalUserIdArray.append(ExternalUserId(source: "adserver.org", identifier: "111111111111", ext: ["rtiPartner" : "TDID"]))
externalUserIdArray.append(ExternalUserId(source: "netid.de", identifier: "999888777")) 
externalUserIdArray.append(ExternalUserId(source: "criteo.com", identifier: "_fl7bV96WjZsbiUyQnJlQ3g4ckh5a1N")) 
externalUserIdArray.append(ExternalUserId(source: "liveramp.com", identifier: "AjfowMv4ZHZQJFM8TpiUnYEyA81Vdgg"))
externalUserIdArray.append(ExternalUserId(source: "sharedid.org", identifier: "111111111111", atype: 1, ext: ["third" : "01ERJWE5FS4RAZKG6SKQ3ZYSKV"]))

Prebid.shared.externalUserIdArray = externalUserIdArray
```

### Local Storage

Prebid SDK provides a local storage interface to set, retrieve or update an array of user IDs with associated identity vendor details. Prebid SDK will retrieve and pass User IDs and ID vendor details to PBS if values are present in local storage. The main difference between the Prebid API interface and the local storage interface is the persistence of storage of data. Local Storage data will persist across user sessions whereas the Prebid API interface (externalUserIdArray) persists only for the user session. If a vendor's details are passed both in local storage and the Prebid API at the same time, the Prebid  API data (externalUserIdArray) will prevail.

Prebid SDK Provides five functions to handle User ID details:

```
public func storeExternalUserId(_ externalUserId: ExternalUserId)

public func fetchStoredExternalUserIds() -> [ExternalUserId]?

public func fetchStoredExternalUserId(_ source : String) -> ExternalUserId?

public func removeStoredExternalUserId(_ source : String)

public func removeStoredExternalUserIds()
```

**Examples**

```swift
//Set External User ID
Targeting.shared.storeExternalUserId(ExternalUserId(source: "sharedid.org", identifier: "111111111111", atype: 1, ext: ["third" : "01ERJWE5FS4RAZKG6SKQ3ZYSKV"]))

//Get External User ID
let externalUserIdSharedId = Targeting.shared.fetchStoredExternalUserId("sharedid.org")

//Get All External User IDs
let externalUserIdsArray = Targeting.shared.fetchStoredExternalUserIds()

//Remove External UserID
Targeting.shared.removeStoredExternalUserId("sharedid.org")

//Remove All External UserID
Targeting.shared.removeStoredExternalUserIds()
```

