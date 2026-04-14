---
layout: page_v2
title: Video Intro to Timeouts in Prebid.js
description: A video overview of Prebid.js Timeouts
sidebarType: 1
---

# A Video Overview of Timeouts in Prebid.js

{% include vimeo-iframe.html id="1014195522" title="1014195522" %}

Further Content:

- [Prebid.js Timeouts](/features/timeouts.html)
- [All videos](/overview/all-videos.html)

Related Videos

- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Introduction to Server-Side Header Bidding](/dev-docs/pbsBidAdapter-video-overview.html)

## Transcript

This video covers the topic of bidder timeouts in Prebid auctions.

We’ll explain how and why timeouts occur in Prebid auctions, how they can affect your monetization, and what strategies you can use to minimize timeouts and maximize performance in Prebid.js and Prebid Server.

This video will be most useful to those with a strong understanding of the Prebid auction process. If you need a refresher, we recommend watching the Prebid.js Impression Flow and the Introduction to Server-Side Header bidding videos. These videos are detailed step-by-step walkthroughs of a Prebid auction.

Bidder timeouts are important to track because they affect your monetization. Timeouts represent lost bids, which means less competition for your ad impressions and weaker monetization than the scenario in which there are fewer timeouts. Later in this video, we’ll discuss strategies for optimizing monetization and bidder timeouts.

There are five general factors that influence whether or not a bidder's response will be time out. We’ll walk through each of these.

First make sure that you have solid measurement in place before beginning to optimize. Prebid’s robust analytics framework can be used to measure timeout rate, response time, and other critical metrics.

Optimizing a Prebid auction should always start with a clear understanding of what you are trying to achieve. Optimization is about finding the best balance in a tradeoff for you and your business. In this section, we’ll outline some basic principles and best practices to remember as you work to optimize your own auctions.

Next, understand what you are able to control to influence timeouts. You can make Prebid run more efficiently by fine-tuning your pre-auction processes and by optimizing the web page itself. You can also directly influence timeout rates by adjusting the timeout duration. This is the amount of time that you allow Prebid to execute its auction before concluding the auction and proceeding without timed out bids.

Timeout duration affects timeout rates: shorter timeout durations give bidders less time to respond and result in more timeouts. Longer durations are the opposite, resulting in lower timeouts and higher bid density.

However, it’s important to remember that there’s a tradeoff here. Timeout duration also affects the total auction time, and there are costs to longer auctions. The longer your timeout duration, the longer it will take on average for Prebid.js to complete its auction, call the primary ad server, and, ultimately, deliver ads to the website. Waiting too long to serve ads can result in lost impressions, which hurts monetization and creates a bad experience for demand partners. Slow-to-load ads can also contribute to poor user experience.

Therefore, timeout duration optimization is about striking a balance. It is rarely optimal to completely eliminate bidder timeouts, because this will result in costly tradeoffs. So you’ll want to determine a panel of metrics that allow you to measure performance holistically, then test variations on timeout duration and bidder selection continually to discover optimal setup.

Continual testing can be labor intensive, so many publishers use automated optimization tools. Some companies that offer analytics and Prebid management solutions also offer automated optimization services.

Make sure that the analytics solution you choose can measure the bidder timeout rate, which is the percentage of total bid requests to the bidder that timed out. Ideally, this metric is available for a variety of user locations and page types. It’s also helpful but not essential to be able to see the average response time for each bidder.

Check the video description for links to other videos and documentation about Prebid analytics.

If you’re unfamiliar with this type of hybrid setup, you can find the necessary context in our video on Server-Side Auctions with Prebid.js. The link is in the video description below.

The first is the timeout duration set in Prebid.js or Prebid Server. The more time that these auction systems give bidders to respond, the less likely those bidders are to time out. As a publisher, you have control over this setting for your auctions, and this setting is perhaps the most powerful tool you have for managing timeouts.

The second is the time that Prebid.js sometimes spends retrieving or processing data before sending bid requests. For example, Prebid.js might make requests to set user ID cookies, to gather first-party data, or to interact with a consent management platform.

Depending on your Prebid.js configuration settings, these pre-auction processes may delay the sending of bid requests, leaving bidders less time to respond and making timeouts more likely. Usually, these processes don’t occur on every auction, and are more likely to occur on the first page view of a user’s session within the domain.

Publishers also have lots of control: in the Prebid.js configuration, you’re able to set the amount of time that you will allow these processes, and you can also decide whether or not they should delay bid requests.

The third factor affecting timeouts is the speed of the bidder’s own internal processes for generating a bid. Some bidders are able to receive a bid request, determine their bid, and respond quite quickly, while others respond more slowly. A bidder’s average response time is an important metric to consider when you evaluate its performance.

The fourth factor is the network latency, which refers to the amount of time that the request and response messages spend traveling between the user’s device and the demand source’s server. This includes the user’s internet connection speed, their physical distance from the server that is receiving the request, and other factors. While you can’t always control these factors directly, you can fine-tune auction settings like the timeout duration and bidder selection according to the user’s location or connection type.

The fifth and final factor affecting timeouts is the web page itself. User’s devices are limited in their ability to perform processes and request data from server-side sources, and Prebid is just one of many components that need resources on a modern webpage. A busier page can result in more timeouts by slowing Prebid’s ability to run its auction.

Thanks for watching this video on timeouts in Prebid.js. Check out the link in the description below for more resources.

Let’s start with the basics: what is a timeout, and why is it important?

In this section, we’ll explain why timeouts happen.

Next we’ll discuss how to optimize timeouts in a Prebid auction.

We’d like to share one final best practice that relates to auctions on websites that include server-side bidders.

Each time the Prebid auction sends bid requests, it starts a timer and expects to receive responses from the bidders before the timer is finished.

A timeout occurs when a bidder fails to respond before the end of the timer.

When bidders are set up server side, Prebid.js will make a request to Prebid Server, which in turn makes server-side requests to bidders. Prebid.js and Prebid Server have independent bidder timeout settings, and it’s important to make sure that these are closely coordinated. If they aren’t, you can inadvertently cause your Prebid Server’s response to Prebid.js to time out and lose valuable server-side bids.

Thanks for watching this video on timeouts in Prebid.js. Check out the link in the description below for more resources. 
