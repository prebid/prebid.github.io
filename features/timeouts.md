---
layout: page_v2
title: Prebid Ad Slot
description: The Prebid Ad Slot
sidebarType: 1
---

# Prebid Timeouts
{: .no_toc}

* TOC
{:toc}

## How it Works

Header bidding needs time to collect bids. Publishers update their
pages to delay the ad server call for just long enough to get bids, but
not so long as to reduce overall revenue. This delay is controlled by
a number of timeouts and adjustments.

This diagram summarizes timeouts in Prebid.js and Prebid Server:

![Timeout](/assets/images/dev-docs/prebid-timeouts.png){:class="pb-xlg-img"}

1. **Failsafe Timeout** - This is a timeout entirely outside of Prebid.js. It's a
JavaScript setTimeout() that publishers should consider establishing
after the Prebid.js code is loaded. It's a safety net that invokes the ad
server callback in case something goes wrong. In all regular scenarios,
Prebid.js will have already invoked the callback before this timeout is reached. This value should be much larger than the auction timeout.
2. **Auction Timeout** - This value defines the amount of time the Prebid is allowed to coordinate 
header bidding activities. Determining this value is a delicate balance: too short, and header bidding won't have enough time to take place; too long, and revenue
may go down due to delaying the ad server call to the point where users have left
the page. Publishers must determine the value that works for them, considering
a balance of factors: average user time on page, direct sellthrough, value of different ad channels, and average user network delay.
3. **Prebid Server s2sConfig Timeout** - In order to make sure that Prebid Server
bids can get back to the client in time for the ad server call, publishers
should consider setting [s2sConfig.timeout](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) to a value lower than the Auction Timeout. How much lower depends on average user network delay, but should probably be within the range of 50%-75% of the Auction Timeout. This value is sent in the Prebid Server OpenRTB as `tmax`.
4. **Timeout Adjustment** - In order to minimize the chance of missing the client-side
ad server call, Prebid Server shaves off a safety buffer and responds to Prebid.js before the original `tmax` value time is up. See the [Prebid Server timeout reference](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#timeout) for details.

## Troubleshooting Timeouts

In general, your [analytics reports]() will alert you to the existence of timeouts.

Engineers can get more insight into details by following [this process](/troubleshooting/troubleshooting-guide.html#configure-auction-options-with-logging)

Below are tips for tackling different scenarios.

### If a few bid adapters regularly timeout

Analytics reports would show this scenario as timeouts for a subset of adapters.

1. It could be caused by geographic distribution. Try looking at timeout data by geographic region for patterns. Work with your contact at those bidders to understand their service areas and service level agreements. Remedies might include: not calling certain bidders in particular geographic regions, moving those bidders first, raising the overall timeout
2. Or you might consider using the [secondaryBidders](/dev-docs/publisher-api-reference/setConfig.html#auction-options) feature. This will cause Prebid to not wait for the named bidders.

### If all bid adapters have regular timeouts or if the failsafe timeout fires often

If analytics reports show a concerning level of timeouts across all bidders:

1. Again, geographic distribution is worth checking. For example, publishers with many users in the southern hemisphere might see longer network delays if all of their bidders are hosted in the northern hemisphere. And again, working with major bidder partners might be helpful here.
2. Timeouts can also be caused by waiting too long in the pre-auction. Use analytics to measure the amount of time that elapses between the start of the auction and when the bids are actually sent out. If that's a sizeable portion of the overall timeout period, check how long you're allowing the Consent Management Platform, User ID modules, and Real Time Data modules to take. You may need to scale back how long each of them is allowed. Many vendors request prioritization and long pre-auction periods, but you may want to A/B test to determine where the performance-revenue balance lies for your site.
3. Check if there are other resource-intensive javascripts running on the page. If Prebid.js cannot get attention from the browser to process bid responses, the timeout may fire more often. Work with your Product and Engineering teams to determine if some of these scripts could be moved to happen later after page load.
4. Check that the [usersync delay](/dev-docs/publisher-api-reference/setConfig.html#configure-user-syncing) is long enough to let the first auction run. Many vendors will want to usersync as soon as possible so the first auction carries their ID, but vendor cookie syncing can create quite a few network requests.

### If Prebid Server is timing out

If PBS takes too long to get back, then no server-side bidder will be able to submit a bid. 

1. Check that [s2sConfig](/dev-docs/modules/prebidServer.html).timeout is lower than the timeout given to Prebid.js. This accounts for the time it takes to get the PBS request there and back. The default value for s2sConfig.timeout is 75% of the PBJS timeout.
2. If you have server-side analytics available, check to see whether a subset of bidders may be causing the auctions to be delayed. 
    1. If so, there may be geography issues. Check the reports to see if the bidder's performance is better in certain regions and work with them to determine if there are different bidding endpoints.
    2. Note that there's no server-side equivalent of 'secondaryBidders'.
3. Check the Prebid Server [timeout adjustment](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#timeout) features. These can be used to lower the tmax value sent to bidders so they'll respond faster.

## Related Resources

- [FAQ: What should I set my timeouts to?](/dev-docs/faq.html#what-should-my-timeouts-be)
- [Prebid.js s2sConfig](/dev-docs/modules/prebidServer.html)
