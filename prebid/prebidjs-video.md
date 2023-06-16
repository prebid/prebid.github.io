---
layout: page_v2
title: Video Intro to Prebid.js
description: A video overview of Prebid org and products
sidebarType: 1
---

# A Video Overview of Prebid.js

A high-level overview of Prebid.js, Prebid’s header bidding product for websites.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/822153705?h=164ad73316&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="1.3_IntroToPBJS_v5"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:
- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)
- [What is Prebid.js?](/prebid/prebidjs.html)
- [Prebid.js Developer Quick Start](/dev-docs/getting-started.html)
- [All videos](/overview/all-videos.html)

Related Videos
- [Introduction to Prebid](/overview/intro-video.html)
- [Introduction to Header Bidding](/overview/intro-to-header-bidding-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Components of Prebid.js](/prebid/prebidjs-components-video.html)
- [Identity in Prebid.js](/identity/prebid-identity-video.html)

## Transcript

### Introduction
Prebid js is a powerful, open-source header bidding wrapper that allows publishers to monetize their websites by running an auction for any ad on any page.

It’s the industry standard in header bidding. It’s used by tens of thousands of websites and supports more than 200 demand sources. 

### Features and Capabilities
Prebid.js allows a publisher to set up a detailed map of their advertising inventory across one or many websites. It allows them to select which demand partners should compete to bid on each ad slot and provides a robust set of controls over ad slots, auction dynamics, and page performance. There is also a set of optional add-ons for analytics, ad request enrichment, identity and privacy control, price floors, and more. These tools allow publishers to maximize revenue while preserving user experience and privacy. Prebid.js is flexible and modular, allowing it to integrate cleanly into any ad stack. 

### What makes Prebid.js different
What distinguishes Prebid.js from other header bidding solutions is its robust set of features, its extensive adoption among sellers and buyers of digital advertising, and its principles of transparency, fairness, and open-source. Prebid.js is built by the community that uses it. As an open platform, Prebid.js also lays the foundation for an innovative ecosystem in which independent companies offer Prebid-compatible products and services.
### How Prebid.js is Made
Prebid.js is built collaboratively by Prebid member companies and Prebid.org.. This team works together under the oversight of the Prebid.js Product Management Committee, which is the group within Prebid.org that is responsible for developing Prebid.js. The Product Management Committee maintains Prebid.js’ roadmap and coordinates the software’s development.

### How Prebid.js Works
When a publisher uses Prebid.js, they create a wrapper. The wrapper includes Prebid’s core auction and ad serving functions, as well as add-ons that the publisher uses to customize the wrapper to their needs. The publisher chooses a list of buyers, which Prebid calls bidders. For each bidder, the publisher adds a specific block of code called a bid adapter to their wrapper. Each bidder develops its own bid adapter and contributes it to the Prebid library.

Let’s run through an example Prebid auction:

Prebid.js is installed to the website. Each time a new impression opportunity becomes available, Prebid.js notifies the bidders, who respond with bids. Then, Prebid might select an auction winner and render its ad to the page, but more commonly, it will pass the bid information on to the ad server, which makes a final decision about which ad source should be awarded the impression. Within the ad server, header bidding bids compete based on price, and do not compete with the delivery of reserved, guaranteed, and sponsorship campaigns. When the ad server chooses a header bidding buyer, it works with the wrapper to render the ad to the page.

### Getting Started
Prebid.js is free to use. You can get started with your own installation of the latest version of Prebid by visiting docs.prebid.org. 

There are also several companies that offer Prebid.js managed services, which may include technical support, ad operations and yield optimization services, hosting services, and extra product features like user interfaces or analytics. To learn more about these, visit prebid.org.

