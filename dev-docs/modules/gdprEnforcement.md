---
layout: page_v2
page_type: module
title: GDPR Enforcement Module
description: If you have users in Europe, you can use this module to enable actions for processing under the GDPR and ePrivacy
module_code : gdprEnforcement
display_name : GDPR Enforcement
enable_download : true
recommended: true
sidebarType : 1
---

# GDPR Enforcement Module

{: .no_toc }

* TOC
{: toc }

{% capture legalNotice %}
  This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  :::

{% include /alerts/alert_important.html content=legalNotice %}

{: .alert.alert-warning :}
This module requires the [EU GDPR consent management module](/dev-docs/modules/consentManagement.html) (the base consent module), which reads consent values from the Consent Management Platform (CMP). The GDPR Enforcement Module
will then take action based on the results. See the [base module page](/dev-docs/modules/consentManagement.html) for general background, usage, and legal disclaimers.

## Overview

The [base consent module](/dev-docs/modules/consentManagement.html) performs the following actions:

1. Fetches the user's GDPR consent data from the CMP.
2. Incorporates this data into the auction objects for adapters to collect.

The GDPR Enforcement Module adds the following:

1. Allows the page to define which activities should be enforced at the Prebid.js level.
2. Actively enforces those activities based on user consent data.

The following table details the Prebid.js activities that fall under the [Transparency and Consent Framework (TCF)](https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/) scope:

{: .table .table-bordered .table-striped }
| In-Scope Activity | TCF Legal Basis Required | Activity | Prebid.js Version |
| --- | --- | --- | --- |
| Invoke usersync pixels | Purpose 1 - Store and/or access information on a device | May prevent one or more vendor usersyncs. | 3.14+ |
| Invoke user ID modules | Purpose 1 - Store and/or access information on a device | May prevent one or more UserID modules from activating. | 3.14+ |
| Read and write data to device | Purpose 1 - Store and/or access information on a device | May prevent one or more adapters or modules from being able to read or write cookies or localstorage in the user's browser. | 3.14+ |
| Perform header bidding auction | Purpose 2 - Basic ads | May prevent one or more bid adapters from participating in the auction. | 4.0+ |
| Invoke analytics adapters | Purpose 7 - Measurement | May prevent one or more analytics adapters from participating in the auction. | 4.x+ |

## Page Integration

A page needs to define configuration rules about how Prebid.js should enforce each in-scope activity.

{: .alert.alert-warning :}
**Important Legal Note:** Prebid.org cannot provide legal advice about GDPR or any other governmental regulation. Our aim is to provide a toolkit of functionality that will let publishers configure header bidding as defined by their legal counsel. We will consider feature suggestions, and review any code offered by the community.

{: .alert.alert-info :}
To turn on Prebid.js enforcement you must:

(1) Include the gdprEnforcement module in the Prebid.js build
and (2) setConfig `consentManagement.gdpr.cmpApi` to either 'iab' or 'static'

