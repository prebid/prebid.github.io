---
layout: page_v2
title: Prebid Server FAQ | Prebid
description: Display Format
sidebarType: 5
---

# Prebid Server FAQ
{:.no_toc}

This page has answers to some frequently asked questions about Prebid Server. If you don't find what you're looking for here, there are other ways to [get help](/support/index.html).

- TOC
{:toc}

## Do we need to be a member of Prebid.org to submit a bidder adapter?

Nope. The only approval process is a code review. There are separate instructions for:

- [Prebid Server - Go](/prebid-server/developers/add-new-bidder-go.html)
- [Prebid Server - Java](/prebid-server/developers/add-new-bidder-java.html)

As for [membership](https://prebid.org/membership/) in Prebid.org, that's entirely optional -- we'd be happy to have you join and participate in the various committees,
but it's not necessary for contributing code as a community member.

## How can I debug Prebid Server requests?

- When invoking Prebid Server through Prebid.js, this can be done just by adding `?pbjs_debug=true` to the page URL.
- Through AMP, you can put `ext.prebid.debug: true` in the stored request, or add `debug=1` to the query string of Prebid Server's AMP endpoint.
- If calling directly, add `ext.prebid.debug: true` to the JSON.

The OpenRTB `test:1` flag will also turn on debugging, and for true test requests, is the most appropriate thing to do, depending on your scenario. SSPs may not respond or log `test` requests.

## Why are there two versions of Prebid Server? Are they kept in sync?

The original version of Prebid Server was the Go-Lang version. Rubicon Project
ported it to Java because they had more Java talent than Go.

- [Prebid Server - Go](https://github.com/prebid/prebid-server)
- [Prebid Server - Java](https://github.com/prebid/prebid-server-java)

Both versions are live in production, and they are kept identical in external APIs
and reasonably close in functionality. See the [Prebid Server feature list](/prebid-server/features/pbs-feature-idx.html) for the list of differences.

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

```javascript
pbjs.setConfig({
    s2sConfig: {
    // ...
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

- The [/cookie_sync](/prebid-server/developers/pbs-cookie-sync.html) process is initiated by Prebid.js the moment the [s2sConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) is parsed.
- A limited number of bidders will be synced at once. Prebid Server will sync all bidders listed in the `bidders` array and possibly additional bidders. Publishers can change the number of syncs by specifying `userSyncLimit` on the s2sConfig.
- Privacy settings (e.g. GDPR) can affect sync rate. e.g. If a lot of your traffic is in the EEA, it's going to be harder to set cookies.

[AMP](/prebid-server/use-cases/pbs-amp.html) is a different story. There are several things you should check:

- First, the page has to include the [usersync amp-iframe](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync). This amp-iframe loads `load-cookie.html` or `load-cookie-with-consent.html`.
- Then AMP has to run this iframe. There are limitations as to where this amp-iframe can be on the page and possible how many amp-iframes there are on the page.
- The [/cookie_sync](/prebid-server/developers/pbs-cookie-sync.html) call is initiated from `load-cookie.html`, but there are many adapters on the server side, and a limited number of them will be synced at once. Consider setting `max_sync_count` higher to get all bidders synced faster,
- In a GDPR context, AMP doesn't supply the `gdprApplies` field. Prebid Server will determine for itself whether it can sync cookies, but it will not tell bidders whether the request is in GDPR-scope, so each bidder will have to determine scope for itself.

## How does the Notice URL work for Prebid Server?

**Banner**

If a bidder adapter supplies 'nurl' in the bidResponse object, there are two paths:

1. If it's cached in Prebid Cache (e.g. AMP and App), then the 'nurl' is cached along with the 'adm' and utilized by the Prebid Universal Creative.
2. If it's not cached, the Prebid.js PrebidServerBidAdapter will append the 'nurl' to the bottom of the creative in a new div.

**Video**

If a bidder adapter supplies 'nurl' in the bidResponse object instead of 'adm',
this URL will be treated as the location of the VAST XML.

## How does ad server targeting work in Prebid Server?

For OpenRTB responses, Prebid Server is always in "send all bids" mode -- it will return the top bid on each requested imp from each bidder.

It will return ad server targeting in seatbid.bid.ext.prebid.targeting depending on the input scenario:

- if request.ext.prebid.includewinner:true and this bid was declared the "winner" by Prebid Server, then seatbid.bid.ext.prebid.targeting will contain hb_pb, hb_size, and hb_bidder. If the bid was cached, there will also be hb_uuid and/or hb_cache_id
- if request.ext.prebid.includebidderkeys:true, seatbid.bid.ext.prebid.targeting will contain hb_pb_BIDDER, hb_size_BIDDER, and hb_bidder_BIDDER. If the bid was cached, there will also be hb_uuid_BIDDER and/or hb_cache_id_BIDDER.

The AMP endpoint is somewhat different because it doesn't receive the openrtb - just the targeting. PBS basically resolves the OpenRTB, and then merges all the seatbid.bid.ext.prebid.targeting sections.

## How does Prebid Server determine the winner of a given impression?

Prebid Server doesn't decide the overall winner... that's the job of the
ad server. However, there are two decisions it does make that influence
which bids are submitted to the ad server.

**Decision 1**: best bid from each bidder on each impression

Prebid Server returns one bid from each bidder for each impression object. If there
are multiple bids from a given bidder for a given imp[], here how it chooses:

- highest ranked Programmatic Guaranteed bid (PBS-Java only)
- highest CPM deal (only when the ext.targeting.preferdeals is specified)
- highest CPM
- random tiebreaker

Note: if the request allows [multibid](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#multibid-pbs-java-only), then several bid responses from the same bidder may
be returned to the client.

**Decision 2**: which bidder for each imp[] object gets the hb_pb, hb_size, and hb_bidder targeting values

This is only done when ext.prebid.targeting is specified.
This is most important for AMP, but other clients (e.g. app) may rely on Prebid Server
choosing the "winner" header bid. That decision is made with the same process as the
first decision:

- highest ranked Programmatic Guaranteed bid (PBS-Java only)
- highest CPM deal (only when the ext.targeting.preferdeals is specified)
- highest CPM
- random tiebreaker

## Can I host Prebid Server for myself or others?

Yes. See the [PBS Hosting](/prebid-server/hosting/pbs-hosting.html) page to get started.

You don't need to be a [Prebid.org member](https://prebid.org/membership/), but joining would help in case you need extra
support with any technical hurdles.

## I'm hosting Prebid Server - how can I get in the loop?

The best way would be to [join Prebid.org](https://prebid.org/membership/) and
participate in the [Prebid Server PMC](https://prebid.org/project-management-committees/).

Another way is to [register for our host company mailing list](/prebid-server/hosting/pbs-hosting.html#optional-registration).

## Why doesn't Prebid Server resolve OpenRTB macros?

Prebid Server is not a full-fledged SSP. Any DSP bid adapters should keep this in mind when it comes to assuming SSP functionality like resolving OpenRTB macros. We debated building this functionality into PBS, but realized it would take precious milliseconds away from the overall header bidding auction to scan kilobytes of bidder creatives for the 9 different OpenRTB macros. Since so few bidders require this functionality, it makes sense to have those adapters do it themselves.

If an adapter doesn't resolve its own macros, AUCTION_PRICE will eventually get resolved by the [Prebid Universal Creative](https://github.com/prebid/prebid-universal-creative), but by then the bid price will be in the ad server currency and quantized by the price granularity. This will likely cause reporting discrepancies.

## Does Prebid Server support region-specific endpoints for bidders?

Yes. This is handled by the PBS host company in their datacenter config.
Bidders that want to make use of region-specific endpoints will need to work
with each PBS host company:

- determine which regions the host company supports
- map the regions to the bidder's endpoints
- the host company overrides the bidder's default auction endpoint when they deploy the configuration for each region.

We recognize that it's inconvenient for bidders to be required to have this
conversation with each host company, but there's really not a better way
in an open source project. Any number of companies may choose to host
PBS and we cannot constrain them into a defined set of regions.

## Can bidder endpoints differ by publisher?

You may not use an endpoint domain as a bidder parameter. Prebid Server is not
an open proxy. If absolutely necessary, you may specify a portion of the
domain as a parameter to support geo regions or account specific servers.
However, this is discouraged and may degrade the performance of your adapter
since the server needs to maintain more outgoing connections. Host companies
may choose to disable your adapter if it uses a dynamically configured domain.

e.g. this config is not allowed because the entire domain name is a variable:

```text
endpoint: "https://{host}/path"
```

but this would be ok:

```text
endpoint: "https://{host}.example.com/path"
```

## Did the location of the bidder parameters change?

Why yes, glad you noticed. The original 2017 OpenRTB extension where bidders
and parameters were placed was imp[].ext.BIDDER. Since 2020, the recommended location
is imp[].ext.prebid.bidder.BIDDER. This change was driven by the existence of
other fields in imp[].ext that aren't bidders, like `skadn`, `data`, etc.

Bidders are copied from imp[].ext to imp[].ext.prebid.bidder, and they will be copied for years to come, but we would ask that new implementations of stored requests
utilize the new location.

## Does PBS do a geo-lookup?

PBS-Go does not currently support integration with a geo-lookup service.

PBS-Java supports MaxMind and Netacuity. It performs the geo-lookup on every request **unless**:

1. The config `gdpr.consent-string-means-in-scope` is true and provided `user.consent` string is valid
2. `regs.gdpr` is specified in the request
3. `device.geo.country` is specified in the request
4. It is unable to determine the IP address from the header or `device.ip`
5. There's no geo-location service configured

## Does PBS support SSL?

No, Prebid Server is intended to run behind a load balancer or proxy, so it does not currently support defining a security certificate.

## How can we rename our bid adapter?

If you have a company name change and need to add a new bidder code for the updated branding, here's the recommended approach:

1. Keep the existing filenames and make the new name a hard-coded alias. There are separate instructions for this for [PBS-Go](/prebid-server/developers/add-new-bidder-go.html#aliasing-an-adapter) and [PBS-Java](/prebid-server/developers/add-new-bidder-java.html#create-bidder-alias).
2. Update the contact email in your YAML file as needed ([PBS-Go](https://github.com/prebid/prebid-server/tree/master/static/bidder-info), [PBS-Java](https://github.com/prebid/prebid-server-java/tree/master/src/main/resources/bidder-config))
3. **Copy** your bidder documentation file in [https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders) so both names are available.

In the long run, if you'd prefer to change the filenames too, that's ok - but our rule is that the old name needs to be available until the next major release to give time for publishers to transition. In that case:

1. Submit a PR that changes the filenames and makes the old name a hard-coded alias.
2. Keep both bidder documentation files.

## Should Prebid bidders be in ads.txt?

Publishers should be careful to list all their bidding partners in their ads.txt file. Bidders without an entry in ads.txt may be
perceived by DSPs as unauthorized sources of your inventory. The domain for any ads.txt [inventory partners](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/dc71586842e648e89c1bbe6c666ffac8ff010a96/2.6.md?plain=1#L1752), if one exists, should be specified with a `setConfig({ortb2.site.inventorypartnerdomain})` call. For details of the specification of ads.txt entries, see [ads.txt v1.1](https://iabtechlab.com/wp-content/uploads/2022/04/Ads.txt-1.1.pdf)

## How can I help with Prebid Server?

Generally, people and companies will work on features and bug fixes that directly affect them. The process is:

1. If there's not already an issue tracking the work, create an issue in the PBS-Go repo [here](https://github.com/prebid/prebid-server/issues/new). Note: we track enhancement requests in the PBS-Go repo. If it's a bug that affects PBS-Java only, then you can open the issue [here](https://github.com/prebid/prebid-server-java/issues/new).
2. The issue should describe what you're planning to build/fix. We'll want to review any interfaces, config options, or metrics for consistency.
3. After getting approval (if needed), you'll make a Pull Request against the appropriate repo, whether PBS-Go or PBS-Java. Be sure to have read the contribution guidelines for [PBS-Go](https://github.com/prebid/prebid-server/tree/master/docs/developers) or [PBS-Java](https://github.com/prebid/prebid-server-java/tree/master/docs/developers).
4. The core team will review your PR.

If you're looking to help but don't have a specific item in mind, there are two approaches:

- You can scan the [issue list](https://github.com/prebid/prebid-server/issues) and add a note to one offering to take it. Someone will add your github handle as the `assignee`. A prioritized set of issues is available on our [project board](https://github.com/orgs/prebid/projects/4/views/1).
- You can attend the Prebid Server committee meeting and ask about the issues currently ranked as most desirable by the group. Contact <membership@prebid.org> to get an invite to that meeting.
