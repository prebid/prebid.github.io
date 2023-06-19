---
layout: page_v2
title: Video Intro to Prebid Identity Solutions
description: A video overview of Prebid Identity Solutions
sidebarType: 9
---

# A Video Overview of Prebid Identity Solutions

An explanation of Prebid’s user identity and consent management tools.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/826314346?h=4227e73b6e&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Identity in Prebid.js"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:

- [User Identity Overview](/identity/prebid-identity.html)
- [SharedID](/identity/sharedid.html)
- [Prebid.js Modules](/dev-docs/modules/)
- [All Videos](/overview/all-videos.html)

Related Videos:

- [Introduction to Prebid.js](/prebid/prebidjs-video.html)
- [Components of Prebid.js](/prebid/prebidjs-components-video.html)

## Transcript

### Introduction

Prebid offers a powerful set of tools that help publishers to integrate with user identity solutions in a way that follows their organization’s privacy strategy.

Digital media sellers need to have sophisticated practices for handling the data that describes users and audiences. To increase the value of impression opportunities surfaced to buyers, publishers may wish to transmit a pseudonymous user identifier in Prebid.js bid requests. These identifiers are a form of ad request enrichment. They can help increase the value of impression opportunities to buyers by unlocking the buyer’s ability to perform actions like frequency capping and audience targeting.

At the same time, all members of the digital advertising supply chain have a responsibility to protect the privacy of internet users and to comply with privacy and data laws. Therefore, all sellers must develop an identity and privacy strategy that is rooted in their approach to monetization, user experience, and regulatory compliance. Prebid’s tools can be used to integrate with identity solutions and execute on an identity and privacy strategy. Prebid does not provide legal advice and makes no guarantees about compliance with any law or regulation.

### Identity Solutions: SharedId and User ID Module

Sellers using Prebid.js can transmit identity signals using Prebid’s SharedId service or any other major identity solution. SharedId is an open-source identity solution developed and maintained by Prebid. It stores a unique user ID in the publisher’s domain and makes it accessible to Prebid auction bidders. Bidders may then use this identifier for ad targeting, frequency capping, or other purposes. In addition to SharedId, Prebid also supports dozens of other popular identity servies. The benefits and mechanics of each service vary, and it is up to the seller to decide which providers align best with their privacy and identity strategies.

The Prebid.js User ID Module is used to integrate SharedId and other services into Prebid.js. The providers of identity solutions build submodules that are compatible with the User ID module. The submodules allow the provider’s service to get and set identifiers and expose the identifiers to bidders.

Publishers have complete control over which user ID submodules are included in their Prebid.js wrappers. Prebid.js also allows publishers to establish controls over user IDs, such as restricting when and how user syncing can occur during the header bidding auction.

### Privacy Solutions: Consent Modules

Prebid.js also includes tools that allow publishers to execute on their privacy, consent, and regulatory compliance strategies. These tools work in close coordination with the User ID module and Prebid adapters to control whether, when, and how user identifiers are created or shared.

Collectively, these tools are called Consent Management Modules. They connect to the publisher’s Consent Management Platform, or CMP to make the user’s preferences about data use available to Prebid.js and to Prebid bidders.

Consent Management modules allow Publishers and bidders to use consent data to decide when to activate user ID modules, whether to allow bidders to perform cookie syncs, and whether or not to serve ads.

These modules are designed to provide tools related to specific regulations, but do not guarantee compliance with any regulatory requirements.

### Getting Started

To learn more about the Prebid User ID Module, SharedID, and Prebid Consent Management Modules, visit docs.prebid.org
