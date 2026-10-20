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
pbs: true
pbs_app_supported: false
prebid_member: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Prebid.js

### Bidder Config Params

{: .table .table-bordered .table-striped }

| Name                      | Scope    | Description                              | Example                           | Type      |
| ------------------------- | -------- | ---------------------------------------- | --------------------------------- | --------- |
| `aps.accountID`           | required | APS-provided ID                          | `1234`                            | `string`  |
| `aps.debugURL`            | optional | Bid endpoint                             | `https://example.com/bid`         | `string`  |
| `aps.debug`               | optional | Toggle to enable / disable debug mode    | `true`                            | `boolean` |
| `aps.renderMethod`        | optional | Debug mode render method                 | `fif`                             | `string`  |
| `aps.creativeURL`         | optional | Creative rendering URL                   | `https://example.com/creative.js` | `string`  |
| `aps.telemetry`           | optional | Toggle to enable / disable APS telemetry | `true`                            | `boolean` |
| `ortb2.regs.ext.agerange` | optional | US Age Law Compliance Value              | `3` (refer to the table below)    | `number`  |

#### Agerange Values

| Legally Defined Age Category | Simplified Category | Enumerated Value |
| ---------------------------- | ------------------- | ---------------- |
| Child (Under 13)             | Child               | 1                |
| Young Teenager (13-15)       | Teen                | 2                |
| Older Teenager (16-17)       | Teen                | 2                |
| Adult (18+)                  | Adult               | 3                |
| Unknown                      | Unknown             | 0                |

### Bid Params

None.

### User Syncs

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

## Prebid Server

The APS adapter is also available in Prebid Server, in both the Go (`prebid-server`) and Java (`prebid-server-java`) implementations. It serves web (site) banner and video inventory.

This adapter is currently in limited beta and requires an APS account. If you're interested in testing, please contact your APS Account Manager or reach out via the Help button in your portal.

### Prebid Server Bid Params

This integration requires an APS account ID configured as follows:

{: .table .table-bordered .table-striped }

| Name                                  | Scope    | Description                                                                                                        | Example | Type     |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ------- | -------- |
| `imp.ext.prebid.bidder.aps.accountID` | required | APS-provided publisher account ID. May instead be set once per request at `ext.prebid.bidderparams.aps.accountID`. | `1234`  | `string` |
| `imp.ext.prebid.bidder.aps.region`    | optional | User region; one of `na`, `eu`, `fe`. Defaults to `na`.                                                            | `na`    | `string` |
| `regs.ext.agerange`                   | optional | US age-law compliance value; see Agerange Values above.                                                            | `3`     | `number` |
| `test`                                | optional | Set to `1` to enable APS server-side debug (`amzn_debug_mode=1` on the bid endpoint).                              | `1`     | `number` |

```json
{
  "imp": [
    {
      "ext": {
        "prebid": {
          "bidder": {
            "aps": {
              "accountID": "1234",
              "region": "na"
            }
          }
        }
      }
    }
  ]
}
```
