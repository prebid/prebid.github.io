---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Price Floors
---

# Prebid Server | Features | Price Floors
{: .no_toc}

* TOC
{:toc}

The Price Floors feature (PBS-Java only) provides an open source framework for Publishers to configure Prebid price floors on their own or to work with a vendor who can provide floors.

A ‘floor’ is defined as the lowest CPM price a bid will need to meet for each Prebid auction. It’s a way for publishers to signal to bidders the price to beat, thereby protecting the value of their inventory.

The Prebid Server version of this feature is similar to the [Prebid.js Price Floors Module](/dev-docs/modules/floors.html) with a few differences. There are advantages to having this feature on the server-side:

- Mobile APP and AMP scenarios can support floors
- Floor data is cached by PBS, so using server-side floors may lighten the load on the browser and perhaps improve auction performance. It no longer has to load floor data with the PBJS package or make a dynamic fetch for them.

Finally, there are several differences between Prebid.js and Prebid Server floors:
- Custom schema attributes are supported in Prebid.js but not Prebid Server
- There are additional schema attributes supported in Prebid Server, e.g. country.
- Prebid Server only supports "Floor Syntax version 2"

Other than these differences, the syntax of the floors schema is identical between Prebid.js and Prebid Server, so floor providers should not need to change how they generate floors data.

## How it all works

## Defining Floors

### In the Request or StoredRequest

### Floor Providers

### Floors Schema

## Controlling Floors

## Bid Adapters

## Analytics Adapters


## Related Reading

- [Prebid Server Targeting](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting)
