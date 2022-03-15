---
layout: example
title: Individual Ad Unit Refresh / Infinite Scroll
description: Individual Ad Unit Refresh / Infinite Scroll

sidebarType: 1

about:
- Ability to <strong>refresh individual ad units</strong> - useful for infinite scrolling ad slots
- When auto-refreshing is done incorrectly, it could cause the same bids to be rendered repeatedly. For instance, when googletag.pubads.refresh() is called directly without removing the PBJS targeting, the same hb_ variables get re-sent to GAM, re-chosen, and re-rendered. Over and over without ever asking PBJS for updated targeting variables.  Please see <a href="/dev-docs/publisher-api-reference/setConfig.html#setConfig-auctionOptions">Auction Options</a> for more info.

jsfiddle_link: jsfiddle.net/Prebid_Examples/cu7tpexf/embedded/html,result

code_height: 1540

pid: 20
---
