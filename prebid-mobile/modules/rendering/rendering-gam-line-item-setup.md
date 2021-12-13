---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# Google Ad Manager Setup

## Step 1: Create New Order

 <img src="/assets/images/prebid-mobile/modules/rendering/order-gam-create.png" alt="Pipeline Screenshot" align="center">


## Step 2: Create Line Item

To integrate the Prebid demand you have to create a Line Items with a specific price and targeting keywords.

> Even though a Line Item can be named in any way, we strongly recommend to use the price or targeting keyword in the name. It will help to navigate through hundreds of them.

### Select Type

Create a Line Item depending on the type of expected creative kind:

* **Display** - for the Banner, HTML Interstitial
* **Video and Audio** - for the Video Interstitial, Rewarded Video, and Outstream Video ads.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-li-create.png" alt="Pipeline Screenshot" align="center">

Set sizes respectively to expected creatives.

### Select Price

The Line Item price should be chosen according to the price granularity policy.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-li-price.png" alt="Pipeline Screenshot" align="center">

### Set Targeting Keywords

The **Custom targeting** property should contain a special keyword with the price of winning bid. The same as a Rate of the Line Item.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-li-targeting.png" alt="Pipeline Screenshot" align="center">

## Step 3: Prepare Prebid Creative

### Display Banner, Video Banner, Display Interstitial, Video Interstitial.

The Prebid SDK integrates with GAM basing on [App Events](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner#app_events) feature, almost for all ad formats. That means that creative should contain a special tag that will be processed by Prebid's GAM Event Handlers.

If GAM Event Handler receives the `PrebidAppEvent` event it will render the winning bid. Otherwise the control will be passed to the GAM Ad View and it will render the received creative.

``` html
<script type="text/javascript" src="https://media.admob.com/api/v1/google_mobile_app_ads.js">
</script>
<script type="text/javascript">admob.events.dispatchAppEvent("PrebidAppEvent","");</script>
```

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-creative-banner.png" alt="Pipeline Screenshot" align="center">

### Rewarded Video

Prebid rendering for Rewarded video ads is based on the [OnAdMetadataChangedListener](https://developers.google.com/android/reference/com/google/android/gms/ads/rewarded/OnAdMetadataChangedListener). So you need to set up a special VAST tag in the creative.

``` js
https://cdn.jsdelivr.net/npm/prebid-universal-creative/dist/prebid-mobile-rewarded-vast.xml
```

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-creative-rewarded.png" alt="Pipeline Screenshot" align="center">

If GAM Event Handler receives the tag's info it will render the winning bid. Otherwise the control will be passed to the GAM Ad View and it will render the received creative.

<!---

Native ads are not released yet.

### Native: Unified Ad

Click on **ADD CREATIVE** -> **New Creative** -> **Native Format** -> **Select Template...** and chose one of the predefined system templates.

Fill the template with any default values but put the **obligotary** value for the Body - **isPrebid**. This value will show Prebid SDK that it should  render the ad from the winning bid.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-creative-unified-ad.png" alt="Create Native Ad Screenshot" align="center">

### Native: Custom Template

First need to create custom Native Format. For this go to **Delivery** -> **Native** -> **Create Native Ad** -> **Android & iOS app code**. At the page for the new ad format click on **ADD VARIABLE** and create a special text entry with name **isPrebid** and default value **1**.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-creative-custom-template-format-variable.png" alt="Create Native Ad Screenshot" align="center">

This variable will show Prebid SDK that it should render the ad from the winning bid. The final custom format should look like this:

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-creative-custom-template-format.png" alt="Create Native Ad Screenshot" align="center">

Now need to create a Creative based on this Native Ad Format. Click on **ADD CREATIVE** -> **New Creative** -> **Native Format** -> **Select Template...** and choose the newly created format.

Fill all needed fields for the new creative and make sure that variable **isPrebid** is present in the form:

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-creative-custom-template.png" alt="Create Native Ad Screenshot" align="center">

### Native Styles

#### Step 1: Create a native ad

Go to `Google Ad Manager`, select `Delivery` > `Native`. Click `Create Native Ad`.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-create-native-ad.png" alt="Create Native Ad Screenshot" align="center">

Select the `HTML & CSS editor` option.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-ways-to-create-native-ad.png" alt="Ways to create Native Ad Screenshot" align="center">

#### Step 2: Define ad settings

For the Ad Size you can specify a specific size for the ad unit or specify the `fluid` size.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-ad-settings.png" alt="Define Native Ad settings Screenshot" align="center">

#### Step 3: Style your native ad

You can add HTML and CSS to define your native ad template.

<img src="/assets/images/prebid-mobile/modules/rendering/order-gam-style-native-ad.png" alt="Style Native Ad Screenshot" align="center">

Example HTML:

``` html
<div class="sponsored-post">
  <div class="thumbnail">
<img src="hb_native_icon" alt="hb_native_icon" width="50" height="50"></div>
  <div class="content">
    <h1><p>hb_native_title</p></h1>
    <p>hb_native_body</p>
<a target="_blank" href="hb_native_linkurl" class="pb-click">hb_native_cta</a>
    <div class="attribution">hb_native_brand</div>
  </div>
<img src="hb_native_image" alt="hb_native_image" width="320" height="50">
</div>
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-trk.js"></script>
<script>
  let pbNativeTagData = {};
  pbNativeTagData.pubUrl = "%%PATTERN:url%%";
  pbNativeTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;


  // if not DFP, use these params
  pbNativeTagData.adId = "%%PATTERN:hb_adid%%";
  pbNativeTagData.cacheHost = "%%PATTERN:hb_cache_host%%";
  pbNativeTagData.cachePath = "%%PATTERN:hb_cache_path%%";
  pbNativeTagData.uuid = "%%PATTERN:hb_cache_id%%";
  pbNativeTagData.env = "%%PATTERN:hb_env%%";
  pbNativeTagData.hbPb = "%%PATTERN:hb_pb%%";

  window.pbNativeTag.startTrackers(pbNativeTagData);
</script>
```

Example CSS:

``` css
.sponsored-post {
    background-color: #fffdeb;
    font-family: sans-serif;
}

.content {
    overflow: hidden;
}

.thumbnail {
    width: 50px;
    height: 50px;
    float: left;
    margin: 0 20px 10px 0;
    background-size: cover;
}

h1 {
    font-size: 18px;
    margin: 0;
}

a {
    color: #0086b3;
    text-decoration: none;
}

p {
    font-size: 16px;
    color: #000;
    margin: 10px 0 10px 0;
}

.attribution {
    color: #000;
    font-size: 9px;
    font-weight: bold;
    display: inline-block;
    letter-spacing: 2px;
    background-color: #ffd724;
    border-radius: 2px;
    padding: 4px;
}
```
-->