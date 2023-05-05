---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Actvity Controls

---

# Prebid Server | Features | Actvity Controls

# Prebid Server Activity Controls
{: .no_toc }

{: .alert.alert-warning :}
The Floors feature is currently only available in PBS-Java.

Prebid supports a centralized control mechanism for privacy-sensitive activities.
These controls are intended to serve as building blocks for privacy protection mechanisms, allowing module developers or publishers to directly specify what should be permitted or avoided in any given regulatory environment.

* TOC
{: toc }

## Overview

There are many privacy regulations that Prebid publishers need to accomodate. Prebid Server supplies [several features](/prebid-server/features/pbs-privacy.html) to help Publishers implement their legal policies, but there are scenarios where extra control is needed:

- a Publisher's lawyers want to make a particular exception
- a module hasn't been built for a regulation the Publisher needs to support

### Prebid Server Is a Toolkit

{: .alert.alert-danger :}
Important: This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.

1. Get a privacy lawyer.
2. Consider all the privacy regulations your content business is subject to.
3. Come up with a plan.
4. Use Prebid.js modules and these Activity Controls as ways to help implement your privacy plan with respect to header bidding.
5. Let us know if there are tools missing from the Prebid toolkit.

### Activity Model

We did an analysis of the kinds of things Prebid does and identified those that might be of concern to privacy regulations. We call these things "potentially restricted activities", or just "activities" for short. Here are some activities:

- Setting a cookie
- Syncing ID cookies
- Transmitting user first party data
- etc.

