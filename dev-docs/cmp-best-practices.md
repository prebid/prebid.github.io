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

## General

Prebid cannot define a standard one-size-fits-all way of integrating with CMPs -- there are too many special cases, custom implementations, and differently
flavored CMPs for that.

Instead, here are some general guidelines:

- You can't just automatically turn on the GDPR Enforcement Module when not in GDPR scope.
- You need to understand how your CMP works, how you want to handle the "first page" scenario where the user hasn't yet had time to answer CMP questions, and how your site is laid out geographically.


Prebid.js doesn't have a concept of the geographic region where it's running. It's up to the CMP and/or publisher to configure Prebid.js correctly. Here are some options for discussing with with your lawyers, engineers, and CMP provider:

Here are some approaches where PBJS config can be the same across all geos:

- The CMP function is always present, it does the geo-detection, and passes 'gdprApplies: true/false' to Prebid.js as appropriate.
- If the CMP is removed in some geos, the publisher can use the presence of the __tcfapi function as a signal to set the PBJS consentManagement config

In these approaches, the publisher has to be aware of the geo and tell Prebid.js what to do:

- When in the EEA, the page sets consentManagement config, but when not in the EEA, the page avoids setting the consentManagement config, turning off GDPR enforcement.
- When not in the EEA, the page sets consentManagement config with defaultGdprScope=false so that if the CMP is slow to respond then enforcement is off.

## CMP Best Practices

Community members are welcome to contribute more specific implementation
approaches here. Please do not attempt to extoll the virtues of one CMP
over another -- just help others with interface idiosyncacies.
