---
layout: page_v2
title: Prebid Server FAQ | Prebid
description: Display Format
sidebarType: 5
---

# Prebid Server FAQ
{:.no_toc}

This page has answers to some frequently asked questions about Prebid Server. If you don't find what you're looking for here, there are other ways to [get help](/support/index.html).

* TOC
{:toc}

## Do we need to be a member of Prebid.org to submit a bidder adapter?

Nope. The only approval process is a code review. There are separate instructions for:

- [Prebid Server - Go](https://github.com/prebid/prebid-server/blob/master/docs/developers/add-new-bidder.md)
- [Prebid Server - Java](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/developers/add-new-bidder.md)

As for [membership](https://prebid.org/membership/) in Prebid.org, that's entirely optional -- we'd be happy to have you join and participate in the various committees,
but it's not necessary for contributing code as a community member.

## How can I debug Prebid Server requests?

+ When invoking Prebid Server through Prebid.js, this can be done just by adding `?pbjs_debug=true` to the page URL.
+ Through AMP, you can put `test: 1` in the stored request, or add `debug=1` to the query string of Prebid Server's AMP endpoint.
+ If calling directly, add `test: 1` to the JSON.

## Why are there two versions of Prebid Server? Are they kept in sync?

The original version of Prebid Server was the Go-Lang version. Rubicon Project
ported it to Java because they had more Java talent than Go.

+ [Prebid Server - Go](https://github.com/prebid/prebid-server)
+ [Prebid Server - Java](https://github.com/rubicon-project/prebid-server-java)

Both versions are live in production, and they are kept identical in external APIs
and reasonably close in functionality. See [https://github.com/rubicon-project/prebid-server-java/blob/master/docs/differenceBetweenPBSGo-and-Java.md](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/differenceBetweenPBSGo-and-Java.md) for the list of differences.

For demand partners, we recommend building new bid adapters in Go - the team will port it to Java for you within a couple of months.

For those looking to host a Prebid Server:
- If you plan to use long-form video, we recommend the Go version of the server.
- Look over the features and see if there's any important to you.
- Otherwise, just choose the language you're most comfortable with.

## How can I use Prebid Server in a mobile app post-bid scenario?

Just schedule a [post-bid creative]({{site.baseurl}}/dev-docs/examples/postbid.html) in the ad server.

1. Load the production Prebid JS package
1. Set up the AdUnit
1. Set the app and device objects with setConfig(). e.g.

```
pbjs.setConfig({
    s2sConfig: {
    ...
    },
    app: {
        bundle: "com.test.app"
    },
    device: {
         ifa: "6D92078A-8246-4BA4-AE5B-76104861E7DC"
    }
});
```
## How do user ID cookies and ID syncing work in Prebid Server?

For Prebid SDK there's no concept of cookies, so no syncing takes place in that scenario. ID in mobile is based on IDFA.

For Prebid.js and AMP, see [Prebid Server User ID sync](/prebid-server/developers/pbs-cookie-sync.html)

## How does Prebid Server support privacy signals?

See the [Prebid Server Privacy Feature Page](/prebid-server/features/pbs-privacy.html)

## Do you have any best practices and/or tips to increase the user-match rate?

For Prebid.js-initated server requests, we've found that cookie match rates are about what can be expected given the constraints:

- The [/cookie_sync](/prebid-server/developers/pbs-cookie-sync.html) process is initiated by Prebid.js the moment the [s2sConfig](https://docs.prebid.org/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server) is parsed.
- A limited number of bidders will be synced at once. PBS-Go will sync all the bidders listed in the `bidders` array. PBS-Java will sync all of them and possibly additional bidders. Publishers can change the number of syncs by specifying `userSyncLimit` on the s2sConfig.
- Privacy settings (e.g. GDPR) can affect sync rate. e.g. If a lot of your traffic is in the EEA, it's going to be harder to set cookies.

[AMP](/prebid-server/use-cases/pbs-amp.html) is a different story. There are several things you should check:

- First, the page has to include the [usersync amp-iframe](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync). This amp-iframe loads `load-cookie.html`.
- Then AMP has to run this iframe. There are limitations as to where this amp-iframe can be on the page and possible how many amp-iframes there are on the page.
- The [/cookie_sync](/prebid-server/developers/pbs-cookie-sync.html) call is initiated from `load-cookie.html`, but there are many adapters on the server side, and a limited number of them will be synced at once. Consider setting `max_sync_count` higher to get all bidders synced faster,
- In a GDPR context, AMP doesn't supply the `gdprApplies` field. Prebid Server will determine for itself whether it can sync cookies, but it will not tell bidders whether the request is in GDPR-scope, so each bidder will have to determine scope for itself.

## How does the Notice URL work for Prebid Server?

**Banner**

If a bidder adapter supplies 'nurl' in the bidResponse object, there are two paths:

1) If it's cached in Prebid Cache (e.g. AMP and App), then the 'nurl' is cached along with the 'adm' and utilized by the Prebid Universal Creative.
2) If it's not cached, the Prebid.js PrebidServerBidAdapter will append the 'nurl' to the bottom of the creative in a new div.

**Video**

If a bidder adapter supplies 'nurl' in the bidResponse object instead of 'adm',
this URL will be treated as the location of the VAST XML.
