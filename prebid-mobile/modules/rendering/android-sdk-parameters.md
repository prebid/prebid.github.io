---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Parameters

The tables below list the methods and properties that the Prebid Rendering Module allows to customize.
The more actual info about the user, the app, and the device you provide the more chances to win an impression.

Please strictly follow the recommendations in the below tables and provide all ❗ **Required** and **Highly Recommended** values.


1. [Targeting](#targeting)
2. [PrebidRenderingSettings](#prebidrenderingsettings)

## Targeting

{: .table .table-bordered .table-striped }
| **Parameter**              | **Method**                | Description                                                  | Required?|
| -------------------------- | ------------------------- | ------------------------------------------------------------ | -------- |
| age                        | `setUserAge`              | Age of the user in years. For example: `35`   | ❗ Highly Recommended  |
| buyerid                    | `setBuyerId`              | Buyer-specific ID for the user as mapped by the exchange for the buyer. | Optional |
| crr                        | `setCarrier`              |  Mobile carrier - Defined by the Mobile Country Code (MCC) and Mobile Network Code (MNC), using the format: <MCC>-<MNC>. For example: `"310-410"` | Optional |
| customdata                 | `setUserCustomData`       | Optional feature to pass bidder data that was set in the exchange’s cookie. The string must be in base85 cookie safe characters and be in any format. Proper JSON encoding must be used to include “escaped” quotation marks. | Optional |
| dma                        | `setDma`                  | A designated market are. For US locations, indicates the end-user's Designated Market Area. For example: dma=803. | Optional |
| eth                        | `setUserEthnicity`        | Ethnicity of the user (African American, Asian, Hispanic, White, Other). For example: `OXMEthnicity.ASIAN` | Recommended if available |
| ext                        | `setUserExt`              | Placeholder for exchange-specific extensions to OpenRTB. | Optional |
| gen                        | `setUserGender`           | The gender of the user (Male, Female, Other, Unknown). For example: `OXMGender.FEMALE`  | ❗ Highly Recommended |
| inc                        | `setUserAnnualIncomeInUs` | Annual income of the user in US dollars. For example: `55000`| ❗ Highly Recommended  |
| ip                         | `setDeviceIpAddress`            | The IP address of the carrier gateway. If this is not present, Prebid Rendering retrieves it from the request header. For example: `"192.168.0.1"` | ❗ Highly Recommended |
| keywords                   | `setUserKeywords`         | Comma separated list of keywords, interests, or intent. | Optional |
| lat, lon                   | `setUserLatLng`           | Location of the user’s home base defined by a provided longitude and latitude. It's highly recommended to provide Geo data to improve the request.| Optional |
| mar                        | `setUserMaritalStatus`    | The marital status of the user (Single, Married, Divorced, Unknown). For example: `OXMMaritalStatus.DIVORCED` | Recommended if available  |
| publisher                  | `setPublisherName`        | Publisher name (may be aliased at the publisher’s request).| Recommended if available  |
| url/storeurl               | `setAppStoreMarketUrl`    | The URL for the mobile application in Google Play. That field is required in the request. <br />**For example:**` https://play.google.com/store/apps/details?id=com.outfit7.talkingtom`. | ❗ Required  |
| xid                        | `setUserId`               | ID of the user within the app. For example: `"24601"` | ❗ Highly Recommended  |

## How to set user parameters

You can use `Targeting` to pass ad call request parameters.

``` java
// Set user parameters to enrich ad request data.
// Please see Targeting for the userKeys and the APIs available.
Targeting.setUserKeywords("socialNetworking");
Targeting.setUserAge(18);
Targeting.setUserAnnualIncomeInUs(50000);
 
// Set parameters.
// Targeting.setCustomParameters(Hashtable<String, String> params)
// Targeting.setParameters(Hashtable<String, String> params)
// clear parameters
// Targeting.clearParameters()
// Targeting.clearParameter(String key)
```

## Custom key-value parameters

You can submit values through `Targeting` for the extended (`c.xxx`) ad-call
parameters.

{: .table .table-bordered .table-striped }
| **Parameter**           | **Method**          | **Description**                                              |
| ----------------------- | ------------------- | ------------------------------------------------------------ |
| custom<br />parameter   | setCustomParameter  | A custom user parameter auto-prepended with c..<br />You should provide the plain name of the parameter, such as xxx, which will be changed to c.xxx when sent. |
| custom <br />parameters | setCustomParameters | Custom user parameters, which consist of a dictionary of name-value parameter pairs, where each param name will be automatically prepended with c.. |

## PrebidRenderingSettings

{: .table .table-bordered .table-striped }
| **Field**               | **Description**                                              | **Default** |
| ----------------------- | ------------------------------------------------------------ | ----------- |
| defaultAutoRefreshDelay | Controls the initial value of `autoRefreshDelay` for all newly created OXMAdViews in seconds. | 60          |
| logLevel                | Controls the type of messages of the internal logger. Options are:<br />- DEBUG - this is the noisiest level.<br />- ERROR<br />- WARN<br />- NONE | NONE        |
| sendMRAIDSupportParams  | If `true`, the SDK sends "`af=3,5`", indicating support for MRAID. | true        |
