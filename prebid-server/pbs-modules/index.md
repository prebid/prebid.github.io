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

- TOC
{:toc}

## The Modules

There are two types of modules:

1. General Modules - these plug into various stages within the main auction workflow and can affect any part of the request or response.
1. Privacy Modules - these are more limited, plugging into the [Activity Controls](/prebid-server/features/pbs-activitycontrols.html) system to delegate decisions about potentially privacy-sensitive scenarios.

The full list of modules:

{: .table .table-bordered .table-striped }
| Module              | Description  | Type | PBS-Go | PBS-Java |
|---------------------+--------------+------+--------+----------|
| [**ORTB2 Blocking**](/prebid-server/pbs-modules/ortb2-blocking.html) | Support bidders that aren't full-service SSPs. | general | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**Confiant Ad Quality**](/prebid-server/pbs-modules/confiant-ad-quality.html) | Scans bid responses for security and quality issues. | general | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**US Gen Privacy**](/prebid-server/features/pbs-usgen.html) | Links with the [Activity Controls](/prebid-server/features/pbs-activitycontrols.html) to process GPP strings to determine whether an activity should be allowed. | privacy | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**US Custom Logic Privacy**](/prebid-server/features/pbs-uscustomlogic.html) | Similar to the `US Gen Privacy` module, but publishers define their own interpretation of the GPP string. | privacy | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**Richmedia Filter**](/prebid-server/pbs-modules/richmedia.html) | Can filter MRAID creatives from the bid stream. | validation | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**51Degrees Device Detection**](/prebid-server/pbs-modules/51degrees-device-detection.html) | Enriches an incoming OpenRTB request with [51Degrees Device Data](https://51degrees.com/documentation/_device_detection__overview.html) | general | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**Greenbids Real Time Data**](/prebid-server/pbs-modules/greenbids-real-time-data.html) | Filters out bidders that are not expected to bid on this request, saving money and carbon. | general | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**Request Correction**](/prebid-server/pbs-modules/request-correction.html) | Apply optional corrections to bid requests. | general | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |
| [**Response Correction**](/prebid-server/pbs-modules/response-correction.html) | Apply optional corrections to bid responses. | general | | <img alt="check" src="/assets/images/icons/icon-check-green.png" width="30"> |

## Installing a PBS General Module

Once a Prebid Server host company decides which modules they want to support,
here's how installation works:

### 1. Build PBS with modules

Note that modules are currently an all-or-nothing nothing from a code perspective.

```bash
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

```yaml
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

{: .alert.alert-info :}
Execution plans may be placed in account configuration, but depending on how modules are enabled in your environment, it can be inconvenient to provide instructions to place the highly technical execution plan into the account config. Some organizations have chosen to keep all execution plans in host-level config, then enabling the `require-config-to-invoke` option as described in the next section.

{: .alert.alert-warning :}
Note that if there is more than one execution plan (e.g. one the host level and one the account level) all of them will be triggered and the module invoked processed several times. 

### 3. Supply the module with configuration

Modules may require configuration at startup or during the request:

- If the module requires config at initialization, its documentation will
describe where the config file lives and what format it should take.
- If the module requires runtime config, it should be passed via the account-config mechanism.

### 3.1 Module Execution Configuration

PBS-Java 3.16 introduced new configurations that give the host company flexible control over which modules run for which accounts
while still allowing all execution plans to be defined at the host-level.

- `hooks.admin.module-execution` is a key-value map, where a key is a module name and a value is a boolean. It defines whether a module's hooks should be executed.
This property can be configured on the host level at initialization as well as via account-config mechanism (a runtime config).
- `settings.modules.require-config-to-invoke` is a host-level boolean property. When set to `true`, it requires a runtime config to exist for a module in order to actually run the execution plan.

Here's how these work together:

