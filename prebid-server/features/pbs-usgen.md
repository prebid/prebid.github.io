---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Privacy | US General
---

# Prebid Server US General Privacy Module
{:.no_toc}

{: .alert.alert-warning :}
This feature is currently only available in PBS-Java.

* TOC
{:toc}

## US General Privacy

This document covers how to configure the `US General Privacy Module` for Prebid Server.

See the [Prebid Multi-State Privacy Agreement Support](/features/mspa-usnat.html) page for
details on how specifically GPP strings are processed.

"`USGen`" is the first of a new type of Prebid Server module: a 'privacy module'. This module is called by the [Activity Control system](/prebid-server/features/pbs-activitycontrols.html) for a specific scenario. e.g.

* Is bidderA allowed to participate in this auction?
* Is bidderB allowed to receive User First Party Data?
* Is moduleM allowed to enrich the request with EIDs?

This module's job is figure out from the GPP strings whether or not the activity should be
allowed. Unlike the similarly-named [Prebid.js USNat module](/dev-docs/modules/gppControl_usnat.html),
this module also supports the US states defined by the IAB as having slightly
different protocols. i.e. while the Prebid.js module only processes GPP Section (SID) 7, this Prebid Server
module processes SIDs 7-12. That's why we call it "US General" rather than "US National",
which implies SID 7.

## Using the US General Privacy Module

Here are the steps need to activate the module within Prebid Server:

1. The PBS host company needs to decide whether to enable this privacy module globally, per-account, or both.
1. The host company needs to decide whether to link this privacy module to Activity Controls globally.
1. Publishers may ask the host company to override Activity Control defaults, including which activities use the USGen privacy module.

### Enabling the USGen Module

The USGen privacy module is included in PBS-Java 1.126, but is not activated until it's placed
in the global or account-level config in a `privacy.modules` object.

Here's an example:

```javascript
{
    "privacy": {
        "modules": [{
                "code": "iab.usgeneral",   // the USNat module's code
                "config": {
                    "skipSids": [9]
                }
        }]
    }
}
```

#### USGen Privacy Module Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Scope | Description |
|------|------|-------------|
| skipSids | array of integer | Optional | Do not process the named section IDs. |

By default the module will process GPP SIDs 7-12. The `skipSids`
parameter allows the publisher to define a different processing flow for different GPP SIDs.

### Linking the USGen module to Activities

The USGen Privacy Module will not operate within the PBS workflow unless it's called by the Activity Control system. e.g.

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

#### USGen Privacy Module Processing

Here's how the module works when called by an Activity Control:

1. Gather GPP data
    1. GPP string comes from `regs.gpp`
    1. The GPP SIDs come from `regs.gpp_sid`. This is an array of integers.
1. Check the GPP SIDs to see if this request is in-scope
    1. If there are no GPP SIDs, return `abstain`.
1. For each GPP SID defined in the request
    1. If the SID is < 7 or > 12, go on to the next SID
    1. Else if the SID is on the skipSids list, go on to the next SID
    1. Else pull that section of out the GPP string and process it
        1. If the SID is 8-12, "normalize" the flags to the SID 7 form as described in the Prebid [MSPA/USNat reference](/features/mspa-usnat.html).
        1. Depending on the Activity, compare the string's flags as described in the Prebid MSPA/USNat reference. Store the result in an array.
    1. Continue until all SIDs are processed or skipped.
1. If the results array contains nothing but "allow:true", return `allow:true` to the Activity Control system.
1. If the results array contains at least one "allow:false", return `allow:false` to the Activity Control system.
1. Otherwise return `abstain` to the Activity Control system.

### Example 1 - Alternate Processing for California 

In this scenario, a host company has created a special module for a publisher implementing
custom processing logic. The publisher wants to process GPP SIDs 7,9-12 with the default 
Prebid approach, but they want to process SID 8 with this custom module.

```javascript
{
    "privacy": {
        "modules": [{
            "code": "iab.usgeneral",   // the USNat module's code
            "config": {
                "skipSids": [8]
            }
        },{
            "code": "publisherP.specialCAprocessing" // only activates for SID 8
        }],
        "allowactivities": {
            "ACTIVITY": {
                "default": true,
                "rules": [{
                    "privacyreg": ["*"]
                }]
            }
        }
    }
}
```

### Troubleshooting

Additional information about the outcoming of privacy module processing can be obtained by setting `ext.prebid.trace: "basic"`.

## Related Topics

* [Prebid Multi-State Privacy Agreement Support](/features/mspa-usnat.html)
* [Activity Control system](/prebid-server/features/pbs-activitycontrols.html)
* [IAB US National Privacy Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md)
