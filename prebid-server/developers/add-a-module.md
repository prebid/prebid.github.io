---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a Module

---

# Prebid Server - Adding a Module
{: .no_toc}

Thank you for contributing a bid adapter to the open source Prebid Server project. Each new adapter gives publishers more options for monetizing their inventory and strengthens the header bidding community.

This document guides you through the process of developing a module for host companies to plug into Prebid Server. We encourage you to look at [existing modules](GITHUB-LINK) for working examples. You can also ask us questions by [submitting a GitHub issue](https://github.com/prebid/prebid-server/issues/new).

{: .alert.alert-info :}
**NOTE:** Modules are currently only supported in [PBS-Java](https://github.com/prebid/prebid-server-java).


* TOC
{:toc }

## Overview

The ability to add optional modules in Prebid.js has been widely used,
with dozens of interesting features forming a healthy ecosystem of vendor choice that's good for publishers and the industry.

Prebid Server (Java) now supports a rich module interface that
allows anyone to contribute functionality at predefined places
along the request pipeline. Here's the general development process:

1. The module-writer plans out which "hooks" will be used in the feature and codes up the module and unit tests.
1. The module-writer creates user documentation.
1. Code, tests, and documentation are submitted to the Prebid Server team for review.
1. Once accepted, Prebid Server Host Companies may choose to activate the new module for their publishers.
1. Publishers can utilize the feature, doing any required account setup described in the module documentation.

The first module written was the ORTB2 Blocking module. Example ideas for future modules are creative validation and traffic quality, which are
possible with this framework. If you have an idea for a module that's not feasible (e.g. a new endpoint), open [an issue](https://github.com/prebid/prebid-server/issues) with a detailed description of what you're looking to do.

### Terminology

- PBS: Prebid Server
- PBS-Java: the Java version of Prebid Server
- PBS-Go: the Go-Lang version of Prebid Server (doesn't currently support modules)
- Host Company: the entity running the PBS cluster, e.g. one of the ones on [this list](https://prebid.org/product-suite/managed-services/).
- Module: a coherent feature set that plugs into Prebid Server with its own configuration.
- Stage: a place in the Prebid Server process flow from which a module can be invoked. A given module may utilize one or more hooks.
- Hook: a function with module code that executes at a given stage with a particular function signature.
- Endpoint: an externally-visible service that responds to web requests. e.g. /openrtb2/auction, /cookie-sync.
- Analytics Tags: a mechanism for a module to inform other modules of what it has encountered or changed.

## Planning Your Module

### 1. Review the Module Rules

There are a number of things modules are not allowed to do, or at least not
allowed to do without disclosing prominently on documentation. Please review
the [Module Rules](/dev-docs/module-rules.html) page. Here are some examples:

- a module can't add pixels to the creative without disclosure
- every module must obey privacy regulations: GDPR, CCPA, COPPA
- modules cannot create new bids. That is reserved for bid adapters.
- modules must be configurable to make data available to all bidders. i.e. you can't make a module that works always and forever with just one bidder without prominent disclosure.

### 2. Understand the Endpoints and Stages

Here's a description of the Stages of a PBS request that modules can tap into for each supported endpoint:

{: .table .table-bordered .table-striped }
| Stage | Description | Endpoints | Example Use Cases |
|-------------|-------------|-------|-----|
| Entrypoint | Hook functions can see the raw request before PBS has processed or validated anything | auction, amp, video | A/B testing of account parameters, Alternate account validation, AMP pre-processing |
| Raw Auction Request | Validations have been done, but no enrichments | auction, amp, video | A/B testing of StoredRequests, Advanced device detection, Traffic Quality |
| Processed Auction Request | Any stored requests have been merged in and all PBS enrichments are done | auction, amp, video | Inject First Party Data, Channel determination, Bid floors, Bidder optimization |
| Bidder Request | The request has been customized for a particular bidder in the auction | auction, amp, video | Bidder-specific bcat/badv, Bidder-specific deals |
| Raw Bidder Response | Hook functions can get access to the unprocessed bidder response | auction, amp, video | Response validations |
| Processed Bidder Response | PBS has done its own validations on an individual bidder's response | auction, amp, video | Advanced CPM adjustments, Custom VAST macros |
| Auction Response | Last step before the response goes back to the client | auction, amp, video | Inject ad server targeting, alternate auction winner logic |

### 3. Figure out which Stages You're going to Hook Into

A module may be comprised of:

- functions that are called by Prebid Server
- internal functions and state
- optional external connections to data sources or other services

![Prebid Server Modularity Architecture](/assets/images/prebid-server/module-example.png){:class="pb-xlg-img"}

### 4. Rejecting Requests or Responses
### 5. Determine what Should be Configurable
### 6. Consider Storage Needs
### 7. Think about Analytics Tags
### 8. Write the Code and Unit Test
### 9. Write the Documentation
### 10. Submit the Pull Requests

## Example Modules

