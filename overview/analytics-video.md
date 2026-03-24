---
layout: page_v2
title: Video Intro to Prebid.js Analytics
description: Video Intro to Prebid.js Analytics
sidebarType: 1
---

# Video Intro to Prebid.js Analytics

How to utilize reporting with Prebid.js.

{% include vimeo-iframe.html id="957374949" title="957374949" %}

Further Content:

- [Prebid.js Events](/dev-docs/publisher-api-reference/getEvents.html)
- [Prebid.js Analytics Solutions](/overview/analytics.html)
- [All videos](/overview/all-videos.html)

Related Videos:

- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)

## Transcript

This video is an overview for publishers interested in learning about analytics in Prebid.js. We’ll explain why you might want to use analytics for Prebid, how it works, and how to get started. We’ll also share some best practices for maximizing the value of the insights you gather through Prebid analytics.

This video will focus on how to use analytics with Prebid.js for header bidding on websites. It is possible to work with analytics via Prebid Server for mobile apps and other use cases.
### Why Analytics for Prebid?

We’ll start off with a discussion of why you might want to use analytics with Prebid.js.

There are three basic purposes that analytics serves:

First, analytics allow your business to track basic key performance indicators like revenue, fill rate, and CPMs for your Prebid auctions. These statistics are critical to running any type of advertising-supported media property. 

Second, a powerful analytics solution allows you to fine-tune the settings of your Prebid auctions to maximize performance. In other videos, we’ve touched upon the ways in which you can improve performance by optimizing bidder selection, bidder timeouts, and price floors. Analytics gives you the data you would need to make these optimizations. 

Third, analytics helps you monitor the health of your Prebid installation. Checking analytics regularly with allow you to catch issues with bidders or the Prebid auction itself quickly, minimizing the impact they have on your business.

### How Analytics Works

Next, let’s discuss how analytics works at a high level in Prebid.js.

Prebid.js does not include an analytics feature by default. Instead, it uses a modular, open-source approach that allows publishers to plug in the solution that meets their needs best. 

A Prebid.js analytics solution has two components: an analytics adapter for Prebid.js and an analytics data pipeline.

The analytics adapter is a Prebid.js module that gathers data about each Prebid auction. Many analytics adapters are open-source and are housed in the Prebid.js repository. 

Prebid.js allows analytics adapters to gather data about many events during the Prebid.js auction process. An 'event' is the coding mechanism by which Prebid.js informs other modules about the Prebid load, bid requests and responses, ad server requests, and much more.

A full list of events that analytics adapters are able to gather can be found at the link in the description below. 

Besides the analytics adapter, the other major component of an analytics solution is the data pipeline. The pipeline is responsible for receiving notifications about Prebid events from the analytics adapter and for processing and packaging the data for storage in a database that is accessible to reporting interfaces and APIs.

Prebid.org does not offer data pipeline solutions, and data pipeline technologies aren’t part of Prebid’s open-source repositories. Companies building analytics solutions will usually build an analytics pipeline by connecting together data processing and storage technologies from other open-source communities like Apache.

For each Prebid.js auction, the analytics adapter gathers the event data and transmits it to the analytics pipeline, which is responsible for processing and aggregating the data. Connected to the data pipeline will be an interface that allows you to view the data in the form of reports or dashboards.

Any auction that occurs on a website using Prebid.js will rely on the Prebid.js analytics adapter to handle analytics. This includes mixed auctions where some bidders are running client-side and others are running server-side with Prebid Server. 

### Getting Started with Prebid.js Analytics

Next, you’ll learn how to get your own analytics solution for Prebid.js up and running.

You can develop your own Prebid Analytics solution or use an analytics product from a company in the Prebid community. 

If you choose to build your own solution, you can write your own analytics adapter or use Prebid’s generic analytics adapter, which is built to be able to gather all the events you need from the Prebid auction and interface with any analytics data pipeline. You’ll also need to develop your own methods in your data pipeline for processing analytics data and storing it somewhere.

There are also many plug-and-play analytics solutions from companies in the Prebid community. For a list of existing Prebid solutions, check out the analytics adapters page at docs.prebid.org. This link can be found in the notes below. 

When you’re ready to set up analytics, you’ll work with your analytics or server provider to set up a data pipeline and reporting interface on the server side, then you’ll add the analytics adapter to your Prebid.js build and set it up in the configuration. 

The analytics configuration allows you to limit the events that the analytics adapter has access to using an allowlist or blocklist. You can also configure the adapter to report only on a randomized sample of your auctions, which might be helpful for reducing data storage and processing costs.

You can install multiple analytics solutions for Prebid.js by simply including multiple analytics adapters in your Prebid.js build. Many publishers use multiple solutions for different purposes. For example, you may use one module for everyday reporting, while another powers a dynamic price floor optimization algorithm. 

### Choosing an Analytics Solution

With these requirements in mind, let’s explore the variables to consider as you select an analytics solution for yourself. You can think of this section as a checklist of points to consider as you choose an analytics partner from the thriving Prebid ecosystem.

The first thing to consider is the data collected. For instance, the set of events the analytics adapter tracks, how it converts the log-level events into metrics, and the dimensions, such as site or country, that you can use to filter or group the data. The goal is to ensure that the questions you’ll be asking can be answered with the data available to you. 

For example, let’s say you want to optimize your auctions performance by minimizing bidder timeouts. To do so, you’ll need to be able to track bidder timeout rates and, ideally, bidder response times across a variety of pages, geographic locations, and device types. 

The next thing to consider is the time frame over which the analytics will be available. Many publishers need to be able to analyze their current performance compared to a past time period. It’s typical to track performance trends over multiple years, which means that multiple years’ data will need to be stored. Also, keep in mind that many analytics providers will include less detail in older data, so the dimensions and metrics that are available to you for auctions that occurred this week may not be available for auctions that occurred further in the past.

The third aspect of analytics to consider is data access. What is the process for viewing data and pulling reports like? Some analytics solutions offer robust web applications that allow you to explore the data on your own using customizable dashboards, analytics query builders, alerting, scheduled reports, and API access. Others are more basic and require you to submit a request for data through an account manager. Again, understanding your needs is important. Let’s consider for example a large publisher with multiple business units and stakeholders who each need to be able to see a tailored view of the data. A publisher like this one may want a solution that offers high quality dashboards or emailed scheduled reports.

The fourth dimension to consider is privacy regulation support. You'll want to work with your lawyers to understand the data rules your company requires in different geographic regions. For instance, some regulations consider IP addresses private information, so the analytics system you choose or build should not store IP addresses in those regions. 

The final variable is cost. Does the provider charge for analytics, how does the pricing work, and, most importantly, how much will analytics cost you each month? Some providers charge a flat fee for their services, while others charge fees that are proportional to the volume of data they need to store. Some providers have one complete product that they offer to all customers, while others offer various packages that include different sets of features and services.

That’s all for this video on Prebid analytics. Thanks for watching.

## Related Reading

- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [All video overviews](/overview/all-videos.html)