The following fields related to GDPR enforcement are supported in the [`consentManagement`](/dev-docs/modules/consentManagement.html) object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gdpr.rules | `Array of Objects` | Lets the publisher override the default behavior. | |
| gdpr.rules[].purpose | `String` | Supported values: "storage" (Purpose 1), "basicAds" (Purpose 2), "measurement" (Purpose 7) | "storage" |
| gdpr.rules[].enforcePurpose | `Boolean` | Determines whether to enforce the purpose consent. The default in Prebid.js 3.x is not to enforce purposes. Prebid.js 4.0 enforces legal basis for Purposes 1 and 2 by default. | true |
| gdpr.rules[].enforceVendor | `Boolean` | Determines whether to enforce vendor signals for this purpose. The default in Prebid.js 3.x is not to enforce vendor signals. Prebid.js 4.0 enforces legal basis for Purposes 1 and 2 by default. | true |
| gdpr.rules[].vendorExceptions | `Array of Strings` | Defines a list of biddercodes or module names that are exempt from the enforcement of this Purpose. | ["bidderA", "userID-module-B"] |
| gdpr.rules[].softVendorExceptions | `Array of Strings` | Defines a list of biddercodes or module names that are exempt from the enforcement of vendor signals for this purpose. Unlike with `vendorExceptions`, Purpose consent is still enforced . | ["bidderA", "userID-module-B"] |
| strictStorageEnforcement | `Boolean` | If false (the default), allows some use of storage regardless of purpose 1 consent - see [note](#strictStorageEnforcement) below | true |

Notes:

* <a id="strictStorageEnforcement"></a> By default, Prebid allows some limited use of storage even when purpose 1 consent was not given: this is limited to non-PII, such as [category translation mappings](/dev-docs/modules/categoryTranslation.html), or temporary test data used to probe the browser's storage features. If `strictStorageEnforcement` is true, purpose 1 consent will always be enforced for any access to storage.
* To accomodate Prebid.js modules and adapters that don't have GVL IDs, the vendorExceptions list is based on Prebid.js biddercodes instead of Global Vendor List (GVL) IDs (i.e. "bidderA" instead of "12345").
* An alternate way of establishing a GVL mapping is to define a 'gvlMapping' object:

```javascript
pbjs.setConfig({
    gvlMapping: {
    bidderA: 12345,
        bidderB: 67890
    }
});
```

### Examples

The following examples cover a range of use cases and show how Prebid.js supports
configuration of different business rules.

1. Restrict device access activity and basic ads. These are the default values (in Prebid.js 4.0) if the module is included in the build.

    ```javascript
    pbjs.setConfig({
      consentManagement: {
        gdpr: {
          cmpApi: 'iab',   // activates the enforcement module
          defaultGdprScope: true,
          rules: [{        // these are the default values
            purpose: "storage",
            enforcePurpose: true,
            enforceVendor: true
          },{
            purpose: "basicAds",
            enforcePurpose: true,
            enforceVendor: true
          },{
            purpose: "measurement",
            enforcePurpose: true,
            enforceVendor: true
          }]
        }
      }
    });
    ```

2. Restrict that the user consents to DeviceAccess as an activity and consider their per-vendor selection. However, idSystemA is a special case - the publisher has confirmed that this system obtains a user ID every auction and does not write to the local device.

    ```javascript
      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: true,
        vendorExceptions: ["idSystemA"]
      }]
    ```

3. Restrict for both storage and basicAds, with the exception of "firstPartyBidder", which is always allowed to run an auction. Assumes the publisher has special legal basis for this entity.

    ```javascript
      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: true
      },{
    purpose: "basicAds",
    enforcePurpose: true,
    enforceVendor: true,
        vendorExceptions: ["firstPartyBidder"]
      }]
    ```

4. Turn off restriction of Purpose 1: don't enforce either the user's DeviceAccess consent or their per-vendor selection.

    ```javascript
      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: false,
        enforceVendor: false
      }]
    ```

5. Allow the user to suppress analtyics provider A, but make an exception for analytics provider B.

    ```javascript
      ...
      rules: [{
        purpose: "measurement",
        enforcePurpose: true,
        enforceVendor: true,
    vendorExceptions: ["analyticsB"]
      }]
    ```

## Basic Enforcement

Prebid.js does not have access to the Global Vendor List (GVL), so it implements
a "basic" form of TCF 'legal basis' validation using the supplied consent string.

A goal of 'basic enforcement' is to confirm that there's enough evidence of consent to pass data on to vendors who do have access to the GVL and can fully parse and enforce.

Before allowing an activity tied to a TCF-protected Purpose for a given vendor, one of these scenarios must be true:

* Configuration rules enforce both consent and vendor signals and either:
  * Prebid.js has the user’s purpose consent and the user’s vendor consent, or
  * (for Purpose 2 only) we've confirmed the user’s Legitimate Interest (LI) Transparency is established for this purpose
* Configuration rules enforce only purpose consent and either:
  * Prebid.js has the user’s purpose consent, or
  * (for Purpose 2 only) we confirmed the user’s LI Transparency is established for this purpose.
* Configuration rules enforce only vendor signals and we have the user’s vendor consent
* Configuration rules enforce neither purpose consent nor vendor signal.

See the [IAB TCF Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md) for details.

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). Include the base consent management module and this enforcement module as additional options on the **gulp build** command:

```bash
gulp build --modules=consentManagement,gdprEnforcement,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Further Reading

* [EU GDPR Consent Management Module](/dev-docs/modules/consentManagement.html)
* [IAB TCF Implementation Guidelines](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md)
* [IAB TCF2 Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md)
* [Prebid TCF2 Support](https://docs.google.com/document/d/1fBRaodKifv1pYsWY3ia-9K96VHUjd8kKvxZlOsozm8E/edit#)
* [CMP Best Practices](/dev-docs/cmp-best-practices.html)
