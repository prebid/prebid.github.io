---
layout: userid
title: Rediads ID
description: Rediads User ID sub-module
useridmodule: rediadsIdSystem
bidRequestUserId: rediadsId
eidsource: rediads.com
example: '"ruid_7b9c1d3f-1e2b-4e7b-9e5a-acde12345678"'
---

## Overview

The Rediads User ID submodule generates a first-party browser identifier for publisher-side identity and makes it available to Prebid bidders through both `bidRequest.userId.rediadsId` and `bidRequest.userIdAsEids`.

This submodule is implemented as a Prebid User ID module and uses Prebid-managed storage.

## Registration

For setup information, contact [support@rediads.com](mailto:support@rediads.com).

## Installation

Build Prebid.js with the User ID core module, the Rediads ID submodule, and optionally the Rediads bidder:

```bash
gulp build --modules=rediadsBidAdapter,userId,rediadsIdSystem
```

If you only need the user ID module, you can omit `rediadsBidAdapter`:

```bash
gulp build --modules=userId,rediadsIdSystem
```

## Configuration

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'rediadsId',
      params: {
        source: 'rediads.com'
      },
      storage: {
        type: 'html5',
        name: 'rediads_id',
        expires: 30,
        refreshInSeconds: 3600
      }
    }]
  }
});
```

## Parameters

{: .table .table-bordered .table-striped }

| Param under `userSync.userIds[]` | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| `name` | Required | String | Module identifier. Must be `"rediadsId"`. | `"rediadsId"` |
| `params` | Optional | Object | Rediads-specific configuration. | |
| `params.source` | Optional | String | EID source to emit. Defaults to `"rediads.com"`. | `"rediads.com"` |
| `storage` | Recommended | Object | Prebid-managed storage configuration. | |
| `storage.type` | Recommended | String | Storage type. Use `"html5"`, `"cookie"`, or `"cookie&html5"` as needed. | `"html5"` |
| `storage.name` | Recommended | String | Storage key name. | `"rediads_id"` |
| `storage.expires` | Optional | Number | Lifetime of the stored ID in days. Defaults to `30`. | `30` |
| `storage.refreshInSeconds` | Optional | Number | Refresh interval in seconds. Defaults to `3600`. | `3600` |

## Privacy Handling

The Rediads ID submodule follows the standard Prebid User ID privacy flow.

- If COPPA applies, the module does not create or return an ID.
- If GDPR applies without a valid consent string and Purpose 1 consent, the module does not create or return an ID.
- If US Privacy or GPP opt-out signals restrict sharing, the module may still retain its local ID state but does not emit EIDs for bidder sharing.

The module uses Prebid's vendorless TCF marker so purpose-level enforcement applies without requiring a separate vendor registration in the module config.

## Bid Request Output

When available, the Rediads ID is exposed on the bid request as:

```javascript
bidRequest.userId.rediadsId
```

Example:

```json
{
  "uid": "ruid_7b9c1d3f-1e2b-4e7b-9e5a-acde12345678",
  "source": "rediads.com",
  "atype": 1,
  "ext": {
    "canShare": true
  }
}
```

## EID Output

When sharing is permitted, the module contributes the following EID:

```json
{
  "source": "rediads.com",
  "uids": [{
    "id": "ruid_7b9c1d3f-1e2b-4e7b-9e5a-acde12345678",
    "atype": 1
  }]
}
```

## Testing

After building Prebid.js with `userId` and `rediadsIdSystem`, you can verify the module with:

```javascript
pbjs.getUserIds()
pbjs.getUserIdsAsEids()
```

You should see `rediadsId` in `getUserIds()` and a `rediads.com` entry in `getUserIdsAsEids()` when privacy settings allow sharing.
