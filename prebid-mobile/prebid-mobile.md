---
layout: page
title: How it works?
description: How does Prebid Mobile work?
pid: 0
is_top_nav: yeah
top_nav_section: prebid-mobile
nav_section: prebid-mobile
---

<div class="bs-docs-section" markdown="1">

# How does Prebid Mobile work?
{:.no_toc}

Prebid Mobile auctions run directly on the device and allow app developers to access demand that may not be available from their mobile ad network.

Benefits and features of Prebid Mobile include:

 - Direct access to more mobile buyers
 - Increased yield due to increased competition between demand sources
 - A lightweight library that uses simple query strings to send ad requests and to pass results
 - Minimized latency due to background pre-caching of creatives

Step by step explanation of Prebid Mobile:

 1. Prebid Mobile works by having our Prebid Mobile module running, fetching bids from your demand partners on Prebid Server in the background.
 2. Our Prebid Mobile module sends this bid information to your primary ad server SDK (e.g., MoPub) in the form of custom parameters.
 3. Your primary SDK sends a request to your ad network that includes these custom parameters. Meanwhile, your ad ops team has set up line items targeting these custom parameters.
 4. If the Prebid Mobile bid wins, the ad network returns our creative JS to your primary SDK's ad view.
 5. The creative JS in the ad view calls Prebid Server cache to fetch the actual creative content. When this happens, the impression is counted.

</div>
