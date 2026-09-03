---
layout: page_v2
title: Video Intro to the Professor Prebid browser extension
description: A video overview of Professor Prebid
sidebarType: 1
---

# A Video Overview of the Professor Prebid Browser Extension

{% include vimeo-iframe.html id="1003776317" title="1003776317" %}

Further Content:

- [Professor Prebid](/tools/professor-prebid.html)
- [Professor Prebid in the Chrome Web Store](https://chromewebstore.google.com/detail/professor-prebid/kdnllijdimhbledmfdbljampcdphcbdc)
- [Prebid.js Config Documentation](/dev-docs/publisher-api-reference/setConfig.html)
- [All videos](/overview/all-videos.html)

Related Videos

- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)

## Transcript

This video shows you how to use the Professor Prebid browser extension.

Anybody who needs to inspect, troubleshoot, or debug a Prebid.js integration will find Professor Prebid useful, particularly publisher developers and AdOps team members.

One final note before we jump in: like the other components of Prebid, Professor Prebid is constantly being improved. As a result, the look and feel of the UI may change over time.

Professor Prebid is an extension for the Chrome browser that displays detailed real-time information about auctions that occur during your browsing session, allowing you to examine Prebid.js auctions as they occur under a range of scenarios.

The ability to watch Prebid.js work in real time is useful for testing and validating updates to your Prebid.js configuration. It’s also an invaluable tool for uncovering and fixing problems that hamper Prebid.js’s performance.

Now, we’ll walk through Professor Prebid step-by-step.

To use Professor Prebid, open Chrome, visit the Chrome Web Store, and install Professor Prebid.

Then, visit the page you would like to inspect and click the Prebid icon in your browser’s toolbar.

If Prebid.js isn’t installed or isn’t triggering auctions, you’ll see a message explaining that Professor Prebid doesn’t detect an instance of Prebid.js.

In the upper right hand corner of the extension window, there are buttons to open Professor Prebid’s documentation in a new tab and to refresh the page.

Next, let’s explore the Ad Units Section.

The Ad Units section shows essential auction statistics and list of the Ad Units for which Prebid Requested bids. This tab shows all of the essential information about your Prebid session in one place.

At the top of the window, you’ll see the Prebid.js version, the timeout duration that is configured for the active instance of Prebid.js, the number of Prebid Ad Units that are active on the page, the number of bidders that are active, the total number of bids received from bidders, the total number of “no bid” responses, and the number of console or warning errors that have occurred during the session.

Clicking the Events button will open up a window that shows the warning and error messages. The messages are useful for troubleshooting issues related to bidders, user identification, consent management, and much more. The main content of the Ad Units Tab is a table that includes a row for each active ad unit. The first column shows the code that identifies the ad unit.

The second column includes information about the media types that the ad unit supports. Media types are also known as ad formats. Clicking inside this column will open a window that shows the full media type JSON. It’s easy to copy the JSON and paste it into your favorite text editor for closer inspection.

The third, right-most column shows the list of bidders that are enabled for the ad unit. Bidders that returned valid bids will be shown in blue, along with their bid CPMs. Bidders who were selected to display ads by the primary ad server will be shown in orange. Clicking any bidder will display the bid request and bid response JSON objects for the bidder on the specific ad unit.

The bids section is next. It shows a list of bid responses that Prebid.js received from your bidders across all of the active ad units on the page. The list can be filtered to show bids only, or no bid responses only.

The bids table identifies bidders using their bidder code. If you use alias bidders, then the bidder code will be the alias name. It also shows the bid CPM, the bid currency, the code of the ad unit associated with the bid, the dimensions of the banner ad or video that the bidder returned, and the media type associated with the bid.

Clicking the arrow next to any row will expand the row to show detailed information about the bid. The icon in the upper left hand corner will expand all of the rows.

The bid details will include additional information about the contents and attributes of the bidder’s bid response. These include the bidder’s response time in milliseconds, and the bid source, which is “client” for bidders that are integrated to Prebid.js using the bidder’s own client-side Prebid adapter, and “s2s” for bidders that are integrated through Prebid Server.

