---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | Events

---

# Prebid Server | Endpoints | Events
{: .no_toc}

- TOC
{:toc}

## GET /event

This endpoint alerts Prebid Server to process the event. Most of the time this just means informing the analytics adapter. But it's also used in the Programmatic Guaranteed context to affect line item pacing.

### Query Params

{: .table .table-bordered .table-striped }
| Query Parameter | Required? | Description |
|-----------------+-----------+-------------|
| a| y | Account ID |
| t| y | Type of the event. Allowed values: `win` or `imp` |
| b| y | Bid ID, expected to be unique so this event can be joined to the auction analytics. |
| bidder| y | Bidder code |
| f| n | Format of the PBS response. Values: `b` is blank, just return HTTP 200 with an empty body. `i` is image, return HTTP 200 with a blank PNG body |
| ts| n | Auction timestamp |
| x| n | Disables or enables analytics. Allowed values: `1` to enable analytics or `0` to disable. `1` is default. |

### Sample request

```text
GET https://prebid.site.com/event?t=win&b=1234567890&bidder=rubicon&f=i
```

## `POST /vtrack`

### Intended Usage

This is an endpoint similar to the [Prebid Cache /cache](/prebid-server/endpoints/pbs-endpoints-pbc.html#post-cache) endpoint, but PBS adds an `Impression` tag to the supplied VAST.

It's implemented in Prebid Server and not Prebid Cache in order to keep the latter simple.

This endpoint was developed for the use case where client-side adapters return VAST
and the publisher's Prebid Server is doing analytics for video impressions. Originally
this was the only reliable way to measure imps for video.

This is the Prebid.js [setConfig({cache})](/dev-docs/publisher-api-reference/setConfig.html#setConfig-vast-cache) call:

```json
pbjs.setConfig({
    cache: {
        url: "https://PBS_HOST/vtrack?a=ACCOUNT",
        vasttrack: true
    }
});
```

### Processing

Adds one or more blocks of XML to Prebid Cache after adding an `Impression` object to one or more supplied VAST creatives.

1. Verify all require parameters are present and valid. If not, reject request.
1. Verify that the account supports event tracking.
1. If so, for each block of XML submitted:
    1. Verify that the specified bidder allows modification of its VAST.
    1. If there are no `<Impression>` tags, don't modify.
    1. Insert PBS `<Impression>` tag after the last existing `<Impression>` tag.
1. POST the final XML blocks to Prebid Cache.
1. Return the resulting UUIDs to the client.

The PBS `<Impression>` tag looks like:

```xml
<Impression>
  <![CDATA[https://PBS_HOST/event?t=imp&b=BIDID&a=ACCOUNT&aid=AUCTIONID&ts=TIMESTAMP&bidder=BIDDER&f=b]]>
</Impression>
```

### Parameters

{: .table .table-bordered .table-striped }
| Parameter | Location | Type | Scope | Description | Default |
| a | query string | string | required | account ID | none |
| bidid | POST | string | required | bidId is copied to the /event URL in the 'b' param | none |
| bidder | POST | string | required | copied to the /event URL in the 'bidder' param | none |
| type  | POST | string | required | must be "xml" | none |
| value  | POST | string | required | the VAST XML body | none |
| aid | POST | string | required | auction ID is copied to the /event URL in the 'aid' param | none |
| timestamp | POST | string | required | copied to the /event URL in the 'ts' param | none |
| ttlseconds | POST | string | required | overrides the default number of seconds to keep in PBC | none |

### Example

POST URL:

```text
https://PBS_HOST/vtrack?a=1001
```

POST body:

```json
{"puts":[{
    "bidid": "11111",
    "aid": "22222",
    "bidder": "bidderA",
    "timestamp": 123456789,
    "type":"xml",
    "value":"<?xml version=\"1.0\" encoding=\"UTF-8\"?><VAST version=\"4.0\"> ... </VAST>",
    "ttlseconds":3600
},{
    "bidid": "33333",
    "aid": "44444",
    "bidder": "bidderB",
    "timestamp": 123456789,
    "type":"xml",
    "value":"<?xml version=\"1.0\" encoding=\"UTF-8\"?><VAST version=\"4.0\"> ... </VAST>",
    "ttlseconds":3600
}]}
```

The response to the client is JSON containing the cache UUIDs that can be used to retrieve the item:

```json
{
  "responses": [
    {"uuid": "279971e4-70f0-4b18-bd65-5c6e7aa75d40"},
    {"uuid": "147c9934-894b-4c1f-9a32-e7bb9cd15376"}
  ]
}
```

### Notes

- This application does *not* validate XML. If users `POST` malformed XML, they'll `GET` a bad response too.
- The host company can set a max length on payload size limits in the application config. This limit will vary from host company to host company.
