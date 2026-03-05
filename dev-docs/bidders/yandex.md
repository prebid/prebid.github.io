---
layout: bidder
title: Yandex
description: Prebid Yandex Bidder Adapter
pbjs: true
biddercode: yandex
media_types: banner
sidebarType: 1
privacy_sandbox: topics
---

### Prebid Client

This Adapter integrates with Yandex's ad services. Please reach out to <prebid@yandex-team.com> for the integration guide and more details.

{: .alert.alert-info :}
For detailed auction analytics, check out our [Analytics Adapter](/dev-docs/analytics/yandex.html).

{: .alert.alert-info :}
To improve the personalization of ads for publishers’ users, check out our [User ID Module](/dev-docs/modules/userid-submodules/yandex.html).

#### Client Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope                                              | Description                                        | Example                           | Type      |
| ------------- | -------------------------------------------------- | -------------------------------------------------- | --------------------------------- | --------- |
| `placementId` | required                                           | Ad unit ID. Prebid versions > 7.30                 | `R-A-1234567-1`                   | `String`  |
| `cur`         | optional                                           | CPM currency to be received. Prebid versions > 8.4 | `CHF`, `GBP`, `USD`, `EUR`, `TRY` | `String`  |
| `pageId`      | optional, **deprecated** in favor of `placementId` | Page ID                                            | `123`                             | `Integer` |
| `impId`       | optional, **deprecated** in favor of `placementId` | Imp ID                                             | `1`                               | `Integer` |

#### Client Test Parameters

```js
// Simple banner
const adUnits = [{
  code: 'adunit-1',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    }
  },
  bids: [
    {
      bidder: 'yandex',
      params: {
        placementId: 'R-A-1234567-1',
        cur: 'USD',
      },
    }
  ]
}];
```

#### Topics Iframe Configuration

[Topics First Party Data (FPD) Module](/dev-docs/modules/topicsFpdModule.html) `topicsFpdModule` should be included in prebid final package to call topics API.

```js
pbjs.setConfig({
  userSync: {
    // ...,
    topics: {
      bidders: [{
        bidder: 'yandex',
        iframeURL: 'https://yandex.ru/ads/prebid/topics_frame.html'
      }]
    }
    // ...
  }
})
```
