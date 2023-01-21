---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Request parameters

The tables below list the methods and properties that the Prebid Rendering API uses for customization.
The more data about the user, app, and device that can be provided the more chances to win an impression.

It is advised that you strictly follow the recommendations in the tables below. Any field marked with an ❗is required and recommended. 


1. [Targeting Properties](#prebidrenderingtargeting-variables)
1. [Targeting Methods](#prebidrenderingtargeting-methods)
1. [SDK Configuration Properties](#prebidrenderingconfig)

## Targeting proeprties

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

The code sample:

``` swift
let targeting = Targeting.shared
        
targeting.userGender = .male
targeting.yearOfBirth = 1987
targeting.userID = "X345Y678Z890"
```


## Targeting methods

{: .table .table-bordered .table-striped }

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
## SDK Configuration Properties

{: .table .table-bordered .table-striped }


| **Method**                             | **Description**                                              | **Default** |
| -------------------------------------- | ------------------------------------------------------------ | ----------- |
| `creativeFactoryTimeout`                 | Controls how long in seconds each creative has to load before it is considered a failure. | 3           |
| `creativeFactoryTimeoutPreRenderContent` | Controls how long (in seconds) the video and display interstitial creative has to completely pre-render before it is considered a failure. | 30          |
| `useExternalClickthroughBrowser`         | Controls whether to use in-app browser or the Safari app for displaying ad click-through content. | true        |
| `logLevel`                               | Controls the verbosity of PrebidRenderingModule's internal logger. Options are (from most to least noisy):<br />- .info<br />- .warn<br />- .error<br />- .none | .info       |
| `debugLogFileEnabled`                    | If `true`, the output of PrebidRenderingModule's internal logger is written to a text file. This can be helpful for debugging. | false       |

The code sample:

``` swift
Prebid.shared.creativeFactoryTimeout = 5.0
```

