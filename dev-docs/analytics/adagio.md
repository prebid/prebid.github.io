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

#### Transaction IDs

The Adagio Analytics adapter requires that the `enableTIDs` option is set to true or it will not produce any analytics.

```js
  pbjs.setConfig({
      enableTIDs: true,
  })
```

#### Example Configuration

```js
  pbjs.que.push(function () {
    pbjs.enableAnalytics({
      provider: 'adagio',
    });
  });
```
