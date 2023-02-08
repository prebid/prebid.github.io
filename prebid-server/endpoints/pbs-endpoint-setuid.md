---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | /setuid

---

# Prebid Server | Endpoints | /setuid

This endpoint is used during cookie syncs to save the results in the Prebid Server `uids` cookie. For technical details, see the
[Cookie Sync developer docs](/prebid-server/developers/pbs-cookie-sync.html).

## GET /setuid

This endpoint saves a UserID for a Bidder in the Cookie. Saved IDs will be recognized for 7 days before being considered "stale" and being re-synced.

### Query Params

- `bidder`: The key of the bidder which is being synced. This may not always match the bidder name,.
- `uid`: The ID which the Bidder uses to recognize this user. If undefined, the UID for `bidder` will be deleted.
- `gdpr`: This should be `1` if GDPR is in effect, `0` if not, and undefined if the caller isn't sure
- `gdpr_consent`: This is required if `gdpr` is one, and optional (but encouraged) otherwise. If present, it should be an [unpadded base64-URL](https://tools.ietf.org/html/rfc4648#page-7) encoded [Vendor Consent String](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Consent%20string%20and%20vendor%20list%20formats%20v1.1%20Final.md).
- `f`: The desired format of the response.
    - If f=i (format=image), PBS will respond with a blank 1x1 PNG, set the Content-Length to the appropriate number of bytes, and set Content-Type to image/png
    - If f=b (format=blank), PBS will response with empty HTML with Content-Length 0 and Content-Type to text/html


If the `gdpr` and `gdpr_consent` params are included, this endpoint will _not_ write a cookie unless:

1. The Vendor ID set by the Prebid Server host company has permission to save cookies for that user.
2. The Prebid Server host company did not configure it to run with GDPR support.

If in doubt, contact the company hosting Prebid Server and ask if they're GDPR-ready.

### Sample request

`GET https://prebid.site.com/setuid?bidder=adnxs&uid=12345&gdpr=1&gdpr_consent=BONciguONcjGKADACHENAOLS1rAHDAFAAEAASABQAMwAeACEAFw`

### Return Values

- HTTP 400 - The request is in GDPR scope and the consent string is missing or invalid.
- HTTP 451 - PBS does not have permission to set a cookie due to GDPR or another privacy rule.
- HTTP 200
    - Success with image response: if the f=i parameter is specified or if the named bidder prefers redirect cookie_syncs, then PBS responds with a blank 1x1 PNG, set the Content-Length to the appropriate number of bytes, and set Content-Type to image/png
    - Success with empty response: if the f=b parameter is specified or if the named bidder prefers iframe cookie_syncs, then PBS responds with empty HTML, Content-Length 0 and Content-Type to text/html

