---
layout: bidder
title: Mobkoi
description: Mobkoi Bidder Adapter
biddercode: mobkoi
# aliasCode: fileContainingPBJSAdapterCodeIfDifferentThenBidderCode
tcfeu_supported: true
dsa_supported: false
gvl_id: 898
usp_supported: false
coppa_supported: false
gpp_sids: tcfeu
schain_supported: false
dchain_supported: /false
userId: mobkoiId
media_types: banner
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
privacy_sandbox: no
sidebarType: 1
---

### Note

The Mobkoi Bidding adapter requires setup and approval before beginning. Please reach out to <platformteam@mobkoi.com> for
more details.

### Bid Params

No bid params are needed as Mobkoi Adapters rely on First Party Data.

### Setting First Party Data (FPD)

Publishers should use the `pbjs.setBidderConfig` method of setting First Party Data. The following fields are supported:

| Path                                        | Scope    | Description                  | Example                   | Type      |
|---------------------------------------------|----------|------------------------------|---------------------------|-----------|
| `ortb2.site.publisher.id`                   | required | Mobkoi Provided Publisher ID | `'mobkoi-publisher-id'`   | `string`  |
| `ortb2.site.publisher.ext.adServerBaseUrl`  | required | Ad Server URL                | `'https://adserver.com'`  | `string`  |

#### Example Configuration

```js
const adUnits = [
  {
    code: 'banner-ad',
    mediaTypes: {
      banner: { sizes: [300, 200] },
    },
    bids: [
      {
        bidder: 'mobkoi',
      },
    ],
  },
];

pbjs.que.push(function () {
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

  pbjs.addAdUnits(adUnits);
});
```
