---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# MoPub Setup
 
## Order Setup

### Step 1: Create New Order

 <img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-create.png" alt="Pipeline Screenshot" align="center">
 
### Step 2: Create Line Item
 
#### Line Item: Display, Video

To integrate Prebid demand you have to create a Custom Ad Network Line Items with a specific Targeting keyword. 

- **Line Item Name**: hb_pb 0.10
- **Type & Priority**: Network Line Item
- **Network**: Custom SDK network
- **Custom event class**: 
    - For Banner API:
        - iOS: **PrebidBannerAdapter**
        - Android: **com.mopub.mobileads.PrebidBannerAdapter**
    - For Interstitial API: 
        - iOS: **PrebidInterstitialAdapter**
        - Android: **com.mopub.mobileads.PrebidInterstitialAdapter**
    - For Rewarded API: 
        - iOS: **PrebidRewardedVideoAdapter**
        - Android: **com.mopub.mobileads.PrebidRewardedVideoAdapter**
    - For Native API: 
        - iOS: **PrebidNativeAdapter**
        - Android: **com.mopub.nativeads.PrebidNativeAdapter**
- **Custom event data**: {}

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-li-type.png" alt="Pipeline Screenshot" align="center">

> Even though a Line Item can be named in any way, we strongly recommend to use the price or targeting keyword in the name. It will help to navigate through hundreds of them.

<!---
Note that `Custom Ad Network` type is not suitable for Native Style Ads, see [Native Style Line Item and creative](#line-item-native) for more details.

#### Line Item: Native

If you integrate Native Ads not via mediation you should create regular line tiems

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-order-native.png" alt="Pipeline Screenshot" align="center">

After that you should create a custom Native creative with **obligatory** property **isPrebid** and value **1**.

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-creative-native.png" alt="Pipeline Screenshot" align="center">

This property will show to the Rendering Module that it should render the ad from the winning bid.

#### Line Item: Native Style

Native styles ads use `non-guaranteed` line item type and Medium Rectangle format HTML creative.

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-native-ad-li.png" alt="Pipeline Screenshot" align="center">

MoPub 300x250 Medium Rectangle format HTML creative example:

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-native-ad-creative.png" alt="Pipeline Screenshot" align="center">

``` html
<div class="sponsored-post">
  <div class="thumbnail"></div>
  <div class="content" class="pb-click">
	<h2><p><span style="display:inline-block;"><img src="hb_native_icon" alt="hb_native_icon" width="40" height="40"></span> hb_native_title</p></h2>
	<p>hb_native_body</p>
	<a target="_blank" href="hb_native_linkurl" class="pb-click">hb_native_cta</a>
	<img src="hb_native_image" alt="hb_native_image" width="300" height="50">
	<div class="attribution">hb_native_brand</div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-trk.js"></script>
<script>
  var pbNativeTagData = {};
  pbNativeTagData.uuid = "%%KEYWORD:hb_cache_id%%";
  pbNativeTagData.env = "%%KEYWORD:hb_env%%";
  pbNativeTagData.cacheHost = "%%KEYWORD:hb_cache_host%%";
  pbNativeTagData.cachePath = "%%KEYWORD:hb_cache_path%%";
  window.pbNativeTag.startTrackers(pbNativeTagData);
</script>
```

-->
 
#### Ad Unit Targeting

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-li-ad-unit.png" alt="Pipeline Screenshot" align="center">

#### Audience Targeting

The **Keyword targeting** property should contain a special keyword with the price of winning bid.

<img src="/assets/images/prebid-mobile/modules/rendering/order-mopub-li-audience.png" alt="Pipeline Screenshot" align="center">


