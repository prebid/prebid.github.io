---
layout: page_v2
title: Prebid Ad Slot
description: The Prebid Ad Slot
sidebarType: 1
---

# Prebid Timeouts

Header bidding needs some time to collect bids. Publishers update their
pages to delay the ad server call for just long enough to get bids, but
not so long as to reduce overall revenue. This delay is controlled by
a number of timeouts and adjustments.

The following diagram summarizes the timeouts in Prebid.js and Prebid Server.

![Timeout](/assets/images/dev-docs/prebid-timeouts.png){:class="pb-xlg-img"}

1. **Failsafe Timeout** - this is a timeout entirely outside of Prebid.js. It's a
javascript setTimeout() that publishers should consider establishing
after the Prebid.js code is loaded. It's a safety net that invokes the ad
server callback in case something goes wrong. In all regular scenarios,
Prebid.js will have already invoked the callback. Its value should be much larger than the auction timeut.
2. **Auction Timeout** - this defines how long the page has to coordinate the
header bidding activities. Determining this value is delicate balance: too short, and header bidding won't have enough time to take place. Too long, and revenue
may go down due to delaying the ad server call to the point where users have left
the page. Publishers must determine the value that works for them, considering
a balance of factors: avg user time on page, direct sellthrough, value of different ad channels, and avg user network delay.
3. **Timout Buffer** - the javascript timer environment is not perfectly accurate
because competing javascript on the page can delay the header bidding auction
or the recognition that auction results have returned. Prebid.js adds a 400ms buffer to the Auction Timeout to account for the noisy environment. Publishers can
change this value by with the [`timeoutBuffer`](/dev-docs/publisher-api-reference.html#setConfig-timeoutBuffer) configuration.
4. **Prebid Server s2sConfig timeout** - in order to make sure that Prebid Server
bids can get back to the client in time for the ad server call, publishers
should consider setting the [s2sConfig.timeout](/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server) to a value lower than the Auction Timeout. How much lower depends on avg. user network delay, but is probably within the 
range of 75%-50% of the Auction Timeout. This value is sent in the Prebid Server
OpenRTB as `tmax`.
5. **Timeout Adjustment** - in order to minimize the chance of missing the client-side
ad server call, Prebid Server shaves off a safety buffer and responds to the client a little before the `tmax` value. The Prebid Server host company sets two
configurable values (auction.timeout-adjustment-ms and auction.cache.expected-request-time-ms), which can be expected to shave 30-100ms off of tmax. e.g. if tmax=1000 and the Prebid Server host company has 40ms of safety margin configured,
bidders will actually timeout at 960ms.

### Prebid SDK Timeouts

Apps using the Prebid SDK can set the Prebid Server tmax value with the `setTimeoutMillis()` function.

This value will override the default that's set in the top level stored request.

There is no "Timeout Buffer" in the SDK scenario, but Prebid Server will shave
off the Timeout Adjustment.

### AMP Timeouts

AMP pages may pass a timeout attribute on the query string. This value will override the default that's set in the stored request.

There is no "Timeout Buffer" in the AMP scenario, but Prebid Server will shave
off the Timeout Adjustment.

## Related Resources

- [Prebid.js timeoutBuffer](/dev-docs/publisher-api-reference.html#setConfig-timeoutBuffer)
- [FAQ: What should I set my timeouts to?](/dev-docs/faq.html#what-should-my-timeouts-be)
- [Prebid.js s2sConfig](/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server)
