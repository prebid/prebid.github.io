---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Module Analytics Tags Conventions
sidebar_entry: /prebid-server/developers/add-a-module.html
---

# Prebid Server - Module Analytics Tags Conventions
{: .no_toc}

- TOC
{:toc }

## Overview

Analytics Tags (aka ‘aTags’) are a log mechanism provided by PBS-core to allow modules
to inform analytics adapters about what happened in the request.
Use of the Analytics Tag structure is completely optional. It's meant
to be used when there are application or reporting reasons for sharing module results.
See the [Prebid Server module overview](/prebid-server/developers/add-a-module.html) for background information.

This document defines a convention aimed at allowing module developers to create
consistent aTags that can be easily read by analytics adapters.

![Prebid Server aTags](/assets/images/prebid-server/module-atags.png){:class="pb-xlg-img"}

1. Modules may return a data structure containing aTags to PBS-Core.
2. PBS-Core adds any aTags to the 'invocation context' data structure.
3. Analytics modules have access to the invocation context.

## Analytics Tag Conventions

The general idea is that aTags are a list of module-specific "activities" that have these attributes:

- activity name: should be unique within the context of this module. e.g. 'enrich-request'
- an overall status
- an array of specific results within the activity
- within the results:
  - status of each result
  - scope of the result
  - module-specific values for the result

Here's an example from the [ORTB2 Blocking module](/prebid-server/pbs-modules/ortb2-blocking.html):

```json
[{
   // scenario: response from bidderA blocked on badv for imp=1
   activities: [{
    name: "enforce-blocking",
    status: "success", // no errors from the module
    results: [{
        status: "success-block",
        values: { // these are module-specific details about the result
                  "attributes": ["badv"],
                  "adomain": ["bad.com"]
        },
        appliedto: {
          "bidder": "bidderA",
           impids: ["1"]
        }
    },{
        status: "success-allow",
        // no details needed when the response isn't blocked
        appliedto: {
          "bidder": "bidderA",
          "impids": ["2","3","4"]
        }
    }]
 }]
```

The following table contains the field conventions.

{: .table .table-bordered .table-striped }
| aTag Attr | Required? | Description | Type |
|---+---+---+---|
| activities | yes | One or more activities carried out by the module. | array of objects |
| activities .name | yes | Name of the activity. Must be documented and unique within the module. | string |
| activities .status | yes | Did the module operate successfully? Values are "error" or "success". | string |
| activities. results | no | Service-dependent details for what the service actually did. | array of objects |
| activities. results. status | no | Detailed status for this specific action. Values: "error", "success-allow", "success-block", "success-modify" | string |
| activities. results. values | no | service-specific details | object |
| activities. results .appliedto | no | Which object(s) the service examined or modified. | object |
| activities. results. appliedto. impids | no | The service examined these specific impression objects or bid responses corresponding to imp objects | array of strings |
| activities. results. appliedto. bidders | no | The service examined these specific bidders within the request or response. | array of strings |
| activities. results. appliedto. bidder | no | The service examined this specific bidder (singular) within the request or response. | string |
| activities. results. appliedto. request | no | The service examined the entire openrtb request object. This is in case the module updated something not adunit-specific. | boolean |
| activities. results. appliedto. response | no | The service examined the entire openrtb response object. This is in case the module updated something not adunit-specific. | boolean |

## Designing Analytics Tags

aTags are for reporting. Start by considering what the module's doing that consumers might want to display. Each processing stage the module operates in may be
reported as a separate activity, or perhaps everything the module does is lumped
as one activity.

Once the activities are defined, determine what reportable metric would be useful. Examples:

- percentage of impressions enriched
- percentage of imps where a specific bidder was removed due to optimization
- A/B testing data
- percentage and value of bid responses that were rejected due to creative validations

{: .alert.alert-info :}
**Case study:** for the ORTB2 Blocking module, the requirement was to be able
to report on what percentage of responses from each bidder were being thrown
away due to blocking rules. This could have been done by defining a separate 'activity' for each of the 4 types of enforcement, but it was decided
to just have one kind of activity ('enforce-blocking') and get the specific
details as part of the 'value'. There was no requirement to report on the 
outbound part of what the module does, so no aTags are created for that part
of the functionality.

Once you know what reports are desired, figure out which activity 'results'
are needed to generate those numbers.

{: .alert.alert-info :}
For the ORTB2 Blocking module, the numbers needed are how often a given
bidder has a response compared to how often their responses are rejected.
So overall the block rate is: successBlock divided by (successBlock + successAllow).

## Document the Analytics Tags Produced

Be sure to detail the results in your module documentation so that analytics adapters are
aware of what they can look for.

Let them know:

- which activities your module supports
- what kind of results to expect
- whether the results objects have module-specific `values`

## Parsing the Invocation Context

If you're an analytics adapter, you will be given the entire PBS 'invocation context', which contains a wealth of information about the auction.

In short, to get analytics tags, you'll need to parse this data structure:

