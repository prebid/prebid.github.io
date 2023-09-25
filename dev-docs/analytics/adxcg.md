---
layout: analytics
title: Adxcg
description: Adxcg Analytics Adapter
modulecode: adxcg
tcfeu_supported: false
usp_supported: false
coppa_supported: false
prebid_member: false
gvl_id: N/A
enable_download: false
---

#### Registration

The Adxcg analytics adapter requires setup and approval from the Adxcg team, even for existing accounts.
Please reach out to your account team or visit [www.adxcg.com](https://www.adxcg.com/) for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| publisherId | required  | The Adxcg publisher account ID | `'42'`  | string |

### Example Configuration

```
  pbjs.enableAnalytics({
    provider: 'adxcg',
    options: {
        publisherId: 'OBTAIN-FROM-ADXCG'        
    }
  });
```
