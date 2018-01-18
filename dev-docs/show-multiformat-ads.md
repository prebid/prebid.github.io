---
layout: page
title: Show Multi-Format Ads with Prebid.js
description: Show Multi-Format Ads with Prebid.js
pid: 0
is_top_nav: yeah
top_nav_section: dev_docs
nav_section: prebid-multiformat
---

<div class="bs-docs-section" markdown="1">

# Show Multi-Format Ads with Prebid.js
{: .no_toc }

This page has instructions for showing multi-format ads using Prebid.js.

Multi-format ads allow you to declare multiple media types on a single ad unit.

Once declared, any bidder that supports at least one of the media types can participate in the auction for that ad unit.

## How Multi-Format Ads Work

Multi-format ads allow you to say that a single ad unit may be filled by any eligible banner, video, or native ad.

At a high level, Prebid.js supports multi-format as follows:

1. For each multi-format ad unit, make a list of each of the media types defined for that ad unit
2. Loop through each of the bidders on the ad unit, checking it against the list of media types to see if the bidder is eligible to bid
3. Send bid requests to each bidder that supports at least one of the media types on the ad unit

## Prerequisites

## Implementation

## Working Examples

## Related Topics

+ [Setting up Prebid Multi-Format in DFP]({{site.baseurl}}/adops/setting-up-prebid-multiformat-in-dfp.html)

</div>
