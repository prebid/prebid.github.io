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
Any suggestions or questions can be directed to [support@confiant.com](support@confiant.com) e-mail.

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
```

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [Building a Prebid Server Module](/prebid-server/developers/add-a-module.html)
