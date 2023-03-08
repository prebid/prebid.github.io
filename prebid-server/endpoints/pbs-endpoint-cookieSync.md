---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | /cookie_sync

---

# Prebid Server | Endpoints | /cookie_sync

This endpoint is used to initiate cookie syncs.

## Invoking /cookie_sync

Generally, two clients invoke the /cookie_sync endpoint:

1. The Prebid.js pbsBidAdapter module. See the options for [s2sConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server)
1. For AMP, the load-cookie.html file delivered with the Prebid Universal Creative. See the [AMP User Sync Guide](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync) for more info.

## Basic Request/Response

The example request below returns a set of URLs to enable cookie syncs across bidders. The request
must supply a JSON object to define the list of bidders that may need to be synced.

POST request:
```
{
  "bidders": ["bidderA", "bidderB"],
  "gdpr": 1,
  "gdpr_consent": "BONV8oqONXwgmADACHENAO7pqzAAppY"
}
```

Response:
```
{
  "status": "ok",
  "bidder_status": [
    {
      "bidder": "bidderA",
        "usersync": {
          "url": "someurl.com",
          "type": "redirect",
          "supportCORS": false
      }
    }
  ]
}
```

The client code is responsible for taking the `url` response parameter and invoking it in the appropriate way. For example:
- if `type` is "redirect", place an `img` tag in the page
- if `type` is "iframe", place an `iframe` tag in the page

### Request Parameters

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| bidders | optional | Array of bid adapters on the page or those the publisher wishes to sync. | ["bidderA"] | array of strings |
| gdpr | optional | Flag indicating whether the request is in-scope for GDPR processing. | 1 | 0 or 1 |
| gdpr_consent | optional | GDPR consent string from the CMP. | | string |
| us_privacy | optional | US Privacy consent string from the CMP. | 1NYN | string |
| limit | optional | Max number of sync URLs to return. | 5 | integer |
| coopSync | optional | Cooperative syncing is a way for publishers to help each other by allowing PBS to sync bidders beyond those specified by the `bidders` argument. See below for details. The default depends on PBS host company settings. | true | boolean |
| account | optional | Prebid Server specific account ID. | | string
| filterSettings | optional | Object defining which types of syncs are allowed for which bidders. Modeled after the similar Prebid.js feature. | | object |
| filterSettings.iframe | optional | Defines the filter settings for iframe syncs. | | object |
| filterSettings.image | optional | Defines the filter settings for redirect syncs. | | object |
| filterSettings. iframe/image.bidders | optional | Defines which bidders are in scope for this setting. Can be "*" to include all bidders. | ["bidderA"] | array of strings or "*" |
| filterSettings. iframe/image.filter | optional | Defines whether to include or exclude the named bidders for this entry. May be "include" or "exclude", Defaults to "include". | "include" | string |

Here's how PBS determines which bidders to sync:

1. Start with the list supplied in the `bidders` parameter.
1. If there is no `bidders` parameter, assume all known bidders.
1. Check in the uids cookie to see if any of the bidders need to be synced.
1. If there are any that need to sync, respect the `limit` parameter if supplied
1. If there's still available slots in the `limit` and `coopSync` is true, randomly add more unsynced bidders until the limit is reached.
1. If the filterSettings parameter is supplied, choose bidder sync details appropriately. Remove any bidder syncs that don't meet the filterSettings.

### GDPR and /cookie_sync

`gdpr` is optional. It should be 1 if GDPR is in effect, 0 if not, and omitted if the caller is unsure.

`gdpr_consent` is required if `gdpr` is `1`, and optional otherwise. If present, it should be an [unpadded base64-URL](https://tools.ietf.org/html/rfc4648#page-7) encoded [Vendor Consent String](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Consent%20string%20and%20vendor%20list%20formats%20v1.1%20Final.md#vendor-consent-string-format).

If `gdpr` is  omitted, callers are still encouraged to send `gdpr_consent` if they have it.
Depending on how the Prebid Server host company has configured their servers, they may or may not require it for cookie syncs.


### FilterSettings

This is a flexible setting based on the Prebid.js feature of the same name
that allows publishers control over which bidders are allowed to drop iframes
vs images.

It could be specified in a detailed way like this:
```
"filterSettings": {
  "iframe": {
    "bidders": ["bidderA"], // only this bidder is excluded from syncing iframe pixels, all other bidders are allowed
      "filter": "exclude"
  },
  "image": {
    "bidders": ["bidderB", "bidderC"], //only these 2 bidders are allowed to sync image pixels
    "filter": "include"
  }
}
```

But the main use case for Prebid Server is what [load-cookie.html](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync) does in AMP, which is to disallow iframes:
```
"filterSettings": {
  "iframe": {
    "bidders": "*",
    "filter": "exclude"
  }
}
```

## Related Reading
- [Cookie Sync developer docs](/prebid-server/developers/pbs-cookie-sync.html)
