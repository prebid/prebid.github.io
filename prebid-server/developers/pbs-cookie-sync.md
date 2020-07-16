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

## How to do it?

Start by calling [`/cookie_sync`](/prebid-server/endpoints/pbs-endpoint-cookieSync.html). For each element of `response.bidder_status[]`,
call `GET bidder_status[].usersync.url`. This will be a bidder-specific endpoint should read the users's cookie for their domain and respond with a redirect back to Prebid Server's [`/setuid` endpoint](/prebid-server/endpoints/pbs-endpoint-setuid.html) which will complete the user ID sync.

## Mechanics

Bidders must implement an endpoint under their domain which accepts
an encoded URI for redirects. For example:

> GET some-bidder-domain.com/usersync-url?redirectUri=prebid-server.example.com%2Fsetuid%3Fbidder%3Dsomebidder%26uid%3D%24UID

This example endpoint would URL-decode the `redirectUri` param to get `prebid-server.example.com/setuid?bidder=somebidder&uid=$UID`.
It would then replace the `$UID` macro with the user's ID from their cookie. Supposing this user's ID was "132",
it would then return a redirect to `prebid-server.example.com/setuid?bidder=somebidder&uid=132`.

Prebid Server would then save this ID mapping of `somebidder: 132` under the cookie at `prebid-domain.com`.

When the client then calls `www.prebid-domain.com/openrtb2/auction`, the ID for `somebidder` will be available in the Cookie.
Prebid Server will then stick this into `request.user.buyeruid` in the OpenRTB request it sends to `somebidder`'s Bidder.
