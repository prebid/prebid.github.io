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

There are many privacy regulations that Prebid publishers need to accomodate. Prebid Server supplies [several features](/prebid-server/features/pbs-privacy.html) to help Publishers implement their legal policies, but there are scenarios where extra control is needed:

* a Publisher's lawyers want to make a particular exception
* support hasn't been built for a regulation the Publisher needs to comply with

### Prebid Server Is a Toolkit

{: .alert.alert-danger :}
Important: This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.

1. Get a privacy lawyer.
2. Consider all the privacy regulations your content business is subject to.
3. Come up with a plan.
4. Use Prebid Server server features and these Activity Controls as ways to help implement your privacy plan with respect to header bidding.
5. Let us know if there are tools missing from the Prebid toolkit.

### What is an Activity?

We did an analysis of the things Prebid does that might be of concern to privacy regulations. We call these things "potentially restricted activities", or just "activities" for short. Some examples:

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

Here's an example account config that prevents bidderA, bidderB, and analytics adapters from receiving `user.eids[]` and `user.ext.data`:

```javascript
{
  privacy: {
    allowactivities: {
      transmitUfpd: {
        default: true,
        rules: [{
          condition: {
            componentName: ["bidderA", "bidderB"]
          },
          allow: false
        },{
          condition: {
            componentType: ["analytics"]
          },
          allow: false
        }]
      }
    }
  }
}
```

<a id="config"></a>

### Activity Controls in relation to other privacy regulations

In the long-term, the vision is that Activity Control config will become a
complete description for the allow/deny status of a particular action. 
However, for now, the existing privacy regulations (GDPR, USP, COPPA) still
sit ouside of the config.

Here's how to think of the interaction:

```text
Deny takes precedence.
```

Activity Controls are processed first. If the control `denies` the activity, work is done: the action is suppressed. However, if the control `allows` the
activity, the system will still go on to check [other relevant privacy activities](/prebid-server/features/pbs-privacy.html).

## Configuration

