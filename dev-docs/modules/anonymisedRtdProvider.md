---
layout: page_v2
title: Anonymised Real Time Data Provider Module
display_name: Anonymised Real Time Data Provider Module
description: Anonymised Real Time Data Provider Module
page_type: module
module_type: rtd
module_code : anonymisedRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Anonymised Real Time Data Provider Module

Anonymised is a data anonymization technology for privacy-preserving advertising. Publishers and advertisers are able to target and retarget custom audience segments covering 100% of consented audiences.
Anonymised’s Real-time Data Provider automatically obtains segment IDs from the Anonymised on-domain script (via `localStorage`) and passes them to the bid-stream.

## Publisher Usage

- Build the anonymisedRtd module into the Prebid.js package with:

```bash
gulp build --modules=anonymisedRtdProvider,...
```

- Use `setConfig` to instruct Prebid.js to initilaize the anonymisedRtdProvider module, as specified below.

### Configuration

```javascript
 pbjs.setConfig({
   realTimeData: {
     dataProviders: [
       {
         name: "anonymised",
         waitForIt: true,
         params: {
           cohortStorageKey: "cohort_ids",      
         }
       }
     ]
   }
 });
```

Please note that anonymisedRtdProvider should be integrated into the publisher website along with the [Anonymised Marketing Tag](https://support.anonymised.io/integrate/marketing-tag).
Please reach out to Anonymised representative support@anonymised.io if you have any questions or need further help to integrate Prebid, anonymisedRtdProvider, and Anonymised Marketing Tag

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Anonymised Rtd module name | 'anonymised' always|
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| cohortStorageKey | String | the `localStorage` key, under which Anonymised Pixel stores the segment IDs | 'cohort_ids' always |
| segtax | Integer | the taxonomy for Anonymised | Getting this value is in progress, once done this will become optional |
