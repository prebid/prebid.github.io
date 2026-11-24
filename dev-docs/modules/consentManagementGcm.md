---
layout: page_v2
page_type: module
title: Consent Management - Google Consent Mode
description: If your site signals consent through Google Consent Mode v2, this module reads that state from the page and passes it to bidders and Prebid Server.
module_code : consentManagementGcm
display_name : Consent Management - Google Consent Mode
enable_download : true
recommended: true
min_js_version: 11.54.0
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

1. It folds the `consent` `default` and `update` calls on `window.dataLayer`, in order, into the current state of each signal, the way gtag does. Like gtag, it reads only what `gtag()` pushes (its `arguments` object): an array pushed directly, such as `dataLayer.push(['consent', 'update', {...}])`, is ignored.
2. It wraps `dataLayer.push`, as Google Tag Manager does, so calls made later in the session are seen too.
3. By default, it also reads what Google's tag itself holds: the visitor's region, and Consent Mode state that never went through the `dataLayer` (see [Google's tag data](#googles-tag-data)).
4. Before the first auction, it waits for `update` calls to set the signals that the defaults deny (see [Timeouts](#timeouts)).
5. It exposes the state as `gcm` consent data, alongside `gdpr`, `gpp` and `usp`, and adds it to bid requests as `regs.ext.gcm` (see [regs.ext.gcm](#regsextgcm)).

To act on the state, for example to stop bidders writing cookies when `ad_storage` is denied, add the [GCM Control module](/dev-docs/modules/gcmControl.html) too.

The module works on its own: it doesn't need the TCF or GPP modules, or Google's tag, on the page. It works whether `window.dataLayer` exists before Prebid.js loads or not, whether gtag.js or Google Tag Manager loads, and wraps `dataLayer.push`, before or after Prebid.js does, and if the page replaces `window.dataLayer` with a new array (the new array is read at the next auction).

As in gtag, any value other than `'granted'` on one of the four Consent Mode v2 signals (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) counts as `'denied'`.

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
| gcm.timeout | `integer` | The longest (in milliseconds) the first auction waits for Consent Mode, counted from when `consentManagement` is configured. See [Timeouts](#timeouts). Defaults to `500`. | `500` |
| gcm.defaultWhenAbsent | `null` or `'denied'` | What to do when no Consent Mode signal is found. `null` (the default) means no GCM signal, leaving other consent frameworks to govern. `'denied'` treats all four signals as denied. Other values are ignored, with a warning. | `'denied'` |
| gcm.region | `string` or `Promise<string>` | The visitor's region, as an ISO 3166-1 alpha-2 country code (`'US'`) or ISO 3166-2 subdivision code (`'US-CA'`), the same codes gtag takes; or a promise for one, if it isn't known when Prebid.js is configured. Used to apply region-scoped defaults; see [Region-scoped defaults](#region-scoped-defaults). Defaults to the region Google's tag resolved, if available. | `'US-CA'` |
| gcm.googleTagData | `boolean` | Whether to also read `window.google_tag_data`, which Google's tag (gtag.js or Google Tag Manager) maintains. See [Google's tag data](#googles-tag-data). Defaults to `true`. | `false` |
| gcm.consentData | `Object` | The Consent Mode state, used when `cmpApi` is `'static'`, e.g. `{ad_storage: 'denied', ad_user_data: 'granted'}`. | |
| gcm.rules | `Object` | The activities each signal denies. Read by the [GCM Control module](/dev-docs/modules/gcmControl.html#page-integration). | |

### Timeouts

The module starts looking for Consent Mode as soon as `consentManagement` is configured, and again whenever that configuration changes. The first auction after that is held until the state is settled:

- **No Consent Mode found**: the module waits up to `timeout` for a `gtag('consent', ...)` call. If none arrives, `defaultWhenAbsent` applies.
- **The defaults deny one or more of the four v2 signals**: the module waits until `update` calls have set every signal that the defaults deny. An update that sets only some of them keeps the auction waiting for the rest; updates pushed one right after the other count together.
- **The defaults deny none of the four v2 signals** and set no `wait_for_update`: there's nothing to wait for, and the auction goes ahead at once. This also holds with gtag.js on the page, when [Google's tag](#googles-tag-data) reports the same signals as the `dataLayer` defaults. If Google's tag reports defaults for other signals (for example set by a Tag Manager consent template), the module waits for an `update`, as it can't tell whether those defaults asked to wait.

The wait for updates ends after `wait_for_update` milliseconds, if a `default` call sets it (the longest one, if several do), and never lasts longer than `timeout`. The auction then uses what the module has at that point: the defaults, with any updates received so far on top.

If `consentManagement` is configured again while an auction is waiting, the auction waits for the new lookup instead, but no longer than it would have for the first one.

Later auctions don't wait. A `default` or `update` call at any point changes the state used by the next auction.

{: .alert.alert-info :}
A returning visitor's choice reaches Prebid.js only when the CMP has loaded and called `update`. Set `wait_for_update` on the page's `default` call, and `timeout` here, long enough to cover the time your CMP takes to do that; otherwise the first auction runs with the defaults. Keep in mind that a new visitor who hasn't made a choice yet never gets an `update`, so their first auction waits for the whole period.

### Region-scoped defaults

gtag applies a `default` call with a `region` option only to visitors in those regions:

```javascript
gtag('consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', region: ['DE', 'US-CA'] });
```

To apply them as gtag does, the module needs the visitor's region. It takes it from `gcm.region` or, when that isn't set, from [Google's tag](#googles-tag-data), once the tag has resolved it.

- **When the region is known**, region-scoped defaults apply only if they match it. As in gtag, the most specific match wins: a subdivision (`'US-CA'`) over its country (`'US'`), and either over a `default` with no region.
- **When the region is unknown**, the visitor may be in any of the regions the page names. A signal is denied if any region-scoped default denies it, and what region-scoped defaults grant is left out. With the example above, every visitor is treated as denied until an `update` arrives. The module logs a single warning.
- **When the region is a country and a default is scoped to one of its subdivisions** (the region is `'US'`, the default is for `'US-CA'`), the country isn't specific enough: that default only denies, as if the region was unknown. Give the subdivision instead.

This is never more permissive than what gtag resolves, at the cost of denying, and making the first auction wait for an `update`, for visitors the defaults don't apply to. If the page uses region-scoped defaults and has no Google tag (or you set `googleTagData: false`), set `gcm.region` from your own geolocation to avoid that.

About `gcm.region`:

- Lower case and surrounding spaces are accepted. Anything that isn't a country or subdivision code is ignored with a warning, and the region is unknown.
- If it's a promise, the region is unknown (or the one from Google's tag) until the promise resolves, and the state is recomputed as soon as it does. The first auction doesn't wait for the promise beyond the [timeouts](#timeouts) above, so it should resolve within `timeout`. If it's rejected, or resolves to something that isn't a region code, it's ignored with a warning.
- Setting it again with a later `setConfig` recomputes the state at once.

`update` calls always apply, regardless of region. As gtag does, the module ignores a `default` whose `region` is an empty list, applies a `default` to everyone if its `region` list includes an empty string (`''`), and reads each entry of `region` as an upper-case string without trimming it. An entry that isn't a valid region code matches no visitor, but still denies while the region is unknown.

### Google's tag data

Google's tag (gtag.js or Google Tag Manager) keeps its own view of Consent Mode in `window.google_tag_data`. Unless `gcm.googleTagData` is `false`, the module reads two things from it:

- **The visitor's region**, as Google's tag resolved it, used for [region-scoped defaults](#region-scoped-defaults) when `gcm.region` isn't set.
- **Consent Mode state that never went through the `dataLayer`**, such as what Tag Manager consent templates set. It can only deny a signal, or set one that the `dataLayer` calls don't: it never grants what the `dataLayer` calls deny.

{: .alert.alert-warning :}
`google_tag_data` is not a documented Google interface, and Google can change it without notice. If the module finds anything unexpected in it, it takes nothing from it, and works from the `dataLayer` and `gcm.region` alone. To never read it, set `googleTagData: false`.

With `googleTagData: false`:

- Supply `gcm.region` yourself if the page uses region-scoped defaults.
- Consent Mode set only through Tag Manager consent templates isn't seen. If nothing sets it through the `dataLayer` either, `defaultWhenAbsent` applies.

The module checks Google's tag repeatedly while the first auction waits. After that, it reads it again at each `gtag('consent', ...)` call and at the start of each auction.

### regs.ext.gcm

The module adds the current Consent Mode state to the global first-party data, and so to bid requests and Prebid Server requests, as `regs.ext.gcm`:

```json
{ "regs": { "ext": { "gcm": { "ad_storage": "granted", "analytics_storage": "granted", "ad_user_data": "granted", "ad_personalization": "denied" } } } }
```

- It uses gtag's own keys, with `'granted'` or `'denied'` as values.
- It's the current state as the module resolved it, which is also what the [GCM Control module](/dev-docs/modules/gcmControl.html) enforces: the `default` and `update` calls folded in order, with region-scoped defaults and Google's tag data applied as described above.
- It leaves out signals that nothing set, and call options such as `wait_for_update` and `region`.
- Signals other than the four above (for example `functionality_storage`) pass through when their value is `'granted'` or `'denied'`.
- It's absent when no Consent Mode signal is found. With `defaultWhenAbsent: 'denied'`, it carries the four signals as denied, since that's the state Prebid.js then enforces.

Bid adapters can read it from `bidderRequest.ortb2.regs.ext.gcm`. The consent data is also available to other modules through `pbjs.getConsentMetadata()` and as `gcmConsent` in [activity control](/dev-docs/activity-controls.html) parameters.

### Limitations

- **The module can only be as accurate as what the page tells it.** See the recommendations under [Timeouts](#timeouts) and [Region-scoped defaults](#region-scoped-defaults).
- **Only `window.dataLayer` is read.** Calls pushed to a data layer with another name aren't seen.
- **Changes mid-session:** a `default` or `update` call changes the consent data at once, and applies to bidding from the next auction. Like any consent change, it makes Prebid.js check [`reportAnalytics`](/dev-docs/activity-controls.html#activities) again. With the [GCM Control module](/dev-docs/modules/gcmControl.html), revoking `analytics_storage` disables enabled analytics adapters through their `disableAnalytics()` method. Adapters that don't implement it stay enabled, and Prebid.js logs a warning. A change that reaches only Google's tag, and not the `dataLayer`, is picked up at the next auction.
- `url_passthrough` and `ads_data_redaction` are Consent Mode settings for Google's own tags, not consent signals. The module ignores them.

### Examples

Example 1: read Consent Mode from the page, waiting up to 800ms for the CMP to report the visitor's choice. The page's `default` call should set a `wait_for_update` to match.

```javascript
pbjs.setConfig({
  consentManagement: {
    gcm: {
      timeout: 800
    }
  }
});
```

Example 2: alongside TCF, treating a page with no Consent Mode as denied.

```javascript
pbjs.setConfig({
  consentManagement: {
    gdpr: {
      cmpApi: 'iab',
      timeout: 8000
    },
    gcm: {
      defaultWhenAbsent: 'denied'
    }
  }
});
```

Example 3: a page with region-scoped defaults that gets the visitor's region from its own geolocation service, without reading Google's tag data. `getVisitorRegion()` stands for your own code; it returns a promise for a code such as `'DE'` or `'US-CA'`.

```javascript
pbjs.setConfig({
  consentManagement: {
    gcm: {
      region: getVisitorRegion(),
      googleTagData: false
    }
  }
});
```

Example 4: static Consent Mode state.

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
- [Integration example with gtag.js](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/gcmConsent.html): Prebid.js with gtag.js loaded before or after it, scripted consent commands, a promised region, and a `demo.report()` helper that compares Prebid's consent data with what Google's tag resolved
- [Prebid Activity Controls](/dev-docs/activity-controls.html)
- [Prebid Consent Management - TCF Module](/dev-docs/modules/consentManagementTcf.html)
- [Prebid Consent Management - GPP Module](/dev-docs/modules/consentManagementGpp.html)
