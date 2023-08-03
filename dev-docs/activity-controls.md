---
layout: page_v2
title: Activity Controls
description: How to stop Prebid.js from doing things you don't want
sidebarType: 1
pbjs_version: 7.52
---

# Prebid.js Activity Controls
{: .no_toc }

Starting with version 7.52, Prebid.js introduced a centralized control mechanism for privacy-sensitive _activities_ - such as accessing device storage or sharing data with partners.
These controls are intended to serve as building blocks for privacy protection mechanisms, allowing module developers or publishers to directly specify what should be permitted or avoided in any given regulatory environment.

* TOC
{: toc }

## Overview

There are many privacy regulations that Prebid publishers need to accommodate. Prebid supplies [modules](/dev-docs/faq.html#how-does-prebid-support-privacy-regulations) to help Publishers implement their legal policies, but there are scenarios where extra control is needed:

* a Publisher's lawyers want to make a particular exception
* a module hasn't been built for a regulation the Publisher needs to support

Several, but not all, of the popular consent strings have modules (eg [Prebid Activity Controls -- GPP control module - usnat](/dev-docs/modules/gppControl_usnat.html)) that translate their contents into activity controls. These modules may have some overrides to default string interpretations available. When these overrides are insufficient for a publisher, or case law has abruptly changed, publishers may prefer direct control.

### Prebid Is a Toolkit

{: .alert.alert-danger :}
Important: This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.

1. Get a privacy lawyer.
2. Consider all the privacy regulations your content business is subject to.
3. Come up with a plan.
4. Use Prebid.js modules and these Activity Controls as ways to help implement your privacy plan with respect to header bidding.
5. Let us know if there are tools missing from the Prebid toolkit.

### What is an Activity?

We did an analysis of the things Prebid.js does and identified those related to privacy regulations. We call these things "potentially restricted activities", or just "activities" for short. Here are some:

* Setting a cookie
* Syncing ID cookies
* Transmitting user first-party data
* etc.

The [full list of activities Prebid.js supports](#activities) is below.

Think of an activity control as a 'gatekeeper' that makes the decision about whether the activity should be allowed in this specific context:

* Should I allow this cookie to be set for bidderA?
* Should I allow this usersync for bidderB?
* Is it ok for this data to be passed to bidderC and analyticsD?
* etc.

Prebid.js core checks with the Activity Controls to see whether an activity is allowed. The configuration for the activity can come from modules, custom functions in the page, or a rule-based JSON config.

### Example Activity Control

{: .alert.alert-info :}
In this example, bidderX wants to set a cookie through StorageManager, which queries the Activity Control System to determine whether that's allowed. The publisher has set up configuration that specifically enables bidderX to do this.

Here's an example JSON config that disables accessing local storage (including cookies) for everything except the bid adapter `bidderX`:

```javascript
pbjs.setConfig({
   allowActivities: {
       accessDevice: {
           default: false,
           rules: [{
              condition(params) {
                  return params.componentName === 'bidderX'
              },
              allow: true
           }]
       }
   }
})
```

<a id="config"></a>

## Configuration

`allowActivities` is a new option to [setConfig](/dev-docs/publisher-api-reference/setConfig.html). It contains a list of activity names -- see the [full list of activities below](#activities). Each activity is an object that can contain these attributes:

{: .table .table-bordered .table-striped }
| Name | Type | Description |
|------|------|-------------|
| `default` | Boolean | Whether the activity should be allowed if no other rule applies. Defaults to true. |
| `rules`   | Array of objects | Rules for this activity |
| `rules[].condition` | Function | Condition function to use for this rule; the rule applies only if this returns true. Receives a single object that contains [activity parameters](#parameters) as input. If omitted, the rule always applies. |
| `rules[].allow`    | Boolean | Whether the activity should be allowed when this rule applies. Defaults to true. |  
| `rules[].priority` | Number | Priority of this rule compared to other rules; a lower number means higher priority. See [note on rule priority](#priority) below. Defaults to 1. |  

`Rules` is an array of objects that a publisher can construct to provide fine-grained control over a given activity. For instance, you could set up a series of rules that says:

* Amongst the bid adapters, BidderA is always allowed to receive user first-party data
* Always let analytics adapters receive user first-party data
* Otherwise, let the active privacy modules decide
* if they refuse to decide, then the overall default is to allow the transmitting of user first-party data

There's more about [rules](#parameters) below.

<a id="activities"></a>

### Activities

Here's the list of the 'potentially restricted activities' that Prebid.js core can restrict for Publishers:

{: .table .table-bordered .table-striped }
| Name           | Description | Effect when denied | Additional parameters |
|----------------|-------------|---------------------------|--------------------------------|
| `accessDevice` | A component wants to use device storage  | Storage is disabled | [`storageType`](#params-accessDevice) |
| `enrichEids` | A user ID or RTD submodule wants to add user IDs to outgoing requests | User IDs are discarded | None |
| `enrichUfpd` | A Real-Time Data (RTD) submodule wants to add user first-party data to outgoing requests (`user.data` in ORTB) | User FPD is discarded | None |
| `fetchBids`  | A bid adapter wants to participate in an auction | Bidder is removed from the auction | [`configName`](#params-fetchBids) |
| `reportAnalytics` | An analytics adapter is being enabled through `pbjs.enableAnalytics` | Adapter remains disabled | None |
| `syncUser` | A bid adapter wants to fetch a [user sync](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing) | User sync is skipped | [`syncType`, `syncUrl`](#params-syncUser) |
| `transmitEids` | A bid adapter or RTD submodule wants to access and/or transmit user IDs to their endpoint | User IDs are hidden from the component | [`configName`](#params-fetchBids) |
| `transmitPreciseGeo` | A bid adapter or RTD submodule wants to access and/or transmit precise geolocation data to their endpoint | Component is allowed only 2-digit precision for latitude and longitude  | [`configName`](#params-fetchBids) |
| `transmitTid` | A bid adapter or RTD submodule wants to access and/or transmit globally unique transaction IDs to their endpoint | Transaction IDs are hidden from the component | [`configName`](#params-fetchBids) |
| `transmitUfpd` | A bid adapter or RTD submodule wants to access and/or transmit user FPD to their endpoint | User FPD is hidden from the component | [`configName`](#params-fetchBids) |

<a id="parameters"></a>

### Rules

There are three parts to an Activity Control's rule:

 1. The priority
 2. The condition
 3. The allow flag

For example, this rule would allow bidderX to perform the activity if no higher priority rules take precedence.

```javascript
...
    rules: [{
        priority: 10,               // average priority
        condition(params) {
            return params.componentName === 'bidderX'
        },
        allow: true
    }]
...
```

<a id="priority"></a>

#### Rule Priority

Activity control rules in Prebid.js can be created by two main sources:

* Publisher `setConfig({allowActivities})` as in the examples shown here. When set this way, rules are considered the highest priority value of 1.
* Modules can set activity control rules, e.g. [usersync](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing), [bidderSettings](/dev-docs/publisher-api-reference/bidderSettings.html), the [GPP](/dev-docs/modules/consentManagementGpp.html) or [GDPR](/dev-docs/modules/gdprEnforcement.html) modules. Rules set by modules have a less urgent priority of 10.

When rules are processed, they are sorted by priority, and all rules of the same priority are considered to happen at the same time. The details:

1. The highest rule priority is 1
2. There's no defined lowest priority other than MAXINT
3. Default priority for rules defined with setConfig is 1. The default priority for other rules is 10.
4. When processing, group the rules by priority
5. Then, in descending order of priority:
    1. If any rule that matches the condition defines `allow: false`, the activity is DENIED.
    2. Otherwise, if at least one rule that matches the condition defines `allow: true`, the activity is ALLOWED.
    3. If any rule matches, break out of the priority loop.
6. If none of the rules match, and the activity defines `default: false`, the activity is DENIED.
7. Otherwise, the activity is ALLOWED.

So this means that when `priority` is omitted from `allowActivities` configuration, it acts as an override over other control mechanisms. For example:

```javascript
pbjs.setConfig({
    accessDevice: false,      // this would have the effect of disabling device storage, but... 
    allowActivities: {
        accessDevice: {
            rules: [
                {allow: true} // ... it's overridden by this condition-less rule with a default priority of 1
            ]
        }
    } 
}) 
```

If a priority number greater than 10 is specified, the rule only takes effect when all other controls have allowed the activity. For example:

```javascript
pbjs.setConfig({
    allowActivities: {
        accessDevice: {
            // the intent here is to disable cookies but allow HTML5 localStorage
            // because this defines priority > 10, other controls will be checked first
            // e.g. if GDPR is in-scope and there's no consent, this priority 20 rule won't be processed
            default: false,
            rules: [{
                condition({storageType}) {
                    return storageType === 'html5'
                },
                allow: true,
                priority: 20
            }]
        }
    }
})
```

#### Rule Conditions

A `condition` is a javascript function that receives information about the activity that is about to be performed. If a condition evaluates to true, the `allow` attribute of the rule will be utilized. If there's no condition specified, the rule's `allow` attribute will always be utilized.

These are the parameters available to the condition function:

{: .table .table-bordered .table-striped }
| Name | Type | Available for | Description |  
|------|------|-------------|---------------|
| `componentType` | String | All activities | One of: `'bidder'`, `'userId'`, `'rtd'`, `'analytics'`, or `'prebid'`; identifies the type of component (usually a module) that wishes to perform the activity. `'prebid'` is reserved for Prebid core itself and a few "privileged" modules such as the [PBS adapter](/dev-docs/modules/prebidServer.html). |
| `componentName` | String | All activities | Name of the component; this is (depending on the type) either a bidder code, user ID or RTD submodule name, analytics provider code, or module name. |
| `component`     | String | All activities | This is always a dot-separated concatenation of `componentType` and `componentName`; for example, with `{componentType: 'bidder', componentName: 'bidderX'}`, `component` is `'bidder.bidderX'`. |
| `adapterCode`   | String | All activities | If `componentType` is `'bidder'`, and `componentName` is an [alias](/dev-docs/publisher-api-reference/aliasBidder.html), then `adapterCode` is the bidder code that was aliased; or identical to `componentName` if the bidder is not an alias. This is undefined when the component is not a bidder.|
| `configName`    | String | <a id="params-fetchBids"></a> `fetchBids`    | When the Prebid Server adapter is part of an auction, this is the name given to its [s2s configuration](/dev-docs/modules/prebidServer.md), if any. |
| `storageType`   | String | <a id="params-accessDevice"></a> `accessDevice` | Either `'html5'` or `'cookie'` - the device storage mechanism being accessed. |
| `syncType`      | String | <a id="params-syncUser"></a> `syncUser`     | Either `'iframe'` or `'image'` - the type of user sync. |
| `syncUrl`       | String | `syncUser`     | URL of the user sync. |

#### Allow Flag

If the rule's condition matches, this attribute defines whether the rule 'votes' to allow (true) or disallow (false) the activity in question.

As noted in the priority section, **disallow** (false) takes precedence amongst rules at the same priority level.

If `allow` is not defined, the rule is assumed to assert **true** (i.e. allow the activity to take place).

### More examples

#### Always include a particular bidder in auctions

This is similiar to the 'vendor exception' feature of the [GDPR Enforcement Module](/dev-docs/modules/gdprEnforcement.html). This would always allow bidderA to participate in the auction, even without explicit consent in GDPR scenarios. It might indicate, for instance, that this is a 'first party bidder'.

```javascript
pbjs.setConfig({
  allowActivities: {
    fetchBids: {
        rules: [{
            condition: ({componentName}) => componentName === 'bidderA',
            allow: true
        }]
    }
  }
})
```

#### Disable all user syncs except for specific domains

```javascript
const DOMAINLIST = [
    'https://example-domain.org',
    'https://other-domain.com',
];

pbjs.setConfig({
    allowActivities: {
        syncUser: {
            default: false,
            rules: [{
                condition({syncUrl}) {
                    return DOMAINLIST.some(domain => syncUrl.startsWith(domain));
                },
                allow: true
            }]
        }
    }
})
```

#### Deny a particular vendor access to user IDs

```javascript
pbjs.setConfig({
  allowActivities: {
    transmitEids: {
        rules: [{
            condition: ({componentName}) => componentName === 'exampleVendor',
            allow: false,
        }]
    }
  }
})
```

#### __uspapi CCPA/CPRA based control

Reference: [US Privacy User Signal Mechanism “USP API” Specification](https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/USP%20API.md)

```javascript
function isCCPAConsentDenied() {
### assumes uspapi is properly implemented and available in your environment.
### check usp string for the second character (notice) is not 'Y' or third character (opt out) is not 'N' or first character (version) is not '1'
   __uspapi('getUSPData', 1 , (uspData, success) => { if(uspData.uspString.charAt(2) ==='Y' || uspData.uspString.charAt(1) !=='Y'|| uspData.uspString.charAt(0) !=='1') { return true } else { return false }});
}

pbjs.setConfig({
    allowActivities: {
          enrichUfpd: {
                 rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                 }]
          },
          enrichEids: {
                rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                }]
          },
          reportAnalytics: {
                rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                }]
          },
          syncUser: {
                rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                }]
          },
          transmitEids: {
                rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                }]
          },
          transmitPreciseGeo: {
                rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                }]
          },
          transmitUfpd: {
                rules: [{
                       condition: isCCPAConsentDenied,
                       allow: false
                }]
          }
          
    }
})
```

#### When there's a GPP CMP active, anonymize everything

This example might be useful for publishers using a version
of Prebid.js that supports activity controls but does not support
the [USNat module](/dev-docs/modules/gppControl_usnat.html).

```javascript
if (in-page code to detect that GPP SID 7 through 12 are in-scope or if the GPC flag is set) {
  pbjs.setConfig({
    allowActivities: {
      enrichEids: {
        default: false
      },
      transmitEids: {
        default: false
      },
      … see other activities in https://docs.prebid.org/dev-docs/activity-controls.html …
    }
  });
}
```

#### Always allow sharedId to be passed, others determined by privacy regs

To make exceptions for certain IDs, there are two steps:

1. Always allow the transmitEids activity to take place
1. Configure the enrichEids activity to allow only the desired IDs

This approach works in conjunction with other activity-control compiant modules (like the [GPP USNat module](/dev-docs/modules/gppControl_usnat.html).

```javascript
    pbjs.setConfig({
      allowActivities: {
        enrichEids: {
          default: false,
          priority: 1,
          rules: [{
              condition(params) {
                  return params.componentName === 'sharedIdSystem'
              },
              allow: true
           }]
        },
        transmitEids: {
          rules: [{
              allow: true
        },
        … see other activities in https://docs.prebid.org/dev-docs/activity-controls.html …
      }
    });
```

## Further Reading

* [FAQ: How does Prebid.js support privacy regulations](/dev-docs/faq.html#how-does-prebid-support-privacy-regulations)