The Bid Cache Period is the amount of time in seconds that Prebid.js will cache valid bids for use in future auctions on the same ad unit. The ad server targeting section contains a list of the key- value pairs that Prebid.js sent to the primary ad server for the bid.

Next, we’ll look at the timeline section, which allows you to investigate auction timing and bidder timeouts. It shows a chart of bidder response times for each auction that Prebid.js has run during your session. This chart can be useful for identifying issues with bidder timeouts and for fine-tuning the bid timeout settings. The Auction time represents the total amount of time in milliseconds that Prebid.js took to execute the auction.

The bid timeout setting in the Prebid.js configuration sets the maximum possible auction time, but auction times may be shorter in cases where all bidders respond within the bid timeout window. For more information about bid timeouts, check out our Guide to Timeouts in Prebid video.

The next section, Config, displays your Prebid.js configuration in an easy-to-read format. It includes the most important parameters of Prebid.js, including price granularity, auction settings, bidder settings, Prebid Server configuration and user ID settings, The cards on this view can be clicked to show an expanded detail view. The contents of this view will depend on the modules you’ve installed. For example, if you have installed Consent Management modules, you’ll see configurations relevant to them here.

Please note that this tab is a summary of the Prebid.js configuration. For a more detailed look, use the pbjs.getConfig(); method in the browser console. A link to the documentation on the Prebid.js configuration can be found in the notes below.

The User ID section comes next. It allows you to see UserID module configurations and verify that user IDs are being set correctly. This section includes a table that shows the user IDs that the Prebid.js User ID module is able to access. The table shows the source, the User IDs, and the atype, which is the user agent type as defined by the Open RTB Extended Identifiers specification.

The Config tab within the User ID screen shows the User ID configuration for each User ID submodule that has been installed to Prebid.js. For more information on user ID module configuration, check out our video on the subject. You can find the link in the description below.

The next section, tools, includes a collection of powerful utilities for testing, troubleshooting, and debugging Prebid.js The Tools tab includes a shortcut button to the Google Ad Manager console, a button that opens the Professor Prebid debug tab inside of the Chrome developer tools, and a button that clears your Prebid session data from Professor Prebid. After pressing the Delete Tabinfos button, you’ll need to refresh the page to see auction info again.

You can also enable the Ad Unit Info Overlay, which places a semi-transparent overlay over the divs in the web page that are linked to Prebid Ad Units.

The overlay includes information about the ad server line item and creative that were delivered to the slot. If a Prebid bid won this slot, the overlay will include essential bid information such as bidder name, CPM, and response time.

Below the Ad Unit Info Overlay toggle is a toggle that enables Prebid debug mode, which causes Prebid to print information about its activity to the browser console.

The final section of the Tools tab is rules, which allows you to simulate specific auction scenarios for testing and troubleshooting. This is a powerful tool that saves time during the troubleshooting process, because you’ll spend less time searching for an auction that meets the conditions you need to test.

Let’s say for example that you want to test to make sure that a specific bidder’s ads are rendering properly. Testing this scenario on a normal test page or production page could be difficult, because the bidder won’t always win the auction. Rules will allow you to override the bidder’s CPM with a high price and cause that bidder to win the auction reliably, triggering the rendering process.

Rules can be applied to specific ad units, specific bidders, or a combination of the two,

and the aspects of the auction they are able to override include bid CPMs, deal IDs, bid media types, and more. Rules are a powerful feature that allow developers and QA teams to test changes to Prebid.js quickly and thoroughly before going live.

The final section, version displays information about the Prebid.js version running on the page.

Prebid.js is constantly being improved by the open-source community. To take advantage of all that Prebid.js has to offer, you’ll want to keep your installation up-to-date. The version section of Professor Prebid will display the version of Prebid.js that’s installed to the page. When the installed version is older than the current version in Prebid’s main branch, this tab will outline the key differences between the two versions.

That’s it for this overview of Professor Prebid. To learn more, check out the documentation at docs.prebid.org. To install the extension, visit the Chrome Web Store. 
