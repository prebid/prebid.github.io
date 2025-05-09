---
layout: analytics
title: Roxot
description: Roxot Analytics Adapter
modulecode: roxot
---

#### Registration

To start using Prebid Analytics, please, email us at <contact@roxot.com> to provide us with your billing info and get your personal publisher ID which is used in the prebid config on your site/s.

Add the following code to your prebid.js config to activate Prebid Analytics:

#### Example Configuration

```

pbjs.que.push(function () {
    pbjs.enableAnalytics({
        provider: 'roxot',
        options: {
            publisherIds: ["YOUR-PUBLISHER-ID"]
        }
    });
});
```
