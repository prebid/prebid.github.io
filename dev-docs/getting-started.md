---
layout: page_v2
title: Getting Started for Developers
description: Dev docs for getting started with Prebid.js for header bidding
sidebarType: 1
---


# Getting Started for Developers
{: .no_toc }

* TOC
{: toc }

## Overview

To run heading bidding on your site with Prebid.js you need to [download the Prebid.js package](/download.html), including your selected bidders and adapters, and add the code to your page. This code will gather bids from your selected demand sources (bidders) and pass the information on to your ad server. For full details on how Prebid.js works, see [What is Prebid.js?](/prebid/prebidjs.html).

Developers should work with their ad ops team to plan out your Prebid configuration. You'll need to add information to your code regarding things such as:

- Whether you're sending all bids or only the top price bid to the ad server
- What level of price granularity you'll be using
- What key-value pairs do you need to pass to the ad server

See the [Ad Ops Planning Guide](/adops/adops-planning-guide.html) for details.


## Quick Start

The easiest way to get started with Prebid.js is to look at an example. Start with our [Basic Example](/dev-docs/examples/basic-example.html), then explore other examples under **Prebid.js > Examples** to find what you need.

## Next Steps

For more developer resources, see:

- [Publisher API Reference](/dev-docs/publisher-api-reference.html)
- [Prebid.js Module Overview](/dev-docs/modules/)
- [Prebid.js Analytics Adapters](/overview/analytics.html)

To learn more about header bidding and Prebid see:

- [Introduction to Header Bidding](/overview/intro-to-header-bidding.html)
- [Introduction to Prebid](/overview/intro.html)
- [What is Prebid.js?](/prebid/prebidjs.html)

For guidance on planning out your configuration and working with your ad server, see:

- [Ad Ops and Prebid](/adops/before-you-start.html)
- [Ad Ops Planning Guide](/adops/adops-planning-guide.html)
- [Google Ad Manager with Prebid Step by Step](/adops/step-by-step.html)
