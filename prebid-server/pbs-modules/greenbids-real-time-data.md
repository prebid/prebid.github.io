---
layout: page_v2
page_type: pbs-module
title: Prebid Server Greenbids Real Time Data Module
display_name : Greenbids Real Time Data Module
sidebarType : 5
---

# Greenbids Real Time Data Module

## Overview

Greenbids Real Time Data module filters bidders SSPs listed in the `imp[].ext.prebid.bidder` of the bid request. 
To perform the filtering the module uses AI to predict the bidding probability of bid per SSP for each `imp` for the given bid request.
This bidding probability is used to choose to send the bid request or not, according to the performance constraints applied by the partner publisher.

The RTD module uses 2 artefacts that are fetched from the Greenbids Google Cloud Storage bucket

- ML predictor in `.onnx` format: used to predict the bidding probability
- Probability thresholds in `.json` format: used to convert the bidding probability to a binary choice

## Configuration

### Execution Plan

This module supports running at:

- processed-auction-request: this is where PBS bid request enrichments
are done before customizing it to a particular bidder in the auction.

### Account-Level Config

The module is invoked based on account config. The logic of the config is as follows:

- `BidRequest` extension in `ext.prebid.analytics.greenbids-rtd` if defined takes precedence over account configs.
- If the `BidRequest` extension is not defined, the account config is used and defined one per individual publisher.
  The config is stored in `yaml` file under path `settings.filesystem.settings-filename` of the Prebid config.
- If the account config is not defined, the default account config is used. It is defined in `settings.default-account-config` field of the Prebid config.

Here are examples of the config used in PBS-Java:

BidRequest extension:

```json
"ext": {
    "prebid": {
      "analytics": {
        "greenbids": {
          "pbuid": "PBUID_FROM_GREENBIDS",
          "greenbids-sampling": 1
        },
        "greenbids-rtd": {
          "pbuid": "PBUID_FROM_GREENBIDS",
          "target-tpr": 0.55,
          "exploration-rate": 0.0005
        }
      }
    }
  }
```

Account config:

```yaml
hooks:
  modules:
    greenbids-real-time-data:
      pbuid: "PBUID_FROM_GREENBIDS"
      target-tpr: 0.96
      exploration-rate: 0.002
analytics:
  modules:
    greenbids:
      pbuid: "PBUID_FROM_GREENBIDS"
      greenbids-sampling: 0.002
```

Execution plan setup:

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

- `google-cloud-greenbids-project`: Google Cloud project associated with Greenbids
- `gcs-bucket-name`: Google Cloud Storage (GCS) bucket used to fetch the artefacts ([ONNX](https://onnx.ai/) model and thresholds `.json`) necessary for prediction
- `cache-expiration-minutes`: The duration (in minutes) after which cached model and thresholds should be considered expired and refreshed
- `geo-lite-country-path`: URL to the geo-ip database
- `onnx-model-cache-key-prefix`: prefix necessary for getting cached ONNX model
- `thresholds-cache-key-prefix`: prefix necessary for getting cached throttling thresholds

```yaml
greenbids-real-time-data:
  google-cloud-greenbids-project: "greenbids-357713"
  gcs-bucket-name: "greenbids-europe-west1-prebid-server-staging"
  cache-expiration-minutes: 15
  geo-lite-country-path: "https://git.io/GeoLite2-Country.mmdb"
  onnx-model-cache-key-prefix: "onnxModelRunner_"
  thresholds-cache-key-prefix: "throttlingThresholds_"
```

### Publisher bid request settings

The activated partner publishers add their configs direclty into `bid-request.json` 
where they indicate the activation of our module 
in bid request extenstion `bid-request.ext.prebid.analytics.greenbids` 
for [Analytics Reporter](https://docs.prebid.org/prebid-server/pbs-modules/greenbids-analytics-reporter.html) and 
`bid-request.ext.prebid.analytics.greenbids-rtd` for Greenbids RTD Module.

The list of the parameters necessary for RTD module activation is as follows:

| Parameter       | Scope             | Description                                                                                         | Example               | Type         |
|-----------------|-------------------|-----------------------------------------------------------------------------------------------------|-----------------------|--------------|
| pbuid           | required          | The Greenbids Publisher ID                                                                          | greenbids-publisher-1 | string       |
| targetTpr       | required          | Expected retained opportunities ratio [0-1]                                                         | 0.9                   | float        |
| explorationRate | required          | Ratio of traffic without filtering used for training ML model [0-1] (a value of 0.1 will filter 90% of the traffic) | 0.1                   | float        |

Here's an example of how a PBS partner publisher setup using both Greenbids RTD Module and Greenbids AnalyticsReporter should look like:

```json
"ext": {
    "prebid": {
      "analytics": {
        // extension for Greenbids Analytics Reporter
        "greenbids": {
          "pbuid": "PBUID_FROM_GREENBIDS",
          "greenbidsSampling": 0.01
        },
        // extension for Greenbids Real Time Data Module
        "greenbids-rtd": {
          "pbuid": "PBUID_FROM_GREENBIDS", 
          "targetTpr": 0.95,
          "explorationRate": 0.001
        }
      }
    }
  }
```

### Enable for Spring Boot

In order to allow the module to be picked up by PBS-Java, a Spring Boot configuration property `hooks.greenbids-real-time-data.enabled` must be set to `true`.

Here's an example of how your PBS configuration YAML should look like:

```YAML
hooks:
  greenbids-real-time-data:
    enabled: true
```

## Analytics Tags

The RTD module also communicates the filtering results with the `GreenbidsAnalyticsReporter` via [AnalyticsTags](https://docs.prebid.org/prebid-server/developers/module-atags.html). 
Here we populate analytics result of analytics tags for each `imp` the with:

- `fingerprint`: greenbidsId
- `isKeptInAuction`: map of booleans for each bidder whether we keep them in auction or not for the given imp
- `isExploration`: flag that is necessary to isolate the training data

The analytics tag is then parsed by the AnalyticsReporter from `HookExecutionContext` 
and its content added to the analytics payload sent to Greenbids server. The exploration part of traffic is split randomly with the ratio defined for each partner publisher 
per bid requests and is not filtered by the RTD module.

Here's an example analytics tag that might be produced for use in an analytics adapter:

```json
{
  "activities": [
    {
      "name": "greenbids-filter",
      "status": "success",
      "results": [
        {
          "status": "success",
          "values": {
            "pub_banniere_haute": {
              "greenbids": {
                "fingerprint": "ad63524e-b13f-4359-a975-dba9b5dc08f4",
                "keptInAuction": {
                  "improvedigital": false,
                  "appnexus": true,
                  "pubmatic": false,
                  "rubicon": true,
                  "teads": false
                },
                "isExploration": false
              },
              "tid": "2c445309-06b2-47b2-a724-4aeef15faeb8"
            }
          },
          "appliedTo": {}
        }
      ]
    }
  ]
}
```

## Maintainer contacts

For any questions and suggestions please reach out to our team for more information [greenbids.ai](https://greenbids.ai). 

Or just open new [issue](https://github.com/prebid/prebid-server-java/issues/new) or [pull request](https://github.com/prebid/prebid-server-java/pulls) in this repository.

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [Building a Prebid Server Module](/prebid-server/developers/add-a-module.html)
