---
layout: page_v2
title: Prebid.org Header Bidding Wrapper Code of Conduct
description: Full text of the Prebid.org Header Bidding Wrapper Code of Conduct
sidebarType: 0
---

# Prebid.org Header Bidding Code of Conduct
{:.no_toc}

Nov 17, 2020

In order to encourage the development of quality products while maintaining a healthy open source community, Prebid.org members and contributors are expected to abide by technical guidelines based on the core values of the organization.

* TOC
{:toc}

## Prebid.org Core Values

The main objective of Prebid.org is to make great header bidding technology available for web publishers and mobile app developers. We believe great technology is:

- **Efficient** - Products offered by Prebid.org should not burden a user device, the network, or a company server.
- **Secure** - Prebid.org software should not open doors to security risks, including electronic attack, denial of service, fraud, or data leakage.
- **Transparent** - Our products are built in the open with community review. Changes to Prebid software and modules must be open to inspection before and after release.
- **Fair** - The Prebid.org platform doesn’t favor any one entity over another. No entity can be favored over another in technical ordering or status as a default value. No entity can gain information about another entity without approval.
- **Collaborative** - Human interactions in Prebid.org public forums and events must be courteous. 
- **Privacy Sensitive** - Our products are built for publishers to support users’ privacy concerns and comply with industry standards.

## Auction Principles

The guidelines in this section apply to open source software written for the Prebid.org platform, or plugins designed to integrate into the Prebid.org platform.

**Definitions:**

- **Publisher**: the party who is integrating the header bidding technology into their page, app, video service, etc. They may integrate Prebid software on their own or through an approved agent.
- **Publisher Agent**: a party who helps a Publisher integrate or install Prebid software.
- **Auction Layer**: the part of the system that facilitates bids from demand partners being passed into the decisioning layer.
- **Demand Partner**: any party that is willing to provide a price to be paid to the Publisher for a given impression, and is integrated into header bidding.
- **Decisioning Layer**: the part of the system that decides the final winning bid.

![Conduct](/assets/images/code-of-conduct-diagram.png){:class="pb-lg-img"}

### Auction Logic

1. The Auction Layer must not modify bids from Demand Partners unless specifically instructed to do so by configuration. For example, a Publisher might instruct the Auction Layer to:
    1. Apply a modification that changes the bid from gross to net or;
    1. Apply a modification that changes the bid from one currency to another;
    1. Account for a consistent discrepancy;
    1. Account for managed service fees;
    1. Drop bids that do not meet the floor requirement
1. The Auction Layer must provide equal opportunity for all Demand Partners to bid, either by randomizing the order in which they are called, or by requesting bids in the order specified by the publisher.
    1. Publisher configuration may override which bidders take part in each auction.
    1. This also specifically covers any situation where a Publisher Agent is also a Demand Partner or a Demand Partner is hosting the Auction Layer.
1. The Auction Layer must send all demand returned within the configured timeout period to the Decisioning Layer.
1. The Decisioning Layer must make the final choice of which bid wins unless configured to do otherwise.
1. The Decisioning Layer can be determined by the Publisher, e.g. It could be an ad server or the same software that implements the Auction Layer, or a proxy server. If decisioning is done in Prebid software, it must conform to all other rules in this section.
1. The Auction Layer should provide a mechanism or process for Publishers and Demand Partners to validate auction mechanics, including:
    1. Confirmation that bid requests were sent to Demand Partners
    1. Confirmation that bid responses were sent to the Decisioning Layer
    1. Confirmation that the correct bid values were sent to the Decisioning Layer
    1. Bid timing information such as which Demand Partners met the timeout period

### Data and Transparency

1. The Auction Layer must segregate demand data so there is no opportunity for Demand Partners to have access to other bids or bidder data.
1. The Auction Layer must pass available bid request information to each configured demand partner, subject to Publisher configuration and privacy regulation controls.
1. The Auction Layer must not collect and store Publisher or Demand Partner information (such as bid stream information, user information, and Publisher first party data) except in the following cases:
    1. Passing information to Demand Partners or Analytics Adapters
    1. Validating header bidding mechanics
    1. Troubleshooting and diagnosing implementations
1. The Auction Layer must not record, use, or sell Publisher or Demand Partner data except in accordance with the instructions of the Publisher and the Demand Partner.
1. The Prebid ecosystem will endeavor to support industry standard privacy regulations, including allowing Publishers to transmit notice, consent, and opt-out state.
1. Analytics Adapters must not utilize header bidding auction data outside of any agreement they reached with the Publisher.

### User Experience

1. The system should minimize the impact on the user’s web browsing experience.
1. Users, Publishers and Advertisers deserve a reliable ad serving environment. Prebid software should facilitate data that helps determine if an impression is fraudulent or undisplayable for any reason.
1. Publishers should be able to utilize Prebid software while adhering to their privacy policies. 

### Adapter Conduct

Prebid software supports different types of ‘plugin’ modules, including for example bid adapters, analytics adapters, user ID modules, real-time-data modules, and others.

1. Adapters of all types must follow all of the above guidelines and specific technical rules defined by the relevant Prebid committee.
    1. Prebid.js and Prebid Server technical rules are defined by Prebid Module Rules.
1. As technical rules may change over time, Prebid committees are empowered to force adapters to change specific behaviors as part of major milestone releases. The committees should strive to give the adapter community ample opportunity to weigh in on specific guidelines and ample time to make changes.

## Information and Resources

- [Prebid.org Community Code of Conduct](https://prebid.org/code-of-conduct/#community)
- [Prebid.org Member Companies](https://prebid.org/membership/member-directory/)
- [Prebid Module Rules](/dev-docs/module-rules.html)
