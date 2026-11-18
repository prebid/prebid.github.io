---
layout: page_v2
page_type: module
title: GCM Control
description: Complements the Google Consent Mode consent management module, denying Prebid.js activities when Consent Mode signals are denied.
module_code : gcmControl
display_name : GCM Control
enable_download : true
min_js_version: 11.53.0
sidebarType : 1
---

# GCM Control Module
{: .no_toc }

- TOC
{: toc }

{% include legal-warning.html %}

## Overview

This module enforces [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent) signals through Prebid.js [activity controls](/dev-docs/activity-controls.html), as the [TCF Control](/dev-docs/modules/tcfControl.html) and [GPP Control](/dev-docs/modules/gppControl_usnat.html) modules do for their frameworks. It complements the [Google Consent Mode consent management module](/dev-docs/modules/consentManagementGcm.html), which reads the Consent Mode state from the page.

When a signal is `'denied'`, the activities it maps to are denied. A signal that is `'granted'`, or that nothing set, denies nothing.

While the consent management module is still waiting for Consent Mode (see its [timeouts](/dev-docs/modules/consentManagementGcm.html#timeouts)), the state isn't known, and every signal is taken as denied, as TCF Control assumes no consent until the CMP answers. Once the wait is over and no Consent Mode signal was found, the module does nothing, unless [`defaultWhenAbsent`](/dev-docs/modules/consentManagementGcm.html#page-integration) is `'denied'`.

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach.**

## Default activity mapping

{: .table .table-bordered .table-striped }

| Signal `denied` | Activities denied |
| --- | --- |
| `ad_storage` | `accessDevice` for bidders and user ID modules (no cookies or local storage) |
| `analytics_storage` | `reportAnalytics`, and `accessDevice` for analytics adapters |
| `ad_user_data` | `transmitEids`, `transmitUfpd` and `transmitPreciseGeo`: user data sent to bidders |
| `ad_personalization` | `transmitUfpd` and `enrichEids` |

## Working with other frameworks

The stricter framework wins. GCM Control adds its own activity rules, and an activity is denied if any framework's rule denies it. For example, with TCF and Consent Mode both on the page, a bidder can write cookies only if TCF gives it a legal basis for purpose 1 **and** `ad_storage` is granted.

These rules have the priority of other module rules, 10. Publisher rules set through [`allowActivities`](/dev-docs/activity-controls.html#priority) with a higher priority (a lower number, 1 by default) can still override them, as they can for TCF Control.

## Page Integration

This module activates when `consentManagement.gcm` is configured and the `consentManagementGcm` module is in the build. See that [module's documentation](/dev-docs/modules/consentManagementGcm.html) for its parameters. The mapping can be changed per signal:

{: .table .table-bordered .table-striped }

| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gcm.rules | `Object` | Map from Consent Mode signal to the list of activities it denies. A signal listed here replaces its default mapping; signals not listed keep theirs. An empty list makes a signal deny nothing. Signals other than the four Consent Mode v2 ones, such as `functionality_storage`, can be mapped too. A value that isn't a list is ignored, with a warning. | `{ad_personalization: ['transmitUfpd']}` |
| gcm.rules.&lt;signal&gt;[] | `string` or `Object` | An [activity](/dev-docs/activity-controls.html#activities) name, which denies it to every component, or `{activity, componentTypes}`, which denies it only to the listed component types (`'bidder'`, `'userId'`, `'analytics'`, `'rtd'`, `'prebid'`). | `{activity: 'accessDevice', componentTypes: ['bidder']}` |

### Examples

Example 1: `ad_personalization` denies only `transmitUfpd`, so user IDs still enrich requests. Some publishers want contextual ads, still with user IDs, when personalization is denied.

```javascript
pbjs.setConfig({
  consentManagement: {
    gcm: {
      rules: {
        ad_personalization: ['transmitUfpd']
      }
    }
  }
});
```

Example 2: `ad_storage` also stops user syncs and storage by RTD modules.

```javascript
pbjs.setConfig({
  consentManagement: {
    gcm: {
      rules: {
        ad_storage: [
          { activity: 'accessDevice', componentTypes: ['bidder', 'userId', 'rtd'] },
          'syncUser'
        ]
      }
    }
  }
});
```

## Limitations

- The module enforces the state that the consent management module resolved, with [its limitations](/dev-docs/modules/consentManagementGcm.html#limitations). Where the page doesn't say enough, as with region-scoped defaults and no known region, that state errs towards denied.
- An `update` that denies a signal applies to bidding from the next auction. Revoking `analytics_storage` mid-session disables enabled analytics adapters through their `disableAnalytics()` method, as for any consent change that denies [`reportAnalytics`](/dev-docs/activity-controls.html#activities). Adapters that don't implement `disableAnalytics()` stay enabled, and Prebid.js logs a warning.
- `url_passthrough` and `ads_data_redaction` aren't consent signals and aren't enforced.

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module and this module, add them to the **gulp build** command:

```bash
gulp build --modules=consentManagementGcm,gcmControl,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Further Reading

- [Prebid Consent Management - Google Consent Mode Module](/dev-docs/modules/consentManagementGcm.html)
- [Prebid Activity Controls](/dev-docs/activity-controls.html)
- [Prebid TCF Control module](/dev-docs/modules/tcfControl.html)
- [Google: Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent)
