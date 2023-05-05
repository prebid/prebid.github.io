---
layout: analytics
title: adWMG
description: adWMG Analytics Adapter
modulecode: adWMG
gdpr_supported: true
usp_supported: false
coppa_supported: false
prebid_member: false
gvl_id: 959
---

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| publisher_id | required  | Publisher ID from WMG Dashboard | `'5abd0543ba45723db49d97ea'`  | string |
| site | required | Domain where Prebid.js working   | `'test.com'` | string |


### Example Configuration

```
  pbjs.enableAnalytics({
  provider: 'adWMG',
    options : {
          site: 'test.com',
          publisher_id: '5abd0543ba45723db49d97ea'
  }});
```
#### Registration

Please visit [https://adwmg.com/](https://adwmg.com/) for more information.
