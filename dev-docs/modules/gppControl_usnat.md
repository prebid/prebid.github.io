---
layout: page_v2
page_type: module
title: GPP Control - USNat
description: If your CMP populates section 7 of the Global Privacy Platform, the USNat string, this module complements the `consentManagementGpp` module to control Prebid.js accordingly.
module_code : gppControl_usnat
display_name : GPP Control - USNat
enable_download : true
recommended: true
min_js_version: 8.2.0
sidebarType : 1
---

# GPP Control Module - USNat string
{: .no_toc }

- TOC
{: toc }

{% include legal-warning.html %}

## Overview

This consent management control module is designed to support the [Global Privacy Platform](https://iabtechlab.com/gpp/) Section 7 string, USNat. For more Prebid-related background, see [Prebid MSPA Support](/features/mspa-usnat.html). In sum, the USNat string is intended to unify various state laws into a single privacy string, with participants' behavior governed by the IAB's ([MSPA](https://www.iabprivacy.com/#)). It is intended to complement, not replace, the GPP consent management module, which gathers GPP consent strings and makes them available to vendor integrations. The goal is to gather sensible and conservative [activity controls](/dev-docs/dev-docs/activity-controls.html) for elements of Prebid.js given various expressions of the [USNat consent string](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md).

This module does not support any other GPP section id or local GPP api. For US state section see the [GPP Control - US State module](/dev-docs/modules/gppControl_usstates.html). In order to control activities in a section without a control module, publishers can express their controls directly in the syntax of the [activity control infrastructure](/dev-docs/dev-docs/activity-controls.html). If a publisher wants finer control over section 7 implications on Prebid.js behavior than this module provides (eg not invalidating certain strings), they are able to achieve that using the activity control syntax as an alternative to this module.

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws. **We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach. This module is not yet intended to replace other consent modules; it supplements them.**

## Page Integration

This module activates if the `gpp` object in the consent management configuration section exists and the consentManagementGpp module exists. See that [module's documentation](/dev-docs/modules/consentManagementGpp.html) for parameter definitions. This module does **not** work with static GPP section 7 strings provided in the first-party data `regs.gpp` object, but **does** work if the `gpp.cmpApi` is set to `static` and `gpp.consentData` is appropriately populated via setConfig.

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module and the GPP Control - USNat module, an additional option must be added to the **gulp build** command:

```bash
gulp build --modules=consentManagementGpp,gppContol_usnat,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Further Reading

- [IAB Global Privacy Platform Full Specification Repository](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform)
- [IAB Global Privacy Platform CMP API Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md)
- [IAB Global Privacy Platform USNat string Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md)
- [Prebid MSPA Support](/features/mspa-usnat.html)
- [Prebid Activity Controls](/dev-docs/dev-docs/activity-controls.html)
- [Prebid Consent Management - US Privacy Module](/dev-docs/modules/consentManagementUsp.html)
- [Prebid Consent Management - GPP Module](/dev-docs/modules/consentManagementGpp.html)
- [Prebid Consent Management - GPP Control - US States module](/dev-docs/modules/gppControl_usstates.html)
- [CMP Best Practices](https://docs.prebid.org/dev-docs/cmp-best-practices.html)
