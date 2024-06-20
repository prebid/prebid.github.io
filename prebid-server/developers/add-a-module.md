---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a Module
---

# Prebid Server - Adding a Module
{: .no_toc}

This document guides you through the process of developing a module for host companies to plug into their instance of Prebid Server.
We encourage you to look at existing modules for working examples. You can also ask us questions by [submitting a GitHub issue](https://github.com/prebid/prebid-server/issues/new).

- TOC
{:toc }

## Overview

The ability to add optional modules in [Prebid.js](/prebid/prebidjs.html) has been widely used,
with dozens of interesting features forming a healthy ecosystem of vendor choice that's good for publishers and the industry.

Prebid Server supports a rich module interface that
allows anyone to contribute functionality at predefined places
along the request pipeline. Here's the general development process:

1. The module writer designs the feature, then optionally posts it as an [issue](https://github.com/prebid/prebid-server/issues) for community feedback.
1. They then code the module and unit tests and write user documentation.
1. Code, tests, and documentation are submitted to the Prebid Server team for review.
1. Once accepted, Prebid Server Host companies may choose to activate the new module for their publishers.
1. Publishers can utilize the feature, doing any required account setup described in the module documentation.

The first module written was the ORTB2 Blocking module. Example ideas for future modules include creative validation and traffic quality.
If you have an idea for a module that's not feasible (e.g. a new endpoint), open [an issue](https://github.com/prebid/prebid-server/issues) with a detailed description of what you're looking to do.

### Terminology

- **PBS**: short for **P**re**b**id **S**erver
- **PBS-core**: The inner workings of Prebid Server -- not part of a module, bid adpater, or analytics adapter
- **PBS-Java**: the Java version of Prebid Server
- **PBS-Go**: the Go-Lang version of Prebid Server
- **Host Company**: the entity running the PBS cluster, e.g. one of the ones on [this list](https://prebid.org/product-suite/managed-services/).
- **Module**: a coherent feature set that plugs into Prebid Server with its own configuration.
- **Stage**: a place in the Prebid Server process flow from which a module can be invoked.
- **Hook**: a function in the module code that executes at a given stage with a particular function signature. 
- **Endpoint**: an externally-visible service that responds to web requests. e.g. /openrtb2/auction, /cookie-sync.
- **Analytics Tags**: a mechanism for a module to inform other modules of what it has encountered or changed.

## Planning Your Module

### 1. Review the Module Rules

There are a number of things modules are not allowed to do
without disclosing prominently on their documentation. Please review
the [Module Rules](/dev-docs/module-rules.html) page. Here are some highlights:

- a module can't add pixels to the creative without disclosure
- every module must obey privacy regulations: TCF-EU, CCPA, COPPA, USNat, TCF-CA, etc.
- modules cannot create new bids. That is reserved for bid adapters.
- modules must be configurable to make data available to all bidders. i.e. you can't make a module that works always and forever with just one bidder without prominent disclosure.

### 2. Understand the Endpoints and Stages

Here's a description of the Stages of a PBS request that modules can tap into for each supported endpoint:

{: .table .table-bordered .table-striped }
| Stage | Description | Endpoints | Example Use Cases |
|-------------+-------------+-------+-----|
| Entrypoint | Hook functions can see the raw request before PBS has processed or validated anything | auction, amp, video | A/B testing of account parameters, Alternate account validation, AMP pre-processing |
| Raw Auction Request | Validations have been done, but no enrichments | auction, amp, video | A/B testing of StoredRequests, Advanced device detection, Traffic Quality |
| Processed Auction Request | Any stored requests have been merged in and all PBS enrichments are done | auction, amp, video | Inject First Party Data, Channel determination, Bid floors, Bidder optimization |
| Bidder Request | The request has been customized for a particular bidder in the auction | auction, amp, video | Bidder-specific bcat/badv, Bidder-specific deals |
| Raw Bidder Response | Hook functions can get access to the unprocessed bidder response | auction, amp, video | Response validations |
| All Processed Bid Responses | All bids are back and PBS-core bid validations are done. | auction, amp, video | Creative validation, advanced bid validations. |
| Auction Response | Last step before the response goes back to the client | auction, amp, video | Inject ad server targeting, alternate auction winner logic |

### 3. Figure Out Which Stages You're Going to Hook Into

A module may be comprised of:

- init and hook functions that are called by Prebid Server
- internal functions and state
- optional external connections to data sources or other services

Some modules may plug into only one endpoint and one stage of processing. Others may coordinate activity across multiple stages. For example,
this diagram illustrates the design of a module that's rather extremely configured to plug into all of the stages of
the processing workflow:

![Prebid Server Modularity Architecture](/assets/images/prebid-server/module-example.png){:class="pb-xlg-img"}

### 4. Module Hook Actions: Read, Change and/or Reject

There are a few basic ways a module's hook function can respond to PBS-core:

- inspect the request/response
- change the request by adding a new field to the request/response or updating an existing field
- instruct PBS-core to reject the request or response entirely

The amount of time your module takes to perform its actions will be limited
by PBS-core. For example, if a creative validation module needs to 'phone home'
to analyze the bid creative, it will have a tight window of a few milliseconds
to get the response and apply it. Your documentation can request how long
the module needs, but keep in mind that PBS host companies may not use your
module if it leads to an increased rate in header bidding timeouts.

### 5. Determine what Should be Configurable

There are two sources of configuration for each module:

#### 5.1. Initialization Config

When Prebid Server starts up, it can be configured to initialize
modules supported by the Host Company. This start up config should contain
values that are constant across requests. e.g.:

- URLs for external services
- host-company specific settings like cache sizes, installation ID, global timeout, other defaults

Values in this config can only change with a bounce of Prebid Server.

#### 5.2. Runtime Config

For each user request, modules can have account-specific
configuration stored in the account-config data source. This configuration
is used to store parameters that could vary for different publishers 
utilizing this PBS instance. e.g.:

- publisher account ID
- application config (e.g. 'blocked advertisers')
- publisher timeout override

### 6. Consider Storage Needs

If your module will require state of some sort beyond configurtaion, you'll have to provide instructions
to the PBS host company. Examples:

- a module could require a No-SQL endpoint that's populated at init and refreshed periodically
- modules may require a local SQL DB populated with application data
- some modules may require access to local disk to read a security certificate

### 7. Identify Sensitive Data Usage

If your module either utilizes or supplies user-level data like User First Party Data or precise geographic information, it must adhere to the framework supplied by the [Activity Controls](/prebid-server/features/pbs-activitycontrols.html).

For instance:
- if your module is going to supply user-level data (e.g. "job title") to bid adapters, it must check permissions for the `enrichUfpd` activity.
- if your module is going to forward the entire ORTB request to an endpoint, it must check the `transmitUfpd` and `transmitPreciseGeo` activity permissions.

The details about how exactly to code this differs by platform. See the developer docs for Go and Java linked below.

### 8. Think about Analytics Tags

Analytics Tags (aka 'ATags') are a log mechanism provided by PBS-core to inform downstream
modules about what's happened in the request so far. Use of the Analytics Tag structure
is completely optional, but there may be application or reporting reasons for sharing
the results. Examples:

- The [ORTB2 Blocking module](/prebid-server/pbs-modules/ortb2-blocking.html) creates ATags informing analytics adapters that
a bid response was inspected and/or blocked for violating a publisher-defined
rule like advertiser domains. This data can be used to alert the analytics users
that a given bidder is losing bid opportunities by not adhering to the auction parameters.
- A bid optimization module could inform analytics how many times it dropped a bidder from an auction for various reasons. e.g. "dropped this bidder X% of the time due to geographic reasons, Y% of the time due to session length.

See the [Module Analytics Tag Conventions](/prebid-server/developers/module-atags.html) for more specific details
about how to format ATags.

### 9. Write the Code, Config, and Unit Tests

The details of the implementation depend on the platform.

- PBS-Java: see [Adding a PBS-Java module](/prebid-server/developers/add-a-module-java.html)
- PBS-Go: see [Adding a PBS-Go module](/prebid-server/developers/add-a-module-go.html)

Other rules for open source PBS pull request:

- Unit test coverage must exceed 90%.
- A maintainer email address must be provided and be a group, not an individual. e.g. "support@example.com rather than jsmith@example.com

### 10. Write the Module Documentation

Fork the [documentation repo](https://github.com/prebid/prebid.github.io) and
create a file in /prebid-server/pbs-modules. You can start by copying one of the existing files. It should contain:

- A description of the module functionality: why people might be interested in using it.
- Prerequisites: any necessary account activation, other required modules, etc.
- Configuration: both init and runtime
- Analytics Tag support
- Privacy Support: disclose whether the module has user privacy implications and support for TCF-EU, TCF-CA, CCPA, etc.

### 11. Submit the Pull Requests

When everthing checks out on your dev environment, submit the PRs for review.

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [PBS Module Analytics Tags Conventions](/prebid-server/developers/module-atags.html)
- [PBS Activity Controls](/prebid-server/features/pbs-activitycontrols.html)
