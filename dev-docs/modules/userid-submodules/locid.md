---
layout: userid
title: LocID
description: LocID User ID sub-module
useridmodule: locIdSystem
bidRequestUserId: locId
eidsource: locid.com
example: '"SYybozbTuRaZkgGqCD7L7EE0FncoNUcx-om4xTfhJt36TFIAES2tF1qPH"'
---

## Overview

LocID is a geospatial identifier provided by Digital Envoy. The LocID User ID submodule retrieves a LocID from a publisher-controlled first-party endpoint, respects applicable privacy framework restrictions, and exposes the identifier to bidders via the standard EIDs interface.

The endpoint is a first-party or on-premises service operated by the publisher, GrowthCode, or Digital Envoy. The module does not transmit IP addresses from the browser; instead, the server-side endpoint derives location information.

## Registration

No registration is required to use this module. Publishers must configure a first-party endpoint that proxies requests to the LocID encryption service.

## Installation

Build Prebid.js with the LocID module:

```bash
gulp build --modules=locIdSystem,userId
```

## Configuration

### Default Mode

By default, the module proceeds when no privacy framework signals are present (LI-based operation):

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'locId',
      params: {
        endpoint: 'https://id.example.com/locid',
        ipEndpoint: 'https://id.example.com/ip'  // optional: lightweight IP-only check
      },
      storage: {
        type: 'html5',
        name: '_locid',
        expires: 7
      }
    }]
  }
});
```

### Strict Mode

To require privacy framework signals before proceeding, set `privacyMode: 'requireSignals'`:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'locId',
      params: {
        endpoint: 'https://id.example.com/locid',
        privacyMode: 'requireSignals'
      },
      storage: {
        type: 'html5',
        name: '_locid',
        expires: 7
      }
    }]
  }
});
```

### Configuration with API Key and Alternative ID

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'locId',
      params: {
        endpoint: 'https://id.example.com/locid',
        apiKey: 'your-api-key',
        altId: 'publisher-user-id',
        timeoutMs: 1000,
        withCredentials: true
      },
      storage: {
        type: 'html5',
        name: '_locid',
        expires: 7
      }
    }]
  }
});
```

## Parameters

{: .table .table-bordered .table-striped }

| Param | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | Module identifier. Must be `"locId"`. | `"locId"` |
| params | Required | Object | Configuration parameters. | |
| params.endpoint | Required | String | First-party LocID endpoint URL. See Endpoint Requirements below. | `"https://id.example.com/locid"` |
| params.ipEndpoint | Optional | String | Separate lightweight endpoint returning only the connection IP. Used for IP change detection without a full tx_cloc fetch. | `"https://id.example.com/ip"` |
| params.ipCacheTtlMs | Optional | Number | TTL for the IP cache entry in milliseconds. | `14400000` (4 hours, default) |
| params.altId | Optional | String | Alternative identifier appended as `?alt_id=` query parameter. | `"user123"` |
| params.timeoutMs | Optional | Number | Request timeout in milliseconds. | `800` (default) |
| params.withCredentials | Optional | Boolean | Include credentials (cookies) on the request. | `false` (default) |
| params.apiKey | Optional | String | API key passed via the `x-api-key` request header. | `"your-api-key"` |
| params.privacyMode | Optional | String | Privacy mode: `"allowWithoutSignals"` (default) or `"requireSignals"`. | `"allowWithoutSignals"` |
| params.requirePrivacySignals | Optional | Boolean | If `true`, requires privacy signals to be present. Equivalent to `privacyMode: 'requireSignals'`. | `false` (default) |
| storage | Required | Object | Storage configuration for caching the ID. | |
| storage.type | Required | String | Storage type. Use `"html5"` for localStorage. | `"html5"` |
| storage.name | Required | String | Storage key name. | `"_locid"` |
| storage.expires | Optional | Number | TTL in days. | `7` |

## Endpoint Requirements

The `endpoint` parameter must point to a first-party proxy or on-premises service, not the LocID Encrypt API directly.

The LocID Encrypt API requires the client IP address as a parameter. Since browsers cannot determine their own public IP, a server-side proxy is required to:

1. Receive the request from the browser
2. Extract the client IP from the incoming connection
3. Forward the request to the LocID Encrypt API with the IP injected
4. Return the response (`tx_cloc`, `connection_ip`) to the browser

If `altId` is configured, the module appends it as `?alt_id=<value>` to the endpoint URL.

## Privacy Handling

LocID operates under Legitimate Interest (LI). The module's privacy behavior depends on the configured privacy mode.

### Default Behavior (allowWithoutSignals)

- **No privacy signals present**: Module proceeds and fetches the ID
- **Privacy signals present**: Enforcement rules apply

### Strict Mode (requireSignals)

- **No privacy signals present**: Module returns `undefined`
- **Privacy signals present**: Enforcement rules apply

### Privacy Signal Enforcement

When privacy signals are present, the module does not fetch or return an ID if any of the following apply:

- GDPR applies and vendorData is present, but consentString is missing or empty
- US Privacy (CCPA) string indicates a processing restriction (third character is `Y`)
- GPP signals indicate an applicable processing restriction

When GDPR applies and consentString is present, the module proceeds unless a framework processing restriction is signaled.

## Storage

The module caches the LocID using Prebid's standard storage framework. Configure storage settings via the `storage` object.

The endpoint response contains:

- `tx_cloc`: Transactional LocID (used as the EID value)
- `connection_ip`: The resolved client IP address (used for IP-aware cache invalidation)

The module only uses `tx_cloc` for the EID. Any `stable_cloc` in the response is ignored client-side; it is available for proxy/endpoint operators to use in their own caching strategies.

### IP Change Detection

The module uses a two-tier cache to detect IP changes without churning the tx_cloc identifier:

- **IP cache** (default 4-hour TTL): Tracks the current connection IP in a separate localStorage key.
- **tx_cloc cache** (configured via `storage.expires`): Stores the LocID via Prebid's userId framework.

When the IP cache expires, the module refreshes the IP. If `ipEndpoint` is configured, it makes a lightweight IP-only check first and only calls the main endpoint when the IP has changed. If the IP is unchanged and the tx_cloc cache is still valid, the existing tx_cloc is reused without calling the main endpoint.

## EID Output

When available, the LocID is included in the bid request as:

```json
{
  "source": "locid.com",
  "uids": [{
    "id": "SYybozbTuRaZkgGqCD7L7EE0FncoNUcx-om4xTfhJt36TFIAES2tF1qPH",
    "atype": 1
  }]
}
```

The `atype` value of `1` is the OpenRTB agent type for web environment; it is not an IAB GVL vendor ID.

## Debugging

```javascript
// Check if LocID is available
pbjs.getUserIds().locId

// Force refresh
pbjs.refreshUserIds()

// Check stored value
localStorage.getItem('_locid')
```
