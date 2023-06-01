---
layout: api_prebidjs
title: pbjs.getConsentMetadata()
description: getConsentMetadata API
sidebarType: 1
---


The `getConsentMetadata()` function will return basic information about the status of supported (and configured!) consent content within Prebid.

```
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
        "generatedAt": 1644358143306,
        "usp": "1YYY"
    }
}
```