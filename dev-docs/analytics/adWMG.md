---
layout: analytics
title: adWMG
description: adWMG Analytics Adapter
modulecode: adWMGAnalyticsAdapter
gdpr_supported: true
usp_supported: false
coppa_supported: false
prebid_member: true
gvl_id: 959
---

### BidParams
{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                     | Example                      | Type               |
|-----------------|----------|---------------------------------|------------------------------|--------------------|
| `publisher_id`  | required | Publisher ID from WMG Dashboard | `'5abd0543ba45723db49d97ea'` | `string`           |
| `site`          | required | Domain where Prebid.js working  | `'test.com'`                 | `string`           |


### Analytics Unit Setup
```javascript
{
  provider: 'adWMG',
    options : {
          site: 'test.com',
          publisher_id: '5abd0543ba45723db49d97ea'
    }
}
```
