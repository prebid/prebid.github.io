---
layout: page_v2
title: Prebid Server Scope3 Real Time Data Module
display_name: Scope3 Real Time Data Module
description: Scope3 RTD module for Prebid Server
sidebarType: 5
---

# Scope3 Real Time Data Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Scope3 Real Time Data (RTD) module integrates Scope3's Agentic Execution Engine to provide real-time audience segments and contextual signals for programmatic advertising. This module enables publishers to leverage Scope3's AI-driven targeting capabilities directly within Prebid Server auctions.

## Features

* **Real-time Segmentation**: Fetches audience segments from Scope3's API in real-time
* **Identity Integration**: Works with LiveRamp, publisher IDs, and encrypted identity envelopes  
* **Intelligent Caching**: Thread-safe caching with configurable TTL to optimize performance
* **Flexible Output**: Segments available in response for publisher control
* **GAM Integration**: Optional direct targeting key population for Google Ad Manager
* **Error Resilience**: Graceful degradation without blocking auctions

## Installation

To enable this module, compile Prebid Server with:

```bash
go build -tags scope3_rtd
```

Or include in your Docker build:

```dockerfile
RUN go build -tags scope3_rtd
```

## Configuration

### Basic Configuration

```yaml
hooks:
  enabled: true
  modules:
    scope3:
      rtd:
        enabled: true
        auth_key: ${SCOPE3_API_KEY}
        timeout_ms: 1000
```

### Full Configuration

```yaml
hooks:
  enabled: true
  modules:
    scope3:
      rtd:
        enabled: true
        auth_key: ${SCOPE3_API_KEY}
        timeout_ms: 1000
        cache_ttl_seconds: 60
        add_to_targeting: false
  host_execution_plan:
    endpoints:
      /openrtb2/auction:
        stages:
          entrypoint:
            groups:
              - timeout: 5
                hook_sequence:
                  - module_code: "scope3.rtd"
                    hook_impl_code: "HandleEntrypointHook"
          raw_auction_request:
            groups:
              - timeout: 2000
                hook_sequence:
                  - module_code: "scope3.rtd"
                    hook_impl_code: "HandleRawAuctionHook"
          auction_response:
            groups:
              - timeout: 5
                hook_sequence:
                  - module_code: "scope3.rtd"
                    hook_impl_code: "HandleAuctionResponseHook"
```

### Configuration Parameters

{: .table .table-bordered .table-striped }

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| enabled | boolean | Yes | - | Enable/disable the module |
| auth_key | string | Yes | - | Scope3 API authentication key |
| timeout_ms | int | No | 1000 | API request timeout in milliseconds |
| cache_ttl_seconds | int | No | 60 | Cache duration in seconds |
| add_to_targeting | boolean | No | false | Add segments as GAM targeting keys |

## Identity Support

The module automatically detects and forwards available user identifiers:

### LiveRamp Identifiers

* `user.ext.eids[]` with `source: "liveramp.com"`
* `user.ext.rampid` field

### Encrypted Identity Envelopes

* `user.ext.liveramp_idl` - ATS envelope
* `user.ext.ats_envelope` - Alternative envelope location
* `user.ext.rampId_envelope` - Additional envelope location
* `ext.liveramp_idl` - Request-level envelope

### Standard Identifiers

* `user.id` - Publisher user ID
* `device.ifa` - Device advertising ID
* Other OpenRTB standard identifiers

## Response Format

### Standard Response
Segments are always available in the response extension:

```json
{
  "ext": {
    "scope3": {
      "segments": ["gmp_eligible", "high_value_user", "sports_fan"]
    }
  }
}
```

### With GAM Targeting (add_to_targeting: true)
When enabled, segments are also added as targeting keys:

```json
{
  "ext": {
    "prebid": {
      "targeting": {
        "gmp_eligible": "true",
        "high_value_user": "true",
        "sports_fan": "true"
      }
    },
    "scope3": {
      "segments": ["gmp_eligible", "high_value_user", "sports_fan"]
    }
  }
}
```

## Performance Optimization

### Caching Strategy

* **Cache Key**: Generated from user IDs, domain, and page URL
* **Thread Safety**: Read-write mutexes for concurrent access
* **Memory Efficiency**: Stores only segment arrays
* **Frequency Caps**: 60-second default TTL ensures fresh data

### HTTP Optimization

* Connection pooling with keep-alive
* HTTP/2 support when available
* Gzip compression for responses
* Configurable timeouts

## Integration Examples

### Google Ad Manager
Publishers can use segments for GAM targeting:

```javascript
// Client-side code to read Scope3 segments
pbjs.getBidResponses().forEach(response => {
  const segments = response.ext?.scope3?.segments || [];
  // Forward to GAM targeting
});
```

### Custom Ad Servers
Access segments from the auction response:

```go
// Server-side handling
segments := response.Ext["scope3"]["segments"]
// Forward to your ad server
```

## Monitoring

The module logs important events at different levels:

* **INFO**: Successful segment fetches and cache hits
* **WARN**: API timeouts or non-critical errors
* **ERROR**: Configuration issues or critical failures

Example log entries:

```text
INFO: Scope3 RTD: Fetched 3 segments for user
WARN: Scope3 RTD: API timeout after 1000ms
INFO: Scope3 RTD: Cache hit for key abc123
```

## Troubleshooting

### No Segments Returned

1. Verify API key is correctly configured
2. Check endpoint URL accessibility
3. Ensure user identifiers are present in bid request
4. Review server logs for API errors

### Performance Issues

1. Adjust `timeout_ms` based on network latency
2. Increase `cache_ttl_seconds` for less frequent updates
3. Monitor cache hit rates in logs
4. Check API response times

### Configuration Errors

1. Validate YAML/JSON syntax
2. Ensure environment variables are set
3. Check module is compiled into PBS binary
4. Verify hook execution plan is correct

## Privacy Compliance

The module respects privacy signals:

* Honors GDPR consent strings
* Respects US Privacy (CCPA) signals  
* Does not process requests when consent is denied
* Only forwards consented identifiers to Scope3

## Support

For technical support:

* **Issues**: Open a GitHub issue in the Prebid Server repository
* **Documentation**: Submit PRs to improve this documentation
* **Integration Help**: Contact your Scope3 representative
* **Email**: `bokelley@scope3.com`

## Related Documentation

* [Prebid Server Modules]({{site.baseurl}}/prebid-server/pbs-modules/)
* [Module Development]({{site.baseurl}}/prebid-server/developers/add-a-module.html)
* [Real-Time Data Overview]({{site.baseurl}}/prebid-server/features/pbs-rtd.html)
