---
layout: page_v2
page_type: module
title: GDPR Enforcement Module
description: Module to enforce GDPR consent
module_code : gdprEnforcement
display_name : GDPR Enforcement
enable_download : true
sidebarType : 1
---

# GDPR Enforcement Module
{: .no_toc }

* TOC
{: toc }

{: .alert.alert-warning :}
This module requires the [EU GDPR consent management module](/dev-docs/modules/consentManagement.html), which reads consent values from the Consent Management Platform (CMP). The GDPR enforcement module
will then enforce the results. See the base module page for general background, usage, and legal disclaimers.

## Overview

The base [EU GDPR consent management module](/dev-docs/modules/consentManagement.html) performs the following actions:

1. Fetch the user's GDPR consent data from the CMP.
2. Incorporate this data into the auction objects for adapters to collect.

This GDPR enforcement module adds the following:

3. Allows the page to define which activities should be enforced at the Prebid.js level.
4. Actively enforces those activities based on user consent data.

The following table details the Prebid.js activities that fall under the [Transparency and Consent Framework (TCF)](https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/) scope:

{: .table .table-bordered .table-striped }
| TCF Purpose | In-Scope Activity | Enforcement Activity | Optional Controls |
| --- | --- | --- | --- |
| Purpose 1 - Store and/or access information on a device | usersync pixels | May prevent one or more vendor usersyncs. | Do not enforce Purpose 1. Do not enforce Purpose 1 vendor signals. Do not enforce Purpose 1 for vendor V. |
| Purpose 1 - Store and/or access information on a device | user ID modules | May prevent one or more UserID modules from activating. | Do not enforce Purpose 1. Do not enforce Purpose 1 vendor signals. Do not enforce Purpose 1 for vendor V. |
| Purpose 1 - Store and/or access information on a device | device storage | May prevent one or more adapters or modules from being able to read or write cookies or localstorage in the user's browser. | Do not enforce Purpose 1. Do not enforce Purpose 1 vendor signals. Do not enforce Purpose 1 for vendor V. |

There are plans to add more TCF Purposes and activities in future releases.

## Page Integration

A page needs to define configuration rules about how Prebid.js should enforce each in-scope activity.

{: .alert.alert-warning :}
**Important Legal Note:** Prebid.org cannot provide legal advice about GDPR or any other governmental regulation. Our aim is to provide a toolkit of functionality that will let publishers configure header bidding as defined by their legal counsel. We will consider feature suggestions, and review any code offered by the community.

These are the fields related to GDPR enforcment that are supported in the [`consentManagement.gdpr`](/dev-docs/modules/consentManagement.html) object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gdpr.rules | `Array of Objects` | Lets the publisher override the default behavior. | |
| gdpr.rules[].purpose | `String` | The only currently supported value is "storage", corresponding to TCF Purpose 1. | "storage" |
| gdpr.rules[].enforcePurpose | `Boolean` | Determines whether to enforce the purpose consent or not. The default in Prebid.js 3.x is not to enforce purposes. The plan for Prebid.js 4.0 is to enforce consent for Purpose 1 and no others. | true |
| gdpr.rules[].enforceVendor | `Boolean` | Determines whether to enforce vendor signals for this purpose or not. The default in Prebid.js 3.x is not to enforce vendor signals. The plan for Prebid.js 4.0 to enforce signals for Purpose 1 and no others. | true |
| gdpr.rules[].vendorExceptions | `Array of Strings` | Defines a list of biddercodes or module names that are exempt from the enforcement of this Purpose. | ["bidderA", "userID-module-B"] |

Note:

- The vendorExceptions list is based on Prebid.js biddercodes instead of Global Vendor List (GVL) IDs, i.e. "rubicon" instead of "52". This was done to accomodate Prebid.js modules and adapters that don't have GVL IDs.  

### Examples

The following examples cover a range of use cases and how Prebid.js supports
configuration of different business rules.

1) Enforce that the user consents to DeviceAccess as an activity and consider their per-vendor selection.

