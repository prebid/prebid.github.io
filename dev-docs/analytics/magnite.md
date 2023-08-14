---
layout: analytics
title: Magnite
description: Magnite Prebid Analytics Adapter
modulecode: magnite
tcfeu_supported: true
usp_supported: true
coppa_supported: true
prebid_member: true
gvl_id: 52
enable_download: false
---

#### Registration

The Magnite analytics adapter requires setup and approval from the
Magnite team, even for existing accounts. Please reach out to your account
team or <globalsupport@magnite.com> for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| accountId | required  | The Magnite publisher account ID | `'1001'`  | string |
| endpoint | required | The URL where analytics data is sent   | `'https://example.rp.com'`  | string |

### Example Configuration

```
  pbjs.enableAnalytics({
    provider: 'magnite',
    options: {
        accountId: MAGNITE-ACCOUNT-ID,
        endpoint: 'OBTAIN-FROM-MAGNITE'
    }
  });
```
