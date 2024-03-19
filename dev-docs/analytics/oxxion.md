---
layout: analytics
title: Oxxion
description: oxxion Prebid Analytics Adapter
modulecode: oxxion
tcfeu_supported: false
usp_supported: false
coppa_supported: false
prebid_member: false
enable_download: true
---

#### Registration

The Oxxion Analytics Adapter requires setup and approval from the
Oxxion team. Please reach out to <contact@oxxion.io> for more information.

#### Analytics Options

| Name   | Scope    | Description                                         | Example            | Type   |
|--------|----------|-----------------------------------------------------|--------------------|--------|
| domain | required | The oxxion subdomain where analytics data is sent   | `'test.endpoint'`  | string |

### Example Configuration

```javascript
pbjs.enableAnalytics(
  //...
  {
    provider: 'oxxion',
    options : {
          domain: 'test.endpoint'
    }
  }
  //...
)
```
