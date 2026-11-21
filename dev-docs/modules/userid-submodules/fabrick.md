---
layout: userid
title: Fabrick ID by Neustar
description: Fabrick ID by Neustar User ID sub-module
useridmodule: fabrickIdSystem
bidRequestUserId: fabrickId
eidsource: neustar.biz
example: '"1111"'
---


[Neustar Fabrick™](https://www.home.neustar/fabrick) is a unified identity ecosystem that powers connections between brands, publishers, and consumers to accelerate marketing performance across online and offline channels.

Add it to your Prebid.js package with:

```bash
gulp build --modules=fabrickIdSystem
```

## Fabrick Registration

Please reach out to [FabrickIntegrations@team.neustar](mailto:FabrickIntegrations@team.neustar) to request your `apiKey`.

## Fabrick Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"fabrickId"` |
| params | Required | Object | Container of all module params. | |
| params.apiKey | Required | String | This is your apiKey as provided by Neustar. | |
| params.e | | String, Number, or an array of them | This is a hashed email address used to link a user to their Fabrick ID. | |
| params.p | | String, Number, or an array of them | This is a hashed phone number used to link a user to their Fabrick ID. | |
| params.i4 | | String, Number, or an array of them | This is an IPv4 address used to link a user to their Fabrick ID. | |
| params.i6 | | String, Number, or an array of them | This is an IPv6 address used to link a user to their Fabrick ID. | |
| params.m | | String, Number, or an array of them | This is a mobile advertising ID (IDFA/AAID) used to link a user to their Fabrick ID. | |
| params.ia | | String, Number, or an array of them | This is an identifier for advertising (IFA) used to link a user to their Fabrick ID. | |
| params.iv | | String, Number, or an array of them | This is an identifier for vendors (IFV) used to link a user to their Fabrick ID. | |
| params.1pd | | String, Number, or an array of them | This is partner or advertiser’s 1st party user ID (e.g. a Customer ID/CUSTID) other than a 1st party cookie ID.  Length allowed: 255 characters. Characters allowed: (A-Z a-z), digits (0-9), '-' '_' '/' ':' '=' '.'. Characters not allowed: '>' '<' '*' '+' '&' '@' '#' '!' '%' '$' '(' ')' '?' ';' '\|' '\' '{' '}' '[' ']'. | |
| params.u | | String, Number, or an array of them | This is the page_url - the url which the user is currently browsing. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.f | | String, Number, or an array of them | This is the referrer_url - the url which the user visited prior to landing on the page_url. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.ifa_type | | String, Number, or an array of them | This denotes the source of the IFA. Please refer to [IAB IFA Guidelines](https://www.iab.com/guidelines/guidelines-for-identifier-for-advertising-ifa-on-ott-platforms/) for recommended values and additional details. | |
| params.lmt | | `0`, `1`, `'0'`, `'1'` or Boolean | Limit ad tracking. `true`/`false` are sent as `1`/`0`; booleans work since the Prebid.js release that includes [Prebid.js#16126](https://github.com/prebid/Prebid.js/pull/16126) and were dropped before it. A value of `1` indicates that a user has requested that ad tracking and measurement be disabled. If a value of '1' is being passed, the real IFA must not be sent via the 'ia' parameter – a 'synthetic' or 'session' IFA can be sent. Please refer to [IAB IFA Guidelines](https://www.iab.com/guidelines/guidelines-for-identifier-for-advertising-ifa-on-ott-platforms/) for recommended values and additional details. | |
| params.1pc | | String, Number, or an array of them | This is partner or advertiser’s 1st party cookie ID.  Length allowed: 255 characters.  Characters allowed: (A-Z a-z), digits (0-9), '-' '_' '/' ':' '=' '.'.  Characters not allowed: '>' '<' '*' '+' '&' '@' '#' '!' '%' '$' '(' ')' '?' ';' '\|' '\' '{' '}' '[' ']'. | |
| params.iab1 | | String, Number, or an array of them | This is IAB Tech Lab’s Content Taxonomy v3.0  Tier 1 category. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.iab2 | | String, Number, or an array of them | This is IAB Tech Lab’s Content Taxonomy v3.0  Tier 2 category. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.iab3 | | String, Number, or an array of them | This is IAB Tech Lab’s Content Taxonomy v3.0 Tier 3 category. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.iab4 | | String, Number, or an array of them | This is IAB Tech Lab’s Content Taxonomy v3.0 Tier 4 category. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.url | Optional | String | Base request URL. Params are appended directly, so include the trailing `?`. | `"https://fid.agkn.com/f?"` (default) |
| params.refererInfo | Optional | Object | Replaces the referer info Prebid.js detects. The module reads `topmostLocation`, `stack[0]` and `canonicalUrl`. | |
| params.maxUrlLen | Optional | Number | Maximum request URL length when appending referrers. | `2000` (default) |
| params.maxRefLen | Optional | Number | Maximum length of each appended `&r=` referrer parameter. | `1000` (default) |
| params.maxSpaceAvailable | Optional | Number | A referrer is appended only while the URL is shorter than `maxUrlLen - maxSpaceAvailable`. | `50` (default) |

Every param except `url`, `refererInfo` and names starting with `max` is appended to the request query string without further encoding. An array value is sent once per string or number element, for example `e=hash1&e=hash2`.

The module also appends up to four URL-encoded `r` referrer params: `topmostLocation`, `stack[0]`, `canonicalUrl` and `window.location.href`, keeping the longest URL for each address without query string. Each is truncated to fit `maxRefLen` and the space left under `maxUrlLen`.

## Fabrick Examples

1. Publisher passes an apiKey and hashed email address and elects to store the Fabrick ID envelope in a cookie.

    ```javascript
    pbjs.setConfig({
        userSync: {
            userIds: [{
                name: 'fabrickId',
                params: {
                    apiKey: '123456789', // provided to you by Neustar
                    e: '31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66' // example hashed email address (sha256)
                },
                storage: {
                    name: 'pbjs_fabrickId',
                    type: 'cookie',
                    expires: 7
                }
            }]
        }
    });
    ```

2. Publisher passes an apiKey and hashed email address and elects to store the fabrickId envelope in HTML5 localStorage.

    ```javascript
    pbjs.setConfig({
        userSync: {
            userIds: [{
                name: 'fabrickId',
                params: {
                    apiKey: '123456789', // provided to you by Neustar
                    e: '31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66' // example hashed email address (sha256)
                },
                storage: {
                    type: "html5",
                    name: "pbjs_fabrickId",
                    expires: 7
                }
            }]
        }
    });
    ```
