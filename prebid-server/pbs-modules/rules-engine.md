---
layout: page_v2
sidebarType: 5
title: Prebid Server | Modules | Rules Engine
---

# Prebid Server | Modules | Rules Engine
{: .no_toc}

- TOC
{:toc}

## Overview

The Rules Engine is a flexible module that lets host companies define JSON configuration for controlling various aspects of requests rather than having to having to code exceptions in a standalone module or in the core of Prebid Server.

Most of the use cases for this version are centered around controlling which bid adapters are called in particular scenarios, based on:

- host geography
- user geography
- presence of a synced ID for that bidder
- presence of first party data
- channel (web vs mobile app)

### Limitations

The first phase is limited in a number of ways:

- Runs only at the Processed-Auction stage.
- Only delivers functions for including and excluding bidders.
- Does not necessarily reload config periodically like the Floors feature, making integration with a backend machine learning system more difficult.
- Does not support getting rules config from multiple sources. e.g. host-level rules cannot be merged with account-level rules. And ideally, there could someday be an ecosystem of vendors supplying config for different rule sets. This is not currently possible.

### Future Enhancements

- Add additional results functions.
- Support additional module stages.
- Improve getting configuration from multiple sources.

The team will tackle enhancements as important use cases drive priority. 

## Quick Start

For those who prefer to jump right in and see what it looks like, here's an example Rules Engine configuration that:

98% of the time

- removes bidderA in the EU datacenter
- removes bidderD in the EU datacenter if that bidder hasn't synced with this user
- removes bidderB and bidderF in the APAC datacenter
- logs any bidder removed to analytics

2% of the time

- logs "control" to analytics

```json
{
  "hooks": {
    "modules": {
      "pb-rules-engine": {
        "enabled": true,
        "timestamp": "20250314 00:00:00",
        "ruleSets": [
          {
            "stage": "processed-auction-request",
            "name": "remove-bidder-by-datacenter",
            "version": "1234",
            "modelGroups": [{
                "weight": 98,
                "analyticsKey": "rm-bidder-by-dc",
                "version": "4567",
                "schema": [{"function": "datacenters"}],
                "default": [],
                "rules": [{
                    "conditions": ["eu"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": [ "bidderA"],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-eu"
                          },{
                            "bidders": ["bidderD"],
                            "seatnonbid": 203,
                            "ifSyncedId": false,
                            "analyticsValue": "rm-eu-nosync"
                          }
                        ]
                      }
                    ]
                  },{
                    "conditions": ["apac"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderB", "bidderF"],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-apac"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },{
                "weight": 2,
                "analyticsKey": "rm-bidder-by-dc",
                "default": [
                  {
                    "function": "logAtag",
                    "args": {
                      "analyticsValue": "control"
                    }
                  }
                ]

              }
            ]
          }
        ]
      }
    }
  }
}
```

## How it Works

Similar to the Floors feature, it's assumed that an offline machine-learning algorithm will be part of a bidder optimization feedback loop to adjust to changing conditions. Here's the assumed architecture:

![Prebid Server Rules Engine Module](/assets/images/prebid-server/pbs_rules_engine_context.png){:class="pb-xlg-img"}

1. Auction requests come in that trigger the Rules Engine Module.
1. The module reads the current set of rules from account configuration or by directly fetching them from the service provider.
1. The results of the optimization decision and the auction are logged via analytics.
1. Eventually the configuration is updated with refined rules.

The initial goal of this module is to define the runtime capabilities that are required to surgically select bidders. We've defined a technical interface and a runtime behavior. Some uses of the module might be manually configured, but the most valuable use of the system will be in the periodic offline machine learning. The goal there is for Prebid to step out of the way and let members of the ecosystem compete to do the best job.

We envision a time when, like the floors sytem, there are multiple vendors providing optimization services of different kinds.

## Configuration Details

Configuration is covered in several sections:

