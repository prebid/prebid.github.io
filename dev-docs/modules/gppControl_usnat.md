---
layout: page_v2
page_type: module
title: GPP Control - usnat
description: If your CMP populates section 7 of the Global Privacy Platform, the usnat string, this module complements the `consentManagementGpp` module to control Prebid.js accordingly.
module_code : gppControl_usnat
display_name : GPP Control - usnat
enable_download : true
recommended: true
min_js_version: 8.2.0
sidebarType : 1
---

# GPP Control Module - usnat string

{: .no_toc }

- TOC
{: toc }

{% capture legalNotice %}
  This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company's collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European, Canadian and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  {% endcapture %}

{% include /alerts/alert_important.html content=legalNotice %}

## Overview

This consent management control module is designed to support the Global Privacy Platform section 7 string, usnat. ([GPP](https://iabtechlab.com/gpp/)) The usnat string is intended to unify various state laws into a single privacy string, with participants' behavior governed by the ([MSPA](https://www.iabprivacy.com/#)). It is intended to complement, not replace, the GPP consent management module, which gathers GPP consent strings and makes them available to vendor integrations. It also works with statically provided GPP section 7 strings. The goal is to gather sensible and conservative [activity control](/dev-docs/dev-docs/activity-controls.html) for elements of Prebid.js given various expressions of the [usnat consent string](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md). 

This module does not support any other GPP section id or local GPP api. Default controls for each section will be added as the section list grows and publishers request support. In order to control activities in a section without a control module, publishers can express their controls directly in the syntax of the [activity control infrastructure](/dev-docs/dev-docs/activity-controls.html).

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach. This module is not yet intended to replace other consent modules; it supplements them.**

## Page Integration

Here are the parameters supported in the `consentManagement` object specific to the GPP consent module:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gpp | `Object` | | |
| gpp.cmpApi | `string` | The CMP interface that is in use. Supported values are **'iab'** or **'static'**. Static allows integrations where IAB-formatted consent strings are provided in a non-standard way. Default is `'iab'`. | `'iab'` |
| gpp.timeout | `integer` | Length of time (in milliseconds) to allow the CMP to obtain the GPP consent information. Default is `10000`. | `10000` |
| gpp.consentData | `Object` | An object representing the IAB GPP consent data being passed directly; only used when cmpApi is 'static'. Default is `undefined`. | |
| gpp.consentData.sectionId | `integer` | Indicates the header section of the GPP consent string, recommended to be `3`. | |
| gpp.consentData.gppVersion | `integer` | The version number parsed from the header of the GPP consent string. | |
| gpp.consentData.sectionList | `Array of integers` | The sections contained within the encoded GPP string as parsed from the header. | |
| gpp.consentData.applicableSections | `Array of integers` | Section ID considered to be in force for this transaction.  In most cases, this field should have a single section ID. In rare occasions where such a single section ID can not be determined, the field may contain up to 2 values. The value can be 0 or a Section ID specified by the Publisher / Advertiser, during stub / load. When no section is applicable, the value will be -1. | |
| gpp.consentData.gppString | `String` | The complete encoded GPP string. | |
| gpp.consentData.pingData | `Object` | An object representing the current status of the CMP at the time consent data was fetched.  See PingReturn in [IAB's CMP API doc](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md#ping) for further information. |  |


### Examples

Example 1: 

```javascript

```


## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module and the GPP Control - usnat module, an additional option must be added to the **gulp build** command:

```bash
gulp build --modules=consentManagementGpp,gppContol_usnat,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Adapter Integration
## Further Reading

- [IAB Global Privacy Platform Full Specification Repository](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform)
- [IAB Global Privacy Platform CMP API Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md)
- [IAB Global Privacy Platform usnat string Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md)
- [Prebid Consent Management - US Privacy Module](/dev-docs/modules/consentManagementUsp.html)
- [Prebid Consent Management - GPP Module](/dev-docs/modules/consentManagementGpp.html)
- [Prebid Activity Controls](/dev-docs/dev-docs/activity-controls.html)
- [Prebid Activity Controls -- GPP control module - usnat](/dev-docs/modules/gppControl_usnat.html)
- [CMP Best Practices](https://docs.prebid.org/dev-docs/cmp-best-practices.html)
