---
layout: page_v2
title: Activity controls
description: How to stop Prebid from doing things you don't want
sidebarType: 1
---

# Activity controls
{: .no_toc }

Starting with version 7.48, Prebid.js introduced a centralized control mechanism for privacy-sensitive _activities_ - such as accessing device storage or sharing data with partners.
These are intended to serve as building blocks for more privacy protection mechanism, allowing module developers or publishers to directly specify what should be permitted or avoided in any given regulatory environment.


* TOC
{: toc }


#### Example

The following disables storage for everything except the bid adapter `bidderX`:

```
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
       }`
   }
})
```

<a id="config" />

### Configuration

```allowActivities``` is a map from activity name ([see full list below](#activities)) to a configuration object that contains:

{: .table .table-bordered .table-striped }
| Name | Type | Description | 
|------|------|-------------|
| `default` | Boolean | Whether the activity should be allowed if no other rule applies. Defaults to true. |
| `rules`   | Array of objects | Rules for this activity |
| `rules[].condition` | Function | Condition function to use for this rule; the rule applies only if this returns true. Receives a single object that contains [activity parameters](#parameters) as input. If omitted, the rule always applies. 
| `rules[].allow`    | Boolean | Whether the activity should be allowed when this rule applies. Defaults to true. |  
| `rules[].priority` | Number | Priority of this rule compared to other rules; a lower number means higher priority. See [note on rule priority](#priority) below. Defaults to 1. |  

<a id="activities" />

### Activities

{: .table .table-bordered .table-striped }
| Name           | Description | Effect when denied | Additional parameters |
|----------------|-------------|---------------------------|--------------------------------|
| `accessDevice` | A component wants to use device storage  | Storage is disabled | [`storageType`](#params-accessDevice) |
| `enrichEids` | A user ID or RTD submodule wants to add user IDs to outgoing requests | User IDs are discarded | None |
| `enrichUfpd` | An RTD submodule wants to add user first party data to outgoing requests (`user.data` in ORTB) | User FPD is discarded | None |
| `fetchBids`  | A bid adapter wants to participate in an auction | Bidder is removed from the auction | [`configName`](#params-fetchBids) |    
| `reportAnalytics` | An analytics adapter is being enabled through `pbjs.enableAnalytics` | Adapter remains disabled | None |
| `syncUser` | A bid adapter wants to fetch a [user sync](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing) | User sync is skipped | [`syncType`, `syncUrl`](#params-syncUser) |
| `transmitEids` | A bid adapter or RTD submodule wants to access and/or transmit user IDs to their endpoint | User IDs are hidden from the component | None |
| `transmitPreciseGeo` | A bid adapter or RTD submodule wants to access and/or transmit precise geolocation data to their endpoint | Component is allowed only 2-digit precision for latitude and longitude  | None |
| `transmitUfpd` | A bid adapter or RTD submodule wants to access and/or transmit user FPD to their endpoint | User FPD is hidden from the component | None |

<a id="parameters" />

### Activity parameters
 
`condition` functions receive information about the activity that is about to be performed as _activity parameters_:

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

<a id="priority" />

### How rule priority works

By default, rules set through the `allowActivities` config have a priority of 1, and every other rule (set by, for example, `filterSettings`, `bidderSettings`, the [GPP](/dev-docs/modules/consentManagementGpp.html) or [GDPR](/dev-docs/modules/gdprEnforcement.html) modules, etc) have a less urgent priority of 10. 
This means that when `priority` is omitted, `allowActivities` configuration acts as an override over all other control mechanisms. For example:

```javascript
pbjs.setConfig({
    deviceAccess: false,      // this would have the effect of disabling device storage, but... 
    allowActivities: {
        accessDevice: {
            rules: [
                {allow: true} // ... it's overridden by allowActivities with when priority is < 10 (or omitted) 
            ]
        }
    } 
}) 
```

If a priority number greater than 10 is specified, the rule only takes effect when all other controls have allowed the activity; for example:

```javascript
pbjs.setConfig({
    allowActivities: {
        accessDevice: {
            // disable all storage except localStorage.
            // because this is using priority > 10, it still requires all other controls to allow storage;
            // deviceAccess should be true; bidders need `storageAllowed` to be set through `bidderSettings`;
            // if the GDPR module is enabled, vendor consent needs to have been given, etc 
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

#### More examples


Disable all user syncs except for specific domains:

```javascript
const WHITELIST = [
    'https://example-domain.org',
    'https://other-domain.com',
];

pbjs.setConfig({
    allowActivities: {
        syncUser: {
            default: false,
            rules: [{
                condition({syncUrl}) {
                    return WHITELIST.find(domain => syncUrl.startsWith(domain))
                },
                allow: true
            }]
        }
    }
})
```

Always include a particular bidder in auctions (vendor exception):

```javascript
pbjs.setConfig({
    fetchBids: {
        rules: [{
            condition: ({componentName}) => componentName === 'firstPartyBidder',
            allow: true
        }]
    }
})
```

Deny a particular vendor access to user IDs:

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
