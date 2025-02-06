---
layout: page_v2
page_type: module
title: TCF Control Module
description: If you have users in Europe, you can use this module to enable actions for processing under the GDPR and ePrivacy
module_code : tcfControl
display_name : TCF Control
enable_download : true
recommended: true
sidebarType : 1
---

# TCF Control Module
{: .no_toc }

{: .alert.alert-info :}
Until Prebid.js 9.0 this was known as the "GDPR Enforcement" module.

* TOC
{: toc }

{% include legal-warning.html %}

{: .alert.alert-warning :}
This module requires the [TCF consent management module](/dev-docs/modules/consentManagementTcf.html) (the base consent module), which reads consent values from the Consent Management Platform (CMP). The TCF Control Module
will then take action based on the results. See the [base module page](/dev-docs/modules/consentManagementTcf.html) for general background, usage, and legal disclaimers.

## Overview

The [base consent module](/dev-docs/modules/consentManagementTcf.html) performs the following actions:

1. Fetches the user's GDPR consent data from the CMP.
2. Incorporates this data into the auction objects for adapters to collect.

The TCF Control Module adds the following:

1. Allows the page to define which activities should be restricted at the Prebid.js level.
2. Actively restricts those activities based on user consent data.

The following table details the Prebid.js activities that fall under the [Transparency and Consent Framework (TCF)](https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/) scope:

