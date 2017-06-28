---
layout: page
title: Price Granularity
description: Price granularity
pid: 2
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
---

<div class="bs-docs-section" markdown="1">

# Price Granularity

With Prebid Mobile, you’ll need to setup line items to tell your ad server how much money the “bidder” demand is worth to you. This process is done via key-values.

Example:


* Prebid Mobile is going to call Prebid Server which calls your bidders for their price, then passes it into your ad server on the query-string. You want to target this bid price with a line item that earns you the same amount if it serves.

* If you had 1-line item for every bid at a penny granularity of $0.01, $0.02, $0.03, ..., 1.23, ..., $4.56 you’d need 1,000 line items just to represent bids from $0-$10. We call this the “Exact” granularity option.

* Creating 1,000 line items can be a hassle, so publishers typically use price buckets to represent price ranges that matter. For example, you could group bids into 10 cent increments, so bids of $1.06 or $1.02 would be rounded down into a single price bucket of $1.00.

#### Available options for price granularity

TODO: go into detail about the available options here....
"low", "med", "high", "auto", "dense"

Note that DFP has an order [object limits](https://support.google.com/dfp_premium/answer/1628457?hl=en#Trafficking) of containing up to 450 line items (including archived line items). If you are designing your own granularity setup, make sure you do not exceed that amount. Or, you can find the recommended pre-configured granularities [here](/dev-docs/publisher-api-reference.html#module_pbjs.setPriceGranularity).

{: .alert.alert-success :}
**Action Item:** Once you have decided the price granularity, go to Prebid Server [account page](https://prebid.adnxs.com/account/) to set the price granularity setting for your account.

</div>