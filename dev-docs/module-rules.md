---
layout: page_v2
title: Module Rules
description: Technical Module Rules for Prebid.js and Prebid Server
sidebarType: 0
---

# Prebid.js and Prebid Server Module Rules
{:.no_toc}

* TOC
{:toc}

"Modules" are optional features that extend Prebid's functionality. There are
several kinds of modules built by the community to enhance header bidding:

{: .table .table-bordered .table-striped }
| Module Type | Description | Scope |
|-------------|-------------|-------|
| Bid Adapter | Obtains Open Market or Private Market bids for the current ad request. | Prebid.js, Prebid Server |
| Analytics Adapter | Listens to auction events and reports to an analytics system. | Prebid.js, Prebid Server |
| User ID Sub-Module | Obtains an ID for this user and makes that ID available to other types of modules. | Prebid.js |
| Real Time Data Sub-Module | Obtains data for the current user's context that may be of interest to advertisers. | Prebid.js, Prebid Server |
| Other | Modules that don't fall into one of the other categories. | Prebid.js |

## Prebid.org Core Values

Specific technical rules are needed to govern the development and review of modules in order to assure that they conform to Prebid's Core Values. The main objective of Prebid.org is to make great header bidding technology available for web publishers and mobile app developers. We believe great technology is:

- **Efficient** - Products offered by Prebid.org should not burden a user device, the network, or a company server.
- **Secure** - Prebid.org software should not open doors to security risks, including electronic attack, denial of service, fraud, or data leakage.
- **Transparent** - Our products are built in the open with community review. Changes to Prebid software and modules must be open to inspection before and after release.
- **Fair** - The Prebid.org platform doesn’t favor any one entity over another. No entity can be favored over another in technical ordering or status as a default value. No entity can gain information about another entity without approval.
- **Collaborative** - Human interactions in Prebid.org forums and events must be courteous.
- **Privacy Sensitive** - Our products are built for publishers to support users’ privacy concerns and comply with industry standards.

## Module Rules

Bid adapters, user ID adapters, analytics adapters, and other modules will be reviewed for conformity to the Core Values of Prebid.org.

This set of module rules applies to both Prebid.js and Prebid Server.  However, these rules don’t necessarily apply to tools or the Prebid Mobile SDK. Rules and guidelines for those products will be determined by their respective committees as required.

The use of the terms "must" and "should" in this document is deliberate.  However, some of the rules are "aspirational," in that we know there are existing exceptions to the rule that will need to get sorted out over time. These are marked with an asterisk (*).

### Global Module Rules

#### Strictly Enforced Rules

