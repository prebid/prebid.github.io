---
layout: page_v2
title: Header Bidding Glossary
description: Header Bidding Glossary
sidebarType: 0
---

# Header Bidding Glossary
{:.no_toc}

- TOC
{:toc}

## Account ID

`Prebid Server` - Prebid Server host companies may give out account IDs to publishers for authorization, configuration,
and reporting purposes. This account ID is provided on s2sConfig when utilizing Prebid Server from Prebid.js and in the init function when utilizing Prebid SDK.

## AdSlot

The 'hole' in the web page or mobile app where an ad may appear. This is very similar to `AdUnit`, but is
the technical implementation defining which ad sizes and formats may appear within it.

In the "Google Publisher Tag" (GPT), the "defineSlot()" function call maps an HTML div (the technical
implementation) to the AdUnit, (the sellable item).

## AdUnit

`Ad servers such as Google Ad Manager` - the AdUnit is the thing that business people care about. It's an
inventory concept targeted by [line items](#line-items).

[Prebid Adunit] - Prebid adds another layer to the ad server AdUnit: which header bidders should participate in the auction and their parameters.

## Placement

A 'placement' is bidder term that's similar to [AdUnit](#adunit) -- it helps the bidder link the AdUnit to details about the header bidding auction that have been entered into their systems.
Some bidders may use a combination of multiple parameters like zoneId, formatId, siteId or something else, but the concept is similar.

{: .alert.alert-warning :}
A notable exception is Google Ad Manager. [Google Ad Manager placements](https://support.google.com/admanager/answer/177397?hl=en) are a _group of [ad units](#adunit)_!

## Line Items

A 'Line Item' is an ad server concept that contains information about how a specific ad is intended to serve to a website or app. Line items are added to containers called 'Orders' and carry details like:

- The number of times the advertiser or buyer wants an ad creative to serve
- The cost negotiated for the campaign
- Start and end times of the campaign
- Targeting that allows the advertiser or buyer to reach its intended audience or demographic

(Adapted from the [Google Ad Manager Line Item documentation](https://support.google.com/admanager/answer/9405477?hl=en))

Integrating Prebid bids with other ad sources requires a [special line item setup](/adops/adops-planning-guide.html) if you aren't using an ad server that supports Prebid natively, which most don't.
The [Prebid Line Item Manager] can help set up GAM line items. GAM 360 has the beginnings of a [native Prebid integration](https://support.google.com/admanager/answer/12273163?hl=en).

## Key Values

A generic way to target [line items](#line-items) in your ad manager. Prebid makes heavy use of key values to indicate the winning bidder and the winning bid price.

## AMP

Accelerated Mobile Pages (AMP) is an alternate web platform that can speed web pages on mobile devices, but
also limits the scripts that can be run on the page. See [Prebid's AMP page](/formats/formats.html#amp)

## Config ID

`Prebid SDK` - when coding the mobile app for the technical implmentation of the adslot, the SDK function call
refers to this ID that refers to an impression-level stored request on [Prebid Server]. This server-side stored
request contains the bidders and parameters that can participate in the auction for that adslot.

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

Also called 'outstream', these are AdUnits that work in Prebid.js just like banners, but are displayed with
a special 'renderer' to play a video ad instead of a static image.

### Player-Initiated Video

Once called 'instream', these are AdUnits that live within a video player.

### Interstitial

Interstitial ads are full-screen ads that cover most of the visible UI. They're typically displayed at during navigation, e.g. clicking a link or going to the next level in a game.

## Prebid Mobile

Prebid SDK and [Prebid Server] working together to provide header bidding for mobile apps.

## Renderer

`Prebid.js` - a piece of javascript that can display creatives of a special type, e.g. video or rich media.

`Prebid SDK` - a library from a vendor that can display creatives of a special type, e.g. video or rich media.

## Stored Request

`impression-level stored request` - a block of JSON available to Prebid Server that stores the bidders and parameters
associated with a particular adslot. There's a string ID for this block of JSON that can be used by the Prebid SDK (see Config ID) or Prebid.js.

`top-level stored request` - a block of JSON available to Prebid Server that stores global parameters like timeout,
price granularity, targeting parameters, etc. There's a string ID for this block of JSON that can be used by the Prebid SDK or Prebid.js. In Prebid SDK, the "account ID" field in the init function currently doubles as the ID of the top-level stored request.

`AMP stored request` - a block of JSON available to Prebid Server that stores both global and impression-level parameters. There's a string ID for this block of JSON that can be used by AMP RTC calls.

## Server Side Bidding

The header-bidding auction takes place on a server. Notable server side bidding systems are

- [Prebid Server]
- [Amazon TAM](https://aps.amazon.com/aps/transparent-ad-marketplace/)
- [Google OpenBidding](https://support.google.com/admanager/answer/7128453?hl=en) formerly known as Exchange Bidding.

## Client Side Bidding

The auction takes place on the client device of the user.
Prebid.js is a client side bidding solution.

[Prebid Server]: /prebid-server/overview/prebid-server-overview.html
[Prebid Adunit]: /dev-docs/adunit-reference.html
[Prebid Line Item Manager]: /tools/line-item-manager.html
