---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developer | User ID Sync

---

# Prebid Server User ID Sync

## Motivation

Many bidders track their bidder-specific user IDs through cookies. Since bidders will generally serve ads from a different domain
than where Prebid Server is hosted, those cookies must be consolidated under the Prebid Server domain so
that they can be sent to each demand source as part of auction calls.

## How it Works

Prebid Server stores bidder IDs in the `uids` cookie in the host domain. For example:

```
{"uids":{},"tempUIDs":{"adnxs":{"uid":"4722255122219375043","expires":"2020-07-30T22:10:28.961Z"},"triplelift":{"uid":"9328941297032053459","expires":"2020-07-30T22:10:33.496Z"},"yieldone":{"uid":"8c41c3b1-ce22-44fd-9bd7-454cd79e3c91","expires":"2020-07-30T22:10:33.229Z"},"ix":{"uid":"XlV6w9HM6LYAAHx2YJ4AAACZ&476","expires":"2020-07-30T22:10:31.916Z"},"yieldmo":{"uid":"ge515bd6c7da71cdc98a","expires":"2020-07-30T22:10:32.569Z"},"adform":{"uid":"1707054018971720697","expires":"2020-07-30T22:10:30.453Z"},"brightroll":{"uid":"y-S8Fq5QZ1lwWKPeXdoZ9vSeZx47maINFrJeY53pDtokA2FlaPmwvrJg--","expires":"2020-07-30T22:10:29.867Z"},"consumable":{"uid":"ue1-sb1-aa634f4b-d618-4378-b8c3-9baa56dcb91a","expires":"2020-07-30T22:10:28.07Z"},"pubmatic":{"uid":"2ECE1904-7EB2-4C38-98A4-38E97535AA9C","expires":"2020-07-30T22:10:27.559Z"},"rubicon":{"uid":"KACWYIER-P-59CH","expires":"2020-07-30T22:22:42.432Z"},"pulsepoint":{"uid":"dcxvyKqDV5VV","expires":"2020-07-30T22:10:26.915Z"},"sovrn":{"uid":"bad97f98b08c9204fe6b9826","expires":"2020-07-30T22:10:25.588Z"},"openx":{"uid":"f1f4ac13-99f8-46da-82f8-b52c29b378e0","expires":"2020-07-30T22:10:25.93Z"}},"bday":"2020-05-18T20:01:18.934Z"}
```

Here's how these IDs get placed in the cookie:

![Prebid Server Cookie Sync](/assets/images/prebid-server/pbs-cookie-sync.png){:class="pb-lg-img"}


1) Prebid.js starts by calling the Prebid Server [`/cookie_sync`](/prebid-server/endpoints/pbs-endpoint-cookieSync.html), letting it know which server-side bidders will be participating in the header bidding auction. 

```
POST https://prebid-server.example.com/cookie_sync

{"bidders":["bidderA","bidderB"], "gdpr":1, "gdpr_consent":"...", "us_privacy": "..."}
```

2) If privacy regulations allow, Prebid Server will look at the `uids` cookie in the host domain and determine whether any bidders are missing or need to be refreshed. It responds with an array of pixel syncs. e.g.

```
{"status":"ok","bidder_status":[{"bidder":"bidderA","no_cookie":true,"usersync":{"url":"//biddera.com/getuid?https%3A%2F%2Fprebid-server.example.com%2Fsetuid%3Fbidder%3DbidderA%26gdpr%3D%26gdpr_consent%3D%26us_privacy%3D%26uid%3D%24UID","type":"redirect","supportCORS":false}},{"bidder":"bidderB","no_cookie":true,"usersync":{"url":"https://bidderB.com/u/match?gdpr=&euconsent=&us_privacy=&redir=https%3A%2F%2Fprebid-server.example.com%2Fsetuid%3Fbidder%3DbidderB%26gdpr%3D%26gdpr_consent%3D%26us_privacy%3D%26uid%3D","type":"redirect","supportCORS":false}}]}
```

3) When it receives the response, Prebid.js loops through each element of `bidder_status[]`, dropping a pixel for each `bidder_status[].usersync.url`.

4) The bidder-specific endpoints read the users's cookie for the bidder's domain and respond with a redirect back to Prebid Server's [`/setuid` endpoint](/prebid-server/endpoints/pbs-endpoint-setuid.html)

5) When the browser receives this redirect, it contacts Prebid Server, which will once again check the privacy settings and will update the `uids` cookie if allowed.

### How It Works for AMP

Cookie sync for AMP works in a way quite similar to Prebid.js.

1) The Prebid Server hosting company places a modified version of the `load-cookie` script onto a CDN. This script is part of the [Prebid Universal Creative](https://github.com/prebid/prebid-universal-creative/blob/master/src/cookieSync.js) repo.

Note that the only two values currently valid for 'endpoint' are 'appnexus' and 'rubicon' -- other host companies should update their copy to include their endpoint.


2) The publisher places the 'load-cookie' script into the page:

```
<amp-iframe width="1" title="User Sync"
  height="1"
  sandbox="allow-scripts"
  frameborder="0"
  src="https://PROVIDED_BY_HOSTCOMPANY/load-cookie.html?endpoint=HOSTCOMPANY&max_sync_count=5">
  <amp-img layout="fill" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" placeholder></amp-img>
</amp-iframe>
```

3) At runtime, the `load-cookie` script just calls the Prebid Server /cookie_sync endpoint. The rest works the same as described for Prebid.js above.


## Building a Sync Endpoint

Bidders must implement an endpoint under their domain which accepts an encoded URI for redirects. 
This URL should be able to accept privacy parameters:

- gdpr: if 0, declares this request isn't in GDPR scope. If 1, declares it is in scope. Otherwise indeterminate.
- gdpr_consent: the TCF1 or TCF2 consent string. This is unpadded base64-URL encoded.
- us_privacy: the IAB US Privacy string

These values will be passed to your usersync endpoint. For example:

Here's an example that shows the privacy macros used by PBS-Go:
```
GET some-bidder-domain.com/usersync-url?gdpr={%raw%}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}{%endraw%}&redirectUri=prebid-server.example.com%2Fsetuid%3Fbidder%3Dsomebidder%26uid%3D%24UID
```
PBS-Java uses slightly different macros:
```
GET some-bidder-domain.com/usersync-url?gdpr={%raw%}{{gdpr}}&gdpr_consent={{gdpr_consent}}&us_privacy={{us_privacy}}{%endraw%}&redirectUri=prebid-server.example.com%2Fsetuid%3Fbidder%3Dsomebidder%26uid%3D%24UID
```
In either case, you can receive the values on whatever query string parameters you'd like -- these are
the macros you can use to define the values.

This example endpoint would URL-decode the `redirectUri` param to get `prebid-server.example.com/setuid?bidder=somebidder&uid=$UID`.
It would then replace the `$UID` macro with the user's ID from their cookie. Supposing this user's ID was "132",
it would then return a redirect to `prebid-server.example.com/setuid?bidder=somebidder&uid=132`.

Prebid Server would then save this ID mapping of `somebidder: 132` under the cookie at `prebid-domain.com`.

When the client then calls `www.prebid-domain.com/openrtb2/auction`, the ID for `somebidder` will be available in the Cookie.
Prebid Server will then stick this into `request.user.buyeruid` in the OpenRTB request it sends to `somebidder`'s Bidder.
