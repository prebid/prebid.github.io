---
layout: analytics
title: Adagio
description: Adagio Analytics Adapter
modulecode: adagio
prebid_member: true
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gvl_id: 617
enable_download: true
---

#### Registration

The Adagio Analytics adapter requires setup and approval from the Adagio team. Please reach out to <contact@adagio.io> for more information.

#### Example Configuration

```js
  pbjs.que.push(function () {
    pbjs.enableAnalytics({
      provider: 'adagio',
      options: {
        organizationId: "16421", // provided during integration
        site: "my-website", // provided during integration
      }
    });
  });
```
