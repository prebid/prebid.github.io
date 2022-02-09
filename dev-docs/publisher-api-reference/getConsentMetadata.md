---
layout: api_prebidjs
title: pbjs.getConsentMetadata()
description: 
---


The `getConsentMetadata()` function will return basic information about the status of supported (and configured!) consent content within Prebid.

```
pbjs.getConsentMetadata() // returns e.g.
{
    "coppa": false,
    "gdpr": {
        "apiVersion": 2,
        "consentStringExists": true,
        "gdprApplies": true,
        "timestamp": 1644358143306
    },
    "usp": {
        "timestamp": 1644358143306,
        "usp": "1YYY"
    }
}
```