- Loop through stages[]
  - If the stage has relevant info, loop through outcomes[]
    - Outcomes.entity is a label describing the contents
    - Loop through groups[]
      - Loop through invocationresults[]
        - if `hookid.modulecode` is relevant for your analytics, grab `analyticstags`

Here's an example of the data structured as JSON, though the details
of the actual object will differ in PBS-Java and PBS-Go.

```json
          "stages": [
            {
              "stage": "raw-auction-request",
              "outcomes": [
                {
                  "entity": "bidrequest",
                  "executiontimemillis": 246,
                  "groups": [
                    {
                      "executiontimemillis": 190,
                      "invocationresults": [
                        {
                          "hookid": {
                            "modulecode": "MODULE1",
                            "hookimplcode": "HOOK_A"
                          },
                          "executiontimemillis": 123,
                          "status": "success",
                          "action": "update",
                          "debugmessages": [
                            "debug message"
                          ],
                         "analyticstags": {
                            "activities": [
                              {
                                "name": "device-id",
                                "status": "success",
                                "results": [
                                  {
                                    "status": "success",
                                    "values": {
                                      "some-field": "some-value"
                                    },
                                    "appliedto": {
                                      "impids": [ "impId1" ]
                                    }
                                  }
                                ]
                              }
                            ]
                          }
                        },
                        {
                          "hookid": {
                            "modulecode": "MODULE1",
                            "hookimplcode": "HOOK_B"
                          },
                          "status": "success",
                          "message": "inventory has no value",
                          "action": "reject"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "stage": "bidder-request",
              "outcomes": [
                {
                  "entity": "pubmatic", // entity is biddercode for some stages
                  "executiontimemillis": 246,
                  "groups": [
                    "invocationresults": {
                      "hookid": { ... }
                      "analyticstags": [{
            ...
                      ]
                    }
                  ]
                },
                {
                  "entity": "adform",
                  "executiontimemillis": 246,
                  "groups": [...]
                }
              ]
            }
          ]
```

See the implementation guide for your platform for specific syntax.

## Sending aTags to the client-side

{: .alert.alert-info :}
PBS-Java only

The use cases for server-side and client-side analytics are different:

- Server-side analytics are the only game in town when it comes to App, AMP, DOOH, etc.
- However, when Prebid.js is in use and bidders are split between client-side and server-side, it would be far better if auctions were only logged once.

This feature allows all relevant data passed to the client from Prebid Server so that client-side analytics can be the one to log the results.
To allow the sharing of these details, there are two conditions:

1. Server-side account configuration must allow sharing of these details by setting `analytics.allow-client-details: true`
1. The ORTB request must contain `ext.prebid.analytics.options.enableclientdetails: true`

If both are true, then any and all PBS analytics tags will be copied to the response field ext.prebid.analytics.tags.

### Client aTag example

The "pb-ortb-blocking" module at the "processed auction" stage adds the following Analytics Tags (from the ORTB2 blocking module)

```json
[{
   activities: [{
    name: "enforce-blocking",
    status: "success",
    results: [{
        status: "success-block",
        values: {
                  "attributes": ["badv"],
                  "adomain": ["bad.com"]
        },
        appliedto: {
          "bidder": "bidderA",
           impids: ["1"]
        }
    },{
        status: "success-allow",
        appliedto: {
          "bidder": "bidderA",
          "impids": ["2","3","4"]
        }
    }]
 }]
```

Also, the "vendorA-brand-safety" module at the "all processed bid responses" stage adds these aTags:

```json
[{
   "activities": [{
    "name": "brand-safety",
    "status": "success",
    "results": [{
        "status": "success-allow",
        "appliedto": {
          "bidder": "bidderA",
          "impids": ["1,","2","3","4"]
        }
    }]
 }]
```

The resulting response with the request ext.prebid.analytics.options.enableclientdetails: true and config analytics.options.enableclientdetails:true would be:

```json5
// this is actually a nested object - but aggregated for readablility
"ext.prebid.analytics.tags": [{
  "stage": "processed-auction-request",
  "module": "pb-ortb-blocking",
  "analyticstags": [{
     "activities": [{
      "name": "enforce-blocking",
      "status": "success",
      "results": [{
        "status": "success-block",
        "values": {
                  "attributes": ["badv"],
                  "adomain": ["bad.com"]
        },
        "appliedto": {
          "bidder": "bidderA",
           "impids": ["1"]
        }
    },{
        "status": "success-allow",
        "appliedto": {
          "bidder": "bidderA",
          "impids": ["2","3","4"]
        }
    }]
 }]
},{
  "stage": "all-processed-bid-responses",
  "module": "vendorA-brand-safety",
  "analyticstags": [{
   "activities": [{
    "name": "brand-safety",
    "status": "success",
    "results": [{
        "status": "success-allow",
        "appliedto": {
          "bidder": "bidderA",
          "impids": ["1,","2","3","4"]
        }
    }]
}]
```

It's up to the client-side analytics adapters to be able to parse the module-specific contents of the aTags.

## Further Reading

- [PBS Module Overview](/prebid-server/developers/add-a-module.html)
- [PBS Module Implementation](/prebid-server/developers/add-a-module.html)
