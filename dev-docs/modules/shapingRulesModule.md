---
layout: page_v2
page_type: module
title: Module - Shaping rules module
description: Validates bid's ortb2 data against its meta data
module_code : shapingRules
display_name : Shaping rules module
enable_download : true
sidebarType : 1

---

# Shaping rules module

## Overview

This module was created to enable, based on a floors-syntax configuration and its conditions related to first-party data, ad-unit data, and other criteria, the inclusion or exclusion of specific bidders from participating in an auction. Its purpose is to reduce unnecessary network traffic and lower costs for both the publisher and the bidders when participation is unlikely to happen.

This module makes it possible, among other things, to:

1. skip calling certain bidders for users in specific geographies,
1. exclude bidders when no EID or FPD is available,
1. run A/B tests for experimenting with individual new bidders,
1. run A/B tests for experimenting with sets of bidders.

This functionality is also relevant to the Prebid Sustainability Taskforce, as reducing the number of requests helps save money and reduce carbon emissions.

## How it works

The Prebid.js Shaping Rules module processes JSON data in the floors-syntax format, which it fetches from the endpoint specified in the module’s configuration. It parses the JSON configuration, evaluates the conditions used to determine model groups, and assigns the user to the appropriate group. Within that model group, it then evaluates the conditions defined in the schema functions and, when those conditions are met, applies the corresponding `includeBidders` or `excludeBidders` rule using the Activity Controls mechanism.

## Rules engine JSON

### Example

This example shows the scenario when `bidderA` and `bidderD` are excluded from auction
in Japan

```javascript

{
  "enabled": true,
  "generateRulesFromBidderConfig": true,
  "timestamp": "20250131 00:00:00",
  "ruleSets": [
    {
      "stage": "processed-auction-request",
      "name": "exclude-in-jpn",
      "version": "1234",
      "modelGroups": [
        {
          "weight": 98,
          "analyticsKey": "experiment-name",
          "version": "4567",
          "schema": [
            { "function": "deviceCountryIn", "args": [["JPN"]] }
          ],
          "default": [],
          "rules": [
            {
              "conditions": ["true"],
              "results": [
                {
                  "function": "excludeBidders",
                  "args": [
                    { "bidders": ["bidderA", "bidderD"], "analyticsValue": "rmjpn" },
                  ]
                }
              ]
            },
            {
              "conditions": [],
              "results": []
            }
          ]
        },
        {
          "weight": 2,
          "default": []
        }
      ]
    }
  ]
}
```

### Rules engine JSON fields

{: .table .table-bordered .table-striped }
{: .table .table-bordered .table-striped }
| Field                                                   | Description                                                                                                                                | Default |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `enabled`                                               | Enables or disables the module.                                                                                                            | `true`  |
| `generateRulesFromBidderConfig`                         | Automatically generates rules based on bidder YAML files, using the `geoscope` section to exclude bidders in unsupported geos.             | `true`  |
| `ruleSets[]`                                            | One or more independent sets of rules.                                                                                                     | —       |
| `ruleSets[].enabled`                                    | Indicates whether this ruleset is active; useful for troubleshooting.                                                                      | —       |
| `ruleSets[].timestamp`                                  | Optional timestamp of the last update (ISO 8601 format: `YYYY-MM-DDThh:mm:ss[.sss][Z or ±hh:mm]`).                                         | —       |
| `ruleSets[].stage`                                      | Indicates which module stage the ruleset applies to. Can be either `processed-auction-request` or `processed-auction`                                                                                       | —       |
| `ruleSets[].name`                                       | Human-readable name of the ruleset.                                                                                                        | —       |
| `ruleSets[].modelGroups[]`                              | Allows A/B testing with different rule configurations.                                                                                     | —       |
| `ruleSets[].modelGroups[].weight`                       | Determines selection probability; only one object within the group is chosen.                                                              | —       |
| `ruleSets[].modelGroups[].version`                      | Version identifier for analytics.                                                                                                          | —       |
| `ruleSets[].modelGroups[].default[]`                    | Default results object used if errors occur or when no schema or rules are defined. Exists outside the rules array for structural clarity. | —       |
| `ruleSets[].modelGroups[].schema[]`                     | Optional array of functions used to compute values. Without it, only the default rule is applied.                                          | —       |
| `ruleSets[].modelGroups[].schema[].function`            | Function name inside the schema.                                                                                                           | —       |
| `ruleSets[].modelGroups[].schema[].args`                | Arguments for the schema function.                                                                                                         | —       |
| `ruleSets[].modelGroups[].analyticsKey`                 | Optional key used to produce aTags, identifying experiments or optimization targets.                                                       | —       |
| `ruleSets[].modelGroups[].rules[]`                      | Optional rule array; if absent, only the default rule is used.                                                                             | —       |
| `ruleSets[].modelGroups[].rules[].conditions[]`         | Conditions that must be met for the rule to apply.                                                                                         | —       |
| `ruleSets[].modelGroups[].rules[].results[]`            | Resulting actions triggered when conditions are met.                                                                                       | —       |
| `ruleSets[].modelGroups[].rules[].results[].function`   | Function defining the result action.                                                                                                       | —       |
| `ruleSets[].modelGroups[].rules[].results[].args`       | Arguments for the result function.                                                                                                         | —       |

