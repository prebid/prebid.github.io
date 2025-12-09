---
layout: bidder
title: APS
description: Prebid APS Bidder Adapter
biddercode: aps
tcfeu_supported: true
dsa_supported: false
gvl_id: 793
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: display, video
deals_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: true
pbjs: true
pbs: false
prebid_member: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Bidder Config Params

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                              | Example                           | Type      |
| ------------------ | -------- | ---------------------------------------- | --------------------------------- | --------- |
| `aps.accountID`    | required | APS-provided ID                          | `1234`                            | `string`  |
| `aps.debugURL`     | optional | Bid endpoint                             | `https://example.com/bid`         | `string`  |
| `aps.debug`        | optional | Toggle to enable / disable debug mode    | `true`                            | `boolean` |
| `aps.renderMethod` | optional | Debug mode render method                 | `fif`                             | `string`  |
| `aps.creativeURL`  | optional | Creative rendering URL                   | `https://example.com/creative.js` | `string`  |
| `aps.telemetry`    | optional | Toggle to enable / disable APS telemetry | `true`                            | `boolean` |

### Bid Params

None.

## User Syncs

If you'd like to activate user syncs through APS, you must activate iframe syncing.

```javascript
window.pbjs.que.push(function () {
  window.pbjs.setConfig({
    userSync: {
      filterSettings: {
        iframe: {
          bidders: ['aps'],
          filter: 'include',
        },
      },
    },
  });
});
```
