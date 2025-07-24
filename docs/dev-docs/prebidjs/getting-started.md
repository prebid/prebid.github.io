---
sidebar_position: 1
title: Getting Started for Developers
description: Dev docs for getting started with Prebid.js for header bidding
---

# Getting Started for Developers

## Overview

To run heading bidding on your site with Prebid.js you need to [download the Prebid.js package](/content/download), including your selected bidders and adapters, and add the code to your page. This code will gather bids from your selected demand sources (bidders) and pass the information on to your ad server. For full details on how Prebid.js works, see [What is Prebid.js?](/dev-docs/prebidjs/prebidjs).

Developers should work with their ad ops team to plan out your Prebid configuration. You'll need to add information to your code regarding things such as:

* Whether you're sending all bids or only the top price bid to the ad server
* What level of price granularity you'll be using
* What key-value pairs do you need to pass to the ad server

See the [Ad Ops Planning Guide](/content/guides/ad-ops/adops-planning-guide) for details.

## Quick Start

The easiest way to get started with Prebid.js is to look at an example. Start with our [Basic Example](/dev-docs/prebidjs/examples/basic-example), then explore other examples under **Prebid.js > Examples** to find what you need.

## Next Steps

For more developer resources, see:

* [Publisher API Reference](/dev-docs/prebidjs/publisher-api-reference)
* [Prebid.js Module Overview](/dev-docs/prebidjs/modules/)
* [Prebid.js Analytics Adapters](/content/analytics)

To learn more about header bidding and Prebid see:

* [Introduction to Header Bidding](/content/intro-to-header-bidding)
* [Introduction to Prebid](/content/intro)
* [What is Prebid.js?](/dev-docs/prebidjs/prebidjs)

For guidance on planning out your configuration and working with your ad server, see:

* [Ad Ops and Prebid](/content/guides/ad-ops/before-you-start)
* [Ad Ops Planning Guide](/content/guides/ad-ops/adops-planning-guide)
* [Google Ad Manager with Prebid Step by Step](/content/guides/ad-ops/step-by-step)
