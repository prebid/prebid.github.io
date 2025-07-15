---
layout: page_v2
page_type: module
title: Module - Storage Control
description: Check or enforce disclosure of device storage use
module_code : storageControl
display_name : storageControl
enable_download : true
recommended: true
sidebarType : 1
min_js_version: 10.0.0
---

# Storage Control Module

This module checks other modules' use of device storage against their disclosed list of storage keys and warns about or (optionally) denies undisclosed storage use.
Additionally, it provides an API to list all disclosed storage keys.

## Background

The TCF Global Vendor List (GVL) requires vendors to disclose their use of device storage by publishing a [JSON file](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/Vendor%20Device%20Storage%20%26%20Operational%20Disclosures.md) that lists all the identifiers (cookie names and/or localStorage keys) and their associated domains.
The Storage Control module uses that information to validate that when a Prebid module accesses storage, it uses identifiers that have been disclosed as in use for first party domains. 
Vendors not in the GVL can provide a disclosure JSON to Prebid directly - see [adapter integration](#adapter-integration) below. 

## Publisher Integration

Include this module in the Prebid bundle:

   ```bash
   gulp build --modules=storageControl,...
   ```

If you are instead using Prebid as an NPM dependency, you'll need to explicitly import disclosure metadata. 
This is done by including `metadata/prebid-core` and pairing each module import with a corresponding `import 'prebid.js/metadata/<module>'`. For example:

```javascript
import {pbjs} from 'prebid.js';
import 'prebid.js/modules/userId';
import 'prebid.js/modules/sharedIdSystem';

import 'prebid.js/metadata/prebid-core';
import 'prebid.js/metadata/userId';
import 'prebid.js/metadata/sharedIdSystem';

// ...
```

### Module Configuration

This module exposes a single configuration option `storageControl.enforcement`, e.g.:

```javascript
pbjs.setConfig({
  storageControl: {
    enforcement: 'off'
  }
})
```

Possible values for it are:

{: .table .table-bordered .table-striped }
|Value | Description |
| ------------ | ------------ |
|`'off''` | The default. Use of undisclosed storage keys only generates a console warning. |
|`'strict'` | Deny access to undisclosed storage keys |
|`'allowAliases'` | Deny access to undisclosed storage keys, unless the use is from an alias of a module that does disclose them, in which case only log a warning. This can happen for instance when a bidder provides an alias linked to a different vendor in the GVL. |

### Storage Disclosure Summary

With this module included, the `getStorageUseDisclosures` API returns a list of all disclosures pertaining the first party domain for all installed modules. For example:

```javascript
pbjs.getStorageUseDisclosures()

/**
    [
      {
        "disclosedIn": "https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/sharedId-optout.json",
        "disclosedBy": [
          "sharedIdSystem"
        ],
        "identifier": "_pubcid_optout",
        "type": "cookie",
        "maxAgeSeconds": 31536000,
        "cookieRefresh": false,
        "purposes": []
      },
      ...
    ]
 */
```

The return value follows the same format as the TCF [disclosures array](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/Vendor%20Device%20Storage%20%26%20Operational%20Disclosures.md), except that 

- `domain`/`domains` is omitted (and always `'*'` in the original disclosure, as Prebid's storage is always on the first party domain);
- each item in the array contains these additional fields:

{: .table .table-bordered .table-striped }
|Name | Type | Description |
| ------------ | ------------ | ------------ |
|`disclosedIn` | String | URL of the JSON containing this disclosure. Can be `null` for identifiers chosen trough publisher configuration - such as those set by the [userId module](/dev-docs/modules/userId.html) |
|`disclosedBy` | Array of Strings | Names of the Prebid modules providing this disclosure |

<a id="adapter-integration"></a>

## Adapter Integration

Modules that use storage should publish a [disclosure file](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/Vendor%20Device%20Storage%20%26%20Operational%20Disclosures.md) listing all keys that the pass to `storageManager` for the first party domain (`'*'`). This can be done by either:

- providing a GVL ID in your adapter. The corresponding `deviceStorageDisclosureUrl` from the GVL is then used as your disclosure.
- providing a `disclosureURL` directly. This does not require membership in the GVL, and overrides its disclosure if provided. For example:

```javascript
registerBidder({
  code: 'exampleBidder',
  disclosureURL: 'https://exampleBidder.com/disclosures.json'
})
```

## Related Reading

- [Vendor Device Storage & Operational Disclosures](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/Vendor%20Device%20Storage%20%26%20Operational%20Disclosures.md)
- [Consent string and vendor list formats](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md)
