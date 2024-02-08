---
layout: analytics
title: byData
description: byData Analytics Adapter
modulecode: bydata 
prebid_member: false
--- 

#### Registration

The byData Analytics adapter requires setup and approval from the
byData team. Please visit [bydata.com](https://bydata.com/) for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| clientId | Required  | String | The byData Client ID  | `asc10001` |
| logFrequency | Optional  | Int | Sample rate  | 100 |
  
### Example Configuration

```js
    pbjs.enableAnalytics({
        provider: "bydata",  
        options: {
            clientId:'asc10001',   // please contact byData team to get a clientId for yourself 
            logFrequency : 100,    // Default - 1%       
        }
    });
```
