---
layout: userid
title: European Unified ID
description: European Unified ID User ID sub-module
useridmodule: euidIdSystem
---

European Unified ID (EUID) is an open-source identity solution built for the open internet and based on the Unified ID 2.0 solution. It leverages encrypted email data to provide a privacy-conscious, secure, and accurate identity standard designed to meet market requirements in Europe and the UK.

EUID relies on user consent before an ID can be added to the bid stream. Consent can be gathered by SSO providers who have integrated against the EUID framework, or through a publisher's own login and consent mechanism.

To add EUID to your Prebid.js package, run the following:

{: .alert.alert-info :}
gulp build --modules=euidIdSystem

## European Unified ID Registration

European Unified ID is still in the pre-release phase. To obtain an EUID publisher account, get in touch with your UID2 account contact.

Each publisher’s privacy policy should take European Unified ID into account.

## European Unified ID Tokens

EUID tokens are generated on the server side by making an API call to an EUID operator using details provided when you receive EUID publisher access. This API returns a JSON data structure with multiple values, including an advertising token and a refresh token. For full functionality, provide the entire object in one of these ways:

- JSON-encoded as a cookie.
- Included in the configuration object.

For examples, see [European Unified ID Examples](#european-unified-id-examples).

The following sample is fictitious, but shows what the token response object looks like:

```javascript
{
  "advertising_token": "...",
  "refresh_token": "...",
  "identity_expires": 1633643601000,
  "refresh_from": 1633643001000,
  "refresh_expires": 1636322000000,
  "refresh_response_key": "wR5t6HKMfJ2r4J7fEGX9Gw=="
}
```

When this full data structure is provided, the module automatically refreshes the token periodically, as long as the refresh token hasn't expired.

## Client Refresh mode

This is the recommended mode for most scenarios. In this mode, the full response body from the EUID Token Generate or Token Refresh endpoint must be provided to the module. As long as the refresh token remains valid, the module will refresh the advertising token as needed.

To configure the module to use this mode, you must **either**:

1. Set `params.euidCookie` to the name of the cookie which contains the response body as a JSON string, **or**
2. Set `params.euidToken` to the response body as a JavaScript object.

### Client refresh cookie example

In this example, the cookie is called `euid_pub_cookie`.

Cookie:

```javascript
euid_pub_cookie={"advertising_token":"...advertising token...","refresh_token":"...refresh token...","identity_expires":1684741472161,"refresh_from":1684741425653,"refresh_expires":1684784643668,"refresh_response_key":"...response key..."}
```

Configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'euid',
            params: {
                euidCookie: 'euid_pub_cookie'
            }
        }]
    }
});
```

### Client refresh euidToken example

Configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'euid',
            params: {
                euidToken: {
                    'advertising_token': '...advertising token...',
                    'refresh_token': '...refresh token...',
                    // etc. - see the Sample Token below for contents of this object
                }
            }
        }]
    }
});
```

## European Unified ID Server-Only Mode

There is a server-only mode where the value of the advertising token can be provided either directly (see the `value` parameter in the [European Unified ID Configuration](#european-unified-id-configuration) section) or via a cookie. In this mode, no attempt is made to automatically refresh the token.

### Cookie-based server-only mode

To use the cookie-based server-only mode, set a cookie named `__euid_advertising_token` to the value of the advertising token only, as shown in this fictitious example:

Cookie: `__euid_advertising_token=eb33b0cb8d354722b9c01a31d4064888`

Configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'euid'
        }]
    }
});
```

### Configuration-based server-only mode

To use the configuration-based server-only mode, set the value directly in the configuration of the module, as shown in this fictitious example:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'euid'
            value: {
                'euid': {
                    'id': 'eb33b0cb8d354722b9c01a31d4064888'
                }
            }
        }]
    }
});
```

## European Unified ID Configuration

The following parameters apply only to the European Unified ID module integration.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the EUID module - `"euid"` | `"euid"` |
| value | Optional, Server only | Object | An object containing the value for the advertising token. | See the example above. |
| params.euidToken | Optional, Client refresh | Object | The initial EUID token. This should be `body` element of the decrypted response from a call to the `/token/generate` or `/token/refresh` endpoint. | See the sample token above. |
| params.euidCookie | Optional, Client refresh | String | The name of a cookie which holds the initial EUID token, set by the server. The cookie should contain JSON in the same format as the euidToken param. **If euidToken is supplied, this param is ignored.** | See the sample token above. |
| params.euidApiBase | Optional, Client refresh | String | Overrides the default EUID API endpoint. | `"https://prod.euid.eu"` _(default)_|
| params.storage | Optional, Client refresh | String | Specify whether to use `cookie` or `localStorage` for module-internal storage. It is recommended to not provide this and allow the module to use the default. | `localStorage` _(default)_ |

## European Unified ID Examples

In the following example, the publisher has set a cookie called `euid_identity` containing the EUID token generation response object:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'euid',
      params: {
        euidServerCookie: 'euid_identity'
      }
    }]
  }
});
```

In the following example, the publisher has retrieved a server-generated EUID response, and it is currently stored in the JavaScript variable `euidIdentity`:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'euid',
      params: {
        euidToken: euidIdentity
      }
    }]
  }
});
```
