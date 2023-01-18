---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Deep Link+

Prebid Rendering Module supports the premium standard for retargeting campaigns - DeepLink+.

## Advantages over traditional mobile deep-linking functionality

Technology has traditionally failed in providing the ideal user experience — as processing traditional deep-links requires opening up blank browser windows, redirecting users multiple times, and sometimes breaking down completely. Additionally, buyers would lack analytics around when primary URLs worked versus when fallback URLs were required.

Deep Link+ provides a premium user experience while letting advertisers scale retargeting campaigns with accurate analytics.

The new deeplinking format enables buyers to submit:

 * primary URL
 * fallback URL
 * primary tracking URL
 * fallback tracking URL

And since Deep Link+ is built into the SDK, there is no need to pop up browser windows and re-directs that deteriorate the user experience.

## Support

The schema is supported for both kinds of ads - video and display.

The JSTag integration is not supported yet.


## How it works


DSPs should rely on the SDK version in the bid request:
```
"displaymanagerver": "4.11.0"
```

Starting with version 4.11.0 Android SDK supports deeplink+

To leverage the retargeting campaigns buyers use a specific scheme as click URL in the ad response. That URL describes the deep-linking and failover logic:

```
deeplink+://navigate?
    primaryUrl=PRIMARY_DEEPLINK&
    primaryTrackingUrl=PRIMARY_TRACKER&
    fallbackUrl=FALLBACK_URL
    &fallbackTrackingUrl=FALLBACK_TRACKER
```

The only required parameter is `primaryUrl` and if there are no other parameters, the deeplink+ would be handled as standard deeplink URL: doing nothing if the app is missing.

The `fallbackUrl` can be any supported URI type (e.g., http, traditional deeplink) except for another Deep Link+ URL. To specify multiple tracker URLs (primary or fallback), buyers simply need to repeat the tracker key with any desired tracker URLs. The `primaryTrackingURL` is triggered if the deeplink is successful (which occurs after the user clicks).

For example, below is a Deep Link+ URL whose primary target is the Twitter app, with two (2) primary tracker URLs, a fallback URL directing the user to Twitter’s mobile website if the primary deeplink fails and zero (0) fallback tracker URLs:

```
deeplink+://navigate?
    primaryUrl=twitter%3A%2F%2Ftimeline&
    primaryTrackingUrl=http%3A%2F%2Fmopub.com%2Fclicktracking&
    primaryTrackingUrl=http%3A%2F%2Fmopub.com%2Fmopubtracking&
    fallbackUrl=http%3A%2F%2Fmobile.twitter.com
```

The SDK will process this scheme regarding to the standard.

## Integration tips

**Publishers**: No action required for full-featured support of the ads with DeepLink+ schema. All work is performed by the SDK.

**Buyers**: Must insert the deeplink+ scheme into creative or provide it via redirect for the regular clickthrough URL.
