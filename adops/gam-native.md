---
layout: page_v2
title: Setting up Prebid Native in Google Ad Manager
head_title: Setting up Prebid Native in Google Ad Manager
description: Setting up Prebid Native in Google Ad Manager
sidebarType: 3
---

# Setting up Prebid Native in Google Ad Manager
{: .no_toc}

This page describes how to set up native creatives in Google Ad Manager for use with Prebid.js.

For more information about Google Ad Manager native ad setup, see the [Google Ad Manager native ads documentation](https://support.google.com/admanager/answer/6366845).

{% capture version2 %}
This document replaces the [original documentation](/adops/setting-up-prebid-native-in-dfp.html) that described how to set up Prebid.js native for GAM. That documentation is still valid, but the approach described here is better in every way, so we recommend that all new and revised implementations follow this approach. Here are the key differences between the original approach and the preferred approach described in this document:
{::nomarkdown}
<ul>
<li>The macro format is different: instead of using AdServer-defined macros, Prebid.js now has its own macro format.
<li>Targeting variables aren't sent from Prebid.js to the AdServer. Rather, they're queried at display time.
<li>A different rendering library is used.
</ol>
{:/}
{% endcapture %}
{% include alerts/alert_important.html content=version2 %}

* TOC
{:toc}

{: .alert.alert-info :}
Manually configuring GAM for Prebid can be a fair amount of work.
Consider using our official command line tool, [Prebid Line Item Manager](/tools/line-item-manager.html), to create the setup. Using this tool may save you time and help you avoid mistakes.


## 1. Create a native ad

From Google Ad Manager, select **Delivery > Native**. Click **Create Native Ad**.

![native delivery](/assets/images/ad-ops/dfp-native/create_prebid_native.png){: .pb-md-img :}

Select the **HTML & CSS editor** option.

![HTML editor option](/assets/images/ad-ops/dfp-native/prebid_native_html_option.png){: .pb-md-img :}

## 2. Define settings for native format

For **Ad size** you can select a specific size for the ad unit or specify the "fluid" size.  In this case we'll go with **Fluid**.

Under **Custom format**, select **New format**. (If you’ve already created an ad unit with the format you want, you can select Existing format and select the format to apply to this ad unit.)

Every format needs at least one "variable". In this example we've added **title** as a variable. Don't worry, you can add more later. Or not. Either way, GAM requires at least one variable in order to move on to the next step.

![native adunit settings](/assets/images/ad-ops/dfp-native/gam-native-format.png){: .pb-md-img :}

When done, click **Continue**.

## 3. Style your native ad

Next, add the HTML and CSS to define your native ad template. To allow for trackers, titles, images, and other assets within a Prebid native creative template, you’ll need to include a CDN-hosted script in the HTML.

![native ad styling](/assets/images/ad-ops/dfp-native/gam-native-template.png){: .pb-xlg-img :}

{: .alert.alert-warning :}
Any link that needs to fire a click tracker must include `class='pb-click'`.

If this creative is served, it will fire impression trackers on load. Clicking the link will fire the click tracker and the link will work as normal, in this case going to the `hb_native_linkurl` destination.

The creative template HTML will depend on which of the three scenarios you're implementing, as described in the [Native Implementation Guide](/prebid/native-implementation.html). You can choose to manage the native template:

- in GAM ([section 3.1](/adops/gam-native.html#31-managing-the-native-template-in-gam) below)
- in the Prebid.js AdUnit ([section 3.2](/adops/gam-native.html#32-managing-the-native-template-outside-of-gam) below)
- in a separate JavaScript file ([section 3.2](/adops/gam-native.html#32-managing-the-native-template-outside-of-gam) below)

### 3.1. Managing the native template in GAM

There are three key aspects of the native template:

1. Build the creative with special Prebid.js macros, e.g. `##hb_native_assetname##`. See the appendix for an exhaustive list of assets and macros. Note that macros can be placed in the body (HTML) and/or head (CSS) of the native creative.
2. Load the Prebid.js native rendering code. You may utilize the jsdelivr version of native-render.js or host your own copy. If you use the version hosted on jsdelivr, make sure to declare jsdelivr as an ad technology provider in GAM. Admin → EU User Consent → Declare ad technology providers
3. Invoke the Prebid.js native rendering function with an object containing the following attributes:
    - adid - used to identify which Prebid.js creative holds the appropriate native assets
    - pubUrl - the URL of the page, which is needed for the HTML postmessage call
    - requestAllAssets - tells the renderer to get all the native assets from Prebid.js.

Example creative HTML:
```
<div class="sponsored-post">
  <div class="thumbnail" style="background-image: url(##hb_native_image##);"></div>
  <div class="content">
    <h1><a href="%%CLICK_URL_UNESC%%##hb_native_linkurl##" target="_blank" class="pb-click">##hb_native_title##</a></h1>
    <p>##hb_native_body##</p>
    <div class="attribution">##hb_native_brand##</div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-render.js"></script>
<script>
    var pbNativeTagData = {};
    pbNativeTagData.pubUrl = "%%PATTERN:url%%";
    pbNativeTagData.adId = "%%PATTERN:hb_adid%%";
    // if you're using 'Send All Bids' mode, you should use %%PATTERN:hb_adid_BIDDER%%
    pbNativeTagData.requestAllAssets = true;
    window.pbNativeTag.renderNativeAd(pbNativeTagData);
</script>
```

{: .alert.alert-warning :}
When using `Send All Bids` you should update `pbNativeTagData.adId = "%%PATTERN:hb_adid_biddercode%%";` for each bidder’s creative

Example CSS:
```
.sponsored-post {
    background-color: #fffdeb;
    font-family: sans-serif;
    padding: 10px 20px 10px 20px;
}

.content {
    overflow: hidden;
}

.thumbnail {
    width: 120px;
    height: 100px;
    float: left;
    margin: 0 20px 10px 0;
    background-image: url(##native_image##);
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
    color: #444;
    margin: 10px 0 10px 0;
}

.attribution {
    color: #fff;
    font-size: 9px;
    font-weight: bold;
    display: inline-block;
    letter-spacing: 2px;
    background-color: #ffd724;
    border-radius: 2px;
    padding: 4px;
}
```

### 3.2. Managing the native template outside of GAM

The GAM creative is identical whether the template is defined in the AdUnit or the external render JavaScript. There are two key aspects of the native creative in this scenario:

1. Load the Prebid.js native rendering code. You may utilize the jsdelivr version of native-render.js or host your own copy. If you use the version hosted on jsdelivr, make sure to declare jsdelivr as an ad technology provider in GAM. Admin → EU User Consent → Declare ad technology providers
2. Invoke the Prebid.js native rendering function with an object containing the following attributes:
    - adid - used to identify which Prebid.js creative holds the appropriate native assets
    - pubUrl - the URL of the page, which is needed for the HTML postmessage call
    - requestAllAssets - tells the renderer to get all the native assets from Prebid.js.

Example creative HTML:
```
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-render.js"></script>
<script>
    var pbNativeTagData = {};
    pbNativeTagData.pubUrl = "%%PATTERN:url%%";
    pbNativeTagData.adId = "%%PATTERN:hb_adid%%";
    // if you're using 'Send All Bids' mode, you should use %%PATTERN:hb_adid_BIDDER%%
    pbNativeTagData.requestAllAssets = true;
    window.pbNativeTag.renderNativeAd(pbNativeTagData);
</script>
```

{: .alert.alert-warning :}
When using `Send All Bids` you should update `pbNativeTagData.adId = "%%PATTERN:hb_adid_biddercode%%";` for each bidder’s creative

The example CSS in section 3.1 applies here as well.


## 4. Create new native order and line items

1. Create a new order as usual.
2. Create a new line item as usual, selecting Ad type "Display".
3. Add your native format in the "Expected creatives" section.


![create a native order and line item](/assets/images/ad-ops/dfp-native/gam-line-item.png){: .pb-md-img :}

{:start="4"}
4. For targeting, set inventory targeting and key-value targeting on `hb_pb` or `hb_pb_BIDDER` corresponding to the line item’s CPM.
5. Save the line item


## 5. Create a new native creative

1. After saving the line item, click on **Creatives** and then **New creative**.

![create a new native creative](/assets/images/ad-ops/dfp-native/gam-new-creative.png){: .pb-md-img :}

{:start="2"}
2. On the creative type screen choose **Native Format** and select the format you created above.

![Native Format](/assets/images/ad-ops/dfp-native/gam-creative-type.png){: .pb-md-img :}

{:start="3"}
3. Under **Settings**, enter a Name for your creative. Enter any value into the **Click-through URL** field; this value will be overwritten by the native asset values. Also, if you operate in Europe and are using the jsdelivr-hosted native-render.js, make sure you set jsdelivr as your ad technology provider.

![Native Creative](/assets/images/ad-ops/dfp-native/gam-new-creative-part2.png){: .pb-md-img :}

{:start="4"}
4. Click **Save**.
5. Review the order, line item, and creative.
6. Approve the order as needed.

## Further Reading

- [Prebid Native Format](/formats/native.html)
- [Prebid Native Implementation Guide](/prebid/native-implementation.html)
