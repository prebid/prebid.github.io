---
layout: page_v2
page_type: pbs-module
title: Prebid Server Confiant Ad Quality Module
display_name : Confiant Ad Quality Module
sidebarType : 5
---

# Confiant Ad Quality Module
{:.no_toc}

- TOC
{:toc }

## Overview

[Confiant](https://www.confiant.com/) is an industry leader in the field of ad tech security and quality.
This module provides a low latency pre-auction scanning for such issues.
Any suggestions or questions can be directed to [support@confiant.com](mailto:support@confiant.com) e-mail.

## Configuration

### Execution Plan

This module supports running at the stage:

- all-processed-bid-responses: this is where all bids are back and PBS-core bid validations are done.

### Account-Level Config

Here's a general template for the account config used in PBS-Java:

```yaml
hooks:
    confiant-ad-quality:
        enabled: true
    host-execution-plan: >
        {
          "endpoints": {
            "/openrtb2/auction": {
              "stages": {
                "all-processed-bid-responses": {
                  "groups": [
                    {
                      "timeout": 200,
                      "hook-sequence": [
                        {
                          "module-code": "confiant-ad-quality",
                          "hook-impl-code": "confiant-ad-quality-bid-responses-scan-hook"
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

- `api-key` - Confiant's API key.
- `redis-config`
  - `write-node`
    - `host` - Host value of the Confiant's Write Redis Node.
    - `port` - Port value of the Confiant's Write Redis Node.
    - `password` - User password value of the Confiant's Write Redis Node.
  - `read-node`
    - `host` - Host value of the Confiant's Read Redis Node.
    - `port` - Port value of the Confiant's Read Redis Node.
    - `password` - User password value of the Confiant's Read Redis Node.
- `redis-retry-config`
  - `short-interval-attempts` - Maximum attempts with short interval value to try to reconnect to Confiant's Redis server in case any connection error happens.
  - `short-interval` - Short time interval in milliseconds after which another one attempt to connect to Redis will be executed.
  - `long-interval-attempts` - Maximum attempts with long interval value to try to reconnect to Confiant's Redis server in case any connection error happens. This attempts are used when short-attempts were not successful.
  - `long-interval` - Long time interval in milliseconds after which another one attempt to connect to Redis will be executed.
- `scan-state-check-interval` - Time interval in milliseconds between periodic calls to check if scan state is enabled on the side of Redis server.
- `bidders-to-exclude-from-scan` - List of bidders which won't be scanned by Confiant

```yaml
hooks:
  modules:
    confiant-ad-quality:
      api-key: "hgr876cerg7655"
      redis-config:
      write-node:
          host: "127.0.0.1"
          port: 8000
          password: "password-w"
      read-node:
          host: "127.0.0.1"
          port: 8001
          password: "password-r"
      redis-retry-config:
        short-interval-attempts: 60
        short-interval: 1000
        long-interval-attempts: 336
        long-interval: 1800000
      scan-state-check-interval: 100000
      bidders-to-exclude-from-scan: >
        adyoulike,
        rtbhouse
```

## Analytics Tags

There's only one analytics activity defined by this module: "ad-scan".
ATag values:

1. for activities[].results[].status **inspected-has-issue** (response was scanned by Confiant and some issue found)
   1. No `values` block
   2. Attributes in the `appliedto` block:
      1. **bidders**: the list of bidders of the blocked response
      2. **impIds**: the list of seatbid.bid.impId of the blocked response
      3. **bidIds**: the list of seatbid.bid.id of the blocked response
2. for activities[].results[].status **inspected-no-issues** (response was scanned by Confiant and no issues found)
    1. No `values` block
    2. Attributes in the `appliedto` block:
        1. **bidders**: the list of bidders of the "clean" response
        2. **impIds**: the list of seatbid.bid.impId of the "clean" response
        3. **bidIds**: the list of seatbid.bid.id of the "clean" response
3. for activities[].results[].status **skipped** (response was skipped because of the config: `bidders-to-exclude-from-scan`)
    1. No `values` block
    2. Attributes in the `appliedto` block:
        1. **bidders**: the list of bidders of the skipped response
        2. **impIds**: the list of seatbid.bid.impId of the skipped response
        3. **bidIds**: the list of seatbid.bid.id of the skipped response

Here's an example analytics tag that might be produced for use in an analytics adapter:

```json
[{
  "activities": [{
    "name": "ad-scan",
    "status": "success",
    "results": [{
      // bidderA was scanned by Confiant and has an issue for imp=A
      "status": "inspected-has-issue",
      "values": null,
      "appliedto": {
        "bidders": ["bidderA"],
        "impIds": ["A"],
        "bidIds": ["bidIdA"]
      }
    },{
      // bidderB was scanned by Confiant and does not have any issues for imp=B
      "status": "inspected-no-issues",
      "values": null,
      "appliedto": {
        "bidders": ["bidderB"],
        "impIds": ["B"],
        "bidIds": ["bidIdB"]
      }
    },{
      // bidderC was not scanned by Confiant because of the `bidders-to-exclude-from-scan` configuration
      "status": "skipped",
      "values": null,
      "appliedto": {
        "bidders": ["bidderC"],
        "impIds": ["C"],
        "bidIds": ["bidIdC"]
      }
    }]
  }]
}]
```

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [Building a Prebid Server Module](/prebid-server/developers/add-a-module.html)
- [Confiant Real-Time Protection Module](/dev-docs/modules/confiantRtdProvider.html)
