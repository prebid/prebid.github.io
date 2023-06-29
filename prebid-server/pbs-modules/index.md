---
layout: page_v2
title: Prebid Server Modules
description: Prebid Server Module Documentation
sidebarType: 5
---

# Prebid Server Modules
{:.no_toc}

The core of Prebid Server contains the foundational code needed for header bidding. Any functionality that could be considered an add-on or that covers a special case is covered by modules. 

If you're looking for bidder adapter parameters, see [Bidders' Params](/dev-docs/pbs-bidders.html).

* TOC
{:toc}

## The Modules

{: .table .table-bordered .table-striped }
| Module              | Description  | PBS-Go | PBS-Java |
|---------------------+--------------+--------+----------|
| [**ORTB2 Blocking**](/prebid-server/pbs-modules/ortb2-blocking.html) | Support bidders that aren't full-service SSPs. | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> |

## Installing a PBS Module

Once a Prebid Server host company decides which modules they want to support,
here's how installation works:

### 1. Build PBS with modules.

Note that modules are currently an all-or-nothing nothing from a code perspective.
```
mvn clean package --file extra/pom.xml
```

### 2. Define an 'execution plan'

The execution plan details:
- which modules are used in your server
- what order they're invoked in
- how long modules have to run before timeout
- whether any modules depend on each other

If you want the module to run on every request regardless of account, this is a
host-level config you should place in `application.yaml`. If the module should
be active only for certain accounts, you'll need to place the plan in the account-specific config.

To define a plan, you'll need to know the following module details, which should be available in the module documentation:
- urls: which PBS 'entry points' are relevant. e.g. /openrtb2/auction, /openrtb2/amp
- stages: one or more of the 7 workflow stages where the module should be called: entrypoint, raw-auction-request, processed-auction-request, bidder-request, raw-bidder-response, processed-bidder-response, and/or auction-response.
- hooks: for each stage where a module runs, its documentation will provide the hook function name.

Here's an example application.yaml entry:
```
hooks: 
  host-execution-plan: >   # these hooks are always run for all accounts
  {
    "endpoints": {
      "/openrtb2/auction": { # endpoint
        "stages": {
          "entrypoint": { # stage
            "groups": [
              {
                "timeout": 3,  # in milliseconds
                "hook-sequence": [
                  {
                    "modulecode": "modulecode1",
                    "hookimplcode": "hook1"
                  },
                  {
                    "modulecode": "modulecode2",
                    "hookimplcode": "hook2"
                  }
                ]
              },{ // this group depends on the results of the first group
                    "timeout": 5,  # in milliseconds
                    "hook-sequence": [
                  {
                    "modulecode": "modulecode3",
                    "hookimplcode": "hook3-depends-on-hook1"
                  }
        ]
              }
            ]
          }
        }
      }
    }
  }
  # these hooks are run for all accounts unless overridden by DB config
  default-account-execution-plan: >
  {
   "endpoints": {
      "/openrtb2/amp": { # endpoint
        "stages": {
          "raw-auction-request": { # stage
            "groups": [
              {
                "timeout": 5,
                "hook-sequence": [
                  {
                    "modulecode": "modulecodeA",
                    "hookimplcode": "hookA"
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

### 3. Supply the module with configuration

Modules may require configuration at startup or during the request:

- If the module requires config at initialization, its documentation will
describe where the config file lives and what format it should take.
- If the module requires runtime config, it should be passed via the account-conig mechanism.


## Further Reading

+ [Developing a Prebid Server Module](/prebid-server/developers/add-a-module.html)
+ [Prebid Server Features](/prebid-server/features/pbs-feature-idx.html)
