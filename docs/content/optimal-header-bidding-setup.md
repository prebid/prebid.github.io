---
sidebar_position: 11
title: Optimal Header Bidding Setup
description: Learn about optimal header bidding setup and common problems to avoid
---

# Optimal Header Bidding Setup

## Ideal Header Bidding Auction

![Optimal Header Bidding Auction](/images/hb-expert/ideal.png)

This setup (captured using [Headerbid Expert](https://chrome.google.com/webstore/detail/headerbid-expert/cgfkddgbnfplidghapbbnngaogeldmop)) has demonstrated a few facts that made it an ideal header bidding auction.

**1. Asynchronous Calls**
All calls from the header bidding partners are asynchronous. The calls do not block the page, other header bidding partners, or the ad server from loading.

**2. Timeout**
For each impression, all header bidding partners are given a similar amount of time to respond. Any bid that responds later than the timeout are disregarded.

**3. Adserver**
The ad server sees the impression and header bidding info immediately after all header bidding partners finished responding, or when they timed out, whichever happens sooner.

## Poor Header Bidding Setup Examples

### Scenario 1

![Poor Header Bidding Setup - Loaded Too Late](/images/hb-expert/loaded-too-late.png)

**Problem**: This site is under monetized.

**Cause**: Bidders had less time to bid, because they loaded much later than the other bidders.

**How to fix**: Load all bidders together, or use a framework as Prebid.js which already does this.

### Scenario 2

![Poor Header Bidding Setup - Ad Server Too Early](/images/hb-expert/adserver-too-early.png)

**Problem**: This site is under monetized.

**Cause**: Too many bidder's bids got ignored, because they responded later than the ad server request was sent out.

**How to fix**: Load these bidders earlier in the header, or experiment with extending the timeout without causing impression loss.

### Scenario 3

![Poor Header Bidding Setup - Ad Server Too Late](/images/hb-expert/adserver-too-late.png)

**Problem**: This site may suffer impression loss.

**Cause**: Ad server loaded too late - it waited 1500 ms after the first header bidding request was sent out.

**How to fix**: Set a shorter timeout for the page and remove any bidder that is blocking the ad server from loading.

### Scenario 4

![Poor Header Bidding Setup - Bidder Delay Ad Server](/images/hb-expert/bidder-delay-adserver.png)

**Problem**: This site may suffer impression loss

**Cause**: Bidders responded too late and delayed the ad server from loading.
