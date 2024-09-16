---
layout: page_v2
title: Prebid Privacy Resources
description: Prebid Privacy Resources
sidebarType: 7
---

# Prebid Privacy Resources
{:.no_toc}

- TOC
{:toc}

## Overview

{% include legal-warning.html %}

Prebid has many tools that can be utilized to help publishers and app developers achieve the data privacy goals defined by their legal teams.
We cannot help you decide _what_ to do, but this page will help you understand the tools that various Prebid products offer in support
of user privacy.

## Regional Privacy References

### United States

To support the complicated US landscape for privacy regulations, the IAB developed the "Global Privacy Protocol" (GPP) and
technical protocols for the US as a whole and for each state that has privacy regulations. 

- [Prebid.js support for GPP](/dev-docs/modules/consentManagementGpp.html) - GPP is just a container that can hold specific regional protocols.
- [Prebid US Compliance Support](/features/mspa-usnat.html) - if you do business in the United States, you should talk to your lawyers about whether Prebid's US Compliance modules would be useful in helping to achieve your company's privacy policies.

{: .alert.alert-warning :}
The 'US Privacy' approach has been deprecated by both the IAB and Prebid.

The IAB's original "US Privacy" standard was designed for the California rules known as CCPA or CPRA.

- [Prebid.js US Privacy Consent Management Module](/dev-docs/modules/consentManagementUsp.html)
- [Prebid Server and CCPA/USP](/prebid-server/features/pbs-privacy.html#ccpa--us-privacy)

### Europe

The privacy tools that Prebid has built in support of European rules may help address the requirements of the GDPR and the Digital Services Act.

The IAB defined the Transparency and Consent Framework (TCF) to address European GDPR rules. Prebid support for TCF is described:

- [Prebid.js CMP Best Practices](/dev-docs/cmp-best-practices.html)
- [Prebid.js TCF Consent Management Module](/dev-docs/modules/consentManagementTcf.html)
- [Prebid.js TCF Control Module](/dev-docs/modules/tcfControl.html)
- [Prebid Server TCF/GDPR Support](/prebid-server/features/pbs-privacy.html#gdpr)
- [White paper: Prebid Support for Enforcing TCF 2](https://docs.google.com/document/d/1fBRaodKifv1pYsWY3ia-9K96VHUjd8kKvxZlOsozm8E)

### Canada

Please see [Prebid's support for Quebec privacy law 25](/features/ac-quebec.html).

## Global Privacy References

### Chrome Privacy Sandbox

Privacy Sandbox is the name the Chrome browser has given to a series of features aimed at smoothing the transition off the 3rd party cookie.

#### Topics

At a high level, the "Topics" feature is Chrome's way of defining a taxonomy of information that can be used for ad targeting. See 
[Chrome Topics](https://privacysandbox.com/proposals/topics/) for details.

There's actually nothing to do to enable Topics in Prebid.js – bidders will receive their own Topics if they've implemented that feature.
That said, Prebid.js does have a [Topics FPD Module](/dev-docs/modules/topicsFpdModule.html) that allows bidders to share each other's Topics.

Prebid Server supports reading the Topics headers and inserting them into the OpenRTB at `user.data`.

#### Protected Audience API

PAAPI (also called PAA) is Chrome's solution for ad targeting done in a privacy-friendly way. In short, GAM will kick off an in-browser auction after
the contextual auction. If the in-browser auction wins, it can override the ad chosen by GAM. 

See [Chrome's PAAPI documentation](https://developers.google.com/privacy-sandbox/relevance/protected-audience) for the full background.

To enable Interest Group bidding in Prebid, you can add the Prebid [Fledge For GPT Module](/dev-docs/modules/fledgeForGpt.html).

{: .alert.alert-info :}
Note that 'FLEDGE' was the original name of the Protected Audience feature. The name of the Prebid.js module may change in the future.

##### Prebid.js and the PAA Test Period

During the first part of 2024, Chrome and GAM are running a test of PAAPI on a limited subset of traffic. However, the
[Fledge For GPT Module](/dev-docs/modules/fledgeForGpt.html) enables Interest Group auctions 100% of the time. During the test
period, publishers can better align browser and programmatic ad behavior by only enabling Prebid interest group bids for
the relevant Chrome testing labels.

If you want to gather interest group bids only when InterestGroup (IG) auctions are very likely to run, you can enable the module like this:

```javascript
Promise.resolve(navigator.cookieDeprecationLabel?.getValue?.()).then(label => {
    pbjs.setConfig({
        fledgeForGpt: {
            enabled: !label || label.startsWith("treatment_") || label === 'label_only_5'
        }
    });
});
```

If you want to gather interest group bids whenever when IG auctions _might_ run, you can enable the module like this:

```javascript
Promise.resolve(navigator.cookieDeprecationLabel?.getValue?.()).then(label => {
    pbjs.setConfig({
        fledgeForGpt: {
            enabled: !label || label.startsWith("treatment_") || label != 'label_only_1'
        }
    });
});
```

##### Prebid Server and the PAA Test Period

Chrome sets "cookie-deprecation" labels to let the ecosystem know whether the current request is enabled for IG auctions and whether 3rd party cookies are active.

Prebid Server reads the HTTP header set by Chrome and copies the value to the OpenRTB at `device.ext.cdep`.

#### Prebid.js Versions Supporting Privacy Sandbox

This table may be useful to publishers trying to decide which version of Prebid.js to use to support Privacy Sandbox.

{: .table .table-bordered .table-striped }
| Prebid.js Version | Notes |
|-------------------|-------|
| 8.22| Makes Prebid FPD available to the PAAPI generateBid, scoreAds, and reportResult functions |
| 8.15| Added floor signal to the fledgeForGpt module |
| 8.9| Initial release of the fledgeForGpt module, Sec-Browsing-Topics header enabled |
| 8.8| The topicsFpd module is released, allowing bidders to share topics |

#### Prebid Server Versions Supporting Privacy Sandbox

{: .table .table-bordered .table-striped }
| PBS-Go Version | Notes |
|-------------------|-------|
| 0.239.0 | Basic passthrough support |

{: .table .table-bordered .table-striped }
| PBS-Java Version | Notes |
|-------------------|-------|
| 2.11| Topics and Test Labels |
| 1.111| Basic passthrough support |

## Further Reading

- [Prebid Server Privacy Support](/prebid-server/features/pbs-privacy.html)
