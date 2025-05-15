---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Actvity Controls

---

# Prebid Server Activity Controls
{: .no_toc }

{: .alert.alert-warning :}
PBS-Java fully supports Activity Controls. PBS-Go support for the main request workflow is complete. They are working on support for Activities in modules and analytics.

Prebid supports a centralized control mechanism for privacy-sensitive activities.
These controls are intended to serve as building blocks for privacy protection mechanisms, allowing publishers to directly specify what should be permitted or avoided in any given regulatory environment.

* TOC
{: toc }

## Overview

There are many privacy regulations for Prebid publishers to consider. Prebid Server supplies [several privacy features](/prebid-server/features/pbs-privacy.html) to help Publishers implement their legal policies.

The Activity Control system is a common framework that serves as a central privacy
control mechanism. It currently supports a number of scenarios:

* Delegate the decision about a certain activity to a particular privacy module or all privacy modules in general.
* Allow a Publisher's lawyers to define an exception for a certain bidder or module.
* Enable reasonable configuration for regulations not specifically supported by Prebid Server.

At this time, the older PBS privacy features such as TCF/GDPR and USP are not part of the
Activity Control system. They may be integrated into the system over time, but for now the
only privacy module that plugs into this system is the [USGen Privacy Module](/prebid-server/features/pbs-usgen.html). There will be more.

The Activity Control configuration has two components:

1. Account-level configuration allows each publisher to define different anonymization policies
1. Host-level configuration allows each PBS host company to define a default privacy behavior that covers accounts that don't define their own.

### Prebid Server Is a Toolkit

{% include legal-warning.html %}

Activity Controls and privacy features within Prebid Server are tools meant to be useful to
publishers within their overall privacy strategy. Prebid assumes a larger context around these
tools:

1. Get a privacy lawyer.
2. Consider all the privacy regulations your media content business is subject to.
3. Come up with a plan.
4. Use Prebid Server server features and these Activity Controls as ways to help implement your privacy plan with respect to header bidding.
5. Let us know if there are tools missing from the Prebid toolkit.

### What is an Activity?

Prebid did an analysis of the things Prebid does that might be of concern to privacy regulations. We call these things "potentially restricted activities", or just "activities" for short. Some examples:

* Syncing ID cookies
* Transmitting user first party data
* Transmitting the user's geographic location
* etc.

