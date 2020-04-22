---
layout: page_v2
title: Prebid Server Troubleshooting
description: Prebid Server Troubleshooting
sidebarType: 7
---

# Prebid Server Troubleshooting
{:.no_toc}

* TOC
{:toc}

## Get More Debugging Information

There are several ways to get more debug info from Prebid Server.

### Direct Prebid Server Invocation

If you're invoking Prebid Server directly, add one of these parameters to the OpenRTB:
- `"test":1`: This will inform bidders that this request should be treated as a test (non-billable), and provides additional debug information in the OpenRTB response.
- `"debug":1`: Similar to `test`, but just adds  debug info, without declaring the request non-billable.

{% highlight bash %}
POST https://prebid-server.rubiconproject.com/openrtb2/auction
{
    ...
    "test":1
}
{% endhighlight %}

### Invoked from Prebid.js

If you're invoking Prebid Server from Prebid.js, turn on the OpenRTB `test` flag from Prebid.js using one of these options:

1) Add **?pbjs_debug=true** to the URL of the page.

2) Add the following `setConfig` to the page:

{% highlight bash %}
    pbjs.setConfig({"debug":true});
{% endhighlight %}

### Invoked from AMP

If you're invoking Prebid Server from, you'll be unable to get debug info from the AMP page. However, you can capture the Prebid Server AMP call and append `&debug=1` to it:

{% highlight bash %}
https://my-prebid-server.com/openrtb2/amp?tag_id=1111111111111&w=300&h=50&...&debug=1
{% endhighlight %}

## Stored Responses

{: .pb-alert .pb-alert-important :}
Currently, this approach only works with the Java version of Prebid Server.

Sometimes it's hard to get a test bid. Other times, you may want to test a
very specific bid, such as one that has a particular CPM value or
creative.

The Prebid Server 'stored response' feature allows you to handcraft bid responses in two basic steps:

1. Insert the desired response into a Prebid Server database.
2. Call the /openrtb2/auction endpoint with one or more Stored Auction Response IDs.

Getting a Stored Auction Response ID into the OpenRTB can be done in two ways:

- Prebid.js - see [Define Prebid Server Responses](/troubleshooting/troubleshooting-guide.html#pbs-stored-responses) on the Prebid.js troubleshooting page.
- Manually create the OpenRTB.

### Manual Specification of Stored Responses in OpenRTB

A `storedauctionresponse` ID can be specified in `imp[].ext.prebid`. If specified, then the behavior of Prebid Server changes:

- The rest of the ext.prebid block is irrelevant and therefore ignored.
- Nothing is sent to any bidder adapter for that imp.
- The response retrieved for the specified ID (an array of objects) will be used to create the seatbid response. There can be multiple bidders in a single storedauctionresponse; if there are multiple imps from the same bidder, seatbid objects are properly merged.
- The impid of the original request is copied through to the response.

So for example, this OpenRTB request:
{% highlight bash %}
{
  "test":1,
  "tmax":500,
  "id": "test-auction-id",
  "app": { ... },
  "ext": {
      "prebid": {
             "targeting": {},
             "cache": { "bids": {} }
       }
  },
  "imp": [
    {
      "id": "a",
      "ext": { "prebid": { "storedauctionresponse": { "id": "1111111111" } } }
    },
    {
      "id": "b",
      "ext": { "prebid": { "storedauctionresponse": { "id": "2222222222" } } }
    }
  ]
}
{% endhighlight %}

Could result in this response, assuming that the IDs exist in the database table read by Prebid Server:

{% highlight bash %}
{
    "id": "test-auction-id",
    "seatbid": [
        {
             // BidderA bids from storedauctionresponse=1111111111
             // BidderA bids from storedauctionresponse=2222222222
        },
       {
             // BidderB bids from storedauctionresponse=1111111111
             // BidderB bids from storedauctionresponse=2222222222
       }
  ]
}
{% endhighlight %}

## Related Topics
{:.no_toc}

+ [Prebid.js Troubleshooting](/troubleshooting/troubleshooting-guide.html)
