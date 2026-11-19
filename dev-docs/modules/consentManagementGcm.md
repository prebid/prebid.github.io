---
layout: page_v2
page_type: module
title: Consent Management - Google Consent Mode
description: If your site signals consent through Google Consent Mode v2, this module reads that state from the page and passes it to bidders and Prebid Server.
module_code : consentManagementGcm
display_name : Consent Management - Google Consent Mode
enable_download : true
min_js_version: 11.52.0
sidebarType : 1
---

# Google Consent Mode Consent Management Module
{: .no_toc }

- TOC
{: toc }

{% include legal-warning.html %}

## Overview

Many sites, and many Consent Management Platforms (CMPs), signal consent through [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent). The page or its CMP calls:

```javascript
gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
// ...after the visitor chooses:
gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied' });
```

`gtag()` pushes its arguments onto `window.dataLayer`. This module reads those calls and makes the resulting Consent Mode state available to Prebid.js:

1. It folds the `['consent', 'default' | 'update', {...}]` entries of `window.dataLayer`, in order, into the current state of each signal, the way gtag does.
2. It wraps `dataLayer.push`, as Google Tag Manager does, so `update` calls made later in the session are seen too.
3. Before the first auction, it waits for an `update` when the page has set only a `default` (see [Timeouts](#timeouts)).
4. It exposes the state as `gcm` consent data, alongside `gdpr`, `gpp` and `usp`, and adds it to bid requests as `regs.ext.gcm` (see [regs.ext.gcm](#regsextgcm)).

To act on the state, for example to stop bidders writing cookies when `ad_storage` is denied, add the [GCM Control module](/dev-docs/modules/gcmControl.html) too.

The module reads only the documented `dataLayer` protocol. It never reads undocumented Google globals such as `google_tag_data`. It works whether `window.dataLayer` exists before Prebid.js loads or not, whether Google Tag Manager wraps `dataLayer.push` before or after Prebid.js does, and if the page replaces `window.dataLayer` with a new array (the new array is read at the next auction).

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach.**

## Page Integration

Set Consent Mode on the page as Google documents, through `gtag('consent', ...)` or your CMP's Google Consent Mode integration. Then include this module in your build and add a `gcm` object to `consentManagement`:

{: .table .table-bordered .table-striped }

| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gcm | `Object` | | |
| gcm.enabled | `boolean` | Enables or disables the module. Defaults to `true`. | `false` |
| gcm.cmpApi | `string` | `'dataLayer'` (the default) reads `window.dataLayer`. `'static'` uses `gcm.consentData` instead. | `'dataLayer'` |
| gcm.timeout | `integer` | How long (in milliseconds) the first auction waits for Consent Mode. See [Timeouts](#timeouts). Defaults to `500`. | `500` |
| gcm.defaultWhenAbsent | `null` or `'denied'` | What to do when the page sets no Consent Mode at all. `null` (the default) means no GCM signal, leaving other consent frameworks to govern. `'denied'` treats all four signals as denied. | `'denied'` |
| gcm.region | `string` | The visitor's region, as an ISO 3166-1 alpha-2 country code (`'US'`) or ISO 3166-2 subdivision code (`'US-CA'`), the same codes gtag takes. Used to apply region-scoped defaults; see [Region-scoped defaults](#region-scoped-defaults). | `'US-CA'` |
| gcm.consentData | `Object` | The Consent Mode state, used when `cmpApi` is `'static'`, e.g. `{ad_storage: 'denied', ad_user_data: 'granted'}`. | |
| gcm.rules | `Object` | The activities each signal denies. Read by the [GCM Control module](/dev-docs/modules/gcmControl.html). | |

### Timeouts

Before the first auction (and whenever the `consentManagement` configuration changes), the module waits for Consent Mode:

- If the page has called `update`, the auction goes ahead at once.
- If the page has only called `default`, the module waits for an `update`, for up to `wait_for_update` milliseconds if the `default` call gives it, and never longer than `timeout`. If no update arrives, the auction uses the default.
- If the page has not called `gtag('consent', ...)` at all, the module waits up to `timeout` for a call. If none arrives, `defaultWhenAbsent` applies.

Later auctions don't wait. An `update` at any point changes the state used by the next auction.

### Region-scoped defaults

gtag applies a `default` call with a `region` option only to visitors in those regions:

```javascript
gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', region: ['DE', 'FR'] });
```

Only Google's tag knows the visitor's region, so the module decides as follows:

- **When GDPR applies**, region-scoped defaults all apply, as if they matched the visitor, and the most restrictive value wins: a signal is denied if any `default` denies it. GDPR applies when, in the same auction, the [TCF module](/dev-docs/modules/consentManagementTcf.html) reports `gdprApplies: true`, or the [GPP module](/dev-docs/modules/consentManagementGpp.html) lists the EU TCF section (2) among its applicable sections.
- **Otherwise**, region-scoped defaults apply only if you configure the visitor's region with `gcm.region`. As in gtag, the most specific match wins: a subdivision (`'US-CA'`) over its country (`'US'`), and either over a `default` with no region. Without `gcm.region`, region-scoped defaults are ignored, with a single warning.

`update` calls always apply, regardless of region.

{: .alert.alert-info :}
To decide whether GDPR applies, the module uses the TCF and GPP data of the same auction. You don't need to order the modules in any particular way: the GCM state is recomputed after all consent modules have finished their lookups for the auction, and again whenever TCF or GPP consent changes. If the TCF or GPP lookup times out or fails, GDPR is treated as not applying for this purpose.

### regs.ext.gcm

The module adds the current Consent Mode state to the global first-party data, and so to bid requests and Prebid Server requests, as `regs.ext.gcm`:

```json
{ "regs": { "ext": { "gcm": { "ad_storage": "granted", "analytics_storage": "granted", "ad_user_data": "granted", "ad_personalization": "denied" } } } }
```

- It uses gtag's own keys and `'granted'`/`'denied'` values, unchanged, so it reads exactly as the page wrote it.
- It's the current state: the `default` and `update` calls folded in order.
- It leaves out signals the page never set, and call options such as `wait_for_update` and `region`.
- Signals other than the four above pass through as they are.
- It's absent when the page has no Consent Mode. With `defaultWhenAbsent: 'denied'`, it carries the four signals as denied, since that's the state Prebid.js then enforces.

Bid adapters can read it from `bidderRequest.ortb2.regs.ext.gcm`. The consent data is also available to other modules through `pbjs.getConsentMetadata()` and as `gcmConsent` in [activity control](/dev-docs/activity-controls.html) parameters.

### Out of scope

- `url_passthrough` and `ads_data_redaction` are Consent Mode settings for Google's own tags, not consent signals. The module ignores them.
- **Revocation mid-session:** an `update` that denies a signal changes the consent data at once, and applies to bidding from the next auction. Like any consent change, it makes Prebid.js check [`reportAnalytics`](/dev-docs/activity-controls.html#activities) again. With the [GCM Control module](/dev-docs/modules/gcmControl.html), revoking `analytics_storage` disables enabled analytics adapters through their `disableAnalytics()` method. Adapters that don't implement it stay enabled, and Prebid.js logs a warning.

### Examples

Example 1: read Consent Mode from the page, waiting up to 800ms for the visitor's choice.

```javascript
pbjs.setConfig({
  consentManagement: {
    gcm: {
      timeout: 800
    }
  }
});
```

Example 2: alongside TCF, treating a page with no Consent Mode as denied, for a site that knows its visitors' region.

```javascript
pbjs.setConfig({
  consentManagement: {
    gdpr: {
      cmpApi: 'iab',
      timeout: 8000
    },
    gcm: {
      defaultWhenAbsent: 'denied',
      region: 'US-CA'
    }
  }
});
```

Example 3: static Consent Mode state.

```javascript
pbjs.setConfig({
  consentManagement: {
    gcm: {
      cmpApi: 'static',
      consentData: {
        ad_storage: 'denied',
        analytics_storage: 'granted',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      }
    }
  }
});
```

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include this module and the GCM Control module, add them to the **gulp build** command:

```bash
gulp build --modules=consentManagementGcm,gcmControl,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Further Reading

- [Google: Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent)
- [Google: About consent mode](https://support.google.com/google-ads/answer/13802165)
- [Prebid GCM Control module](/dev-docs/modules/gcmControl.html)
- [Prebid Activity Controls](/dev-docs/activity-controls.html)
- [Prebid Consent Management - TCF Module](/dev-docs/modules/consentManagementTcf.html)
- [Prebid Consent Management - GPP Module](/dev-docs/modules/consentManagementGpp.html)
