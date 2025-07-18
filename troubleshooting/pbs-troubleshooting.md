---
layout: page_v2
title: Prebid Server Troubleshooting
description: Prebid Server Troubleshooting
sidebarType: 7
---

# Prebid Server Troubleshooting

{:.no_toc}

- TOC
{:toc}

## Get More Debugging Information

There are several ways to get more debug info from Prebid Server.

### Direct Prebid Server Invocation

If you're invoking Prebid Server directly, add one of these parameters to the OpenRTB:

- `"test":1`: This will inform bidders that this request should be treated as a test (non-billable), and provides additional debug information in the OpenRTB response.
- `"ext.prebid.debug":true`: Similar to `test`, but just adds debug info, without declaring the request non-billable.

```bash
POST https://prebid-server.rubiconproject.com/openrtb2/auction
{
    ...
    "test":1
}
```

### Invoked from Prebid.js

If you're invoking Prebid Server from Prebid.js, turn on the OpenRTB `test` flag from Prebid.js using one of these options:

1. Add **?pbjs_debug=true** to the URL of the page. This will cause the pbsBidAdapter to send `ext.prebid.debug:true` to PBS, which will turn on additional debugging.

2. Add the following `setConfig` to the page to get the same result:

    ```javascript
    pbjs.setConfig({"debug":true});
    ```

3. If instead of ext.prebid.debug you would like to set the OpenRTB 2.5 'test' flag, you can set that using the 'ortb2' approach:

    ```javascript
    pbjs.setConfig({
        "ortb2": {
            "test":1
        }
    });
    ```

### Invoked from AMP

If you're invoking Prebid Server from AMP, you'll be unable to get debug info from the AMP page. However, you can capture the Prebid Server AMP call and append `&debug=1` to it:

```text
https://my-prebid-server.com/openrtb2/amp?tag_id=1111111111111&w=300&h=50&...&debug=1
```

## Stored Responses

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

```bash
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
```

Could result in this response, assuming that the IDs exist in the database table read by Prebid Server:

```bash
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
```

## Request Logging

(PBS-Java only)

Sometimes you want to see what's coming into the server before being processed by PBS.
If the admin endpoints are enabled and you have the admin endpoint password, you can
hit these two URLs with the desired parameter values:

- `https://HOST/logging/[changelevel](/prebid-server/endpoints/pbs-endpoint-admin.html#loggingchangelevel)?level=debug&duration=10000`
- `https://HOST/logging/[httpinteraction](/prebid-server/endpoints/pbs-endpoint-admin.html#logginghttpinteraction)?limit=100&endpoint=auction&account=1111`

Then you can check server logs for output like:

```text
http-interaction : Requested URL: "/openrtb2/auction", request body: "{ ... }"
```

## Related Topics

{:.no_toc}

- [Prebid.js Troubleshooting](/troubleshooting/troubleshooting-guide.html)