```
pbjs.setConfig({
  consentManagement: {
    gdpr: {
      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: true
      }
    }
  }
});
```

2) Enforce that the user consents to DeviceAccess as an activity and consider their per-vendor selection. However, BidderA is a special case - the publisher has entrusted BidderA for this activity.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: true,
        vendorExceptions: ["bidderA"]
      }

3) Enforce that the user consents to DeviceAccess as an activity, but don't consider their per-vendor selection.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: false,
      }

4) Enforce that the user consents to DeviceAccess as an activity, but don't consider their per-vendor selection. BidderA is entrusted to enforce the rules on their own.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: false,
        vendorExceptions: ["bidderA"]
      }

5) Turn off enforcement of Purpose 1: don't enforce either the user's DeviceAccess consent or their per-vendor selection.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: false,
        enforceVendor: false
      }

6) Don't enforce the user's DeviceAccess consent, but do consider their per-vendor selection.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: false,
        enforceVendor: true
      }

7) Don't enforce the user's DeviceAccess consent, but do consider their per-vendor selection except for BidderA.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: false,
        enforceVendor: true,
        vendorExceptions: ["bidderA"]
      }

## Basic Enforcement

Prebid.js does not have access to the Global Vendor List (GVL), so it implements
a "basic" form of TCF validation using the supplied consent string.

A goal of basic enforcement is to confirm that there's enough evidence of consent to pass data on to vendors who do have access to the GVL and can fully parse and enforce.

Before allowing an activity tied to a TCF-protected Purpose for a given vendor, one of these scenarios must be true:

- Configuration rules enforce both consent and vendor signals and either:
  - we have the user’s purpose consent and the user’s vendor consent, or
  - we confirmed the user’s LI (Legitimate Interest) Transparency is established for this purpose and the user’s Vendor LI field didn’t reject this vendor.
- Configuration rules enforce only purpose consent and either:
  - we have the user’s purpose consent, or
  - we confirmed the user’s LI Transparency is established for this purpose.
- Configuration rules enforce only vendor signals and either:
  - we have the user’s vendor consent, or
  - we confirmed the user’s Vendor LI field didn’t reject this vendor
- Configuration rules enforce neither purpose consent nor vendor signal.

Technically these rules are defined as follows:

1. enforcePurpose[P]==true AND PurposesConsent[P]==1 AND enforceVendor[P,V]==true AND VendorConsentBitfield[V]==1
1. enforcePurpose[P]==true AND PurposesConsent[P]==1 AND enforceVendor[P,V]==false
1. enforcePurpose[P]==false AND enforceVendor[P,V]==true AND VendorConsentBitfield[V]==1
1. enforcePurpose[P]==true AND PurposesLITransparency[P]==1 AND enforceVendor[P,V]==true AND VendorLegitimateInterestBitfield[V]==1
1. enforcePurpose[P]==true AND PurposesLITransparency[P]==1 AND enforceVendor[P,V]==false
1. enforcePurpose[P]==false AND enforceVendor[P,V]==true AND VendorLegitimateInterestBitfield[V]==1
1. enforcePurpose[P]==false AND enforceVendor[P,V]==false

Where:

- P is the Purpose number
- V is the vendor ID
- 'enforcePurpose' and 'enforceVendor' are Prebid.js config rules
- 'PurposesConsent' is the consent string field of the same name
- 'VendorConsentBitfield' is the consent string 'Vendor Consent Section'
- 'PurposesLITransparency' is the consent string field of the same name
- 'VendorLegitimateInterestBitfield' is the consent string 'Vendor Legitimate Interest Section'

See the [IAB TCF Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md) for details.

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). Include the base consent management module and this enforcement module as additional options on the **gulp build** command:

{% highlight bash %}
gulp build --modules=consentManagement,gdprEnforcement,bidAdapter1,bidAdapter2
{% endhighlight %}

You can also use the [Prebid.js Download](/download.html) page.

## Further Reading

- [EU GDPR Consent Management Module](/dev-docs/modules/consentManagement.html)
- [IAB TCF Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md)
