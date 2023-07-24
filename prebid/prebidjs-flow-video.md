---
layout: page_v2
title: Video Intro to the Prebid.js Auction
description: A video overview of a Prebid.js Auction
sidebarType: 1
---

# A Video Walkthrough of a Typical Prebid.js Auction

A step-by-step walkthrough of a typical Prebid.js auction.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/826313239?h=0a8f24923b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Prebid.js Impression Flow"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:

- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)
- [What is Prebid.js?](/prebid/prebidjs.html)
- [Prebid.js Quick Start](/dev-docs/getting-started.html)
- [All videos](/overview/all-videos.html)

Related Videos

- [Introduction to Prebid](/overview/intro-video.html)
- [Introduction to Header Bidding](/overview/intro-to-header-bidding-video.html)
- [Components of Prebid.js](/prebid/prebid-components-video.html))
- [Identity in Prebid.js](/identity/prebid-identity-video.html)

## Transcript

### Introduction

This video will walk through the steps required to serve a display ad through an ordinary Prebid.js integration.

- This is the simplest and most common type of Prebid auction. Specifically, it is a client-side auction for a display ad running in a single-format ad slot on a website that uses a primary ad server.
- There are many variations on this basic form, which include:
  - Auctions for other ad formats, such as video or native
  - Auctions that use Prebid Server
  - Auctions that use Prebid.js without a primary ad server
  - Auctions in other environments such as AMP, mobile apps, and long-form video.
- Let’s start with a high-level overview of the steps:
  - When the page loads, Prebid.js loads. The page invokes Prebid.js, which goes through a three-stage process: Pre-Auction, Auction and Post Auction.
  - In the Pre-Auction stage, Prebid.js gathers information that it needs to run auctions for the ad slots on the page.
  - Next comes the Auction stage:
    - Prebid.js makes bid requests to bidders that the publisher has selected
    - The bidders respond to Prebid.js with bids
  - Finally, the post-auction stage begins
    - Prebid.js gathers the bids and reformats them into a format that the primary ad server will understand
    - For each ad slot, requests are sent to the ad server. These requests contains information about the bids Prebid.js received.
    - The ad server receives the requests and decides which of the publisher’s ad buyers should serve an ad. Prebid bidders are considered alongside other potential buyers.
    - When the primary ad server selects a Prebid bidder, it returns Prebid code that renders the ad to the page.

### Impression Flow

Now, we’ll go through the process in detail.

1. **Pre-Auction**
    1. The user requests the page, the publishers’ CMS is called and returns the page source, which includes instructions to load Prebid.js and begin an auction for one or more Ad Units
        1. An Ad Unit represents a unique ad slot on the page.
            1. The Ad Unit contains information about the attributes of the ad slot, such as the ad format, and dimensions. The Ad Unit also includes the list of bidders that are allowed to bid on the ad slot.
        1. In Prebid, the word “auction” refers to the process by which bids are solicited and received for one or more Ad Units. A bidder will usually receive a single HTTP request that contains information about one or more Ad Units, and the bidder is able to bid on any or all of them.
    1. Before the auction begins, Prebid.js is able to retrieve other optional information, depending on how the publisher has configured it. This information can include:
        1. User consent information from the publisher’s consent management platform
        1. Ad request enrichment data that describes the user, site, or page
        1. Price floor information
        1. And more
1. **Auction** - The auction begins.
    1. Prebid.js sends bid requests to bidders.
        1. Bidders will receive an HTTP request that contains one or more ad units. Which ad units each bidder receives depends on how the ad units are set up by the publisher.
        1. Bid requests contain information about the ad units, page, user, and auction, including the page URL, ad slot identifiers, user identifiers, first party data, consent data, supply chain data, price floors and more.
            1. A bidder’s bid adapter is the component that formats the bid requests the bidder receives. Bidders build and maintain their own bid adapters and submit them to the open-source Prebid.js repository.
        1. At this point, Prebid.js will also start a timer that it uses to enforce the publisher’s configured bid timeout. The bid timeout determines the amount of time that Prebid.js will wait to receive bidders’ responses.
    1. Bidders consider the impression opportunity. They will consult their own sources of demand and determine whether they are able to offer an ad for the opportunity. If they do, they’ll also decide upon a price they would be willing to pay.
    1. Bidders return responses.
        1. The bidder’s HTTP response contains their bids for the Ad Units in the auction. The bidder isn’t required to place a bid, and bids only on the ad units they hope to win.
        1. Responses that include a bid will contain a URL that refers to the ad’s creative, a price, and other information such as deal IDs.
        1. Bids that Prebid.js receives before the bid timeout period has elapsed are considered valid bids. The bid timeout is set by the publisher in the Prebid.js configuration. Bids not received before the bid timeout will be logged as timed-out bids.
    1. Prebid.js processes responses
        1. As Prebid.js receives responses from bidders, it processes them
            1. Bidders’ bid adapters are responsible for parsing the bidders’ responses and exposing bid information to Prebid.js.
            1. Bid processing starts with extracting information from the bid, which can include bid prices, deal IDs, and ad format information.
            1. Where necessary, Prebid.js will perform other validations or transformations like price floor enforcement or currency conversion
    1. Prebid’s auction completes when either all of the bidders have responded and Prebid has processed their bids, or when the timeout period set by the publisher has elapsed.
        1. After the auction has completed, Prebid formats the bid information as a set of key-value pairs that the primary ad server will understand.
1. **Post-Auction**
    1. With the Prebid auction complete, the ad server is called
    1. A request is sent to the primary ad server for each of the slots on the page. These requests will contain the bid key-value pairs.
    1. The ad server receives its request and evaluates the demand sources that the publisher has enabled, which includes but is not limited to Prebid bidders.
        1. Other demand sources that the ad server might consider are:
            1. Direct-sold campaigns with reservations, guarantees, or sponsorships
            1. Bids from other header bidding or programmatic sources
            1. Waterfall-style demand sources such as ad networks
    1. Each ad server works a little bit differently. For more information about how Prebid.js works with ad servers, refer to Prebid’s Ad Ops documentation.
    1. When the ad server selects a Prebid bid to serve, it returns a piece of Prebid code called a creative.
    1. **Ad Rendering**
        1. The creative triggers the ad rendering process, in which Prebid.js retrieves the bidder’s ad and renders it to the ad slot on the page.

### Conclusion

- So that’s how an ad is served through Prebid.js
- Publishers can measure their monetization performance, troubleshoot issues, and maximize yield by gathering data about their header bidding auctions. Prebid supports a standardized interface for analytics adapters that allows publishers to integrate header bidding analytics tools that give them the insights they need.
- Prebid.js logs events throughout the auction and ad serving process. These events are exposed to analytics adapters, and they include the start of the auction, requests to bidders, bid responses, timeouts, ad server requests, ad renders, and more.
- Tools like the Professor Prebid browser extension also have the ability to monitor Prebid.js events and can be used for troubleshooting, debugging, and optimization.
- To learn more about the Prebid Auction and about Prebid’s analytics, optimization, and troubleshooting tools, visit [docs.prebid.org](docs.prebid.org).
