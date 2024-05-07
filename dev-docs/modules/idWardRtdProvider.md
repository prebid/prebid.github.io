---
layout: page_v2
title: ID Ward Real Time Data Provider Module
display_name: ID Ward Real Time Data Provider Module
description: ID Ward Real Time Data Provider Module
page_type: module
module_type: rtd
module_code : idWardRtdProvider
enable_download : false
vendor_specific: true
sidebarType : 1
---

> **Warning!**
>
> The **idWardRtdProvider** module has been renamed to [anonymisedRtdProvider](anonymisedrtdprovider) in light of the company's rebranding.
> **idWardRtdProvider** module is maintained for backward compatibility until the next major Prebid release.
>
> Please use anonymisedRtdProvider instead of idWardRtdProvider in your Prebid integration.
>

# ID Ward Real Time Data Provider Module

ID Ward is a data anonymization technology for privacy-preserving advertising. Publishers and advertisers are able to target and retarget custom audience segments covering 100% of consented audiences.
ID Ward’s Real-time Data Provider automatically obtains segment IDs from the ID Ward on-domain script (via `localStorage`) and passes them to the bid-stream.

## Publisher Usage

1. Build the idWardRtd module into the Prebid.js package with:

    ```bash
    gulp build --modules=idWardRtdProvider,...
    ```

2. Use `setConfig` to instruct Prebid.js to initilaize the idWardRtdProvider module, as specified below.

### Configuration

```javascript
 pbjs.setConfig({
   realTimeData: {
     dataProviders: [
       {
         name: "idWard",
         waitForIt: true,
         params: {
           cohortStorageKey: "cohort_ids",
           segtax: <taxonomy_name>,           
         }
       }
     ]
   }
 });
```

Please note that idWardRtdProvider should be integrated into the publisher website along with the [ID Ward Pixel](https://publishers-web.id-ward.com/pixel-integration).
Please reach out to Id Ward representative(<support@id-ward.com>) if you have any questions or need further help to integrate Prebid, idWardRtdProvider, and Id Ward Pixel

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Id Ward Rtd module name | 'idWard' always|
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| cohortStorageKey | String | the `localStorage` key, under which Id Ward Pixel stores the segment IDs | 'cohort_ids' always |
| segtax | Integer | the taxonomy for Id Ward | Getting this value is in progress, once done this will become optional |
