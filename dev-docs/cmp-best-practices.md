---
layout: page_v2
title: Prebid.js CMP Best Practices
description: Prebid.js CMP Best Practices
sidebarType: 1
---

# Prebid.js CMP Best Practices

{: .alert.alert-info :}
Work in progress. This document is intented to be a repository for the
Prebid.org community to collect best practices regarding the integration
of Prebid.js and Consent Management Platforms.

## NOT LEGAL ADVICE

The following is not legal advice. The application of GDPR in your company is solely up to you and your legal advisors. The following information is to provide guidance on how to implement your GDPR related needs using the tools available in prebid.

## General

Prebid cannot define a standard one-size-fits-all way of integrating with CMPs -- there are too many special cases, custom implementations, and differently
flavored CMPs for that.

Instead, here are some general guidelines:

- You can't just automatically turn on the GDPR Enforcement Module when not in GDPR scope.
- You need to understand how your CMP works, how you want to handle the "first page" scenario where the user hasn't yet had time to answer CMP questions, and how your site is laid out geographically.

## The Role & Relations of the CMP/TCF gdprApplies and Prebid gdpr.defaultGdprScope

### CMP/TCF gdprApplies

This indicates the determination of whether GDPR applies in this context. The CMP, in most cases, is responsible for this.

### Prebid gdpr.defaultGdprScope

This indicates the behavior of Prebid when the CMP __does not__ provide a value for gdprApplies. Critically the __defaultGdprScope__ is applied if the user timesout replying to the CMP. Whil this also can happen if the CMP doesn't set the value in certain cases, or the CMP isn't loaded the timeout behavior is the most critical thing to understand. Essentially, the value of this config variable takes the place of the CMP gdprApplies when the gdprApplies value cannot be determined.

## What does that mean?

Prebid.js doesn't have a concept of the geographic region where it's running. It's up to the CMP and/or publisher to configure Prebid.js correctly. Here are some options for discussing with with your lawyers, engineers, and CMP provider:

- If you use a CMP and they __always__ return a proper tcfapi function for all pageviews, even when geo targeting is used, then you should set gdpr.defaultGdprScope to true and let the functionality work as intended.
- If you otherwise remove the CMP from the page based on Geo, then you should align your Prebid config to that and the recommendation is to remove the GDPR config from the Prebid config entirely when GDPR does not apply.
- Because of the timeout behavior gdpr.defaultGdprScope cannot be set to false globally. This value could be modified based on Publisher defined logic, but a blanket false will result in timeouts in the EEA being treated as GDPR not applying, when it should.

Here are some approaches where PBJS config can be the same across all geos:

- The CMP function is always present, it does the geo-detection, and passes 'gdprApplies: true/false' to Prebid.js as appropriate.
- If the CMP is removed in some geos, the publisher can use the presence of the __tcfapi function as a signal to set the PBJS consentManagement config
- If the CMP is removed in some geos but the CMP creates the p __\_\_tcfapi__ function and set gdprApplies to false, then the publisher can rely on 

In these approaches, the publisher has to be aware of the geo and tell Prebid.js what to do:

- When in the EEA, the page sets consentManagement config, but when not in the EEA, the page avoids setting the consentManagement config, turning off GDPR enforcement.
- When not in the EEA, the page sets consentManagement config with defaultGdprScope=false so that if the CMP is slow to respond then enforcement is off.

## CMP Best Practices

Community members are welcome to contribute more specific implementation
approaches here. Please do not attempt to extoll the virtues of one CMP
over another -- just help others with interface idiosyncacies.

## LiveRamp

LiveRamp has verified that they create the tcfapi functions and set gdprApplies=false when their CMP is removed from a geo.

## Further Reading

- [IAB TCF Implementation Guidelines](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md)
