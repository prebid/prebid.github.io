---
layout: page_v2
page_type: pbs-module
title: Prebid Server Optable Targeting Module
display_name : Optable Targeting Module
sidebarType : 5
---

{: .alert.alert-warning :}
Optable module operates using a DCN backend API. Please contact your account manager to get started.

# Optable Targeting Module
{:.no_toc}

* TOC
{:toc }

## Overview

Optable module enriches an incoming OpenRTB request by adding to the `user.ext.eids` and `user.ext.data` objects.
As input module may use PPIDs (publisher provided IDs) as part of the `user.ext.eids` and/or sha256-hashed email, sha256-hashed phone or postal_code provided at `user.ext.optable.email`, `.phone`, `.postal_code` fields. 

## Setup

### Execution Plan

This module runs at two stages:

* Processed Auction Request: to enrich `user.ext.eids` and `user.ext.data`.
* Auction Response: to inject ad server targeting.

We recommend defining the execution plan in the account config so the module is only invoked for specific accounts. See below for an example.

### Global Config

There is no host-company level config for this module.

### Account-Level Config

To start using current module in PBS-Java you have to enable module and add `optable-targeting-processed-auction-request-hook` and `optable-targeting-auction-response-hook` into hooks execution plan inside your config file:
Here's a general template for the account config used in PBS-Java:

```yaml
hooks:
  optable-targeting:
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
                      "module-code": "optable-targeting",
                      "hook-impl-code": "optable-targeting-processed-auction-request-hook"
                    }
                  ]
                }
              ]
            },
            "auction-response": {
              "groups": [
                {
                  "timeout": 10,
                  "hook-sequence": [
                    {
                      "module-code": "optable-targeting",
                      "hook-impl-code": "optable-targeting-auction-response-hook"
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

Sample module enablement configuration in JSON and YAML formats:

```json
{
  "modules":
  {
    "optable-targeting":
    {
      "api-endpoint": "endpoint",
      "api-key": "key",
      "timeout": 50,
      "ppid-mapping": {
        "pubcid.org": "c"
      },
      "adserver-targeting": false,
    }
  }
}
```

```yaml
  modules:
    optable-targeting:
      api-endpoint: endpoint
      api-key: key
      timeout: 50
      ppid-mapping: {
        "pubcid.org": "c"
      }
      adserver-targeting: false
```

### Timeout considerations

The timeout value specified in the execution plan for the `processed-auction-request` hook is very important to be picked such that the hook has enough time to make a roundtrip to Optable Targeting Edge API over HTTP.  **Note:** Do not confuse hook timeout value with the module timeout parameter which is optional. The hook timeout value would depend on the cloud/region where the PBS instance is hosted and the latency to reach the Optable's servers. This will need to be verified experimentally upon deployment.

The timeout value for the `auction-response` can be set to 10 ms - usually it will be sub-millisecond time as there are no HTTP calls made in this hook - Optable-specific keywords are cached on the `processed-auction-request` stage and retrieved from the module invocation context later.

## Module Configuration Parameters for PBS-Java

The parameter names are specified with full path using dot-notation.  F.e. `section-name` .`sub-section` .`param-name` would result in this nesting in the JSON configuration:

```json
{
  "section-name": {
    "sub-section": {
      "param-name": "param-value"
    }
  }
}
```

{: .table .table-bordered .table-striped }
| Param Name | Required| Type | Default  value | Description |
|:-------|:------|:------|:------|:---------------------------------------|
| api-endpoint | yes | string | none | Optable Targeting Edge API endpoint URL, required |
| api-key | no | string | none | If the API is protected with a key - this param needs to be specified to be sent in the auth header |
| ppid-mapping | no | map | none | This specifies PPID source to custom identifier name mapping, f.e. `{"example-id.com" : "c_0"}` |
| adserver-targeting | no | boolean | false | If set to true - will add the Optable-specific adserver targeting keywords into the PBS response for every `seatbid[].bid[].ext.prebid.targeting` |
| timeout | no | integer | false | A soft timeout (in ms) sent as a hint to the Targeting API endpoint to  limit the request times to Optable's external tokenizer services |
| id-prefix-order | no | list | [] | An optional list of id prefixes that prioritizes and specifies the order in which ids are provided to Targeting API in a query string. F.e. ["c","c1","id5"] will guarantee that Targeting API will see id=c:...,c1:...,id5:... if these ids are provided.  id-prefixes not mentioned in this list will be added in arbitrary order after the priority prefix ids. This affects Targeting API processing logic |

## Analytics Tags
The following 2 analytics tags are written by the module: 
- `optable-enrich-request`
- `optable-enrich-response`

The `status` is either `success` or `failure`.  Where it is `failure` a `results[0].value.reason` is provided.  
For the `optable-enrich-request` activity the `execution-time` value is logged. 
Example:
```json
"analytics": {
    "tags": [
        {
            "stage": "auction-response",
            "module": "optable-targeting",
            "analyticstags": {
                "activities": [
                    {
                        "name": "optable-enrich-request",
                        "status": "success",
                        "results": [
                            {
                                "values": {
                                    "execution-time": 33
                                }
                            }
                        ]
                    },
                    {
                        "name": "optable-enrich-response",
                        "status": "success",
                        "results": [
                            {
                                "values": {
                                    "reason": "none"
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

If `adserver-targeing` was set to `false` in the config `optable-enrich-response` analytics tag is not written.

## Running the demo (PBS-Java)

{:start="1"}
1. Build the server bundle JAR as described in [Build Project](https://github.com/prebid/prebid-server-java/blob/master/docs/build.md#build-project), e.g.

```bash
mvn clean package --file extra/pom.xml
```

{:start="2"}
2. In the `sample/configs/prebid-config-optable.yaml` file specify the `api-endpoint` URL of your DCN, f.e.: 
```yaml
api-endpoint: https://example.com/v2/targeting
```

{:start="3"}
3. Start server bundle JAR as described in [Running project](https://github.com/prebid/prebid-server-java/blob/master/docs/run.md#running-project), e.g.

```bash
java -jar target/prebid-server-bundle.jar --spring.config.additional-location=sample/configs/prebid-config-optable.yaml
```

{:start="4"}
4. Run sample request against the server as described in [the sample directory](https://github.com/prebid/prebid-server-java/tree/master/sample), e.g.

```bash
curl http://localhost:8080/openrtb2/auction --data @extra/modules/optable-targeting/sample-requests/data.json
```

{:start="5"}
5. Observe the `user.ext.eids` and `user.ext.data` objects enriched.


## Maintainer contacts

Any suggestions or questions can be directed to [prebid@optable.co](mailto:prebid@optable.co).

Alternatively please open a new [issue](https://github.com/prebid/prebid-server-java/issues/new) or [pull request](https://github.com/prebid/prebid-server-java/pulls) in this repository.
