---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | Info

---

# Prebid Server | Endpoints | /info
{:.no_toc}

* TOC
{:toc}

## GET /info/bidders

This endpoint returns a list of Bidders supported by Prebid Server.
These are the core values allowed to be used as `request.imp[i].ext.{bidder}`
keys in [Auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) requests.

For detailed info about a specific Bidder, use [`/info/bidders/{bidderName}`](#get-infobiddersbiddername).

### Sample Response
{:.no_toc}

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

## GET /info/bidders/{bidderName}

This endpoint returns some metadata about the Bidder whose name is `{bidderName}`.
Legal values for `{bidderName}` can be retrieved from the [`/info/bidders`](#get-infobidders) endpoint.

### Sample Response
{:.no_toc}

This endpoint returns JSON like:

```
{
  "maintainer": {
    "email": "info@prebid.org"
  },
  "capabilities": {
    "app": {
      "mediaTypes": [
        "banner",
        "native"
      ]
    },
    "site": {
      "mediaTypes": [
        "banner",
        "video",
        "native"
      ]
    }
  }
}
```

The fields hold the following information:

- `maintainer.email`: A contact email for the Bidder's maintainer. In general, Bidder bugs should be logged as [issues](https://github.com/prebid/prebid-server/issues)... but this contact email may be useful in case of emergency.
- `capabilities.app.mediaTypes`: A list of media types this Bidder supports from Mobile Apps.
- `capabilities.site.mediaTypes`: A list of media types this Bidder supports from Web pages.

If `capabilities.app` or `capabilities.site` do not exist, then this Bidder does not support that platform.
OpenRTB Requests which define a `request.app` or `request.site` property will fail if a
`request.

## GET /bidders/params

This endpoint gets information about all the custom bidders params that Prebid Server supports.

### Returns
{:.no_toc}

A JSON object whose keys are bidder codes, and values are Draft 4 JSON schemas which describe that bidders' params.

For example:

```
{
  "appnexus": { /* A json-schema describing AppNexus' bidder params */ },
  "rubicon": { /* A json-schema describing Rubicon's bidder params */ }
  ... all other bidders will have similar keys & values here ...
}
```

The exact contents of the json-schema values can be found at [github.com/prebid/prebid-server/tree/master/static/bidder-params](https://github.com/prebid/prebid-server/tree/master/static/bidder-params)
