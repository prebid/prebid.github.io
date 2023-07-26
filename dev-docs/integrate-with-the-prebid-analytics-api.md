---
layout: page_v2
title: How to Add a Prebid.js Analytics Adapter
description: How to add a Prebid.js analytics adapter
pid: 28
top_nav_section: dev_docs
nav_section: adapters

sidebarType: 1
---



# How to Add a Prebid.js Analytics Adapter

{:.no_toc}

The Prebid Analytics API provides a way to get analytics data from `Prebid.js` and send it to the analytics provider of your choice, such as Google Analytics.  Because it's an open source API, you can write an adapter to send analytics data to any provider you like.  Integrating with the Prebid Analytics API has the following benefits:

* It decouples your analytics from the `Prebid.js` library so you can choose the analytics provider you like, based on your needs.

* You can selectively build the `Prebid.js` library to include only the analytics adapters for the provider(s) you want.  This keeps the library small and minimizes page load time.

* Since this API separates your analytics provider's code from `Prebid.js`, the upgrade and maintenance of the two systems are separate.  If you want to upgrade your analytics library, there is no need to upgrade or test the core of `Prebid.js`.

[//]: # (This comment is a separator that allows the list above and the TOC to be rendered at the same time)

* TOC

{:toc }

## Architecture of the Analytics API

Before we jump into looking at code, let's look at the high-level architecture.  As shown in the diagram below, `Prebid.js` calls into an _analytics adapter_.  The analytics adapter is the only part of the code that must be stored in the `Prebid.js` repo.

The analytics adapter listens to events and may call out directly to the analytics backend, or it may call out to an analytics _library_ that integrates with the analytics server.

For instructions on integrating an analytics provider, see the next section.

![Prebid Analytics Architecture Diagram]({{ site.baseurl }}/assets/images/prebid-analytics-architecture.png){: .pb-md-img :}

## Creating an Analytics Module

Working with any Prebid project requires using Github. In general, we recommend the same basic workflow for any project:

1. Fork the appropriate Prebid repository (e.g. [Prebid.js](https://github.com/prebid/Prebid.js)).
2. Create a branch in your fork for your proposed code change. (e.g. feature/exAnalyticsAdapter)
3. Build and test your feature/bug fix in the branch.
4. Open a [pull request](https://help.github.com/en/desktop/contributing-to-projects/creating-a-pull-request) to the appropriate repository's master branch with a good description of the feature/bug fix.
5. If there's something that needs to change on the prebid.org website, follow the above steps for the [website repo](https://github.com/prebid/prebid.github.io).

{: .alert.alert-warning :}
Analytics adapters are subject to a number of specific technical rules. Please become familiar
with the [module rules](/dev-docs/module-rules.html) that apply globally and to analytics adapters in particular.

### Step 1: Add a markdown file describing the module

Create a markdown file under `modules` with the name of the bidder suffixed with 'AnalyticsAdapter', e.g., `exAnalyticsAdapter.md`

Example markdown file:

```md

# Overview

Module Name: Ex Analytics Adapter
Module Type: Analytics Adapter
Maintainer: prebid@example.com

# Description

Analytics adapter for Example.com. Contact prebid@example.com for information.

```

### Step 2: Add analytics source code

1. Create a JS file under `modules` with the name of the bidder suffixed with 'AnalyticsAdapter', e.g., `exAnalyticsAdapter.js`

2. Create an analytics adapter to listen for [Prebid events](/dev-docs/publisher-api-reference/onEvent.html) and call the analytics library or server. See the existing *AnalyticsAdapter.js files in the repo under [modules](https://github.com/prebid/Prebid.js/tree/master/modules).

3. There are two types of analytics adapters. The example here focuses on the 'endpoint' type. See [AnalyticsAdapter.js](https://github.com/prebid/Prebid.js/blob/master/libraries/analyticsAdapter/AnalyticsAdapter.js) for more info on the 'bundle' type.

    1. endpoint - Calls the specified URL on analytics events. Doesn't require a global context.
    2. bundle - An advanced option expecting a global context.

4. In order to get access to the configuration passed in from the page, the analytics
adapter needs to specify an enableAnalytics() function, but it should also call
the base class function to set up the events.

5. Doing analytics may require user permissions under [GDPR](/dev-docs/modules/consentManagement.html), which means your adapter will need to be linked to your [IAB Global Vendor List](https://iabeurope.eu/vendor-list-tcf-v2-0/) ID. If no GVL ID is found, and Purpose 7 (Measurement) is enforced, your analytics adapter will be blocked unless it is specifically listed under vendorExceptions. Your GVL ID can be added to the `registerAnalyticsAdapter()` call.

#### Basic prototype analytics adapter

The best way to get started is to look at some of the existing AnalyticsAdapter.js files in [the repository](https://github.com/prebid/Prebid.js/tree/master/modules).

Here's a skeleton outline:

```javascript
import {ajax} from '../src/ajax.js';
import adapter from '../libraries/analyticsAdapter/AnalyticsAdapter.js';
import CONSTANTS from '../src/constants.json';
import adaptermanager from '../src/adaptermanager.js';

const analyticsType = 'endpoint';
const url = 'URL_TO_SERVER_ENDPOINT';

let exAnalytics = Object.assign(adapter({url, analyticsType}), {
  // ... code ...
});

// save the base class function
exAnalytics.originEnableAnalytics = exAdapter.enableAnalytics;

// override enableAnalytics so we can get access to the config passed in from the page
exAnalytics.enableAnalytics = function (config) {
  initOptions = config.options;
  exAnalytics.originEnableAnalytics(config);  // call the base class function
};

adaptermanager.registerAnalyticsAdapter({
  adapter: exAnalytics,
  code: 'exAnalytics',
  gvlid: 1
});

export default exAnalytics;
```

#### Reading TCF2 enforcement actions

Analytics adapters can learn what happened with regards to GDPR TCF2 enforcement by listening to the tcf2Enforcement event.

The callback will receive an object with the following attributes:

```javascript
{
  storageBlocked: ['moduleA', 'moduleB'],
  biddersBlocked: ['moduleB'],
  analyticsBlocked: ['moduleC']
}
```

Note that analytics adapters can read the TCF string directly from the auction object -- look for the gdprConsent object, which contains three attributes:
gdprApplies, consentString, and apiVersion

#### Listening for errors

There are two error events analytics modules may wish to listen for: auctionDebug and adRenderFailed. The former is any error that would be normally logged to console and there can be a great many. The latter may happen for the following reasons: (PREVENT_WRITING_ON_MAIN_DOCUMENT, NO_AD, CANNOT_FIND_AD, EXCEPTION, MISSING_DOC_OR_ADID)

#### Analytics adapter best practices

* listen only to the events required
* batch up calls to the backend for post-auction logging rather than calling immediately after each event.

### Step 3: Add unit tests

1. Create a JS file under `test/spec/modules` with the name of the bidder suffixed with 'AnalyticsAdapter_spec', e.g., `exAnalyticsAdapter_spec.js`

2. Write great unit tests. See the other AnalyticsAdapter_spec.js files for examples.

### Step 4: Submit the code

Once everything looks good, submit the code, tests, and markdown as a pull request to the [Prebid.js repo](https://github.com/prebid/Prebid.js).

### Step 5: Website pull request

Add a documentation file for your new analytics adapter.

1. Create a fork of the [website repo](https://github.com/prebid/prebid.github.io) and a branch for your new adapter. (e.g. feature/exampleAnalyticsAdapter)

2. Copy one of the '.md' files in `dev-docs/analytics` to a file for your adapter. e.g. example.md

3. Update the metadata fields at the top of the file to suit your needs:

```markdown
layout: analytics
title: Your Company Name
description: Your Company Analytics Adapter
modulecode: exampleAnalyticsAdapter
tcfeu_supported: true/false  (TCF EU protocol support)
usp_supported: true/false    (US Privacy support)
coppa_supported: true/false  (COPPA support)
prebid_member: true/false
gvl_id:                      (IAB Global Vendor List ID)
enable_download: false       (in case you don't want users of the website to download your adapter)
```

What does it mean to "support" the privacy protocols? At a high level, it means you have
specifically discussed privacy policy actions and rules with your lawyers and implemented the results of that discussion.
Some specific examples:

1. GDPR support means: the analytics endpoint respects GDPR consent, Special Feature 1, and deals with any other Purposes declared in the vendor's Global Vendor List
2. COPPA support means: analytics companies should not be building targeting profiles for users on sites flagged as COPPA
3. USP/CCPA support means: analytics adapters cannot share user information if that user has opted out of sale
4. Update the body of the file to describe the options publishers have when
configuring your adapter. See other adapters (e.g. rubicon.md) for a template.
5. Submit the pull request to the prebid.github.io repo.

### Step 6: Wait for Prebid volunteers to review

We sometimes get pretty busy, so it can take a couple of weeks for the review process to complete, so while you're waiting, consider [joining Prebid.org](https://prebid.org/membership/) to help us out with code reviews. (!)

## Further Reading

* [Analytics for Prebid](/overview/analytics.html) (Overview and list of analytics providers)
* [Module Rules](/dev-docs/module-rules.html)
* [Instream Video Ads Tracking](/dev-docs/modules/instreamTracking.html)
