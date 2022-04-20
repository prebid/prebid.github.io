---
layout: bidder
title: Aax
description: Prebid Aax Bidder Adaptor
biddercode: aax
gdpr_supported: true  
media_types: banner,native
usp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: false
pbjs: false
gvl_id: 142
schain_supported: true
floors_supported: true
fpd_supported: true
pbs: true
safeframes_ok: true
multiformat_supported: will-not-bid
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `cid`      | required | The customer id provided by Aax. | `'aax_test_customer'` | `string` |
| `crid`     | required | The placement id provided by Aax. | `'aax_crid'`   | `string` |

#### Example of Native Ad-unit
```
var adUnits = [{
  code: 'div-gpt-ad-6874091242345-0',
  mediaTypes: {
    native: {
      image: {
        required: true,
        sizes: [300, 250],
        wmin: 50,
      },
      title: {
        required: true,
        len: 80
      }
    }
  },
  bids: [{
    bidder: 'aax',
    params: {
      cid: 'aax_test_customer',
      crid: 'aax_crid'
    }
  }]
}];
```

#### Example of Banner Ad-unit
```
var adUnits = [{
  code: 'div-gpt-ad-6874091242345-0',
  mediaTypes: {
    banner: {
      sizes: [
        [728, 90],
        [300, 600],
        [300, 250]
      ],
    }
  },
  bids: [{
    bidder: 'aax',
    params: {
      cid: 'aax_test_customer',
      crid: 'aax_crid'
    }
  }]
}];
```
