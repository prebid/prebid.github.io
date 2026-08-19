---
layout: page_v2
page_type: pbs-module
title: Prebid Server Greenbids PBS Analytics Reporter
display_name : Prebid Server Greenbids Analytics Reporter
sidebarType : 5
---

# Overview

This analytics adapter communicates with the Greenbids Analytics Server by sending it the information about bids for the publisher inventory sold through PBS. The Greenbids Analytics module requires setup and approval from the Greenbids team for each publisher. Please reach out to our team for more information [greenbids.ai](https://greenbids.ai).

## Configuration

The Greenbids Analytics Reporter references global parameters defined in application.yaml. For example:

```yaml
analytics:
  greenbids:
    analytics-server-version: "2.2.0"
    analytics-server: http://localhost:8090
    exploratory-sampling-split: 0.9
    timeout-ms: 10000
```

Here's a description of the global parameters:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| analytics-server-version | string | Version of Analytics Schema Greenbids side |
| analytics-server | string | Greenbids Analytics Server URL |
| exploratory-sampling-split | float | Exploration vs Exploitation ratio of analytics traffic |
| timeout-ms | int | Timeout limit on sending POST request to Greenbids Analytics Server |

The Greenbids Analytics module includes account-specific parameters for the publisher setup. The logic of the config is as follows:

- `BidRequest` extension in `ext.prebid.analytics.greenbids` if defined takes precedence over account configs.
- If the `BidRequest` extension is not defined, the account config is used and defined one per individual publisher.
  The config is stored in `yaml` file under path `settings.filesystem.settings-filename` of the Prebid config.
- If the account config is not defined, the default account config is used. It is defined in `settings.default-account-config` field of the Prebid config.

Here are examples of the config:

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
