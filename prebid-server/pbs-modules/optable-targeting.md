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
      "api-endpoint": "",
      "api-key": "",
      "ppid-mapping": {},
      "adserver-targeting": false,
    }
  }
}
```

```yaml
  modules:
    optable-targeting:
      api-endpoint: 
      api-key: 
      ppid-mapping: 
      adserver-targeting: false
```

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
| api-endpoint | yes | string | none | Targeting Edge API endpoint URL, required |
| api-key | no | string | none | If the API is protected with a key - this param needs to be specified to be sent in the auth header |
| ppid-mapping | no | map | none | This specifies PPID source to custom identifier name mapping, f.e. {"example-id.com" : "c_0" } |
| adserver-targeting | no | boolean | false | If set to true - will add the adserver targeting keywords into the response |

## Running the demo (PBS-Java)

1. Build the server bundle JAR as described in [Build Project](https://github.com/prebid/prebid-server-java/blob/master/docs/build.md#build-project), e.g.

```bash
mvn clean package --file extra/pom.xml
```

{:start="3"}
2. Start server bundle JAR as described in [Running project](https://github.com/prebid/prebid-server-java/blob/master/docs/run.md#running-project), e.g.

```bash
java -jar target/prebid-server-bundle.jar --spring.config.additional-location=sample/configs/prebid-config-optable.yaml
```

{:start="4"}
3. Run sample request against the server as described in [the sample directory](https://github.com/prebid/prebid-server-java/tree/master/sample), e.g.

```bash
curl http://localhost:8080/openrtb2/auction --data @extra/modules/optable-targeting/sample-requests/data.json
```

{:start="5"}
4. Observe the `user.ext.eids` and `user.ext.data` objects enriched.


## Maintainer contacts

Any suggestions or questions can be directed to [prebid@optable.co](mailto:prebid@optable.co).

Alternatively please open a new [issue](https://github.com/prebid/prebid-server-java/issues/new) or [pull request](https://github.com/prebid/prebid-server-java/pulls) in this repository.