1. Each adapter and module must include working maintainer information with a group email address for Prebid.org to contact for support or maintenance.
1. Modules must not load outside code files unless those libraries are approved and open source.
    1. External modules may be used at build-time at the discretion of the relevant Prebid committee. Build-time modules must be locked to a particular version so that any upgrades must be done via Prebid pull request.
    1. Exceptions may be made in the following cases:
        - When the publisher has control over whether the file is loaded and which version, the base module should be able to work without the auxiliary file.
        - If run-time code is not needed for the auction, it should support a deferred load. E.g. User ID modules.
        - The file loaded is locked to a particular version so that any upgrades must be done via Prebid pull request.
        - A prominent disclosure is made about the loading of the file and why they need the file, and a size warning provided if it’s greater than 10KB.
    1. If a functionality is supported by Prebid core or an existing module, modules must prefer the Prebid version of that functionality rather than an externally coded version.
    1. The build-time or run-time loading of required or optional external files must be disclosed. (See the [disclosure](#disclosure) section below.)
1. Modules must use the communication functions provided by the Prebid core (both Prebid.js and Prebid Server) for external communication.
1. Modules must not add any pixel, iframe, cookie or local storage directly onto the page. Rather, they must use wrapper-provided mechanisms for usersyncs, cookies, and local storage.
1. All modules must support the creation of multiple concurrent instances. This means, for example, they cannot rely on mutable global variables.
    - PBJS: Writing to the global window object must be non-intrusive, disclosed, and done in a way that supports multiple instances.
1. Modules must not include polyfills or override standard or Prebid JavaScript functions.
1. Endpoint domain names cannot be fully variable. At some point, they won't be able contain any variables at all. e.g. $PARAM1.example.com.
1. In order to be listed on the Prebid.org website, a module must be in a Prebid open source repository.
1. Prebid.js requests and responses must be secure HTTPS.
1. Prebid.js modules must not use the PREBID_GLOBAL variable nor otherwise obtain a pointer to the global PBJS object. This preserves data integrity.

#### Rules that May Someday Be Enforced

1. Responses to auction or data requests should be compressed as long as the client supports that functionality (e.g. gzip, compress, deflate).
1. Endpoints should use HTTP/2 with keepalives so that connections don’t need to be re-created.
1. External modules must not use getEidPermissions function of userId module (e.g. prebidServerBidAdapter is an internal prebid module). 
1. All modules and any external code references must disclose their support of privacy regulations such as GDPR, CCPA, COPPA, etc. (See the [disclosure](#disclosure) section below.)

### Bidder Adapter Rules

All global rules apply.

#### Stricly Enforced Rules

1. Bid adapters must be able to bid. If they cannot return an auction bid, they should consider integration as a Real-Time Data or other module type.
1. Bidder modules must not make requests to endpoints for functionality other than auctions without:
    1. Disclosure
    1. Ability for the publisher to control the additional functionality.
    1. Ensuring auctions are still operable if the publisher turns off the additional functionality; i.e., bid adapters may log certain analytics events, but if a publisher turns it off, the auction should still happen.
    1. Building a Real-Time Data sub-module that obtains data in a way that can be utilized by other bidders as well if a bidder would like to incorporate an external data fetch that would influence the auction.
1. Bidder modules must not obtain bid information from or about any other party in the auction. E.g., they cannot listen to ad server events and forward information naming other bidders back to their endpoint - that is the job of an analytics module.
1. Bidder modules must not cache bids from previous auctions. That functionality is reserved for Prebid core.
1. Bidders must accept parameters in the conventional location in preference to bidder-specific parameters. The list of these parameters is in the bidder adapter documentation for [PBJS](/dev-docs/bidder-adaptor.html#std-param-location) and [PBS](/developers/add-new-bidder-go.html#bidder-parameters).
1. Bidders must not override the standard ad server targeting values: hb_adid, hb_bidder, hb_pb, hb_deal, or hb_size, hb_source, hb_format.
1. If a bidder has adapters for both Prebid.js and Prebid Server, all parameters (including biddercodes and aliases) must be consistent between client- and server-side adapters. This allows publishers to utilize the PBJS [s2sTesting module](/dev-docs/modules/s2sTesting.html).
1. Bid adapters must not create their own transaction IDs or overwrite the tids supplied by Prebid.

#### Rules that May Someday Be Enforced

1. Creative rendering scripts must load from the creative frame and not directly in the page. In other words, creative rendering JavaScript cannot be used to bypass the “no external code” rule.
1. If bid adapters are reporting multiple media types in the hb_format as ‘banner’, they must(*) indicate the actual mediatype in the metadata object. One use case for this is that it allows publishers to manage which creatives support safeframes.
1. Bidder modules should supply buyer metadata - including advertiser, advertiser domain, network, actual mediatype, and others defined in the Prebid documentation.
1. Creatives returned must be fully HTTPS.

### Analytics Adapter Rules

All global rules apply.

1. Analytics adapters must not bid or supply any parameters to the auction.
1. Analytics adapters must be neutral to the bid adapters -- not favoring any particular bidder in any way.
1. Analytics adapters should minimize the number of times they call their endpoints by batching auction and event data.

### User ID Sub-Module Rules

All global rules apply.

1. ID sub-modules must not gather any information from the page except for publisher-approved ID data for this user.
1. ID sub-modules must not report analytics information back to their endpoints, including use of other user IDs, auction information, bidders, bids won, etc. This is the job of an analytics module.
1. ID sub-modules must be neutral to the bid adapters -- each bidder must have the same opportunity to utilize each user ID.

### Real Time Data Module Rules

1. All global rules apply with one exception:
    - A Real-Time Data module may load external code if it requires publisher registration and there's a prominent disclosure on the module documentation. The idea is that a publisher will not include the module if they don't approve of the external code, and since they've registered for the service, they must approve. The text of the disclosure may differ if the vendor allows Prebid to do regular reviews of a strictly versioned proprietary library.
1. Real Time Data (RTD) modules must not bid. That functionality is reserved for bid adapters.
1. RTD modules must not supply privacy-sensitive user information (including IDs) into the auction. That functionality is reserved for User ID modules.
1. RTD modules should make data available in a cross-bidder way when possible. For example, passing data through existing mechanisms like First Party Data.
1. RTD modules may cache bid metadata for analytics and optimization purposes. They may use those bids to optimize future auctions for which bidders and adunits take place. They must not re-use specific past bids in an auction -- that functionality is restricted to Prebid core.

### Other modules

Any other type of module will be evaluated on a case-by-case basis. Examples of other modules include Currency, Video ad serving, Consent management, etc. These modules must all follow the global rules.

## Disclosure

There are already exceptions to these rules, and we recognize there will likely be more. Any module doing something that needs to be disclosed will receive a label on their prebid.org documentation like:

- Disclosure: this bidder adapter loads external JavaScript to render creatives.
- Disclosure: this bidder records win and loss events with a pixel call.
- Disclosure: this bidder listens directly to Google Ad Manager events.
- Disclosure: this bidder reports timeout events.

Ideally, the disclosures should be of a limited number of standard types so they can be managed.

To manage this, we plan to:

1. Document a distinct set of disclosures with guidance for reviewers on how to determine which disclosures are needed.
1. Create a process for generating new types of disclosures and which modules received a given disclosure/exception on which date.
1. Make sure that disclosures are applied to all existing and new adapter aliases.


# Related Reading

- Adding a bid adapter: [Prebid.js](/dev-docs/bidder-adaptor.html), [Prebid Server](/prebid-server/developers/add-new-bidder-go.html)
- Adding an analytics adapter: [Prebid.js](/dev-docs/integrate-with-the-prebid-analytics-api.html), [Prebid Server](/prebid-server/developers/pbs-build-an-analytics-adapter.html)
- Adding a module: [Prebid.js](/dev-docs/add-rtd-submodule.html), [Prebid Server](/prebid-server/developers/add-a-module.html)
