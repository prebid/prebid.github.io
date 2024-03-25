---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Privacy | US Custom Logic
---

# Prebid Server US Custom Logic Privacy Module
{:.no_toc}

{: .alert.alert-warning :}
This feature is currently only available in PBS-Java.

- TOC
{:toc}

{% include legal-warning.html %}

## Overview

This module provides a way for publishers to define a custom interpretion for GPP strings in Sections 7-12.
If the publisher is satisfied with Prebid's interpretation of GPP SIDs 7-12 as defined in
[Prebid Multi-State Privacy Agreement Support](/features/mspa-usnat.html), it's recommended
that they utilze the [US Gen Privacy Module](/prebid-server/features/pbs-usgen.html) instead of this one.

This module lets publishers define GPP string interpretation with a powerful general syntax
called [JsonLogic](https://jsonlogic.com/). At high traffic volumes with complex interpretion logic,
the Prebid Server Host Company may want to monitor compute resource utilization consumed by use
of this feature. Another option would be to build a [custom privacy module](/prebid-server/developers/add-a-privacy-module.html).

The use cases for this module are the same as for the `US Gen Privacy Module`:

- Is bidderA allowed to participate in this auction?
- Is bidderB allowed to receive User First Party Data?
- Is moduleM allowed to enrich the request with EIDs?

The difference is that instead of the GPP interpretation logic being coded into the module,
it allows publishers and their lawyers to come up with their own interpretations. As you'll see, this is powerful but complicated.

## Using the US Custom Logic Privacy Module

Some decisions are needed to activate the module within Prebid Server:

1. The PBS host company needs to decide whether to enable this privacy module globally, per-account, or both.
1. The host company also needs to decide whether to link this privacy module to Activity Controls globally.
1. Publishers may ask the host company to override Activity Control defaults, including which activities use the module.

### Enabling the US Custom Logic Module

The US Custom Logic Privacy Module is included in PBS-Java 1.130, but is not activated until it's placed
in the global or account-level config in a `privacy.modules` object.

Here's an example:

```json
{
    "privacy": {
        "modules": [{
          "code": "iab.uscustomlogic",
            "config": {
                 ... see below for examples ...
            }
        }],
        "allowactivities": {
          "ACTIVITY": {
            "default": true,
            "rules": [{
              "privacyreg": ["*"]    // causes the Activity Control to call all defined privacy modules
            }]
    }
}
```

### US Custom Logic Privacy Module Parameters

Here are the parameters allowed in the module's `config` section. See below for examples.

{: .table .table-bordered .table-striped }
| Parameter | Type | Scope | Description |
|------|------|-------------|
| sids | array of integer | required | Process only the named section IDs. |
| normalizeFlags | boolean | optional | Convert the state SIDs 8-12 into SID 7 fields as described in the [Prebid MSPA reference](/features/mspa-usnat.html). Defaults to `true`. |
| activityConfig | array of objects | required | Defines what processing to do. |
| activityConfig[].activities | array of strings | required | Defines which activity or activities are in scope for this array entry. |
| activityConfig[].restrictIfTrue | object | required | [JsonLogic](https://jsonlogic.com) rules object. |

### JsonLogic Data Fields

{: .alert.alert-info :}
Tip: Scroll down to the example to see what a JsonLogic rule (the `restrictIfTrue` field) looks like. The config only needs to contain the JsonLogic rule -- the module will create the JsonLogic data
from the GPP string.

The way [JsonLogic](https://jsonlogic.com) works is that you supply two JSON objects:

1. A set of rules. This defines boolean logic with many operators. For this module, the configuration defines the rules in the `restrictIfTrue` field.
1. A set of data. The module parses the GPP string and creates a set of attribute-value pairs for each flag defined in the GPP section.

The specific fields produced by the module that can be referred to in a rule are based on the IAB's definition of each SID. The only difference is that array fields simply have a number appended since JsonLogic doesn't support arrays.

These are the fields that can be referenced in the JsonLogic rule:

- MspaServiceProviderMode
- MspaCoveredTransaction
- MspaOptOutOptionMode
- Gpc
- SaleOptOutNotice
- SaleOptOut
- SharingNotice
- SharingOptOutNotice
- SharingOptOut
- TargetedAdvertisingOptOutNotice
- TargetedAdvertisingOptOut
- KnownChildSensitiveDataConsents1
- KnownChildSensitiveDataConsents2
- PersonalDataConsents
- SensitiveDataProcessingOptOutNotice
- SensitiveDataLimitUseNotice
- SensitiveDataProcessing1
- SensitiveDataProcessing2
- SensitiveDataProcessing3
- SensitiveDataProcessing4
- SensitiveDataProcessing5
- SensitiveDataProcessing6
- SensitiveDataProcessing7
- SensitiveDataProcessing8
- SensitiveDataProcessing9

See the IAB technical specifications for the definition and values allowed for each field. e.g. [GPP Extension: IAB Privacy’s US National Privacy Technical Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md)

### Linking the module to Activities

The US Custom Logic Privacy Module will not operate within the PBS workflow unless it's called by the Activity Control system. e.g.

```javascript
{
  "privacy": {
    "allowactivities": {
      "ACTIVITY": {
        "default": true,
        "rules": [{
          "privacyreg": ["*"]    // this causes the Activity Control to call this module
        },{
          ... more rules ...
        }]
     }
   }
 }
}
```

### Example 1 - Handle GPC and 'sensitive data' differently

Again, publishers will only use this module if their lawyers disagree with Prebid's default
interpretation of the US National or US State GPP strings.

As one example, Prebid interprets the Global Privacy Control (GPC) flag as a strong privacy signal that disables many GPP
privacy-related activities. Say a publisher's lawyers want to allow the `transmitUfpd` activity to operate in the US even when the GPC flag is set to true. In addition, they've declared that
they don't operate in any "sensitive data" category, so wish to remove those elements from
interpretation.

Here's an example config:

```json
{
    "privacy":
    {
        "modules": [{
          "code": "iab.uscustomlogic",
          "config": {
            "sids": [7,8,9,10,11,12],
            "normalizeFlags": true,
            "activityConfig": [{
              "activities": ["transmitUfpd"],
              "restrictIfTrue": {
                "or": [
                  { "==": [{"var": "MspaServiceProviderMode"},1] },
                  { "and": [
                     { "==": [{"var": "MspaServiceProviderMode"},2] },
                     { "or": [
                        { "==": [{"var": "SaleOptOut"},1] },
                        { "==": [{"var": "SaleOptOutNotice"},2] },
                        { "==": [{"var": "SharingNotice"},2] },
                        { "==": [{"var": "SharingOptOut"},1] },
                        { "==": [{"var": "TargetedAdvertisingOptOutNotice"},2] },
                        { "==": [{"var": "TargetedAdvertisingOptOut"},1] },
                        { "!=": [{"var": "KnownChildSensitiveDataConsents1"},0] },
                        { "!=": [{"var": "KnownChildSensitiveDataConsents2"},0] },
                        { "==": [{"var": "PersonalDataConsents"},2] }
                     ]}
                   ]}
                ]}
            }]
          }
        },{
          "code": "iab.usgen",
          "config": { skipSids: [] }
        }],
        "allowactivities": {
            "transmitUfpd": {
                "default": false,
                "rules": [{
                    "privacyreg": ["iab.uscustomlogic"]
                }]
            },
            "transmitPreciseGeo": {
                "default": false,
                "rules": [{
                    "privacyreg": ["iab.usgen"]
                }]
            }
        }
    }
}
```

Notes:

- In this example, only one activity uses the custom logic. Other activities utilize the conventions coded into the iab.usgen module.
- It would be possible to link each activity to different parsing logic

### Example 2 - Process Native GPP SID 11 Flags

In this example, a publisher's lawyers have determined that Prebid's normalization of Utah (SID 11) to the US National (SID 7) equivalents should not be used. This is somewhat contrived, but illustrates that you can operate
on non-normalized GPP flags.

```javascript
{
    "privacy":
    {
        "modules": [{
          "code": "iab.uscustomlogic",
          "config": {
            "sids": [11],
            "normalizeFlags": false,           // note: normalization to SID 7 not performed
            "activityConfig": [{
              "activities": ["transmitUfpd"],
              "restrictIfTrue": {
                ... JsonLogic Rule refers to Utah-definitions ...
                ... e.g. SensitiveDataProcessing3 and SensitiveDataProcessing4 are reversed ...
            },{
              ... other activities ...
            }]
          }
        },{
          "code": "iab.usgen",
          "config": {
            "skipSids": [11]
          }
        }],
        "allowactivities": {
            "transmitUfpd": {
                "default": false,
                "rules": [{
                    "privacyreg": ["*"]
                }]
            },
            ... other activities ...
        }
    }
}
```

### Module Processing

Here's how the module works when called by an Activity Control:

1. Gather GPP data
    1. GPP string comes from `regs.gpp`
    1. The GPP SIDs come from `regs.gpp_sid`. This is an array of integers.
1. Check the GPP SIDs to see if this request is in-scope
    1. If there are no GPP SIDs, return `abstain`.
1. For each GPP SID defined in the request
    1. If the SID is < 7 or > 12, go on to the next SID
    1. Else if the SID is not on the sids list, go on to the next SID
    1. Else pull that section of out the GPP string and process it
        1. If the normalizeFlags option is true and the SID is 8-12, normalize the flags to the SID 7 form as described in the Prebid [MSPA/USNat reference](/features/mspa-usnat.html).
        1. Find the current activity. If found, run the JsonLogic in the `restrictIfTrue` section as the rule, and pass in the GPP SID flags as the data. If the result is true, then "allow=false".
    1. On first "allow: false" immediately return `allow: false` to the Activity Control system.
    1. Continue until all SIDs are processed or skipped.
1. If any SID returns "allow: true", return `allow: true` to the Activity Control system
1. Otherwise return `abstain`

### Limits

Because the module config is not an array, it is not be possible to create
rules that apply to each US state's non-normalized GPP flags for the same activity.

Supporting this scenario would require a PBS Host Company to build a custom privacy module.

### Troubleshooting

Additional information about the outcoming of privacy module processing can be obtained by setting `ext.prebid.trace: "basic"`.

It may be useful to use the [JsonLogic tool](https://jsonlogic.com/play.html) to confirm the desired logic:

1. Enter a rule just as you would for the `restrictIfTrue` object.
1. Enter a simple JSON object containing the desired values of the GPP flags.

Here's a screenshot showing the usage of that tool:

![JsonLogic Screenshot](/assets/images/prebid-server/json-logic-screenshot.png){:class="pb-xlg-img"}

## Related Topics

- [Prebid Multi-State Privacy Agreement Support](/features/mspa-usnat.html)
- [US General Privacy Module](/prebid-server/features/pbs-usgen.html)
- [Activity Control system](/prebid-server/features/pbs-activitycontrols.html)
- [IAB US National Privacy Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md)
