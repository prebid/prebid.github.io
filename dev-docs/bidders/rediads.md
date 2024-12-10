---
layout: bidder
title: Rediads
description: Prebid Rediads Bidder Adapter
biddercode: rediads
prebid_member: false
media_types: banner, video, native
pbjs: true
pbs: false
gvl_id: none
tcfeu_supported: true
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

## Features

| Attribute                  | Value                     |
|----------------------------|---------------------------|
| *Bidder Code*            | rediads                  |
| *Prebid.org Member*      | no                        |
| *Prebid.js Adapter*      | yes                       |
| *Prebid Server Adapter*  | no                        |
| *Media Types*            | banner, video, native     |
| *Multi Format Support*   | will-bid-on-one           |
| *TCF-EU Support*         | yes                       |
| *IAB GVL ID*             | none                      |
| *GPP Support*            | no                        |
| *USP/CCPA Support*       | yes                       |
| *COPPA Support*          | no                        |
| *Supply Chain Support*   | yes                       |
| *Demand Chain Support*   | no                        |
| *Safeframes OK*          | no                        |
| *Supports Deals*         | no                        |
| *Floors Module Support*  | yes                       |
| *First Party Data Support* | yes                     |
| *User IDs*               | none                      |
| *ORTB Blocking Support*  | partial (bcat only)       |
| *Privacy Sandbox*        | no                        |
| *Prebid Server App Support* | no                     |

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                 | Example              | Type           |
|--------------|----------|-----------------------------------------------------------------------------|----------------------|----------------|
| account_id | required | Account ID generated on the Rediads Platform.                              | '12345'            | string       |
| site       | optional | Site domain name.                                                          | 'rediads.com'      | string       |
| slot       | optional | Unique identifier for the ad slot generated on the platform.               | '54321'            | string       |

---

### Enabling Test Bids

To enable test bids for the Rediads Bidder Adapter, append rediads-test-bid to the hash of the page URL.

For example:

- *Localhost:* [http://localhost:8000/xyz#rediads-test-bid](http://localhost:8000/xyz#rediads-test-bid)
- *Production URL:* [https://domain.com/page#rediads-test-bid](https://domain.com/page#rediads-test-bid)

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
          site: 'rediads.com',
          slot: '54321'
        }
      }
    ]
  }
];