1. [Module configuration syntax](#module-account-level-configuration) - the JSON used to express which bidders should run when. This is basically a kind of a Domain-Specific Language (DSL) where the 
1. [Rule Trees](#rule-trees) - groups of rules should be thought of as 'trees' split along dimensions like 'datacenter' and 'channel'. These trees are processed in a particular way.
1. [Schema Functions](#schema-functions) - which dimensions and comparisons can be used in the configuration. 
1. [Results Functions](#results-functions) - the specific outcomes once a specific rule is chosen.
1. [Runtime Processing](#runtime-processing) - how it all comes together.

### Module Account-Level Configuration

These are the full set of attributes that can be present in the account-level configuration:

{: .table .table-bordered .table-striped }
| Property | Scope | Type | Description | Example |
|----------|-------|------|-------------|---------|
| enabled | optional | boolean | Whether the module as a whole is enabled. Allows for easy temporary deactivation. Defaults to true. | true |
| ruleSets[] | required | array of objects | One or more independent sets of rules. | |
| ruleSets[]<wbr>.enabled | optional | boolean | Indicates whether this ruleset is active. Defaults to true. Allows easy toggling for troubleshooting. | true |
| ruleSets[]<wbr>.timestamp | optional | string | String indicates when this ruleset was last updated. Useful in optimization and troubleshooting. | "20250101 00:00:00" |
| ruleSets[]<wbr>.stage | required | string | Which module stage this object applies to. Initially the only value allowed is "processed auction" | "processed auction" |
| rulesets[]<wbr>.name | optional | string | Just for human readability. | "remove-bidder-by-datacenter" |
| ruleSets[]<wbr>.modelGroups[] | required | array of objects | This is where the rule details are stored. It's an array in case there's a desire to A/B test different rule configs. Model groups work here like they do for [floors](/dev-docs/modules/floors.html#schema-2). | |
| ruleSets[]<wbr>.modelGroups[]<wbr>.weight | optional | integer | The relative weight of this specific modelGroup entry. Only one array entry within this modelGroup will be chosen. Default weight is 1, and they must range from 1 to 100. | 10 |
| ruleSets[]<wbr>.modelGroups[]<wbr>.version | optional | string | In case the machine learning system would like to track the specifics of an experiment. | "123" |
| ruleSets[]<wbr>.modelGroups[]<wbr>.default[] | optional | array of objects | The default results object should anything go wrong traversing the rule tree or if there aren't any rules defined. | |
| ruleSets[]<wbr>.modelGroups[]<wbr>.default[]<wbr>.function | optional | string | Which results function to call. | "logAtag" |
| ruleSets[]<wbr>.modelGroups[]<wbr>.default[]<wbr>.args | optional | object or array of objects | Which arguments to pass to the function. | |
| ruleSets[]<wbr>.modelGroups[]<wbr>.schema[] | optional | array of objects | Array of functions used to define the tree. | |
| ruleSets[]<wbr>.modelGroups[]<wbr>.schema[]<wbr>.function | optional | string | Which schema function to call. | "deviceCountry" |
| ruleSets[]<wbr>.modelGroups[]<wbr>.schema[]<wbr>.args | optional | array | Arguments to pass to the schema function. | [["USA","CAN"]] |
| ruleSets[]<wbr>.modelGroups[]<wbr>.analyticsKey | optional | string | Used to produce aTags and intended to identify an experiment or optimization target. | "456" |
| ruleSets[]<wbr>.modelGroups[]<wbr>.rules[] | optional | array of objects | The rules themselves. If not present, only the default rule will be chosen. | |
| ruleSets[]<wbr>.modelGroups[]<wbr>.rules[]<wbr>.conditions[] | optional | array of strings | Defines a node on the rule tree. The order of the entries in this array must match the order defined in the schema. | ["true", "false", "app"] |
| ruleSets[]<wbr>.modelGroups[]<wbr>.rules[]<wbr>.results[] | optional | array of objects | One or more results functions to run when this leaf of the tree is chosen. | |
| ruleSets[]<wbr>.modelGroups[]<wbr>.rules[]<wbr>.results[]<wbr>.function | optional | string | Which results function to call. | "logAtag" |
| ruleSets[]<wbr>.modelGroups[]<wbr>.rules[]<wbr>.results[]<wbr>.args | optional | object or array of objects | Which arguments to pass to the function. | |

### Rule Trees

For each ruleset, the Rules Engine creates a data structure called the 'rule tree'. Each level of the tree is a particular dimension and each branch a specific value of that dimension. At runtime, the module will walk down the tree dimension-by-dimension until it finds a 'leaf'. That final node contains the operations that will be applied to the request.

Mapping these concepts to the JSON syntax:

- Each level of the tree corresponds to an entry in the 'schema' JSON element.
- Each branch of the tree is defined by the 'conditions' element in the JSON and compared against the value returned by the [schema function](#schema-functions)
- The contents of each leaf are stored in the 'results' JSON element, which is one or more [results functions](#results-functions)

{: .alert.alert-warning :}
This model differs from how rules are handled in the [floors system](/dev-docs/modules/floors.html#rule-handling). In that model, the runtime system has the ability to "go back up" the tree if it finds a dead-end. While friendlier, that model can create performance problems. The Rules Engine system is a little harder to utilize, but guarantees that each dimension is processed only once.

Here's an example rule tree:

![Rules Engine Rules Tree](/assets/images/prebid-server/pbs_rules_engine_tree.png){:class="pb-xlg-img"}

1. The first level is 'Dimension 1'. It has 3 specific values and one wildcard "other" value.
2. The second level is 'Dimension 2'. It has 2 or 3 values for each scenario and possibly a wildcard value.
3. There are 12 specific leaf nodes and one overall default leaf.
4. Note that the second branch does not have a wildcard option at the second level, so if none of the 3 specific values for Dimension 2 match (red lines), the module will jump to the default leaf.

{: .alert.alert-info :}
Tip: you can also think of the rule tree as an N-dimensional matrix where each intersection of schema function values resolves to a 'results' node.

See the [runtime processing](#runtime-processing) section below for more detail.

### Schema Functions

The module supplies a set of functions that parse the OpenRTB request for particular fields, pulling out a particular value. For instance, finding out which specific country or channel is associated with this request. These functions are called 'schema functions' because they form the structure of the Rule Tree as described in the section above.

All of these functions operate only on the OpenRTB request at the 'Processed Auction Request' stage of module invocation.

{: .table .table-bordered .table-striped }
| Schema Function | Args | Description | Output Example |
| :---- | :---- | :---- | :---- |
| deviceCountry | null  | Returns OpenRTB device.geo.country. | "CAN" |
| deviceCountryIn | array of strings representing country codes | If the parameter is an array of strings, then check to see if device.geo.country is part of the named set (case sensitive). If yes, then return "true", else return "false". The parameter must be an array of strings. No length limit. If the array is length zero, treat it as 'null' above. | "true" |
| datacenters | null  This is an option for those who don't have geo-lookup available on every request. | Returns the value of the datacenter, which is host-company specific. Please work with your host company to get the list values available in your environment. | "eu-west" |
| datacentersIn | array of strings containing PBS host company-specific code for region.  This is an option for those who don't have geo-lookup available on every request. | Arguments must be an array of strings with no length limit. The function returns "true"/"false" if the actual datacenter is on the array (case sensitive). Please work with your host company to get the list values available in your environment. | "true" |
| channel | null | Returns ext.prebid.channel – e.g. web, amp, app. Returns empty string if there is no channel. | "app" |
| eidAvailable | null  | Returns "true" if user.eids array exists and is non-empty. Returns "false" if user.eids doesn't exist or is empty. | "false" |
| eidIn | array of strings meant to be extended ID source values like "pubcid.org" | Returns "true"/"false" if the named eid.source is on the array (case sensitive). | "true" |
| userFpdAvailable | null | Scans user.ext.data and user.data  Returns "true" if either user.ext.data or user.data exists and is non-empty. If neither exists with data, returns "false". Maybe be extended in the future to support specific fields. | "false" |
| fpdAvailable | null | Returns "true" if any of the following objects exists and has data: user.ext.data, user.data, site.ext.data, site.content.data, app.ext.data, app.content.data. Otherwise returns "false". | "false" |
| gppSidAvailable | null | Returns "true" if there are any values on regs.gpp\_sid greater than 0. Otherwise returns "false". | "true" |
| gppSidIn | array of ints | Returns "true" if any of the regs.gpp\_sid values are on the supplied array. (i.e. intersection is true). Otherwise returns "false". | "true" |
| tcfInScope | null | Returns "true" if regs.gdpr is "1". Otherwise returns "false". | "true" |
| percent | int | Returns "true" if a random integer between 0 and 100 inclusive is less than the supplied number. If the 'args' is null, default to 5. | "true" |
| domain | null | Returns \{site,app,dooh\}.publisher.domain | "example.com" |
| domainIn | array of strings representing domains | Returns "true" or "false" based on whether any of the supplied domains is on \{site,app,dooh\}.publisher.domain or \{site,app,dooh\}.domain | "true" |
| bundle | null | Returns app.bundle | "com.example.myapp" |
| bundleIn | array of strings representing app bundles | Returns "true" or "false" based on whether any of the supplied bundles is on app.bundle. | "false" |
| mediaTypes | array of strings representing media types | This function is called for each impression object on the request. It returns "true" or "false" based on whether any of the supplied mediaTypes is on the imp. Valid mediaTypes are "banner", "video", "native" | "true" |
| adUnitCode | null | This function is called for each impression object on the request. It returns the first of: imp.ext.gpid, imp.tagid, imp.ext.data.pbadslot, imp.ext.prebid.storedrequest.id | "/home/med-rect" |
| adUnitCodeIn | array of strings | This function is called for each impression object on the request. It returns "true" or "false" based on whether any of the supplied strings is on imp.ext.gpid, imp.tagid, imp.ext.data.pbadslot, imp.ext.prebid.storedrequest.id. | "true" |
| deviceType | null | Returns the OpenRTB device.devicetype. See the [AdCOM device type list](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--device-types-) for the integers that may be returned. Returns empty string if no device.devicetype exists. | "1" |
| deviceTypeIn | array of integers | Returns "true" or "false" based on whether any of the supplied integers matches device.devicetype. | "true" |

Notes:

- all args are wrapped in an array, so if the arg in the table above is an array, the JSON will be an array of arrays.
- All schema functions return strings -- even boolean and integer values are returned as strings.

#### Schema Function Examples

```json5
    "schema": [
        {"function": "deviceCountry", "args": [["FRA","DEU","GBR"]]}, // returns true if the country matches any in this list
        {"function": "deviceCountry", "args": [["USA","CAN"]]},       // returns true if the country matches any in this list
        {"function": "percent", "args": [50]},                        // returns true 50% of the time
        {"function": "mediaType", "args": [["video"]]},               // returns true for imps that have an imp.video block
        {"function": "channel"},                                      // returns "web", "app", or "amp"
        {"function": "eidAvailable", "args": [["pubcid.org"]]},       // returns true if the EIDs array contains a SharedID
        {"function": "userFpdAvailable" }                             // returns true if there's any User First Party Data available
    ],
```

### Results Functions

Once the Rule Tree is processed, a 'leaf' is chosen. The syntax of the leaf is
an array of results functions that operate on the request and/or analytics. (Someday the system will likely support functions that operate on the response.)

These are the currently define results functions:

- includeBidders and excludeBidders
- logATag

#### includeBidders and excludeBidders

These functions modify the imp[].ext.prebid.bidders object. They have the same set of parameters, the only difference between them being that exclude removes the named bidders while include keeps only the named bidders.

Here's an example invocation that means:

- remove bidderA, report seatnonbid 203, and log [analytics value](/prebid-server/developers/module-atags.html) 'rm-eu'
- if bidderD is not in the [uids cookie](/prebid-server/developers/pbs-cookie-sync.html), then remove it, report seatnonbid 203, and log analytics value 'rm-eu-nosync'

```json5
    "results": [{
        "function": "excludeBidders",
        "args": [{
            "bidders": [ "bidderA"],
            "seatnonbid": 203,
            "analyticsValue": "rm-eu"
          },{
            "bidders": ["bidderD"],
            "seatnonbid": 203,
            "ifSyncedId": false,
            "analyticsValue": "rm-eu-nosync"
          }
        ]
      }
    ]
```

Both functions expect an array of objects, each of which has these parameters:

{: .table .table-bordered .table-striped }
| Arg | Value Type | Required? | Meaning | Default |
| :---- | :---- | :---- | :---- | :---- |
| bidders | array of strings | yes | The bidders to include or exclude | none |
| seatnonbid | integer | no | The seatnonbid code to use | 203 |
| ifSyncedId | boolean | no | Whether to consider this bidder's synced ID status | none |
| analyticsValue | string | no | Sent to the [aTag](/prebid-server/developers/module-atags.html) | none |

Here's how they work:

1. Find the intersection of the request bidders bidders (imp[n].ext.prebid.bidders) with the bidders listed in the include or exclude array
1. If 'ifSyncedId' is an argument, then for each of the bidders, check to see if the idsync status matches what's specified. For exclude, the intention is to remove the bidder from the list only if the synced id status matches, which means if the synced ID status doesn't match the arg, remove the bidder from the exclude array.
1. For 'exclude', remove these bidders from imp[n].ext.prebid.bidders
1. For 'include', keep only these bidders in imp[n].ext.prebid.bidders
1. If seatnonbid is specified, use the specified code to record the seatnonbid when ext.prebid.returnallbidstatus is true and for the aTag. Otherwise, use seatnonbid code 203.
1. If analyticsKey is present, then create an analytics tag as noted below.

```json5
{
        status: "success",
        values: {
           analyticsKey: "ANALYTICS_KEY",    // defined at the modelGroup level
           analyticsValue: "ANALYTICS_VAL",
           modelVersion: "MODEL_VERSION",
           conditionFired: CONDITION_ARRAY,
           resultFunctions: ["exclude/includeBidders"],
           // log the removed bidders for both include/exclude
           biddersRemoved: ["bidderF", "bidderJ"], 
           seatnonbid: "SEATNONBID"
        }
        appliedTo: {
            impIds: ["IMP.ID"]
        }
}
```

#### logAtag

[Analytics tags](/prebid-server/developers/module-atags.html) are how Prebid Server modules communicate their activity to the analytics adapters. Each analytics adapter needs to know how to retrieve these values. Check with your analytics vendor to make sure they can receive this data.

The `logAtag` results function simply communicates some detail to the analytics adapters via the analytics tags. The idea is that data science teams will design experiments (e.g. try running bidderA on 5% of Brazilian traffic) and they will need analytics data for the experiment and the control. The syntax of the Rules Engine allows for flexibly defining how the analytics system sees various decisions made at runtime.

Here's an example invocation that means:

- tell analytics that this request is a control

```json5
"default": [{
    "function": "logAtag",
    "args": {
      "analyticsValue": "control"
    }
  }
]
```

There's only one argument to this results function:

{: .table .table-bordered .table-striped }
| Arg | Value Type | Required? | Meaning | Default |
| :---- | :---- | :---- | :---- | :---- |
| analyticsValue | string | yes | Sent to the aTag | none |

The resulting analytics tag as seen by analytics adapters is:

```json5
{
        status: "success",
        values: {
           analyticsKey: "ANALYTICS_KEY",    // defined at the modelGroup level
           analyticsValue: "ANALYTICS_VAL",
           modelVersion: "MODEL_VERSION",
           conditionFired: CONDITION_ARRAY,
           resultFunctions: ["logAtag"]
        }
        appliedTo: {
            impIds: ["*"]
        }
}
```

### Runtime Processing

For those curious about the technical details, here's how the module works in detail:

1. If not at the "processed-auction-request" stage, exit.  
2. Check to see if we've already got the parsed account config in cache. If yes, then check the timestamp on the incoming account config to see if there's been an update since last parsing it.  
   1. If necessary, parse (or re-parse) the config.  
      1. Validate every call to a schema or result function by passing in the "validation: true" parameter and letting them verify their own params.  
      2. Create data structures for parsed rules.  
      3. Verify there's a "default" for every set of rules.  
   2. If the config is completely validated, then cache it. If validation failed, log a failure aTag against the "pb-rules-engine-config" activity.  
   3. If this was an update because of a new timestamp, continue with the previously cached parsed config.  
   4. If this is the first run so there's no valid parsed config, exit with error  
3. Check the module enabled in config. If not, exit.  
4. Loop through ruleSets  
   1. Check ruleset stage. If not current stage, go to next ruleset.  
   2. If there's more than one modelGroup object, loop through them to add up weights. Randomly pick a number from 1-to-weight. Choose the appropriate group.  
   3. Remember the chosen modelVersion if it's defined.  
   4. Check the schema functions in use: (this will be expanded if/when we support other stages)  
      1. If either adUnitCode or mediaType are specified, then loop through the ORTB imp objects  
         1. Loop through schema functions, calling each one in turn, letting each one know what the current imp is.  
            1. Follow the parsed data tree down each branch.  
         2. If we ever run off the tree, choose the overall default response leaf object.  
      2. else  
         1. Loop through schema functions, calling each one in turn. (no need to tell them the imp ID)  
            1. Follow the parsed data tree down each branch.  
         2. If we ever run off the tree, choose the overall default response leaf object.  
   5. If there are no schema functions or no rules specified, but there is a default, then that's the results object.  
   6. We still don't have a results object, log a warning and go on to the next ruleSet.  
   7. Loop through the results object's functions:  
      1. Call each one with the appropriate arguments.  
   8. Done with ruleSet, next one.  
5. Done

## Configuration Examples

### Example 1: Remove bidders by datacenter

- in the 'eu' datacenter, always remove bidderA. Remove bidderD if it hasn't done a user sync.
- in the 'apac' datacenter, always remove bidderB and bidderF

```json5
{
  "hooks": {
    "modules": {
      "pb-rules-engine": {
        "enabled": true,
        "timestamp": "20250314 00:00:00",
        "ruleSets": [
          {
            "stage": "processed-auction-request",
            "name": "remove-bidder-by-datacenter",
            "version": "1234",
            "modelGroups": [
              {
                "weight": 100,
                "analyticsKey": "rm-bidder-by-dc",
                "version": "4567",
                "schema": [{"function": "datacenters"}],
                "default": [],
                "rules": [{
                    "conditions": ["eu"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": [ "bidderA"],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-eu"
                          },{
                            "bidders": ["bidderD"],
                            "seatnonbid": 203,
                            "ifSyncedId": false,
                            "analyticsValue": "rm-eu-nosync"
                          }
                        ]
                      }
                    ]
                  },{
                    "conditions": ["apac"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderB", "bidderF"],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-apac"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
```

### Example 2: Remove certain bidders from video requests 90% of the time

- if the impression mediatype contains 'video', then remove bidderD 90% of the time

```json5
{
  "hooks": {
    "modules": {
      "pb-rules-engine": {
        "enabled": true,
        "timestamp": "20250314 00:00:00",
        "ruleSets": [
          {
            "stage": "processed-auction-request",
            "name": "remove-bidder-mediatype-percent",
            "version": "6789",
            "modelGroups": [
              {
                "weight": 100,
                "analyticsKey": "test-video-bidders",
                "version": "4567",
                "schema": [{"function": "mediaType", "args": [["video"]]},
                           {"function": "percent", "args": [90]}
                ],
                "default": [{
                    "function": "logAtag",
                    "args": {
                      "analyticsValue": "control"
                    }
                }],
                "rules": [{
                    "conditions": ["true","true"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": [ "bidderD"],
                            "analyticsValue": "leaf1"
                        }]
                    }]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
```

### Example 3: Remove Bidders by country, channel, eid, userFpd

This is a complex example Rule Tree with 12 leaves:

1. countryGroup=EU (EU countries true, APAC countries false)  
   1. channel=app  
      1. eidAvailable(sharedId)=true  
         1. userFpdAvailable=wildcard  
            1. remove bidderA (leaf 1\)  
      2. eidAvailable(sharedId)=false  
         1. userFpdAvailable=true  
            1. remove bidderA, bidderD (leaf 2\)  
         2. userFpdAvailable=false  
            1. remove bidderA, bidderB  (leaf 3\)  
   2. channel=wildcard  
      1. eidAvailable(sharedId)=wildcard  
         1. userFpdAvailable=wildcard  
            1. remove bidderC (leaf 4\)  
2. countryGroup=APAC (EU countries false, APAC countries true)  
   1. channel=web  
      1. eidAvailable(sharedId)=true  
         1. userFpdAvailable=true  
            1. remove bidderA, bidderE (leaf 5\)  
         2. userFpdAvailable=false  
            1. remove bidderA, bidderB, bidderE  (leaf 6\)  
      2. eidAvailable(sharedId)=false  
         1. userFpdAvailable=wildcard  
            1. remove bidderA, bidderD, bidderF  (leaf 7\)  
   2. channel=wildcard  
      1. eidAvailable(sharedId)=wildcard  
         1. userFpdAvailable=true  
            1. remove bidderA, bidderC  (leaf 8\)  
         2. userFpdAvailable=false  
            1. remove bidderA, bidderF  (leaf 9\)  
3. countryGroup=OTHER (EU countries false, APAC countries false)  
   1. channel=web  
      1. eidAvailable(sharedId)=wildcard  
         1. userFpdAvailable=wildcard  
            1. no removals  (leaf 10\)  
   2. channel=wildcard  
      1. eidAvailable(sharedId)=true  
         1. userFpdAvailable=wildcard  
            1. remove bidderB, bidderE (leaf 11\)  
      2. eidAvailable(sharedId)=false  
         1. userFpdAvailable=wildcard  
            1. remove bidderE, bidderF (leaf 12\)

Rules engine config:

```json5
{
  "hooks": {
    "modules": {
      "pb-rules-engine": {
        "enabled": true,
        "timestamp": "20250314 00:00:00",
        "ruleSets": [
          {
            "stage": "processed-auction-request",
            "name": "remove-bidder-by-country-channel-eid-userFpd",
            "version": "5678",
            "modelGroups": [
              {
                "weight": 100,
                "analyticsKey": "filter-bidder",
                "version": "4567",
                "schema": [{"function": "deviceCountry", "args": [["FRA","DEU","GBR"]]},
                           {"function": "deviceCountry", "args": [["JPN","AUS","KOR"]]},
                           {"function": "channel"},
                           {"function": "eidAvailable", "args": [["pubcid.org"]]},
                           {"function": "userFpdAvailable" }
                ],
                "default": [],
                "rules": [{
                    "conditions": ["true","false","app","true","*"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": [ "bidderA"],
                            "analyticsValue": "leaf1"
                        }]
                    }]
                  },{
                    "conditions": ["true","false","app","false","true"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderD"],
                            "analyticsValue": "leaf2"
                        }]
                    }]
                  },{
                    "conditions": ["true","false","app","false","false"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderB"],
                            "analyticsValue": "leaf3"
                        }]
                    }]
                  },{
                    "conditions": ["true","false","*","*","*"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderC"],
                            "analyticsValue": "leaf4"
                        }]
                    }]
                  },{
                    "conditions": ["false","true","web","true","true"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderE"],
                            "analyticsValue": "leaf5"
                        }]
                    }]
                  },{
                    "conditions": ["false","true","web","true","false"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderB","bidderE"],
                            "analyticsValue": "leaf6"
                        }]
                    }]
                  },{
                    "conditions": ["false","true","web","false","*"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderD","bidderF"],
                            "analyticsValue": "leaf7"
                        }]
                    }]
                  },{
                    "conditions": ["false","true","*","*","true"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderC"],
                            "analyticsValue": "leaf8"
                        }]
                    }]
                  },{
                    "conditions": ["false","true","*","*","false"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderA", "bidderF"],
                            "analyticsValue": "leaf9"
                        }]
                    }]
                  },{
                    "conditions": ["false","false","web","*","*"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": [],
                            "analyticsValue": "leaf10"
                        }]
                    }]
                  },{
                    "conditions": ["false","false","*","true","*"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderB", "bidderE"],
                            "analyticsValue": "leaf11"
                        }]
                    }]
                  },{
                    "conditions": ["false","false","*","false","*"],
                    "results": [{
                        "function": "excludeBidders",
                        "args": [{
                            "bidders": ["bidderE", "bidderF"],
                            "analyticsValue": "leaf12"
                        }]
                    }]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
```

And here's how these scenarios would play out in various runtime conditions:

1. **Input**: request from country FRA, channel web, contains eid(pubcid.org), userFpd is available

   - results: resolves to leaf 4  
   - remove bidderC from imp\[0\] and imp\[1\]  
   - aTag logs leaf4

2. **Input**: request from country JPN, contains eid(pubcid.org), userFpd is available

   - results: resolves to leaf5  
   - remove bidderA from imp\[0\]  
   - remove bidderE from imp\[0\] and imp\[1\]  
   - aTag logs leaf5

3. **Input**: request from country JPN, channel app, contains eid(pubcid.org), userFpd is available

   - results: resolves to leaf8  
   - remove bidderA from imp\[0\]  
   - remove bidderC from imp\[0\] and imp\[1\]  
   - aTag logs leaf8

4. **Input**: request from country FRA, channel is app, no eids, userFpd is available

   - results: resolves to leaf2  
   - remove bidderA from imp\[0\]  
   - remove bidderD from imp\[0\] and imp\[1\]  
   - aTag logs leaf2

## Installing the Module

Like any Prebid Server module, the Rules Engine requires an execution plan.
We recommend placing the execution plan at the host level so all accounts have the module enabled.

```json5
        "execution-plan": {
            "endpoints": {
                "/openrtb2/amp": {
                    "stages": {
                        "processed-auction": {
                            "groups": [{
                                    "timeout": 10,
                                    "hook-sequence": [{
                                            "module-code": "rules-engine",
                                            "hook-impl-code": "rules-engine-processed-auction"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                "/openrtb2/auction": {
                    "stages": {
                        "processed-auction": {
                            "groups": [{
                                    "timeout": 10,
                                    "hook-sequence": [ {
                                            "module-code": "rules-engine",
                                            "hook-impl-code": "rules-engine-processed-auction"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
```

## Next Steps

If you have any feedback about how you'd like to see the Rules Engine evolve, please let us know by joining the Prebid Server committee or posting an issue in the github repo.

## Further Reading

- [Prebid Server modules](/prebid-server/pbs-modules/index.html)
- [Prebid Server module stages](/prebid-server/developers/add-a-module.html#2-understand-the-endpoints-and-stages)
- [Analytics Tags](/prebid-server/developers/module-atags.html)
