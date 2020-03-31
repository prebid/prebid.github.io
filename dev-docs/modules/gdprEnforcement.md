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
This module requires the [EU GDPR Consent Management Module](/dev-docs/modules/consentManagement.html). That base
module reads consent values from the Consent Management Platform (CMP) and this
module enforces the results. See that module page for general background, usage, and legal disclaimers.

## Overview

Here's a summary of how this feature works:

The base [EU GDPR Consent Management Module](/dev-docs/modules/consentManagement.html) performs these actions:

1. Fetch the user's GDPR consent data from the CMP.
2. Incorporate this data into the auction objects for adapters to collect.

This GDPR Enforcement Module adds:

3. Allows the page to define which activities should be enforced at the Prebid.js level.
4. Actively enforces those activities based on user consent data.

The following table details the Prebid.js activities that fall under the Transparency and Consent Framework (TCF) scope:

{: .table .table-bordered .table-striped }
| TCF Purpose | In-Scope Activity | Enforcement Activity | Optional Controls |
| --- | --- | --- | --- |
| Purpose 1 - Store and/or access information on a device | usersync pixels | May result in preventing one or more usersync activities for one or more vendors. | Do not enforce Purpose 1. Do not enforce Purpose 1 vendor signals. Do not enforce Purpose 1 for vendor V. |
| Purpose 1 - Store and/or access information on a device | user ID modules | May result in preventing one or more UserID modules to not activate. | Do not enforce Purpose 1. Do not enforce Purpose 1 vendor signals. Do not enforce Purpose 1 for vendor V. |
| Purpose 1 - Store and/or access information on a device | device storage | May result in preventing one or adapters or modules not being able to read or write cookies or localstorage in the user's browser. | Do not enforce Purpose 1. Do not enforce Purpose 1 vendor signals. Do not enforce Purpose 1 for vendor V. |

Additional TCF Purposes and activities will be added in future releases.

## Page Integration

The page needs to define configuration rules about how Prebid.js should enforce each in-scope activity.

{: .alert.alert-warning :}
**Important Legal Note:** Prebid.org cannot provide legal advice about GDPR or any other governmental regulation. Our aim is to provide a toolkit of functionality that will let publishers configure header bidding as defined by their legal counsel. We will consider feature suggestions, and review any code offered by the community.

These are the fields supported in the [`consentManagement.gdpr`](/dev-docs/modules/consentManagement.html) object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gdpr.rules | `Array of Objects` | Lets the publisher override the default behavior. | |
| gdpr.rules[].purpose | `String` | The only currently supported value is "storage", corresponding to TCF Purpose 1. | "storage" |
| gdpr.rules[].enforcePurpose | `Boolean` | Whether to enforce the purpose consent or not. The default in PBJS 3.x will be not to enforce purposes, and in 4.0 to enforce consent for Purpose 1 and no others. | true |
| gdpr.rules[].enforceVendor | `Boolean` | Whether to enforce vendor signals for this purpose or not. The default in PBJS 3.x is not to enforce vendor signals, and in 4.0 to enforce signals for Purpose 1 and no others. | true |
| gdpr.rules[].vendorExceptions | `Array of Strings` | Which biddercodes or module names do not fall under the enforcement of either enforcePurpose=true or enforceVendors=true. The idea is that the publisher trusts this vendor to enforce the appropriate rules on their own. | true |

Note:

- The vendorExceptions list is based on Prebid.js biddercodes instead of Global Vendor List (GVL) IDs, i.e. "rubicon" instead of "52". First, the names are easier to work with, and second, there are Prebid.js modules and adapters that don't have GVL IDs.

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

2) Enforce that the user consents to DeviceAccess as an activity and consider their per-vendor selection. However, BidderA is a special case - the publisher has entrusted BidderA for this activity regardless of what the user says.

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

4) Enforce that the user consents to DeviceAccess as an activity, but don't consider their per-vendor selection for any bidders except BidderA. BidderA is entrusted to enforce the rules on their own.

      ...
      rules: [{
        purpose: "storage",
        enforcePurpose: true,
        enforceVendor: false,
        vendorExceptions: ["bidderA"]
      }

5) Turn off enforcement of Purpos 1: don't enforce either the user's DeviceAccess consent or their per-vendor selection.

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

7) Don't enforce the user's DeviceAccess consent, but do consider their per-vendor selection, except don't enforce vendor selection for BidderA.

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

Before allowing an activity tied to a TCF-protected purpose for a given Vendor, one of these scenarios must be true:

- Configuration rules enforce both consent and vendor signals and either:
  - We have the User’s purpose consent and the User’s vendor consent
  - Or we confirmed the User’s LI (Legitimate Interest) Transparency is established for this purpose and the User’s Vendor LI field didn’t reject this vendor
- Configuration rules enforce only purpose consent and either:
  - We have the user’s purpose consent
  - Or we confirmed the User’s LI Transparency is established for this purpose
- Configuration rules enforce only vendor signals and either:
  - We have the user’s vendor consent
  - Or we confirmed the User’s Vendor LI field didn’t reject this vendor
- Configuration rules enforce neither purpose consent nor vendor signal.

Technically these rules are defined:

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

Or you can use the [Prebid.js Download](/download.html) page.

## Further Reading

- [EU GDPR Consent Management Module](/dev-docs/modules/consentManagement.html) 
- [IAB TCF Consent String Format](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md)