{: .table .table-bordered .table-striped }
| In-Scope Activity | TCF Legal Basis Required | Activity | Prebid.js Version |
| --- | --- | --- | --- |
| Invoke usersync pixels | Purpose 1 - Store and/or access information on a device | May prevent one or more vendor usersyncs. | 3.14+ |
| Invoke user ID modules | Purpose 1 - Store and/or access information on a device | May prevent one or more UserID modules from activating. | 3.14+ |
| Read and write data to device | Purpose 1 - Store and/or access information on a device | May prevent one or more adapters or modules from being able to read or write cookies or localstorage in the user's browser. | 3.14+ |
| Perform header bidding auction | Purpose 2 - Basic ads | May prevent one or more bid adapters from participating in the auction. | 4.0+ |
| Transmit user first party data to partners | Purpose 4 -  Personalized ads | May prevent  one or more modules from receiving user first party data | 8.16+ |
| Transmit Extended User IDs to partners | Depends on configuration (see [note](#note-transmitEids))| May prevent one or more modules from receiving user IDs and EIDs. | 8.16+ |
| Invoke analytics adapters | Purpose 7 - Measurement | May prevent one or more analytics adapters from participating in the auction. | 4.x+ |
| Transmit precise geolocation data to partners | Specal Feature 1 - Use precise geolocation data |  May cause geolocation data to be truncated for one or more modules | 8.16+ |

## Page Integration

A page needs to define configuration rules about how Prebid.js should restricts each in-scope activity.

{: .alert.alert-warning :}
**Important Legal Note:** Prebid.org cannot provide legal advice about GDPR or any other governmental regulation. Our aim is to provide a toolkit of functionality that will let publishers configure header bidding as defined by their legal counsel. We will consider feature suggestions, and review any code offered by the community.

{: .alert.alert-info :}
To turn on Prebid.js restrictions you must:

(1) Include the tcfControl module in the Prebid.js build
and (2) setConfig `consentManagement.gdpr.cmpApi` to either 'iab' or 'static'

The following fields related to anonymizing aspects of the auction are supported in the [`consentManagement`](/dev-docs/modules/consentManagementTcf.html) object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gdpr.rules | `Array of Objects` | Lets the publisher override the default behavior. | |
| gdpr.rules[].purpose | `String` | Supported values: "storage" (Purpose 1), "basicAds" (Purpose 2), "personalizedAds" (purpose 4), "measurement" (Purpose 7), "transmitPreciseGeo" (Special Feature 1) | "storage" |
| gdpr.rules[].enforcePurpose | `Boolean` | Determines whether to enforce the purpose consent. The default in Prebid.js 3.x was not to enforce any purposes. Prebid.js 4.0 and later require legal basis for Purposes 1 and 2 by default. | true |
| gdpr.rules[].enforceVendor | `Boolean` | Determines whether to check vendor signals for this purpose. The default in Prebid.js 3.x is not to check vendor signals. Prebid.js 4.0 and later require legal basis for Purposes 1 and 2 by default. | true |
| gdpr.rules[].vendorExceptions | `Array of Strings` | Defines a list of biddercodes or module names that are exempt from determining legal basis for this Purpose. **Note:** Prebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor. | ["bidderA", "userID-module-B"] |
| gdpr.rules[].softVendorExceptions | `Array of Strings` | Defines a list of biddercodes or module names that are exempt from the checking vendor signals for this purpose. Unlike with `vendorExceptions`, Purpose consent is still checked. **Note:** Prebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor. | ["bidderA", "userID-module-B"] |
| gdpr.rules[].eidsRequireP4Consent | `Boolean` | Only relevant on the personalizedAds `purpose`. If true, user IDs and EIDs will not be shared without evidence of consent for TCF Purpose 4. If false, evidence of consent for any of Purposes 2-10 is sufficient for sharing user IDs and EIDs. Defaults to false. See [note](#note-transmitEids) | true |
| strictStorageEnforcement | `Boolean` | If false (the default), allows some use of storage regardless of purpose 1 consent - see [note](#strictStorageEnforcement) below | true |

Notes:

* <a id="strictStorageEnforcement"></a> By default, Prebid allows some limited use of storage even when purpose 1 consent was not given: this is limited to non-PII, such as [category translation mappings](/dev-docs/modules/categoryTranslation.html), or temporary test data used to probe the browser's storage features. If `strictStorageEnforcement` is true, Purpose 1 consent will always be enforced for any access to storage.
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

{: .alert.alert-warning :}
Prebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor.

1. Restrict device access activity and basic ads. These are the default values (in Prebid.js 4.0) if the module is included in the build.

    ```javascript
    pbjs.setConfig({
      consentManagement: {
        gdpr: {
          cmpApi: 'iab',   // activates the control module
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
            purpose: "personalizedAds",
            enforcePurpose: true,
            enforceVendor: true
          },{
            purpose: "measurement",
            enforcePurpose: true,
            enforceVendor: true
          },{
            purpose: "transmitPreciseGeo",
            enforcePurpose: true
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

## Basic Legal Basis

Prebid.js does not have access to the Global Vendor List (GVL), so it implements
a "basic" form of TCF 'legal basis' validation using the supplied consent string.

A goal of 'basic legal basis' is to confirm that there's enough evidence of consent to pass data on to vendors who do have access to the GVL and can fully parse and take any necessary action.

Evidence of consent for a particular purpose or vendor means that:

* Prebid.js has the the user's vendor purpose or vendor consent, or
* (for Purpose 2 only) we've confirmed the user's Legitimate Intereset (LI) Transparency is established for this purpose or vendor.

Before allowing an activity tied to a TCF-protected Purpose for a given vendor, one of these scenarios must be true:

* Configuration rules check both consent and vendor signals and:
  * we have evidence of consent for both, or
  * we have evidence of consent for the purpose, and the vendor is excepted through `softVendorException`, or
  * the vendor is excepted through `vendorExceptions`;
* Configuration rules check only purpose consent and either:
  * we have evidence of consent for the purpose, or
  * the vendor is excepted through `vendorExceptions`;
* Configuration rules check only vendor signals and either:
  * we have evidence of consent for the vendor, or
  * the vendor is excepted through either `softVendorExceptions` or `vendorExceptions`;
* Configuration rules check neither purpose consent nor vendor signal.

See the [IAB TCF Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md) for details.

Before allowing an activity tied to a TCF-protected Purpose for a publisher module, such as Generic Analytics, SharedId, Pub-provided-id, configuration rules check for the relevant publisher purpose consent instead of vendor consent. IAB Europe officials have written to Prebid that "When one is seeking a signal indicating whether the Publisher has had their consent (or legitimate interest) legal basis established to the data subject by the CMP, one should examine the Publisher Purposes Transparency and Consent string segment signals, if present. The core string PurposesConsent bit sequence is intended solely to represent disclosures made by the CMP in the context of Vendors."

<a id="note-transmitEids"></a>

### Note on Extended User IDs

{: .alert.alert-info :}
Note: the default of the eidsRequireP4Consent flag may change from false to true in a future major release.

By default, sending user IDs and EIDs to bid adapters or RTD modules (the `transmitEids` activity) is not tied to a single TCF Purpose; instead it is allowed if one of these scenarios is true:

* We have evidence of consent for the vendor and evidence of consent for _any_ purpose between 2 and 10;
* We have evidence of consent for any purpose between 2 and 10, and the vendor is excepted through `softVendorException` in at least one of: `basicAds`, `personalizedAds`, or `measurement`;
* The vendor is excepted through `vendorExceptions` in at least one of `basicAds`, `personalizedAds`, or `measurement`.

This behavior can be changed to the same "basic legal basis" algorithm described above, tied to TCF Purpose 4, by setting `eidsRequireP4Consent: true` on a `personalizedAds` rule:

```javascript
  ...
  rules: [{
    purpose: "personalizedAds",
    eidsRequireP4Consent: true
  }]
```

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). Include the base consent management module and this control module as additional options on the **gulp build** command:

```bash
gulp build --modules=consentManagement,tcfControl,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Further Reading

* [EU GDPR Consent Management Module](/dev-docs/modules/consentManagementTcf.html)
* [IAB TCF Implementation Guidelines](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md)
* [IAB TCF2 Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md)
* [Prebid TCF2 Support](https://docs.google.com/document/d/1fBRaodKifv1pYsWY3ia-9K96VHUjd8kKvxZlOsozm8E/edit#)
* [CMP Best Practices](/dev-docs/cmp-best-practices.html)
