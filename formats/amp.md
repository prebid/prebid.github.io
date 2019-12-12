---
layout: page_v2
title: AMP | Prebid
description: AMP Format
sidebarType: 6
---


# Accelerated Mobile Pages (AMP) Support

The [AMP Project](https://ampproject.org) speeds up web pages on mobile devices,
but also restricts header bidding wrappers like Prebid.js. Instead, AMP supports a method of header bidding called [Real Time Configuration](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-documentation.md)(RTC), which is implemented by Prebid Server.

At a high level, setting up AMP pages for header bidding with Prebid has these steps:

1. The publisher chooses a Prebid Server provider
1. The publisher establishes a set of AMP 'tag IDs' that map to a set of bidders and bidder parameters. For instance, a tag ID may be used for mobile banners in the sports area of the site, linking that ad unit to specific SSPs and inventory parameters.
1. These tag IDs are stored in Prebid Server. This allows bidders and parameters to later be changed without updating the AMP page.
1. Ad server line items for header bidding are established.
1. The publisher sets up and tests the AMP pages.


## Ad Ops

+ [Setting up Prebid for AMP in Google Ad Manager]({{site.baseurl}}/adops/setting-up-prebid-for-amp-in-dfp.html)

## Developers

+ [How Prebid on AMP works]({{site.baseurl}}/dev-docs/how-prebid-on-amp-works.html)
+ [Prebid AMP Implementation Guide]({{site.baseurl}}/dev-docs/show-prebid-ads-on-amp-pages.html)
+ [Prebid Server AMP endpoint documentation]({{site.baseurl}}/prebid-server/endpoints/openrtb2/amp.html)

