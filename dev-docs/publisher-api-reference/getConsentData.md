---
layout: api_prebidjs
title: pbjs.getConsentData()
description: getConsentData API
sidebarType: 1
---

The `getConsentData()` function returns the consent data Prebid has collected (added in 11.54). For a summary without the consent strings, use [`getConsentMetadata()`](/dev-docs/publisher-api-reference/getConsentMetadata.html).

The returned object always has a key for each consent type. Types whose consent management module is not enabled are `null`.

{: .table .table-bordered .table-striped }
| Key | Value |
| --- | --- |
| `gdpr` | `{ gdprApplies, consentString, apiVersion, addtlConsent, vendorData }`, where `vendorData` is the data returned by the CMP |
| `usp` | The US Privacy string |
| `gpp` | `{ gppString, applicableSections, parsedSections, gppData }`, where `gppData` is the data returned by the CMP |
| `gcm` | Google Consent Mode signals, e.g. `{ ad_storage: 'granted', analytics_storage: 'denied' }` |
| `coppa` | `true` or `false`, from the `coppa` configuration |

```javascript
pbjs.getConsentData() // returns e.g.
{
    "coppa": false,
    "gdpr": {
        "apiVersion": 2,
        "consentString": "CQ...",
        "gdprApplies": true,
        "vendorData": { /* ... */ }
    },
    "usp": "1YNN",
    "gpp": null,
    "gcm": null
}
```

{: .alert.alert-warning :}
The returned object is the data Prebid uses in auctions. Do not modify it.

To be notified when consent changes, listen for the `consentDataChanged` event with [`onEvent`](/dev-docs/publisher-api-reference/onEvent.html).
