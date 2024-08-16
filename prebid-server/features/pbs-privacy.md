---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Privacy
---

# Prebid Server | Features | Privacy
{:.no_toc}

* TOC
{:toc}

{% include legal-warning.html %}

## Prebid Server Activity Control Infrastructure

Prebid Server supports a mechanism for Publisher control for overriding privacy-sensitive activities. See the [Activity Controls](/prebid-server/features/pbs-activitycontrols.html) for more information.

Note that Activity Controls are currently not well integrated with other privacy features, but that will change as these features mature.

## Mobile 'Limit Ad Tracking' flag

If PBS receives 'device.lmt' flag in the OpenRTB request, it does the following anonymization:

* Mask take off the last byte of the IPv4 address and anonymize IPv6 addresses
* Removes user.id and user.buyeruid
* Removes the request.device.ifa attribute
* Rounds the request.device.geo. {lat,lon} to two decimal places

## GDPR

Prebid Server host companies and publishers have the ability to control the enforcement
activities that take place.

The enforcement strategy changed significantly between TCF 1.1 and TCF 2.0. [TCF2](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md) is a
more nuanced and stricter policy.

{: .alert.alert-info :}
If a Prebid Server host company wants to support GDPR, they should [register for the IAB Global Vendor List](https://register.consensu.org/). This is because
end users must provide legal basis for the host company to read/write cookies or `/cookie_sync` will return an empty response with no syncs and `/setuid` will fail.

### TCF 2.0 and 2.2

If Prebid server determines the user is in GDPR scope, then consent is independently tested
for each 'Purpose' with different consequences for each:

{: .table .table-bordered .table-striped }
| Activity | Legal Basis Required |
| ----------- | ------------------------------------ |
| Responding to /cookie-sync requests | Purpose 1 (Device Access) |
| Setting a cookie on /setuid requests | Purpose 1 (Device Access) |
| Conducting auctions | Purpose 2 (Basic Ads) |
| Passing User IDs into an auction | Any Purpose 2-10. User IDs are important for more than personalizing ads - they can be used in frequency capping, building profiles, counting unique users, etc. So Prebid Server should pass User IDs through the auction if any of Purposes 2-10 pass the legal basis test. In PBS-Java 2.12 and later, accounts can set configuration which requires user P4 consent before extended IDs can be passed. |
| Invoke an analytics adapter | Purpose 7 |
| Pass the user’s precise geographic information into auctions | Special Feature 1 |

More details are available in the [Prebid Support for TCF2](https://docs.google.com/document/d/1fBRaodKifv1pYsWY3ia-9K96VHUjd8kKvxZlOsozm8E/edit#) reference and in the [Prebid Server GDPR Reference](https://docs.google.com/document/d/1g0zAYc_EfqyilKD8N2qQ47uz0hdahY-t8vfb-vxZL5w/edit#).

Note: TCF 2.2 strings are processed exactly the same as TCF 2.0 strings. The only difference from a Prebid perspective is that the
Global Vendor List is stored on a slightly different path. This new path is supported by PBS-Go 0.260 and PBS-Java 1.123.

### Host Company GDPR Configuration

There are a number of GDPR configuration settings that PBS Host Companies must
consider:

* **GDPR enabled** - Allows the host company to turn off GDPR support. Default setting is enabled=true.
* **Default GDPR applies** - How Prebid Server should respond if the incoming request doesn't have the `gdpr` flag. (Note: this config is currently called `gdpr.default_value` in PBS-Go and `gdpr.default-value` in PBS-Java.)
* **Host company GVL ID** - Currently PBS requires the host company to have a GVL-ID or the setting of the `uids` cookie in GDPR scope will fail.
* **GDPR enforcement flags** - for each Purpose
* **Host Cookie TTL** - The default expiration time of the `uids` cookie set in the host company domain should be defined to match what's in the TCF 2.1 `maxCookieAgeSeconds` GVL field. (This is the host-cookie.ttl-days setting in both Go and Java.)

The specific details vary between [PBS-Go](https://github.com/prebid/prebid-server/blob/master/config/config.go) and [PBS-Java](https://github.com/prebid/prebid-server-java/blob/master/docs/config-app.md), so check the
version-specific documentation for more information.

## DSA

The Digital Services Act (DSA) in the EU requires that end users of "very large online platforms" be able to understand whether any of their personal data was used in targeting a particular ad. At a high level, it's similar to the ancient "Ad Choices" program where users were supposed to be able to understand why they were seeing the particular ads.

See the IAB's [DSA document](https://iabtechlab.com/blog/iab-tech-lab-releases-for-public-comment-specification-for-dsa-transparency/) for background.

Basically, the OpenRTB request and response have new objects defined [in the ORTB extension](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/dsa_transparency.md).

```text
Request: $.regs.ext.dsa
Response: $.seatbid.bid.ext.dsa
```

Prebid Server supports passing these fields through the bidstream and it does validations
on the bid responses to make sure they contain publisher-required values.

In general, publishers are responsible for creating the DSA object in Prebid.js, but in some use cases, they can't, including App and AMP. In addition, some Publishers might find it difficult to update their Prebid.js configuration across a broad network of sites in a short period.

Prebid Server host companies can help resolve this by updating stored requests, but making a broad update across potentially thousands of DB entries can be difficult or undesirable. So PBS-Java also supports account-level
configuration to have Prebid Server inject a default DSA object. e.g.

```yaml
privacy:
  dsa:
    default: >
    {
                    "required": 1,
                    "pubrender": 1,
                    "datatopub": 1,
                    "transparency": [{
                        "domain": "example.com",
                        "params":[1]
                    }]
   }
   gdpr-only: true
```

1. If regs.ext.dsa exists and is not null, use that.
2. else, if privacy.dsa.default exists and is not null:
    1. If privacy.dsa.gdpr-only is false (defaults to false) copy the default value into regs.ext.dsa. Done.
    2. If privacy.dsa.gdpr-only is true (defaults to false) check the internal_gdpr flag, and if true, copy the default value into regs.ext.dsa. Done.

## GPP

The IAB's [Global Privacy Platform](https://iabtechlab.com/gpp/) is container for
privacy regulations aimed at helping the ad tech ecosystem bring disparate reguations
under one communication path.

Prebid Server support for this protocol:

1. Passthrough - GPP parameters are forwarded through auction and usersync signals. In ORTB 2.6, these are regs.gpp and regs.gpp_sid. For url protocols, look for `gpp` and `gpp_sid`.
1. GPP as a TCF and USP wrapper - PBS parses the GPP container for TCF2 and USP strings, extracting them to the original ORTB location.
1. (done for PBS-Java) GPP infrastructure - the ability to plug new regulations into PBS, and the first sub-module, the [US General Privacy Module](/prebid-server/features/pbs-usgen.html).

## US Compliance

See [Prebid US Compliance Support](/features/mspa-usnat.html) for more info.

There are two modules offered by Prebid Server to process GPP string sections 7-12:

1. The [USGen Privacy Module](/prebid-server/features/pbs-usgen.html) is a high
performance option for interpreting the GPP strings as described in the [Prebid US Compliance reference](/features/mspa-usnat.html). (PBS-Java only)
1. The [US Custom Logic Privacy Module](/prebid-server/features/pbs-uscustomlogic.html) is a flexible way for publishers to define their own interpretation of GPP string sections 7-12.

Also note that publishers can consider utilizing [Activity Controls](/prebid-server/features/pbs-activitycontrols.html). For PBS-Java, the `gppSid`, `geo`, and `gpc` conditions may be useful tools within a compliance strategy.

## COPPA

The [Children's Online Privacy Protection Act (COPPA)](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule) is a law in the US which imposes certain requirements on operators of websites or online services directed to children under 13 years of age, and on operators of other websites or online services that have actual knowledge that they are collecting personal information online from a child under 13 years of age.
If `regs.coppa` is set to '1' on the OpenRTB request, the following anonymization actions take place before going to the adapters:

* Removes all ID fields: device.ifa, device.macsha1, device.macmd5, device.dpidsha1, device.dpidmd5, device.didsha1, device.didmd5
* Truncate ip field - remove lowest 8 bits.
* Truncate ipv6 field - anonymize as noted below.
* Remove geo.lat, geo.lon. geo.metro, geo.city, and geo.zip
* Remove user.id, user.buyeruid, user.yob, and user.gender

## CCPA / US-Privacy

The [California Consumer Privacy Act (CCPA)](https://oag.ca.gov/privacy/ccpa) is a law in the US. which covers consumer rights relating to the access to, deletion of, and sharing of personal information that is collected by businesses.
The IAB has generalized
this state-specific rule into a [US Privacy](https://iabtechlab.com/standards/ccpa/) compliance framework.
If `regs.ext.us_privacy` is parsed to find that the user has opted-out of a "sale",
the following anonymization steps are taken:

* Mask the last byte of the IPv4 address and anonymize IPv6 addresses
* Removes user.id and user.buyeruid
* Removes the request.device.ifa attribute
* Rounds the request.device.geo. {lat,lon} to two decimal places

## Global Privacy Control

In support of the [Global Privacy Control](https://globalprivacycontrol.org/), Prebid Server passes the `Sec-GPC` HTTP header through to bid adapters. It
does not currently take action on this header by default.

A publisher can utilize Activity Controls to link anonymization actions
to the precence of the GPC flag. See the `gpc` rule condition in the
[Activity Controls](/prebid-server/features/pbs-activitycontrols.html) for
more information.

## DNT

Prebid Server does **not** recognize the Do-Not-Track header. The committee determined that it's obsolete in general and not supported on Safari specifically. We prefer not to implement, test, and document unsupported privacy flags. Prebid Server is not going to make a dent in the overall problems with DNT.

We may reconsider this position if community members provide evidence that the flag is meaningful to their customers or lawyers.

## Anonymizing IPv6 Addresses

IPv6 addresses may be anonymized differently for Prebid Server host companies depending on how they've configured the server:

* There's a setting to mask the network portion of the IPv6 address when anonymization is called for. It defaults to 56 bits, meaning the rightmost 8 bits of the network is removed in these scenarios.
* There's another setting to remove a number of bits in the MAC address portion of the IPv6 address regardless of whether it's a situation that calls for explicit privacy or not. This setting defaults to removing all 64 bits of the MAC address.

## Related Topics

* [Prebid Server Feature Matrix](/prebid-server/features/pbs-feature-idx.html)
* [Prebid Server GDPR Requirements](https://docs.google.com/document/d/1g0zAYc_EfqyilKD8N2qQ47uz0hdahY-t8vfb-vxZL5w/edit#)
