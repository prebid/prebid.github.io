---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a Go Module

---

# Prebid Server - Adding a Go Module
{: .no_toc}

* TOC
{:toc }

## Overview

This document details how to make a module for PBS-Go.

You will want to be familiar with the following background information:

- the [module overview](/prebid-server/developers/add-a-module.html) 
- the [PBS-Go Modularity Tech Spec](https://docs.google.com/document/d/1CmamniQpwcI3p0_rHe2F17zV4sEhzpOdrqU7zuZVZ_I/edit?usp=sharing)

### Contributing

Check out the [PBS-Go contribution guide](https://github.com/prebid/prebid-server/blob/master/docs/developers/contributing.md) before introducing any code changes.

## Module Directory Layout

The Prebid Server repository contains a package `modules` located in the root project directory. It includes all available PBS modules. So, in order to add a new module, fork the repository and create a folder with the desired name inside the `modules` folder with the following structure:

```
+- prebid-server/
  +- modules/                <- package with modules that implement various hooks
    +- builder.go            <- contains a list of all available modules
    +- {YOUR_VENDOR_NAME}/   <- top-level package used to group modules from the same vendor
      +- {YOUR_MODULE_NAME}/ <- package with source code of your module
        +- module.go         <- file with module initialization function
```
Module directory names (`{YOUR_VENDOR_NAME}/YOUR_MODULE_NAME/}`) must consist of valid identifiers.
A valid identifier is defined as a sequence of one or more letters, including an underscore character (`_`), and digits.
All other symbols such as `-`, `.`, etc. are not permitted.

### Your module's build file

Here's a partial example of your module-specific `module.go` file:

```
package your_module_name

import (
    "context"
    "encoding/json"

    "github.com/prebid/prebid-server/hooks/hookstage"
    "github.com/prebid/prebid-server/modules/moduledeps"
)

func Builder(config json.RawMessage, deps moduledeps.ModuleDeps) (interface{}, error) {
    return Module{}, nil
}

// Module must implement at least 1 hook interface.
type Module struct{}

func (m Module) HandleBidderRequestHook(
    ctx context.Context,
    invocationCtx hookstage.ModuleInvocationContext,
    payload hookstage.BidderRequestPayload,
) (hookstage.HookResult[hookstage.BidderRequestPayload], error) {
    result := hookstage.HookResult[hookstage.BidderRequestPayload]{}

    // hook handling logic
    
    return result, nil
}
```

In the example above, our module only implements the `bidder-request` hook interface.

The module's `Builder` function receives 2 arguments:
1. `config json.RawMessage` - represents a global config of your module, see [Configuration](#configuration).
2. `deps moduledeps.ModuleDeps` - contains dependencies that your module might require.

and returns 2 values:
1. `interface{}` - must implement at least 1 hook interface, see [hooks](#hook-interfaces). PBS uses type assertion to find out which hook interfaces implemented by module.
2. `error` - any error occurred during module initialization.

### Expose your module to PBS

All available modules are exposed through the `modules/builder.go` file. This file is auto-generated, so you shouldn’t edit it manually.

To register a new module, you just need to run one of the following commands from the PBS root directory:
 - `make build-modules`
 - or `go generate modules/modules.go`

This command scans the `modules/` directory for files matching the pattern `modules/*/*/module.go` and adds all matching packages to the `modules/builder.go` file.

## Module Code

The quick start is to take a look in two places:
- the [prebid ortb2blocking module](https://github.com/prebid/prebid-server/tree/master/modules/prebid/ortb2blocking)
- the [hook source code and tests](https://github.com/prebid/prebid-server/tree/master/hooks)

### Adding module documentation
It is required to add a "README.md" file to the root of your module folder. It's recommended to specify the description of what the implemented module does, links to external documentation and include maintainer contact info (email, slack, etc).

The documentation must also live on the docs.prebid.org site. Please add a markdown file to https://github.com/prebid/prebid.github.io/tree/master/prebid-server/pbs-modules

### Hook Interfaces

The Prebid server processing workflow is divided into several 'stages' where module authors can inject a specific function signature called a 'hook'.

The Prebid Server host company will define which modules to run in which order by setting up a configuration defining which hooks run serially and which can run in parallel.

The supported stages are described in the [general module overview](/prebid-server/developers/add-a-module.html#2-understand-the-endpoints-and-stages) and in PBS-Core source code at the "github.com/prebid/prebid-server/hooks" package.

These are the available hooks that can be implemented in a module:

- github.com/prebid/prebid-server/hooks/hookstage.Entrypoint
- github.com/prebid/prebid-server/hooks/hookstage.RawAuctionRequest
- github.com/prebid/prebid-server/hooks/hookstage.ProcessedAuctionRequest
- github.com/prebid/prebid-server/hooks/hookstage.BidderRequest
- github.com/prebid/prebid-server/hooks/hookstage.RawBidderResponse
- github.com/prebid/prebid-server/hooks/hookstage.AllProcessedBidResponses
- github.com/prebid/prebid-server/hooks/hookstage.AuctionResponse

In a module it is not necessary to implement all mentioned interfaces but at least one is required by your functionality.

### Examples

1. To **update** the request in the `BidderRequest`, your implementation would return a hook result with a change set:

    ```go
    import (
        "context"

        "github.com/prebid/prebid-server/hooks/hookstage"
    )

    type Module struct{}

    func (m Module) HandleBidderRequestHook(
        ctx context.Context,
        invocationCtx hookstage.ModuleInvocationContext,
        payload hookstage.BidderRequestPayload,
    ) (hookstage.HookResult[hookstage.BidderRequestPayload], error) {
        changeSet := hookstage.ChangeSet[hookstage.BidderRequestPayload]{}
        changeSet.BidderRequest().BAdv().Update([]string{"a.com"})
        
        return hookstage.HookResult[hookstage.BidderRequestPayload]{ChangeSet: changeSet}, nil
    }
    ```

    Please note, the `hookstage.ChangeSet` has a restricted set of methods, but methods can be easily extended when more use cases come up.

    For more complex payload updates, you can choose another method:

    ```go
    func (m Module) HandleBidderRequestHook(
        ctx context.Context,
        invocationCtx hookstage.ModuleInvocationContext,
        payload hookstage.BidderRequestPayload,
    ) (hookstage.HookResult[hookstage.BidderRequestPayload], error) {
        battrByImp := map[string][]adcom1.CreativeAttribute{"imp_ID1": []adcom1.CreativeAttribute{adcom1.AttrAudioAuto}}
        changeSet := hookstage.ChangeSet[hookstage.BidderRequestPayload]{}
        changeSet.AddMutation(func(payload hookstage.BidderRequestPayload) (hookstage.BidderRequestPayload, error) {
            for i, imp := range payload.BidRequest.Imp {
                if battr, ok := battrByImp[imp.ID]; ok {
                    imp.Banner.BAttr = battr
                    payload.BidRequest.Imp[i] = imp
                }
            }
            return payload, nil
        }, hookstage.MutationUpdate, "bidrequest", "imp", "banner", "battr")
        
        return hookstage.HookResult[hookstage.BidderRequestPayload]{ChangeSet: changeSet}, nil
    }
    ```

2. To **reject** the bidder in the `BidderRequest`, your hook implementation would return a hook result with a reject flag and an NBR code:

    ```go
    func (m Module) HandleBidderRequestHook(
        ctx context.Context,
        invocationCtx hookstage.ModuleInvocationContext,
        payload hookstage.BidderRequestPayload,
    ) (hookstage.HookResult[hookstage.BidderRequestPayload], error) {
        return hookstage.HookResult[hookstage.BidderRequestPayload]{Reject: true, NbrCode: 7}, nil
    }
    ```

    Refer [here](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/OpenRTB%20v3.0%20FINAL.md#list--no-bid-reason-codes-) for a list of available No Bid Response Codes.

3. To supply [analytics tags](/prebid-server/developers/module-atags.html) in the `BidderRequest`, your hook implementation would return a hook result with analytics tags:

    ```go
    import (
        "context"

        "github.com/prebid/prebid-server/hooks/hookstage"
        "github.com/prebid/prebid-server/hooks/hookanalytics"
    )

    func (m Module) HandleBidderRequestHook(
        ctx context.Context,
        invocationCtx hookstage.ModuleInvocationContext,
        payload hookstage.BidderRequestPayload,
    ) (hookstage.HookResult[hookstage.BidderRequestPayload], error) {
        return hookstage.HookResult[hookstage.BidderRequestPayload]{
            AnalyticsTags: hookanalytics.Analytics{
                Activities: []hookanalytics.Activity{
                    {
                        Name:   "enforce_blocking",
                        Status: hookanalytics.ActivityStatusSuccess,
                        Results: []hookanalytics.Result{
                            {
                                Status: hookanalytics.ResultStatusBlock,
                                Values: map[string]interface{}{
                                    "attributes": []string{"bcat"},
                                    "bcat":       []string{"IAB-1"},
                                },
                                AppliedTo: hookanalytics.AppliedTo{Bidder: "appnexus", ImpIds: []string{"imp_ID1"}},
                            },
                            {
                                Status:    hookanalytics.ResultStatusAllow,
                                AppliedTo: hookanalytics.AppliedTo{Bidder: "appnexus", ImpIds: []string{"imp_ID2"}},
                            },
                        },
                    },
                },
            },
        }, nil
    }
    ```

More test implementations for each hook can be found in unit-tests at [github.com/prebid/prebid-server/tree/master/modules/prebid/ortb2blocking](https://github.com/prebid/prebid-server/tree/master/modules/prebid/ortb2blocking) folder.

### Configuration

It's possible to define default module configuration which can be read by the module at PBS startup. An example configuration for hooks might look like this:
```json
{
  "hooks": {
    "enabled": true,
    "modules": {
      "vendor1": {
        "module1": {
          "enabled": true
        }
      }
    },
    "host_execution_plan": {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "bidder_request": {
              "groups": [
                {
                  "timeout": 10,
                  "hook_sequence": [
                    {
                      "module_code": "vendor1.module1",
                      "hook_impl_code": "code123"
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

### Testing

Unit tests are required. Each implemented hook must be at least 90% covered by unit tests.

### How to build and install a module

Read about the module building in the [building section](https://docs.google.com/document/d/1CmamniQpwcI3p0_rHe2F17zV4sEhzpOdrqU7zuZVZ_I/edit#heading=h.o8dv0neoq4xm) of the technical specification.

## Analytics Adapters and Modules

Each module can inject analytics tags into the request as described in the analytics tags section.

Analytics adapters receive these tags through the Auction/AMP analytic object.

To get analytics tags you need to go into:

```
AuctionObject/AmpObject 
  -> HookExecutionOutcome (iterate through stages)
    -> Groups (iterate through groups)
      -> InvocationResults (go through hooks invocation results and find interested one)
        -> AnalyticsTags
```

The `AnalyticsTags` object has activities with collection of `github.com/prebid/prebid-server/hooks/hookanalytics.Result` objects inside. Each `Result` has the `Values` field which holds arbitrary values set by a module. 

It depends on the particular module implementation how to parse their analytics tags, since the internal structure is custom and depends on the module. Therefore, analytics modules that want to report on specific behavior need to be coded to know about that module. See the prebid ortb2blocking module for an example of what analytics tags may be available.

## Further Reading

- [PBS Module Overview](/prebid-server/developers/add-a-module.html)
- [PBS Module Analytics Tags Conventions](/prebid-server/developers/module-atags.html)