### Schema functions

| Function         | Args                             | Value                                                                                                                                                                                                                           |
|------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `deviceCountry`   | null                            | Return device.geo.country.                                                                                                                                                                                                      |
| `deviceCountryIn` | array of strings (country codes)| Check if device.geo.country is in the array (case sensitive). Empty array = treat as null.                                                                                                                                    |
| `channel`         | null                            | Returns ext.prebid.channel (web/amp/app). Return "" if none. Return "pbjs" as "web".                                                                                                                                           |
| `eidAvailable`    | null                            | true if user.eids exists and is non-empty. Otherwise false.                                                                                                                                                                     |
| `userFpdAvailable`| null                            | true if user.ext.data or user.data exists and not empty.                                                                                                                                                                        |
| `fpdAvailable`    | null                            | true if any of: user.ext.data, user.data, site.ext.data, site.content.data, app.ext.data, app.content.data exists with data.                                                                                                    |
| `gppSidAvailable` | null                            | true if any regs.gpp_sid values > 0.                                                                                                                                                                                           |
| `gppSidIn`        | array of ints                   | true if intersection between regs.gpp_sid and array is non-empty.                                                                                                                                                               |
| `tcfInScope`      | null                            | true if regs.gdpr == "1".                                                                                                                                                                                                      |
| `percent`         | int                             | true if random int 0–100 < pct. Default 5 if null. Min 0, max 100.                                                                                                                                                              |
| `domain`          | null                            | Return publisher.domain or domain from {site, app, dooh}.                                                                                                                                                                       |
| `domainIn`        | array of strings                | true if any supplied domain matches publisher.domain or domain.                                                                                                                                                                 |
| `bundleIn`        | array of strings                | true if any supplied value matches app.bundle.                                                                                                                                                                                  |
| `mediaTypeIn`     | array of strings                | true if any supplied mediaType is present in imp.                                                                                                                                                                               |
| `adUnitCode`      | null                            | Return first of: imp.ext.gpid, imp.tagid, imp.ext.data.pbadslot, imp.ext.prebid.storedrequest.id.                                                                                                                             |
| `adUnitCodeIn`    | array of strings                | true if any supplied string matches imp.ext.gpid, imp.tagid, imp.ext.data.pbadslot, imp.ext.prebid.storedrequest.id, imp.id.                                                                                                    |
| `deviceTypeIn`    | array of integers               | true if any supplied integer matches device.devicetype.                                                                                                                                                                         |
| `bidPrice`        | [operator, value, currency]     | Compare bid response price with operator/value in currency. Example: gt 5 EUR.                                                                                                                                                  |

### Result functions

In this stage of the generic rules engine, only three result functions are supported:

- `excludeBidders`
- `includeBidders`
- `logAtag`

#### excludeBidders and includeBidders

Both functions behave almost identically.

The function argument is an array of objects, each of which may include the following attributes:

| Arg            | Value Type        | Required? | Meaning                         | Default |
|----------------|--------------------|-----------|----------------------------------|---------|
| bidders        | array of strings   | yes       | The bidders to include/exclude   | none    |
| analyticsValue | string             | no        | Value sent to the aTag           | none    |

## Module configuration

### Example config

```javascript
  pbjs.setConfig({
    rules: {
        auctionDelay: 2000, // maximum time (in ms) the auction may wait for the rules endpoint to respond
        endpoint: {
            url: 'http://rules-config-endpoint.com/shaping-rules',
            method: 'GET'
        }
    }
  })
```