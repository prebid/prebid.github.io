# Prebid Server Bidder List

## `GET /info/bidders`

This endpoint returns a list of Bidders supported by Prebid Server.
These are the core values allowed to be used as `request.imp[i].ext.{bidder}`
keys in [Auction](../openrtb2/auction.md) requests.

- For detailed info about a specific Bidder, use [`/info/bidders/{bidderName}`](./bidders/bidderName.md)
- For detailed info about all Bidders, use [`/info/bidders/all`](./bidders/allBidders.md)

### Sample Response

This endpoint returns JSON like:

```
[
  "appnexus",
  "audienceNetwork",
  "pubmatic",
  "rubicon",
  "other-bidders-here"
]
```
