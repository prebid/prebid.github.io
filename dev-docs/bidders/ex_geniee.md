---
layout: bidder
title: Geniee Exchange
description: Geniee Exchange Bidder Adapter
biddercode: ex_geniee
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
maintainer_email: aladdin-back@geniee.co.jp
sidebarType: 1
---
### Note

This is the [Geniee](https://geniee.co.jp) *Exchange* Bidder Adapter for Prebid.js.

{: .alert.alert-info :}
Geniee maintains three separate bid adapters. This adapter (`ex_geniee`) is independent of "Geniee SSP" (`ssp_geniee`, `zoneId` based) and "Geniee" (`dsp_geniee`, Geniee DSP) and can be used alongside them.

Please contact us at <aladdin-back@geniee.co.jp> before using the adapter. `partnerId` values are publisher-specific and are issued by Geniee; a generic value will not return bids.

Ads are served when all of the following conditions are satisfied:

- The ad unit declares `mediaTypes.banner` with valid sizes. Video- or native-only ad units are rejected. Multiformat ad units that include banner are accepted, but only the banner part is sent.
- Payment is possible in Japanese yen or US dollars.
- The request contains either `site` (with `site.page`) or `app` (with `app.bundle`).
- GDPR does not apply to the request. The Exchange does not serve GDPR territories, so consent signals are not forwarded and no request is sent when `gdprApplies` is true.

### Bid Params

{: .table .table-bordered .table-striped }
|      Name     |  Scope   |      Description                                                                                                                                                                                                                            |     Example      |   Type    |
|---------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|
| `partnerId`   | required | The per-publisher ID issued by Geniee. Must be an integer >= 1 (number only; string forms such as `'123'` are rejected).                                                                                                                    | `123`            | `integer` |
| `currency`    | optional | Currency setting, `'JPY'` or `'USD'`. When omitted, the currency module's `adServerCurrency` is used, then `'USD'`. If the resolved currency is neither `JPY` nor `USD`, no request is sent.                                                                                        | `'JPY'`          | `string`  |
| `placementId` | optional | Reporting label for the ad unit, defined by the publisher (not issued by Geniee). Use a fixed value per ad unit; if omitted, Geniee reports cannot be broken down by ad unit. Alphanumeric, hyphen and underscore, max 40 characters, case-insensitive. Sent as `imp.tagid`. | `'top-banner_1'` | `string`  |

### First Party Data

`ortb2` and `ortb2Imp` first party data are included in the OpenRTB request. Note the following:

- `imp.tagid` set through `ortb2Imp` is overridden when `params.placementId` is set.
- User IDs are read from `user.ext.eids` and mirrored to `user.eids`.
- The Exchange runs a first price auction only. If `at` is set to any value other than `1` through `ortb2`, no request is sent.

### User Sync

On a winning response the Exchange returns a single cookie-sync URL, which the adapter registers as an iframe sync. Only the iframe type is supported; no sync is registered on a no-bid.

Prebid disables iframe syncs by default, so publishers must allow them for this bidder:

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ['ex_geniee'],
                filter: 'include'
            }
        }
    }
});
```
