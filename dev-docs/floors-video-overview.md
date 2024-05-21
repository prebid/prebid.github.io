---
layout: page_v2
title: Video Intro to Floors for Prebid.js and Prebid Server
description: Video Intro to Floors for Prebid.js and Prebid Server
sidebarType: 1
---

# Video Intro to Floors for Prebid.js and Prebid Server

An overview of the Prebid.js and Prebid Server price floor features.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/938434804?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Price Floors in Prebid.js and Prebid Server"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<p/>
Notes:

- [Prebid.js Price Floors Module](/dev-docs/modules/floors.html#overview)
- [Price Floors in Prebid Server](/prebid-server/features/pbs-floors.html#prebid-server--features--price-floors)
- [Prebid Floor Service Providers](/dev-docs/modules/floors.html#floors-providers)

Related Videos:

- [Introduction to Prebid.js](/prebid/prebidjs-video.html)
- [Components of Prebid.js](/prebid/prebidjs-components-video.html)
- [Prebid Server Overview](/prebid-server/overview/prebid-server-overview-video.html)
- [All Videos](/overview/all-videos.html)

## Transcript

### Introduction

This video is an overview for publishers on price floors in Prebid.js and Prebid Server. We’ll discuss how publishers use price floors in their header bidding auctions and explain how they work in Prebid.js and Prebid Server. 

### Price Floor Basics

A price floor sets the minimum price that a publisher is willing to accept from a bidder for an impression. A bidder must bid above the price floor if they want to serve their ad. Price floors are communicated to bidders in bid requests, so they know what the minimum eligible bid price is. Publishers have complete control over the floor prices for their auctions, and Prebid gives publishers powerful tools for fine-tuning price floor values to specific auction scenarios. Prebid also allows publishers to use dynamic price floors that adjust in real time to market conditions.

### Why Use Price Floors?

Before we get into the details of how price floors work in Prebid, let’s talk about why you might want to use them.

One reason is to make sure that the cost of serving an ad doesn’t exceed the revenue earned for the ad. These costs include ad serving fees and the impact of an ad on user experience. Setting price floors in line with these costs helps publishers ensure that serving ads consistently delivers a net benefit to their business. 

Some publishers also use floors to help protect ad quality or to control the allocation of impressions between programmatic and direct-sold demand channels.

Another common reason that publishers use floors today is to counteract the price degradation that can occur under first-price auctions. 

A first-price auction is an auction in which the price that the winning bidder pays for the impression is equal to their bid price. The benefit of first-price auctions is the transparency that they offer buyers. 

However, first price auctions can also encourage buyers to use bid prices that are below what they think the impression is worth. This is called bid shading, and it places downward pressure on impression CPMs. 

To counter the price erosion caused by bid shading, many publishers use dynamic price floors that are driven by algorithms.

### How Floors Work in Prebid

Next, let’s dive into how floors work in Prebid.

We’ll start with a general model that applies to both Prebid.js and Prebid Server, then we’ll go deeper on each platform.

Price floors govern bid prices for the auction. Price floors are always determined before the auction begins and are sent to bidders in bid requests. 

How the price floor is determined before the auction can be very simple or quite complex. Price floors are matched with bids based on targeting attributes, which can include ad unit and media type information, device and user data, first party data, and more.

We’ll cover all this in more detail later on.

When a bidder sends a bid, Prebid.js and Prebid Server can check to make sure that the bid price is above the price floor. By default, bids below the floor will be prevented from competing in the auction.

Prebid’s price floors feature also automatically adjusts floors per bidder to take into account bid CPM adjustments that many publishers use to offset bidder fees or discrepancies. 

With these basics established, let’s dive into how floors work in Prebid.js and Prebid Server.

#### Floors in Prebid.js

Let’s start with Prebid.js

To use price floors in Prebid.js, you must first install the Price Floors Module. The module includes Prebid.js functionality for setting, signaling, and enforcing price floors. 

Once the Price Floor Module is installed, you’ll decide where you want the price floors to be located. There are three options: Ad Unit, Package, and Dynamic. 

With the Ad Unit method, price floor values are hard-coded directly into the Prebid.js Ad Unit. If the ad unit includes multiple ad sizes or multiple formats, it is possible to specify separate price floor values for each or just use a catch all floor. 

Configuring ad-unit-based floors is much like configuring other ad unit attributes like media types or bidder parameters. If you have many ad units, configuring and routinely updating floors on the ad unit level can be a large undertaking. For this reason, we generally recommend this approach only for setting permanent baseline floors that you don’t expect to change ever.

The Package method is more powerful and flexible than the ad unit method. With the package method, price floors live in a centralized price floors object inside the Prebid.js configuration. 

The price floors object includes rules that assign price floor values based on targeting criteria. 

The criteria may include dimensions like Prebid Ad Unit, Google Ad Manager Ad Unit, media type, dimensions, and much more. It’s even possible to create your own custom dimensions that integrate with data-gathering JavaScript running on your page. 

The package approach is well suited to publishers who need to fine tune their floors with specific targeting criteria. But it’s important to note that it is common for publishers using the package approach to have hundreds of price floors. If you consider this approach, you’ll also need to develop workflows for configuring and maintaining the price floor packages.

The third method for implementing price floors in Prebid.js is dynamic floors.

This method resembles the package approach, but instead of the package being bundled within the Prebid.js wrapper, it can be loaded externally and refreshed separately by a price floors service. 

The dynamic method allows your floors to adapt automatically to changing market conditions.

The dynamic approach is best for publishers who want to improve header bidding performance through price floor optimization. 

The server-side architecture allows floor providers to use Prebid analytics data, machine learning, and A/B testing to keep price floors updated to optimal values.

Many Prebid community companies provide dynamic price floor managed services, or you could build your own service.

It’s worth noting that with the dynamic model, the first auction on the page may be delayed by a few milliseconds in order to fetch the price floor package from the floor provider.

However, this delay does not affect every page load, because the price floors package will be cached by the browser. The publisher also has control over the maximum amount of time that the auction will be delayed to fetch a new floors package.

For a list of dynamic price floor providers, visit the link in the description below.

#### Floors in Prebid Server

We’ll end this video with an explanation of how price floors can be set up in Prebid Server.

If you’re using Prebid Mobile or Prebid for AMP and want to use price floors, then you will want to take advantage of Prebid Server’s price floors feature. 

Floors in Prebid Server uses a model that is very similar to the Prebid.js package and dynamic approaches. The floors are stored in a JSON object that includes a set of targeting rules that match price floor values to segments of inventory. 

It’s possible to configure the price floor file manually within Prebid Server, but it’s more common to use a price floor service that updates the price floor file dynamically.

Like in Prebid.js, Prebid Server is able to match floors to robust targeting rules and is able to enforce floors. Floors are signaled to bidders in bid requests, and they adapt to bid adjustments.

The differences between the Prebid.js and Prebid Server price floor solutions all trace back to the differences between the client-side and server-side platforms.

Notably, Prebid Server is able to use additional price floor targeting fields like country, but lacks the custom dimensions feature that Prebid.js has. 

Also, the Prebid Server floor service does not need to be called prior to the auction. Instead, the floor service periodically updates the floor data object asynchronously. This means that the Prebid Server auction will never be delayed, even with dynamic floors

That’s it for this discussion on price floors in Prebid.js and Prebid Server. For more information, check out the reference documents linked in the description below this video.
