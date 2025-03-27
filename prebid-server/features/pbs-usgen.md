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

{% include legal-warning.html %}

## Overview

This document covers how to configure the `US General Privacy Module` for Prebid Server.

See the [Prebid US Compliance Support](/features/mspa-usnat.html) page for
details on how specifically US National and State GPP strings are processed. This module interprets the strings
as defined in that document. If a publisher wishes to override the interpretation coded into
this module, there are two options:

1. Utilize the [US Custom Logic Privacy Module](/prebid-server/features/pbs-uscustomlogic.html). This lets publishers define their own interpretation in JSONLogic format.
1. Or, if optimizing performance is a concern, the Prebid Server Host Company might choose to build a custom privacy module that implements the desired string interpretation.

"`USGen`" is a 'privacy module' called by the [Activity Control system](/prebid-server/features/pbs-activitycontrols.html) for a specific scenario. e.g.

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

```json
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

### USGen Privacy Module Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Scope | Description |
|------|------|-------------|
| skipSids | array of integer | Optional | Do not process the named section IDs. |
| allowPersonalDataConsent2 | boolean | Optional | Defaults to 'false'. [Prebid's logic](/features/mspa-usnat.html) for personal data consents considers a value of 2 as non-sensical. But it turns out that several CMPs didn't get that message and are reporting this value. We will deprecate this option once the CMPs are all on the same page. |

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

### USGen Privacy Module Processing

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
        1. If the SID is 8-12, "normalize" the flags to the SID 7 form as described in the Prebid [US Compliance reference](/features/mspa-usnat.html).
        1. Depending on the Activity, compare the string's flags as described in the Prebid US Compliance reference.
    1. On first "allow: false" immediately return `allow: false` to the Activity Control system.
    1. Continue until all SIDs are processed or skipped.
1. If any SID returns "allow: true", return `allow: true` to the Activity Control system
1. Otherwise return `abstain`

### Example - Alternate Processing for California

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

### Testing

Before turning on the USGen module 100%, some host companies may want to partially enable it in order to gague impact. This can be done using the privacy module `skipRate` parameter. Here's an example account config:

```json5
{
    "privacy": {
        "modules": [{
                "code": "iab.usgeneral",
                "skipRate": 95,         // only run on 5% of requests. Default is to run on 100%, i.e. skipRate 0 
                "config": {
                    "skipSids": [9]
                }
        }]
    }
}
```

In order to utilize this test though, you will need an analytics adapter that can read the Activity Infrastructure log. See [privacy module analytics](/prebid-server/developers/add-a-privacy-module-java.html#privacy-trace-log-and-analytics) for more detail.

### Troubleshooting

Additional information about the outcoming of privacy module processing can be obtained by setting `ext.prebid.trace: "basic"`.

## Related Topics

* [Prebid US Compliance Support](/features/mspa-usnat.html)
* [US Custom Logic Privacy Module](/prebid-server/features/pbs-uscustomlogic.html)
* [Activity Control system](/prebid-server/features/pbs-activitycontrols.html)
* [IAB US National Privacy Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md)