The [full list of activities Prebid supports](#activities) is below.

Think of an activity control as a 'gatekeeper' that makes the decision about whether the activity should be allowed in this specific context:

- Should I allow this usersync for bidderB?
- Is it ok for this data to be passed to bidderC and analyticsD?
- Should I anonymize the geographic information for this request?
- etc.

Prebid Server core checks with the Activity Controls to see whether an activity is allowed. The configuration for the activity comes from account configuration.

### Example Activity Control

Here's an example account config that prevents bidderA, bidderB, and analytics adapters from receiving `user.eids[]`:
```
{
  privacy: {
    allowactivities: {
      transmitEids: {
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
```

<a id="config" />

## Configuration

`allowActivities` is a new option to account configuration that contains a list of activity names -- see the [full list of activities below](#activities). Each activity is an object that can contain these attributes:

{: .table .table-bordered .table-striped }
| Name | Type | Description | 
|------|------|-------------|
| `default` | Boolean | Whether the activity should be allowed if no other rule applies. Defaults to true. |
| `rules`   | Array of objects | Rules for this activity |
| `rules[].condition` | Function | Condition function to use for this rule; the rule applies only if this returns true. Receives a single object that contains [activity parameters](#rules) as input. If omitted, the rule always applies. 
| `rules[].allow`    | Boolean | Whether the activity should be allowed when this rule applies. Defaults to true. |  

`Rules` is an array of objects that a publisher can contruct to provide fine-grained control over a given activity. For instance, you could set up a series of rules that says:

- Amongst the bid adapters, BidderA is always allowed to receive user first party data
- Always let analytics adapters receive user first party data
- otherwise, let the active privacy modules decide
- if they refuse to decide, then the overall default is to allow the transmitting of user first party data

There's more about [rules](#rules) below.

<a id="activities" />

### Activities

Here's the list of the 'potentially restricted activities' that Prebid Server core can restrict for Publishers.

{: .table .table-bordered .table-striped }
| Name           | Description | Effect when denied |
|----------------|-------------|---------------------------|
| `syncUser` | The [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) or [/setuid](/prebid-server/endpoints/pbs-endpoint-setuid.html) endpoint has been asked to perform a sync or set-cookie. | Sync or setuid is skipped for one or more bidders. |
| `fetchBids`  | A bid adapter wants to participate in an auction | Bidder is removed from the auction |
| `enrichUfpd` | A Real Time Data (RTD) submodule wants to add user first party data to outgoing requests (`user.data` in ORTB) | User FPD is discarded |
| `reportAnalytics` | The [/auction], [/amp], or [/event] endpoint is about to call an analytics adapter. | Adapter is not called. |
| `transmitEids` | A bid adapter or RTD submodule wants to access and/or transmit user IDs to their endpoint | User IDs are hidden from the component | None |
| `transmitPreciseGeo` | A bid adapter or RTD submodule wants to access and/or transmit precise geolocation data to their endpoint | Component is allowed only 2-digit precision for latitude and longitude  | None |
| `transmitUfpd` | A bid adapter or RTD submodule wants to access and/or transmit user FPD to their endpoint | User FPD is hidden from the component | None |

<a id="rules" />

### Rules
 
 There are three parts to an Activity Control's rule:
 
 1. The priority
 2. The condition
 3. The allow status

 For example, this rule would allow bidderX to perform the activity if no higher priority rules take precedence. 
 ```
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

<a id="priority" />

#### Rule Priority

Activity control rules in Prebid.js can be created by two main sources:

- Publisher `setConfig({allowActivities})` as in the examples shown here. When set this way, rules are consider the highest priority value of 1.
- Modules can set activity control rules, e.g. [usersync](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing), [bidderSettings](/dev-docs/publisher-api-reference/bidderSettings.html), the [GPP](/dev-docs/modules/consentManagementGpp.html) or [GDPR](/dev-docs/modules/gdprEnforcement.html) modules. Rules set by modules have a less urgent priority of 10. 

When rules are processed, they are sorted by priority, and all rules of the same priority are considered to happen at the same time. The details:

1. The highest rule priority is 1
2. There's no defined lowest priority other than MAXINT
3. Default priority for rules defined with setConfig is 1. Default priority for other rules is 10.
4. When processing, group the rules by priority
5. Then, in descending order of priority:
    1. If any rule that matching the condition defines `allow: false`, the activity is DENIED.
    2. Otherwise, if at least one rule that matches the condition defines `allow: true`, the activity is ALLOWED.
    3. If any rule matched, break out of the priority loop.
6. If none of rules match, and the activity defines `default: false`, the activity is DENIED.
7. Otherwise, the activity is ALLOWED.

So this means that when `priority` is omitted from `allowActivities` configuration, it acts as an override over other control mechanisms. For example:

```javascript
pbjs.setConfig({
    deviceAccess: false,      // this would have the effect of disabling device storage, but... 
    allowActivities: {
        accessDevice: {
            rules: [
                {allow: true} // ... it's overridden by this conditionless rule with default priority of 1
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
 
A `condition` in an Activity Control rule is a function that receives information about the activity that is about to be performed. If a condition evaluates to true, the `allow` attribute of the rule will be utilized. If there's no condition specified, the rule's `allow` attribute will always be utilized.

These are are the parameters available to the condition function:

{: .table .table-bordered .table-striped }
| Name | Type | Available for | Description |  
|------|------|-------------|---------------|
| `componentType` | String | All activities | One of: `'bidder'`, `'userId'`, `'rtd'`, `'analytics'`, or `'prebid'`; identifies the type of component (usually a module) that wishes to perform the activity. `'prebid'` is reserved for Prebid core itself and a few "privileged" modules such as the [PBS adapter](/dev-docs/modules/prebidServer.html). | 
| `componentName` | String | All activities | Name of the component; this is (depending on the type) either a bidder code, user ID or RTD submodule name, analytics provider code, or module name. |
| `component`     | String | All activities | This is always a dot-separated concatenation of `componentType` and `componentName`; for example, with `{componentType: 'bidder', componentName: 'bidderX'}`, `component` is `'bidder.bidderX'`. |
| `adapterCode`   | String | All activities | If `componentType` is `'bidder'`, and `componentName` is an [alias](/dev-docs/publisher-api-reference/aliasBidder.html), then `adapterCode` is the bidder code that was aliased; or identical to `componentName` if the bidder is not an alias. This is undefined when the component is not a bidder.|
| `configName`    | String | <a id="params-fetchBids" /> `fetchBids`    | When the Prebid Server adapter is part of an auction, this is the name given to its [s2s configuration](/dev-docs/modules/prebidServer.md), if any. | 
| `storageType`   | String | <a id="params-accessDevice" /> `accessDevice` | Either `'html5'` or `'cookie'` - the device storage mechanism being accessed. |
| `syncType`      | String | <a id="params-syncUser" /> `syncUser`     | Either `'iframe'` or `'image'` - the type of user sync. | 
| `syncUrl`       | String | `syncUser`     | URL of the user sync. |

#### Rule Allow Status

If the rule's condition matches, this attribute defines whether the rule 'votes' to allow (true) or disallow (false) the activity in question.

As noted in the priority section, **disallow** (false) takes precedence amongst rules at the same priority level.

If `allow` is not defined, the rule is assumed to assert **true** (i.e. allow).

### More examples

#### Always include a particular bidder in auctions

This is similiar to the 'vendor exception' feature of the [GDPR Enforcement Module](/dev-docs/modules/gdprEnforcement.html). This would always allow bidderA to participate in the auction, even without explicit consent in GDPR scenarios. It might indicate, for instance, that this is a 'first party bidder'.

```javascript
pbjs.setConfig({
    fetchBids: {
        rules: [{
            condition: ({componentName}) => componentName === 'bidderA',
            allow: true
        }]
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
                    return DOMAINLIST.find(domain => syncUrl.startsWith(domain))
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
    transmitEids: {
        rules: [{
            condition: ({componentName}) => componentName === 'exampleVendor',
            allow: false,
        }]
    }
})
```

## Further Reading 
- [Prebid Server privacy regulation support](/prebid-server/features/pbs-privacy.html)
