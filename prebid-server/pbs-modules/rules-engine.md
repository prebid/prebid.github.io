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

The Rules Engine is a flexible module that allows host companies to define JSON configurations for controlling various aspects of requests, rather than having to code exceptions in a standalone module or in the core of Prebid Server.

Most of the use cases for this version are centered around controlling which bid adapters are called in particular scenarios, based on:

- host geography
- user geography
- presence of a synced ID for that bidder
- presence of first party data
- channel (web vs mobile app)

### Limitations

The first phase is limited in several ways:

- Runs only at the Processed-Auction stage.
- Only delivers functions for including and excluding bidders.
- Unlike Floors, the Rules Engine does not directly poll an external URL for new rules. The host must update the account configuration; PBS-Go can periodically refresh that configuration through the account fetcher.
- Does not support getting rules config from multiple sources. e.g. host-level rules cannot be merged with account-level rules. And ideally, there could be an ecosystem of vendors supplying config for different rule sets. This is not currently possible.

### Future Enhancements

- Add additional results functions.
- Support additional module stages.
- Improve getting the configuration from multiple sources.

The team will tackle enhancements as important use cases drive priority.

## Quick Start

For those who prefer to jump right in, this **PBS-Go account configuration** illustrates a Rules Engine experiment. The module is named `prebid.rulesengine` in PBS-Go and `pb-rule-engine` in PBS-Java. Their configuration and execution-plan field names differ; do not copy the Go examples directly into PBS-Java. The following configuration:

**98% of the time:**

- removes bidderA in the EU datacenter
- removes bidderD in the EU datacenter if that bidder hasn't synced with this user
- removes bidderB and bidderF in the APAC datacenter
- logs any bidder removed to analytics

**2% of the time:**

- logs "control" to analytics

