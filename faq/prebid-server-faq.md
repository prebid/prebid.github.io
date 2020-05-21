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

As for [membership](/partners/partners.html) in Prebid.org, that's entirely optional -- we'd be happy to have you join and participate in the various committees,
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
and quite close in functionality. See [https://github.com/rubicon-project/prebid-server-java/blob/master/docs/differenceBetweenPBSGo-and-Java.md](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/differenceBetweenPBSGo-and-Java.md) for the list of differences.

There are no plans at this point to stop development on either version.

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

There are 3 answers here. The easy answer is for requests coming into Prebid Server from the Prebid SDK - there's no concept of cookies there, so no syncing takes place in that scenario. ID in mobile is based on IDFA.

For other scenarios, Prebid Server sets up and manages a multi-vendor ID match table in the `uids` cookie in the host company's 
domain. i.e. adnxs.com, rubiconproject.com, or whichever Prebid Server vendor you're utilizing. When the user has a `uids` cookie, 
Prebid Server parses it and passes the vendor-specific IDs to the relevant server-side bid adapters.

Syncing in the AMP scenario uses the [load-cookie.html](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync) file that's part of 
the Prebid Universal Creative package. When placed into an AMP-iframe, this file will call /cookie-sync and initiate a sync that 
creates or updates the `uids` cookie.

The most common source of requests for Prebid Server is from Prebid.js in a scenario where the user doesn't have any cookies for the Prebid Server domain.
1. The user loads a page with Prebid.js that's going to call Prebid Server -- i.e. the pub has set up s2sConfig.
2. Immediately after confirming that s2sConfig is setup, Prebid.js calls Prebid Server's /cookie-sync endpoint to initiate syncing
3. Prebid Server determines there is no `uids` cookie and responds to the browser with a list of pixel syncs for bidders that need to be synced.
4. Prebid.js places all of the pixels on the page and initiates the auction.
5. Because the syncs haven't completed, the auction call to Prebid Server will not contain the uids cookie.
6. The first auction occurs without IDs
7. At some point later, the pixels come back to Prebid Server through a /setuid redirect, setting (or updating) the uids cookie.
8. The second page view will have the IDs available.



{: .alert.alert-info :}
Note: the company that's hosting Prebid Server can configure it to read and utilize their exchange's 
native cookie. i.e. if you're using Rubicon Project's Prebid Server, it can read their 'khaos' cookie, and if you're using 
AppNexus' Prebid Server, it can read their 'uuid2' cookie. In other words, if the host company is an exchange and the user 
has the exchange cookie, the host company will have an ID one page-view sooner than the other bidders. This gives a slight edge to
the hosting company in some scenarios, but it's technically unavoidable and better for both buyers and sellers to have one ID available rather than zero.

## How does Prebid Server support privay signals?

### Mobile 'Limit Ad Tracking' flag

If PBS receives 'device.lmt' flag in the OpenRTB request, it does the following anonymization:

- Mask take off the last byte of the IPv4 address and the last 2 bytes of IPv6 addresses
- Removes user.id and user.buyeruid
- Removes the request.device.ifa attribute
- Rounds the request.device.geo. {lat,lon} to two decimal places

### GDPR

Prebid Server host companies and publishers have the ability to control the enforcement
activities that take place.

The enforcement strategy changed significantly between TCF 1.1 and TCF 2.0. [TCF2](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md) is a 
more nuanced and stricter policy.

#### TCF 1.1

If Prebid Server determines that the user is in GDPR scope and doesn't consent
to *all* of the vendor's 'purposes' as declared in the Global Vendor List, it 'anonymizes'
the request to the adapters:

- Mask take off the last byte of the IPv4 address and the last 2 bytes of IPv6 addresses
- Removes user.id and user.buyeruid
- Removes the request.device.ifa attribute
- Rounds the request.device.geo. {lat,lon} to two decimal places

Full details are available [here](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/developers/PrebidServerJava_GDPR_Requirements.pdf).

#### TCF 2.0

If Prebid server determines the user is in GDPR scope, then consent is independently tested
for each 'Purpose' with different consequences for each:

{: .table .table-bordered .table-striped }
| TCF Purpose | Consequence of Not Obtaining Consent |
| ----------- | ------------------------------------ |
| 1 - Device Access | Prevents one or more usersync activities for one or more vendors. |
| 2 - Basic Ads | May result in skipping one or more bid adapters in the auction. |
| 4 - Personalized Ads | May result in removing the userIds before calling one or more bid adapters. |
| 7 - Measure Ad Performance | May result in skipping one or more analytics adapters. |
| Special Feature 1 - Use precise geolocation data | May result in rounding lat/long values and IP address before sending to server-side adapters. |

{: .alert.alert-danger :}
Note: Support for TCF purposes other than Device Access is still under development and is
expected to be released in May 2020.

More details are available [here](https://docs.google.com/document/d/1fBRaodKifv1pYsWY3ia-9K96VHUjd8kKvxZlOsozm8E/edit#).

### COPPA

The [Children's Online Privacy Protection Act (COPPA)](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule) is a law in the US which imposes certain requirements on operators of websites or online services directed to children under 13 years of age, and on operators of other websites or online services that have actual knowledge that they are collecting personal information online from a child under 13 years of age.
If `regs.coppa` is set to '1' on the OpenRTB request, the following anonymization actions take place before going to the adapters:

- Removes all ID fields: device.ifa, device.macsha1, device.macmd5, device.dpidsha1, device.dpidmd5, device.didsha1, device.didmd5
- Truncate ip field - remove lowest 8 bits.
- Truncate ipv6 field - remove lowest 32 bits.
- Remove geo.lat, geo.lon. geo.metro, geo.city, and geo.zip
- Remove user.id, user.buyeruid, user.yob, and user.gender

### CCPA / US-Privacy

The [California Consumer Privacy Act (CCPA)](https://oag.ca.gov/privacy/ccpa) is a law in the US. which covers consumer rights relating to the access to, deletion of, and sharing of personal information that is collected by businesses.
The IAB has generalized
this state-specific rule into a [US Privacy](https://iabtechlab.com/standards/ccpa/) compliance framework.
If `regs.ext.us_privacy` is parsed to find that the user has opted-out of a "sale",
the following anonymization steps are taken:

- Mask the last byte of the IPv4 address and the last 2 bytes of IPv6 addresses
- Removes user.id and user.buyeruid
- Removes the request.device.ifa attribute
- Rounds the request.device.geo. {lat,lon} to two decimal places

