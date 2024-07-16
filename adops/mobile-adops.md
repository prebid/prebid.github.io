---
layout: page_v2
title: Prebid Mobile Ad Operations
head_title: Prebid Mobile Ad Operations
description: Special considerations for Prebid Mobile Ad Operations
sidebarType: 3
---

# Prebid Mobile Ad Operations

This page covers some important things to know if you're setting up an ad server to support a mobile app integration with [Prebid SDK](/prebid-mobile/prebid-mobile.html).

As background, it should be noted that Prebid Mobile evolved separately from Prebid.js for a long time. The committees are now attempting to keep their decisions more uniform, but it may take some time to bring them back into better alignment.

## Important differences

These differences explain the special mobile procedures noted in other documents.

1. Outstream video in mobile must be implemented in GAM with AdUnits that support video adsizes and the `VastUrl` creative. This contrasts with Prebid.js which utilizes 3rd party HTML creatives for outstream video.
1. How ads are rendered is different in various scenarios. See the 'AdOps guidance' section in your ad server use case for details. This can be particular important when you are investigating discrepancies between reports from various sources.
1. You will need to consider whether you want Prebid Server to cache creatives. This answer will inform the contents of the Prebid Server configuration.

## Publishers using both Prebid.js and Prebid mobile

If your a company using both Prebid.js and Prebid mobile that employs "outstream" video (aka standalone, aka "accompanying content"), your line item setup will be more complicated.

Probably the easiest way to manage this scenario will be to create separate line items for placements running Prebid.js vs placements running Prebid mobile.
The Prebid.js line items will set up outstream video as 3rd party HTML while the mobile line items will set them up as video.

## Further Reading

- [Ad Ops Planning Guide](/adops/adops-planning-guide.html)
- [Ad Ops GAM setup for Prebid-Rendered apps](/adops/mobile-rendering-gam-line-item-setup.html)
- [Ad Ops AdMob setup for Prebid-Rendered apps](/adops/mobile-rendering-admob-line-item-setup.html)
- [Ad Ops MAX setup for Prebid-Rendered apps](/adops/mobile-rendering-max-line-item-setup.html)
