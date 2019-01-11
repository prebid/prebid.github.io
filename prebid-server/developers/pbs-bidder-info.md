---
layout: page_v2
title: Prebid Server Bidders - Additional Info
description: Additonal Information about Prebid Server Bidders
pid: 1
top_nav_section: prebid-server
nav_section: prebid-server
sidebarType: 5
---

# Additional Bidder Information
{:.no_toc}

Some Prebid Server bidders require additional information for integration. For basic information and an up-to-date list of all Prebid Server bidders, see [Prebid Server Bidders]({{site.baseurl}}/dev-docs/prebid-server-bidders.html).

* TOC
{:toc}

## AppNexus

### Using Keywords

The `keywords` bidder param (`../../static/bidder-params/appnexus.json`) will only work if
it's enabled for your Account with AppNexus.

**This permission is _distinct_ from the keywords feature used by Prebid.js.**

If you want to enable AppNexus keywords, contact your account manager.

## Audience Network

### Mobile Bids

Audience Network will not bid on requests made from device simulators. When testing for Mobile bids, you must make bid requests using a real device.

## Beachfront

To use the beachfront bidder you will need an appId from an exchange account on [https://platform.beachfront.io](https://platform.beachfront.io). For further information, please contact [adops@beachfront.com](mailto:adops@beachfront.com).

## Rubicon

Contact your Rubicon Project account manager to get set up with a login and cookie-sync URL to run your own Prebid Server.

You will be given instructions, including the available endpoints.

## Sovrn

Sovrn supports two parameters to be present in the `ext` object of impressions sent to it:

- `tagid`: A string containing the sovrn-specific id(s) for the publisher's ad tag(s) they would like to bid with. This is a required field.

- `bidfloor`: The minimum acceptable bid, in CPM, using US Dollars. This is an optional field.
