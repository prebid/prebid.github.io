---
layout: bidder
title: Rediads
description: Prebid Rediads Bidder Adapter
biddercode: rediads
prebid_member: false
media_types: banner, video, native
pbjs: true
pbs: true
tcfeu_supported: false
usp_supported: true
coppa_supported: false
schain_supported: true
dchain_supported: false
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: true
ortb_blocking_supported: partial
privacy_sandbox: no
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                 | Example              | Type           |
|--------------|----------|-----------------------------------------------------------------------------|----------------------|----------------|
| account_id   | required | Account ID generated on the Rediads Platform.                               | '123xyz'             | string       |
| endpoint     | optional | Only to be used if RediAds team provides you with one.                      | 'bidding2'        | string       |
| slot         | optional | Unique identifier for the ad slot generated on the platform.                | '54321'              | string       |

---

### Enabling Test Bids

To enable test bids for the Rediads Bidder Adapter, append rediads-test-bids to the hash of the page URL.

For example:

- *Localhost:* [http://localhost:8000/xyz#rediads-test-bid](http://localhost:8000/xyz#rediads-test-bids)
- *Production URL:* [https://domain.com/page#rediads-test-bid](https://domain.com/page#rediads-test-bids)

This will activate test bids for debugging and validation purposes.

---

### AdUnit Examples

#### AdUnit Format for Banner

```javascript
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600]]
      }
    },
    bids: [
      {
        bidder: 'rediads',
        params: {
          account_id: '12345',
          slot: '54321'
        }
      }
    ]
  }
];
```

### First Party Data Support
The following fields are supported for First Party Data (FPD):

- `ortb2.site.*`
- `ortb2.publisher.*`
- `ortb2.content.*`
- `ortb2.devices.locations parameters`

For additional implementation or support, contact us at <support@rediads.com>.
