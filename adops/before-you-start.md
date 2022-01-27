---
layout: page_v2
title: Ad Operations View of Prebid
head_title: Getting Started with Prebid for Header Bidding
sidebarType: 3
sbUUID: 3.2
---



# Ad Ops and Prebid
{: .no_toc }

Prebid products are designed to integrate with the ad ops line item configuration on the publisher's selected ad server. Whether using Prebid.js, Prebid Server or Prebid Mobile, bid targeting parameters are passed to the ad server. The ad server then attempts to  match the targeting parameters to a preset line item. If successful, that line item is compared to other line items and if the Prebid bid wins the auction, the creative is returned to the web page or app for display.

{% capture importantNote %}
This page assumes you have read [Getting Started with Prebid.js](/overview/getting-started.html), though it applies to Prebid SDK and Server as well.
{% endcapture %}

{% include alerts/alert_important.html content=importantNote %}

* TOC
{: toc }

## Supported ad servers

The table below lists ad servers supported by Prebid and provides links to step by step documentation for the configurations those ad servers support.

{: .table .table-bordered .table-striped }  
| Server       | Page                                                                                                                                    |
|--------------+-----------------------------------------------------------------------------------------------------------------------------------------|
| **Google Ad Manager**      | [Step by step guide to Google Ad Manager setup](/adops/step-by-step.html)                                                          |
|              | [Send all bids to the ad server](/adops/send-all-bids-adops.html)                                                    |
|              | [Setting up Prebid for AMP in Google Ad Manager](/adops/setting-up-prebid-for-amp-in-dfp.html)                                     |
|              | [Setting up Prebid Video in Google Ad Manager](/adops/setting-up-prebid-video-in-dfp.html)                                         |
|              | [Setting up Prebid Native in Google Ad Manager](/adops/gam-native.html)                                       |
| **AppNexus** | [Setting up Prebid with the AppNexus Publisher Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html) |
| **Smart Ad Server** | [Setting up Prebid.js with Smart Ad Server](/adops/setting-up-prebidjs-with-Smart-Ad-Server.html) |
| **FreeWheel** | [FreeWheel Guide for Premium Long-Form Video](/adops/setting-up-prebid-video-in-freewheel.html) |

## Decide on price bucket granularity

On a publisher's selected server the ad ops team will need to setup line items. These line items provide targeting information for the ad server, to include the CPM per impression. Prebid will pass in a bid's targeting parameters via key-values. The ad server will read these incoming targeting parameters and search through the line items for a match.

Example:

* Prebid.js is going to call your bidders for their price, then pass it into your ad server on the query-string. You want to target this bid price with a line item that earns you the same amount if it serves.

* If you had 1-line item for every bid at a penny granularity of $0.01, $0.02, $0.03, ..., 1.23, ..., $4.56 you'd need 1,000 line items just to represent bids from $0-$10. We call this the “Exact” granularity option.

* Creating 1,000 line items can be a hassle, so publishers typically use price buckets to represent price ranges that matter. For example, you could group bids into 10 cent increments, so bids of $1.06 or $1.02 would be rounded down into a single price bucket of $1.00.

Our recommendation is to start with $1 or 10 cent granularity until you're more comfortable with Prebid.js. At $1, you only need to setup 10-20 line items – easy. When you're ready, get more granular with the price buckets to improve yield.

{% capture dfpNote %}

[Google Ad Manager has a limit](https://support.google.com/admanager/answer/1628457?hl=en#Trafficking) of 450 line items per order, which includes archived line items. If you are designing your own granularity setup, make sure you do not exceed that amount. Refer to our recommended pre-configured granularities in Prebid's API reference under the [Set Config Price Granularity instructions](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity).
{% endcapture %}

{% include alerts/alert_note.html content= dfpNote %}


## One set of line items for all bidders vs. a set of line items for each bidder

### One set of line items for all bidders

One set of line items for all bidders is the recommended way of setting up your line items.  Choose this option if you prefer an easier, low-maintenance setup:

- It's quicker and easier to setup, because you only have to create one set of line items.
- It's easier to maintain because adding more bidders requires no change to your line item setup.
- It's less error-prone because you only need to maintain 3 keywords:

{% include default-keyword-targeting.md %}


{% capture successNote %}
For instructions on setting up pre-bid with one set of line items for all bidders, see [Send Top Bid to Ad Server - Step by Step guide to Google Ad Manager setup](/adops/step-by-step.html).
{% endcapture %}

{% include alerts/alert_tip.html content=successNote %}


### One set of line items for each bidder

Choose one set of line items for each bidder if you:

- Have to rely on line item reporting (not query string reporting) to get winning bid by bidder analytics
    - With one set of line items for all bidders, Prebid.js only sends the highest bid to the ad server (the decision logic of choosing the highest bid can be customized by you). This is sufficient if the winning bids matter the most to you. For example, a bidder bidding 100% of time but losing in every auction still has a fill rate of 0%. However, if having access to all bid information is important to you, use one set of line items for each bidder.

- Require bid landscape data for header bidding partners
    - With one set of line items for all bidders, Prebid.js sends the bidder information (Which bidder has the highest price) via a keyword `bidder=bidder_name`. To run a report to attribute winning bids to bidders, you will need to rely on your ad server's keyword reports. Google Ad Manager supports this, but some ad servers do not. Google Ad Manager does not support running reports for more than 2 keywords. Therefore, if you have existing reports that already rely on keywords, and you want to add a winning bid by bidder dimension, use one set of line items for each bidder.

- Requires setting more keyword targeting within your ad server. The table below lists the required and optional keys for targeting with each of your header bidder partners.

{% include send-all-bids-keyword-targeting.md %}

{% capture successNote %}
For instructions on setting up pre-bid with one set of line items for each bidder, see [Send all bids to the ad server - Ad Ops setup](/adops/send-all-bids-adops.html).
{% endcapture %}

{% include alerts/alert_tip.html content=successNote %}

## Safeframes

[SafeFrames are defined by the IAB](https://www.iab.com/guidelines/safeframe/) as a "managed API-enabled iframe that opens a line of communication between the publisher page and the iframe-contained ad creative."

When setting up line items in your ad server, you'll need to consider whether to make the creatives safeframes or not. In general, for standard banner and native, safeframes are a good idea. Certain special mediatypes cannot use safeframes.

### Bidders known to be incompatible with safeframes

{% assign bidder_pages = site.pages | where: "layout", "bidder" | where: "safeframes_ok", false %}
<ul>
{% for page in bidder_pages %}
<li>{{ page.title }}</li>
{% endfor %}
</ul>

There may be others, please check with bidders directly if you have questions about their support.

## Work together with your dev team

Implementing header bidding requires much more collaboration with your dev team than normal Ad Ops setup. For example:

> Setting up price granularity requires you and the dev team working together to ensure the price buckets match. We have seen cases when the code on page sends $0.10 increments, while the line item setup expects $0.50 increments. This results in the ad server not catching 80% of the bids.

## Related Topics

- [Getting Started with Prebid.js](/overview/getting-started.html): How Prebid.js works at a high level.
- [Prebid.js and Ad Server Key Values](/features/adServerKvps.html)
- [What is Prebid?](/overview/intro.html): Overview and history of header bidding and Prebid.js.
+ [Docs by Format](/dev-docs/docs-by-format.html): Engineering and ad ops docs arranged by ad format (video, native, etc.).
