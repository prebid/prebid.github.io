---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developer | Build An Analytics Adapter

---

# Prebid Server - Building an Analytics Adapter
{: .no_toc}

There are few open sourced analytics adapters for Prebid Server
and there is an internal interface that host companies can use to
integrate their own modules.

Below is an outline of how it's done for both versions of the server.

{: .alert.alert-warning :}
Analytics adapters are subject to a number of specific technical rules. Please become familiar
with the [module rules](/dev-docs/module-rules.html) that apply globally and to analytics adapters in particular.

- TOC
{:toc }

## Adding an Analytics Adapter in PBS-Go

1. Define config params

Analytics modules are enabled through Viper [configuration](https://github.com/prebid/prebid-server/blob/master/docs/developers/configuration.md).
You'll need to define any properties in config/config.go which are required for your module.

{:start="2"}
2. Implement your module
Your new module belongs in the analytics/{moduleName} package. It should implement the `PBSAnalyticsModule` interface from analytics/core.go

{:start="3"}
3. Connect your Config to the Implementation
The `NewPBSAnalytics()` function inside analytics/config/config.go instantiates Analytics modules using the app config. You'll need to update this to recognize your new module.

### Example
{:.no_toc}

A simple [filesystem](https://github.com/prebid/prebid-server/tree/master/analytics/filesystem) analytics module is provided as an example. This module will log dummy messages to a file.

It can be configured with:

```yaml
analytics:
  file:
    filename: "path/to/file.log
```

Prebid Server will then write sample log messages to the file you provided.

## HTTP Analytics Module in PBS-Go
The HTTP Analytics Module can send selected Analytics Events to a specified HTTP endpoint.

The sample rate has to be between `0.0` (never sample) and `1.0` (always sample). The sample rate is always evaluated and defaults to `0.0`.

The module uses [github.com/antonmedv/expr](github.com/antonmedv/expr) for complex filter options. The [analytics object](https://github.com/mllrsohn/prebid-server/tree/master/analytics/core.go) is always passed into the expression.

```yaml
analytics:
    http:
        # Required: enable the module
        enabled: true
        endpoint: 
            # Required: url where the endpoint post data to
            url: "https://my-rest-endpoint.com"
            # Required: timeout for the request (parsed as golang duration)
            timeout: "2s"
            # Optional: enables gzip compression for the payload
            gzip: false
            # Optional: additional headers send in every request
            additional_headers:
                X-My-header: "some-thing"
        buffer: # Flush events when (first condition reached)
            # Size of the buffer in bytes
            size: "2MB" # greater than 2MB (size using SI standard eg. "44kB", "17MB")
            count : 100 # greater than 100 events
            timeout: "15m" # greater than 15 minutes (parsed as golang duration)
        auction: 
            sample_rate: 1 # sample rate 0-1.0 to sample the event, 0 (default) disables the collector for those events
            filter: "RequestWrapper.BidRequest.App.ID == '123'" # Optional filter
        amp:
            sample_rate: 0.5 # 50% of the events are sampled
            filter: "" 
        video:
            sample_rate: 1 # Sample rate, f 0-1 set sample rate, 1 is 100%
            filter: "" 
        setuid:
            sample_rate: 0.25 # 25% of the events are sampled
            filter: "" 
        cookie_sync:
            sample_rate: 0 # events are not sampled
            filter: "" 
        notification:
            sample_rate: 1
            filter: "" 
```

The payload to the endpoint is an array of the analytics object plus the `type` and the `createdAt` date.

Analytics objects can be of the following types:

- auction
- amp
- video
- cookiesync
- notification
- setuid

Here is a sample of the events for each type:

```json5
[
  {
    "type": "auction", // Loggable object of a transaction at /openrtb2/auction endpoint
    "createdAt": "2023-02-01T00:00:00Z",
    "status": 1,
    "errors": [],
    "startTime": "2023-02-01T00:00:00Z",
    "hookExecutionOutcome": [
      // StageOutcome represents the result of executing specific stage.
      // see: https://github.com/prebid/prebid-server/blob/master/hooks/hookexecution/outcome.go#L59-L67
    ],
    "request": {
      // copy of the ORTB 2.6 request to all bidders including Prebid Extensions
      // see: https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#prebid-server-ortb2-extension-summary
    },
    "response": {
      // copy of the ORTB 2.6 reponse seatbid array from all bidders including Prebid Extensions.
      // https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#response
    },
    "account": {
      // Account represents a publisher account configuration
      // see: https://github.com/prebid/prebid-server/blob/master/config/account.go#L27-L45
    }
  },
  {
    "type": "amp", // Loggable object of a transaction at /openrtb2/amp endpoint
    "createdAt": "2023-02-01T00:00:00Z",
    "status": 1,
    "errors": [],
    "startTime": "2023-02-01T00:00:00Z",
    "ampTargetingValues": {
      "some": "data"
    },
    "origin": "some-origin",
    "hookExecutionOutcome": [],
    "request": {
      // copy of the ORTB 2.6 request
      // see: https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html#request
    },
    "response": {
      // copy of the ORTB 2.6 reponse seatbid array from all bidders including Prebid Extensions.
      // https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html#response
    }
  },
  {
    "type": "video", // Loggable object of a transaction at /openrtb2/video endpoint
    "createdAt": "2023-02-01T00:00:00Z",
    "status": 1,
    "errors": [],
    "startTime": "2023-02-01T00:00:00Z",
    "request": {
      // copy of the ORTB 2.6 request
      // see: https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html#request
    },
    "response": {
      // copy of the ORTB 2.6 reponse seatbid array from all bidders including Prebid Extensions.
      // https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html#response
    },
    "videoRequest": {
      // see: https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html#post-openrtb2video
    },
    "videoResponse": {
      // see: https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html#post-response
    }
  },
  {
    "type": "cookiesync", // Loggable object of a transaction at /cookie_sync endpoint
    "createdAt": "2023-02-01T00:00:00Z",
    "status": 1,
    "errors": [],
    "bidderStatus": [
      // see: https://github.com/prebid-server/blob/master/analytics/core.go#L77-L88
    ]
  },
  {
    "type": "notification", // Loggable object of a transaction at /event endpoint
    "createdAt": "2023-02-01T00:00:00Z",
    "request": {
      // see: https://github.com/prebid/prebid-server/blob/master/analytics/event.go#L43-L54
    },
    "account": {
      // see: https://github.com/prebid/prebid-server/blob/master/config/account.go#L27-L45
    },
  },
  {
    "type": "setuid", // Loggable object of a transaction at /setuid endpoint
    "createdAt": "2023-02-01T00:00:00Z",
    "uid": "some-uid",
    "success": true,
    "bidder": "some-bidder",
    "status": 1,
    "errors": []
  }
]
```

## Adding an Analytics Adapter in PBS-Java

1. Define config params
Analytics modules are enabled through the [Configuration](https://github.com/prebid/prebid-server-java/blob/master/docs/config.md).

{:start="2"}
2. Implement your module
Your new module org.prebid.server.analytics.{module}AnalyticsReporter needs to implement the org.prebid.server.analytics.AnalyticsReporter interface.

{:start="3"}
3. Add your implementation to Spring Context
In order to make Prebid Server aware of the new analytics module it needs to be added to the Spring Context in org.prebid.server.spring.config.AnalyticsConfiguration as a bean.

### Example
{:.no_toc}

The [log module](https://github.com/prebid/prebid-server-java/blob/c5e7782b15c3bd47267a9268fd25a21a8bf34d98/src/main/java/org/prebid/server/analytics/reporter/log/LogAnalyticsReporter.java) is provided as an example. This module will write dummy messages to a log.

It can be configured with:

```YAML
analytics:
  log:
    enabled: true
```

Prebid Server will then write sample log messages to the log.