The [full list of activities](#activities) is below.

An activity control is a gatekeeper that makes a decision about whether the activity should be allowed in a specific context:

* Should I allow this usersync for bidderB?
* Is it ok for this data to be passed to bidderC and analyticsD?
* Should I anonymize the geographic information for this request?
* etc.

Prebid Server core checks with the Activity Controls to see whether a given activity is allowed for a given situation. The configuration for the activity comes from one of two places: either account-specific configuration or if not specified there, there's a host-level default.

### Example Activity Control

Here's an example account config that prevents bidderA, bidderB, and analytics adapters from receiving `user.eids[]` and `user.ext.data`. It does not specifically link out to any privacy regulations, so would not involve privacy modules that are linked into the Activity Controls.

```json
{
  "privacy": {
    "allowactivities": {
      "transmitUfpd": {
        "default": true,
        "rules": [{
          "condition": {
            "componentName": ["bidderA", "bidderB"]
          },
          "allow": false
        },{
          "condition": {
            "componentType": ["analytics"]
          },
          "allow": false
        }]
      }
    }
  }
}
```

<a id="config"></a>

### Activity Controls in Relation to Privacy Features

In the long-term, the vision is that Activity Control config will become a
complete description of the allow/deny status of a particular action.
However, for now, the existing privacy regulations (GDPR, USP, COPPA)
sit ouside of Activity config.

Here's how the Activity Control system works with other privacy features:

1. When PBS-core hits certain spots during request processing, it calls the Activity Control system.
1. Activity config may instruct the server to call privacy modules like [US General privacy](/prebid-server/features/pbs-usgen.html).
1. If the Activity Control `denies` the activity, the action will be suppressed/anonymized.
1. However, if the Control `allows` the activity, the system will still go on to check [other relevant privacy activities](/prebid-server/features/pbs-privacy.html) like TCF/GDPR.

Here's a list of the PBS privacy-related features and whether it's integrated
into the Activity Control system:

{: .table .table-bordered .table-striped }
| Privacy Feature | Description | Activity Control Integration | Privacy Module Code |
|------|------|-------------|---|
| TCF-EU/GDPR | Original [PBS GDPR support](/prebid-server/features/pbs-privacy.html#gdpr) | no | n/a |
| COPPA | Original [PBS COPPA support](/prebid-server/features/pbs-privacy.html#coppa) | no | n/a |
| USP | Original [PBS USP/CCPA support](/prebid-server/features/pbs-privacy.html#ccpa--us-privacy) | no | n/a |
| US General Privacy | [USGen privacy module](/prebid-server/features/pbs-usgen.html) supports the IAB's GPP SIDs 7-12. | yes | iab.usgeneral |
| TCF Canada | (a future module that will support GPP SID 5.) | yes | iab.tcfcanada |

So, for example, TCF/GDPR-suppression activities must still be managed through that feature's configuration. (See details for [PBS-Go](https://github.com/prebid/prebid-server/blob/master/config/config.go) or [PBS-Java](https://github.com/prebid/prebid-server-java/blob/master/docs/config-app.md))

## Activity Control Configuration

The `privacy.allowActivities` is a new account configuration option that contains a list of activity names -- see the [full list of activities below](#activities).

Here's a general template for how activity configuration looks in the account config:

```json
{
  "privacy": {
    "allowactivities": {
      "ACTIVITY": {                 // one of the activities in the table below
        "default": true,            // whether to allow if no rules match
        "rules": [{
          "condition": { ... },     // publisher-defined override
          "allow": true/false
        },{
          "privacyreg": ["*"]       // delegate to all configured privacy modules
        },{
          ... more rules ...
        }]
     }
   }
 }
}
```

{: .alert.alert-info :}
The activity rules array can be thought of as a script: Prebid Server processes each array
entry in order and will stop once it gets a definitive result.

Each ACTIVITY is an object that can contain these attributes:

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|------|------|-------------|
| `default` | boolean | Whether the activity should be allowed if no other rule applies. Defaults to true. (PBS-Java 1.118) |
| `rules`   | array of objects | Rules for this activity |
| `rules[].condition` | object | Conditions to use for this rule. See the [rules](#rules) section below for details. If omitted, the rule always applies. (PBS-Java 1.118) |
| `rules[].allow` | boolean | Whether the activity should be allowed when this rule applies. Defaults to true. (PBS-Java 1.118) |
| `rules[].privacyreg` | array of strings | Instructs the Activity system to call the defined privacy module(s). An asterisk may be used. Examples: `["*"]`, `["iab.*"]`, `["iab.usgeneric","custom.abcde"]`. (PBS-Java 1.126) |

`Rules` is an array of objects that a publisher can contruct to provide fine-grained control over a given activity.

There's more about [rules](#rules) below.

<a id="activities"></a>

### Activities

Here's the list of the 'potentially restricted activities' that Prebid Server core can restrict for Publishers:

{: .table .table-bordered .table-striped }
| Name           | Description | Effect when denied |
|----------------|-------------|---------------------------|
| `syncUser` | The [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) or [/setuid](/prebid-server/endpoints/pbs-endpoint-setuid.html) endpoint has been asked to perform a sync or set-cookie. | Sync or setuid is skipped for one or more bidders. |
| `fetchBids`  | A bid adapter wants to participate in an auction | Bidder is removed from the auction |
| `enrichUfpd` | A module wants to add user first party data to outgoing requests (`user.data` and `user.ext.data` in ORTB) | Module is not allowed to run. |
| `reportAnalytics` | The [/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html), [/amp](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html), or [/event](/prebid-server/endpoints/pbs-endpoint-event.html) endpoint is about to call an analytics adapter. | Adapter is not called. |
| `transmitUfpd` | A bid adapter, analytics adapter, or module wants to access and/or transmit user FPD to their endpoint. (Note: this is combined with transmitEids in PBS-Go and PBJ-Java 2.11 and under) | User FPD and EIDs are hidden from the adapter or module: `user.{id, buyeruid, yob, gender, geo, eids, data}`, `user.ext.data`, `device.{ifa, macsha1, macmd5, dpidsha1, dpidmd5, didsha1, didmd5}` |
| `transmitEids` | (PBS-Java 2.12 and later) A bid adapter, analytics adapter, or module wants to access and/or transmit extended IDs to their endpoint. | User EIDs are hidden from the adapter or module: `user.eids`, `user.ext.eids` |
| `transmitPreciseGeo` | A bid adapter, analytics adapter, or module wants to access and/or transmit precise geolocation data to their endpoint | device.geo latitude, longitude, and IP address are rounded off. Specifically, lat and long are truncated to two decimal places, IPv4 masks rightmost 8 bits, IPv6 masks the rightmost bits based on a configured value. In PBS-Java 3.0 and later, device.geo.{country,region,utcoffset} are preserved, but device.geo.{metro,city,zip,accuracy,ipservice,ext} are removed.|
| `transmitTid` | (PBS-Java only) The source.tid and imp.ext.tid fields can be generated or suppressed by PBS before going to bidders. The ext.prebid.createtid request parameter overrides the allow state of this activity. If `ext.prebid.createtid:false`, transmitTid is "denied". | If "allowed", then source.tid and imp.ext.tid will be generated by PBS. Otherwise, they won't be generated. |

<a id="rules"></a>

### Rules

There are several parts to an Activity Control rule:

1. Priority - the rule's position within the array matters - they are processed in order, and processing stops as soon as a definitive answer is found about whether to allow the activity or not.
1. Either a `condition` or a `privacyreg` directive.
    1. A `condition` defines the logic for matching the publisher's exception scenario. The condition should come along with an `allow` flag - what happens if the condition matches. The 'allow' flag defaults to `true`.
    1. A `privacyreg` statement defines which privacy modules the publisher wants to delegate this privacy decision.

The processing of each rule object has one of three outcomes:

1. `allow:true` (aka `allow`) - the activity is allowed to take place.
1. `allow:false` (aka `deny`) - the activity is **not** allowed to take place. This may result in anonymizing a portion of the request, stopping a usersync, or stopping a request from going to a bid adapter.
1. `abstain` - the rule does not definitively determine whether the activity should be allowed. This can happen in a number of scenarios:
    1. the rule condition doesn't match
    1. the privacy module determines the request is not in the scope of the legal jurisdiction. e.g. the USGen module will only make a ruling when the GPP Section ID declares the request in-scope.

As an example, here's a rule that always allows 'bidderX' to perform the activity and then delegates
the decision for every other bidder to the privacy modules:

```javascript
...
    "rules": [{
      "condition": {
        "componentName": ["bidderX"]
      },
      "allow": true
    },{
      "privacyreg": ["*"]
    }]
...
```

Note: The Prebid.js version of Activity Controls supports _explicit_ priority signals. That's not the case for the Prebid Server feature. Instead, priority in PBS is _implicit_ in the ordering of the array.

#### Rule Conditions

If a `condition` in a rule evaluates to true, the `allow` attribute of the rule will be utilized. If there's no condition specified, the rule's `allow` attribute will always be utilized.

These are the conditional attributes available:

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Type | Example |
|------|------|-------------|-------|-------|
| componentType | optional | Can be "bidder", "analytics", or "module". (PBS-Java 1.118) | array of strings | ["bidder"] |
| componentName | optional | Name of a specific bid adapter, analytics adapter, or module. (PBS-Java 1.118) | array of strings | ["bidderX"] |
| gppSid | optional | Resolves to true if regs.gpp_sid exists and intersects with the supplied array of values. (PBS-Java 1.21) | array of ints | [7,8,9,10,11,12] |
| geo | optional | Combines device.geo.country and device.geo.region and resolves to true if that country/reion combination is in the supplied array. (PBS-Java 1.21) | array of strings | ["USA","CAN.ON"] |
| gpc | optional | Compare the value of regs.ext.gpc and the SEC-GPC header - if either match the supplied value, the clause resolves to true. Set to `gpc: "1"` to match the flag being set. (PBS-Java 1.122) | string | "1" |

{: .alert.alert-info :}
Note on names: if two components share a name (e.g. "ssp1") for both a bid adapter and an analytics adapter, the rule can distinguish between them by providing both `componentName` and `componentType`.

Here's how the `geo` condition works:

1. If the value in the supplied array (e.g. ["USA"]) does **not** have a dot, then PBS looks only at device.geo.country for a case-sensitive match.
2. If the value in the supplied array (e.g. ["CAN.ON"]) **does** have a dot, PBS splits the value on the dot and looks for the left-hand side in device.geo.country and the right-hand side in device.geo.region. Both have to match.
3. Note that the specific values and cases of the country/region will depend on your geo-lookup service. i.e. you'll have to get the table of allowed values from MaxMind, Netacuity, or whichever geo-lookup service is in use.

#### Allow

If the rule's condition matches, the `allow` attribute defines whether the rule 'votes' to allow (true) or disallow (false) the activity in question.

If `allow` is not defined, the rule is assumed to assert **true** (i.e. allow the activity to happen).

### Examples

#### Example 1 - enable all privacy modules

This example may be a reasonable global default for host companies that want to default
all their accounts to use the `US General` module for all activities:

```json
{
  "privacy": {
    "allowactivities": {
      "syncUser": {
        "rules": [{
          "privacyreg": ["*"]
        }]
      },
      "fetchBids": {
        "rules": [{
          "privacyreg": ["*"]
        }]
      },
      "enrichUfpd": {
        "rules": [{
          "privacyreg": ["*"]
        }]
      },
      "reportAnalytics": {
        "rules": [{
          "privacyreg": ["*"]
        }]
      },
      "transmitUfpd": {
        "rules": [{
          "privacyreg": ["*"]
        }]
      },
      "transmitPreciseGeo": {
        "rules": [{
          "privacyreg": ["*"]
        }]
      }
    }
  }
}
```

#### Example 2 - bidder exception

Anonymize auctions and disable usersyncs for bidderA but otherwise delegate to privacy modules:

```json
{
  "privacy": {
    "allowactivities": {
      "transmitUfpd": {
        "rules": [{
            "condition": {
                "componentName": ["bidderA"]
            },
            "allow": false
        },{
            "privacyreg": ["*"]
        }]
      },
      "syncUser": {
        "rules": [{
            "condition": {
                "componentName": ["bidderA"]
            },
            "allow": false
        },{
            "privacyreg": ["*"]
        }]
      }
    }
  }
}
```

#### Example 3 - analytics exception

Prevent User First Party Data and EIDs from going to analytics adapters

```json
{
  "privacy": {
    "allowactivities": {
      "transmitUfpd": {
        "rules": [{
            "condition": {
                "componentType": ["analytics"]
            },
            "allow": false
        },{
            "privacyreg": ["iab.*"]
        }]
      }
    }
  }
}
```

#### Example 4 - GPP overrides

Anonymize when in the US states of Virginia or California when a relevant SID is active.

This scenario is a way to achieve a blunt anonymization even without the PBS USGen module:

```json
{
  "privacy": {
    "allowactivities": {
      "ACTIVITY": {
        "rules": [{
            "condition": {
                "gppSid": [7,8,9]
                "geo": ["USA.CA", "USA.VA"]
            },
            "allow": false
        }]
      }
    }
  }
}
```

#### Example 5 - GPC override

Anonymize when the [GPC flag](https://globalprivacycontrol.org/) is set.

```javascript
{
  privacy: {
    allowactivities: {
      ACTIVITY: {
        rules: [{
            condition: {
                gpc: "1"
            },
            allow: false
        }]
      }
    }
  }
}
```

## Modules

Modules that perform any 'potentially restricted activity' are responsible for confirming they are allowed to perform that activity. See [Adding a PBS Module](/prebid-server/developers/add-a-module.html) for more information.

## Further Reading

* [Prebid Server privacy regulation support](/prebid-server/features/pbs-privacy.html)
* [Prebid Server USGen privacy module](/prebid-server/features/pbs-usgen.html)
