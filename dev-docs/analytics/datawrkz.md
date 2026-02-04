---
layout: analytics
title: Datawrkz
description: Datawrkz Analytics Adapter
modulecode: datawrkzanalytics
prebid_member: false
tcfeu_supported: false
usp_supported: false
coppa_supported: false
gvl_id: none
enable_download: true
---

#### Registration

Using this adapter requires a **Publisher ID** and an **API Key**, issued by the Datawrkz team.  
Please contact [pubops@datawrkz.com](mailto:pubops@datawrkz.com) to create your account and obtain credentials.

#### About

This analytics adapter captures auction and render data from Prebid events and sends it to the Datawrkz API endpoint. The analytics for the  collected data can be accessed at [yieldopt.highr.ai](https://yieldopt.highr.ai/).

#### Integration

To incorporate this module into your `prebid.js`, compile the module using the following command:

```sh
gulp build --modules=datawrkzAnalyticsAdapter,<other modules...>
```

#### Page Configuration

```js
pbjs.que.push(function () {
  pbjs.enableAnalytics([{
    provider: 'datawrkzanalytics',
    options: {
      publisherId: 'YOUR_PUBLISHER_ID',
      apiKey: 'YOUR_API_KEY'
    }
  }]);
});
```
