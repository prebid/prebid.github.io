---
layout: api_prebidjs
title: pbjs.getConsentMetadata()
description: getConsentMetadata API
sidebarType: 1
---

The `getConsentMetadata()` function returns basic information about the consent data Prebid has collected. It does not return the consent strings themselves.

The returned object always has a key for each consent type: `gdpr`, `usp`, `gpp`, `gcm` and `coppa`. Types for which no consent data is available (for example because their consent management module is not included or configured, or consent data could not be retrieved) are `undefined`.

{: .table .table-bordered .table-striped }
| Key | Value |
| --- | --- |
| `gdpr` | `{ gdprApplies, consentStringSize, apiVersion, generatedAt }`, where `consentStringSize` is the length of the TC string. `undefined` if the CMP did not provide TCF data. |
| `usp` | `{ generatedAt }` |
| `gpp` | `{ generatedAt }` |
| `gcm` | `{ generatedAt }` |
| `coppa` | `true` or `false`, from the `coppa` configuration |

`generatedAt` is the time (in milliseconds since the epoch) at which Prebid last received consent data of that type.

```javascript
pbjs.getConsentMetadata() // returns e.g.
{
    "coppa": false,
    "gdpr": {
        "apiVersion": 2,
        "consentStringSize": 100,
        "gdprApplies": true,
        "generatedAt": 1644358143306
    },
    "usp": {
        "generatedAt": 1644358143306
    },
    "gpp": undefined,
    "gcm": undefined
}
```

{: .alert.alert-info :}
Before Prebid 9.0, `usp` also contained the US Privacy string, as `usp`.
