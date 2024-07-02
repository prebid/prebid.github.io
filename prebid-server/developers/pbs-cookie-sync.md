---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developer | User ID Sync

---

# Prebid Server User ID Sync
{: .no_toc}

* TOC
{:toc}

## Motivation

Many bidders track their bidder-specific user IDs through cookies. Since bidders will generally serve ads from a different domain
than where Prebid Server is hosted, those cookies must be consolidated under the Prebid Server domain so
that they can be sent to each demand source as part of auction calls.

## How it Works

Prebid Server stores bidder IDs in the `uids` cookie in the host domain. For example:

```javascript
{"uids":{},"tempUIDs":{"adnxs":{"uid":"4722255122219375043","expires":"2020-07-30T22:10:28.961Z"},"triplelift":{"uid":"9328941297032053459","expires":"2020-07-30T22:10:33.496Z"},"yieldone":{"uid":"8c41c3b1-ce22-44fd-9bd7-454cd79e3c91","expires":"2020-07-30T22:10:33.229Z"},"ix":{"uid":"XlV6w9HM6LYAAHx2YJ4AAACZ&476","expires":"2020-07-30T22:10:31.916Z"},"yieldmo":{"uid":"ge515bd6c7da71cdc98a","expires":"2020-07-30T22:10:32.569Z"},"adform":{"uid":"1707054018971720697","expires":"2020-07-30T22:10:30.453Z"},"consumable":{"uid":"ue1-sb1-aa634f4b-d618-4378-b8c3-9baa56dcb91a","expires":"2020-07-30T22:10:28.07Z"},"pubmatic":{"uid":"2ECE1904-7EB2-4C38-98A4-38E97535AA9C","expires":"2020-07-30T22:10:27.559Z"},"rubicon":{"uid":"KACWYIER-P-59CH","expires":"2020-07-30T22:22:42.432Z"},"pulsepoint":{"uid":"dcxvyKqDV5VV","expires":"2020-07-30T22:10:26.915Z"},"sovrn":{"uid":"bad97f98b08c9204fe6b9826","expires":"2020-07-30T22:10:25.588Z"},"openx":{"uid":"f1f4ac13-99f8-46da-82f8-b52c29b378e0","expires":"2020-07-30T22:10:25.93Z"}}}
```

## Setting the uids Cookie

### Setting the uids cookie from Prebid.js

Here's how these IDs get placed in the cookie from Prebid.js:

![Prebid Server Cookie Sync](/assets/images/prebid-server/pbs-cookie-sync.png){:class="pb-lg-img"}

1. When the [s2sConfig](/dev-docs/modules/prebidServer.html) is set, Prebid.js initiates a call to the Prebid Server [`/cookie_sync`](/prebid-server/endpoints/pbs-endpoint-cookieSync.html), letting it know which server-side bidders will be participating in the header bidding auction.

```text
    POST https://prebid-server.example.com/cookie_sync

    {"bidders":["bidderA","bidderB"], "gdpr":1, "gdpr_consent":"...", "us_privacy": "..."}
```

{:start="2"}
2. If privacy regulations allow, Prebid Server will look at the `uids` cookie in the host domain and determine whether any bidders are missing or need to be refreshed. It responds with an array of pixel syncs. e.g.

```javascript
    {"status":"ok","bidder_status":[{"bidder":"bidderA","no_cookie":true,"usersync":{"url":"//biddera.com/getuid?https%3A%2F%2Fprebid-server.example.com%2Fsetuid%3Fbidder%3DbidderA%26gdpr%3D%26gdpr_consent%3D%26us_privacy%3D%26uid%3D%24UID","type":"redirect","supportCORS":false}},{"bidder":"bidderB","no_cookie":true,"usersync":{"url":"https://bidderB.com/u/match?gdpr=&euconsent=&us_privacy=&redir=https%3A%2F%2Fprebid-server.example.com%2Fsetuid%3Fbidder%3DbidderB%26gdpr%3D%26gdpr_consent%3D%26us_privacy%3D%26uid%3D","type":"redirect","supportCORS":false}}]}
```

{:start="3"}
3. When it receives the response, Prebid.js loops through each element of `bidder_status[]`, creating a pixel for each `bidder_status[].usersync.url`.

{:start="4"}
4. The bidder-specific endpoints read the users' cookie for the bidder's domain and respond with a redirect back to Prebid Server's [`/setuid` endpoint](/prebid-server/endpoints/pbs-endpoint-setuid.html) . This allows that endpoint to read the 3rd party cookie and reflect it back to Prebid Server. Note that if this user doesn't yet have an ID in that 3rd party domain, the sync endpoint is expected to create one.

