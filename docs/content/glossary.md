---
sidebar_position: 3
title: Header Bidding Glossary
description: Header Bidding Glossary
---

# Header Bidding Glossary

## Ad Formats

This section contains terms around ad formats and their respective configuration.

### MediaType or Media Format

`banner` - also called 'display', these ads are generally simple rectangular images.

`native` - the components of this mediatype like text, links, and images are all separated so they
can be formatted to smoothly fit into the content.

`video` - see Player-Initiated Video and Page-Initiated Video

### Multiformat AdUnit

An AdUnit that can display creatives of multiple media formats: banner, native, and/or video.

### Page-Initated Video

Also called 'outstream', these are ads that can share an AdUnit in Prebid.js with banners, but are displayed with
a special 'renderer' to play a video ad instead of a static image. Unlike 'player-initiated' units (aka 'instream video'), this renderer only renders the ad and does not show content.

### Player-Initiated Video

Once called 'instream', these are AdUnits that are rendered in a video player before, during or after content.

### Interstitial

Interstitial ads are full-screen ads that cover most of the visible UI. They're typically displayed during navigation, e.g. clicking a link or going to the next level in a game.

## Ad Tech Industry

Ad Server, SSPs, DSPs, etc.

## Client Side Header Bidding

The auction takes place on the client device of the user.
Prebid.js is a client side bidding solution.

[Prebid Server]: /dev-docs/prebid-server/overview/prebid-server-overview

### Direct Sold Ads

Ads sold by a publisher's sales staff and entered directly into the ad server.

### Interactive Advertising Bureau (IAB)

The [IAB](https://www.iab.com/) is the ad tech industry standards body.

### Programmatic Ads

Ads delivered either through an open marketplace through an auction, or as a pre-arranged "deal" that was initiated through systems outside of the publisher's ad server.

## Server Side Header Bidding

The header-bidding auction takes place on a server. Notable server side bidding systems are

- [Prebid Server]
- [Amazon TAM](https://aps.amazon.com/aps/transparent-ad-marketplace/)
- [Google OpenBidding](https://support.google.com/admanager/answer/7128453?hl=en) formerly known as Exchange Bidding.

## Ad Server

A system that allows a content publisher to manage their portfolio of ads and deliver those ads according to the defined targeting and pacing rules.

### Placement

A 'placement' is bidder term that's similar to [AdUnit](#adunit) -- it helps the bidder link the AdUnit to details about the header bidding auction that have been entered into their systems.
Some bidders may use a combination of multiple parameters like zoneId, formatId, siteId or something else, but the concept is similar.

:::warning
A notable exception is Google Ad Manager. [Google Ad Manager placements](https://support.google.com/admanager/answer/177397?hl=en) are a _group of [ad units](#adunit)_!
:::

### Line Items

A 'Line Item' is an ad server concept that contains information about how a specific ad is intended to serve to a website or app. Line items are added to containers called 'Orders' and carry details like:

- The number of times the advertiser or buyer wants an ad creative to serve
- The cost negotiated for the campaign
- Start and end times of the campaign
- Targeting that allows the advertiser or buyer to reach its intended audience or demographic

(Adapted from the [Google Ad Manager Line Item documentation](https://support.google.com/admanager/answer/9405477?hl=en))

Integrating Prebid bids with other ad sources requires a [special line item setup](/content/guides/ad-ops/adops-planning-guide) if you aren't using an ad server that supports Prebid natively, which most don't.
