---
layout: analytics
title: Tercept
description: Tercept Analytics Adapter
modulecode: tercept
---
#### Registration
To start using Prebid Analytics, please, email us at <contact@tercept.com> to provide us with your billing info and get your personal publisher ID & Key along with other details which are used in the prebid config on your site/s.
Add the following code to your prebid.js config to activate Prebid Analytics:
#### Example Configuration

```text
pbjs.que.push(function() {
    pbjs.enableAnalytics({
    provider: 'tercept',
    options: {
        pubId: <PUB_ID>,
        pubKey: <NETWORK_CODE>,
        host: <HOST_NAME>
        pathName: <PATH_NAME>
    }
});
});
```

Please visit <https://www.tercept.com/> for more information.