{:start="5"}
5. When the browser receives this redirect, it contacts Prebid Server, which will once again check the privacy settings and if allowed,  update the `uids` cookie.

### Cooperative Syncing

Prebid Server supports a 'Cooperative Syncing' mode where all enabled bidders may be returned in a sync request even if they aren't on this particular page. This allows bidders to get their IDs in place for the next page where they are utilized.

Cooperative sync defaults can be configured at the host and account level. See the docs for [PBS-Java](https://github.com/prebid/prebid-server-java/blob/master/docs/config-app.md) and [PBS-Go](https://github.com/prebid/prebid-server/blob/master/config/usersync.go).

This is how to control the coop syncing behavior from Prebid.js:

```javascript
    pbjs.setConfig({
      s2sConfig: {
        ...
        coopSync: true,
        userSyncLimit: 5
        ...
      }
    });
```

### Manually initiating a sync

Where Prebid.js isn't present, like on [AMP](/prebid-server/use-cases/pbs-amp.html) pages, the call to [/cookie_sync](/endpoints/pbs-endpoint-cookieSync.html) doesn't happen automatically.
If there are scenarios where Prebid.js isn't around to initiate the /cookie_sync call, publishers can choose to put an iframe on their page.

This approach works in a way quite similar to Prebid.js except that the [/cookie_sync endpoint](/endpoints/pbs-endpoint-cookieSync.html) is initiated by a separate script that's part of `load-cookie.html'. This file must be placed on a CDN by the publisher's Prebid Server host company. Up until April 2024, the script existed in the [Prebid Universal Creative](https://github.com/prebid/prebid-universal-creative) repository, but has since been moved to the [user-sync](https://github.com/prebid/user-sync) repo.

1. The Prebid Server hosting company places the [load-cookie.html](#manually-initiating-a-sync) file onto a CDN.

    See [the AMP implementation guide](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync) for more information.

2. The publisher places a 'load-cookie' iframe into the page:

For AMP pages:

```html
    <amp-iframe width="1" title="User Sync"
      height="1"
      sandbox="allow-scripts allow-same-origin"
      frameborder="0"
      src="https://HOST/load-cookie.html?source=amp&endpoint=PBSHOST&max_sync_count=5">
      <amp-img layout="fill" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" placeholder></amp-img>
    </amp-iframe>
```

On regular web pages:

```html
    <iframe
      height="1"
      frameborder="0"
      src="https://HOST/load-cookie.html?endpoint=PBSHOST&max_sync_count=5&bidders=bidderA%2CbidderB">
```

Where:

* HOST is the location where `load-cookie.html` is stored
* PBSHOST is the (encoded) main URL for your Prebid Server, e.g. https%3A%2F%2Fprebid-server.example.com%2Fcookie_sync

{:start="3"}
3. At runtime, the `load-cookie` script calls the Prebid Server [/cookie_sync endpoint](/endpoints/pbs-endpoint-cookieSync.html). The rest works similar to what's described for Prebid.js above. One difference is that the bidders must be manually added to the call. Another difference is that AMP doesn't support iframe syncs, so load-cookie passes instructions to PBS so only pixel syncs are returned.

Here are all the arguments supported:

{: .table .table-bordered .table-striped }
| Parameter        | Scope        | Type    | Description                                                                                                                                              | Example                                              |
|------------------|--------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|
| endpoint         | recommended  | string  | A URL-encoded pointer to Prebid Server                                                                                                                   | https%3A%2F%2Fprebid-server.example.com%2Fcookie_sync |
| max_sync_count   | optional     | integer | How many syncs are allowed                                                                                                                               | 5                                                    |
| bidders          | optional(*)  | string  | Which bidders are in the page. Required if coop-sync is not on for Prebid Server. This is a URL-encoded comma-separate list of bidder codes.             | bidderA%2CbidderB                                    |
| source           | optional(*)  | string  | Recommended for AMP. If set to 'amp' will attempt to retrieve consent information, and force the response to be pixels only.                     | amp                                                  |
| gdpr             | optional     | integer | 1 if the request is in GDPR-scope, 0 if not.                                                                                                             | 0                                                    |
| gdpr_consent     | optional     | string  | TCF consent string                                                                                                                                       |                                                      |
| defaultGdprScope | optional     | integer | if set to 1 (the default), consider GDPR to be in scope when consent information cannot be retrieved from AMP. Has no effect when `source` is not "amp". | 0                                                    |
| gpp_sid          | optional | string  | GPP Section ID(s). Number in string form or comma-separated list of numbers                                                                              | 6,7                                                  |
| gpp              | optional | string | Global Privacy Platform string                                                                                                                           |                                             |
| timeout          | optional     | integer | Timeout (in milliseconds) to wait for consent data from AMP. Defaults to 10000. Has no effect when `source` is not "amp".                                | 500                                                  |
| args             | optional     | string  | Passed through to the /cookie_sync call query string. Used by some host companies.                                                                       |                                                      |

Note that enabling or disabling [Cooperative Sync](#cooperative-syncing) is not currently supported in load-cookie. Please make sure the account default is set up appropriately in PBS config.

{: .alert.alert-warning :}
Note: if your PBS host company is using a version of `load-cookie.html` older than May of 2024 and if your AMP page is using a CMP, you should consider using 'load-cookie-with-consent.html` instead. It's the same functionality, but older versions of `load-cookie.html` cannot read from CMPs.

## Bidder Instructions for Building a Sync Endpoint

Building a sync endpoint is optional -- e.g. there is no benefit from ID syncing for mobile-only bidders. For browser-based bidding, ID syncing can help improve buyer bid rate. There are two main options a bidder can choose to support:

* redirect: the client will drop an IMG tag into the page, then call the bidder's URL which needs to redirect to the Prebid Server /setuid endpoint.
* iframe: the client will drop an IFRAME tag into the page, then call the bidder's URL which responds with HTML and Javascript that calls the Prebid Server /setuid endpoint at some point.

Bidders must implement an endpoint under their domain which accepts an encoded URI for redirects. This URL should be able to accept privacy parameters:

* gdpr: if 0, declares this request isn't in GDPR scope. If 1, declares it is in scope. Otherwise indeterminate.
* gdpr_consent: the TCF1 or TCF2 consent string. This is unpadded base64-URL encoded.
* us_privacy: the IAB US Privacy string

The specific attributes can differ for your endpoint. For instance, you could choose to receive gdprConsent rather than gdpr_consent.

Here's an example that shows the privacy macros as configured in PBS-Go:

```yaml
userSync:
  redirect:
    url: https://some-bidder-domain.com/usersync-url?gdpr={%raw%}{{.GDPR}}{%endraw%}&consent={%raw%}{{.GDPRConsent}}{%endraw%}&us_privacy={%raw%}{{.USPrivacy}}{%endraw%}&redirect={%raw%}{{.RedirectURL}}{%endraw%}
    userMacro: YOURMACRO
```

PBS-Java uses slightly different macros in the bidder config:

```yaml
usersync:
   redirect:
      url: https://some-bidder-domain.com/usersync-url?gdpr={%raw%}{{gdpr}}{%endraw%}&consent={%raw%}{{gdpr_consent}}{%endraw%}&us_privacy={%raw%}{{us_privacy}}{%endraw%}&gpp={%raw%}{{gpp}}{%endraw%}&gpp_sid={%raw%}{{gpp_sid}}{%endraw%}&redirect={%raw%}{{redirect_url}}{%endraw%}
      uid-macro: YOURMACRO
```

In either case, the {%raw%}{{...}}{%endraw%} macros are resolved by PBS.

{: .alert.alert-warning :}
The "YOURMACRO" string here needs to be whatever your sync endpoint will recognize and resolve to the user's ID from your domain. Some examples of macros that bidders use: $UID, ${UID}, $$visitor_cookie$$, ${DI_USER_ID}, etc. Every bidder has their own value here.

Here's how this all comes together:

1. Prebid.js calls Prebid Server's cookie_sync endpoint
2. PBS responds with an array of user sync URLs, which may include your bidder's sync url
3. Prebid.js drops an img or iframe into the page, causing the browser to connect to the your usersync endpoint.
4. Your usersync endpoint will return with either a redirect to Prebid Server's /setuid endpoint or iframe HTML that eventually calls Prebid Server's /setuid endpoint.
5. Prebid Server then saves this ID mapping of `mybidder: 132` under the cookie at `prebid-domain.com`.

Then the next time the client then calls `www.prebid-domain.com/openrtb2/auction`, the ID for `mybidder` will be available in the Cookie. Prebid Server will then stick this value into `request.user.buyeruid` in the OpenRTB request it sends to `mybidder`'s bid adapter.

## Further Reading

* [Prebid Server Overview](/prebid-server/overview/prebid-server-overview.html)
* [Prebid.js s2sConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server)
* [Prebid AMP Implementation Guide](/dev-docs/show-prebid-ads-on-amp-pages.html)
