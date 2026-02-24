---
layout: page_v2
title: Publisher Sustainability Best Practices
description: Publisher Sustainability Best Practices
sidebarType: 7
---

# Publisher Sustainability Best Practices
{:.no_toc}

- TOC
{:toc}

## Overview

This page collects recommendations for Publishers interested in exploring ways to save carbon emissions while preserving revenue. See the [Sustainability Portal](/support/sustainability-portal.html) for more background.

Regardless of the Prebid implementation, publishers seeking to improve sustainability and supply chain stance should focus on the following major areas:

1. Work with Demand Partners that align with your sustainability goals  
2. Monitor behavior to ensure those goals are met and to also discover areas of optimization particularly related to Geo and Device participation  
3. Configure Prebid products with the minimum bidders and setting which meet your sustainability goals

## General Advice

### Tip 1: Choose bidders that meet your requirements

When choosing bidders consider your internal requirements for HTTP2 support, adapter size, bid response time, response size, cookie loads and more.

The docs at [https://docs.prebid.org/dev-docs/bidders.html](/dev-docs/bidders.html) contain information related to bidder feature support.

Questions to ask bidders before enabling them:

1. What is your average server response rate and latency?
1. Do you filter out consistently slow/non-responsive demand sources to reduce unnecessary server load and energy consumption?  
1. Do you have any capability to measure and report the carbon footprint of individual demand source activities (e.g. computational resources used per bid request)?  
1. What optimization strategies do you employ with your demand sources to reduce overall infrastructure demands, such as implementing intelligent throttling, bid caching, or selective bidder calls based on performance?

## Prebid.js

This is advice specific to Prebid.js.

### Tip 2: Reduce build size

Only build prebid with the bidders, modules and features that you intend to use. 

The on-site builder is available at [https://docs.prebid.org/download.html](/download.html) and instructions for building manually are in the Github repo [https://github.com/prebid/Prebid.js/blob/master/README.md\#Build](https://github.com/prebid/Prebid.js/blob/master/README.md#Build). Building manually the JavaScript object name to be defined, but is otherwise the same.

### Tip 3: Monitor bid performance with client-side analytics

Major areas to consider here are bid rates and participation which indicates whether the bid is meaningful. Fruitful areas to investigate first are geographic and currency support for the bidder. Consider delivering different script configurations based on Geo and Currency or using Header Bidding management providers which provide this service.

Configure an analytics provider that can track the related areas of interest from the building and monitoring section.

- [Analytics Adapters](/overview/analytics.html)
- [Building your own analytics adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)

### Tip 4: Dynamically determine which bidders to use based on analytics

Prebid.js AdUnits can be configured to call different sets of bidders and modules in different geographic areas and for different devices. Ideally, this also implies different builds for each of these combinations. If this capability is not available in-house, consider a [managed service](https://prebid.org/managed-services/) that provides automatic performance-based reconfiguration of your Prebid.js configuration.

For example, instead of running a global Prebid.js build, consider creating separate builds for North America, Europe, APAC, or other regions important to your business. Each of those builds would be tailored to have the relevant bidders and modules.

### Tip 5: Use Professor Prebid

[Professor Prebid](/tools/professor-prebid.html) is a Chrome browser extension that provides setup validation, performance analysis, debugging and education about the live page behavior. Professor Prebid provides a wealth of information including:

1. Adunits  
2. Bids  
3. Timeline  
4. Config  
5. User ID  
6. User Sync  
7. Version Information  
8. More...

It's a great diagnostic tool, but is limited to the current page you are viewing, so you'll still need an analytics adapter to provide comprehensive reports.

- [Professor Prebid User Guide](/tools/professor-prebid.html)
- [Chrome Plugin](https://chromewebstore.google.com/detail/professor-prebid/kdnllijdimhbledmfdbljampcdphcbdc?pli=1)

### Tip 6: Use Other Debug Tools

Use the [Prebid.js debugging module](/dev-docs/modules/debugging.html) to see other available data including bidder debug and the ability to inject configuration, intercept bids and mock responses. 

### Tip 7: Check client-side syncing configuration

Most bidders want to perform cookie syncing, which can impact page performance, and doesn't always even help monetization on all browsers. Evaluate your [cookie sync config](/dev-docs/publisher-api-reference/setConfig.html\#setConfig-Configure-User-Syncing) for each bidder to ensure it meets your requirements.

For example, you may consider:

- Whether it makes sense to turn off syncing in certain browsers.
- Limit certain bidders to pixel syncs which are lower impact than iframe syncs.

You can consider using [Professor Prebid's Usersync Info](/tools/professor-prebid.html#user-sync-network-inspector) tool to investigate server-side syncs.

## Prebid Server

Ask your Prebid Server provider to provide guidance on how the sustainability profile of their global datacenters and traffic routing technology.

Ideally, your provider can handle user traffic in datacenters that are local to the user. e.g. North American user requests are processed in a North American datacenter.

Also, confirm that they regularly update Prebid Server to get the latest features.

### Tip 8: Monitor bid performance with server-side analytics

Watching bidder performance by geo, device, and channel can help you decide how to set up the adunits. Channel is "Prebid.js", "SDK", "AMP", etc -- any traffic source supported by Prebid Server. Ask your Prebid Server provider which analytics systems they can support.

### Tip 9: Determine whether it makes sense to run Prebid.js bidders server-side

If you're using Prebid.js, we recommend use of the [Server-to-Server Testing Module](/dev-docs/modules/s2sTesting.html) to determine which bidders can be run on the server side.

If your Prebid Server provider has energy-efficient datacenters, then it may make sense to explore running as many bidders as possible server-side. This can help you focus traffic to network connections powered by more sustainable energy sources than what end-users may be consuming.

### Tip 10: Disable bidders by datacenter

Ask your Prebid Server provider whether they're utilizing  bidder self-declared "Geographic Scope".
Several bidders have declared the regions in which they do business, so utilizing this information
can help everyone save money and carbon emissions.

GeoScope examples

- [Global](https://github.com/prebid/prebid-server/blob/master/static/bidder-info/adf.yaml)  
- [US & CAN](https://github.com/prebid/prebid-server/blob/master/static/bidder-info/imds.yaml)

### Tip 11: Optimize server-side syncing

Ask your Prebid Server provider to confirm how they've set up cookie-syncing and whether they support setting:

- account-specific sync priority
- account-specific sync limits
- cooperative syncing

See the relevant documentation for [PBS-Java](https://github.com/prebid/prebid-server-java/blob/master/docs/application-settings.md) and [PBS-Go](https://github.com/prebid/prebid-server/blob/master/config/usersync.go).

You can consider using [Professor Prebid's Usersync Info](/tools/professor-prebid.html#user-sync-network-inspector) tool to investigate server-side syncs.

## Identity Modules

### Tip 12: Minimize the number of Extended IDs

Some Extended IDs (aka EIDs) are still experimental. The Prebid community tests some EIDs, but conclusions are often difficult to draw. Until we have more conclusive evidence on which EIDs are the most helpful for monetization, we encourage publishers to continue their own tests, which often means testing a dozen or more EIDs. You should monitor and reconfigure as value is proven (or not) with your properties.

See the [Prebid Identity Overview](/identity/prebid-identity.html)

## Prebid Mobile

Prebid Mobile uses Prebid Server, so the recommendations above are relevant.

There are no recommendations specific to Prebid SDK at this time.

## Further Reading

- [Prebid Statement on Sustainability](/overview/statement-on-sustainability.html)
- [Prebid Sustainability Portal](/support/sustainability-portal.html)
