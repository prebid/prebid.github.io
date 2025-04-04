---
layout: bidder
title: BeOp
description: BeOp Bidder Adaptor
pbjs: true
pbs: false
media_types: banner
biddercode: beop
tcfeu_supported: true
gvl_id: 666
usp_supported: false
floors_supported: true
schain_supported: true
sidebarType: 1
---

### Disclosure

The BeOp bidder adapter requires an `accountId` or `networkId`, which you can retrieve from your BeOp platform dashboard (as a publisher, reseller, or media group). To activate BeOp demand on your account, please contact your account manager or reach out to <publishers@beop.io>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-------------|---------|----------|
| `accountId` or `networkId` | required | Your BeOp account ID (24-character hex string) | `'5a8af500c9e77c00017e4cad'` | `string` |
| `networkPartnerId` | optional | Your internal network partner ID (used for advanced partner tracking) | `'MY-WEBSITE-123'` | `string` |
| `currency` | optional | Preferred bidding currency (defaults to `'EUR'`) | `'EUR'` or `'USD'` | `string` |
| `keywords` | optional | Contextual keywords string or array to help target your campaign | `'cars, racing'` or `['cars', 'racing']` | `string/array` |

### User Syncs

BeOp supports iframe and pixel-based user syncs using the `getUserSyncs` method.

{: .table .table-bordered .table-striped }
| Type | Supported | Description |
|------|-----------|-------------|
| iframe | yes | A sync iframe may be returned by the bidder response via `syncFrame`. |
| pixel | yes | Additional sync pixels can be returned via `syncPixels` array in the bid response body. |

> Syncs are GDPR-aware and only triggered when appropriate consent is provided.

### GDPR Compliance

- Vendor ID: `666`
- BeOp supports TCFv2 and relies on the `gdprApplies` and `consentString` fields in the bid request.
- If no valid consent is found, external user syncs will be disabled.

### Cookie Usage

BeOp sets a first-party cookie `beopid` for frequency capping and user session purposes. This ID is anonymized and used to improve campaign performance, capping logic, and personalization within publisher domains.

### Test Parameters

```js
var adUnits = [
  {
    code: "div-id",
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250],
          [1, 1],
        ],
      },
    },
    bids: [
      {
        bidder: "beop",
        params: {
          accountId: "5a8af500c9e77c00017e4cad",
          currency: "EUR",
          keywords: ["sports", "elections"],
        },
      },
    ],
  },
];
```
