---
layout: bidder
title: Teal
description: Teal Bid Adapter
biddercode: teal
prebid_member: true
gvl_id: 1378
schain_supported: true
dchain_supported: true
tcfeu_supported: true
dsa_supported: true
deals_supported: true
floors_supported: true
usp_supported: true
coppa_supported: true
fpd_supported: true
gpp_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
userIds: all
safeframes_ok: true
media_types: banner
pbjs: true
pbs: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|-----------------------------------------------------------------|---------------------------------|----------|
| `account` | required | Account name provided by your account manager - set to `test-account` for test mode | `myaccount` | `string` |
| `placement` | optional | Placement name provided by your account manager - set to `test-placement300x250` for test mode | `mysite300x250` | `string`|
| `testMode` | optional | Activate test mode - 100% test bids - placement needs be set to `test-placement300x250` for this option to work | `true` | `boolean` |
| `useSourceBidderCode` | optional | Use seat bidder code as hb_bidder, instead of teal (or configured alias) | `true` | `boolean` |
| `subAccount` | optional | subAccount name, if provided by your account manager | `my-sub-account` | `string` |

### Notes

- Specific ads.txt entries are required for the Teal bid adapter - please contact your account manager or <prebid@teal.works> for more details.
- For full functionality in GDPR territories, please ensure Teal Digital Group Ltd is configured in your CMP.

### Bidder Settings

The Teal bid adapter uses an iframe for user sync. This can be enabled like this:

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-ConfigureUserSyncing-UserSyncExamples
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: 'teal',
                filter: 'include'
            }
        }
    }
});
```

### Test Parameters

To enable 100% fill test ads, you can use the following `params`:

```javascript
{
  account: 'test-account',
  placement: 'test-placement300x250',
  testMode: true
}
```

This will produce a bid at $0.20 with a test creative.

Note that the parameters are case-sensitive. Please do not use these test parameters in production environments.
