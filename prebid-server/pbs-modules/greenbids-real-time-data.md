---
layout: page_v2
page_type: pbs-module
title: Prebid Server Greenbids Real Time Data Module
display_name : Greenbids Real Time Data Module
sidebarType : 5
---

# Greenbids Real Time Data Module

## Overview

Greenbids Real Time Data module filters bidders 
SSP listed in the `imp[].ext.prebid.bidder`
of the bid request. To perform the filtering the module uses the ML pipeline that outputs the probability 
of bid per SSP for each imp for the given BidRequest. 
Then this probability of bid is compared with the threshold to ensure target True Positive Rate (TPR) 
defined for each partner publisher.

## Configuration

### Execution Plan

This module supports running at:

- processed-auction-request: this is where PBS bid request enrichments
are done before customizing it to a particular bidder in the auction.


### Account-Level Config

Here's an example of the account config used in PBS-Java:

```yaml
hooks:
  greenbids-real-time-data:
    enabled: true
  host-execution-plan: >
    {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "processed-auction-request": {
              "groups": [
                {
                  "timeout": 100,
                  "hook-sequence": [
                    {
                      "module-code": "greenbids-real-time-data",
                      "hook-impl-code": "greenbids-real-time-data-processed-auction-request-hook"
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

### List of module configuration options


### Publisher settings

We have observed 2 options how to handle the settings by the activated partner publishers 
to avoid adding them to the code base
- add the list of authorized partners with their configs (target TPR, Exploration Rate, pbuid) 
in the `prebid-config-with-modules.yaml` common config of prebid and update it buy sending manually to PBS team
- let publishers add their configs direclty into `bid-request.json` where they indicate the activation of our module 
in bid request extenstion `bid-request.ext.prebid.analytics.greenbids` and 
`bid-request.ext.prebid.analytics.greenbids-rtd`. 

At the given moment the 2nd option is implemented in the RTD module.

```json
"ext": {
    "prebid": {
      "targeting": {
        "includewinners": true,
        "includebidderkeys": true
      },
      "analytics": {
        "greenbids": {
          "pbuid": "PBUID_FROM_GREENBIDS",
          "greenbidsSampling": 1
        },
        "greenbids-rtd": {
	        "pbuid": "PBUID_FROM_GREENBIDS",
	        "targetTpr": 0.95,
	        "explorationRate": 0.001
        }
      }
    }
  }
```



## Analytics Tags

The RTD module also communicates the filtering results with the `GreenbidsAnalyticsReporter` via AnalyticsTags. 
Here we populate AnalyticsResult of AnalyticsTag for each Imp the with

- `fingerprint`: greenbidsId,
- `isKeptInAuction` map of booleans for each bidder wether we keep them in auction or not for the given imp,
- `isExploration`flag that is necessary to isolate the training log

Then the AnalyticsTag is then parsed by the AnalyticsReporter from `ExtBidResponsePrebid` 
and its content added to the analytics payload sent to Greenbids server.

The Exploration part of traffic is split randomly with the ratio defined for each partner publisher 
per bid requests and is not filtered by the RTD module.