---
layout: page_v2
title: Generic analytics
description: Generic analytics adapter
module_code: genericAnalyticsAdapter
enable_download: false
---

## Generic analytics adapter

### Description

This is an analytics adapter that can interface with any backend, meant for publishers that prefer to manage their own analytics infrastructure. The simplest setup requires just a URL that will be sent all data from all Prebid events; with additional options for filtering or formatting.

### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Type     | Description                                                                                                                                                                                       |
|--------------|---------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `handler`    | required unless `url` is provided | Function | Custom handler function - [example](#custom-handler)                                                                                                                                              |
| `url`        | required unless `handler` is  provided  | String   | Data collection URL                                                                                                                                                                               |
| `method`     | optional | String   | HTTP method used to call `url`. Defaults to `'POST'`                                                                                                                                              |
| `batchSize`  | optional | Number   | Number of events to collect into a single call to `handler` or `url`. Defaults to `1`                                                                                                             |
| `batchDelay` | optional | Number   | Time (in milliseconds) to wait before calling `handler` or `url` with an incomplete batch (when fewer than `batchSize` events have been collected). Defaults to `100`                             |
| `events`     | optional | Object   | Map from event name to a custom format function. When provided, only events in this map will be collected, using the data returned by their corresponding function - [example](#event-formatters) |
| `gvlid`      | optional | Number   | Global vendor list ID to use for the purpose of GDPR purpose 7 enforcement - see [note](#gdpr) |
| `sampling`   | optional | Number   | Sampling rate, expressed as a number between 0 and 1. Data is collected only on this ratio of browser sessions. Defaults to `1`                                                               |

<a id="gdpr" />

### Note on GDPR enforcement

If you are using the [GDPR enforcement module](/dev-docs/modules/gdprEnforcement.html) to enforce purpose 7, by default this module will be blocked when GDPR is in scope.
To enable it, you may either specify the `gvlid` option (if you are interfacing with a partner) or declare a `softVendorException` if you deem that vendor consent is not required for compliance:

```javascript
pbjs.setConfig({
    consentManagement: {
        gdpr: {
            rules: [{
                purpose: "measurement",
                enforcePurpose: true,
                enforceVendor: true,
                softVendorExceptions: ["generic"]
            }]
        }
    }
})
```


### Examples

#### Send all data to given URL using single requests

```javascript
pbjs.enableAnalytics({
    provider: 'generic',
    options: {
        url: 'https://example.com'
    }
})
```

Example request payload:

```
{
  "eventType": "auctionInit",
  "args": {
    "auctionId": "97000db4-ae78-4e93-81d1-66b83ac10a74",
    "timestamp": 1666207538126,
    "auctionStatus": "inProgress",
    "adUnits": [
       /* ... */
    ],
    "noBids": [],
    "bidsReceived": [],
    "bidsRejected": [],
    "winningBids": [],
    "timeout": 2000,
    "metrics": {
      /* ... */
    }
  }
}
```

if `options.method` is set to `'GET'`, the same JSON payload is encoded into a single search parameter named `data`, e.g. `https://example.com?data=%7B%22eventType%22%3A%22auctionInit%22...`

#### Batch multiple events together

```javascript
pbjs.enableAnalytics({
    provider: 'generic',
    options: {
        url: 'https://example.com',
        batchSize: 10
    }
});
```

Example request payload:

```
[
    {
        "eventType": "auctionInit",
        "args": {
            "auctionId": "97000db4-ae78-4e93-81d1-66b83ac10a74",
            "timestamp": 1666207538126,
            "auctionStatus": "inProgress",
            "adUnits": [
                /* ... */
            ],
            "noBids": [],
            "bidsReceived": [],
            "bidsRejected": [],
            "winningBids": [],
            "timeout": 2000,
            "metrics": {
                /* ... */
            }
        }
    },
    {
        "eventType": "bidRequested",
        "args": {
            "bidderCode": "appnexus",
            "auctionId": "db4edde6-ee66-4779-b7ed-c7295d3e3c49",
            "bidderRequestId": "3cf3eaf48bd5f48",
            "uniquePbsTid": "1565fd02-d4fd-4369-bf8e-0dee2a00aca5",
            "bids": [
                /* ... */
            ],
            "auctionStart": 1666208826440,
            "timeout": 10000,
            "src": "s2s",
            "refererInfo": {
                /* ... */
            },
            "metrics": {
                /* ... */
            },
            "ortb2": {
                /* ... */
            },
            "uspConsent": "1YNN",
            "start": 1666208826445,
            "tid": "db4edde6-ee66-4779-b7ed-c7295d3e3c49"
        }
    },
    /* ... */
]
```

<a id="event-formatters" />

#### Custom formatting

```javascript
pbjs.enableAnalytics({
    provider: 'generic',
    options: {
        url: 'https://example.com',
        batchSize: 10,
        events: {
            bidRequested(request) {
                return {
                    type: 'REQUEST',
                    auctionId: request.auctionId,
                    bidder: request.bidderCode
                }
            },
            bidResponse(response) {
                return {
                    type: 'RESPONSE',
                    auctionId: response.auctionId,
                    bidder: response.bidderCode
                }
            }
        }
    }
})
```

Example request payload:

```
[
  {
    "auctionId": "e41e3fcb-6209-4995-b0be-2aed21a8bdf6",
    "bidder": "appnexus",
    "type": "REQUEST"
  },
  {
    "auctionId": "e41e3fcb-6209-4995-b0be-2aed21a8bdf6",
    "bidder": "appnexus",
    "type": "RESPONSE"
  }
  /* ... */
]
```

<a id="custom-handler" />

#### Custom handler

```javascript
pbjs.enableAnalytics({
    provider: 'generic',
    options: {
        handler(data) {
            // `data` is an array of length `batchSize`. If `events` is provided, the elements are the values returned
            // by the format functions defined therein; otherwise, they have the format {eventType, args}.
            fetch('https://example.com', {
                method: 'POST',
                body: JSON.stringify({
                    location: window.location.href,
                    data
                })
            });
        }
    }
})
```

### See also

[Prebid.js events](/dev-docs/publisher-api-reference/getEvents.html)
