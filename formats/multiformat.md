---
layout: page_v2
title: Prebid Multi-Format
description: Prebid Multi-Format
sidebarType: 6
---

# Prebid Multi-Format

Ad Units that support multiple formats are supported by Prebid.js and Prebid Server.

How precisely multiformat is supported is defined by each bid adapter on their parameter page in the "Multi Format Support" field. These are the possible values:

- will-bid-on-any: the adapter will consider all supported formats and bid on one or more.
- will-bid-on-one: the adapter will consider only one of the supported formats for each auction.
- will-not-bid: the adapter will not bid on any adunits with more than one format.

## Prebid.js

### Adops

- [Google Ad Manager with Prebid Step by Step](/adops/step-by-step.html)

### Developers

- [Show Multi-Format Ads with Prebid.js](/dev-docs/show-multi-format-ads.html)

## Prebid Server

Bid adapters declare which formats (banner, video, and/or native) they're ready to receive.