The `privacy.allowActivities` is a new account configuration option that contains a list of activity names -- see the [full list of activities below](#activities).

```javascript
{
  privacy: {
    allowactivities: {
      ACTIVITY: {
        default: true,
        rules: [{
          condition: { ... },
          allow: false
        },{
          ... more rules ...
        }]
     }
   }
 }
}
```

Each activity is an object that can contain these attributes:

{: .table .table-bordered .table-striped }
| Name | Type | Description |
|------|------|-------------|
| `default` | boolean | Whether the activity should be allowed if no other rule applies. Defaults to true. |
| `rules`   | array of objects | Rules for this activity |
| `rules[].condition` | object | Conditions to use for this rule. See the [rules](#rules) section below for details. If omitted, the rule always applies. |
| `rules[].allow`    | boolean | Whether the activity should be allowed when this rule applies. Defaults to true. |  

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
| `transmitUfpd` | A bid adapter, analytics adapter, or module wants to access and/or transmit user FPD or EIDs to their endpoint | User FPD and EIDs are hidden from the adapter or module: `user.data`, `user.ext.data`, `user.{id, buyeruid, yob, gender}`, `user.eids`, `device.{device.ifa, macsha1, macmd5, dpidsha1, dpidmd5, didsha1, didmd5}` |
| `transmitPreciseGeo` | A bid adapter, analytics adapter, or module wants to access and/or transmit precise geolocation data to their endpoint | Latitude, longitude, and IP address are rounded off. Specifically, lat and long are truncated to two decimal places, IPv4 masks rightmost 8 bits, IPv6 masks the rightmost bits based on a configured value. |

<a id="rules"></a>

### Rules

There are three parts to an Activity Control's rule:

1. The priority - position within the array
2. The `condition` - logic for matching the rule
3. The `allow` status - what happens if the condition matches

For example, this rule would allow bidderX to perform the activity if no higher priority rules take precedence.

```javascript
...
    rules: [{
      condition: {
        componentName: ["bidderX"]
      },
      allow: true
    }]
...
```

Note: The Prebid.js version of this feature supports _explicit_ priority signals. That's not the case for the Prebid Server feature. Instead, for PBS, priority is implicit in the ordering of the array.

#### Rule Conditions

If a `condition` in a rule evaluates to true, the `allow` attribute of the rule will be utilized. If there's no condition specified, the rule's `allow` attribute will always be utilized.

These are the conditional attributes available:

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Type | Example |
|------|------|-------------|-------|-------|
| componentType | optional | Can be "bidder", "analytics", or "module". | array of strings | ["bidder"] |
| componentName | optional | Name of a specific bid adapter, analytics adapter, or module. | array of strings | ["bidderX"] |
| gppSid | optional | Resolves to true if regs.gpp_sid exists and intersects with the supplied array of values. (PBS-Java 1.21) | array of ints | [7,8,9,10,11,12] |
| geo | optional | Combines device.geo.country and device.geo.region and resolves to true if that country/reion combination is in the supplied array. (PBS-Java 1.21) | array of strings | ["USA","CAN.ON"] |
| gpc | optional | Compare the value of regs.ext.gpc and the SEC-GPC header - if either match the supplied value, the clause resolves to true. Set to `gpc: "1"` to match the flag being set. (PBS-Java 1.122) | string | "1" |

{: .alert.alert-info :}
Note on names: if two components share a name (e.g. "ssp1") for both a bid adapter and an analytics adapter, the rule may need to distinguish between them by providing both `componentName` and `componentType`.

Here's how the `geo` condition works:

1. If the value in the supplied array (e.g. ["USA"]) does not have a dot, then PBS looks only at device.geo.country for a case-sensitive match.
2. If the value in the supplied array (e.g. ["CAN.ON"]) does have a dot, PBS splits the value on the dot and looks for the left-hand side in device.geo.country and the right-hand side in device.geo.region. Both have to match.
3. Note that the specific values and cases of the country/region will depend on your geo-lookup service. i.e. you'll have to get the table of allowed values from MaxMind, Netacuity, or whichever geo-lookup service is in use.

#### Allow

If the rule's condition matches, the `allow` attribute defines whether the rule 'votes' to allow (true) or disallow (false) the activity in question.

If `allow` is not defined, the rule is assumed to assert **true** (i.e. allow the activity to happen).

### Interaction with other privacy features

Currently, the Activity Control feature is separate from other privacy features:

1. Activity Controls are run before other privacy features. So, for instance, if a bidder is removed from a request by the `fetchBids` activity, the GDPR processing for that bidder will not take place.
2. GDPR-suppression activities must still be managed through that feature's configuration. (See details for [PBS-Go](https://github.com/prebid/prebid-server/blob/master/config/config.go) or [PBS-Java](https://github.com/prebid/prebid-server-java/blob/master/docs/config-app.md))
3. Likewise, Activity Control rules do not override USPrivacy or COPPA.

{: .alert.alert-info :}
While Activity Controls are currently not well integrated with other privacy features, that will change over the coming months.

### Examples

#### Anonymize auctions and disable usersyncs for bidderA

```javascript
{
  privacy: {
    allowactivities: {
      transmitUfpd: {
        rules: [{
            condition: {
                componentName: ["bidderA"]
            },
            allow: false
        }]
      },
      syncUser: {
        rules: [{
            condition: {
                componentName: ["bidderA"]
            },
            allow: false
        }]
      }
    }
  }
}
```

#### Prevent User First Party Data and EIDs from going to analytics adapters

```javascript
{
  privacy: {
    allowactivities: {
      transmitUfpd: {
        rules: [{
            condition: {
                componentType: ["analytics"]
            },
            allow: false
        }]
      }
    }
  }
}
```

#### Anonymize when in the US states of Virginia or California when a relevant SID is active

This scenario is mainly for a transition period when the Prebid Server USNat module is not available, providing a configurable way for publishers to implement anonymization if advised by their legal team.

```javascript
{
  privacy: {
    allowactivities: {
      ACTIVITY: {
        rules: [{
            condition: {
                gppSid: [7,8,9]
                geo: ["USA.CA", "USA.VA"]
            },
            allow: false
        }]
      }
    }
  }
}
```

#### Anonymize when the GPC flag is set

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
