---
layout: page_v2
title: Send All Bids vs Top Price
head_title: Send All Bids vs Top Price
sidebarType: 3
sbUUID: 3.2
---

# Send All Bids vs Top Price

{: .no_toc }

- TOC
{: toc }

Prebid provides two options for the number of bids that will be sent to the ad server:

- Send all bids to the ad server that are received from the header bidding demand partners. This is the default behavior in Prebid.
- Send only the top bid from among all the demand partner responses.

{: .alert.alert-info :}
There is also a third option if you’re using deals. See [Deals in Prebid](/adops/deals.html) for more information.

Here’s a brief comparison chart showing the primary differences between these approaches.

{: .table .table-bordered .table-striped }
| | Send All Bids (Default) | Send Top Price Bid |
| | ----------------------- | ------------------ |
| Number of bids sent to the ad server | Sends all bids that are received before the timeout period has expired. | Sends one bid per ad request. Only the bid with the top price for each request is sent. |
| Reporting | Gives your ad server the information to generate detailed reports on bids received from individual demand partners whether they are top bidders or not. | Your ad server can report only on bids it receives, so you won’t have visibility from within your ad server into bids from demand partners that were not top bidders. |
| Line Items | Typically requires a large number of line items to capture individual bidder information. | You can set up line items that are independent of the bidder, resulting in far fewer line items. |
| Key Value Pairs | Separate keys need to be defined for every bidder. | Only one set of keys needs to be defined. |
| Data considerations | The amount of information that is being sent to the ad server can become very large. You may need to place limits on the number of bids or key values that are sent. | You’re unlikely to run into any data issues when you’re sending information from only one bid. |

## Send All Bids

“Send all bids to the ad server” does exactly what it sounds like: every bid that comes in from demand partners before the specified timeout period will be sent to the ad server. (There are some limits, which we’ll talk about in a moment.) **This is the default behavior in Prebid.**

### Reporting

You might be wondering why you’d want to send more than the top bid. After all, if a bid wasn’t the top bid from the header bidding process, how could it possibly be the top bid after reaching the ad server?

Realistically, it can’t. The main reason for sending all bids to the ad server is for reporting and optimization. With all bids, your ad server has the information it needs to provide you with reports that can tell you who bid on your inventory and what the bid price was. This helps you to:

- Evaluate the bid rate of your demand partners
- Ensure contractual obligations with your demand partners are being met
- Adjust your Prebid settings based on who is bidding and for how much
- Evaluate the effectiveness of your current Prebid setup

### Line Items

When you send all bids, you’ll want to create a set of line items for each of your bidders. Each line item within a set (or a Google Ad Manager order) will be targeted towards a different price bucket. (See [Price Granularity](/adops/price-granularity.html) for more information.) While this is an ideal scenario for reporting, it can create difficulties in setting up line items.

For example, suppose you have the following line item setup:

- 200 prices
- 10 bidders

This would require you to create 2000 line items (200 x 10). If, on the other hand, you didn’t need to separate out your line items by bidder, you would reduce this number dramatically to 200 line items (200 x 1).

{: .alert.alert-info :}
The Send All Bids option also sends the top bid, so a hybrid scenario is possible where you need to create only one set of line items, but you’ll use all other variables passed in for reporting.

In addition, some ad servers limit the number of line items you can create. Check with your ad server to ensure you won’t be exceeding this number.

### Key Value Pairs

{: .alert.alert-info :}
For an overview of key value targeting, see [Key Values](/adops/key-values.html).

When you send all bids, you’ll need to have a set of keys defined for each bidder. This requires the creation of a lot of keys. For example, one bid could include five or more key value pairs. If you have ten bidders, this would require creation of at least 50 unique keys.

{: .alert.alert-info :}
Because the number of key value pairs sent to the ad server can be very large, Prebid provides a number of ways to control this. See [Prebid.js Controls](/features/adServerKvps.html#controls) for engineering information on how to modify the amount of data being sent to the ad server.

One thing to keep in mind is the length of your key values. When you create separate line items for each bidder, the keys you target will include the bidder name. For example, if you’re creating line items for BidderA, your key-value pairs will look something like this:

hb_adid_BidderA=123456
hb_pb_BidderA=2.10
hb_size_BidderA=300x250

Some ad servers have limits on key name length. In Google Ad Manager (GAM) the maximum length is 20 characters. GAM will truncate any key name longer than 20 characters. For example:

- One of your bidders is named BidderWithLongNameABC
- Prebid passes the creative size for this bidder in the key hb_size_BidderWithLongNameABC
- GAM truncates this name to hb_size_BidderWithLo

When you enter the key values into the line item, you must use the truncated name:

hb_size_BidderWithLo=300x250

If you forget about or are unaware of your ad server’s truncation and include the full name, the line item targeting will not match.

{: .alert.alert-success :}
**Tip**: Prebid documentation lists the GAM truncated versions of ad server keys on each bidder parameter page. See [AndBeyondMedia](https://docs.prebid.org/dev-docs/bidders/andBeyondMedia.html) for an example.

### Data Considerations

Imagine you’re sending all bids to the ad server and you have the following scenario:

- 15 bidders
- 7 key value pairs (KVPs) per bidder
- 25 characters per KVP

You now have an ad request query string that is 2,625 characters long. There are many options for limiting the amount of data that’s sent on the query string. See [Configure Targeting Controls](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) for engineering options on reducing the amount of data being sent to the ad server.

## Send Top Price Bid

“Send top price bid” is the simpler of the two options. With this approach, the only bid sent to the ad server with each ad request is the bid with the highest price. If multiple bidders respond with the same price, the bid from among those bidders that was received first is sent to the ad server. Here are some things to consider when deciding whether to go with this option.

### Reporting

The ad server can report only on the information it receives. So if you send only one bid from the header bidding process, the ad server can include only that one bid in your reports. Send top bid is a good option if:

- you’re interested in reporting only on overall Prebid fill rates and top bid prices.
- you want to prioritize simplicity over detailed analysis of your header bidding results
- you don’t have any contractual obligations with demand partners that require more detailed reporting

### Line Items

If you’re sending only one bid with each ad request, there’s no need to create separate line items for each bidder. You can create one line for each price and creative size. For example:

- 200 prices
- 1 bidder

In this example you need to create only 200 line items (200 x 1).

### Key Value Pairs

When you send only the top price bid to the ad server, you need to create only one generic set of keys. This means you’ll typically need to create five to ten keys to include in your line item targeting.

Because the key names are the same no matter which bidder’s bid is sent to the ad server, key names will not include the name of the bidder. For example, the bid price will be sent in hb_pb rather than hb_pb_BidderName. This means you’re unlikely to have to worry about ad server limits on name lengths. See [Key Values](/adops/key-values.html) for details on setting key values in the ad server.

### Data Considerations

Send top bid sends the least amount of data possible to the ad server, and therefore has the least impact on client latency.

## Next Step

[Line Item Creation](/adops/line-item-creation.html)

## Further Reader

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