1. If `hooks.admin.module-execution` is defined at the host-level (application.yaml), it overrides all account config. No account can turn off a module flagged as true, and likewise they can’t turn on a module flagged as false.
1. Essentially, setting false at the host level has the same effect as removing the module’s execution plan.
1. If `hooks.admin.module-execution` is not defined at the host level, then normal precedence rules are in effect: any value in account config overrides what’s in default account config.
1. If nothing is found for the module in the merged `hooks.admin.module-execution` and `require-config-to-invoke` is true, then account-level config is required.

Example:

```yaml
# host-level config
settings:
  modules:
    require-config-to-invoke: true
hooks:
  admin:
    host-execution-plan: >
      {"endpoints":{... define execution plans for module1, module3, and module4 here ...}}
    module-execution:
      module1: true         // don't allow accounts to turn off this module. Also don't worry about requiring config. Always run this one.
      module2: false        // don't allow accounts to utilize this module at all, even if they define a plan in account config.
```

```json
// account-level config
// the end result is that module1, module3, and module5 are run.
// module2 is not run even though a plan is defined in this account config because the host company has forbidden it above
// module4 is not run because there's no config and require-config-to-invoke is true
{
  "hooks": {
    "admin": {
      "module-execution": {
        "module1": false    // does nothing, since module1 is always on at the host level
      }
    },
    "modules": {
      "module3": { ... module 3 config ... },
      "module5": { ... module 5 config ... },
    },
    "execution-plan": {
       ... define an execution plan for module2 and module5 here ...
    }
  }
}
```

### 3.2 A/B Testing Modules

Host companies and accounts might want to try enabling a module on a small percentage of traffic before turning it on all the way.

PBS-Java 3.16 introduced a new A/B testing framework that applies to any module. 

```json5
{
    "hooks": {
        "execution-plan": {
           "abtests": [{
              "accounts": [ 123, 456 ],                 // these are ignored if in account-level config
              "module-code": "module1",
              "enabled": true,                          // defaults to false
              "percent-active": 5,                      // defaults to 100
              "log-analytics-tag": true                 // defaults to true
            },{
               ... abtest config for other modules ...
            }],
            "endpoints": {
              ...
            }
        }
     }
}
```

{: .alert.alert-info :}
If the execution plans defined at the default account level are acceptable, but a specific account wants to test a module,
just add the `hooks.execution-plan.abtests` object and then `hooks.execution-plan.endpoints: {}`. The empty `endpoints` object will be merged
at runtime with the account default. Leaving the account-specific endpoints completely empty will result in an error.

These are the parameters accepted within the `abtests` object:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Description | Type | Default |
|-----------+-------+-------------+------+---------|
| module-code | required | Which module is being tested. | string | none |
| percent-active | required | What percent of the time the module will run. | integer | none |
| accounts | optional | Defines which accounts this abtest block applies to. This is useful when the execution plan is defined at the host level and is ignored when the plan is at the account level. | array of int | none |
| enabled | optional | Allows the abtest to be disabled without removing it. | boolean | true |
| log-analytics-tag | optional | Directs PBS-core to log an analytics tag for reporting. | boolean | false |

To get reporting on the test results, analytics adapters will need to read the [analytics tag](/prebid-server/developers/module-atags.html) created by the A/B test, which looks like this:

```json5
{
   activities: [{
     name: "core-module-abtests",
     status: "success",
     results: [{                      // one results object for each module in the abtests object
         "status": STATUS,            // "run" or "skipped"
         "values": {
             "module": "module1"
         }
     }]
  },
          ... the status of other abtest decisions ...
  }]
}
```

## Installing a PBS Privacy Module

Privacy modules are already built into the code base. They just need to be linked to the
relevant 'Activity' using the `privacyreg` directive as described in the [Activity Control reference](/prebid-server/features/pbs-activitycontrols.html).

## Further Reading

- [Developing a Prebid Server General Module](/prebid-server/developers/add-a-module.html)
- [Developing a Prebid Server Privacy Module](/prebid-server/developers/add-a-privacy-module.html)
- [Prebid Server Features](/prebid-server/features/pbs-feature-idx.html)