```json
{
  "hooks": {
    "modules": {
      "prebid": {
        "rulesengine": {
          "enabled": true,
          "timestamp": "20250314 00:00:00",
          "rulesets": [
            {
              "stage": "processed_auction_request",
              "name": "remove-bidder-by-datacenter",
              "version": "1234",
              "modelgroups": [
                {
                  "weight": 98,
                  "analyticsKey": "rm-bidder-by-dc",
                  "version": "4567",
                  "schema": [
                    {
                      "function": "dataCenter"
                    }
                  ],
                  "default": [],
                  "rules": [
                    {
                      "conditions": [
                        "eu"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA"
                            ],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-eu"
                          }
                        },
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderD"
                            ],
                            "seatnonbid": 203,
                            "ifSyncedId": false,
                            "analyticsValue": "rm-eu-nosync"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "apac"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderB",
                              "bidderF"
                            ],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-apac"
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "weight": 2,
                  "analyticsKey": "rm-bidder-by-dc",
                  "default": [
                    {
                      "function": "logATag",
                      "args": {
                        "analyticsValue": "control"
                      }
                    }
                  ]
                }
              ]
            }
          ],
          "generate_rules_from_bidderconfig": false
        }
      }
    },
    "enabled": true
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

We envision a time when, like the floors system, there are multiple vendors providing optimization services of different kinds.

## Configuration Details

Configuration is covered in several sections:

1. [Module configuration syntax](#module-account-level-configuration) - the JSON used to express which bidders should run and when. It functions as a domain-specific language (DSL).
1. [Rule Trees](#rule-trees) - groups of rules should be thought of as 'trees' split along dimensions like 'datacenter' and 'channel'. These trees are processed in a particular way.
1. [Schema Functions](#schema-functions) - which dimensions and comparisons can be used in the configuration. 
1. [Results Functions](#results-functions) - the specific outcomes once a specific rule is chosen.
1. [Runtime Processing](#runtime-processing) - how it all comes together.

### Module Account-Level Configuration

The following fields describe the **PBS-Go** account-level module configuration (`hooks.modules.prebid.rulesengine`). For PBS-Java, see its `pb-rule-engine` module configuration and use camel-case field names such as `ruleSets` and `modelGroups` instead of Go's `rulesets` and `modelgroups`:

{: .table .table-bordered .table-striped }
| Property | Scope | Type | Description | Example |
| ---------- | ------- | ------ | ------------- | --------- |
| enabled | optional | boolean | Whether the module as a whole is enabled. Allows for easy temporary deactivation. Defaults to true. | true |
| generate_rules_from_bidderconfig | optional | boolean | (PBS-Go only) Generate geoscope rules from bidder YAML configuration. Set explicitly; the Go default is `false`. | false |
| rulesets[] | required | array of objects | One or more independent sets of rules. | none |
| timestamp | optional | string | Account-level rules configuration revision (informational in PBS-Go; the cache compares a hash of configuration). | "2025-03-14T00:00:00Z" |
| rulesets[]<wbr>.version | optional | string | Version of the ruleset. | "1234" |
| rulesets[]<wbr>.stage | required | string | Which module stage this object applies to. Initially, the currently supported stage is `processed_auction_request` | "processed_auction_request" |
| rulesets[]<wbr>.name | optional | string | Just for human readability. | "remove-bidder-by-datacenter" |
| rulesets[]<wbr>.modelgroups[] | required | array of objects | This is where the rule details are stored. It's an array in case there's a desire to A/B test different rule configs. Model groups work here like they do for [floors](/dev-docs/modules/floors.html#schema-2). | |
| rulesets[]<wbr>.modelgroups[]<wbr>.weight | optional | integer | The relative weight of this specific modelGroup entry. Only one array entry within this modelGroup will be chosen. Default weight is 1, and they must range from 1 to 100. | 10 |
| rulesets[]<wbr>.modelgroups[]<wbr>.version | optional | string | In case the machine learning system would like to track the specifics of an experiment. | "123" |
| rulesets[]<wbr>.modelgroups[]<wbr>.default[] | optional | array of objects | The default results object to be used if anything goes wrong while traversing the rule tree or if there aren't any rules defined. | |
| rulesets[]<wbr>.modelgroups[]<wbr>.default[]<wbr>.function | optional | string | Which results function to call. | "logATag" |
| rulesets[]<wbr>.modelgroups[]<wbr>.default[]<wbr>.args | optional | object | Which arguments to pass to the function. | |
| rulesets[]<wbr>.modelgroups[]<wbr>.schema[] | optional | array of objects | Array of functions used to define the tree. | |
| rulesets[]<wbr>.modelgroups[]<wbr>.schema[]<wbr>.function | optional | string | Which schema function to call. | "deviceCountry" |
| rulesets[]<wbr>.modelgroups[]<wbr>.schema[]<wbr>.args | optional | object | Named arguments for the schema function. | {"countries":["USA","CAN"]} |
| rulesets[]<wbr>.modelgroups[]<wbr>.analyticsKey | optional | string | Used to produce aTags and intended to identify an experiment or optimization target. | "456" |
| rulesets[]<wbr>.modelgroups[]<wbr>.rules[] | optional | array of objects | The rules themselves. If not present, only the default rule will be chosen. | |
| rulesets[]<wbr>.modelgroups[]<wbr>.rules[]<wbr>.conditions[] | optional | array of strings | Defines a node on the rule tree. The order of the entries in this array must match the order defined in the schema. | ["true", "false", "app"] |
| rulesets[]<wbr>.modelgroups[]<wbr>.rules[]<wbr>.results[] | optional | array of objects | One or more results functions to run when this leaf of the tree is chosen. | |
| rulesets[]<wbr>.modelgroups[]<wbr>.rules[]<wbr>.results[]<wbr>.function | optional | string | Which results function to call. | "logATag" |
| rulesets[]<wbr>.modelgroups[]<wbr>.rules[]<wbr>.results[]<wbr>.args | optional | object | Which arguments to pass to the function. | |

### Rule Trees

For each ruleset, the Rules Engine creates a data structure called the 'rule tree'. Each level of the tree is a particular dimension and each branch a specific value of that dimension. At runtime, the module will walk down the tree dimension-by-dimension until it finds a 'leaf'. That final node contains the operations that will be applied to the request.

Mapping these concepts to the JSON syntax:

- Each level of the tree corresponds to an entry in the 'schema' JSON element.
- Each branch of the tree is defined by the 'conditions' element in the JSON and compared against the value returned by the [schema function](#schema-functions)
- The contents of each leaf are stored in the 'results' JSON element, which is one or more [results functions](#results-functions)

{: .alert.alert-warning :}
This model differs from how rules are handled in the [floors system](/dev-docs/modules/floors.html#rule-handling). In that model, the runtime system has the ability to "go back up" the tree if it finds a dead-end. While friendlier, that model can create performance problems. The Rules Engine system is a little harder to utilize, but it guarantees that each dimension is processed only once.

Here's an example rule tree:

![Rules Engine Rules Tree](/assets/images/prebid-server/pbs_rules_engine_tree.png){:class="pb-xlg-img"}

1. The first level is 'Dimension 1'. It has 3 specific values and one wildcard "other" value.
2. The second level is 'Dimension 2'. It has 2 or 3 values for each scenario and possibly a wildcard value.
3. There are 12 specific leaf nodes and one overall default leaf.
4. Note that the second branch does not have a wildcard option at the second level, so if none of the 3 specific values for Dimension 2 match (red lines), the module will jump to the default leaf.

{: .alert.alert-info :}
Tip: you can also think of the rule tree as an N-dimensional matrix where each intersection of schema function values resolves to a 'results' node.

See the [runtime processing](#runtime-processing) section below for more details.

### Schema Functions

The module provides a set of functions that parse the OpenRTB request for specific fields, extracting a particular value. For instance, finding out which specific country or channel is associated with this request. These functions are called 'schema functions' because they form the structure of the Rule Tree as described in the section above.

These functions operate on the OpenRTB request at the Processed Auction Request stage. Availability varies by server implementation; functions marked Java-only are not supported by PBS-Go.

{: .table .table-bordered .table-striped }
| Schema Function | Args | Description | Output Example |
| :---- | :---- | :---- | :---- |
| deviceCountry | null | Returns OpenRTB device.geo.country. | "CAN" |
| deviceCountryIn | `{"countries": ["USA", "CAN"]}` | Returns "true" if `device.geo.country` matches a country in the non-empty array (case sensitive); otherwise "false". | "true" |
| dataCenter | null | Returns the value of the datacenter, which is host-company specific. Please work with your host company to get the list of values available in your environment. | "eu-west" |
| dataCenterIn | `{"datacenters": ["eu-west"]}` | Tests the datacenter against a non-empty array of host-specific codes (case sensitive). | "true" |
| channel | null | Returns ext.prebid.channel – e.g. web, amp, app. Returns empty string if there is no channel. | "app" |
| eidAvailable | null | Returns "true" if user.eids array exists and is non-empty. Returns "false" if user.eids doesn't exist or is empty. | "false" |
| eidIn | `{"sources": ["pubcid.org"]}` | Returns "true" if any supplied EID source is present; the array must not be empty. | "true" |
| userFpdAvailable | null | Scans user.ext.data and user.data  Returns "true" if either user.ext.data or user.data exists and is non-empty. If neither exists with data, returns "false". Maybe be extended in the future to support specific fields. | "false" |
| fpdAvailable | null | Returns "true" if any of the following objects exists and has data: user.ext.data, user.data, site.ext.data, site.content.data, app.ext.data, app.content.data. Otherwise returns "false". | "false" |
| gppSidAvailable | null | Returns "true" if there are any values on regs.gpp\_sid greater than 0. Otherwise returns "false". | "true" |
| gppSidIn | `{"sids": [7, 8]}` | Returns "true" if any of the regs.gpp\_sid values are on the supplied array. (i.e. intersection is true). Otherwise returns "false". | "true" |
| tcfInScope | null | Returns "true" if regs.gdpr is "1". Otherwise returns "false". | "true" |
| percent | `{"pct": 90}` | Returns "true" if a random integer between 0 and 100 inclusive is less than the supplied number. If the 'args' is null, default to 5. | "true" |
| domain (Java only) | null | Returns \{site,app,dooh\}.publisher.domain | "example.com" |
| domainIn (Java only) | array of strings representing domains | Returns "true" or "false" based on whether any of the supplied domains is on \{site,app,dooh\}.publisher.domain or \{site,app,dooh\}.domain | "true" |
| bundle (Java only) | null | Returns app.bundle | "com.example.myapp" |
| bundleIn (Java only) | array of strings representing app bundles | Returns "true" or "false" based on whether any of the supplied bundles is on app.bundle. | "false" |
| mediaTypeIn (Java only) | `{"types": ["video"]}` | This function is called for each impression object on the request. It returns "true" or "false" based on whether any of the supplied mediaTypes is on the imp. Valid mediaTypes are "banner", "video", "native" | "true" |
| adUnitCode (Java only) | null | This function is called for each impression object on the request. It returns the first of: imp.ext.gpid, imp.tagid, imp.ext.data.pbadslot, imp.ext.prebid.storedrequest.id | "/home/med-rect" |
| adUnitCodeIn (Java only) | array of strings | This function is called for each impression object on the request. It returns "true" or "false" based on whether any of the supplied strings is on imp.ext.gpid, imp.tagid, imp.ext.data.pbadslot, imp.ext.prebid.storedrequest.id. | "true" |
| deviceType (Java only) | null | Returns the OpenRTB device.devicetype. See the [AdCOM device type list](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--device-types-) for the integers that may be returned. Returns empty string if no device.devicetype exists. | "1" |
| deviceTypeIn (Java only) | array of integers | Returns "true" or "false" based on whether any of the supplied integers matches device.devicetype. | "true" |

Notes:

- Schema-function arguments are JSON objects with named fields (for example, `{"countries":["USA","CAN"]}`). For `*In` functions, the arrays must contain at least one value; empty arrays are invalid.
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
an array of results functions that operate on the request and/or analytics. (Someday, the system will likely support functions that operate on the response.)

These are the currently defined results functions:

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

Both functions expect an `args` object with the following parameters. Use multiple results entries to perform multiple include or exclude operations:

{: .table .table-bordered .table-striped }
| Arg | Value Type | Required? | Meaning | Default |
| :---- | :---- | :---- | :---- | :---- |
| bidders | non-empty array of strings | yes | The bidders to include or exclude | none |
| seatnonbid | integer | no | The seatnonbid code to use | 203 |
| ifSyncedId | boolean | no | Whether to consider this bidder's synced ID status | none |
| analyticsValue | string | no | Sent to the [aTag](/prebid-server/developers/module-atags.html) | none |

Here's how they work:

1. Find the intersection of the request bidders (imp[n].ext.prebid.bidders) with the bidders listed in the include or exclude array
1. If 'ifSyncedId' is an argument, then for each of the bidders, check to see if the idsync status matches what's specified. For exclude, the intention is to remove the bidder from the list only if the synced id status matches, which means if the synced ID status doesn't match the arg, remove the bidder from the exclude array.
1. For 'exclude', remove these bidders from imp[n].ext.prebid.bidders
1. For 'include', keep only these bidders in imp[n].ext.prebid.bidders
1. If seatnonbid is specified, use that code to record the seatnonbid when ext.prebid.returnallbidstatus is true and for the aTag. Otherwise, use seatnonbid code 203.
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

#### logATag

[Analytics tags](/prebid-server/developers/module-atags.html) are how Prebid Server modules communicate their activity to the analytics adapters. Each analytics adapter needs to know how to retrieve these values. Check with your analytics vendor to make sure they can receive this data.

The `logATag` results function communicates some details to the analytics adapters via the analytics tags. The idea is that data science teams will design experiments (e.g. try running bidderA on 5% of Brazilian traffic) and they will need analytics data for the experiment and the control. The syntax of the Rules Engine allows for flexibly defining how the analytics system sees various decisions made at runtime.

Here's an example invocation that means:

- Tell analytics that this request is a control

```json5
"default": [{
    "function": "logATag",
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
           resultFunctions: ["logATag"]
        }
        appliedTo: {
            impIds: ["*"]
        }
}
```

### Runtime Processing

For those curious about the technical details, here's how the module works in detail:

1. If not at the `processed_auction_request` stage, exit (PBS-Go).  
2. Check the parsed account configuration in cache. PBS-Go uses a hash of the account configuration and a configurable refresh interval to determine whether it needs to rebuild trees, rather than using the ruleset timestamp.  
   1. If necessary, parse (or re-parse) the config.  
      1. Validate every call to a schema or result function by passing in the "validation: true" parameter and letting them verify their own params.  
      2. Create data structures for parsed rules.  
      3. Verify there's a "default" for every set of rules.  
   2. If the config is completely validated, then cache it. If validation failed, log a failure aTag against the "pb-rules-engine-config" activity.  
   3. If new configuration is still loading, the previous cached configuration remains in effect.  
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

### Example 1: Remove bidders by datacenter (PBS-Go)

- in the 'eu' datacenter, always remove bidderA. Remove bidderD if it hasn't done a user sync.
- in the 'apac' datacenter, always remove bidderB and bidderF

```json
{
  "hooks": {
    "modules": {
      "prebid": {
        "rulesengine": {
          "enabled": true,
          "timestamp": "20250314 00:00:00",
          "rulesets": [
            {
              "stage": "processed_auction_request",
              "name": "remove-bidder-by-datacenter",
              "version": "1234",
              "modelgroups": [
                {
                  "weight": 100,
                  "analyticsKey": "rm-bidder-by-dc",
                  "version": "4567",
                  "schema": [
                    {
                      "function": "dataCenter"
                    }
                  ],
                  "default": [],
                  "rules": [
                    {
                      "conditions": [
                        "eu"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA"
                            ],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-eu"
                          }
                        },
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderD"
                            ],
                            "seatnonbid": 203,
                            "ifSyncedId": false,
                            "analyticsValue": "rm-eu-nosync"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "apac"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderB",
                              "bidderF"
                            ],
                            "seatnonbid": 203,
                            "analyticsValue": "rm-apac"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "generate_rules_from_bidderconfig": false
        }
      }
    },
    "enabled": true
  }
}
```

### Example 2: Remove certain bidders from video requests 90% of the time (PBS-Java)

- if the impression mediatype contains 'video', then remove bidderD 90% of the time

```json
{
  "hooks": {
    "modules": {
      "pb-rule-engine": {
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
                "schema": [
                  {
                    "function": "mediaTypeIn",
                    "args": {
                      "types": [
                        "video"
                      ]
                    }
                  },
                  {
                    "function": "percent",
                    "args": {
                      "pct": 90
                    }
                  }
                ],
                "default": [
                  {
                    "function": "logATag",
                    "args": {
                      "analyticsValue": "control"
                    }
                  }
                ],
                "rules": [
                  {
                    "conditions": [
                      "true",
                      "true"
                    ],
                    "results": [
                      {
                        "function": "excludeBidders",
                        "args": {
                          "bidders": [
                            "bidderD"
                          ],
                          "analyticsValue": "leaf1"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    "enabled": true
  }
}
```

### Example 3: Remove Bidders by country, channel, eid, userFpd (PBS-Go)

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

```json
{
  "hooks": {
    "modules": {
      "prebid": {
        "rulesengine": {
          "enabled": true,
          "timestamp": "20250314 00:00:00",
          "rulesets": [
            {
              "stage": "processed_auction_request",
              "name": "remove-bidder-by-country-channel-eid-userFpd",
              "version": "5678",
              "modelgroups": [
                {
                  "weight": 100,
                  "analyticsKey": "filter-bidder",
                  "version": "4567",
                  "schema": [
                    {
                      "function": "deviceCountryIn",
                      "args": {
                        "countries": [
                          "FRA",
                          "DEU",
                          "GBR"
                        ]
                      }
                    },
                    {
                      "function": "deviceCountryIn",
                      "args": {
                        "countries": [
                          "JPN",
                          "AUS",
                          "KOR"
                        ]
                      }
                    },
                    {
                      "function": "channel"
                    },
                    {
                      "function": "eidIn",
                      "args": {
                        "sources": [
                          "pubcid.org"
                        ]
                      }
                    },
                    {
                      "function": "userFpdAvailable"
                    }
                  ],
                  "default": [],
                  "rules": [
                    {
                      "conditions": [
                        "true",
                        "false",
                        "app",
                        "true",
                        "*"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA"
                            ],
                            "analyticsValue": "leaf1"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "true",
                        "false",
                        "app",
                        "false",
                        "true"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderD"
                            ],
                            "analyticsValue": "leaf2"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "true",
                        "false",
                        "app",
                        "false",
                        "false"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderB"
                            ],
                            "analyticsValue": "leaf3"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "true",
                        "false",
                        "*",
                        "*",
                        "*"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderC"
                            ],
                            "analyticsValue": "leaf4"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "true",
                        "web",
                        "true",
                        "true"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderE"
                            ],
                            "analyticsValue": "leaf5"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "true",
                        "web",
                        "true",
                        "false"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderB",
                              "bidderE"
                            ],
                            "analyticsValue": "leaf6"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "true",
                        "web",
                        "false",
                        "*"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderD",
                              "bidderF"
                            ],
                            "analyticsValue": "leaf7"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "true",
                        "*",
                        "*",
                        "true"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderC"
                            ],
                            "analyticsValue": "leaf8"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "true",
                        "*",
                        "*",
                        "false"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderA",
                              "bidderF"
                            ],
                            "analyticsValue": "leaf9"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "false",
                        "web",
                        "*",
                        "*"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [],
                            "analyticsValue": "leaf10"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "false",
                        "*",
                        "true",
                        "*"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderB",
                              "bidderE"
                            ],
                            "analyticsValue": "leaf11"
                          }
                        }
                      ]
                    },
                    {
                      "conditions": [
                        "false",
                        "false",
                        "*",
                        "false",
                        "*"
                      ],
                      "results": [
                        {
                          "function": "excludeBidders",
                          "args": {
                            "bidders": [
                              "bidderE",
                              "bidderF"
                            ],
                            "analyticsValue": "leaf12"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "generate_rules_from_bidderconfig": false
        }
      }
    },
    "enabled": true
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

Enable the hooks system and register the Rules Engine hook in the host execution plan. Here is a **PBS-Go** host-configuration example:

```json
{
  "hooks": {
    "enabled": true,
    "host_execution_plan": {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "processed_auction_request": {
              "groups": [{
                "timeout": 10,
                "hook_sequence": [{
                  "module_code": "prebid.rulesengine",
                  "hook_impl_code": "prebid-rulesengine-processed-auction-hook"
                }]
              }]
            }
          }
        }
      }
    }
  }
}
```

PBS-Java uses module code `pb-rule-engine`, hook implementation code `pb-rule-engine-processed-auction-request-hook`, and its own execution-plan field names. Consult your deployment's hooks configuration before applying a host execution plan.

## Next Steps

If you have any feedback about how you'd like to see the Rules Engine evolve, please let us know by joining the Prebid Server committee or posting an issue in the github repo.

## Further Reading

- [Prebid Server modules](/prebid-server/pbs-modules/index.html)
- [Prebid Server module stages](/prebid-server/developers/add-a-module.html#2-understand-the-endpoints-and-stages)
- [Analytics Tags](/prebid-server/developers/module-atags.html)
