---
layout: page_v2
title: Key Values
head_title: Key Values
sidebarType: 3
sbUUID: 3.2
---

# Key Values

{: .no_toc }

- TOC
{: toc }

Prebid uses key-value pairs to pass bid information to the ad server. This puts key values at the core of how Prebid works. Without key values, Prebid would have no way of communicating with ad servers, and therefore no way to make header bidding part of the auction. This document explains how bid information is sent to the ad server, what information is sent, and options for modifying the amount and types of information that is sent.

## Sending Bids to the Ad Server

Prebid sends information to the ad server about the bids it receives by creating a query string of key-value pairs (KVPs) and attaching it to the ad request that is sent to the ad server. A portion of that query string might look something like this:

`?hb_pb=1.50&hb_adid=234234&hb_bidder=bidderA`

In this example, hb_pb is the bid price bucket (1.50), hb_adid is an identifier for the specific bid (234234), and hb_bidder is the name of the bidding SSP or exchange (bidderA). In order for a bid that comes from the header bidding process to compete with bids on the ad server, you must have line items set up with key values that match the KVPs in the query string.

## Prebid Keys

This table lists the keys that can be sent from Prebid to the ad server. Depending on the media type, most of these keys are sent by default.

{: .alert.alert-info :}
You can work with your engineers to modify the default list. See [Restricting Data Sent to the Ad Server](#restricting-data-sent-to-the-ad-server) below for more information.

{: .table .table-bordered .table-striped }
| Key | Usage | Scenario | Description | Example Value |
| --- | ----- | -------- | ----------- | ------------- |
| hb_pb | targeting | All | The bid price bucket (adjusted for price granularity). | 2.10 |
| hb_adid | rendering | All | The ad ID. Used by the Prebid Universal Creative (PUC) ad server creative to render the winning Prebid ad. | 123456 |
| hb_bidder | targeting and reporting | Could be used for creative-level targeting in video scenarios; reporting for all scenarios | The bidder code. Used for logging and reporting to learn which bidder has higher fill rate/CPM. | BidderA |
| hb_size | rendering | Banner, native, outstream. Not used for video. | The size used for resizing the iframe for the winning creative. | 300x250 |
| hb_format | targeting and reporting | Needed only for ad servers that don't support implicit size targeting or when special creatives are desired. | Optional targeting element for edge cases. | video |
| hb_deal | targeting | All | Target private marketplace deals | 7777777 |
| hb_uuid | rendering | Video only | Carries the cache retrieval ID for VAST video creatives | 1111-2222-3333-4444 |
| hb_cache_id | rendering | Banner, native, outstream; mobile app only | Carries the cache retrieval ID for mobile bids | 2222-3333-4444-5555 |
| hb_cache_host | rendering | Banner, native, outstream; mobile app only | The host where the cached creative lives | `"https://mycachehost.example.com"` |
| hb_cache_path | rendering | Banner, native, outstream; mobile app only | The web path where the cached creative lives | /cache |
| hb_source | reporting | Server-to-server testing | Used to report the A/B test results for client- vs server-side performance. | s2s |
| hb_adomain | reporting and special | All | Used to report on VAST errors, set floors on certain buyers, monitor volume from a buyer, or track down bad creatives | example.com |

When you’re sending the [Top Price Bid](/adops/send-all-vs-top-price.html) to the ad server, the preceding keys are the only keys that will be sent. If you’re [Sending All Bids](/adops/send-all-vs-top-price.html), the preceding keys will be sent, plus the same set of keys specific to each bidder, with the bidder name appended. For example, if you receive bids from BidderA and BidderB, the keys hb_pb, hb_pb_BidderA, and hb_pb_BidderB will all be sent to the ad server with the values provided by the associated bidders. (Even in that scenario, the "winning" keys [hb_pb, etc.] will still have the values for the top bid.)

## Key Value Pair Usage

KVPs sent from Prebid are used in the ad server for a variety of purposes: targeting, reporting, creative rendering, and to supply additional information.

### Targeting

Targeting KVPs are used to pick out which line items match the request, or possibly which creative within a line item should be used. They will need to be entered in the line items you create to capture the bids coming in from Prebid. These key values can also be used in reports.

{: .alert.alert-success :}
It's also possible to use regular ad server targeting values on header bidding line items. For example, if you want to have different price granularities in one country, you could create multiple sets of line items differentiated by country.

### Reporting

Some publishers rely on ad server KVPs for important business reporting. Reporting on the Prebid keys can help you determine the performance of your header bidding partners and your overall Prebid configuration. Key values that are for reporting only are not entered in line items. Depending on your ad server, reporting keys might need to be created in the ad server in order to be used in reporting.

### Rendering

These values are needed for rendering the creative properly when the Prebid line item is chosen.

### Special Usage

The hb_adomain key was created to provide additional information about a bid or to help with troubleshooting. See [setConfig](/dev-docs/publisher-api-reference/setConfig.html#details-on-the-allowtargetingkeys-setting) for engineering information on using the hb_adomain key.

## Restricting Data Sent to the Ad Server

When Prebid creates the query string that is sent to the ad server, it includes a default set of keys (along with the associated values provided by the demand partners). However, you might not need or want all the default values, or maybe you need additional values. Because of this, Prebid provides tools that allow for modifications to the amount of data sent to the ad server.

You’ll need to determine which keys you want sent and then work with your engineers to ensure the keys that are sent match those you’re expecting. Some things to consider:

How much information do you need and want?
Does your ad server have restrictions on the amount of data it can receive?

### Key Values in Your Configuration

The information you need and want are entirely dependent on your configuration and usage requirements. Maybe not all the reporting keys are useful to you, in which case you can omit some or all of those keys. Making sure the keys you need match the keys that are sent to the ad server will help ensure the targeting and reporting you’ve set up on your ad server work correctly.

### Query String Restrictions

Some ad servers restrict the number of characters they’ll accept on the query string. When you use [Send All Bids](/adops/send-all-vs-top-price.html), the number of key value pairs sent to the ad server can be very large, depending on the number of bidders and ad slots.This large number of key value pairs can make for a very long query string.

If the query string has too many characters, an ad server with restrictions could simply truncate the string to the length it will accept. This could prevent bids from being received, or could truncate a bidder’s key values to the point where they won’t match any line items. Fortunately, Prebid can be configured to deal with this issue.

In addition to being able to specify which keys to send, Prebid can also be configured to limit the length of the query string that will be appended to the ad request. Prebid will prioritize the bids to ensure top bids and deals are included, along with all of their associated key value pairs.

{: .alert.alert-info :}
For details on how Prebid prioritizes bids based on query string length, see “Details on the auctionKeyMaxChars setting“ under [Configure Targeting Controls](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls).

Reducing the number of default keys sent and limiting the number of bidders will reduce the length of the query string. Work with your engineers to evaluate the typical length of your query strings and make modifications as necessary to achieve the best results for your organization.

{: .alert.alert-info :}
For engineering information on configuration options, see  [Prebid.js Controls](/features/adServerKvps.html#controls). In particular, note the following:
 [Configure Targeting Controls](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls).

## Further Reader

- [Planning Guide](/adops/adops-planning-guide.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
