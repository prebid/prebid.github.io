---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Parameters

The tables below list the methods and properties that the Prebid Rendering API uses for customization.
The more data about the user, app, and device that can be provided the more chances to win an impression.

It is advised that you strictly follow the recommendations in the tables below. Any field marked with an ❗is required and recommended. 

1. [Targeting Params](#targeting)
2. [SDK Settings](#prebidrenderingsettings)

## Targeting

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


Example:

``` java
// Set user parameters to enrich ad request data.
// Please see Targeting for the userKeys and the APIs available.
TargetingParams.addUserKeyword("socialNetworking");
TargetingParams.setUserAge(18); 
```        |
