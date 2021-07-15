---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Request parameters

The tables below list methods and properties that the Rendering Module allows to customize in order to enrich the bid requests with actual data. The more info specified about the user, the app, and the device you provide the more chances to win a bid. 

Please strictly follow the recommendations in the below tables and provide all ❗ **Required** and **Highly Recommended** values.


1. [PrebidRenderingTargeting Properties](#prebidrenderingtargeting-variables)
1. [PrebidRenderingTargeting Methods](#prebidrenderingtargeting-methods)
1. [PrebidRenderingConfig](#prebidrenderingconfig)

## PrebidRenderingTargeting proeprties

{: .table .table-bordered .table-striped }

| **Variable**         | **Description**                                              | **Required?**            |
| -------------------- | ---------------- | ------------------------------------------------------------ | ------------------------ |
| appStoreMarketURL    | Stores URL for the mobile application. For example: `"https://itunes.apple.com/us/app/your-app/id123456789"` | ❗ Required            |
|contentUrl            |  This is the deep-link URL for the app screen that is displaying the ad. This can be an iOS universal link.  | ❗ Highly Recommended                 |
|publisherName| App's publisher's name. | ❗ Highly Recommended                 |
| userAge              | User's age in years. For example: `35`  | ❗ Highly Recommended |
| coppa                | Flag indicating if this request is subject to the COPPA regulations established by the USA FTC, where 0 = no, 1 = yes  | ❗ Highly Recommended |
| userAnnualIncomeInUS | User's annual income in US dollars. For example: `55000` | ❗ Highly Recommended |
| userGender           | User's gender (Male, Female, Other, Unknown). For example: `GenderFemale` | ❗ Highly Recommended  |
|userGenderDescription| String representation of the user's gender, where “M” = male, “F” = female, “O” = known to be other (i.e., omitted is unknown) | |
| userID               | ID of the user within the app. For example: `"24601"`   | ❗ Highly Recommended  |
| buyerUID             | Buyer-specific ID for the user as mapped by the exchange for the buyer. | ❗ Highly Recommended  |
| userEthnicity        | User's ethnicity (African American, Asian, Hispanic, White, Other). For example: `EthnicityAsian` | Recommended if available  |
| userMaritalStatus    | User's marital status (Single, Married, Divorced, Unknown). For example: `MaritalStatusDivorced` | Recommended if available |
| networkType          | Network connection type of the user (offline, wifi, or cell).For example: `NetworkTypeWifi` | ❗ Required |
| IP                   | The IP address of the carrier gateway. If this is not present, Prebid retrieves it from the request header. For example: `"192.168.0.1"` | ❗ Highly Recommended                 |
| carrier              | Mobile carrier - Defined by the Mobile Country Code (MCC) and Mobile Network Code (MNC), using the format: <MCC>-<MNC>. For example: `"310-410"` | Optional                 |
| DMA                  | For US locations, indicates the user's Designated Market Area. For example: `"803"` | Optional                 |
| keywords             | Comma separated list of keywords, interests, or intent | Optional |
| userCustomData| Optional feature to pass bidder the data that was set in the exchange’s cookie. The string must be in base85 cookie safe characters and be in any format. Proper JSON encoding must be used to include “escaped” quotation marks. | Optional |
|userExt| Placeholder for exchange-specific extensions to OpenRTB. | Optional |

The code sample:

``` swift
let targeting = PrebidRenderingTargeting.shared
targeting.userGender = .male
targeting.userAge = 99
targeting.userAnnualIncomeInUS = 9999
targeting.setLatitude(123.0, longitude: 456.0)
```


## PrebidRenderingTargeting methods

{: .table .table-bordered .table-striped }

| **Method**                               | **Description**                                              |
| ---------------------------------------- | ------------------------------------------------------------ |
| addCustomParam:@"val1" withName:@"key1"  | Adds the custom parameters. The name will be auto-prepended with `c.` to avoid collisions. Example: `addCustomParam:@"73" withName:@"temperature"` |
| setCustomParams:@["key1":@"val1"]        | Adds a dictionary of name-value parameter pairs, where each parameter name will be prepended with `c.` to avoid name collisions. Example: `setCustomParams:@["key1":@"val1"]` |
| addParam:@"val1" withName:@"key1"        | Adds a new `param` by name and sets its value. If an ad call parameter doesn't exist in this SDK, you can set it manually using this method.<br />Example: `addParam:@"73" withName:@"temperature"` |
| setLatitude:latitude longitude:longitude | Sets the latitude and longitude of a geographic location.<br>Latitude from -90.0 to +90.0, where negative is south. <br>Longitude from -180.0 to +180.0, where negative is west. |
| resetUserAge;                            | Sets the User Age to 0                                       |
| resetUserAnnualIncomeInUS;               | Sets the userAnnualIncomeInUS to 0                           |

## PrebidRenderingConfig

{: .table .table-bordered .table-striped }

| **Method**                             | **Description**                                              | **Default** |
| -------------------------------------- | ------------------------------------------------------------ | ----------- |
| creativeFactoryTimeout                 | Controls how long in seconds each creative has to load before it is considered a failure. | 3           |
| creativeFactoryTimeoutPreRenderContent | Controls how long (in seconds) the video and display interstitial creative has to completely pre-render before it is considered a failure. | 30          |
| useInternalClickthroughBrowser         | Controls whether to use in-app browser or the Safari app for displaying ad click-through content. | true        |
| logLevel                               | Controls the verbosity of PrebidRenderingModule's internal logger. Options are (from most to least noisy):<br />- .info<br />- .warn<br />- .error<br />- .none | .info       |
| debugLogFileEnabled                    | If `true`, the output of PrebidRenderingModule's internal logger is written to a text file. This can be helpful for debugging. | false       |

The code sample:

``` swift
PrebidRenderingConfig.shared.creativeFactoryTimeout = 5.0
```

