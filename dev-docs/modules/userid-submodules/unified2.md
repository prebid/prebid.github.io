---
layout: userid
title: Unified ID 2.0
description: Unified ID 2.0 User ID sub-module
useridmodule: uid2IdSystem
---


Unified ID 2 (often just called 'UID2') is an email based id solution that is owned and operated by the prebid community.  Unified ID 2 relies on user consent before an id can be added to the bid stream.  Consent can be gathered by SSO providers who have integrated against the UID2 framework, or Publishers own login & consent mechaninism.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=uid2IdSystem

## Unified ID Registration

You can set up Unified ID 2 in one of these ways:

- Include the module to your pb.js wrapper. You will need to apply for Publisher access to the UID2 system at [The Trade Desk's UID2 portal](https://www.thetradedesk.com/us/about-us/industry-initiatives/unified-id-solution-2-0#request-access). Using this option, you will need to generate UID2 tokens server-side (there is currently no client-side-only flow without using an SSO provider). You provide these tokens to Prebid.js either using a cookie or directly in configuration.
- Utilize a [managed services](https://prebid.org/product-suite/managed-services/) company who can do this for you.

Each publisher’s privacy policy should take UnifiedId 2 into account.

## Unified ID 2 Tokens

UID2 tokens are generated on the server-side by making an API call to a UID2 operator using details provided when you receive UID2 Publisher access. This API will return a JSON data structure with multiple values, including an advertising token and a refresh token. For full functionality, the entire object should be provided, either JSON-encoded as a server-set cookie or by being included in the configuration object (see examples).

Sample token response object:

`{`<br />&nbsp;&nbsp;`"advertising_token": "...",`<br />&nbsp;&nbsp;`"refresh_token": "...",`<br />&nbsp;&nbsp;`"identity_expires": 1633643601000,`<br />&nbsp;&nbsp;`"refresh_from": 1633643001000,`<br />&nbsp;&nbsp;`"refresh_expires": 1636322000000,`<br />&nbsp;&nbsp;`"refresh_response_key": "wR5t6HKMfJ2r4J7fEGX9Gw=="`<br />`}`

When this full data structure is provided, the module will automatically refresh the token periodically, as long as the refresh token hasn't expired.

## Unified ID 2 Legacy Mode

There is a legacy mode where either the value of the advertising token can be provided directly (see the `value` param in the *Configuration* section), or via a legacy cookie. In this mode, no attempt is made to automatically refresh the token.

To use the cookie-based legacy mode, set a cookie named `__uid2_advertising_token` to the value of the advertising token only. For example:

`__uid2_advertising_token=eb33b0cb-8d35-4722-b9c0-1a31d4064888`

## Unified ID 2 Configuration

The below parameters apply only to the UID 2.0 User ID Module integration.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the UID20 module - `"uid2"` | `"uid2"` |
| params.uid2Token | Optional | Object | The initial UID2 token. This should be `body` element of the decrypted response from a call to the `/token/generate` or `/token/refresh` endpoint. | See the sample token above. |
| params.uid2ServerCookie | Optional | String | The name of a cookie which holds the initial UID2 token, set by the server. The cookie should contain JSON in the same format as the alternative uid2Token param. **If uid2Token is supplied, this param is ignored.** | See the sample token above. |
| params.uid2ApiBase | Optional | String | Overrides the default UID2 API endpoint. | `https://prod.uidapi.com` _(default)_ |
| value | Not recommended | Object | Used only if the page has a separate mechanism for storing the UID 2.O ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage. Tokens will **not** be automatically refreshed. | `{"uid2": { "id": "eb33b0cb-8d35-4722-b9c0-1a31d4064888"}}` |

## Unified ID 2 Example

Publisher has set a server-side cookie called `uid2_identity` containing the UID2 token generation response object:

{% highlight javascript %}
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
{% endhighlight %}

Publisher has retrieved a server-generated UID2 response and it is currently stored in the JavaScript variable `uid2Identity`:

{% highlight javascript %}
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
{% endhighlight %}
