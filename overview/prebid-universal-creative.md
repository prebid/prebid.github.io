---
layout: page_v2
title: Prebid Universal Creative
description: An overview of Prebid Universal Creative
sidebarType: 3
nav_section: intro
---

<div class="bs-docs-section" markdown="1">

# Prebid Universal Creative
{:.no_toc}

The Prebid Universal Creative makes it easier for publishers to configure Prebid in their ad server. The Prebid Universal Creative provides a single creative configuration that can be used across many formats, platforms, devices, and ad servers.

Specifically, you need to use the Universal Creative in these scenarios:

- AMP and Prebid SDK (these require loading creatives from cache)
- when you need to support safeframes
- when you need to support native

If you only ever need to display non-safeframed banner and outstream-video creatives, you may use
the original simple approach of just calling the Prebid.js `renderAd` function directly:

```
<script> var w = window; for (i = 0; i < 10; i++) { w = w.parent; if (w.pbjs) { try { w.pbjs.renderAd(document, '%%PATTERN:hb_adid%%'); break; } catch (e) { continue; } } } </script>
```

## How to Implement

### Google Ad Manager

- [Step by Step Guide to Google Ad Manager Setup]({{site.baseurl}}/adops/step-by-step.html)

### AMP

- Adops: [Setting Up Prebid for AMP in Google Ad Manager]({{site.baseurl}}/adops/setting-up-prebid-for-amp-in-dfp.html)
- Developer: [Show Prebid Ads on AMP Pages]({{site.baseurl}}/dev-docs/show-prebid-ads-on-amp-pages.html)

### Mobile App

- [Step by Step Line Item Setup for Google Ad Manager]({{site.baseurl}}/prebid-mobile/adops-line-item-setup-dfp.html)
- [Step by Step Line Item Setup for MoPub]({{site.baseurl}}/prebid-mobile/adops-line-item-setup-mopub.html)

### AppNexus Publisher Adserver

- [Setting up Prebid with the AppNexus Publisher Ad Server]({{site.baseurl}}/adops/setting-up-prebid-with-the-appnexus-ad-server.html)

### Other
- [Send All Bids to the Ad Server - Ad Ops Setup]({{site.baseurl}}/adops/send-all-bids-adops.html)
