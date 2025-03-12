---
layout: analytics
title: Mobkoi
description: Mobkoi Analytics Adapter
modulecode: mobkoi
prebid_member: false
tcfeu_supported: true
usp_supported: false
coppa_supported: false
gvl_id: 898
enable_download: true
---

#### Registration

The Mobkoi Analytics adapter requires setup and approval. Please send an email to <platformteam@mobkoi.com> for more information.

### Setting First Party Data (FPD)

Publishers should use the `pbjs.setBidderConfig` method of setting First Party Data. The following fields are supported:

| Path                                        | Scope    | Description                  | Example                   | Type      |
|---------------------------------------------|----------|------------------------------|---------------------------|-----------|
| `ortb2.site.publisher.id`                   | required | Mobkoi Provided Publisher ID | `'mobkoi-publisher-id'`   | `string`  |
| `ortb2.site.publisher.ext.adServerBaseUrl`  | required | Ad Server URL                | `'https://adserver.com'`  | `string`  |

#### Example Configuration

```js
pbjs.que.push(function () {
  pbjs.enableAnalytics([
    {
      provider: 'mobkoi',
    },
  ]);

  pbjs.setBidderConfig({
    bidders: ['mobkoi'],
    config: {
      ortb2: {
        site: {
          publisher: {
            id: '<<-- Required. Provided Mobkoi Publisher ID -->>',
            ext: {
              adServerBaseUrl: '<<-- Required. Provided by Mobkoi -->>',
            },
          },
        },
      },
    },
  });
});
```
