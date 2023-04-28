---
layout: bidder
title: Relevant Digital
description: Relevant Digital Bid Adapter
biddercode: relevantdigital
pbjs: true
gdpr_supported: true
usp_supported: true
coppa_supported: false
schain_supported: true
floors_supported: true
media_types: banner, video, native
userIds: all
prebid_member: true
safeframes_ok: true
deals_supported: true
pbs: false
pbs_app_supported: false
fpd_supported: true
ortb_blocking_supported: no
gvl_id: 1100
multiformat_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                             | Example                    | Type         |
|---------------|----------|---------------------------------------------------------|----------------------------|--------------|
| `placementId`       | required | The placement id.  | `'6204e83a077_620f9e8e4fe'`      | `String`     |
| `pbsHost` | required if not set in config | Host name of the server. | `'pbs-example.relevant-digital.com'`                | `String`     |
| `accountId`        | required if not set in config | The account id.  | `'6204e5fa70e3ad108'`               | `String`      |
| `useSourceBidderCode`        | optional | Set to `true` in order to use the bidder code of the actual server-side bidder in bid responses. You **MUST** also use `allowAlternateBidderCodes: true` in `bidderSettings` if you enabled this - as otherwise the bids will be rejected.| `true`               | `Boolean`      |

### Config Parameters

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                             | Example                    | Type         |
|---------------|----------|---------------------------------------------------------|----------------------------|--------------|
| `pbsHost` | required if not set in bid parameters | Host name of the server. | `'pbs-example.relevant-digital.com'`                | `String`     |
| `accountId`        | required if not set in bid parameters | The account id.  | `'6204e5fa70e3ad108'`               | `String`      |
| `pbsBufferMs` | optional | How much less in *milliseconds* the server's internal timeout should be compared to the normal Prebid timeout. Default is *250*. To be increased in cases of frequent timeouts. | `250`                | `Integer`     |
| `useSourceBidderCode`        | optional | Set to `true` in order to use the bidder code of the actual server-side bidder in bid responses. You **MUST** also use `allowAlternateBidderCodes: true` in `bidderSettings` if you enabled this - as otherwise the bids will be rejected.| `true`               | `Boolean`      |

### Example setup using pbjs.setConfig()
This is the recommended method to set the global configuration parameters.
```javascript
pbjs.setConfig({
  relevantdigital: {
    pbsHost: 'pbs-example.relevant-digital.com',
    accountId: '6204e5fa70e3ad10821b84ff',
  },
});

var adUnits = [
  {
    code: 'test-div',
    mediaTypes: { banner: { sizes: [[300, 250], [320, 320]] }},
    bids: [
      {
        bidder: 'relevantdigital',
        params: {
          placementId: '6204e83a077c5825441b8508_620f9e8e4fe67c1f87cd30ed',
        }
      }
   ],
  }
];
```
# Example setup using only bid params
This method to set the global configuration parameters (like **pbsHost**) in **params** could simplify integration of a provider for some publishers. Setting different global config-parameters on different bids is not supported in general*, as the first settings found will be used and any subsequent global settings will be ignored.

 * _The exception is `useSourceBidderCode` which can be overriden individually per ad unit._
```javascript
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: { banner: { sizes: [[300, 250], [320, 320]] }},
    bids: [
      {
        bidder: 'relevantdigital',
        params: {
          placementId: '6204e83a077c5825441b8508_620f9e8e4fe67c1f87cd30ed',
          pbsHost: 'pbs-example.relevant-digital.com',
          accountId: '6204e5fa70e3ad10821b84ff',
        }
      }
   ],
  }
];
```

### Example setup with multiple providers
**Notice:** Placements below are _not_ live test placements
```javascript

pbjs.aliasBidder('relevantdigital', 'providerA');
pbjs.aliasBidder('relevantdigital', 'providerB');

pbjs.setConfig({
  providerA: {
    pbsHost: 'pbs-example-a.relevant-digital.com',
    accountId: '620533ae7f5bbe1691bbb815',
  },
  providerB: {
    pbsHost: 'pbs-example-b.relevant-digital.com',
    accountId: '990533ae7f5bbe1691bbb815',
  },  
});

var adUnits = [
  {
    code: 'test-div',
    mediaTypes: { banner: { sizes: [[300, 250], [320, 320]] }},
    bids: [
      {
        bidder: 'providerA',
        params: {
          placementId: '610525862d7517bfd4bbb81e_620523b7d1dbed6b0fbbb817',
        }
      },
      {
        bidder: 'providerB',
        params: {
          placementId: '990525862d7517bfd4bbb81e_770523b7d1dbed6b0fbbb817',
        }
      },      
   ],
  }
];
```

