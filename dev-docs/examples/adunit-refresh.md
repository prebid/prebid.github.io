---
layout: example
title: Individual Ad Unit Refresh / Infinite Scroll
description: Individual Ad Unit Refresh / Infinite Scroll

sidebarType: 1

about:
- Demonstrates the ability to <strong>refresh individual ad units</strong>. This is useful for infinite scrolling ad slots.
- Keep in mind that when auto-refreshing is done incorrectly, it could cause the same bids to be rendered repeatedly. For instance, when googletag.pubads.refresh() is called directly without removing the PBJS targeting, the same hb_ variables get re-sent to GAM, re-chosen, and re-rendered over and over without ever asking PBJS for updated targeting variables.  See <a href="/dev-docs/publisher-api-reference/setConfig.html#setConfig-auctionOptions">Auction Options</a> for more info.

jsfiddle_link: jsfiddle.net/Prebid_Examples/cu7tpexf/embedded/html,result

code_height: 1540

pid: 20
---
