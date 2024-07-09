---
layout: page_v2
page_type: pbs-module
title: Prebid Server Greenbids PBS Analytics Reporter
display_name : Prebid Server Greenbids Analytics Reporter
sidebarType : 5
---

## Overview

This analytics adapter communicates with Greenbids Analytics Server by sending to it the information about the SSP bids for the publisher inventory sold throguh PBS. For the publishers the incoming requests to the Greenbids Analytics Reporter require setup and approval from the Greenbids team. Please reach out to our team for more information [greenbids.ai](https://greenbids.ai).

## Configuration

Greenbids Analytics Reporter contains the static parameters defined in [application.yaml](https://github.com/EvgeniiMunin/prebid-server-java/blob/a2e376c14680108683483719d212d330f8f66742/src/main/resources/application.yaml#L296) 

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| analytics-server-version | string | Version of Analytics Schema Greenbids side |
| analytics-server | string | Greenbids Analytics Server URL |
| exploratory-sampling-split | float | Exploration vs Exploitation ratio of analytics traffic |
| timeout-ms | int | Timeout limit on sending POST request to Greenbids Analytics Server |

Greenbids Analytics Reporter also includes the parameters specific for each publisher setup. These parameters should be included into the extension of the bid request json: `ext.analytics.greenbids`

| Parameter | Scope | Description | Example | Type |
| --------- | ---- | ------------- | ------------- | ----------- |
| pbuid | required | The Greenbids Publisher ID | greenbids-publisher-1 | string | 	
| greenbidsSampling | optional  | sampling factor [0-1] (a value of 0.1 will filter 90% of the traffic) | 1.0  | float |

The example of publisher config in the bid request extension is as follows:

```json
"ext": {
  "analytics": {
    "greenbids": {
      "pbuid": "PBUID_FROM_GREENBIDS",
      "greenbidsSampling": 0.1
    }
  }
}
```
