---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Prebid Mobile Rendering 

Prebid Mobile has added a rendering module (currently in open beta) which provides an API for rendering display and video media types independently of the current core feature set and interfaces. The API enables Prebid Mobile to have full ownership of the Web view selected for rendering and will pass any associated ad markup to the controlled view. This new functionality enables publishers to have improved control of features such as Open Measurement, MRAID, SKAdNetwork. This same functionality is available for rendering video (VAST) creatives through an internal video player.

The **rendering API** is available on iOS and Android starting with the `1.13.0-beta1` version. 

Starting with `1.14.0-beta1` Prebid mobile supports integration with **AdMob**.

Starting with `2.0.0` Prebid mobile supports integration with **AppLovin MAX**. 


## Supported Ad Formats

Prebid Mobile rendering supports the following ad formats:

* Display Banner
* Video Banner 
* Display Interstitial
* Video Interstitial
* Rewarded Video



