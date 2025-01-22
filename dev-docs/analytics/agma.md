---
layout: analytics
title: agma
description: agma Analytics Adapter
modulecode: agma
tcfeu_supported: true
usp_supported: false
coppa_supported: false
prebid_member: false
gvl_id: 1122
---

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| code | required  | Provided by agma | `'my-code'`  | string |

### Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'agma',
    options: {
        code: 'provided-by-agma'    // change to the code you received from agma
    }
});
```

#### Registration

Please contact [team-internet@agma-mmc.de](mailto:team-internet@agma-mmc.de) for signup.
