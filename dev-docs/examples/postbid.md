---
layout: example
title: Postbid Example
description: Postbid Example
sidebarType: 1



why_link: /overview/what-is-post-bid.html

about: 
- Postbid is a third-party tag creative you setup in your ad server that loads the whole Prebid.js package. Create a line item in the ad server targeting each ad unit on your page. The <strong>creative will contain the code below</strong>.
- If the ad unit supports multiple sizes, you'll need to do one of two things -- either create a Postbid creative for each desired size with that size hardcoded in the PBJS adunit, or use ad server macros to pass the size through to the creative. For example, in Google Ad Manager there are HEIGHT and WIDTH macros. 
- There is no need to create line items for each price bucket as the postbid creative is served after the ad server has chosen the line item. 
- This postbid creative <strong>supports passback</strong>. See how this works below.

jsfiddle_link: jsfiddle.net/Prebid_Examples/mtuq7kz0/embedded/html,result

code_height: 1450
---
