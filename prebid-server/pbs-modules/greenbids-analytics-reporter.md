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

The Greenbids Analytics module also includes account-specific parameters for each publisher setup. These parameters should be included in the extension of the bid request json: `ext.prebid.analytics.greenbids`

| Parameter | Scope | Description | Example | Type |
| --------- | ---- | ------------- | ------------- | ----------- |
| pbuid | required | The Greenbids Publisher ID | greenbids-publisher-1 | string |
| greenbidsSampling | optional  | sampling factor [0-1] (a value of 0.1 will filter 90% of the traffic) | 1.0  | float |

An example of publisher config in the bid request extension is as follows:

```json
"ext": {
  "prebid": {
    "analytics": {
      "greenbids": {
        "pbuid": "PUBID_FROM_GREENBIDS",
        "greenbidsSampling": 1.0
      }
    }
  }
}
```
