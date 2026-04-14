---
layout: bidder
title: Akcelo
description: Prebid Akcelo Bidder Adapter
biddercode: akcelo
pbjs: true
pbs: true
gvl_id: none
tcfeu_supported: false
usp_supported: false
userIds: all
media_types: banner, native, video
coppa_supported: false
schain_supported: true
dchain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
ortb_blocking_supported: false
multiformat_supported: will-bid-on-any
privacy_sandbox: no
sidebarType: 1
---

### Registration

The Akcelo bidder adapter requires setup and approval from the Akcelo service team.
Please reach out to your account manager or <publisher@akcelo.io> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                              | Example | Type      |
|------------|----------|--------------------------------------------------------------------------|---------|-----------|
| `siteId`   | required | The identifier of the site. Will be provided by your account manager.    | `763`   | `integer` |
| `adUnitId` | required | The identifier of the ad unit. Will be provided by your account manager. | `7965`  | `integer` |
| `test`     | optional | Whether to display test creatives or not. Default is 0.                  | `1`     | `integer` |

### Configuration Example

```html

<script>
  const adUnits = [
    {
      code: 'div-123',
      mediaTypes: {
        banner: {
          sizes: [
            [300, 250],
            [300, 600],
          ],
        },
        video: {
          context: "outstream",
          playerSize: [[640, 480]],
          mimes: ['video/mp4'],
          protocols: [1, 2, 3, 4, 5, 6, 7, 8],
          playbackmethod: [1],
          skip: 1,
          api: [2],
          minbitrate: 1000,
          maxbitrate: 3000,
          minduration: 3,
          maxduration: 10,
          startdelay: 2,
          placement: 4,
          linearity: 1
        },
      },
      bids: [
        {
          bidder: 'akcelo',
          params: {
            siteId: 763, // required
            adUnitId: 7965, // required
            test: 1, // optional
          },
        },
      ],
    },
  ];

  pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
  });
</script>
```

### User Sync

Akcelo strongly recommends enabling user syncing through iFrames. This functionality
improves DSP user match rates and increases the bid rate and bid price.

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['akcelo'],
        filter: 'include',
      },
    },
  },
});
```

### First Party Data

Akcelo supports both `ortb2` and `ortb2Imp` methods to set [First Party Data](/features/firstPartyData.html).

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                     | Example           | Type           |
|-------------------|----------|-------------------------------------------------------------------------------------------------|-------------------|----------------|
| `ortb2.site`      | optional | Information about the publisher's website provided through an OpenRTB Site object.              | N/A               | `object`       |
| `ortb2.user`      | optional | Information about the advertising device's human user, provided through an OpenRTB User object. | N/A               | `object`       |
| `ortb2.device`    | optional | Information about the user's device provided through an OpenRTB device object.                  | N/A               | `object`       |
