---
layout: page_v2
title: Setup Native Ads
head_title: Step by step guide for Native Ad Setup
description: Setting up Native ads in both Google Ad Manager and MoPub.
sidebarType: 3
---

# Set Up Native

Prebid Mobile enables publishers to display native ads within their apps. This page provides instructions for setting up ad ops for both Google Ad Manager and MoPub.


## Google Ad Manager

The following instructions are for setting up a Native ad with HTML and CSS. For more detailed information refer to the [Google Ad Manager documentation.](https://support.google.com/admanager/answer/7661907)

1. Sign in to your Google Ad Manager account.
2. Click Delivery > Native.
3. Click New Native Ad.
4. Click Select in the "HTML & CSS editor" box. The *Define ad settings* page will appear.

      a. Select an ad size of `fluid`. With the Fluid size, Ad Manager will automatically size the ad to match available space.  
      b. Select an existing format or create a new one. (Formats are the variables that make up the content of your ad.)  
      c. Style your ad with HTML and CSS. (See code sample below)  
      Add your styles in the CSS tab in Ad Manager.

      A native ad is made up of assets, image URL, titles, descriptions, icons, etc. that are plugged into the template we've just created. The template includes placeholder macros for those assets, and may be styled to match the form of the surrounding page.

      At a high level, Prebid Mobile's support for native ads works by requesting native demand from bidder adapters. The native ad responses get placed on specific keys that are sent into your ad server.  

      The `native-trk.js` linked in the code example below will find `hb_native_keys` and replace them with native assets. For more detailed information and a list of available keys see our documentation that explains [how Native ads work](/dev-docs/show-native-ads.html#how-native-ads-work).  

      d. Set the targeting to default and save.

5. [Create a line item](/prebid-mobile/adops-line-item-setup-dfp.html) targeting this ad unit and a `hb_pb price`, for expected creatives, put in the ad format in step 4.b.
6. Create a native creative using the native styles (and the ad format created/used with the native styles), associating it with the line item

<br>
**Example**
<br>
```
<div class="sponsored-post">
  <div class="thumbnail"></div>
  <div class="content" class="pb-click">
    <h1><a target="_blank" href="hb_native_linkurl" class="pb-click">hb_native_title</a></h1>
    <p>hb_native_body</p>
    <div class="attribution">hb_native_brand</div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-trk.js"></script>
<script>
  var pbNativeTagData = {};
  pbNativeTagData.uuid = "%%PATTERN:hb_cache_id%%";
  pbNativeTagData.env = "mobile-app";
  window.pbNativeTag.startTrackers(pbNativeTagData);
</script>
```

## MoPub

The instructions below describe how to add a Native ad with the MoPub SDK. For more detailed information review the MoPub Native ad documentation for [iOS](https://developers.mopub.com/publishers/ios/native/) and [Android](https://developers.mopub.com/publishers/android/native/).  

  1. Create a `Medium rectangle` Ad Unit
  2. Create a non-guaranteed line item targeting this ad unit and a `hb_pb price`
  3. Create a creative with 300x250 Medium Rectangle format, choose HTML and put in the following code:

```html
<div class="sponsored-post">
    <div class="thumbnail"></div>
    <div class="content" class="pb-click">
      <h1><a target="_blank" href="hb_native_linkurl" class="pb-click">hb_native_title</a></h1>
      <p>hb_native_body</p>
      <div class="attribution">hb_native_brand</div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-trk.js"></script>
  <script>
  var pbNativeTagData = {};
  pbNativeTagData.uuid = "%%PATTERN:hb_cache_id%%";
  pbNativeTagData.env = "mobile-app";
  window.pbNativeTag.startTrackers(pbNativeTagData);
  </script>
```

{% capture noteAlert %}
Note not to check Mraid ad.z
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

## Further Reading
- [Setting Up Line Items for Google Ad Manager]({{site.baseurl}}/prebid-mobile/adops-line-item-setup-dfp.html)
- [Setting Up Line Items for MoPub]({{site.baseurl}}/prebid-mobile/adops-line-item-setup-mopub.html)
- [How Native Ads Work](/dev-docs/show-native-ads.html#how-native-ads-work)
