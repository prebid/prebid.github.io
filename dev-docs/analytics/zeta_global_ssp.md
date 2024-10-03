---
layout: analytics
title: Zeta Global Ssp
description: Zeta Global Ssp Prebid Analytics Adapter
modulecode: zeta_global_ssp
tcfeu_supported: true
usp_supported: true
prebid_member: true
gvl_id: 833
enable_download: false
pbjs: true
pbjs_version_notes: v6.5.0 and later
---

#### Registration

Please visit [zetaglobal.com](https://zetaglobal.com/) for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| sid | required  | The Zeta Global Ssp Publisher ID | `111`  | `int` |
| tags | optional | The object containing set of Zeta's custom tags witch the publisher has to supply | `tags: {}` | `object` |

### Example Configuration

```javascript
pbjs.enableAnalytics({
     provider: 'zeta_global_ssp',
     options: {
         sid: 111,
         tags: {
             ...
         }
     }
 });
```
