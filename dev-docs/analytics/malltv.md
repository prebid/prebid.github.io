---
layout: analytics
title: MallTv
description: MallTv Analytics Adapter
modulecode: malltvAnalytics
enable_download: true
---

#### Registration

This is currently a private adapter

#### Analytics Options

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| provider | Required | String | The name of this module: `malltvAnalytics` | `malltvAnalytics` |
| options.propertyId | Required | String | This is the property id of the website where this adapter is being used. | `123456` |
| options.server | Optional | String | Overrides the server used for sending analytics | `https://central.mall.tv/analytics` |


### Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'malltvAnalytics',
    options: {
        propertyId: '123456',
        server: 'https://central.mall.tv/analytics'
    }
});
```
