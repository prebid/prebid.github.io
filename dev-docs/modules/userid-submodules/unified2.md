---
layout: userid
title: Unified ID 2.0
description: Unified ID 2.0 User ID sub-module
useridmodule: uid2IdSystem
---

Unified ID 2.0 (UID2) is an open-source identity solution built for the open internet. It leverages encrypted email and phone number data to provide a privacy-conscious, secure, and accurate identity standard for the entire digital advertising ecosystem.

UID2 relies on user consent before an ID can be added to the bid stream. Consent can be gathered by SSO providers who have integrated against the UID2 framework, or through a publisher's own login and consent mechanism.

To add UID2 to your Prebid.js package, run the following:

{: .alert.alert-info :}
gulp build --modules=uid2IdSystem

## Unified ID 2.0 Registration

You can set up Unified ID 2.0 in one of these ways:

- Include the module to your pb.js wrapper. You will need to apply for publisher access [on the UID2 website](https://unifiedid.com/request-access). Using this option, you must generate UID2 tokens server-side. There is currently no flow for client-side only, unless you use an SSO provider. You provide these tokens to Prebid.js either by using a cookie or directly in the configuration.
- Use a [managed services](https://prebid.org/product-suite/managed-services/) company that can do this for you.

Each publisher’s privacy policy should take UnifiedID 2.0 into account.

## Unified ID 2.0 Tokens

UID2 tokens are generated on the server side by making an API call to a UID2 operator using details provided when you receive UID2 publisher access. This API returns a JSON data structure with multiple values, including an advertising token and a refresh token. For full functionality, provide the entire object in one of these ways:

- JSON-encoded as a cookie.
- Included in the configuration object.

For examples, see [Unified ID 2.0 Examples](#unified-id-20-examples).

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

## Unified ID 2.0 Server-Only Mode

There is a server-only mode where the value of the advertising token can be provided either directly (see the `value` parameter in the [Unified ID 2.0 Configuration](#unified-id-20-configuration) section) or via a cookie. In this mode, no attempt is made to automatically refresh the token.

To use the cookie-based server-only mode, set a cookie named `__uid2_advertising_token` to the value of the advertising token only, as shown in this fictitious example:

`__uid2_advertising_token=eb33b0cb-8d35-4722-b9c0-1a31d4064888`

## Unified ID 2.0 Configuration

The following parameters apply only to the Unified ID 2.0 module integration.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the Unified ID 2.0 module - `"uid2"` | `"uid2"` |
| params.uid2Token | Optional | Object | The initial UID2 token. This should be the `body` element of the decrypted response from a call to the `/token/generate` or `/token/refresh` endpoint. | See the sample token above. |
| params.uid2ServerCookie | Optional | String | The name of a cookie that holds the initial UID2 token, set by the server. The cookie should contain JSON in the same format as the alternative uid2Token param. **If uid2Token is supplied, this param is ignored.** | See the sample token above. |
| params.uid2ApiBase | Optional | String | Overrides the default UID2 API endpoint. | `https://prod.uidapi.com` _(default)_ |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the UID 2.0 ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage, and the tokens are **not** automatically refreshed. | `{"uid2": { "id": "eb33b0cb-8d35-4722-b9c0-1a31d4064888"}}` |
| params.storage | Optional, Client refresh | String | Specify whether to use `cookie` or `localStorage` for module-internal storage. It is recommended to not provide this and allow the module to use the default. | `localStorage` _(default)_ |

## Unified ID 2.0 Examples

In the following example, the publisher has set a cookie called `uid2_identity` containing the UID2 token generation response object:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'uid2',
      params: {
        uid2ServerCookie: 'uid2_identity'
      }
    }]
  }
});
```

In the following example, the publisher has retrieved a server-generated UID2 response, and it is currently stored in the JavaScript variable `uid2Identity`:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'uid2',
      params: {
        uid2Token: uid2Identity
      }
    }]
  }
});
```
