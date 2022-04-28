---
layout: analytics
title: PubMatic
description: PubMatic Analytics Adapter
modulecode: pubmatic
prebid_member: true
gvl_id: 76
enable_download: false
---

#### Registration

The PubMatic Analytics adapter requires setup and approval from the
PubMatic team. Please reach out to your account team for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| publisherId | required  | The PubMatic Publisher ID | 1001  | int |

### Example Configuration

```
    pbjs.enableAnalytics({
        provider: 'pubmatic',
        options: {
            "publisherId": 12345 // please contact PubMatic to get a publisherId for yourself
        }
    });
```
